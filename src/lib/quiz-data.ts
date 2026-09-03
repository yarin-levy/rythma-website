// Peri Score quiz (/quiz) — all copy and structure live here so the emotional
// arc stays in one place. Spec: marketing/peri-score-quiz-spec.md.
//
// Emotional arc: Seen → Named → Measured → Hopeful → Committed → Unresolved.
// The quiz's only job is emotional conviction; the app's onboarding owns
// product conviction. Nothing here transfers to the app — the questions exist
// for the psychological state change, not for the data.
//
// VOICE RULES (see spec §"Voice rules for the designer"):
//  · Answer options are first-person confessions, never neutral labels.
//  · Max one em-dash per sentence.
//  · One pain question only (Q3); every dip is followed by a lift (the beats).
//  · The word "perimenopause" first lands on the Naming beat — as a revelation.
//  · Banned words: "assessment", "symptom checklist", "do you have…".

export type QuestionOption = {
  /** Stable value — keys the branch copy and the PostHog drop-off funnel. */
  value: string;
  label: string;
};

export type SingleQuestion = {
  kind: "single";
  id: string;
  prompt: string;
  sub?: string;
  options: QuestionOption[];
};

export type MultiQuestion = {
  kind: "multi";
  id: string;
  prompt: string;
  sub: string;
  options: QuestionOption[];
  cta: string;
};

export type Question = SingleQuestion | MultiQuestion;

// SCREEN 1 (the landing) is NOT in this file. It is the only server-rendered
// screen, so its copy lives alone in lib/quiz-landing.ts — that keeps
// everything below out of the initial bundle and out of the page's HTML.

// ── SCREENS 2–11 · The eight questions ──────────────────────────────────────
// Order matters. Q1 qualifies, Q2 makes her feel seen, Q3 is the only pure-pain
// question, Q4–Q6 are the evidence layer that feeds the score, Q7 future-paces
// and picks the lead promise on the results, Q8 is the micro-yes.

export const QUESTIONS: Question[] = [
  {
    kind: "single",
    id: "age",
    // NBSP before the em-dash so "First —" never breaks across lines.
    prompt: "We built Rythma for a specific season of a woman's life. First\u00A0— what's yours?",
    options: [
      { value: "under-40", label: "Under 40" },
      { value: "40-44", label: "40–44" },
      { value: "45-49", label: "45–49" },
      { value: "50-54", label: "50–54" },
      { value: "55-plus", label: "55+" },
    ],
  },
  {
    kind: "single",
    id: "recognition",
    prompt: "Be honest — lately, do you still feel like yourself?",
    options: [
      { value: "stranger", label: "Not really. I feel like a stranger in my own body." },
      { value: "some-days", label: "Some days yes. Some days I don't know who I am." },
      { value: "holding-on", label: "I'm holding it together — but it's getting harder." },
      { value: "mostly", label: "Mostly — but something's definitely shifting." },
      { value: "want-me-back", label: "I just want to feel like ME again." },
    ],
  },
  {
    kind: "single",
    id: "wound",
    prompt: "When you've tried to explain what you're going through…",
    options: [
      { value: "stress", label: "I was told it's “just stress” or “just my age.”" },
      { value: "brushed-off", label: "I felt brushed off — like I was overreacting." },
      { value: "havent-told", label: "I haven't told anyone. I don't think they'd get it." },
      { value: "dont-understand", label: "Honestly, even I don't fully understand what's happening." },
    ],
  },
  {
    kind: "multi",
    id: "symptoms",
    prompt: "Which of these have you been experiencing?",
    sub: "Check all that apply — it all counts toward your score.",
    cta: "Continue",
    // Mirrors the app's onboarding grid exactly (Symptom.onboardingSymptoms) so
    // the quiz and the app feel like one product.
    options: [
      { value: "hot-flashes", label: "Hot Flashes" },
      { value: "night-sweats", label: "Night Sweats" },
      { value: "brain-fog", label: "Brain Fog" },
      { value: "anxiety", label: "Anxiety" },
      { value: "mood-swings", label: "Mood Swings" },
      { value: "sleep-problems", label: "Sleep Problems" },
      { value: "fatigue", label: "Fatigue" },
      { value: "weight-changes", label: "Weight Changes" },
      { value: "joint-pain", label: "Joint Pain" },
      { value: "headaches", label: "Headaches" },
      { value: "low-libido", label: "Low Libido" },
      { value: "bloating", label: "Bloating" },
    ],
  },
  {
    kind: "single",
    id: "severity",
    prompt: "How much are these symptoms affecting your daily life?",
    // Option ORDER is the score axis — index 0 is lowest. Do not reorder.
    options: [
      { value: "barely", label: "Barely noticeable" },
      { value: "manageable", label: "Annoying but manageable" },
      { value: "disrupting", label: "Seriously disrupting my days" },
      { value: "losing-control", label: "I feel like I'm losing control" },
    ],
  },
  {
    kind: "single",
    id: "cycle",
    prompt: "Is your cycle still predictable?",
    // Option ORDER is the score axis — index 0 is lowest. Do not reorder.
    options: [
      { value: "predictable", label: "Yes, pretty predictable" },
      { value: "irregular", label: "They've become irregular" },
      { value: "cant-remember", label: "I can't remember my last one" },
      { value: "stopped", label: "I think they've stopped" },
    ],
  },
  {
    kind: "single",
    id: "hope",
    prompt: "If one thing could come back first, what would you want?",
    options: [
      { value: "control", label: "Feeling in control of my days again." },
      { value: "trust-body", label: "Being able to trust my own body." },
      { value: "myself", label: "Feeling like myself." },
      { value: "not-alone", label: "Just knowing I'm not alone in this." },
    ],
  },
  {
    kind: "single",
    id: "readiness",
    prompt: "Are you ready to stop guessing and finally understand what's happening to you?",
    options: [
      { value: "so-ready", label: "Yes. I'm so ready." },
      { value: "need-this", label: "I think so — I really need this." },
      { value: "scared-to-hope", label: "Yes… but I'm scared to hope again." },
    ],
  },
];

// ── SCREEN 5 · BEAT, "The Naming" ───────────────────────────────────────────
// The emotional hinge, and the first place the word "perimenopause" appears.
// It lands client-side, as a revelation rather than a diagnosis.

/** One short branch line echoing her Q3 (wound) answer. */
export const NAMING_ECHO: Record<string, string> = {
  stress: "“Just stress” is what most women get told. It's almost never the whole story.",
  "brushed-off":
    "Being brushed off isn't proof you were overreacting. It's proof you weren't heard.",
  "havent-told": "Carrying this quietly doesn't make it smaller. It only makes it lonelier.",
  "dont-understand": "Not being able to explain it isn't a failure. Nobody handed you the words.",
};

export const BEAT_NAMING = {
  body: "You're not imagining this. What you're describing has a name — and a pattern. Let's find yours.",
  cta: "Continue",
};

// ── SCREEN 9 · BEAT, "The Pattern" ──────────────────────────────────────────
// Hope, earned by the evidence she just gave us herself.
export const BEAT_PATTERN = {
  body: "What you've described isn't random. There's a pattern in it — and once you can see the pattern, hard days stop taking you by surprise.",
  cta: "Continue",
};

// ── SCREEN 12 · Calculating ─────────────────────────────────────────────────
export const CALCULATING = {
  // Names the app mid-funnel, so the App Store handoff on screen 14 reads as
  // the payoff she was promised rather than an ask that appears from nowhere.
  headline: "Building your Rythma profile…",
  steps: [
    "Mapping your symptom profile",
    "Calibrating your Peri Score",
    "Personalizing your plan",
  ],
};

// ── SCREEN 13 · Email capture (skippable) ───────────────────────────────────
export const EMAIL_CAPTURE = {
  headline: "Where should we send your Peri Score profile?",
  placeholder: "Your email",
  cta: "Send it + show my results",
  skip: "Skip — just show my results",
  microcopy: "No spam, ever. Your profile and gentle guidance, whenever you're ready.",
};

// ── SCREEN 14 · Results ─────────────────────────────────────────────────────
export const RESULTS = {
  /**
   * The validation line. N is how many symptoms she checked; M is the pool
   * those are counted against. Every option in the grid is a recognized sign,
   * so today M === N and the line reads "6 of the 6 symptoms you described…".
   * Both are parameters so narrowing the pool later is a one-line change.
   * `one` is the N=1 singular grammar variant.
   */
  validation: {
    one: "The one symptom you described is a recognized sign of perimenopause.",
    /** N is rendered separately and large, so this is the sentence after it. */
    manyTail: (m: number) =>
      `of the ${m} symptoms you described are recognized signs of perimenopause.`,
    /** She checked nothing — keep her in the story without inventing a symptom. */
    none: "Everything you've described fits a season millions of women move through, and almost nobody is prepared for.",
  },
  // She gets the number she was promised on the landing. The open loop moved
  // off the digit and onto its trajectory — which is the honest hook anyway,
  // because tracking change over time is the thing a one-off quiz genuinely
  // cannot do and the app genuinely can.
  gaugeCaption: "This is your starting point. Rythma tracks how it moves from here.",
  promisesHeading: "Built from your answers",
  /**
   * Restates what she earned right before the ask. Singular variant for N=1;
   * omitted entirely at N=0, where there is no count to stand behind.
   */
  countLine: (n: number) =>
    n === 1
      ? "1 recognized sign deserves better than guessing."
      : `${n} recognized signs deserve better than guessing.`,
  /**
   * The closing line. It is the honest form of urgency: no countdown, no
   * expiring offer, nothing invented — just the fact that another hard day is
   * coming whether or not she can see it.
   */
  regret:
    "Your next hard day is already on its way. The only question is whether you see it coming.",
  // Titles only on the results screen — this is a tease, not an explanation.
  // The app's onboarding owns product conviction; the quiz only has to make
  // her want to open it.
  cta: "Start tracking my score",
  // Answers the three objections that stop a tap: cost, effort, commitment.
  ctaSub: "Free to download · 2-minute setup · No account needed to start",
  desktopNote: "Rythma is an iPhone app. Scan to download, or open this page on your phone.",
  rating: "4.9",
  testimonial: {
    quote: "Rythma finally made me feel like what I'm going through is real and trackable.",
    name: "Lauren, 45",
  },
};

export type PromiseCard = {
  /** Icon key — see components/quiz/icons.tsx */
  icon: string;
  /**
   * Ties the card back to something she actually said, a few screens ago. The
   * eyebrow is the whole point of these cards: "Hot flash alerts" is a feature,
   * "Because hot flashes are on your list → Hot flash alerts" is an answer.
   * Note what it does NOT say: her quiz answers do not travel into the app, so
   * nothing here may imply the app already knows them.
   */
  eyebrow: string;
  title: string;
};

/**
 * Forced card when someone else waved her off (Q3). This is the wound the whole
 * quiz opened with, so the app's answer to it outranks any symptom card.
 */
export const WOUND_PROMISE: PromiseCard = {
  icon: "doctor",
  eyebrow: "Because you've been brushed off before",
  title: "A doctor report built from your data",
};

/** The Q3 answers that mean she was dismissed by someone else. */
export const DISMISSED_WOUNDS = ["stress", "brushed-off"];

/**
 * Lead promise, chosen by her Q7 (hope) answer — the app's answer to the exact
 * thing she said she wants back.
 */
export const HOPE_PROMISE: Record<string, PromiseCard> = {
  control: {
    icon: "forecast",
    eyebrow: "Because you said you never know how tomorrow will feel",
    title: "Hard-day predictions",
  },
  "trust-body": {
    icon: "score",
    eyebrow: "Because you want to trust your body again",
    title: "Your score, week by week",
  },
  myself: {
    icon: "pattern",
    eyebrow: "Because you want to feel like you again",
    title: "The patterns behind the chaos",
  },
  "not-alone": {
    icon: "chat",
    eyebrow: "Because you shouldn't have to carry this alone",
    title: "Answers whenever you need them",
  },
};

/**
 * Symptom → promise, mirroring the app's personalized plan
 * (OnboardingViewModel.personalizedPlanItems) so the quiz sets an expectation
 * the app actually meets.
 */
export const SYMPTOM_PROMISE: Record<string, PromiseCard> = {
  "hot-flashes": {
    icon: "flame",
    eyebrow: "Because hot flashes are on your list",
    title: "Hot flash alerts",
  },
  "night-sweats": {
    icon: "moon",
    eyebrow: "Because you're waking up drenched",
    title: "Night sweat tracking",
  },
  "brain-fog": {
    icon: "fog",
    eyebrow: "Because the fog keeps rolling in",
    title: "Brain fog days",
  },
  anxiety: {
    icon: "mood",
    eyebrow: "Because the anxiety arrives out of nowhere",
    title: "Mood shifts",
  },
  "mood-swings": {
    icon: "mood",
    eyebrow: "Because your moods keep swinging on you",
    title: "Mood shifts",
  },
  "sleep-problems": {
    icon: "sleep",
    eyebrow: "Because your sleep's been wrecked",
    title: "Sleep patterns",
  },
  fatigue: {
    icon: "battery",
    eyebrow: "Because you're running on empty",
    title: "Energy tracking",
  },
  "weight-changes": {
    icon: "scale",
    eyebrow: "Because your body is changing shape on you",
    title: "Weight insights",
  },
  "joint-pain": {
    icon: "joint",
    eyebrow: "Because everything aches lately",
    title: "Pain patterns",
  },
  headaches: {
    icon: "bolt",
    eyebrow: "Because the headaches keep coming back",
    title: "Headache patterns",
  },
  "low-libido": {
    icon: "libido",
    eyebrow: "Because that part of you went quiet",
    title: "Libido patterns",
  },
  bloating: {
    icon: "bloating",
    eyebrow: "Because you're bloated more days than not",
    title: "Bloating patterns",
  },
};

/** Fallback cards when she checked no symptoms — still true, still hers. */
export const DEFAULT_PROMISES: PromiseCard[] = [
  {
    icon: "forecast",
    eyebrow: "Because tomorrow shouldn't keep being a surprise",
    title: "Hard-day predictions",
  },
  {
    icon: "cycle",
    eyebrow: "Because your cycle changed the rules on you",
    title: "Cycle intelligence",
  },
];

/**
 * The time-gated block. Every line is something the app can only give her AFTER
 * she starts, which is the honest version of urgency: no countdown, no expiring
 * offer, just the fact that a pattern needs days to become visible. "From a
 * 2-minute baseline" is doing important work — it says plainly that the app
 * starts fresh and her quiz answers do not carry over.
 */
export const TIMELINE = {
  heading: "What starts the moment you do",
  steps: [
    { label: "Day 1", text: "Your full Peri Score, from a 2-minute baseline" },
    { label: "Week 1", text: "Your first weekly forecast" },
    { label: "Week 2–3", text: "Patterns start forming: what triggers what" },
    {
      label: "Your next doctor visit",
      text: "A report built from real data, not memory",
    },
  ],
};

export const APP_STORE_URL =
  "https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611";
export const PRIVACY_URL = "/privacy";
