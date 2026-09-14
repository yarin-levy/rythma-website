// Attribution, the CAPI dedup key and the haptic — the three funnel-agnostic
// helpers the Starting Picture funnel shares with nothing.
//
// Copied verbatim from src/lib/quiz-analytics.ts (the live 14-screen quiz) so
// that v3 no longer imports from v2. Cutover deletes every v2 file; while
// sp/analytics.ts re-exported these from quiz-analytics.ts, that deletion would
// have broken the new funnel. The sessionStorage key is unchanged on purpose, so
// a visitor mid-session across the flip keeps her UTMs.

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

/** Dedup key shared between the browser Lead and the server-side CAPI Lead. */
export function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `lead-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
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
