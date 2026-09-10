import { beforeAll, describe, expect, it } from "vitest";

// The route captures the secret at module load.
process.env.SP_MANAGE_SECRET ||= "test-manage-secret";

const { manageKey, manageUrl, verifyManageKey, manageSecretConfigured } = await import("../manage-link");

// Ledger D4: the app stores this link for the life of the subscription, so it
// must be stable and it must not be forgeable. A Stripe portal session URL is
// neither — it expires in minutes.
describe("the signed manage link", () => {
  beforeAll(() => expect(manageSecretConfigured()).toBe(true));

  it("round-trips a rythma_id", () => {
    const key = manageKey("wq_abc123");
    expect(verifyManageKey(key)).toBe("wq_abc123");
  });

  it("is stable, so the app can store it once", () => {
    expect(manageKey("wq_abc123")).toBe(manageKey("wq_abc123"));
  });

  it("builds a first-party URL, not a Stripe one", () => {
    const url = manageUrl("https://rythma.co", "wq_abc123");
    expect(url).toMatch(/^https:\/\/rythma\.co\/manage\?k=/);
    expect(url).not.toContain("stripe");
  });

  it("refuses a key edited to point at someone else", () => {
    const key = manageKey("wq_mine");
    const forged = key.replace("wq_mine", "wq_hers");
    expect(verifyManageKey(forged)).toBeNull();
  });

  it("refuses a tampered signature", () => {
    const key = manageKey("wq_abc123");
    expect(verifyManageKey(key.slice(0, -1) + "0")).toBeNull();
  });

  it("refuses nonsense", () => {
    for (const bad of ["", "no-dot", "wq_abc.", ".sig", null]) {
      expect(verifyManageKey(bad)).toBeNull();
    }
  });

  it("carries no condition term, since the app opens it in a browser", () => {
    expect(manageUrl("https://rythma.co", "wq_abc123").toLowerCase()).not.toMatch(
      /perimenopause|menopause|hormone|symptom/,
    );
  });
});
