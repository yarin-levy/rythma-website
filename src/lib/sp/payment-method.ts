import type Stripe from "stripe";

// §10's `payment_method` vocabulary for web_quiz_checkout_completed.

export type PaymentMethodLabel = "card" | "apple_pay" | "google_pay";

/**
 * What she actually paid with.
 *
 * Not `session.payment_method_types`: that is the list Stripe *offered*, and
 * Apple Pay never appears in it anyway, because Apple Pay and Google Pay are
 * wallets on a card. The wallet is on the payment method the subscription was
 * set up with, which is why the webhook retrieves the subscription with
 * `default_payment_method` expanded. Anything it cannot read is a card.
 */
export function paymentMethodLabel(
  pm: Pick<Stripe.PaymentMethod, "card"> | string | null | undefined,
): PaymentMethodLabel {
  if (!pm || typeof pm === "string") return "card";
  const wallet = pm.card?.wallet?.type;
  if (wallet === "apple_pay") return "apple_pay";
  if (wallet === "google_pay") return "google_pay";
  return "card";
}
