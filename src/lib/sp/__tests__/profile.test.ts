import { beforeEach, describe, expect, it } from "vitest";
import { ProfileApiError, newRythmaId, validateUpsert, type UpsertRequest } from "../profile-contract";
import { __mockProfile, __resetMock, markProfilePaid, upsertProfile, usingMock } from "../profile-api";
import { buildStartingPicture } from "../reveal";
import { CANDIDATE_TESTS, SYMPTOM_IDS, optionIds } from "../data";
import { PRICING, TRIAL_DAYS } from "../pricing";
import { PLAN, CHECKOUT } from "../data";

// The contract these assert is the app handout §2 / build brief §2b one, as
// built. The mock runs the same validation the edge function runs, so a payload
// that passes here passes there.

function payload(over: Partial<UpsertRequest> = {}): UpsertRequest {
  return {
    email: "sarah@example.com",
    first_name: "Sarah",
    answers: {
      moment: "dismissed",
      age: "fortyThreeToFortySeven",
      how_long: "few_months",
      harder: ["work_focus"],
      intensity: "seriouslyDisrupting",
      cycle: "irregular",
      inputs: ["caffeine_after_2pm"],
      tracking: "usingAppDoesntWork",
      doctor: "feltDismissed",
      reflection: "show_doctor",
      matters: "doctorEvidence",
    },
    symptoms: ["brainFog", "sleepDisruption", "nightSweats"],
    candidate_test: "caffeine_cutoff",
    plan_order: ["doctor", "heads_up", "test", "relief"],
    ...over,
  };
}

beforeEach(() => __resetMock());

describe("validation mirrors the edge function", () => {
  it("accepts a full, well-formed payload", () => {
    expect(validateUpsert(payload())).toBeNull();
  });

  it.each(["age", "intensity", "cycle", "tracking", "doctor", "matters"])(
    "rejects an unknown %s and names the field",
    (key) => {
      const problem = validateUpsert(payload({ answers: { ...payload().answers, [key]: "not-a-real-value" } }));
      expect(problem).toEqual({ error: "invalid", field: key, message: expect.any(String) });
    },
  );

  it.each(["age", "intensity", "cycle", "tracking", "doctor", "matters"])(
    "accepts every one of the app's %s raw values",
    (key) => {
      for (const id of optionIds(key)) {
        expect(validateUpsert(payload({ answers: { ...payload().answers, [key]: id } })), `${key}=${id}`).toBeNull();
      }
    },
  );

  it("accepts no_period_reason only alongside cycle=noPeriods", () => {
    const withTrigger = payload({
      answers: { ...payload().answers, cycle: "noPeriods", no_period_reason: "hysterectomy" },
    });
    expect(validateUpsert(withTrigger)).toBeNull();

    const orphaned = payload({
      answers: { ...payload().answers, cycle: "irregular", no_period_reason: "hysterectomy" },
    });
    expect(validateUpsert(orphaned)?.field).toBe("no_period_reason");
  });

  it("accepts all 30 Symptom raw values and rejects anything else", () => {
    expect(validateUpsert(payload({ symptoms: [...SYMPTOM_IDS] }))).toBeNull();
    expect(validateUpsert(payload({ symptoms: ["brainFog", "brain_fog"] }))?.field).toBe("symptoms");
  });

  it("accepts every catalog key for candidate_test and rejects the stale spellings", () => {
    for (const id of Object.keys(CANDIDATE_TESTS)) {
      expect(validateUpsert(payload({ candidate_test: id as never }))).toBeNull();
    }
    // The handout's §2b spelling, which the edge function normalises but which
    // we must never be the ones to send.
    expect(validateUpsert(payload({ candidate_test: "caffeineCutoff2pm" as never }))?.field).toBe("candidate_test");
  });

  // Yarin removed the landing-page variants on 2026-09-10 (build brief rule 0),
  // so the web has nothing to report and the field is gone from the payload.
  it("has no variant in the payload at all", () => {
    expect(payload()).not.toHaveProperty("variant");
    expect(validateUpsert(payload())).toBeNull();
  });

  it("rejects a missing address", () => {
    expect(validateUpsert(payload({ email: "" }))?.field).toBe("email");
  });

  it("lets the web-only keys through untouched — the app stores them as given", () => {
    const problem = validateUpsert(
      payload({
        answers: {
          ...payload().answers,
          moment: "anything",
          how_long: "anything",
          harder: ["anything"],
          inputs: ["anything"],
          reflection: "anything",
        },
      }),
    );
    expect(problem).toBeNull();
  });
});

describe("rythma_id", () => {
  it('is "wq_" + a uuid', () => {
    expect(newRythmaId()).toMatch(/^wq_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });
});

describe("the in-process mock stands in for the edge functions", () => {
  it("is what runs while SP_PROFILE_API_URL is unset", () => {
    expect(usingMock()).toBe(true);
  });

  it("mints a rythma_id and a link token on the first call", async () => {
    const created = await upsertProfile(payload());
    expect(created.rythma_id).toMatch(/^wq_/);
    expect(created.link_token).toMatch(/^[0-9a-f]{64}$/);
  });

  it("stores the exact enum values it was sent", async () => {
    const sent = payload();
    const { rythma_id } = await upsertProfile(sent);
    const stored = __mockProfile(rythma_id)!;
    expect(stored.answers).toEqual(sent.answers);
    expect(stored.symptoms).toEqual(["brainFog", "sleepDisruption", "nightSweats"]);
    expect(stored.candidate_test).toBe("caffeine_cutoff");
    expect(stored.first_name).toBe("Sarah");
    expect(stored).not.toHaveProperty("variant");
  });

  it("updates the same row when the id comes back, and does not mint a second", async () => {
    const first = await upsertProfile(payload());
    const second = await upsertProfile(payload({ rythma_id: first.rythma_id, email: "corrected@example.com" }));
    expect(second.rythma_id).toBe(first.rythma_id);
    expect(second.link_token).toBe(first.link_token);
    expect(__mockProfile(first.rythma_id)!.email).toBe("corrected@example.com");
  });

  it("400s an invalid payload with the field, before anything is stored", async () => {
    await expect(upsertProfile(payload({ symptoms: ["not-a-symptom"] }))).rejects.toMatchObject({
      status: 400,
      body: { error: "invalid", field: "symptoms" },
    });
  });

  it("404s a rythma_id it never minted", async () => {
    await expect(upsertProfile(payload({ rythma_id: "wq_nope" }))).rejects.toMatchObject({
      status: 404,
      body: { error: "unknown_profile" },
    });
  });

  it("throws ProfileApiError, so the route can read status and field", async () => {
    const error = await upsertProfile(payload({ symptoms: ["nope"] })).catch((e) => e);
    expect(error).toBeInstanceOf(ProfileApiError);
    expect(error.status).toBe(400);
  });

  describe("paid", () => {
    const paid = (rythma_id: string, sub = "sub_1") => ({
      rythma_id,
      plan: "annual" as const,
      stripe_customer_id: "cus_1",
      stripe_subscription_id: sub,
      trial_ends_at: null,
      manage_url: "https://rythma.co/manage?k=signed",
    });

    it("mints a six-digit code and reuses the link token from upsert", async () => {
      const created = await upsertProfile(payload());
      const result = await markProfilePaid(paid(created.rythma_id));
      expect(result.code).toMatch(/^\d{6}$/);
      expect(result.link_token).toBe(created.link_token);
    });

    it("is idempotent per subscription id — a webhook retry returns the same code", async () => {
      const created = await upsertProfile(payload());
      const first = await markProfilePaid(paid(created.rythma_id));
      const retry = await markProfilePaid(paid(created.rythma_id));
      expect(retry).toEqual(first);
    });

    it("404s an unknown profile", async () => {
      await expect(markProfilePaid(paid("wq_nope"))).rejects.toMatchObject({
        status: 404,
        body: { error: "unknown_profile" },
      });
    });
  });
});

describe("what the route derives rather than trusts", () => {
  it("computes the candidate test from her answers, so a crafted one cannot land", () => {
    const picture = buildStartingPicture({
      inputs: ["caffeine_after_2pm"],
      symptoms: ["nightSweats"],
    });
    expect(picture.candidate.id).toBe("caffeine_cutoff");
    expect(Object.keys(CANDIDATE_TESTS)).toContain(picture.candidate.id);
  });

  it("always derives a plan order of all four cards", () => {
    const picture = buildStartingPicture({ matters: "doctorEvidence" });
    expect(new Set(picture.planOrder).size).toBe(4);
  });
});

// Rule 4: prices, trial length and plan names come from pricing.ts only. Yarin
// moved the web trial from 7 days to 3 on 2026-09-10; this is what stops a
// stale "7 days free" surviving somewhere in the copy.
describe("the trial length has one source", () => {
  it("is 3 days", () => {
    expect(TRIAL_DAYS).toBe(3);
    expect(PRICING.annual.trialDays).toBe(TRIAL_DAYS);
    expect(PRICING.monthly.trialDays).toBe(0);
  });

  it("says the same number everywhere it is spoken", () => {
    const spoken = [PLAN.annual.trial, PLAN.annual.cta, PLAN.transparency, CHECKOUT.planLine("annual")];
    for (const line of spoken) {
      expect(line, line).toContain(String(TRIAL_DAYS));
      expect(line, line).not.toMatch(/\b7\b/);
    }
  });

  it("never promises a trial on monthly", () => {
    expect(PLAN.monthly.price).toMatch(/no trial/);
    expect(CHECKOUT.planLine("monthly")).not.toMatch(/free/);
  });
});
