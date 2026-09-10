import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { planValue, stripeOrNull } from "@/lib/sp/stripe";
import { markProfilePaid } from "@/lib/sp/profile-api";
import { ProfileApiError } from "@/lib/sp/profile-contract";
import { rememberCode } from "@/lib/sp/code-store";
import { manageUrl } from "@/lib/sp/manage-link";
import { CODE_EMAIL_SUBJECT, codeEmailHtml } from "@/lib/sp/code-email";
import type { PlanId } from "@/lib/sp/pricing";

// The one place a purchase becomes real.
//
// On `checkout.session.completed`: mark the profile paid (which mints her
// 6-digit code), remember the code for screen 31 to poll, send *You're in.
// Here's your code*, and fire the purchase event to Meta's Conversions API.
// On subscription and invoice events: mirror to PostHog so churn and dunning
// are visible without a Stripe login.
//
// PURCHASE EVENTS ARE SERVER-SIDE ONLY (blueprint §9, build brief rule 5). This
// route is the only thing in the codebase that may fire StartTrial or Purchase,
// and it sends value and currency and nothing else — no answers, no symptoms,
// no email in the payload beyond the hashed identifier Meta needs for matching.
// This is also the first real purchase signal Meta has had from Rythma since
// July, which is why it is worth getting exactly right.
//
// Idempotent by Stripe event id: Stripe retries, and a retry must not send a
// second email or a second conversion.

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Rythma <hello@rythma.co>";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const META_PIXEL_ID = process.env.META_PIXEL_ID || "862926626501765";
const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_CAPI_TEST_CODE = process.env.META_CAPI_TEST_EVENT_CODE;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = "https://us.i.posthog.com";

/** Stripe retries; these are the ids already handled. */
const handled = new Set<string>();
const HANDLED_CAP = 5000;

function remember(eventId: string): boolean {
  if (handled.has(eventId)) return false;
  if (handled.size >= HANDLED_CAP) handled.clear();
  handled.add(eventId);
  return true;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * PostHog from the server. The browser SDK is not available here and the
 * `/ingest` proxy only exists for the browser, so this posts to the capture
 * endpoint directly. Best effort, always.
 */
async function phServer(event: string, properties: Record<string, unknown>): Promise<void> {
  if (!POSTHOG_KEY) return;
  try {
    await fetch(`${POSTHOG_HOST}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        // Stripe ids, never her email and never an answer (blueprint §10).
        distinct_id: String(properties.rythma_id ?? properties.stripe_customer_id ?? "stripe"),
        properties: { ...properties, section: "quiz" },
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error("sp/webhook: PostHog mirror failed", e);
  }
}

/**
 * `StartTrial` when the plan carries a trial, `Purchase` when it does not.
 * Standard event, `value` and `currency` only.
 */
async function sendCapiPurchase(args: {
  plan: PlanId;
  email?: string | null;
  eventId: string;
  hasTrial: boolean;
}): Promise<void> {
  if (!META_CAPI_TOKEN) return;
  const { value, currency } = planValue(args.plan);

  const body = {
    data: [
      {
        event_name: args.hasTrial ? "StartTrial" : "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: args.eventId,
        action_source: "website",
        event_source_url: "https://rythma.co/quiz",
        user_data: args.email ? { em: [sha256(args.email.trim().toLowerCase())] } : {},
        custom_data: { value, currency },
      },
    ],
    ...(META_CAPI_TEST_CODE ? { test_event_code: META_CAPI_TEST_CODE } : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_CAPI_TOKEN)}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (!res.ok) {
    console.error("sp/webhook: CAPI rejected the purchase", res.status, await res.text());
  }
}

function planFor(session: Stripe.Checkout.Session): PlanId {
  // A trial on the subscription means annual; monthly has none. Read from the
  // session rather than trusted from anywhere else.
  const trialEnd = (session as { subscription_details?: { trial_end?: number } }).subscription_details?.trial_end;
  return trialEnd ? "annual" : session.amount_total && session.amount_total >= 5999 ? "annual" : "monthly";
}

async function onCheckoutCompleted(
  stripe: Stripe,
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
  origin: string,
): Promise<void> {
  const rythmaId = session.client_reference_id;
  if (!rythmaId) {
    // Nothing to hand to the app. Loud, because it means someone paid and the
    // handoff cannot complete — support has to fix it by hand.
    console.error("sp/webhook: PAID SESSION WITH NO rythma_id", session.id);
    return;
  }

  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

  // The trial end and the plan come from the subscription itself.
  let trialEndsAt: string | null = null;
  let plan: PlanId = planFor(session);
  if (subscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      trialEndsAt = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
      const interval = sub.items.data[0]?.price?.recurring?.interval;
      if (interval === "year") plan = "annual";
      else if (interval === "month") plan = "monthly";
    } catch (e) {
      console.error("sp/webhook: could not read the subscription", e);
    }
  }

  // 1) The profile. Idempotent per subscription id, so a retry returns the
  //    same code and the same token.
  let code: string;
  let linkToken: string;
  try {
    const paid = await markProfilePaid({
      rythma_id: rythmaId,
      plan,
      stripe_customer_id: customerId ?? "",
      stripe_subscription_id: subscriptionId ?? "",
      trial_ends_at: trialEndsAt,
      manage_url: manageUrl(origin, rythmaId),
    });
    code = paid.code;
    linkToken = paid.link_token;
  } catch (e) {
    const detail = e instanceof ProfileApiError ? { status: e.status, ...e.body } : e;
    console.error("sp/webhook: PAID BUT NOT RECORDED", rythmaId, detail);
    // Rethrow: a non-2xx makes Stripe retry, which is exactly what should
    // happen — she has paid and the app cannot yet see it.
    throw e;
  }

  // 2) Hand the code to screen 31's poll.
  rememberCode(rythmaId, {
    code,
    plan,
    trialEndsAt,
    ...(customerId ? { stripeCustomerId: customerId } : {}),
  });

  // 3) Her code email. This is the deferred deep link; Apple offers no other.
  const email = session.customer_details?.email ?? session.customer_email ?? null;
  if (email) {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: CODE_EMAIL_SUBJECT,
      html: codeEmailHtml({
        code,
        ...(linkToken ? { openUrl: `${origin}/open?t=${encodeURIComponent(linkToken)}` } : {}),
        appStoreUrl: `${origin}/app`,
        manageUrl: manageUrl(origin, rythmaId),
        trialEndsAt: trialEndsAt
          ? new Date(trialEndsAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : null,
      }),
    });
    if (error) console.error("sp/webhook: code email failed", error);
  } else {
    console.error("sp/webhook: no email on a completed session", session.id);
  }

  // 4) Meta, server-side, value and currency only.
  try {
    await sendCapiPurchase({
      plan,
      email,
      eventId: event.id,
      hasTrial: Boolean(trialEndsAt),
    });
  } catch (e) {
    console.error("sp/webhook: CAPI send failed", e);
  }

  // 5) PostHog.
  await phServer("web_quiz_checkout_completed", {
    rythma_id: rythmaId,
    plan,
    payment_method: session.payment_method_types?.[0] ?? "card",
    trial: Boolean(trialEndsAt),
  });
}

export async function POST(request: Request) {
  const stripe = stripeOrNull();
  if (!stripe || !WEBHOOK_SECRET) {
    console.error("sp/webhook: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "unsigned" }, { status: 400 });

  // The raw body, not the parsed one: the signature covers the exact bytes.
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, WEBHOOK_SECRET);
  } catch (e) {
    console.error("sp/webhook: signature verification failed", e);
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (!remember(event.id)) {
    // Already handled. 200, so Stripe stops retrying.
    return NextResponse.json({ received: true, duplicate: true });
  }

  const origin = request.headers.get("origin") ?? "https://rythma.co";

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutCompleted(stripe, event, event.data.object as Stripe.Checkout.Session, origin);
        break;

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await phServer("web_subscription_updated", {
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
          status: sub.status,
          cancel_at_period_end: sub.cancel_at_period_end,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await phServer("web_subscription_cancelled", {
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await phServer("web_invoice_payment_failed", {
          stripe_customer_id: typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id,
        });
        break;
      }

      default:
        // Everything else is noise; acknowledge so Stripe stops sending it.
        break;
    }
  } catch (error) {
    // Un-remember, so Stripe's retry is allowed to do the work again.
    handled.delete(event.id);
    console.error("sp/webhook: handler failed", event.type, error);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
