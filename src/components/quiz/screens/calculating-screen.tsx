"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CALCULATING } from "@/lib/quiz-data";
import { CheckIcon } from "../icons";

const TOTAL_MS = 5000;
const STEP_MS = TOTAL_MS / (CALCULATING.steps.length + 1); // last step lands just before the results

/**
 * Screen 12. The wait is the feature: five seconds of visible work is what
 * turns eight taps into "a profile that was calculated for me". Auto-advances,
 * and there is no way back from here.
 */
export function CalculatingScreen({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(0);
  const reduceMotion = useReducedMotion();
  const fired = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    CALCULATING.steps.forEach((_, i) => {
      timers.push(setTimeout(() => setDone(i + 1), (i + 1) * STEP_MS));
    });
    timers.push(
      setTimeout(() => {
        if (fired.current) return;
        fired.current = true;
        onComplete();
      }, TOTAL_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 px-8">
      <div className="relative flex size-36 items-center justify-center">
        <div className="quiz-glow absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
        <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
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
            transition={{ duration: TOTAL_MS / 1000, ease: "easeInOut" }}
          />
        </svg>
        <div className="quiz-breathe absolute size-14 rounded-full bg-primary/90" />
      </div>

      <h2 className="font-display text-center text-[24px] font-medium leading-snug text-foreground">
        {CALCULATING.headline}
      </h2>

      <ul className="flex w-full max-w-[19rem] flex-col gap-3.5">
        {CALCULATING.steps.map((step, i) => {
          const isDone = i < done;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  isDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-transparent"
                }`}
                aria-hidden
              >
                <CheckIcon className="size-3.5" />
              </span>
              <span
                className={`text-[16px] leading-snug transition-colors duration-300 ${
                  isDone ? "font-medium text-foreground" : "text-ink-muted"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
