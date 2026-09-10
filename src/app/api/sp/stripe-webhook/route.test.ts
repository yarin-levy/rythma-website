import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Env is captured at module load, so it goes first. A fake secret key is fine:
// the only Stripe call this test exercises is `webhooks.constructEvent`, which
// is pure HMAC and touches no network.
const WEBHOOK_SECRET = "whsec_test_secret";
process.env.STRIPE_SECRET_KEY ||= "sk_test_not_a_real_key";
process.env.STRIPE_WEBHOOK_SECRET ||= WEBHOOK_SECRET;
process.env.SP_MANAGE_SECRET ||= "test-manage-secret";
process.env.META_CAPI_ACCESS_TOKEN ||= "capi-test-token";
process.env.META_PIXEL_ID ||= "111";

const sentEmails: { to: string; subject: string; html: string }[] = [];
vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: async (args: { to: string; subject: string; html: string }) => {
        sentEmails.push(args);
        return { data: null, error: null };
      },
    };
  },
}));

const { POST } = await import("./route");
const { upsertProfile, __resetMock, __mockProfile } = await import("@/lib/sp/profile-api");
const { recallCode, __resetCodeStore } = await import("@/lib/sp/code-store");

/** Stripe's own scheme: `t=<ts>,v1=<hmac(secret, "<ts>.<payload>")>`. */
function sign(payload: string, secret = WEBHOOK_SECRET): string {
  const t = Math.floor(Date.now() / 1000);
  const v1 = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return `t=${t},v1=${v1}`;
}

function post(event: unknown, opts: { signature?: string | null } = {}) {
  const payload = JSON.stringify(event);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    origin: "https://rythma.co",
  };
  const signature = opts.signature === undefined ? sign(payload) : opts.signature;
  if (signature) headers["stripe-signature"] = signature;
  return POST(
    new Request("https://rythma.co/api/sp/stripe-webhook", {
      method: "POST",
      headers,
      body: payload,
    }),
  );
}

function completedEvent(over: Record<string, unknown> = {}, id = `evt_${Math.random()}`) {
  return {
    id,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_1",
        object: "checkout.session",
        // No `subscription`, so the handler does not reach out to Stripe.
        client_reference_id: "PLACEHOLDER",
        customer: "cus_test_1",
        customer_details: { email: "sarah@example.com" },
        amount_total: 5999,
        payment_method_types: ["card"],
        ...over,
      },
    },
  };
}

/** A real profile to mark paid. */
async function seedProfile(): Promise<string> {
  const { rythma_id } = await upsertProfile({
    email: "sarah@example.com",
    first_name: "Sarah",
    answers: { age: "fortyThreeToFortySeven" },
    symptoms: ["brainFog"],
    candidate_test: "wind_down",
    plan_order: ["doctor", "heads_up", "test", "relief"],
  });
  return rythma_id;
}

let capiCalls: { url: string; body: Record<string, unknown> }[] = [];

beforeEach(() => {
  __resetMock();
  __resetCodeStore();
  sentEmails.length = 0;
  capiCalls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: { body?: string }) => {
      capiCalls.push({ url: String(url), body: JSON.parse(init?.body ?? "{}") });
      return { ok: true, status: 200, text: async () => "", json: async () => ({}) };
    }),
  );
});

describe("the signature is the door", () => {
  it("400s an unsigned request", async () => {
    const res = await post(completedEvent(), { signature: null });
    expect(res.status).toBe(400);
    expect(sentEmails).toHaveLength(0);
  });

  it("400s a request signed with the wrong secret", async () => {
    const payload = JSON.stringify(completedEvent());
    const res = await POST(
      new Request("https://rythma.co/api/sp/stripe-webhook", {
        method: "POST",
        headers: { "stripe-signature": sign(payload, "whsec_wrong") },
        body: payload,
      }),
    );
    expect(res.status).toBe(400);
    expect(sentEmails).toHaveLength(0);
  });

  it("400s a body edited after signing", async () => {
    const payload = JSON.stringify(completedEvent());
    const signature = sign(payload);
    const res = await POST(
      new Request("https://rythma.co/api/sp/stripe-webhook", {
        method: "POST",
        headers: { "stripe-signature": signature },
        body: payload.replace("5999", "1"),
      }),
    );
    expect(res.status).toBe(400);
  });
});

describe("a completed checkout", () => {
  it("marks the profile paid, keeps the code for screen 31, and emails it", async () => {
    const rythmaId = await seedProfile();
    const res = await post(completedEvent({ client_reference_id: rythmaId }));
    expect(res.status).toBe(200);

    const stored = recallCode(rythmaId);
    expect(stored?.code).toMatch(/^\d{6}$/);
    expect(stored?.stripeCustomerId).toBe("cus_test_1");

    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0].to).toBe("sarah@example.com");
    expect(sentEmails[0].subject).toBe("You’re in. Here’s your code");
    expect(sentEmails[0].html).toContain(stored!.code.split("").join(" "));
    expect(__mockProfile(rythmaId)?.code).toBe(stored!.code);
  });

  it("puts the signed manage link in the email, never a Stripe portal URL", async () => {
    const rythmaId = await seedProfile();
    await post(completedEvent({ client_reference_id: rythmaId }));
    expect(sentEmails[0].html).toContain("https://rythma.co/manage?k=");
    expect(sentEmails[0].html).not.toContain("billing.stripe.com");
  });

  it("puts the link token in the Open in Rythma href", async () => {
    const rythmaId = await seedProfile();
    await post(completedEvent({ client_reference_id: rythmaId }));
    const token = __mockProfile(rythmaId)!.link_token;
    expect(sentEmails[0].html).toContain(`https://rythma.co/open?t=${token}`);
  });

  // Stripe retries. A retry must not send a second email or a second
  // conversion — the first would confuse her, the second would corrupt Meta's
  // optimisation with a purchase that never happened.
  it("is idempotent by Stripe event id", async () => {
    const rythmaId = await seedProfile();
    const event = completedEvent({ client_reference_id: rythmaId }, "evt_fixed");

    const first = await post(event);
    const retry = await post(event);

    expect(first.status).toBe(200);
    expect(retry.status).toBe(200);
    expect((await retry.json()).duplicate).toBe(true);
    expect(sentEmails).toHaveLength(1);
    expect(capiCalls.filter((c) => c.url.includes("graph.facebook.com"))).toHaveLength(1);
  });

  // She has paid and the app cannot see it. A 500 is right: Stripe retries.
  it("500s when the profile write fails, so Stripe tries again", async () => {
    const res = await post(completedEvent({ client_reference_id: "wq_never_created" }));
    expect(res.status).toBe(500);
    expect(sentEmails).toHaveLength(0);
  });

  it("does nothing but shout when a paid session carries no rythma_id", async () => {
    const res = await post(completedEvent({ client_reference_id: null }));
    expect(res.status).toBe(200);
    expect(sentEmails).toHaveLength(0);
  });
});

// Build brief rule 5 and blueprint §9: purchase events are server-side only,
// and every Meta event carries value and currency and nothing else.
describe("the purchase signal to Meta", () => {
  it("sends value and currency, and no other custom parameter", async () => {
    const rythmaId = await seedProfile();
    await post(completedEvent({ client_reference_id: rythmaId }));

    const capi = capiCalls.find((c) => c.url.includes("graph.facebook.com"));
    expect(capi, "no CAPI call was made").toBeTruthy();
    const event = (capi!.body as { data: Record<string, unknown>[] }).data[0];
    expect(event.custom_data).toEqual({ value: 59.99, currency: "USD" });
  });

  it("carries no answer, no symptom and no plaintext email", async () => {
    const rythmaId = await seedProfile();
    await post(completedEvent({ client_reference_id: rythmaId }));
    const capi = capiCalls.find((c) => c.url.includes("graph.facebook.com"))!;
    const json = JSON.stringify(capi.body);
    expect(json).not.toContain("sarah@example.com");
    expect(json).not.toContain("brainFog");
    expect(json.toLowerCase()).not.toMatch(/perimenopause|menopause|symptom/);
  });

  it("names it Purchase when there is no trial", async () => {
    const rythmaId = await seedProfile();
    await post(completedEvent({ client_reference_id: rythmaId }));
    const capi = capiCalls.find((c) => c.url.includes("graph.facebook.com"))!;
    const event = (capi!.body as { data: Record<string, unknown>[] }).data[0];
    expect(event.event_name).toBe("Purchase");
  });

  it("uses the Stripe event id as the dedup key", async () => {
    const rythmaId = await seedProfile();
    await post(completedEvent({ client_reference_id: rythmaId }, "evt_dedup"));
    const capi = capiCalls.find((c) => c.url.includes("graph.facebook.com"))!;
    const event = (capi!.body as { data: Record<string, unknown>[] }).data[0];
    expect(event.event_id).toBe("evt_dedup");
  });
});

describe("the subscription and invoice events", () => {
  it.each([
    ["customer.subscription.updated", { status: "active", cancel_at_period_end: false }],
    ["customer.subscription.deleted", {}],
    ["invoice.payment_failed", {}],
  ])("acknowledges %s without sending anything to her", async (type, object) => {
    const res = await post({
      id: `evt_${type}`,
      object: "event",
      type,
      data: { object: { id: "sub_1", customer: "cus_1", ...object } },
    });
    expect(res.status).toBe(200);
    expect(sentEmails).toHaveLength(0);
  });

  it("acknowledges an event it does not care about", async () => {
    const res = await post({
      id: "evt_noise",
      object: "event",
      type: "payment_intent.created",
      data: { object: {} },
    });
    expect(res.status).toBe(200);
  });
});
