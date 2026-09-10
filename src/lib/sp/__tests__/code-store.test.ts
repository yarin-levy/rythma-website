import { beforeEach, describe, expect, it } from "vitest";
import { __resetCodeStore, recallCode, recallCustomer, rememberCode } from "../code-store";

beforeEach(() => __resetCodeStore());

describe("the code the webhook hands to screen 31", () => {
  it("comes back for the profile it was stored against", () => {
    rememberCode("wq_1", { code: "123456", plan: "annual", trialEndsAt: null });
    expect(recallCode("wq_1")?.code).toBe("123456");
  });

  it("is not readable through another profile's id", () => {
    rememberCode("wq_1", { code: "123456", plan: "annual", trialEndsAt: null });
    expect(recallCode("wq_2")).toBeNull();
  });

  it("returns null rather than throwing when the webhook has not landed yet", () => {
    // This is the ordinary case for the first poll, not an error.
    expect(recallCode("wq_unknown")).toBeNull();
  });

  it("carries the Stripe customer for /manage", () => {
    rememberCode("wq_1", {
      code: "123456",
      plan: "annual",
      trialEndsAt: null,
      stripeCustomerId: "cus_9",
    });
    expect(recallCustomer("wq_1")).toBe("cus_9");
    expect(recallCustomer("wq_2")).toBeNull();
  });
});
