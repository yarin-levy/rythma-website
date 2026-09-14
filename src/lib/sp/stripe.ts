// The server-side Stripe client, and the one place plan ↔ price mapping lives.
//
// Instantiated lazily. The build imports every route module to collect page
// data, so a client constructed at module load would throw during `next build`
// on any machine without STRIPE_SECRET_KEY — which is CI, and every developer
// who has not been given the key. `stripeOrNull()` returns null instead, and
// each route decides what that means.

import Stripe from "stripe";
import { PRICING, TRIAL_DAYS, type PlanId } from "./pricing";

let client: Stripe | null | undefined;

export function stripeOrNull(): Stripe | null {
  if (client !== undefined) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  client = key ? new Stripe(key) : null;
  return client;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** The price id for a plan, or null when it has not been configured yet. */
export function priceId(plan: PlanId): string | null {
  const id = plan === "annual" ? process.env.STRIPE_PRICE_ANNUAL : process.env.STRIPE_PRICE_MONTHLY;
  return id && id.length > 0 ? id : null;
}

/** Trial days for a plan. Annual carries the trial; monthly never does. */
export function trialDays(plan: PlanId): number {
  return plan === "annual" ? TRIAL_DAYS : 0;
}

/**
 * What the funnel's copy promises, in the units Stripe wants. Used only to
 * check Stripe against `pricing.ts` — never to set a price. Stripe is the
 * system of record for what is charged; `pricing.ts` is the system of record
 * for what she is told, and `scripts/check-stripe-prices.mjs` fails the build
 * when the two disagree.
 */
export const EXPECTED_PRICES: Record<PlanId, { amount: number; interval: "year" | "month" }> = {
  annual: { amount: 5999, interval: "year" },
  monthly: { amount: 999, interval: "month" },
};

/** The value/currency pair the CAPI purchase events carry, and nothing else. */
export function planValue(plan: PlanId): { value: number; currency: string } {
  return { value: EXPECTED_PRICES[plan].amount / 100, currency: "USD" };
}

export { PRICING, TRIAL_DAYS };
export type { PlanId };
