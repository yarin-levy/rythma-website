// Quiz analytics — deliberately split in two, and the split is the point.
//
// META PIXEL (spec hard rule 4): STANDARD EVENTS ONLY, ZERO CUSTOM PARAMETERS.
//   · Landing view      → PageView (fired globally in app/layout.tsx) + ViewContent
//   · Email submitted   → Lead
//   · App Store CTA tap → CompleteRegistration, or Lead if she skipped the email
//                         (so every completer produces exactly one Lead)
// No custom events, no custom conversions, no health-flavored content_name, and
// never an email address in the pixel payload or the URL. The email reaches Meta
// only server-side, via the Conversions API in /api/quiz-lead.
//
// POSTHOG (website project 454280): everything else. Per-question drop-off, age
// bucket, score band, skip rate. None of it ever touches Meta.

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
    if (document.referrer) utm.referrer = document.referrer;
    utm.landing_path = window.location.pathname;

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

// ── Meta Pixel ──────────────────────────────────────────────────────────────

/**
 * Fire a bare standard event. `eventId` is Meta's own deduplication key (not a
 * custom parameter) — it pairs a browser event with the matching Conversions
 * API event so the two are counted once.
 */
function fbqTrack(event: "ViewContent" | "Lead" | "CompleteRegistration", eventId?: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (eventId) window.fbq("track", event, undefined, { eventID: eventId });
    else window.fbq("track", event);
  } catch {
    /* never let analytics break the funnel */
  }
}

/** Landing screen viewed. PageView already fires globally in the root layout. */
export function metaViewContent() {
  fbqTrack("ViewContent");
}

/** Email submitted (screen 13), or the results CTA when the email was skipped. */
export function metaLead(eventId?: string) {
  fbqTrack("Lead", eventId);
}

/** App Store CTA tapped (screen 14) by someone who did give us her email. */
export function metaCompleteRegistration() {
  fbqTrack("CompleteRegistration");
}

/** Dedup key shared between the browser Lead and the server-side CAPI Lead. */
export function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `lead-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

// ── PostHog ─────────────────────────────────────────────────────────────────

function ph(event: string, props?: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.capture(event, props);
    });
  } catch {
    /* no-op */
  }
}

export function trackLandingView() {
  ph("quiz_landing_viewed");
}

export function trackStart() {
  ph("quiz_started");
}

/** Per-question answer — this is the drop-off funnel. */
export function trackAnswer(
  questionId: string,
  questionNumber: number,
  answer: string | string[],
) {
  ph("quiz_question_answered", {
    question_id: questionId,
    question_number: questionNumber,
    answer,
    ...(Array.isArray(answer) ? { answer_count: answer.length } : {}),
  });
}

export function trackBeat(beatId: string) {
  ph("quiz_beat_continued", { beat_id: beatId });
}

/**
 * Tag the person with her age bucket the moment she answers Q1, not at the end
 * — the under-40 share among people who *drop off* is exactly what the ad
 * targeting needs. Stays in PostHog; Meta never receives it.
 */
export function tagAgeBucket(bucket: string) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.setPersonProperties({ quiz_age_bucket: bucket });
    });
  } catch {
    /* no-op */
  }
}

/**
 * Reached the results. `age_bucket` is what tunes the Meta ad audience — note
 * that it is read out of PostHog by a human, never sent to Meta by this code.
 */
export function trackComplete(args: {
  ageBucket?: string;
  band: string;
  score: number;
  symptomCount: number;
  gaveEmail: boolean;
}) {
  ph("quiz_completed", {
    age_bucket: args.ageBucket,
    score_band: args.band,
    score: args.score,
    symptom_count: args.symptomCount,
    gave_email: args.gaveEmail,
  });
}

export function trackEmailSubmitted() {
  ph("quiz_email_submitted");
}

export function trackEmailSkipped() {
  ph("quiz_email_skipped");
}

export function trackAppStoreClick(gaveEmail: boolean) {
  ph("quiz_app_store_clicked", { gave_email: gaveEmail });
}

/** Light haptic on select where supported. iOS Safari ignores it; harmless. */
export function haptic(ms = 8) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(ms);
    } catch {
      /* no-op */
    }
  }
}
