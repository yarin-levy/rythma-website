import { beforeEach, describe, expect, it } from "vitest";
import { GET } from "./route";
import { __resetMock, markProfilePaid, upsertProfile } from "@/lib/sp/profile-api";

function get(rythmaId: string) {
  return GET(new Request(`https://rythma.co/api/sp/profile/${rythmaId}/status`), {
    params: Promise.resolve({ rythmaId }),
  });
}

async function seed(): Promise<string> {
  const { rythma_id } = await upsertProfile({
    email: "sarah@example.com",
    answers: {},
    symptoms: ["brainFog"],
    plan_order: ["doctor", "heads_up", "test", "relief"],
  });
  return rythma_id;
}

beforeEach(() => __resetMock());

describe("screen 31's poll", () => {
  it("says not yet before the webhook has been", async () => {
    const res = await get(await seed());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ paid: false });
  });

  it("hands over the code once paid", async () => {
    const id = await seed();
    const { code } = await markProfilePaid({
      rythma_id: id,
      plan: "annual",
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      trial_ends_at: null,
      manage_url: "https://rythma.co/manage?k=signed",
    });
    const res = await get(id);
    expect(await res.json()).toEqual({ paid: true, code });
  });

  it("gives the browser the code and nothing else — no manage URL, no plan", async () => {
    const id = await seed();
    await markProfilePaid({
      rythma_id: id,
      plan: "annual",
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      trial_ends_at: "2026-09-17T12:00:00.000Z",
      manage_url: "https://rythma.co/manage?k=signed",
    });
    const body = JSON.stringify(await (await get(id)).json());
    expect(body).not.toContain("manage");
    expect(body).not.toContain("annual");
    expect(body).not.toContain("2026-09-17");
  });

  it("404s an id that was never minted", async () => {
    const res = await get("wq_nope");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ paid: false });
  });
});
