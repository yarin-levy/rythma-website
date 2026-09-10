import { NextResponse } from "next/server";
import { stripeOrNull } from "@/lib/sp/stripe";
import { verifyManageKey } from "@/lib/sp/manage-link";
import { recallCustomer } from "@/lib/sp/code-store";

// `GET /manage?k=<signed rythma_id>` — Profile → Subscription → **Manage** in
// the app, for a member who bought on the web.
//
// The app stores this link for the life of the subscription, so it has to be
// stable; a Stripe billing-portal session URL expires in minutes (app handout
// ledger D4). This route verifies the signature, then mints a fresh portal
// session on each tap and redirects.
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
    // The customer id was put here by the webhook. The contract gives the
    // website no profile read (see code-store.ts), so this is the same seam,
    // and it needs the same decision: a `web-profile-status` function returning
    // the customer id would make Manage exact instead of best-effort.
    const customerId = recallCustomer(rythmaId);
    if (!customerId) {
      console.error("sp/manage: no Stripe customer on that profile");
      return NextResponse.json({ error: "Manage is not available" }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${url.origin}/`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("sp/manage: could not open the portal", error);
    return NextResponse.json({ error: "Manage is not available" }, { status: 502 });
  }
}
