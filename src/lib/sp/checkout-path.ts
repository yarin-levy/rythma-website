// Path A or Path B (blueprint §11, decision §12.1).
//
// A is the decision: Stripe on the web, the app unlocks. B swaps screens 30–31
// for a single App Store handoff and is kept compiling for the day counsel or
// Apple says otherwise — a one-flag revert rather than a rebuild.

export type CheckoutPath = "A" | "B";

export function checkoutPath(): CheckoutPath {
  return process.env.NEXT_PUBLIC_CHECKOUT_PATH === "B" ? "B" : "A";
}
