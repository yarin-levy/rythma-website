// The one place prices, plan names and the trial length exist.
//
// Blueprint §4 screen 29, build brief rule 4 and its M3 line.
//
// TRIAL_DAYS is 3, Yarin's decision 2026-09-10, which reverses blueprint §12.2
// and app handout §3.6 (both say 7, and both resolve the parity question the
// other way — the web moving to 3 matches the in-app paywall instead). Those
// two documents still read 7 and need updating in step; the funnel reads only
// this file, so nothing here disagrees with what Stripe charges. In M3 `scripts/check-stripe-prices.mjs` asserts these against the Stripe
// price objects in `prebuild`, so a price can never disagree with what Stripe
// actually charges. Until then this object is the only source the copy reads.

export const TRIAL_DAYS = 3;

export const PRICING = {
  annual: {
    plan: "annual" as const,
    /** How the annual price is framed: the monthly figure leads. */
    monthlyEquivalent: "$5.00/mo",
    billed: "$59.99/yr",
    billedLong: "$59.99/year",
    saveBadge: "SAVE 50%",
    trialDays: TRIAL_DAYS,
  },
  monthly: {
    plan: "monthly" as const,
    price: "$9.99/mo",
    trialDays: 0,
  },
} as const;

export type PlanId = (typeof PRICING)[keyof typeof PRICING]["plan"];
