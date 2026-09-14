// Fails the build when Stripe charges something the funnel does not say.
//
// Build brief rule 4: prices, trial length and plan names come from
// `src/lib/sp/pricing.ts` only. That makes pricing.ts the system of record for
// what she is TOLD; Stripe remains the system of record for what she is
// CHARGED. This script is what stops the two drifting apart silently, which is
// the one pricing bug a customer notices and a test never catches.
//
// Skips when STRIPE_SECRET_KEY or the price ids are unset, so CI and a
// developer without the key still build. It only ever reads.

const key = process.env.STRIPE_SECRET_KEY;
const ids = { annual: process.env.STRIPE_PRICE_ANNUAL, monthly: process.env.STRIPE_PRICE_MONTHLY };

// Mirrors EXPECTED_PRICES in src/lib/sp/stripe.ts and the strings in
// pricing.ts. Kept as literals so this script needs no TypeScript loader.
const expected = {
  annual: { amount: 5999, interval: "year", trialDays: 3 },
  monthly: { amount: 999, interval: "month", trialDays: 0 },
};

if (!key) {
  console.log("check-stripe-prices: STRIPE_SECRET_KEY unset — skipping");
  process.exit(0);
}
if (!ids.annual || !ids.monthly) {
  console.log("check-stripe-prices: price ids unset — skipping");
  process.exit(0);
}

const problems = [];

for (const [plan, id] of Object.entries(ids)) {
  const res = await fetch(`https://api.stripe.com/v1/prices/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    problems.push(`${plan}: Stripe returned ${res.status} for price ${id}`);
    continue;
  }
  const price = await res.json();
  const want = expected[plan];

  if (price.unit_amount !== want.amount) {
    problems.push(`${plan}: Stripe charges ${price.unit_amount}, the funnel says ${want.amount}`);
  }
  if (price.recurring?.interval !== want.interval) {
    problems.push(`${plan}: Stripe bills per ${price.recurring?.interval}, the funnel says per ${want.interval}`);
  }
  if (price.currency !== "usd") {
    problems.push(`${plan}: Stripe currency is ${price.currency}, the funnel assumes usd`);
  }
  // The trial lives on the subscription, not the price, so it is set by
  // /api/sp/checkout from pricing.ts — there is nothing on Stripe's price
  // object to compare it against. Reported so the number is visible in a build
  // log next to the amounts it belongs with.
  console.log(
    `check-stripe-prices: ${plan} ${price.unit_amount} ${price.currency}/${price.recurring?.interval}, trial ${want.trialDays}d`,
  );
}

if (problems.length) {
  console.error("\ncheck-stripe-prices: Stripe and the funnel disagree\n");
  for (const p of problems) console.error(`  · ${p}`);
  console.error("\nFix pricing.ts or the Stripe price, then build again.\n");
  process.exit(1);
}

console.log("check-stripe-prices: Stripe agrees with pricing.ts");
