import { beforeEach, describe, expect, it, vi } from "vitest";

// Resend is the only thing this route talks to that we do not want to reach.
// Every Resend call returns { data, error } rather than throwing, so the fake
// mirrors that shape — a fake that throws would hide the route's own handling.
const sent: { to: string; subject: string; html: string }[] = [];
const contacts: string[] = [];
let contactError: { message: string } | null = null;
let emailError: { message: string } | null = null;

vi.mock("resend", () => ({
  Resend: class {
    contacts = {
      create: async ({ email }: { email: string }) => {
        contacts.push(email);
        return { data: null, error: contactError };
      },
    };
    emails = {
      send: async (args: { to: string; subject: string; html: string }) => {
        sent.push(args);
        return { data: null, error: emailError };
      },
    };
  },
}));

// The route captures its env at module load, so this has to precede the import.
// Left unset, it would take the "she was NOT added to any list" branch — a real
// path, but not the one these tests are about.
process.env.RESEND_AUDIENCE_ID ||= "aud_test";

const { POST } = await import("./route");
const { __mockProfile, __resetMock } = await import("@/lib/sp/profile-api");

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request("https://rythma.co/api/sp/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin: "https://rythma.co", ...headers },
      body: JSON.stringify(body),
    }),
  );
}

/** What screen 24 actually posts. */
function submission(over: Record<string, unknown> = {}) {
  return {
    email: "sarah@example.com",
    firstName: "Sarah",
    eventId: "evt-1",
    answers: {
      moment: "dismissed",
      age: "fortyThreeToFortySeven",
      how_long: "couple_years",
      harder: ["work_focus", "sleep"],
      intensity: "losingControl",
      cycle: "noPeriods",
      no_period_reason: "hysterectomy",
      inputs: ["caffeine_after_2pm"],
      tracking: "usingAppDoesntWork",
      doctor: "feltDismissed",
      reflection: "show_doctor",
      matters: "doctorEvidence",
    },
    symptoms: ["brainFog", "anxiety", "nightSweats"],
    attribution: { utm_source: "ig", utm_campaign: "peri-1" },
    ...over,
  };
}

beforeEach(() => {
  __resetMock();
  sent.length = 0;
  contacts.length = 0;
  contactError = null;
  emailError = null;
});

describe("a submitted profile round-trips with the exact enum values", () => {
  it("stores the app's raw values, verbatim, and returns her rythma_id", async () => {
    const res = await post(submission());
    expect(res.status).toBe(200);
    const body = (await res.json()) as { rythmaId: string; warnings: string[] };
    expect(body.rythmaId).toMatch(/^wq_/);

    const stored = __mockProfile(body.rythmaId)!;
    expect(stored.email).toBe("sarah@example.com");
    expect(stored.first_name).toBe("Sarah");
    expect(stored.symptoms).toEqual(["brainFog", "anxiety", "nightSweats"]);
    expect(stored.answers).toEqual({
      moment: "dismissed",
      age: "fortyThreeToFortySeven",
      how_long: "couple_years",
      harder: ["work_focus", "sleep"],
      intensity: "losingControl",
      cycle: "noPeriods",
      no_period_reason: "hysterectomy",
      inputs: ["caffeine_after_2pm"],
      tracking: "usingAppDoesntWork",
      doctor: "feltDismissed",
      reflection: "show_doctor",
      matters: "doctorEvidence",
    });
  });

  it("keeps symptoms out of `answers` — they travel in their own field", async () => {
    const res = await post(submission());
    const { rythmaId } = (await res.json()) as { rythmaId: string };
    expect(__mockProfile(rythmaId)!.answers).not.toHaveProperty("symptoms");
  });

  it("derives candidate_test and plan_order rather than trusting the client", async () => {
    const res = await post(submission({ candidate_test: "morning_walk", plan_order: ["relief"] }));
    const { rythmaId } = (await res.json()) as { rythmaId: string };
    const stored = __mockProfile(rythmaId)!;
    // caffeine after 2pm + night sweats is rule 1, whatever the client claimed.
    expect(stored.candidate_test).toBe("caffeine_cutoff");
    // `feltDismissed` forces Doctor Kit first.
    expect(stored.plan_order).toEqual(["doctor", "heads_up", "test", "relief"]);
  });

  it("updates her row on a resubmit instead of minting a second profile", async () => {
    const first = (await (await post(submission())).json()) as { rythmaId: string };
    const again = (await (
      await post(submission({ rythmaId: first.rythmaId, email: "corrected@example.com" }))
    ).json()) as { rythmaId: string };
    expect(again.rythmaId).toBe(first.rythmaId);
    expect(__mockProfile(first.rythmaId)!.email).toBe("corrected@example.com");
  });

  // Build brief rule 0: one landing page, so there is no variant to report.
  // The app handout's §2 still lists `variant (1-6)` as required — that field
  // has to become optional on the edge function before the real URL is set.
  it("never sends a variant, and ignores one a client tries to add", async () => {
    const res = await post(submission({ variant: 3 }));
    expect(res.status).toBe(200);
    const { rythmaId } = (await res.json()) as { rythmaId: string };
    expect(__mockProfile(rythmaId)).not.toHaveProperty("variant");
  });
});

describe("what it refuses", () => {
  it("400s a missing address, without writing anything", async () => {
    const res = await post(submission({ email: "" }));
    expect(res.status).toBe(400);
    expect(sent).toHaveLength(0);
    expect(contacts).toHaveLength(0);
  });

  it("400s an id that is not the app's, and never names the field to her", async () => {
    const res = await post(submission({ answers: { ...submission().answers, intensity: "barelyNoticeable" } }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).not.toMatch(/intensity|barelyNoticeable/);
    expect(sent).toHaveLength(0);
  });

  it("400s a fork answer that arrives without its trigger", async () => {
    const res = await post(
      submission({
        answers: { ...submission().answers, cycle: "irregular", no_period_reason: "hysterectomy" },
      }),
    );
    expect(res.status).toBe(400);
  });

  it("400s a symptom id that is not one of the app's 30", async () => {
    const res = await post(submission({ symptoms: ["brain_fog"] }));
    expect(res.status).toBe(400);
  });
});

describe("the emails", () => {
  it("sends her Starting Picture and the internal notification", async () => {
    await post(submission());
    expect(sent.map((e) => e.subject)).toEqual([
      "Your Starting Picture",
      "Starting Picture: sarah@example.com (fortyThreeToFortySeven)",
    ]);
    expect(sent[0].to).toBe("sarah@example.com");
  });

  it("puts the upsert's link token in the Open in Rythma href, and nowhere else", async () => {
    const res = await post(submission());
    const { rythmaId } = (await res.json()) as { rythmaId: string };
    const linkToken = __mockProfile(rythmaId)!.link_token;
    expect(sent[0].html).toContain(`https://rythma.co/open?t=${linkToken}`);
    // Never in the visible text.
    expect(sent[0].html.replace(/<[^>]+>/g, " ")).not.toContain(linkToken);
  });

  it("shows her own card: her count, her categories, her candidate test", async () => {
    await post(submission());
    expect(sent[0].html).toContain("Caffeine cutoff at 2pm");
    expect(sent[0].html).toContain("brain fog, anxiety");
    expect(sent[0].html).toContain("Sarah");
  });

  it("adds her to the nurture list", async () => {
    await post(submission());
    expect(contacts).toEqual(["sarah@example.com"]);
  });

  it("treats an address already on the list as a success, not a failure", async () => {
    contactError = { message: "Contact already exists" };
    const res = await post(submission());
    expect(res.status).toBe(200);
    expect(((await res.json()) as { warnings: string[] }).warnings).toEqual([]);
  });

  it("still returns her profile when an email fails — the write is what matters", async () => {
    emailError = { message: "Resend is down" };
    const res = await post(submission());
    expect(res.status).toBe(200);
    const body = (await res.json()) as { rythmaId: string; warnings: string[] };
    expect(body.rythmaId).toMatch(/^wq_/);
    expect(body.warnings).toContain("picture-email-failed");
  });

  it("never puts a health term in the internal subject line", async () => {
    await post(submission());
    for (const email of sent) {
      expect(email.subject.toLowerCase()).not.toMatch(/perimenopause|menopause|hormone/);
    }
  });
});
