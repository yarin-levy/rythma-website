// Starting Picture funnel — the copy guard.
//
// Blueprint §1 and grok handout §8 are the law: the web never shows a rating, a
// star, an outcome statistic, or claim language. The build brief fixes the
// banned-substring list; `reveal.test.ts` runs every string produced by
// `data.ts` and `reveal.ts` through it.
//
// The list is a substring scan, case-insensitive, because that is the only kind
// of check that cannot be argued with. That bluntness has a cost: four of the
// blueprint's own safe-harbour lines trip it — the negated disclaimers that make
// the funnel compliant in the first place ("Clarity, not a diagnosis"), the
// literal handoff instruction on screen 31, and the annual plan's discount. They
// live in ALLOWED below, each spelled out in full, and the test asserts every
// entry is still in use, so the allowlist cannot rot into a loophole.

/** Case-insensitive. A hit is a bug unless the surrounding string is ALLOWED. */
export const BANNED = [
  "App Store",
  "review",
  "rating",
  "★",
  "4.9",
  "%",
  "cure",
  "treat",
  "reduce",
  "fix",
  "clinically",
  "diagnos",
] as const;

/**
 * Exact strings permitted to contain a banned substring, with the reason.
 * Verbatim from the blueprint — nothing here was written by the builder.
 */
export const ALLOWED: readonly string[] = [
  // The recurring compliance footer. Banning "diagnos" would delete the line
  // whose whole job is to say we do not diagnose (blueprint §1, §4 screens 25/LP).
  "Clarity, not a diagnosis.",
  // Screen 8: the first place "perimenopause" appears, immediately hedged.
  "Recognized, not diagnosed. That word belongs to a doctor, ideally one holding a pattern.",
  // Screen 3: the under-38 soft note.
  "Changes this early are worth raising with a doctor. Not a diagnosis; a reason to be heard.",
  // Screen 31 step 1: she cannot install the app without being told where.
  "Get Rythma on the App Store",
  // Screen 29: a price discount on the annual row, not an outcome statistic.
  "SAVE 50%",
];

const ALLOWED_LOWER = ALLOWED.map((s) => s.toLowerCase());

/** The banned substrings present in `text`, ignoring exact ALLOWED strings. */
export function bannedHits(text: string): string[] {
  const lower = text.toLowerCase();
  if (ALLOWED_LOWER.includes(lower.trim())) return [];
  return BANNED.filter((word) => lower.includes(word.toLowerCase()));
}

/** True when `text` carries no banned substring. */
export function isClean(text: string): boolean {
  return bannedHits(text).length === 0;
}

/**
 * Every string reachable from `value`, depth-first. Used by the tests to walk
 * the whole of `data.ts` and every `buildStartingPicture` result.
 */
export function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) collectStrings(v, out);
  else if (value && typeof value === "object") for (const v of Object.values(value)) collectStrings(v, out);
  return out;
}
