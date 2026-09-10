// Mini landing page copy — the ONLY strings that reach the HTML at /quiz.
//
// This module has no imports and must never gain one (`landing.test.ts` fails
// the build if it does). That is what keeps `data.ts` — every question, beat,
// video caption and the evidence footer that names The Menopause Society — out
// of the initial bundle and out of the server-rendered markup. Blueprint §9:
// server HTML stays neutral, so `curl /quiz` finds no condition term.
//
// The below-the-fold block ("What you'll leave with", the Starting Picture
// still, the evidence footer) is deliberately NOT here. It renders client-side
// after hydration, from data.ts, because the evidence footer names a condition
// body. See LP_BELOW in data.ts.

/**
 * Headline by opaque `?a=` variant (blueprint §4 LP; decision §12.9). Six
 * territories, keyed to the ad creative she clicked. An integer, never a word —
 * no health term may appear in a query string.
 */
export const LP_HEADLINES: Record<number, string> = {
  // going mad (the locked line)
  1: "You’re not going mad. Tracking alone was never enough.",
  // fog / word-finding
  2: "You used to hold a room, a list, a plan. Now words hide.",
  // rage
  3: "A single email shouldn’t rearrange your whole day. Lately it does.",
  // doctor shrug
  4: "Fine labs. Fine tone. Empty hands.",
  // tracker broke
  5: "Your cycle changed. Your tracker didn’t.",
  // flat / spent
  6: "Not sad, exactly. Just flat. Spent.",
};

export const LP_VARIANT_DEFAULT = 1;

/** Clamp `?a=` to a real variant. Anything else falls back to 1, silently. */
export function landingVariant(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(value ?? "", 10);
  return Object.hasOwn(LP_HEADLINES, n) ? n : LP_VARIANT_DEFAULT;
}

export function landingHeadline(variant: number): string {
  return LP_HEADLINES[variant] ?? LP_HEADLINES[LP_VARIANT_DEFAULT];
}

/** Identical for every variant. */
export const LANDING = {
  eyebrow: "YOUR STARTING PICTURE · ABOUT 4 MINUTES",
  sub: "Answer honestly, watch four short clips of how Rythma actually helps, and leave with your Starting Picture: what’s weighing on you most, what tracking alone couldn’t tell you, and the first thing worth trying.",
  /** Set in the serif italic, and the one string in the sub the guard allows. */
  subItalic: "Clarity, not a diagnosis.",
  cta: "Begin",
  underCta: "Free · Private · Continue on iPhone when you’re ready",
} as const;
