// Rythma quiz funnel — all copy and structure live here so the emotional arc
// stays in one place. Order matters: see marketing/quiz-funnel-brief.md §2.
// This quiz is EMOTIONAL ONLY — never clinical, never a symptom checklist.

export type QuestionOption = {
  /** Stable value persisted with the lead + used to key the reveal copy. */
  value: string;
  label: string;
};

export type Question = {
  /** Stable id, persisted with the lead and used for per-question analytics. */
  id: string;
  prompt: string;
  options: QuestionOption[];
};

// SCREEN 1 — Hook headline variants, keyed to the ad angle the visitor clicked.
// Selected via ?v= (e.g. /quiz?v=sleep). The lander should continue the ad's
// sentence; eyebrow / subhead / CTA stay constant.
export const HEADLINE_VARIANTS: Record<string, string> = {
  default:
    "You're not losing your mind. Your body is changing — and almost no one prepared you for it.",
  crazy:
    "You're not losing your mind. Your body is changing — and almost no one prepared you for it.",
  sleep:
    "Wide awake at 3am again? You're not broken. Your body is changing — and almost no one prepared you for it.",
  mood:
    "Snapping at the people you love, then crying in the car? You're not losing it. Your body is changing — and almost no one prepared you for it.",
  alone:
    "You're not the only one — even if it feels that way. Your body is changing, and almost no one prepared you for it.",
};

export const HOOK = {
  eyebrow: "FOR WOMEN IN PERIMENOPAUSE",
  subhead:
    "Rythma isn't built for everyone. Answer 8 quick questions and we'll tell you if it's built for you.",
  cta: "See if Rythma is for me",
  trust:
    "Takes 60 seconds · Private · Built around The Menopause Society's clinical guidance",
};

// SCREENS 2–9 — one question per screen, single select, auto-advance on select.
// Every answer qualifies her; there are no wrong answers and no dead ends.
export const QUESTIONS: Question[] = [
  {
    id: "age",
    prompt: "We built Rythma for a specific season of a woman's life. First — what's yours?",
    options: [
      { value: "under-40", label: "Under 40" },
      { value: "40-44", label: "40–44" },
      { value: "45-49", label: "45–49" },
      { value: "50-54", label: "50–54" },
      { value: "55-plus", label: "55+" },
    ],
  },
  {
    id: "recognition",
    prompt: "Be honest — lately, do you still feel like yourself?",
    options: [
      { value: "stranger", label: "Not really. I feel like a stranger in my own body." },
      { value: "some-days", label: "Some days yes. Some days I don't know who I am." },
      { value: "holding-on", label: "I'm holding it together — but it's getting harder." },
      { value: "want-me-back", label: "I just want to feel like ME again." },
    ],
  },
  {
    id: "wound",
    prompt: "When you've tried to explain what you're going through…",
    options: [
      { value: "stress", label: 'I was told it’s "just stress" or "just my age."' },
      { value: "brushed-off", label: "I felt brushed off — like I was overreacting." },
      { value: "havent-told", label: "I haven't told anyone. I don't think they'd get it." },
      { value: "dont-understand", label: "Honestly, even I don't fully understand what's happening." },
    ],
  },
  {
    id: "hardest",
    prompt: "What's been the hardest part of all this?",
    options: [
      { value: "unpredictable", label: "Never knowing how I'll feel tomorrow." },
      { value: "alone", label: "Feeling completely alone in it." },
      { value: "mirror", label: "Not recognizing the woman in the mirror." },
      { value: "control", label: "Feeling like I've lost control of my own body." },
    ],
  },
  {
    id: "cost",
    prompt: "What has this quietly been taking from you?",
    options: [
      { value: "confidence", label: "My confidence." },
      { value: "patience", label: "My patience — with people I love." },
      { value: "energy", label: "My energy for things I used to enjoy." },
      { value: "identity", label: "My sense of who I am." },
    ],
  },
  {
    id: "isolation",
    prompt: "How often do you feel truly understood right now?",
    options: [
      { value: "almost-never", label: "Almost never." },
      { value: "one-or-two", label: "Only by one or two people." },
      { value: "never", label: "Honestly… never." },
      { value: "stopped-expecting", label: "I've stopped expecting anyone to." },
    ],
  },
  {
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
    id: "readiness",
    prompt: "Are you ready to stop guessing and finally understand what's happening to you?",
    options: [
      { value: "so-ready", label: "Yes. I'm so ready." },
      { value: "need-this", label: "I think so — I really need this." },
      { value: "scared-to-hope", label: "Yes… but I'm scared to hope again." },
    ],
  },
];

// Shown full-bleed for ~1.2s after each answer — makes her feel heard in real time.
// Indexed by question position so each affirmation is deliberate, not random.
export const AFFIRMATIONS: string[] = [
  "Thank you for being honest.",
  "We hear you.",
  "That takes courage to admit.",
  "You're not the only one. Not even close.",
  "We hear you.",
  "You're not the only one. Not even close.",
  "Keep going. You're almost there.",
];

// SCREEN 10 — labor-illusion analysis loader. The cycling text is the star.
export const ANALYSIS_LINES: string[] = [
  "Reading your answers…",
  "Listening to what you're really saying…",
  "Comparing with thousands of women who felt exactly like you…",
  "Checking if Rythma is the right fit for you…",
];

// SCREEN 11 — acceptance reveal.
export const REVEAL = {
  headline: "You belong here.",
  body:
    "Everything you just told us has a name — and it is not in your head. You are exactly the woman we built Rythma for.",
  flipLine: "We don't build Rythma for everyone. We built it for you.",
  // Gentle bridge from "you're seen" → "here's the help".
  bridge: "You've named it. Here's how Rythma helps you carry it.",
  // Qualitative social-proof fallback (no invented number — see brief §8).
  socialProof:
    "You're joining a growing community of women who finally feel understood.",
  reassurance:
    "Private. Gentle. At your own pace. Built around The Menopause Society's guidance.",
  cta: "Claim my place",
  ctaSub: "Takes 60 seconds · No pressure",
};

// What Rythma does — relief-framed (never a diagnosis or outcome guarantee).
export type RevealBenefit = { icon: "calendar" | "pattern" | "shield"; title: string; text: string };
export const REVEAL_BENEFITS: RevealBenefit[] = [
  {
    icon: "calendar",
    title: "Know your hard days before they hit",
    text: "so they stop blindsiding you.",
  },
  {
    icon: "pattern",
    title: "See the pattern behind the chaos",
    text: "in plain language, from your own days.",
  },
  {
    icon: "shield",
    title: "Walk in with proof, not just feelings",
    text: "so your doctor finally listens.",
  },
];

// Social-proof block at the top of the reveal. The "2,000+" is the figure the
// site already publishes on the waitlist — a community/joined count, kept
// separate from the star review so it never reads as a fake App Store rating.
export const REVEAL_SOCIAL = {
  avatars: ["/avatars/1.jpg", "/avatars/2.jpg", "/avatars/3.jpg", "/avatars/4.jpg"],
  joinedLine: "Joined by 2,000+ women in perimenopause",
};

// Real reviews reused from the site's testimonials (not invented).
export type RevealReview = { stars: number; quote: string; name: string };
export const REVEAL_REVIEW_TOP: RevealReview = {
  stars: 5,
  quote: "I finally stopped feeling crazy.",
  name: "Michelle, 49",
};
export const REVEAL_REVIEW_CARD: RevealReview = {
  stars: 5,
  quote:
    "I thought I was losing my mind. Rythma showed me there's a clear pattern to my brain fog days.",
  name: "Nicole, 45",
};

// Age-keyed line — the hardest-hitting beat. Leads the reveal. Keyed to Q1.
export const AGE_REVEAL: Record<string, string> = {
  "under-40":
    "Perimenopause can begin years before anyone warns you. Feeling this in your 30s doesn't make you crazy — it makes you early, and right to pay attention.",
  "40-44":
    "Your early 40s are exactly when perimenopause quietly begins. What you're feeling isn't random — it's right on time.",
  "45-49":
    "You're in the heart of perimenopause. What you're feeling is real, it has a name, and you are not imagining it.",
  "50-54":
    "You're in the thick of this transition. Everything you just told us fits — and you deserve support built for exactly this season.",
  "55-plus":
    "Your body is still changing, and your symptoms still matter — no matter what anyone has told you.",
};

// Personalized echo — keyed to her "wound" answer (Q3). Pairs with the age line.
export const WOUND_ECHO: Record<string, string> = {
  stress:
    "You were told it's just stress. It isn't. And you deserve to be taken seriously.",
  "brushed-off":
    "Being brushed off ends here. Rythma helps you walk in with proof, not just feelings.",
  "havent-told": "You don't have to carry this alone anymore.",
  "dont-understand":
    "You're about to finally understand what your body has been trying to tell you.",
};

// SCREEN 12 — email capture ("claim your place").
export const EMAIL_CAPTURE = {
  headline: "Save your place.",
  body: "You've taken the first step. Let's make sure you don't lose it.",
  placeholder: "Your email",
  cta: "Claim my place",
  microcopy:
    "No spam — ever. Just your starting point and gentle guidance, whenever you're ready.",
};

// SCREEN 13 — download handoff.
export const DOWNLOAD = {
  headline: "Welcome to Rythma.",
  body: "Your place is ready. The app takes it from here — gently, at your own pace.",
  closing: "Built for perimenopause. Built for you.",
  desktopNote: "Rythma is an iPhone app. Scan the code or open this page on your phone to download.",
};

export const APP_STORE_URL =
  "https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611";
export const PRIVACY_URL = "/privacy";

export function getHeadline(variant?: string | null): string {
  if (variant && HEADLINE_VARIANTS[variant]) return HEADLINE_VARIANTS[variant];
  return HEADLINE_VARIANTS.default;
}
