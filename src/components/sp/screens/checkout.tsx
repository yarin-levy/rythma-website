"use client";

import { CHECKOUT, SYMPTOMS } from "@/lib/sp/data";
import type { PlanId } from "@/lib/sp/pricing";
import { Actions, Label, PrimaryButton, Prompt, Screen } from "../ui";

/**
 * Screen 30 — the one screen where she pays.
 *
 * M1 renders our own chrome only: the recap above the form (her name, her top
 * three chips, the plan line, the one sentence) and the reassurance below it, so
 * the whole flow is walkable with stills. The embedded Stripe form, Apple Pay
 * and Stripe Tax land in M3, in the slot marked below — nothing here collects a
 * card, and nothing pretends to.
 */
export function CheckoutScreen({
  firstName,
  topSymptoms,
  plan,
  onContinue,
}: {
  firstName?: string;
  topSymptoms: readonly string[];
  plan: PlanId;
  onContinue: () => void;
}) {
  const name = firstName?.trim();

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

      {/* M3: the embedded Stripe Checkout session mounts here. */}
      <div className="border-sp-hair min-h-[8rem] rounded-2xl border-[1.5px] border-dashed" />

      <div className="flex flex-col gap-3">
        <p className="text-sp-ink2 text-[length:var(--sp-text-chip)] leading-[1.5]">{CHECKOUT.belowForm}</p>
        <p className="text-sp-ink2 text-[length:var(--sp-text-label)] leading-[1.5]">{CHECKOUT.privacyLine}</p>
        <p className="text-sp-ink2 text-[length:var(--sp-text-label)] leading-[1.5]">{CHECKOUT.support}</p>
      </div>

      <Actions>
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </Actions>
    </Screen>
  );
}
