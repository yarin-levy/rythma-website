import { describe, expect, it } from "vitest";
import { EXPECTED_PRICES, planValue, priceId, stripeConfigured, trialDays } from "../stripe";
import { PRICING, TRIAL_DAYS } from "../pricing";
import { CHECKOUT, PLAN } from "../data";
import { checkoutPath } from "../checkout-path";

// Build brief rule 4: prices, trial length and plan names come from pricing.ts
// only. `scripts/check-stripe-prices.mjs` checks pricing.ts against Stripe in
// prebuild; these check that the numbers the code uses and the numbers the copy
// says are the same numbers, which is the half a live API call cannot see.

describe("the amounts the code sends match the amounts the copy promises", () => {
  it("annual: $59.99 a year, in cents", () => {
    expect(EXPECTED_PRICES.annual).toEqual({ amount: 5999, interval: "year" });
    expect(PRICING.annual.billed).toBe("$59.99/yr");
    expect(PRICING.annual.billedLong).toBe("$59.99/year");
    expect(PLAN.transparency).toContain("$59.99/year");
  });

  it("monthly: $9.99 a month, in cents", () => {
    expect(EXPECTED_PRICES.monthly).toEqual({ amount: 999, interval: "month" });
    expect(PRICING.monthly.price).toContain("$9.99/mo");
  });

  it("derives the monthly-equivalent framing from the annual amount", () => {
    const perMonth = EXPECTED_PRICES.annual.amount / 12 / 100;
    // $59.99/12 = $4.999…, framed as $5.00 — the blueprint's own rounding.
    expect(perMonth).toBeCloseTo(5, 1);
    expect(PRICING.annual.monthlyEquivalent).toBe("$5.00/mo");
  });

  it("sends value and currency that agree with the price", () => {
    expect(planValue("annual")).toEqual({ value: 59.99, currency: "USD" });
    expect(planValue("monthly")).toEqual({ value: 9.99, currency: "USD" });
  });
});

describe("the trial", () => {
  it("is on annual only, and is the one number in pricing.ts", () => {
    expect(trialDays("annual")).toBe(TRIAL_DAYS);
    expect(trialDays("monthly")).toBe(0);
    expect(TRIAL_DAYS).toBe(3);
  });

  it("is spoken as 3 days everywhere, and never as 7", () => {
    for (const line of [PLAN.annual.trial, PLAN.annual.cta, PLAN.transparency, CHECKOUT.planLine("annual")]) {
      expect(line, line).toContain("3");
      expect(line, line).not.toMatch(/\b7\b/);
    }
  });
});

describe("configuration degrades instead of crashing", () => {
  it("reports no key and no price ids when the env is empty", () => {
    expect(stripeConfigured()).toBe(false);
    expect(priceId("annual")).toBeNull();
    expect(priceId("monthly")).toBeNull();
  });
});

describe("the checkout path flag", () => {
  it("is A by default — Stripe on the web, the app unlocks", () => {
    expect(checkoutPath()).toBe("A");
  });
});
