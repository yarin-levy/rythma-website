// Meta Pixel events + UTM capture for the quiz funnel.
// The base Pixel + PageView are already loaded globally in app/layout.tsx.
// Here we add the funnel-specific events. `Lead` (email submit) is the event
// to optimize Meta campaigns toward (see brief §6).

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_adset",
  "utm_ad",
  "fbclid",
] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  variant?: string;
  referrer?: string;
  landing_path?: string;
};

const STORAGE_KEY = "rythma_quiz_attribution";

/** Capture UTM/click params on first load and persist for the session. */
export function captureAttribution(): Utm {
  if (typeof window === "undefined") return {};
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing) as Utm;

    const params = new URLSearchParams(window.location.search);
    const utm: Utm = {};
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) utm[key] = v;
    }
    const variant = params.get("v");
    if (variant) utm.variant = variant;
    if (document.referrer) utm.referrer = document.referrer;
    utm.landing_path = window.location.pathname + window.location.search;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    return utm;
  } catch {
    return {};
  }
}

export function getAttribution(): Utm {
  if (typeof window === "undefined") return {};
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    return existing ? (JSON.parse(existing) as Utm) : {};
  } catch {
    return {};
  }
}

function track(event: string, params?: Record<string, unknown>, custom = false) {
  // Meta Pixel (campaign optimization).
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq(custom ? "trackCustom" : "track", event, params);
    } catch {
      /* never let analytics break the funnel */
    }
  }
  // PostHog (product analytics) — same events, snake_case names for cleaner
  // insights. Loaded lazily so it never blocks or breaks the funnel. Skipped
  // when no key is configured (e.g. local dev) so it stays silent.
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    try {
      import("posthog-js").then(({ default: posthog }) => {
        posthog.capture(toSnake(event), params);
      });
    } catch {
      /* no-op */
    }
  }
}

/** ViewContent -> view_content, QuizStart -> quiz_start, etc. */
function toSnake(event: string) {
  return event
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

// Screen 1 view
export function trackViewContent() {
  track("ViewContent", { content_name: "quiz_funnel" });
}

// First question answered
export function trackQuizStart() {
  track("QuizStart", undefined, true);
}

// Per-question answer — lets the user see exactly where people drop off.
export function trackQuestionAnswer(questionId: string, index: number, value: string) {
  track(
    "QuizAnswer",
    { question_id: questionId, question_index: index + 1, answer: value },
    true,
  );
}

// Reached the analysis screen (effectively quiz complete)
export function trackQuizComplete(age?: string) {
  track("QuizComplete", { age }, true);
}

// Email submitted — THE optimization event. Carry age + UTMs for attribution.
export function trackLead(age: string | undefined, utm: Utm) {
  track("Lead", {
    content_name: "quiz_funnel",
    age,
    utm_source: utm.utm_source,
    utm_campaign: utm.utm_campaign,
    utm_adset: utm.utm_adset,
    utm_ad: utm.utm_ad,
  });
}

// Tapped through to the App Store
export function trackDownloadClick() {
  track("QuizDownloadClick", undefined, true);
}

/** Light haptic on answer-select where supported (iOS Safari ignores this, but
 *  Android Chrome / some browsers honor it — harmless polish). */
export function haptic(ms = 8) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(ms);
    } catch {
      /* no-op */
    }
  }
}
