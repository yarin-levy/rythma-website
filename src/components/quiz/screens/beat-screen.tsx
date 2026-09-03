"use client";

import { motion } from "motion/react";

/**
 * The two beats (screens 5 and 9). No question, no progress bar, no back
 * button — the whole screen is one idea, held still.
 *
 * Beat 5 is the emotional hinge: it echoes her answer to the dismissal
 * question, then names what's happening. Beat 9 turns her own evidence into
 * hope. Every dip in this quiz is followed by one of these.
 */
export function BeatScreen({
  echo,
  body,
  cta,
  onContinue,
}: {
  /** Optional one-line branch echoing her previous answer. */
  echo?: string;
  body: string;
  cta: string;
  onContinue: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-7 pb-2 pt-6">
      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-4">
        {echo && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="font-display mb-6 border-l-2 border-primary/25 pl-4 text-[17px] italic leading-relaxed text-ink-soft"
          >
            {echo}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: echo ? 0.45 : 0.1 }}
          className="font-display text-[27px] font-medium leading-[1.22] tracking-tight text-foreground sm:text-[31px]"
        >
          {body}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: echo ? 1 : 0.6 }}
        className="shrink-0"
      >
        <button
          type="button"
          onClick={onContinue}
          className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[18px] font-semibold text-primary-foreground shadow-3xl transition-transform active:scale-[0.98]"
        >
          {cta}
          <span aria-hidden>→</span>
        </button>
      </motion.div>
    </div>
  );
}
