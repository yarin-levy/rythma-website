// Starting Picture funnel — every derivation, as pure functions.
//
// Nothing here invents data. Each output is either something she tapped, or a
// string chosen from a branch table in data.ts. That is the whole of blueprint
// §5: "copy and order only; never medical logic".
//
// The engine calls these; it holds no branching of its own, so the branch rules
// are unit-testable without a DOM.

import {
  ADVERTORIAL,
  BRIDGE_DURATION,
  BRIDGE_HOPE,
  BRIDGE_MOMENT,
  CANDIDATE_FALLBACK,
  CANDIDATE_FALLBACK_NOTE,
  CANDIDATE_RULES,
  CANDIDATE_TESTS,
  CARD_TO_PROOF_ROW,
  CYCLE_SUPPRESSED,
  ECHO_BY_MOMENT,
  MATTERS_TO_CARD,
  METHOD_ECHO_BY_DOCTOR,
  MOMENT_TO_QUOTE,
  PLAN_CARDS,
  QUOTES,
  RECOGNIZED,
  REFLECTION_TO_CARD,
  REVEAL,
  SYMPTOMS,
  SYMPTOM_CATEGORIES,
  UNKNOWNS,
  URGENCY_BY_INTENSITY,
  inputLinkLabel,
  question,
  symptom,
  symptomLinkLabel,
  type CandidateTestId,
  type Echo,
  type MultiQuestion,
  type PlanCardId,
  type ProofRowId,
  type SymptomCategoryId,
} from "./data";

/** Exactly the shape written to `web_quiz_profiles.answers` (blueprint §8.1). */
export type SpAnswers = {
  moment?: string;
  age?: string;
  how_long?: string;
  harder?: string[];
  intensity?: string;
  cycle?: string;
  no_period_reason?: string;
  inputs?: string[];
  tracking?: string;
  doctor?: string;
  reflection?: string;
  matters?: string;
  /** The app's 30 `Symptom` rawValues, in the order she tapped them. */
  symptoms?: string[];
};

export type PictureCategory = {
  id: SymptomCategoryId;
  label: string;
  symptoms: readonly { id: string; label: string }[];
};

export type StartingPicture = {
  /** Recognized symptoms. Every one of the 30 chips is one, so this is her count. */
  count: number;
  countLabel: string;
  countOf: string;
  /** Top two or three body systems by chip count. */
  categories: readonly PictureCategory[];
  topCategory?: SymptomCategoryId;
  /** Row 3, already ordered. */
  unknowns: readonly string[];
  candidate: { id: CandidateTestId; label: string; note?: string };
  planOrder: readonly PlanCardId[];
  proofOrder: readonly ProofRowId[];
};

const CANONICAL_CARDS: readonly PlanCardId[] = PLAN_CARDS.map((c) => c.id);

function clean(list: string[] | undefined): string[] {
  return (list ?? []).filter((v) => typeof v === "string" && v.length > 0);
}

/** Her chips, deduped and put back into the app's canonical order. */
function namedSymptoms(answers: SpAnswers): string[] {
  const picked = new Set(clean(answers.symptoms));
  return SYMPTOMS.filter((s) => picked.has(s.id)).map((s) => s.id);
}

/** Her everyday inputs, minus the "None of these" option. */
function realInputs(answers: SpAnswers): string[] {
  const q = question("inputs") as MultiQuestion;
  const valid = new Set(q.options.map((o) => o.id));
  return clean(answers.inputs).filter((id) => valid.has(id) && id !== q.exclusive);
}

// ── Categories ──────────────────────────────────────────────────────────────

/**
 * Top two or three categories by chip count. Ties break on the canonical
 * category order, so the same answers always produce the same card.
 */
export function weighingCategories(answers: SpAnswers): PictureCategory[] {
  const named = namedSymptoms(answers);
  return SYMPTOM_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    symptoms: named
      .map((id) => symptom(id))
      .filter((s) => s?.category === cat.id)
      .map((s) => ({ id: s!.id, label: s!.label })),
  }))
    .filter((cat) => cat.symptoms.length > 0)
    .sort((a, b) => b.symptoms.length - a.symptoms.length)
    .slice(0, 3);
}

// ── The first 2-week test candidate (blueprint §5) ─────────────────────────

export type CandidateMatch = {
  id: CandidateTestId;
  label: string;
  note?: string;
  /** The input and symptom the rule matched on; absent on the fallback. */
  input?: string;
  symptom?: string;
};

/** First rule that matches, top to bottom. */
export function candidateTest(answers: SpAnswers): CandidateMatch {
  const inputs = new Set(realInputs(answers));
  const named = new Set(namedSymptoms(answers));

  for (const rule of CANDIDATE_RULES) {
    if (!inputs.has(rule.input)) continue;
    const hit = rule.symptoms.find((s) => named.has(s));
    if (!hit) continue;
    return { id: rule.test, label: CANDIDATE_TESTS[rule.test], input: rule.input, symptom: hit };
  }

  return {
    id: CANDIDATE_FALLBACK,
    label: CANDIDATE_TESTS[CANDIDATE_FALLBACK],
    note: CANDIDATE_FALLBACK_NOTE,
  };
}

// ── Row 3 · What tracking alone can't tell you ─────────────────────────────

/**
 * Three lines. Two are always shown; the middle one names her own input and
 * symptom when she gave us any, and the doctor line leads when she felt
 * dismissed.
 *
 * "Her top everyday input" and "her top symptom" have no ranking on the web —
 * neither question is ordered. So the pair is taken from the candidate rule that
 * matched, which keeps row 3 and row 4 talking about the same thing; failing
 * that, from the first of each in canonical order.
 */
export function unknownLines(answers: SpAnswers, candidate: CandidateMatch): string[] {
  const inputs = realInputs(answers);
  const named = namedSymptoms(answers);

  let linked: string = UNKNOWNS.linkedFallback;
  if (inputs.length > 0 && named.length > 0) {
    const inputId = candidate.input ?? inputs[0];
    const symptomId = candidate.symptom ?? named[0];
    linked = UNKNOWNS.linked(inputLinkLabel(inputId), symptomLinkLabel(symptomId));
  }

  return answers.doctor === "feltDismissed"
    ? [UNKNOWNS.doctor, UNKNOWNS.days, linked]
    : [UNKNOWNS.days, linked, UNKNOWNS.doctor];
}

// ── Order of the plan cards (26) and the proof stack (29) ──────────────────

function moveToFront<T>(list: T[], value: T): T[] {
  const rest = list.filter((v) => v !== value);
  return list.includes(value) ? [value, ...rest] : list;
}

/**
 * Primary sort by 22 (what matters), secondary by 17 (the hard-day reflection),
 * then `feltDismissed` on 14 forces Doctor Kit to position 1 — in that order,
 * because the blueprint gives the doctor rule the last word (§5).
 */
export function planCardOrder(answers: SpAnswers): PlanCardId[] {
  let order = [...CANONICAL_CARDS];

  const primary = answers.matters ? MATTERS_TO_CARD[answers.matters] : undefined;
  if (primary) order = moveToFront(order, primary);

  const secondary = answers.reflection ? REFLECTION_TO_CARD[answers.reflection] : undefined;
  if (secondary && secondary !== order[0]) {
    order = [order[0], secondary, ...order.slice(1).filter((c) => c !== secondary)];
  }

  if (answers.doctor === "feltDismissed") order = moveToFront(order, "doctor");

  return order;
}

/** Rows 1–4 follow the cards; "Analyzed on your phone" and the quote stay last. */
export function proofRowOrder(answers: SpAnswers): ProofRowId[] {
  return [...planCardOrder(answers).map((c) => CARD_TO_PROOF_ROW[c]), "privacy", "quote"];
}

// ── The reveal itself ──────────────────────────────────────────────────────

export function buildStartingPicture(answers: SpAnswers): StartingPicture {
  const named = namedSymptoms(answers);
  const count = named.length;
  const categories = weighingCategories(answers);
  const candidate = candidateTest(answers);

  return {
    count,
    countLabel: count === 1 ? REVEAL.countOne : REVEAL.countMany(count),
    countOf: REVEAL.countOf(count),
    categories,
    topCategory: categories[0]?.id,
    unknowns: unknownLines(answers, candidate),
    candidate: { id: candidate.id, label: candidate.label, note: candidate.note },
    planOrder: planCardOrder(answers),
    proofOrder: proofRowOrder(answers),
  };
}

// ── The other branch selections ────────────────────────────────────────────

export function selectEcho(moment: string | undefined): Echo | undefined {
  return moment ? ECHO_BY_MOMENT[moment] : undefined;
}

/** N=1 gets its own sentence; N=0 cannot happen (screen 7 needs one chip). */
export function recognizedHeadline(count: number): string {
  return count === 1 ? RECOGNIZED.headlineOne : RECOGNIZED.headline(count);
}

/**
 * Variant by 12 (tracking). When 10 said "I don't get periods", every sentence
 * about her cycle is dropped rather than reworded — the blueprint supplies no
 * periods-free rewrite, and dropping keeps the remaining paragraphs its own
 * words (§5, "suppresses every cycle sentence downstream").
 */
export function selectAdvertorial(tracking: string | undefined, cycle: string | undefined): string[] {
  const variant = tracking ? ADVERTORIAL[tracking] : undefined;
  if (!variant) return [];
  const suppress = cycle !== undefined && CYCLE_SUPPRESSED.includes(cycle);
  return variant
    .map((paragraph) =>
      paragraph
        .filter((s) => !(suppress && s.cycle))
        .map((s) => s.text)
        .join(" "),
    )
    .filter((p) => p.length > 0);
}

export function selectMethodEcho(doctor: string | undefined): string | undefined {
  return doctor ? METHOD_ECHO_BY_DOCTOR[doctor] : undefined;
}

/** Her moment's quote leads; the rest keep their canonical order. */
export function selectQuoteOrder(moment: string | undefined): string[] {
  const ids = QUOTES.map((q) => q.id);
  const lead = moment ? MOMENT_TO_QUOTE[moment] : undefined;
  return lead ? moveToFront(ids, lead) : ids;
}

export type Bridge = { duration?: string; moment?: string; hope: string };

/**
 * {Duration}. {Moment}. {Hope}. The hope line is locked.
 *
 * The `tracker` moment line names her cycle, so for "I don't get periods" it is
 * replaced by the `is_this_it` line — another line the blueprint already wrote,
 * rather than a new one (§5, cycle suppression).
 */
export function selectBridge(answers: SpAnswers): Bridge {
  const suppress = answers.cycle !== undefined && CYCLE_SUPPRESSED.includes(answers.cycle);
  const momentKey = suppress && answers.moment === "tracker" ? "is_this_it" : (answers.moment ?? "");
  return {
    duration: answers.how_long ? BRIDGE_DURATION[answers.how_long] : undefined,
    moment: BRIDGE_MOMENT[momentKey],
    hope: BRIDGE_HOPE,
  };
}

/** Never for "manageable" (§5). */
export function selectUrgency(intensity: string | undefined): string | undefined {
  return intensity ? URGENCY_BY_INTENSITY[intensity] : undefined;
}
