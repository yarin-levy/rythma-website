"use client";

import { LANDING } from "@/lib/quiz-landing";

/**
 * Screen 1. The only screen whose markup appears in the HTML at /quiz, and the
 * only screen anything but the visitor ever sees — neutral copy, no health
 * terms. Everything after the tap comes from a lazily-loaded, ssr:false chunk.
 *
 * Deliberately static-friendly: no motion library, no data imports beyond the
 * landing copy, so first paint on a cold 4G tap-through is as fast as possible.
 */
export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 pb-2 pt-6">
      <div className="flex shrink-0 justify-center">
        <span className="text-2xl font-bold tracking-tight text-primary">Rythma</span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h1 className="font-display quiz-rise text-[32px] font-medium leading-[1.1] tracking-tight text-foreground sm:text-[38px]">
          {LANDING.headline}
        </h1>
        <p className="quiz-rise mt-5 text-[18px] leading-relaxed text-ink-soft [animation-delay:120ms]">
          {LANDING.sub}
        </p>
      </div>

      <div className="quiz-rise shrink-0 [animation-delay:220ms]">
        <button
          type="button"
          onClick={onStart}
          className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[18px] font-semibold text-primary-foreground shadow-3xl transition-transform active:scale-[0.98]"
        >
          {LANDING.cta}
          <span aria-hidden>→</span>
        </button>
        <p className="mx-auto mt-4 max-w-[20rem] text-center text-[13px] leading-relaxed text-ink-muted">
          {LANDING.trust}
        </p>
      </div>
    </div>
  );
}
