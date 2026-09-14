// The client for the app's two web-facing Supabase edge functions, with an
// in-process mock that stands in until Yarin supplies the URL and the key.
//
// Build brief §2b:
//   POST {SP_PROFILE_API_URL}/web-profile-upsert  → { rythma_id, link_token? }
//   POST {SP_PROFILE_API_URL}/web-profile-paid    → { code, link_token }
//   header: x-rythma-web-key: {SP_PROFILE_API_KEY}
//
// Slugs are hyphenated because Supabase forbids "/" in a function name — this
// is not `web-profile/upsert`.
//
// The mock runs the same `validateUpsert` the real function runs and returns
// the same status codes, so code written against it does not discover new
// failures on the day the env vars arrive. It is per-process memory: it does
// not survive a restart and is not shared between serverless instances, which
// is exactly why it is a development stand-in and not a fallback for
// production. Set SP_PROFILE_API_URL and the real function takes over.

import {
  ProfileApiError,
  newRythmaId,
  validateUpsert,
  type PaidRequest,
  type PaidResponse,
  type UpsertRequest,
  type UpsertResponse,
} from "./profile-contract";

const BASE_URL = process.env.SP_PROFILE_API_URL;
const API_KEY = process.env.SP_PROFILE_API_KEY;

export function usingMock(): boolean {
  return !process.env.SP_PROFILE_API_URL;
}

// ── The in-process mock ─────────────────────────────────────────────────────

type MockProfile = UpsertRequest & {
  rythma_id: string;
  link_token: string;
  code?: string;
  paid_at?: string;
  stripe_subscription_id?: string;
};

const mockStore = new Map<string, MockProfile>();

/** Test seam. Never called in the route. */
export function __resetMock() {
  mockStore.clear();
}

export function __mockProfile(rythmaId: string): MockProfile | undefined {
  return mockStore.get(rythmaId);
}

function token(bytes = 32): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

function mockUpsert(payload: UpsertRequest): UpsertResponse {
  const problem = validateUpsert(payload);
  if (problem) throw new ProfileApiError(400, problem);

  if (payload.rythma_id) {
    const existing = mockStore.get(payload.rythma_id);
    if (!existing) throw new ProfileApiError(404, { error: "unknown_profile" });
    mockStore.set(payload.rythma_id, { ...existing, ...payload, rythma_id: payload.rythma_id });
    return { rythma_id: existing.rythma_id, link_token: existing.link_token };
  }

  const created: MockProfile = { ...payload, rythma_id: newRythmaId(), link_token: token() };
  mockStore.set(created.rythma_id, created);
  return { rythma_id: created.rythma_id, link_token: created.link_token };
}

function mockPaid(payload: PaidRequest): PaidResponse {
  const profile = mockStore.get(payload.rythma_id);
  if (!profile) throw new ProfileApiError(404, { error: "unknown_profile" });

  // Idempotent per subscription id: a webhook retry returns the same code.
  if (profile.code && profile.stripe_subscription_id === payload.stripe_subscription_id) {
    return { code: profile.code, link_token: profile.link_token };
  }

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  mockStore.set(payload.rythma_id, {
    ...profile,
    code,
    paid_at: new Date().toISOString(),
    stripe_subscription_id: payload.stripe_subscription_id,
  });
  return { code, link_token: profile.link_token };
}

// ── The real client ─────────────────────────────────────────────────────────

async function call<T>(slug: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL!.replace(/\/$/, "")}/${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "x-rythma-web-key": API_KEY } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let parsed: unknown = undefined;
    try {
      parsed = await res.json();
    } catch {
      /* a non-JSON body is still an error, just an opaque one */
    }
    const shape =
      parsed && typeof parsed === "object" && "error" in parsed
        ? (parsed as { error: string; field?: string; message?: string })
        : { error: `http_${res.status}` };
    throw new ProfileApiError(res.status, shape);
  }

  return (await res.json()) as T;
}

/**
 * Screen 24. Creates her profile on the first call and mints `rythma_id` and
 * the long link token; later calls with the same id update it. No code is
 * minted here — that is `paid`'s job, after Stripe.
 */
export async function upsertProfile(payload: UpsertRequest): Promise<UpsertResponse> {
  if (usingMock()) return mockUpsert(payload);
  return call<UpsertResponse>("web-profile-upsert", payload);
}

/**
 * The Stripe webhook (M3). Sets `paid_at`, mints the 6-digit code, reuses the
 * link token from upsert. Idempotent per `stripe_subscription_id`.
 */
export async function markProfilePaid(payload: PaidRequest): Promise<PaidResponse> {
  if (usingMock()) return mockPaid(payload);
  return call<PaidResponse>("web-profile-paid", payload);
}
