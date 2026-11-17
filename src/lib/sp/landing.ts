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
//
// ONE PAGE, ONE HEADLINE (Yarin, 2026-09-10, build brief rule 0). The six `?a=`
// ad variants of blueprint §4/§12.9 are gone: no param, no per-ad copy, and
// nothing in the URL for a headline to key off. If a headline test is wanted
// later it runs behind a PostHog flag on the page, never through the URL.

/** The locked headline. Territory: "going mad" (keyword bank #1, #2). */
export const LP_HEADLINE = "You’re not going mad. Tracking alone was never enough.";

export const LANDING = {
  eyebrow: "YOUR STARTING PICTURE · ABOUT 4 MINUTES",
  sub: "Answer honestly, watch four short clips of how Rythma actually helps, and leave with your Starting Picture: what’s weighing on you most, what tracking alone couldn’t tell you, and the first thing worth trying.",
  /** Set in the serif italic, and the one string in the sub the guard allows. */
  subItalic: "Clarity, not a diagnosis.",
  cta: "Begin",
  underCta: "Free · Private · Continue on iPhone when you’re ready",
} as const;
