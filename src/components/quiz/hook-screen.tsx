"use client";

import { motion } from "motion/react";
import { HOOK } from "@/lib/quiz-data";

export function HookScreen({
  headline,
  onStart,
}: {
  headline: string;
  onStart: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-6 pb-2 pt-6">
      {/* Brand mark — text wordmark, matching the site nav */}
      <div className="flex shrink-0 justify-center">
        <span className="text-2xl font-bold tracking-tight text-primary">Rythma</span>
      </div>

      {/* Emotional center */}
      <div className="flex flex-1 flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary/80"
        >
          {HOOK.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display mt-4 text-[30px] font-medium leading-[1.12] tracking-tight text-foreground sm:text-[36px]"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-5 text-[18px] leading-relaxed text-ink-soft"
        >
          {HOOK.subhead}
        </motion.p>
      </div>

      {/* Thumb-zone CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="shrink-0"
      >
        <button
          type="button"
          onClick={onStart}
          className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[18px] font-semibold text-primary-foreground shadow-3xl transition-transform active:scale-[0.98]"
        >
          {HOOK.cta}
          <span aria-hidden>→</span>
        </button>
        <p className="mx-auto mt-4 max-w-[20rem] text-center text-[13px] leading-relaxed text-ink-muted">
          {HOOK.trust}
        </p>
      </motion.div>
    </div>
  );
}
