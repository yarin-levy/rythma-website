"use client";

import { useCallback, useMemo, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
// The `pure` entry, not the default one. `@stripe/stripe-js` injects
// js.stripe.com (242 KB, plus Stripe's fraud-signal script) the moment it is
// imported, and the landing page warms the engine chunk that imports this
// screen — so the default entry loaded Stripe on the ad landing page, before
// she had tapped anything. Measured as the single largest main-thread task on
// the LP in Lighthouse. `pure` loads nothing until `loadStripe` is called.
import { loadStripe } from "@stripe/stripe-js/pure";
import { CHECKOUT, SYMPTOMS } from "@/lib/sp/data";
import type { PlanId } from "@/lib/sp/pricing";
import { analyticsId } from "@/lib/sp/analytics";
import { Footnote, Label, Prompt, Screen, SecondaryAction } from "../ui";

// Screen 30 — the one screen where she pays.
//
// Stripe's embedded form inside our own chrome, so the funnel never visibly
// leaves rythma.co at the moment the feeling peaks (blueprint §11). Above the
// form: her name, her top three chips, the plan line and the one sentence that
// says what happens next. Below it: what she will and will not be charged.
//
// The publishable key is loaded once, lazily, and only if it exists — a missing
// key must not take the screen down, because the recap above it is still the
// last thing she reads before paying.

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: ReturnType<typeof loadStripe> | null = null;

/** Loads Stripe on first use — which is screen 30 mounting, and nothing earlier. */
function getStripe(): ReturnType<typeof loadStripe> | null {
  if (!publishableKey) return null;
  stripePromise ??= loadStripe(publishableKey);
  return stripePromise;
}

/**
 * NEW STRINGS (for Yarin). The blueprint has no failure or back state for
 * screen 30. Both are in its voice and clean through the banned list.
 */
export const CHECKOUT_COPY = {
  unavailable: "We can’t take payment right now. Your Starting Picture is saved, and we’ve emailed it to you.",
  back: "Choose a different plan",
} as const;

export function CheckoutScreen({
  firstName,
  topSymptoms,
  plan,
  rythmaId,
  email,
  onComplete,
  onBack,
}: {
  firstName?: string;
  topSymptoms: readonly string[];
  plan: PlanId;
  rythmaId?: string;
  email?: string;
  onComplete: () => void;
  onBack: () => void;
}) {
  const name = firstName?.trim();
  const [failed, setFailed] = useState(false);

  /**
   * Stripe calls this once when the provider mounts. It must return the client
   * secret or throw; returning a rejected promise is what surfaces as `failed`.
   */
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/sp/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, rythmaId, email, analyticsId: await analyticsId() }),
    });
    if (!res.ok) {
      setFailed(true);
      throw new Error(`checkout ${res.status}`);
    }
    const { clientSecret } = (await res.json()) as { clientSecret?: string };
    if (!clientSecret) {
      setFailed(true);
      throw new Error("checkout: no client secret");
    }
    return clientSecret;
  }, [email, plan, rythmaId]);

  const options = useMemo(() => ({ fetchClientSecret, onComplete }), [fetchClientSecret, onComplete]);

  const stripe = useMemo(() => getStripe(), []);
  const payable = Boolean(stripe && rythmaId) && !failed;

  return (
    <Screen>
      <div className="border-sp-hair flex flex-col gap-4 rounded-2xl border-[1.5px] p-4">
        {name && <Prompt>{name}</Prompt>}
        {topSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topSymptoms.map((id) => (
              <span
                key={id}
                className="bg-sp-lime-wash text-sp-ink rounded-full px-3 py-1.5 text-[length:var(--sp-text-chip)]"
              >
                {SYMPTOMS.find((s) => s.id === id)?.label}
              </span>
            ))}
          </div>
        )}
        <Label>{CHECKOUT.planLine(plan)}</Label>
        <p className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.5]">{CHECKOUT.recapLead}</p>
      </div>

      {payable ? (
        <div className="min-h-[16rem]">
          {/* Apple Pay and Google Pay appear here on a supporting device — the
              session leaves payment_method_types to Stripe on purpose. */}
          <EmbeddedCheckoutProvider stripe={stripe} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      ) : (
        <p className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.5]">{CHECKOUT_COPY.unavailable}</p>
      )}

      <div className="flex flex-col gap-3">
        <p className="text-sp-ink2 text-[length:var(--sp-text-chip)] leading-[1.5]">{CHECKOUT.belowForm}</p>
        <Footnote>{CHECKOUT.privacyLine}</Footnote>
        <Footnote>{CHECKOUT.support}</Footnote>
      </div>

      {/* Abandoning is a tap back to the plan, never a second popup. */}
      <div className="sp-actions flex justify-center pt-2">
        <SecondaryAction onClick={onBack}>{CHECKOUT_COPY.back}</SecondaryAction>
      </div>
    </Screen>
  );
}
