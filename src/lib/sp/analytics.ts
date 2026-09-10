// Starting Picture funnel analytics — blueprint §10, and the Meta rules in §9.
//
// The split from quiz-analytics.ts is kept exactly: PostHog gets the detail,
// Meta gets bare standard events with ZERO custom parameters. `fbqTrack` here
// takes no property bag at all, which is the only way to guarantee that.
//
// Attribution capture, the haptic and the CAPI dedup key are reused from
// quiz-analytics.ts rather than duplicated — they are funnel-agnostic.

export { captureAttribution, getAttribution, haptic, newEventId } from "@/lib/quiz-analytics";

// ── PostHog (website project 454280) ────────────────────────────────────────

function ph(event: string, props?: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.capture(event, props);
    });
  } catch {
    /* never let analytics break the funnel */
  }
}

function person(props: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.setPersonProperties(props);
    });
  } catch {
    /* no-op */
  }
}

export function trackLpViewed() {
  ph("web_quiz_viewed");
}

export function trackStarted() {
  ph("web_quiz_started");
}

export function trackStepViewed(screenId: string, screenIndex: number, act: string) {
  ph("web_quiz_step_viewed", { screen_id: screenId, screen_index: screenIndex, act });
}

/** Answer ids only. PostHog is first-party; this is what makes drop-off diagnosable. */
export function trackStepAnswered(screenId: string, value: string | string[]) {
  ph("web_quiz_step_answered", {
    screen_id: screenId,
    ...(Array.isArray(value) ? { values: value } : { value }),
  });
}

export function trackActViewed(act: string) {
  ph("web_quiz_act_viewed", { act });
}

export function trackAgeBand(band: string) {
  person({ quiz_age_band: band });
}

export function trackVideoStarted(videoId: string) {
  ph("web_quiz_video_started", { video_id: videoId });
}

export function trackVideoProgress(videoId: string, watchedPct: number) {
  ph("web_quiz_video_progress", { video_id: videoId, watched_pct: watchedPct });
}

export function trackVideoCompleted(videoId: string) {
  ph("web_quiz_video_completed", { video_id: videoId });
}

export function trackLoaderShown() {
  ph("web_quiz_loader_shown");
}

export function trackGateViewed() {
  ph("web_quiz_email_gate_viewed");
}

export function trackGateSubmitted() {
  ph("web_quiz_email_gate_submitted");
}

export function trackGateFailed() {
  ph("web_quiz_email_gate_failed");
}

export function trackRevealViewed(args: { validationCount: number; candidateTest: string; topCategory?: string }) {
  ph("web_quiz_reveal_viewed", {
    validation_count: args.validationCount,
    candidate_test: args.candidateTest,
    top_category: args.topCategory,
  });
}

export function trackPaywallViewed(leadPlanCard: string) {
  ph("web_quiz_paywall_viewed", { plan_order_0: leadPlanCard });
}

export function trackPlanSelected(plan: string) {
  ph("web_quiz_plan_selected", { plan });
}

export function trackCtaTapped(plan: string) {
  ph("web_quiz_cta_tapped", { plan });
}

export function trackCheckoutViewed(plan: string) {
  ph("web_quiz_checkout_viewed", { plan });
}

export function trackHandoffViewed() {
  ph("web_quiz_handoff_viewed");
}

export function trackAppStoreRedirect() {
  ph("web_quiz_app_store_redirect");
}

// ── Meta Pixel ──────────────────────────────────────────────────────────────
//
// Standard events, no parameters, ever. `eventID` is Meta's own dedup key, not
// a custom parameter — it pairs a browser event with the matching CAPI event.
// Purchase events are SERVER-SIDE ONLY, from the Stripe webhook (M3); nothing
// in this file may ever fire one.

type MetaEvent = "ViewContent" | "Lead" | "InitiateCheckout";

function fbqTrack(event: MetaEvent, eventId?: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (eventId) window.fbq("track", event, undefined, { eventID: eventId });
    else window.fbq("track", event);
  } catch {
    /* no-op */
  }
}

/** LP viewed. PageView already fires globally in the root layout. */
export function metaViewContent() {
  fbqTrack("ViewContent");
}

/** Screen 24, exactly once per completer, paired with the CAPI Lead. */
export function metaLead(eventId?: string) {
  fbqTrack("Lead", eventId);
}

/** Screen 29's CTA. */
export function metaInitiateCheckout() {
  fbqTrack("InitiateCheckout");
}
