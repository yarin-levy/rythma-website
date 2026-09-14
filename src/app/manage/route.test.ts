import { beforeEach, describe, expect, it } from "vitest";

// Env first: both are captured at module load. The fake Stripe key is never
// used to reach the network in these tests — every case is refused before the
// Stripe search would run.
process.env.SP_MANAGE_SECRET ||= "test-manage-secret";
process.env.STRIPE_SECRET_KEY ||= "sk_test_not_a_real_key";

const { GET } = await import("./route");
const { manageKey } = await import("@/lib/sp/manage-link");
const { __resetMock, upsertProfile } = await import("@/lib/sp/profile-api");

function get(k: string | null) {
  const url = k === null ? "https://rythma.co/manage" : `https://rythma.co/manage?k=${encodeURIComponent(k)}`;
  return GET(new Request(url));
}

beforeEach(() => __resetMock());

describe("/manage refuses before it opens anything", () => {
  it("400s a missing key", async () => {
    expect((await get(null)).status).toBe(400);
  });

  it("400s a forged key", async () => {
    const forged = manageKey("wq_mine").replace("wq_mine", "wq_hers");
    expect((await get(forged)).status).toBe(400);
  });

  it("404s a validly signed key for a profile that never paid", async () => {
    const { rythma_id } = await upsertProfile({
      email: "sarah@example.com",
      answers: {},
      symptoms: ["brainFog"],
      plan_order: ["doctor", "heads_up", "test", "relief"],
    });
    const res = await get(manageKey(rythma_id));
    expect(res.status).toBe(404);
  });

  it("never tells her why in a way that names Stripe or a key", async () => {
    const body = (await (await get("nonsense")).json()) as { error: string };
    expect(body.error).not.toMatch(/stripe|key|secret|env/i);
  });
});
