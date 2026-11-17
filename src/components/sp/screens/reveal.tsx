"use client";

import { CLARITY_FOOTER, EVIDENCE_FOOTER, REVEAL } from "@/lib/sp/data";
import type { StartingPicture } from "@/lib/sp/reveal";
import { Actions, EvidenceFooter, Label, PrimaryButton, Screen } from "../ui";

/**
 * Screen 25 — the Starting Picture. Laid out like the top of a report: a ruled
 * header row, ruled sections, a lime→white band behind the top. Rail-less, and
 * it scrolls.
 *
 * Every value on this card is something she tapped or something derived from it
 * in reveal.ts. Nothing here is invented, and the Peri Score is a blurred tile —
 * the web never shows a number or a band (decision §12.8).
 */
export function RevealScreen({
  picture,
  firstName,
  onContinue,
}: {
  picture: StartingPicture;
  firstName?: string;
  onContinue: () => void;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Screen>
      <div className="border-sp-ink overflow-hidden rounded-[20px] border-2">
        <div className="from-sp-lime-wash to-sp-page bg-gradient-to-b">
          <div className="border-sp-hair flex flex-wrap items-center gap-x-2 gap-y-1 border-b px-4 py-3">
            <Label>{REVEAL.cardTitle}</Label>
            <Label>·</Label>
            <Label>{firstName?.trim() || REVEAL.nameFallback}</Label>
            <Label>·</Label>
            <Label>{today}</Label>
          </div>
        </div>

        {/* Row 1 — the count */}
        <div className="border-sp-hair flex items-baseline gap-3 border-b px-4 py-5">
          <span className="font-sp-serif text-sp-ink text-[44px] leading-none tabular-nums">{picture.count}</span>
          <span className="flex flex-col">
            {/* The number is set big and tabular beside the words, so the
                leading digit is dropped from the label rather than duplicated. */}
            <span className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.2] font-semibold">
              {picture.countLabel.replace(/^\d+\s/, "")}
            </span>
            <em className="font-sp-serif text-sp-ink2 text-[length:var(--sp-text-chip)] italic">{picture.countOf}</em>
          </span>
        </div>

        {/* Row 2 — weighing on you most */}
        {picture.categories.length > 0 && (
          <div className="border-sp-hair flex flex-col gap-3 border-b px-4 py-5">
            <Label>{REVEAL.weighingLabel}</Label>
            {picture.categories.map((cat) => (
              <p key={cat.id} className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.4]">
                <em className="font-sp-serif italic">{cat.label}:</em>{" "}
                {cat.symptoms.map((s) => s.label.toLowerCase()).join(", ")}
              </p>
            ))}
          </div>
        )}

        {/* Row 3 — what tracking alone can't tell you */}
        <div className="border-sp-hair flex flex-col gap-2 border-b px-4 py-5">
          <Label>{REVEAL.unknownsLabel}</Label>
          <ul className="flex flex-col gap-2">
            {picture.unknowns.map((line) => (
              <li key={line} className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.4]">
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Row 4 — her first 2-week test */}
        <div className="border-sp-hair flex flex-col gap-2 border-b px-4 py-5">
          <Label>{REVEAL.testLabel}</Label>
          <p className="text-sp-ink text-[length:var(--sp-text-prompt)] leading-[1.2] font-semibold">
            {picture.candidate.label}
          </p>
          {picture.candidate.note && (
            <p className="text-sp-ink2 text-[length:var(--sp-text-chip)] leading-[1.5]">{picture.candidate.note}</p>
          )}
          <p className="text-sp-ink2 text-[length:var(--sp-text-label)] leading-[1.5]">{REVEAL.testFixedLine}</p>
        </div>

        {/* Row 5 — the locked Peri Score. No number, ever, on the web. */}
        <div className="flex flex-col gap-2 px-4 py-5">
          <Label>{REVEAL.scoreLabel}</Label>
          <div
            className="bg-sp-ink flex h-20 items-center justify-center rounded-2xl"
            role="img"
            aria-label={`${REVEAL.scoreLabel}, locked. ${REVEAL.scoreLock}`}
          >
            <svg viewBox="0 0 24 24" className="text-sp-page size-7" fill="none" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-sp-ink2 text-[length:var(--sp-text-label)] leading-[1.5]">{REVEAL.scoreLock}</p>
        </div>
      </div>

      <p className="text-sp-ink text-[length:var(--sp-text-body)] font-semibold">{CLARITY_FOOTER}</p>
      <EvidenceFooter text={EVIDENCE_FOOTER} />

      <Actions>
        <PrimaryButton onClick={onContinue}>{REVEAL.cta}</PrimaryButton>
      </Actions>
    </Screen>
  );
}
