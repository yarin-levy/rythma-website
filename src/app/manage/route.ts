import { NextResponse } from "next/server";
import { stripeOrNull } from "@/lib/sp/stripe";
import { verifyManageKey } from "@/lib/sp/manage-link";
import { profileStatus } from "@/lib/sp/profile-api";

// `GET /manage?k=<signed rythma_id>` — Profile → Subscription → **Manage** in
// the app, for a member who bought on the web.
//
// The app stores this link for the life of the subscription, so it has to be
// stable; a Stripe billing-portal session URL expires in minutes (app handout
// ledger D4). This route verifies the signature, then mints a fresh portal
// session on each tap and redirects.
//
// TWO LOOKUPS, AND WHY. `web-profile-status` answers "is this profile paid",
// which is the gate. It does not return the Stripe customer id (the ruled shape
// is `paid, plan, trial_ends_at, code, manage_url`), so the customer comes from
// Stripe itself: /api/sp/checkout tags every subscription with
// `metadata.rythma_id`, and this searches on it. No contract change needed.
// Stripe's search index is eventually consistent (about a minute), which is
// fine here — nobody taps Manage in the minute after paying.
//
// Opening a management page for a subscription she already holds is permitted
// under Apple 3.1.3(b). Selling is not, and this route sells nothing.

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rythmaId = verifyManageKey(url.searchParams.get("k"));
  if (!rythmaId) {
    return NextResponse.json({ error: "That link is not valid" }, { status: 400 });
  }

  const stripe = stripeOrNull();
  if (!stripe) {
    console.error("sp/manage: STRIPE_SECRET_KEY is not set");
    return NextResponse.json({ error: "Manage is not available" }, { status: 503 });
  }

  try {
    const status = await profileStatus(rythmaId);
    if (!status.paid) {
      return NextResponse.json({ error: "Manage is not available" }, { status: 404 });
    }

    const found = await stripe.subscriptions.search({
      query: `metadata['rythma_id']:'${rythmaId.replace(/'/g, "")}'`,
      limit: 1,
    });
    const sub = found.data[0];
    const customer = typeof sub?.customer === "string" ? sub.customer : sub?.customer?.id;
    if (!customer) {
      console.error("sp/manage: paid profile with no tagged Stripe subscription", rythmaId);
      return NextResponse.json({ error: "Manage is not available" }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${url.origin}/`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("sp/manage: could not open the portal", error);
    return NextResponse.json({ error: "Manage is not available" }, { status: 502 });
  }
}
