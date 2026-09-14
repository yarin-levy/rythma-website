import { describe, expect, it } from "vitest";

// No STRIPE_SECRET_KEY in the test env, which is the case this covers: the
// route has to refuse cleanly rather than throw, because the build imports
// every route module and CI has no key.
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

describe("the checkout session route without Stripe configured", () => {
  it("503s instead of crashing", async () => {
    const res = await post({ plan: "annual", rythmaId: "wq_1" });
    expect(res.status).toBe(503);
    const body = (await res.json()) as { error: string };
    // Nothing about keys or configuration reaches her.
    expect(body.error).toBe("Checkout is not available");
    expect(body.error).not.toMatch(/key|stripe|env/i);
  });
});
