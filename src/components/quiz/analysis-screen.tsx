"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ANALYSIS_LINES } from "@/lib/quiz-data";

const PER_LINE_MS = 1300; // each line holds ~1.3s
const FINAL_PAUSE_MS = 800; // deliberate stillness sells the verdict

/**
 * The "we're evaluating you" moment (brief §3, Screen 10). The delay is the
 * feature — the verdict feels earned. Calm pulsing ring + cycling text, then a
 * still pause before the reveal.
 */
export function AnalysisScreen({ onComplete }: { onComplete: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const totalMs = ANALYSIS_LINES.length * PER_LINE_MS + FINAL_PAUSE_MS;
  const done = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < ANALYSIS_LINES.length; i++) {
      timers.push(setTimeout(() => setLineIndex(i), i * PER_LINE_MS));
    }
    timers.push(
      setTimeout(() => {
        if (!done.current) {
          done.current = true;
          onComplete();
        }
      }, totalMs),
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete, totalMs]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12 bg-background px-8 text-center">
      {/* Pulsing ring */}
      <div className="relative flex size-40 items-center justify-center">
        <div className="quiz-glow absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
        <svg viewBox="0 0 120 120" className="size-40 -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--raspberry-soft)" strokeWidth="6" />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: totalMs / 1000, ease: "easeInOut" }}
          />
        </svg>
        <div className="quiz-breathe absolute size-16 rounded-full bg-primary/90" />
      </div>

      {/* Cycling text — the star of this screen */}
      <div className="flex h-20 items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="font-display max-w-[20rem] text-[20px] font-medium leading-snug text-foreground"
          >
            {ANALYSIS_LINES[lineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
