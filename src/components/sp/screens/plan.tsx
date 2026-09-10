"use client";

import { CLARITY_FOOTER, PLAN, QUOTES, SYMPTOMS, type ProofRowId } from "@/lib/sp/data";
import type { PlanId } from "@/lib/sp/pricing";
import { Actions, CheckGlyph, Footnote, PrimaryButton, Screen, SerifHeadline } from "../ui";

/**
 * Screen 29 — the soft paywall. Every price string comes from pricing.ts and
 * exists nowhere else (build brief rule 4). No countdown, no "today only", no
 * bell: the price reads as the last step of work she already did.
 */
export function PlanScreen({
  firstName,
  topSymptoms,
  proofOrder,
  quoteId,
  urgency,
  plan,
  onSelectPlan,
  onContinue,
}: {
  firstName?: string;
  /** Her top three chips, in the order she tapped them. */
  topSymptoms: readonly string[];
  proofOrder: readonly ProofRowId[];
  quoteId: string;
  urgency?: string;
  plan: PlanId;
  onSelectPlan: (plan: PlanId) => void;
  onContinue: () => void;
}) {
  const name = firstName?.trim();
  const quote = QUOTES.find((q) => q.id === quoteId);
  const rows = proofOrder.map((id) => {
    const row = PLAN.proof.find((r) => r.id === id)!;
    // The last proof row is her matching member quote, filled at render.
    return id === "quote" ? { id, text: quote ? `“${quote.text}” — ${quote.attribution}` : "" } : row;
  });

  return (
    <Screen>
      <SerifHeadline lines={[name ? PLAN.headline(name) : PLAN.headlineNoName]} />
      <p className="text-sp-ink2 text-[length:var(--sp-text-body)] leading-[1.5]">{PLAN.sub}</p>

      {/* Her own words, echoed back. */}
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

      {urgency && (
        <p className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.4] font-semibold">{urgency}</p>
      )}

      <ol className="border-sp-hair flex flex-col border-t">
        {rows
          .filter((r) => r.text.length > 0)
          .map((row) => (
            <li
              key={row.id}
              className="border-sp-hair text-sp-ink flex gap-3 border-b py-3 text-[length:var(--sp-text-chip)] leading-[1.4]"
            >
              <CheckGlyph className="text-sp-ink mt-0.5 size-5 shrink-0" />
              <span>{row.text}</span>
            </li>
          ))}
      </ol>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label={PLAN.sub}>
        <button
          type="button"
          role="radio"
          aria-checked={plan === "annual"}
          onClick={() => onSelectPlan("annual")}
          className={`sp-tap flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-left ${
            plan === "annual" ? "border-sp-ink bg-sp-lime-wash border-2" : "border-sp-hair bg-sp-page border-[1.5px]"
          }`}
        >
          <span className="flex flex-col">
            <span className="text-sp-ink text-[length:var(--sp-text-body)] font-semibold">{PLAN.annual.price}</span>
            <span className="text-sp-ink2 text-[length:var(--sp-text-label)]">{PLAN.annual.trial}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="bg-sp-lime text-sp-ink rounded-full px-2.5 py-0.5 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase">
              {PLAN.annual.save}
            </span>
            {plan === "annual" && <CheckGlyph className="text-sp-ink size-5" />}
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={plan === "monthly"}
          onClick={() => onSelectPlan("monthly")}
          className={`sp-tap flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-left ${
            plan === "monthly" ? "border-sp-ink bg-sp-lime-wash border-2" : "border-sp-hair bg-sp-page border-[1.5px]"
          }`}
        >
          <span className="text-sp-ink text-[length:var(--sp-text-chip)]">{PLAN.monthly.price}</span>
          {plan === "monthly" && <CheckGlyph className="text-sp-ink size-5 shrink-0" />}
        </button>
      </div>

      <Actions>
        <PrimaryButton onClick={onContinue}>{plan === "annual" ? PLAN.annual.cta : PLAN.monthly.cta}</PrimaryButton>
        {/* Always visible, whichever row is selected. */}
        <Footnote>{PLAN.transparency}</Footnote>
        <Footnote>{CLARITY_FOOTER}</Footnote>
      </Actions>
    </Screen>
  );
}
