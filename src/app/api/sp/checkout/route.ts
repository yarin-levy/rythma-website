import { NextResponse } from "next/server";
import { priceId, stripeOrNull, trialDays } from "@/lib/sp/stripe";
import type { PlanId } from "@/lib/sp/pricing";

// Screen 30. Creates the embedded Checkout session the browser mounts.
//
// `ui_mode: "embedded"` keeps the form inside our own chrome, so the funnel
// never visibly leaves rythma.co at the moment she pays (blueprint §11).
//
// `payment_method_types` is deliberately NOT set: leaving it to Stripe is what
// makes Apple Pay and Google Pay appear, and on a phone that one tap moves
// conversion more than any copy on the screen. Setting it to ["card"] would
// silently remove them.

export async function POST(request: Request) {
  const stripe = stripeOrNull();
  if (!stripe) {
    console.error("sp/checkout: STRIPE_SECRET_KEY is not set");
    return NextResponse.json({ error: "Checkout is not available" }, { status: 503 });
  }

  try {
    const { plan, rythmaId, email } = (await request.json()) as {
      plan?: PlanId;
      rythmaId?: string;
      email?: string;
    };

    if (plan !== "annual" && plan !== "monthly") {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }
    // Without her profile key the webhook has nothing to mark paid, and the app
    // would have no way to recognise the purchase. Refuse rather than take money
    // we cannot hand over.
    if (!rythmaId) {
      console.error("sp/checkout: refused a session with no rythma_id");
      return NextResponse.json({ error: "Checkout is not available" }, { status: 400 });
    }

    const price = priceId(plan);
    if (!price) {
      console.error(`sp/checkout: no price id configured for ${plan}`);
      return NextResponse.json({ error: "Checkout is not available" }, { status: 503 });
    }

    const trial = trialDays(plan);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded",
      line_items: [{ price, quantity: 1 }],
      // This is the whole identity contract (blueprint §8.0): the webhook reads
      // it back off the session and marks that profile paid.
      client_reference_id: rythmaId,
      ...(email ? { customer_email: email } : {}),
      automatic_tax: { enabled: true },
      ...(trial > 0 ? { subscription_data: { trial_period_days: trial } } : {}),
      // The funnel handles success in place; it never navigates away.
      redirect_on_completion: "never",
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("sp/checkout: could not create a session", error);
    return NextResponse.json({ error: "Checkout is not available" }, { status: 502 });
  }
}
