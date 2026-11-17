// Starting Picture funnel — every string, option id and branch table.
//
// Rules this file obeys, from the build brief §4:
//  · Every user-facing string is the blueprint's, verbatim. Nothing was written
//    here; the handful of strings the blueprint does not supply are listed in
//    the PR for Yarin and marked NEW below.
//  · Enum raw values are the APP's, verbatim (app handout §2 table). The web
//    maps its own labels to them here and nowhere else. Fields the app owns use
//    the app's camelCase rawValues; the five web-only answers use snake_case
//    web ids, so the two are never confused at the boundary.
//  · Nothing in this module may be imported by `landing.ts` — this is the
//    ssr:false side of the compliance line (blueprint §9).

import { PRICING, TRIAL_DAYS } from "./pricing";

// ── Acts and the rail ───────────────────────────────────────────────────────

export type ActId = "seen" | "changed" | "tried" | "works" | "picture" | "begin";

/** Blueprint §3. The rail renders `02 · WHAT'S CHANGED` from these. */
export const ACTS: readonly { n: number; id: ActId; label: string }[] = [
  { n: 1, id: "seen", label: "YOUR MOMENT" },
  { n: 2, id: "changed", label: "WHAT’S CHANGED" },
  { n: 3, id: "tried", label: "WHAT YOU’VE TRIED" },
  { n: 4, id: "works", label: "HOW RYTHMA WORKS" },
  { n: 5, id: "picture", label: "YOUR STARTING PICTURE" },
  { n: 6, id: "begin", label: "BEGIN" },
];

export function act(id: ActId) {
  const found = ACTS.find((a) => a.id === id);
  if (!found) throw new Error(`sp: unknown act "${id}"`);
  return found;
}

// ── The recurring footers ───────────────────────────────────────────────────

/**
 * Blueprint §2. Names a condition body, so it is client-side only — it must
 * never reach the LP's server HTML.
 */
export const EVIDENCE_FOOTER =
  "Guided by The Menopause Society and NICE guidance · Analyzed on your phone · Never sold";

/** Blueprint §1. The one line that repeats. */
export const CLARITY_FOOTER = "Clarity, not a diagnosis.";

// ── Below the fold on the LP (client-rendered after hydration) ──────────────

export const LP_BELOW = {
  heading: "What you’ll leave with",
  rows: [
    "What’s weighing on you most",
    "What tracking alone can’t tell you",
    "Your first 2-week test, matched to your days",
  ],
  /** The Starting Picture still, score tile blurred. */
  stillLabel: "STARTING PICTURE",
} as const;

// ── Symptoms (screen 7) ─────────────────────────────────────────────────────

export type SymptomCategoryId = "temperature" | "body" | "mind_mood" | "skin_senses" | "intimate";

export type Symptom = {
  /** The app's `Symptom` rawValue, verbatim. Sent to the app untranslated. */
  id: string;
  label: string;
  category: SymptomCategoryId;
};

export const SYMPTOM_CATEGORIES: readonly { id: SymptomCategoryId; label: string }[] = [
  { id: "temperature", label: "Temperature" },
  { id: "body", label: "Body" },
  { id: "mind_mood", label: "Mind & mood" },
  { id: "skin_senses", label: "Skin & senses" },
  { id: "intimate", label: "Intimate" },
];

/** All 30, in the app's canonical order. Every one is a recognized symptom. */
export const SYMPTOMS: readonly Symptom[] = [
  { id: "hotFlashes", label: "Hot flashes", category: "temperature" },
  { id: "nightSweats", label: "Night sweats", category: "temperature" },
  { id: "coldFlashes", label: "Cold flashes / chills", category: "temperature" },
  { id: "sleepDisruption", label: "Sleep problems", category: "body" },
  { id: "fatigue", label: "Fatigue", category: "body" },
  { id: "jointPain", label: "Joint pain", category: "body" },
  { id: "muscleAches", label: "Muscle aches", category: "body" },
  { id: "headaches", label: "Headaches", category: "body" },
  { id: "bloating", label: "Bloating", category: "body" },
  { id: "digestiveIssues", label: "Digestive issues", category: "body" },
  { id: "acidReflux", label: "Acid reflux", category: "body" },
  { id: "breastTenderness", label: "Breast tenderness", category: "body" },
  { id: "heartPalpitations", label: "Heart palpitations", category: "body" },
  { id: "weightChanges", label: "Weight changes", category: "body" },
  { id: "dizziness", label: "Dizziness", category: "body" },
  { id: "restlessLegs", label: "Restless legs", category: "body" },
  { id: "urinarySymptoms", label: "Urinary symptoms", category: "body" },
  { id: "brainFog", label: "Brain fog", category: "mind_mood" },
  { id: "memoryLapses", label: "Memory lapses", category: "mind_mood" },
  { id: "anxiety", label: "Anxiety", category: "mind_mood" },
  { id: "moodSwings", label: "Mood swings", category: "mind_mood" },
  { id: "irritability", label: "Irritability", category: "mind_mood" },
  { id: "rage", label: "Rage / anger", category: "mind_mood" },
  { id: "itchySkin", label: "Itchy / crawling skin", category: "skin_senses" },
  { id: "dryEyes", label: "Dry eyes", category: "skin_senses" },
  { id: "burningMouth", label: "Burning / dry mouth", category: "skin_senses" },
  { id: "tinnitus", label: "Ringing ears", category: "skin_senses" },
  { id: "hairChanges", label: "Hair changes", category: "skin_senses" },
  { id: "lowLibido", label: "Low libido", category: "intimate" },
  { id: "vaginalDryness", label: "Vaginal dryness", category: "intimate" },
];

export const SYMPTOM_IDS: readonly string[] = SYMPTOMS.map((s) => s.id);

export function symptom(id: string): Symptom | undefined {
  return SYMPTOMS.find((s) => s.id === id);
}

// ── Questions ───────────────────────────────────────────────────────────────

export type Option = {
  /** App rawValue where the app owns the field; a web id where it does not. */
  id: string;
  label: string;
  /** Shown under the option, does not block (screen 3's under-38 note). */
  note?: string;
};

export type SingleQuestion = {
  kind: "single";
  id: string;
  prompt: string;
  sub?: string;
  options: readonly Option[];
  footer?: string;
};

export type MultiQuestion = {
  kind: "multi";
  id: string;
  prompt: string;
  sub?: string;
  options: readonly Option[];
  cta: string;
  /** Hard cap on selections (screen 6 is 1–3). */
  max?: number;
  /** Option that clears every other one (screen 11's "None of these"). */
  exclusive?: string;
};

export type ChipsQuestion = {
  kind: "chips";
  id: "symptoms";
  prompt: string;
  sub: string;
  cta: string;
  emptyHint: string;
};

export type Question = SingleQuestion | MultiQuestion | ChipsQuestion;

export const QUESTIONS: readonly Question[] = [
  // 1 · Moment. Web-only ids; these key the echo, advertorial, quote and bridge.
  {
    kind: "single",
    id: "moment",
    prompt: "Which of these is closest to where you are right now?",
    options: [
      { id: "dismissed", label: "I was told it’s stress, or my age, and sent home." },
      { id: "logging", label: "I’m logging everything and nothing comes back." },
      { id: "tracker", label: "My cycle stopped making sense and my tracker gave up on it." },
      { id: "not_myself", label: "I don’t feel like myself, and I can’t explain why." },
      { id: "is_this_it", label: "Something’s shifted and I want to know if this is it." },
    ],
    footer: "We’ll speak to this first.",
  },
  // 3 · Age. The app's exact `AgeRange` bands, so nothing is translated.
  {
    kind: "single",
    id: "age",
    prompt: "How old are you?",
    options: [
      {
        id: "underThirtyEight",
        label: "Under 38",
        note: "Changes this early are worth raising with a doctor. Not a diagnosis; a reason to be heard.",
      },
      { id: "thirtyEightToFortyTwo", label: "38–42" },
      { id: "fortyThreeToFortySeven", label: "43–47" },
      { id: "fortyEightToFiftyTwo", label: "48–52" },
      { id: "fiftyThreeToFiftyFive", label: "53–55" },
      { id: "fiftySixPlus", label: "56 or older" },
    ],
  },
  // 5 · How long. Web-only; feeds the bridge's first line.
  {
    kind: "single",
    id: "how_long",
    prompt: "How long has this been going on?",
    options: [
      { id: "few_months", label: "A few months" },
      { id: "about_a_year", label: "About a year" },
      { id: "couple_years", label: "A couple of years" },
      { id: "longer", label: "Longer than I can remember" },
    ],
  },
  // 6 · What quietly got harder. Web-only, reserved (§5: drives nothing yet).
  {
    kind: "multi",
    id: "harder",
    prompt: "What has this quietly made harder?",
    sub: "Pick up to three.",
    max: 3,
    options: [
      { id: "work_focus", label: "Work and focus" },
      { id: "sleep", label: "Sleep" },
      { id: "patience", label: "Patience with the people I love" },
      { id: "showing_up", label: "Showing up for things" },
      { id: "trusting_body", label: "Trusting my body" },
      { id: "feeling_myself", label: "Feeling like myself" },
    ],
    cta: "Continue",
  },
  // 7 · Symptoms. The intake's centrepiece; options are SYMPTOMS above.
  {
    kind: "chips",
    id: "symptoms",
    prompt: "What’s shown up in the last three months?",
    sub: "Tap everything, including the ones you’ve stopped mentioning.",
    cta: "Continue",
    emptyHint: "Pick at least one, even the small one.",
  },
  // 9 · Intensity → the app's `symptomImpact`. `barelyNoticeable` is never sent.
  {
    kind: "single",
    id: "intensity",
    prompt: "In a typical week, how much do they take from you?",
    options: [
      { id: "annoying", label: "Annoying, but manageable" },
      { id: "seriouslyDisrupting", label: "Seriously disrupting my days" },
      { id: "losingControl", label: "I feel like I’m losing control" },
    ],
    footer: "This sets the weight of your plan. It isn’t a medical grade.",
  },
  // 10 · Cycle → the app's `cycleStatus`. Shapes copy only; no accuracy promise.
  {
    kind: "single",
    id: "cycle",
    prompt: "And your cycle lately?",
    options: [
      { id: "regular", label: "Still fairly predictable" },
      { id: "irregular", label: "It’s become irregular" },
      { id: "cantRemember", label: "I can’t remember my last one" },
      { id: "stopped", label: "I think they’ve stopped" },
      { id: "noPeriods", label: "I don’t get periods (surgery, IUD, or other)" },
    ],
  },
  // 10a · Fork, not a step. Only after `noPeriods`; the rail count is unchanged.
  {
    kind: "single",
    id: "no_period_reason",
    prompt: "Which is closest?",
    options: [
      { id: "hysterectomy", label: "A hysterectomy" },
      { id: "ablationOrIUD", label: "An ablation or an IUD" },
      { id: "stopped12Months", label: "They stopped 12+ months ago" },
      { id: "hrtContinuous", label: "HRT or something else" },
      { id: "other", label: "Something else" },
    ],
  },
  // 11 · Everyday inputs. Web-only; this is what makes screen 25 row 4 hers.
  {
    kind: "multi",
    id: "inputs",
    prompt: "Which of these are part of most days?",
    sub: "Not a judgment. These are the things Rythma can actually test against your days.",
    exclusive: "none",
    options: [
      { id: "caffeine_after_2pm", label: "Caffeine after 2pm" },
      { id: "drink_most_evenings", label: "A drink most evenings" },
      { id: "screens_past_10pm", label: "Screens past 10pm" },
      { id: "dinner_late", label: "Dinner late" },
      { id: "low_daylight", label: "Not much daylight or movement" },
      { id: "high_stress", label: "High-stress days" },
      { id: "none", label: "None of these" },
    ],
    cta: "Continue",
  },
  // 12 · Tracking → the app's `trackingHabits`. Labels differ, order is 1:1.
  {
    kind: "single",
    id: "tracking",
    prompt: "Have you tried tracking any of this?",
    options: [
      { id: "usingAppDoesntWork", label: "Yes, a period app (Flo, Clue, or another)" },
      { id: "notesOrCalendar", label: "Yes, notes or a spreadsheet" },
      { id: "triedGaveUp", label: "I started, then stopped" },
      { id: "dontKnowWhereToStart", label: "Not really" },
    ],
  },
  // 14 · Doctor → the app's `doctorRelationship`. 1:1.
  {
    kind: "single",
    id: "doctor",
    prompt: "When you’ve raised this with a doctor…",
    options: [
      { id: "helpfulDoctor", label: "They were helpful" },
      { id: "feltDismissed", label: "I felt dismissed" },
      { id: "notYet", label: "I haven’t yet" },
      { id: "didntKnow", label: "I didn’t know this was something to ask about" },
    ],
  },
  // 17 · Hard-day reflection. Web-only; secondary sort on 26.
  {
    kind: "single",
    id: "reflection",
    prompt: "On a hard day, what would help most?",
    options: [
      { id: "right_then", label: "Something to do right then" },
      { id: "knowing_coming", label: "Knowing it was coming" },
      { id: "show_doctor", label: "Something to show my doctor" },
      { id: "understand_why", label: "Understanding why" },
    ],
  },
  // 22 · What matters → the app's `Pillar`. The app's field is a Set; we send one.
  {
    kind: "single",
    id: "matters",
    prompt: "If Rythma could only do one thing for you first, which?",
    options: [
      { id: "hardDayPredictions", label: "Warn me before a hard day" },
      { id: "understandBody", label: "Help me understand my own body" },
      { id: "doctorEvidence", label: "Give me something to show my doctor" },
      { id: "feelLessAlone", label: "Help me feel less alone in this" },
    ],
  },
];

export function question(id: string): Question {
  const found = QUESTIONS.find((q) => q.id === id);
  if (!found) throw new Error(`sp: unknown question "${id}"`);
  return found;
}

/** Valid ids for a single-select answer — the server validates against this. */
export function optionIds(questionId: string): readonly string[] {
  const q = question(questionId);
  return q.kind === "chips" ? SYMPTOM_IDS : q.options.map((o) => o.id);
}

// ── The flow: 31 screens in 6 acts ──────────────────────────────────────────

export type StepType =
  | "question"
  | "chips"
  | "echo"
  | "video"
  | "advertorial"
  | "method"
  | "loader"
  | "gate"
  | "reveal"
  | "plan-cards"
  | "quotes"
  | "bridge"
  | "plan"
  | "checkout"
  | "handoff";

export type Screen = {
  /** 1-based, and what the rail shows as `07 / 31`. */
  n: number;
  id: string;
  type: StepType;
  act: ActId;
};

/**
 * Blueprint §3. Every act ends on a beat or a video, never on a question.
 *
 * Screen 10a (`no_period_reason`) is deliberately absent: it is a fork off
 * `cycle`, not a step, so the rail's count stays 31 (blueprint §4, screen 10a).
 */
export const FLOW: readonly Screen[] = [
  { n: 1, id: "moment", type: "question", act: "seen" },
  { n: 2, id: "echo", type: "echo", act: "seen" },
  { n: 3, id: "age", type: "question", act: "seen" },
  { n: 4, id: "v_seen", type: "video", act: "seen" },
  { n: 5, id: "how_long", type: "question", act: "seen" },
  { n: 6, id: "harder", type: "question", act: "seen" },
  { n: 7, id: "symptoms", type: "chips", act: "changed" },
  { n: 8, id: "recognized", type: "echo", act: "changed" },
  { n: 9, id: "intensity", type: "question", act: "changed" },
  { n: 10, id: "cycle", type: "question", act: "changed" },
  { n: 11, id: "inputs", type: "question", act: "changed" },
  { n: 12, id: "tracking", type: "question", act: "tried" },
  { n: 13, id: "gap", type: "advertorial", act: "tried" },
  { n: 14, id: "doctor", type: "question", act: "tried" },
  { n: 15, id: "method", type: "method", act: "tried" },
  { n: 16, id: "v_relief", type: "video", act: "works" },
  { n: 17, id: "reflection", type: "question", act: "works" },
  { n: 18, id: "v_headsup", type: "video", act: "works" },
  { n: 19, id: "v_test", type: "video", act: "works" },
  { n: 20, id: "v_doctor", type: "video", act: "works" },
  { n: 21, id: "privacy", type: "method", act: "works" },
  { n: 22, id: "matters", type: "question", act: "works" },
  { n: 23, id: "loader", type: "loader", act: "picture" },
  { n: 24, id: "gate", type: "gate", act: "picture" },
  { n: 25, id: "reveal", type: "reveal", act: "picture" },
  { n: 26, id: "plan_cards", type: "plan-cards", act: "picture" },
  { n: 27, id: "quotes", type: "quotes", act: "picture" },
  { n: 28, id: "bridge", type: "bridge", act: "begin" },
  { n: 29, id: "plan", type: "plan", act: "begin" },
  { n: 30, id: "checkout", type: "checkout", act: "begin" },
  { n: 31, id: "handoff", type: "handoff", act: "begin" },
];

export const TOTAL_SCREENS = FLOW.length;

/** The rail rides question screens only (blueprint §2, Components). */
export const RAIL_TYPES: readonly StepType[] = ["question", "chips"];

// ── Screen 2 · Echo (branches on 1) ─────────────────────────────────────────

export type Echo = {
  /** Instrument Serif; the last entry is set in italic. */
  lines: readonly string[];
};

export const ECHO_BY_MOMENT: Record<string, Echo> = {
  dismissed: {
    lines: [
      "You left with fine labs, a fine tone, and nothing in your hands. You don’t need another pep talk.",
      "You need something you can show.",
    ],
  },
  logging: {
    lines: ["You’re already doing the work. Logging isn’t the problem.", "Getting something back is."],
  },
  tracker: {
    lines: [
      "Twenty-two days, then fifty-one, then nothing. The app didn’t break. It was built for a body you don’t have anymore.",
      "You’re still having a period. It’s just changing.",
    ],
  },
  not_myself: {
    lines: ["Some days you catch yourself mid-sentence and think: who is this? Not dramatic.", "Just not you."],
  },
  is_this_it: {
    lines: [
      "Nobody hands you a map for this. Most women find the word years after the first symptom.",
      "You’re earlier than you think.",
    ],
  },
};

/** Under every version of screen 2. */
export const ECHO_KICKER = "You’re not imagining this.";

// ── Screen 8 · Recognized (the count beat) ──────────────────────────────────

/**
 * The first place "perimenopause" appears, client-side only, and only after she
 * has named symptoms (blueprint §9, Meta copy rule).
 */
export const RECOGNIZED = {
  /** N > 1. */
  headline: (n: number) => `${n} of the ${n} things you named are recognized perimenopause symptoms.`,
  /** N = 1. */
  headlineOne: "The one thing you named is a recognized perimenopause symptom.",
  sub: "Recognized, not diagnosed. That word belongs to a doctor, ideally one holding a pattern.",
  subItalic: "We’ll get to that.",
  cta: "Continue",
} as const;

// ── Screen 13 · The gap (advertorial; branches on 12, suppressed by 10) ─────

export type AdvertorialSentence = {
  text: string;
  /**
   * True when the sentence is about her cycle. Screen 10's `noPeriods` answer
   * "suppresses every cycle sentence downstream" (§5), and the blueprint does
   * not supply a periods-free rewrite of this variant — so the sentences are
   * tagged and dropped rather than reworded. Nothing new is written.
   */
  cycle?: true;
};

export const ADVERTORIAL: Record<string, readonly (readonly AdvertorialSentence[])[]> = {
  // "Yes, a period app"
  usingAppDoesntWork: [
    [
      { text: "Most period apps still assume a regular, fertile cycle." },
      {
        text: "When yours goes 22 days, then 51, then nothing for months, they don’t adapt.",
        cycle: true,
      },
      { text: "They go quiet, or they tell you your period is “43 days late.”", cycle: true },
    ],
    [
      {
        text: "So you get a calendar and no next step. Nothing happens on the hard day. Nothing you could put in front of a doctor.",
      },
    ],
    [
      {
        text: "Rythma was built for the irregular years. Log a Rough or Hard day and something happens right then. Keep logging and it shows you what’s linked in your own days, and turns it into something you can hand over.",
      },
    ],
  ],
  // "Yes, notes or a spreadsheet"
  notesOrCalendar: [
    [
      {
        text: "You’ve been doing by hand what should have been done for you: keeping the record. It takes discipline most people don’t have. It also gives back almost nothing, because a list can’t tell you what’s connected to what.",
      },
    ],
    [
      {
        text: "Rythma keeps the record in thirty seconds a day, then does the part a notebook can’t: it finds what’s linked in your days, lets you test one change, and lays it out for your doctor.",
      },
    ],
  ],
  // "I started, then stopped" / "Not really"
  triedGaveUp: [
    [
      {
        text: "Most tracking fails for one reason: you put things in and nothing comes out. After a fortnight it feels like homework.",
      },
    ],
    [
      {
        text: "Rythma is built the other way round. The moment you log a hard day it hands something back, and every log after that sharpens what it can show you. Thirty seconds, then put your phone down.",
      },
    ],
  ],
};
ADVERTORIAL.dontKnowWhereToStart = ADVERTORIAL.triedGaveUp;

export const ADVERTORIAL_CTA = "Continue";

/** Screen 10 answers after which no cycle sentence may run (§5). */
export const CYCLE_SUPPRESSED: readonly string[] = ["noPeriods"];

// ── Screen 15 · The method (echo branches on 14) ────────────────────────────

export const METHOD_ECHO_BY_DOCTOR: Record<string, string> = {
  feltDismissed: "“They’re reluctant to take your word for it unless you can show them something.”",
  helpfulDoctor: "A good doctor is easier to work with when you bring a pattern.",
  notYet: "When you do go, you’ll want to walk in with more than a feeling.",
  didntKnow: "When you do go, you’ll want to walk in with more than a feeling.",
};

export type RuledScreen = {
  headline: string;
  numbered: boolean;
  rows: readonly { title?: string; text: string }[];
  sub?: string;
  cta: string;
};

export const METHOD: RuledScreen = {
  headline: "Tracking that actually triggers help. Then shows you what’s working in your own data.",
  numbered: true,
  rows: [
    { title: "Log", text: "each day, 30 seconds" },
    { title: "Relief", text: "the moment a day lands Rough or Hard" },
    { title: "Patterns", text: "from your own logs, and a 2-week test to check one" },
    { title: "Doctor Kit", text: "a PDF you hand over" },
  ],
  sub: "You’re about to see each one on real screens.",
  cta: "Show me",
};

// ── Screen 21 · Privacy (the same ruled shape, unnumbered) ─────────────────

export const PRIVACY: RuledScreen = {
  headline: "Privacy you can say out loud.",
  numbered: false,
  rows: [
    { text: "Your patterns are analyzed on your phone." },
    { text: "Your health data is never sold and never shared with advertisers." },
    { text: "The Forecast is the one thing computed on our servers. It is never sold either." },
  ],
  sub: "And thirty seconds a day is enough. Rythma isn’t designed to become more of your day.",
  cta: "Continue",
};

// ── Videos (screens 4, 16, 18, 19, 20; the LP hook is optional) ─────────────

export type FunnelVideoSpec = {
  /** The analytics id (blueprint §10). */
  id: "hook" | "seen" | "relief" | "heads_up" | "patterns_test" | "doctor_kit";
  /** Empty until the clips land; the component then renders the still instead. */
  src: string;
  webm: string;
  poster: string;
  caption: string;
  /** Under the caption, smaller — the attribution or the honesty line. */
  note?: string;
  /**
   * The clip's voiceover. Doubles as the text alternative when `src` is empty
   * (blueprint §6, "Shipping without videos") and as the caption track's
   * transcript, so a screen with no clip still carries its meaning in words.
   */
  alt: readonly string[];
};

export const VIDEOS: Record<string, FunnelVideoSpec> = {
  v_seen: {
    id: "seen",
    src: "",
    webm: "",
    poster: "",
    caption: "“I’d seen that list of symptoms and realised that was me.”",
    note: "from the research, not a customer",
    alt: [
      "“I thought I was losing my mind.”",
      "“I lost my keys in the supermarket. I’ve never done that.”",
      "“A single email and I was ready to quit my job.”",
      "“They said it was stress.”",
      "You’re not imagining this.",
    ],
  },
  v_relief: {
    id: "relief",
    src: "",
    webm: "",
    poster: "",
    caption: "When the day lands Rough or Hard, Rythma doesn’t just file it away.",
    note: "Short practices for the next two minutes. They ease the moment; they don’t erase the symptom.",
    alt: [
      "When the day lands Rough or Hard, Rythma doesn’t just file it away. It offers Relief: short practices you can use right then.",
    ],
  },
  v_headsup: {
    id: "heads_up",
    src: "",
    webm: "",
    poster: "",
    caption: "Some evenings, Rythma looks ahead. A range, not a date. It sharpens as you log.",
    alt: [
      "Some evenings Rythma looks ahead. If tomorrow looks Moderate or Harder, you get a hard-day heads-up while you can still plan. A range, not a date. It sharpens as you log.",
    ],
  },
  v_test: {
    id: "patterns_test",
    src: "",
    webm: "",
    poster: "",
    caption: "One change for 14 days. A clear before and after. Or no clear difference, which is an answer too.",
    note: "Patterns are associated, not proven. Your pattern, not a rule.",
    alt: [
      "After enough logs, Rythma surfaces what’s working: patterns from your own days. Then you can run a 2-week test. One change. A clear before and after. Or no clear difference. That’s an answer too.",
    ],
  },
  v_doctor: {
    id: "doctor_kit",
    src: "",
    webm: "",
    poster: "",
    caption: "Your doctor wants a pattern. We’ll help you hand them one.",
    note: "Rythma prepares you for the conversation. It never plays doctor.",
    alt: [
      "Appointments go sideways when it’s your word against a shrug. Build a Doctor Kit: symptoms, How you’re doing over time, what’s working, your questions. Walk in with a pattern, not a performance.",
    ],
  },
};

/** Continue appears at 3s; nothing is gated (decision §12.6). */
export const VIDEO_CONTINUE_DELAY_MS = 3000;
export const VIDEO_CTA = "Continue";
/** Progress is logged in these steps, and only these (blueprint §10). */
export const VIDEO_PROGRESS_STEPS: readonly number[] = [25, 50, 75, 100];

// ── Screen 23 · Loader ──────────────────────────────────────────────────────

export const LOADER = {
  title: "Building your Starting Picture",
  lines: [
    "Reading what you named",
    "Weighing what’s changed",
    "Matching your first 2-week test",
    "Preparing your plan for the app",
  ],
  sub: "Your Peri Score stays locked. It opens in the app after your baseline check-in.",
  /** Four lines over ~5s (blueprint §2, Motion). */
  totalMs: 5000,
} as const;

// ── Screen 24 · Keep it (the email gate; required, decision §12.3) ──────────

export const GATE = {
  headline: "Where should we keep your Starting Picture?",
  firstNameLabel: "First name (optional)",
  emailLabel: "Email",
  reason: "We use it to hand your Starting Picture to the app, so you never answer these questions twice.",
  cta: "Show my Starting Picture",
  micro: "No spam. Your picture, and a way back to it.",
} as const;

// ── Screen 25 · The Starting Picture card ───────────────────────────────────

export const REVEAL = {
  cardTitle: "STARTING PICTURE",
  /** When she skipped the optional first name. */
  nameFallback: "Yours",
  countMany: (n: number) => `${n} recognized symptoms`,
  countOne: "1 recognized symptom",
  countOf: (n: number) => (n === 1 ? "of the 1 you named" : `of the ${n} you named`),
  weighingLabel: "Weighing on you most",
  unknownsLabel: "What tracking alone can’t tell you",
  testLabel: "Your first 2-week test, matched to your days",
  testFixedLine:
    "A candidate, not a prescription. The app confirms it against your own logs, and tells you honestly if nothing changed.",
  scoreLabel: "Peri Score",
  scoreLock: "Opens in the app after your baseline check-in. A starting point, not a grade.",
  cta: "What’s waiting in the app",
} as const;

/** Row 3's three lines (blueprint §4 screen 25). */
export const UNKNOWNS = {
  days: "Which of the next seven days will be the harder ones",
  linked: (input: string, symptom: string) => `Whether ${input} is linked to ${symptom}`,
  linkedFallback: "What’s linked to what in your own days",
  doctor: "How to show a doctor that this is a pattern, not a bad week",
} as const;

// ── Screen 26 · What's waiting in the app ───────────────────────────────────

export type PlanCardId = "heads_up" | "test" | "doctor" | "relief";

export const PLAN_CARDS: readonly {
  id: PlanCardId;
  eyebrow: string;
  title: string;
  /** Which clip's still sits on the card. */
  video: keyof typeof VIDEOS;
}[] = [
  {
    id: "heads_up",
    eyebrow: "Because you asked to see hard days coming",
    title: "Hard-day heads-up",
    video: "v_headsup",
  },
  {
    id: "test",
    eyebrow: "Because you want to understand your own body",
    title: "What’s working, from your logs",
    video: "v_test",
  },
  {
    id: "doctor",
    eyebrow: "Because you’ve been asked to prove it",
    title: "Doctor Kit",
    video: "v_doctor",
  },
  {
    id: "relief",
    eyebrow: "Because a hard day shouldn’t be a solo event",
    title: "Relief on hard days",
    video: "v_relief",
  },
];

export const PLAN_CARDS_SCREEN = {
  /** Reuses screen 25's CTA wording as the heading; no new string. */
  heading: REVEAL.cta,
  timeline: [
    { when: "Day 0", what: "baseline check-in → Starting Picture and Peri Score" },
    { when: "2 logs", what: "your Forecast opens" },
    { when: "Week 2", what: "your first pattern" },
    { when: "Your next visit", what: "Doctor Kit" },
  ],
  cta: "Continue",
} as const;

/** 22 → the card that leads. 17 is the secondary sort; see reveal.ts. */
export const MATTERS_TO_CARD: Record<string, PlanCardId> = {
  hardDayPredictions: "heads_up",
  understandBody: "test",
  doctorEvidence: "doctor",
  feelLessAlone: "relief",
};

export const REFLECTION_TO_CARD: Record<string, PlanCardId> = {
  right_then: "relief",
  knowing_coming: "heads_up",
  show_doctor: "doctor",
  understand_why: "test",
};

// ── Screen 27 · In their words (the four attested quotes, decision §12.7) ──

export const QUOTES_SCREEN = {
  eyebrow: "FROM MEMBERS, WITH PERMISSION",
  cta: "Continue",
} as const;

export const QUOTES: readonly { id: string; text: string; attribution: string }[] = [
  {
    id: "rachel",
    text: "My cycle stopped making sense. This is the first app that didn’t pretend it was still regular.",
    attribution: "Rachel, 47",
  },
  {
    id: "denise_log",
    text: "I brought the log to my doctor instead of saying “I just feel off.” She actually used it.",
    attribution: "Denise, 51",
  },
  {
    id: "maya",
    text: "Takes ten seconds in the morning. After a month I could see the pattern I’d been living inside.",
    attribution: "Maya, 44",
  },
  {
    id: "denise_language",
    text: "I finally had language for what was happening to me.",
    attribution: "Denise, 51",
  },
];

/** Show the one that matches her moment first (blueprint §4 screen 27). */
export const MOMENT_TO_QUOTE: Record<string, string> = {
  tracker: "rachel",
  dismissed: "denise_log",
  logging: "maya",
  not_myself: "denise_language",
};

// ── Screen 28 · Bridge ──────────────────────────────────────────────────────

export const BRIDGE_DURATION: Record<string, string> = {
  few_months: "A few months is long enough.",
  about_a_year: "A year without a picture of it is long enough.",
  couple_years: "Two years is long enough.",
  longer: "You’ve carried this long enough.",
};

export const BRIDGE_MOMENT: Record<string, string> = {
  dismissed: "Next time, you walk in with a pattern.",
  logging: "This time, the logging gives something back.",
  tracker: "This time, the tracker is built for the cycle you actually have.",
  not_myself: "This time, the hard days stop arriving unannounced.",
  is_this_it: "This time, you find out from your own days.",
};

/** Locked (blueprint §4 screen 28, from the research). */
export const BRIDGE_HOPE = "The next years don’t have to feel like this.";
export const BRIDGE_CTA = "See my plan";

// ── Screen 29 · Plan (the soft paywall) ────────────────────────────────────
// Every price string is built from pricing.ts and appears nowhere else
// (build brief rule 4).

export type ProofRowId = "week_one" | "relief" | "patterns" | "doctor_kit" | "privacy" | "quote";

export const PLAN = {
  headline: (name: string) => `${name}, everything is ready for you.`,
  /** NEW (for Yarin): the first name is optional, so the headline needs a form
   *  without it. Same sentence, name removed — no new claim. */
  headlineNoName: "Everything is ready for you.",
  sub: "Starting Picture · Forecast tuned to what you named · Doctor Kit when you need proof.",
  proof: [
    {
      id: "week_one" as ProofRowId,
      text: "Week one: baseline check-in → Starting Picture → 2 logs → your Forecast opens",
    },
    { id: "relief" as ProofRowId, text: "Relief the moment a day lands Rough or Hard" },
    {
      id: "patterns" as ProofRowId,
      text: "Patterns from your own logs, and a 2-week test to check one",
    },
    { id: "doctor_kit" as ProofRowId, text: "Doctor Kit, a PDF you hand over" },
    { id: "privacy" as ProofRowId, text: "Analyzed on your phone. Never sold." },
    // The matching member quote from 27, filled at render.
    { id: "quote" as ProofRowId, text: "" },
  ],
  annual: {
    price: `${PRICING.annual.monthlyEquivalent} · billed ${PRICING.annual.billed}`,
    trial: `${TRIAL_DAYS} days free`,
    save: PRICING.annual.saveBadge,
    cta: `Start my ${TRIAL_DAYS} days free`,
  },
  monthly: {
    price: `${PRICING.monthly.price} · no trial · cancel anytime`,
    cta: "Continue",
  },
  /** Always visible. No countdown, no badge, no bell. */
  transparency: `${TRIAL_DAYS} days free, then ${PRICING.annual.billedLong} (${PRICING.annual.monthlyEquivalent}). Cancel anytime from the link in your receipt.`,
} as const;

/** 9 · Intensity → the urgency subline, and never for "manageable" (§5). */
export const URGENCY_BY_INTENSITY: Record<string, string> = {
  seriouslyDisrupting: "You said this is seriously disrupting your days.",
  losingControl: "You said it feels like losing control. That’s the day to start, not the day to wait.",
};

/** Proof rows 1–4 reorder with the plan cards; 5 and 6 stay pinned (§5). */
export const CARD_TO_PROOF_ROW: Record<PlanCardId, ProofRowId> = {
  heads_up: "week_one",
  relief: "relief",
  test: "patterns",
  doctor: "doctor_kit",
};

// ── Screen 30 · Checkout ────────────────────────────────────────────────────

export const CHECKOUT = {
  recapLead: "Your Starting Picture is waiting in the app the moment this is done.",
  planLine: (plan: "annual" | "monthly") =>
    plan === "annual"
      ? `Annual · ${TRIAL_DAYS} days free, then ${PRICING.annual.billed}`
      : `Monthly · ${PRICING.monthly.price}`,
  belowForm:
    "You won’t be charged today. We’ll email you two days before the trial ends. Cancel from that email or your receipt in one tap.",
  /** Reuses screen 29's privacy row rather than writing a second privacy line. */
  privacyLine: "Analyzed on your phone. Never sold.",
  support: "support@rythma.co",
} as const;

// ── Screen 31 · Install and sign in (the handoff) ──────────────────────────

export const HANDOFF = {
  headline: "You’re in. Now put it on your phone.",
  steps: [
    { text: "Get Rythma on the App Store" },
    { text: "Open it and tap", strong: "I already joined on the web" },
    { text: "Enter the 6-digit code below (also in the email we just sent)" },
  ],
  reassurance:
    "The app already knows your plan is paid and won’t ask you to buy again. It picks up exactly here: your baseline check-in, then your Peri Score.",
  small: "Receipt and cancel link are in your email. Questions: support@rythma.co.",
} as const;

// ── The first 2-week test candidate (blueprint §5) ─────────────────────────

/**
 * The app's Insights test-catalog keys, verbatim (app handout §2, "the contract
 * as built", 2026-09-10). The handout's older §2b still lists camelCase
 * spellings (`caffeineCutoff2pm` …); the edge function accepts and normalises
 * those, but these are the real catalog keys and the ones its Deno test pins,
 * so these are what the web sends. Flagged to Yarin: §2b is now stale.
 */
export type CandidateTestId =
  | "caffeine_cutoff"
  | "alcohol_free"
  | "screen_curfew"
  | "early_dinner"
  | "morning_walk"
  | "wind_down";

export const CANDIDATE_TESTS: Record<CandidateTestId, string> = {
  caffeine_cutoff: "Caffeine cutoff at 2pm",
  alcohol_free: "Alcohol-free evenings",
  screen_curfew: "Screen curfew at 10pm",
  early_dinner: "Dinner 3+ hours before bed",
  morning_walk: "Morning walk, 20 minutes of daylight",
  wind_down: "10-minute wind-down routine",
};

/** Only on the fallback candidate. */
export const CANDIDATE_FALLBACK_NOTE = "Rythma will suggest a sharper one after your first logs.";

/**
 * First rule that matches, top to bottom. Supplements are deliberately absent
 * from the web. The last row is the fallback and matches anything.
 */
export const CANDIDATE_RULES: readonly {
  input: string;
  symptoms: readonly string[];
  test: CandidateTestId;
}[] = [
  {
    input: "caffeine_after_2pm",
    symptoms: ["sleepDisruption", "anxiety", "heartPalpitations", "nightSweats"],
    test: "caffeine_cutoff",
  },
  {
    input: "drink_most_evenings",
    symptoms: ["hotFlashes", "nightSweats", "sleepDisruption"],
    test: "alcohol_free",
  },
  {
    input: "screens_past_10pm",
    symptoms: ["sleepDisruption", "fatigue"],
    test: "screen_curfew",
  },
  {
    input: "dinner_late",
    symptoms: ["nightSweats", "acidReflux", "bloating", "sleepDisruption"],
    test: "early_dinner",
  },
  {
    input: "low_daylight",
    symptoms: ["fatigue", "moodSwings", "jointPain", "brainFog"],
    test: "morning_walk",
  },
  {
    input: "high_stress",
    symptoms: ["anxiety", "irritability", "rage"],
    test: "wind_down",
  },
];

export const CANDIDATE_FALLBACK: CandidateTestId = "wind_down";

/** The lowercase form used inside UNKNOWNS.linked. Never a new string. */
export function inputLinkLabel(inputId: string): string {
  const q = question("inputs") as MultiQuestion;
  return (q.options.find((o) => o.id === inputId)?.label ?? "").toLowerCase();
}

export function symptomLinkLabel(symptomId: string): string {
  return (symptom(symptomId)?.label ?? "").toLowerCase();
}
