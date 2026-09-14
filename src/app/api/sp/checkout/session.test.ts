import { beforeEach, describe, expect, it, vi } from "vitest";

// A second file so the module graph is fresh: `stripeOrNull()` caches its
// client, and route.test.ts proves the no-key path with the same module.
process.env.STRIPE_SECRET_KEY = "sk_test_not_a_real_key";
process.env.STRIPE_PRICE_ANNUAL = "price_annual_test";
process.env.STRIPE_PRICE_MONTHLY = "price_monthly_test";

const created: Record<string, unknown>[] = [];
vi.mock("stripe", () => ({
  default: class {
    checkout = {
      sessions: {
        create: async (args: Record<string, unknown>) => {
          created.push(args);
          return { client_secret: "cs_secret_test" };
        },
      },
    };
  },
}));

const { POST } = await import("./route");

function post(body: unknown) {
  return POST(
    new Request("https://rythma.co/api/sp/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  created.length = 0;
});

describe("the session screen 30 mounts", () => {
  it("returns the client secret for the embedded form", async () => {
    const res = await post({ plan: "annual", rythmaId: "wq_1", email: "s@e.co" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ clientSecret: "cs_secret_test" });
  });

  it("carries the identity contract: client_reference_id is her rythma_id", async () => {
    await post({ plan: "annual", rythmaId: "wq_1", email: "s@e.co" });
    expect(created[0].client_reference_id).toBe("wq_1");
    expect(created[0].customer_email).toBe("s@e.co");
  });

  it("tags the subscription with rythma_id, which is how /manage finds her", async () => {
    await post({ plan: "monthly", rythmaId: "wq_2" });
    expect(created[0].subscription_data).toMatchObject({ metadata: { rythma_id: "wq_2" } });
  });

  // The single biggest conversion lever on a phone. Setting this to ["card"]
  // would silently remove Apple Pay and Google Pay.
  it("leaves payment_method_types to Stripe, so Apple Pay appears", async () => {
    await post({ plan: "annual", rythmaId: "wq_1" });
    expect(created[0]).not.toHaveProperty("payment_method_types");
  });

  it("is embedded, a subscription, and taxed", async () => {
    await post({ plan: "annual", rythmaId: "wq_1" });
    expect(created[0]).toMatchObject({
      mode: "subscription",
      ui_mode: "embedded",
      automatic_tax: { enabled: true },
      redirect_on_completion: "never",
    });
  });

  it("puts the 3-day trial on annual and no trial on monthly", async () => {
    await post({ plan: "annual", rythmaId: "wq_1" });
    await post({ plan: "monthly", rythmaId: "wq_1" });
    expect(created[0].subscription_data).toMatchObject({ trial_period_days: 3 });
    expect(created[1].subscription_data).not.toHaveProperty("trial_period_days");
  });

  it("uses the configured price for each plan", async () => {
    await post({ plan: "annual", rythmaId: "wq_1" });
    await post({ plan: "monthly", rythmaId: "wq_1" });
    expect(created[0].line_items).toEqual([{ price: "price_annual_test", quantity: 1 }]);
    expect(created[1].line_items).toEqual([{ price: "price_monthly_test", quantity: 1 }]);
  });

  it("refuses to take money it could not hand to the app", async () => {
    const res = await post({ plan: "annual" });
    expect(res.status).toBe(400);
    expect(created).toHaveLength(0);
  });

  it("refuses an unknown plan", async () => {
    const res = await post({ plan: "lifetime", rythmaId: "wq_1" });
    expect(res.status).toBe(400);
    expect(created).toHaveLength(0);
  });
});
