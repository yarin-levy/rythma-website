"use client";

import { EVIDENCE_FOOTER, LP_BELOW } from "@/lib/sp/data";
import { Label } from "./ui";

/**
 * Below the fold on the LP. Loaded with `ssr:false` on purpose: the evidence
 * footer names The Menopause Society, and the acceptance check for this funnel
 * is that `curl /quiz` finds no condition term (blueprint §9). Rendering this
 * after hydration is what keeps that true while still saying it to her.
 */
export default function SpLandingBelow() {
  return (
    <div className="flex flex-col gap-7 px-6 pt-4 pb-10">
      {/* The Starting Picture card, as a still, with the score tile blurred —
          the shape of what she'll get, with no fabricated numbers in it. */}
      <div className="border-sp-ink overflow-hidden rounded-[20px] border-2">
        <div className="from-sp-lime-wash to-sp-page bg-gradient-to-b px-4 py-3">
          <Label>{LP_BELOW.stillLabel}</Label>
        </div>
        <div className="flex flex-col gap-3 px-4 pb-4">
          <div className="bg-sp-hair h-2 w-2/3 rounded-full" aria-hidden />
          <div className="bg-sp-hair h-2 w-1/2 rounded-full" aria-hidden />
          <div className="bg-sp-ink/90 mt-1 flex h-16 items-center justify-center rounded-2xl blur-[3px]" aria-hidden />
        </div>
      </div>

      <div>
        <Label>{LP_BELOW.heading}</Label>
        <ul className="border-sp-hair mt-3 flex flex-col border-t">
          {LP_BELOW.rows.map((row) => (
            <li
              key={row}
              className="border-sp-hair text-sp-ink border-b py-3 text-[length:var(--sp-text-body)] leading-[1.4]"
            >
              {row}
            </li>
          ))}
        </ul>
      </div>

      <p className="border-sp-hair text-sp-ink2 border-t pt-3 text-[length:var(--sp-text-label)] leading-[1.5]">
        {EVIDENCE_FOOTER}
      </p>
    </div>
  );
}
