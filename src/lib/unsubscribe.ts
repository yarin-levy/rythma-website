// Signed unsubscribe links for the quiz nurture list.
//
// The quiz adds her to a Resend Audience, which makes her email marketing-
// adjacent: it needs a working opt-out, both because CAN-SPAM/GDPR require one
// and because spam complaints against rythma.co degrade deliverability for
// every email the domain sends.
//
// The token is an HMAC of the address, so a link can't be edited to unsubscribe
// someone else. It is not a secret-bearing token — it only authorizes removing
// that one address from the list.

import { createHmac, timingSafeEqual } from "node:crypto";

// A dedicated secret is preferred; the Resend key is a workable fallback so the
// feature is never silently disabled by a missing env var.
const SECRET = process.env.UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY || "";

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

export function signEmail(email: string): string {
  if (!SECRET) {
    console.warn(
      "unsubscribe: neither UNSUBSCRIBE_SECRET nor RESEND_API_KEY is set — links will not verify",
    );
  }
  return createHmac("sha256", SECRET).update(normalize(email)).digest("hex").slice(0, 32);
}

export function verifyEmail(email: string, token: string): boolean {
  if (!SECRET || !token) return false;
  const expected = signEmail(email);
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

export function unsubscribeUrl(origin: string, email: string): string {
  const params = new URLSearchParams({ e: normalize(email), t: signEmail(email) });
  return `${origin}/api/unsubscribe?${params.toString()}`;
}
