// Where screen 31 gets the code from.
//
// THE GAP THIS FILLS, AND WHY IT IS FLAGGED
//
// The contract gives the website two calls: `web-profile-upsert` and
// `web-profile-paid`. `paid` returns the 6-digit code, and it is our Stripe
// webhook that calls it — server to server. Screen 31 then has to show that
// code to a browser that cannot call either function, and the contract has no
// read endpoint for the website. So the code has to be held somewhere between
// the webhook and her next poll.
//
// This is that somewhere, and today it is per-process memory. On one instance
// that is correct. Across Vercel's serverless instances it is not: the webhook
// and the poll can land on different ones, and the poll then finds nothing.
//
// Which is survivable, because it degrades into a path the blueprint already
// designed: after 30 seconds screen 31 stops polling and tells her the code is
// in her email, which the webhook has already sent. She is never blocked — she
// just types six digits from her inbox instead of reading them off the screen.
//
// Before real spend, one of these should replace it (Yarin's call, in the M3
// pull request):
//   1. Vercel KV — a `@vercel/kv` set with a 24h TTL, four lines here, no app
//      change. The code sits on our infrastructure for a day.
//   2. A `web-profile-status` edge function the website may call with its key,
//      returning `{ paid, code }` for a rythma_id. One small function on the
//      app side, and the code never leaves the app's project.
//
// (2) is the better shape — the code is a credential and belongs next to the
// profile that owns it — but (1) needs nobody else's time.

export type PaidCode = {
  code: string;
  plan: string;
  trialEndsAt: string | null;
  /** What `/manage` needs to mint a billing-portal session. */
  stripeCustomerId?: string;
};

const store = new Map<string, { value: PaidCode; expires: number }>();

/** Codes are single use and 24h — holding one longer than the app would is wrong. */
const TTL_MS = 24 * 60 * 60 * 1000;

function sweep() {
  const now = Date.now();
  for (const [key, entry] of store) if (entry.expires <= now) store.delete(key);
}

export function rememberCode(rythmaId: string, value: PaidCode): void {
  sweep();
  store.set(rythmaId, { value, expires: Date.now() + TTL_MS });
}

export function recallCode(rythmaId: string): PaidCode | null {
  sweep();
  return store.get(rythmaId)?.value ?? null;
}

/** The Stripe customer for a profile, for `/manage`. */
export function recallCustomer(rythmaId: string): string | null {
  return recallCode(rythmaId)?.stripeCustomerId ?? null;
}

/** Test seam. */
export function __resetCodeStore(): void {
  store.clear();
}
