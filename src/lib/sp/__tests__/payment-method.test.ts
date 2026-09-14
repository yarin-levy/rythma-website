import { describe, expect, it } from "vitest";
import { paymentMethodLabel } from "../payment-method";

// §10: payment_method ∈ {card, apple_pay, google_pay}. Apple Pay and Google Pay
// are wallets on a card, so the only place they show up is card.wallet.type.
describe("what she paid with", () => {
  it.each([
    [{ card: { wallet: { type: "apple_pay" } } }, "apple_pay"],
    [{ card: { wallet: { type: "google_pay" } } }, "google_pay"],
    [{ card: { wallet: null } }, "card"],
    [{ card: { wallet: { type: "link" } } }, "card"],
    [{ card: null }, "card"],
  ])("%j → %s", (pm, label) => {
    expect(paymentMethodLabel(pm as never)).toBe(label);
  });

  it("calls an unexpanded id or nothing at all a card", () => {
    expect(paymentMethodLabel("pm_123")).toBe("card");
    expect(paymentMethodLabel(null)).toBe("card");
    expect(paymentMethodLabel(undefined)).toBe("card");
  });
});
