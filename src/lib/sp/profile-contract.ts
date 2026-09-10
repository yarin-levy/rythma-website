// The web ↔ app profile contract: the payload shapes and the validation.
//
// Source of truth: the app handout §2 ("the contract as built", 2026-09-10) and
// the build brief §2b, pinned on the app side by
// `rythma/supabase/functions/_shared/web-profile.ts` and its Deno tests.
//
// This module is shared by the route, the in-process mock and the tests, so the
// three cannot drift from each other. It is pure — no fetch, no env, no Resend —
// which is what lets the tests run it directly.

import { CANDIDATE_TESTS, SYMPTOM_IDS, optionIds, type CandidateTestId } from "./data";
import type { PlanCardId } from "./data";

/** Answer keys the edge function validates against the app's enums. */
export const VALIDATED_ANSWER_KEYS = [
  "age",
  "intensity",
  "cycle",
  "no_period_reason",
  "tracking",
  "doctor",
  "matters",
] as const;

/** Kept in `answers` and stored as given — the app has no field for these. */
export const WEB_ONLY_ANSWER_KEYS = ["moment", "how_long", "harder", "inputs", "reflection"] as const;

/**
 * NOTE FOR THE APP SESSION — `variant` is gone.
 *
 * Yarin removed the six `?a=` landing-page variants on 2026-09-10 (build brief
 * rule 0), so the web has nothing to report and no longer sends the field. The
 * handout's §2 request shape still lists `variant (1–6)` as required, and the
 * edge function still validates it, so `web-profile-upsert` MUST make it
 * optional before SP_PROFILE_API_URL is set — otherwise the first real write
 * 400s. Flagged in the M1 pull request.
 */
export type UpsertRequest = {
  /** Absent on the first call; the function mints it. */
  rythma_id?: string;
  email: string;
  first_name?: string;
  answers: Record<string, string | string[]>;
  symptoms: string[];
  candidate_test?: CandidateTestId;
  plan_order: PlanCardId[];
};

export type UpsertResponse = {
  rythma_id: string;
  /**
   * Added by the app session per the architect's ruling on ledger D5, so the
   * website never reads the table. Optional until that lands: a response
   * without it means the first email ships with no *Open in Rythma* button.
   */
  link_token?: string;
};

export type PaidRequest = {
  rythma_id: string;
  plan: "annual" | "monthly";
  stripe_customer_id: string;
  stripe_subscription_id: string;
  trial_ends_at: string | null;
  /** The signed `/manage?k=` route, never a Stripe portal session URL. */
  manage_url?: string;
};

export type PaidResponse = { code: string; link_token: string };

/** The edge function's error shape. `field` is for our log, never for her. */
export type ContractError = { error: string; field?: string; message?: string };

export class ProfileApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ContractError,
  ) {
    super(`${body.error}${body.field ? ` (${body.field})` : ""}`);
    this.name = "ProfileApiError";
  }
}

const CANDIDATE_IDS = Object.keys(CANDIDATE_TESTS);

function invalid(field: string, message: string): ContractError {
  return { error: "invalid", field, message };
}

/**
 * Exactly the checks the edge function runs, so a payload this accepts is one
 * the real function accepts too. Returns the first problem, or null.
 */
export function validateUpsert(payload: UpsertRequest): ContractError | null {
  if (!payload.email || !payload.email.includes("@")) {
    return invalid("email", "an email address is required");
  }
  for (const key of VALIDATED_ANSWER_KEYS) {
    const value = payload.answers?.[key];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value !== "string") return invalid(key, "expected a single value");

    // 10a is a fork off screen 10 and may only travel with its trigger.
    if (key === "no_period_reason" && payload.answers.cycle !== "noPeriods") {
      return invalid("no_period_reason", "only valid when cycle is noPeriods");
    }
    if (!optionIds(key).includes(value)) {
      return invalid(key, `"${value}" is not one of ${optionIds(key).join(", ")}`);
    }
  }

  if (!Array.isArray(payload.symptoms)) return invalid("symptoms", "expected an array");
  for (const id of payload.symptoms) {
    if (!SYMPTOM_IDS.includes(id)) return invalid("symptoms", `"${id}" is not a Symptom`);
  }

  if (payload.candidate_test !== undefined && !CANDIDATE_IDS.includes(payload.candidate_test)) {
    return invalid("candidate_test", `"${payload.candidate_test}" is not in the test catalog`);
  }

  if (!Array.isArray(payload.plan_order)) return invalid("plan_order", "expected an array");

  return null;
}

/** `"wq_" + uuid`, the key of her profile and Stripe's `client_reference_id`. */
export function newRythmaId(): string {
  return `wq_${crypto.randomUUID()}`;
}
