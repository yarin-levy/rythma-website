"use client";

import { LANDING, LP_HEADLINE } from "@/lib/sp/landing";

/**
 * The mini LP. The only funnel markup that reaches the HTML at /quiz, so it
 * imports the LP strings and NOTHING else — no data.ts, no motion library, no
 * icons. Blueprint §4 (LP) and §9 (server HTML stays neutral).
 *
 * The block below the fold — the Starting Picture still, "What you'll leave
 * with", the evidence footer that names a condition body — is a separate
 * ssr:false chunk (landing-below.tsx), because those strings must not be
 * server-rendered.
 */
export function SpLanding({
  onStart,
  below,
}: {
  onStart: () => void;
  /** The client-only below-the-fold chunk, injected by the shell. */
  below?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex min-h-svh flex-col px-6 pt-6 pb-4">
        <div className="flex shrink-0 items-center justify-between">
          <span className="text-sp-ink text-[length:var(--sp-text-chip)] font-semibold tracking-tight">Rythma</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <p className="sp-rise text-sp-ink3 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase">
            {LANDING.eyebrow}
          </p>
          {/* The LCP element. No web font blocks it: both faces are `swap`. */}
          <h1 className="sp-rise font-sp-serif text-sp-ink mt-4 text-[length:var(--sp-text-serif)] leading-[1.1]">
            {LP_HEADLINE}
          </h1>
          <p className="sp-rise text-sp-ink2 mt-5 text-[length:var(--sp-text-body)] leading-[1.5] [animation-delay:120ms]">
            {LANDING.sub} <em className="font-sp-serif text-sp-ink italic">{LANDING.subItalic}</em>
          </p>
        </div>

        <div className="sp-actions shrink-0 [animation-delay:220ms]">
          <button
            type="button"
            onClick={onStart}
            className="sp-tap bg-sp-ink text-sp-page flex min-h-[60px] w-full items-center justify-center rounded-full px-6 text-[length:var(--sp-text-body)] font-semibold transition-opacity active:opacity-90"
          >
            {LANDING.cta}
          </button>
          <p className="text-sp-ink2 mt-4 text-center text-[length:var(--sp-text-label)] leading-[1.5]">
            {LANDING.underCta}
          </p>
        </div>
      </div>

      {below}
    </div>
  );
}
