// Peri Score — computed client-side only. The number and band NEVER go to Meta
// (spec hard rule 4: standard events, zero custom parameters). The band is
// shown on the results screen; the number itself stays blurred behind a lock,
// because the app calculates the real score from her baseline check-in.

import { QUESTIONS, type SingleQuestion } from "./quiz-data";

export type Band = "early" | "moderate" | "significant";

export type ScoreResult = {
  /** Raw 0–22 score. Never sent anywhere. */
  score: number;
  /** The raw score normalized to 0–100 — the figure the gauge blurs. */
  display: number;
  band: Band;
  label: string;
  /** How full to draw the gauge ring, 0–1. Purely visual. */
  fill: number;
  symptomCount: number;
};

/** symptoms(12) + severity(3)×2 + cycle(3)×2 */
const MAX_SCORE = 12 + 3 * 2 + 3 * 2;

// "Building" rather than "Moderate shift": it's warmer, and it matches the
// scale printed on the results email, where the chip and the meter label have
// to be the same words. Changing one without the other means a woman reads
// "Building" in her inbox and "Moderate shift" on the web.
export const BAND_LABEL: Record<Band, string> = {
  early: "Early shift",
  moderate: "Building",
  significant: "Significant shift",
};

/** Position of a question's chosen option in its option list, or 0 if unanswered. */
function optionIndex(questionId: string, value: string | undefined): number {
  if (!value) return 0;
  const q = QUESTIONS.find((q) => q.id === questionId) as SingleQuestion | undefined;
  const i = q?.options.findIndex((o) => o.value === value) ?? -1;
  return i < 0 ? 0 : i;
}

/**
 * score = symptomCount(0–12) + severityIndex(0–3)×2 + cycleIndex(0–3)×2
 *   0–6 Early · 7–13 Moderate · 14+ Significant
 * Tunable — the bands are what she sees, not the formula.
 */
export function computeScore(
  answers: Record<string, string>,
  symptoms: string[],
): ScoreResult {
  const symptomCount = symptoms.length;
  const severityIndex = optionIndex("severity", answers.severity);
  const cycleIndex = optionIndex("cycle", answers.cycle);

  const score = symptomCount + severityIndex * 2 + cycleIndex * 2;

  const band: Band = score >= 14 ? "significant" : score >= 7 ? "moderate" : "early";
  const display = Math.round((score / MAX_SCORE) * 100);
  // The ring tracks the number exactly. It used to be a fixed value per band,
  // which was fine while the number was hidden — now that she can read it, a
  // ring at 62% next to a "50" is just visibly wrong. Floored so a very low
  // score still draws something rather than an empty circle.
  const fill = Math.max(display / 100, 0.06);

  return {
    score,
    display,
    band,
    label: BAND_LABEL[band],
    fill,
    symptomCount,
  };
}
