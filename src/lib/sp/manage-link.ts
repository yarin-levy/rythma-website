// `https://rythma.co/manage?k=<signed rythma_id>` — what the app opens for
// Profile → Subscription → Manage on a Stripe member.
//
// The app handout's ledger D4 ruling: never hand the app a raw Stripe
// billing-portal session URL, because those expire in minutes and the app
// stores it for the life of the subscription. It gets this stable, signed link
// instead, and the route mints a fresh portal session on each tap.
//
// The signature is an HMAC of the rythma_id, so the link cannot be edited to
// open somebody else's billing portal. Same shape as lib/unsubscribe.ts.

import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.SP_MANAGE_SECRET || "";

function sign(rythmaId: string): string {
  return createHmac("sha256", SECRET).update(rythmaId).digest("hex").slice(0, 32);
}

export function manageSecretConfigured(): boolean {
  return SECRET.length > 0;
}

/** The `k` parameter: the id and its signature, so the route needs no lookup. */
export function manageKey(rythmaId: string): string {
  if (!SECRET) {
    console.warn("sp/manage: SP_MANAGE_SECRET is not set — links will not verify");
  }
  return `${rythmaId}.${sign(rythmaId)}`;
}

export function manageUrl(origin: string, rythmaId: string): string {
  return `${origin}/manage?k=${encodeURIComponent(manageKey(rythmaId))}`;
}

/** The rythma_id carried by a valid `k`, or null. */
export function verifyManageKey(key: string | null): string | null {
  if (!SECRET || !key) return null;
  const at = key.lastIndexOf(".");
  if (at <= 0) return null;
  const rythmaId = key.slice(0, at);
  const provided = key.slice(at + 1);
  const expected = sign(rythmaId);
  if (provided.length !== expected.length) return null;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected)) ? rythmaId : null;
  } catch {
    return null;
  }
}
