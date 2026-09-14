import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Blueprint §10, transcribed. Every PostHog event the browser may send, and the
// exact property keys it carries (`section` is added to all of them). An event
// not in this table, or a key not listed for it, fails the build.
//
// Two departures, both deliberate and listed in the M4 pull request:
//  · `plan_order[0]` is sent as `plan_order_0` — a bracket in a property name
//    must be quoted in every HogQL query.
//  · checkout_viewed and checkout_abandoned carry `plan` only: §10's
//    `payment_method` is knowable only once she has paid, so it rides on
//    checkout_completed, which the Stripe webhook sends.
export const EVENT_SPEC: Record<string, readonly string[]> = {
  web_quiz_viewed: [],
  web_quiz_started: [],
  web_quiz_step_viewed: ["screen_id", "screen_index", "act"],
  web_quiz_step_answered: ["screen_id", "value|values"],
  web_quiz_act_viewed: ["act"],
  web_quiz_video_started: ["video_id"],
  web_quiz_video_progress: ["video_id", "watched_pct"],
  web_quiz_video_completed: ["video_id"],
  web_quiz_loader_shown: [],
  web_quiz_email_gate_viewed: [],
  web_quiz_email_gate_submitted: [],
  web_quiz_email_gate_failed: [],
  web_quiz_reveal_viewed: ["validation_count", "candidate_test", "top_category"],
  web_quiz_paywall_viewed: ["plan_order_0"],
  web_quiz_plan_selected: ["plan"],
  web_quiz_cta_tapped: ["plan"],
  web_quiz_checkout_viewed: ["plan"],
  web_quiz_checkout_abandoned: ["plan"],
  web_quiz_handoff_viewed: [],
  web_quiz_app_store_redirect: [],
};

const captures: { event: string; props: Record<string, unknown> }[] = [];
const people: Record<string, unknown>[] = [];

vi.mock("posthog-js", () => ({
  default: {
    capture: (event: string, props: Record<string, unknown>) => captures.push({ event, props }),
    setPersonProperties: (props: Record<string, unknown>) => people.push(props),
    get_distinct_id: () => "ph_anon_1",
  },
}));

process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";
const A = await import("../analytics");

/** Every browser-side tracker, once, with realistic values. */
const EVERY_TRACKER: (() => void)[] = [
  () => A.trackLpViewed(),
  () => A.trackStarted(),
  () => A.trackStepViewed("symptoms", 7, "changed"),
  () => A.trackStepAnswered("moment", "dismissed"),
  () => A.trackStepAnswered("symptoms", ["brainFog", "anxiety"]),
  () => A.trackActViewed("changed"),
  () => A.trackAgeBand("fortyThreeToFortySeven"),
  () => A.trackVideoStarted("relief"),
  () => A.trackVideoProgress("relief", 50),
  () => A.trackVideoCompleted("relief"),
  () => A.trackLoaderShown(),
  () => A.trackGateViewed(),
  () => A.trackGateSubmitted(),
  () => A.trackGateFailed(),
  () =>
    A.trackRevealViewed({
      validationCount: 7,
      candidateTest: "caffeine_cutoff",
      topCategory: "mind_mood",
    }),
  () => A.trackPaywallViewed("doctor"),
  () => A.trackPlanSelected("monthly"),
  () => A.trackCtaTapped("annual"),
  () => A.trackCheckoutViewed("annual"),
  () => A.trackCheckoutAbandoned("annual"),
  () => A.trackHandoffViewed(),
  () => A.trackAppStoreRedirect(),
];

/**
 * Fire them one at a time, waiting for each to land. Each tracker loads
 * posthog-js lazily, and Vitest drops some of many *concurrent* dynamic imports
 * of a mocked module — a harness quirk a browser bundle does not have. Firing
 * sequentially tests the same code without depending on it.
 */
async function fireEverything() {
  for (const fire of EVERY_TRACKER) {
    const before = captures.length + people.length;
    fire();
    await vi.waitFor(() => expect(captures.length + people.length).toBeGreaterThan(before), {
      timeout: 1000,
      interval: 2,
    });
  }
}

let sent: { event: string; props: Record<string, unknown> }[] = [];
let personUpdates: Record<string, unknown>[] = [];

// Fire once and let every test read the same snapshot.
beforeAll(async () => {
  await fireEverything();
  sent = [...captures];
  personUpdates = [...people];
});

describe("PostHog events are exactly blueprint §10", () => {
  it("covers every event in the spec, and sends nothing outside it", () => {
    expect([...new Set(sent.map((c) => c.event))].sort()).toEqual(Object.keys(EVENT_SPEC).sort());
  });

  it.each(Object.entries(EVENT_SPEC))("%s carries exactly its §10 properties", (event, keys) => {
    const matching = sent.filter((c) => c.event === event);
    expect(matching.length, `${event} never fired`).toBeGreaterThan(0);

    for (const { props } of matching) {
      const actual = Object.keys(props).filter((k) => k !== "section");
      // `value|values`: a single answer sends `value`, a multi sends `values`.
      const allowed = keys.flatMap((k) => k.split("|"));
      for (const key of actual) expect(allowed, `${event} sent ${key}`).toContain(key);
      for (const key of keys) {
        expect(
          key.split("|").some((a) => actual.includes(a)),
          `${event} is missing ${key}`,
        ).toBe(true);
      }
    }
  });

  it("stamps every event with section=quiz", () => {
    for (const { event, props } of sent) expect(props.section, event).toBe("quiz");
  });

  it("sends answer ids, never labels", () => {
    const moment = sent.find((c) => c.event === "web_quiz_step_answered" && c.props.screen_id === "moment");
    expect(moment?.props).toEqual({ screen_id: "moment", value: "dismissed", section: "quiz" });
  });

  it("sends no email and no first name in any event", () => {
    const json = JSON.stringify(sent);
    expect(json).not.toContain("@");
  });
});

describe("the person carries quiz_age_band, and nothing else", () => {
  it("sets only quiz_age_band, ever", () => {
    expect([...new Set(personUpdates.flatMap((p) => Object.keys(p)))]).toEqual(["quiz_age_band"]);
  });

  it("never puts an email or a symptom on the person", () => {
    const json = JSON.stringify(personUpdates);
    expect(json).not.toContain("@");
    expect(json).not.toMatch(/brainFog|anxiety|symptom/);
  });

  it("no longer sets quiz_variant (build brief rule 0)", () => {
    expect(JSON.stringify(personUpdates)).not.toContain("quiz_variant");
  });
});

// The brief's M4 test: wrap fbq and prove no Meta event carries a custom
// parameter. `eventID` is Meta's own dedup key in the options slot, not a
// custom parameter, so the third argument — custom data — must always be absent.
describe("Meta gets bare standard events", () => {
  const calls: unknown[][] = [];
  beforeEach(() => {
    calls.length = 0;
    (globalThis as { window?: unknown }).window = {
      fbq: (...args: unknown[]) => calls.push(args),
    };
  });

  it("fires ViewContent, Lead and InitiateCheckout with no custom data", () => {
    A.metaViewContent();
    A.metaLead("evt-123");
    A.metaInitiateCheckout();

    expect(calls.map((c) => c[1])).toEqual(["ViewContent", "Lead", "InitiateCheckout"]);
    for (const call of calls) {
      expect(call[0]).toBe("track");
      expect(call[2], `${call[1]} carried custom data`).toBeUndefined();
    }
  });

  it("passes the Lead dedup key as eventID in the options slot, and nothing else", () => {
    A.metaLead("evt-123");
    expect(calls[0]).toEqual(["track", "Lead", undefined, { eventID: "evt-123" }]);
  });

  it("offers no way to fire a purchase from the browser", () => {
    const exported = Object.keys(A);
    expect(exported.filter((k) => /purchase|trial|subscribe/i.test(k))).toEqual([]);
  });
});

describe("the id that joins the webhook to her funnel", () => {
  it("is her PostHog distinct id", async () => {
    expect(await A.analyticsId()).toBe("ph_anon_1");
  });
});
