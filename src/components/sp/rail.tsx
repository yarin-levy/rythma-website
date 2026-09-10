"use client";

import { ACTS, TOTAL_SCREENS, type ActId } from "@/lib/sp/data";
import { act } from "@/lib/sp/data";

/**
 * The section rail — question screens only (blueprint §2). This is the whole of
 * the "medical" register: a numbered sequence, not a progress bar with a
 * percentage. `02 · WHAT'S CHANGED` left, six segments, `07 / 31` right.
 *
 * The VoiceOver label reads the way the blueprint's accessibility floor asks:
 * "Section 2 of 6, What's changed, question 7 of 31".
 */
export function SectionRail({
  actId,
  screenNumber,
  onBack,
  selectedCount,
}: {
  actId: ActId;
  screenNumber: number;
  onBack: () => void;
  /**
   * The running count on screen 7 ("7 selected"). Blueprint §2 puts it in the
   * rail and makes it one of lime's three uses, so it sits beside the section
   * label rather than replacing the `07 / 31` sequence.
   */
  selectedCount?: number;
}) {
  const current = act(actId);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col gap-2 px-6 pt-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="sp-tap text-sp-ink -ml-2 flex size-11 shrink-0 items-center justify-center rounded-full"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span
          className="text-sp-ink3 flex-1 truncate text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase tabular-nums"
          aria-hidden
        >
          {pad(current.n)} · {current.label}
        </span>

        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="bg-sp-lime text-sp-ink shrink-0 rounded-full px-2.5 py-0.5 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase tabular-nums">
            {selectedCount} selected
          </span>
        )}

        <span
          className="text-sp-ink3 shrink-0 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase tabular-nums"
          aria-hidden
        >
          {pad(screenNumber)} / {TOTAL_SCREENS}
        </span>
      </div>

      <div
        className="flex gap-1"
        role="img"
        aria-label={`Section ${current.n} of ${ACTS.length}, ${current.label}, question ${screenNumber} of ${TOTAL_SCREENS}`}
      >
        {ACTS.map((a) => (
          <span key={a.id} className={`h-[3px] flex-1 rounded-full ${a.n <= current.n ? "bg-sp-ink" : "bg-sp-hair"}`} />
        ))}
      </div>
    </div>
  );
}
