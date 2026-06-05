"use client";

import { motion } from "motion/react";
import type { Question } from "@/lib/quiz-data";

export function QuestionScreen({
  question,
  selected,
  onSelect,
}: {
  question: Question;
  /** The value chosen on this screen, during the brief select-beat before advancing. */
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-8 px-6 py-4">
      <h2 className="font-display text-[26px] font-medium leading-[1.18] tracking-tight text-foreground sm:text-[30px]">
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              disabled={selected !== null}
              onClick={() => onSelect(opt.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.04 * i }}
              className={`quiz-tap flex min-h-[60px] w-full items-center gap-3 rounded-2xl border px-5 py-3.5 text-left text-[17px] font-medium leading-snug transition-colors duration-200 active:scale-[0.99] ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-3xl"
                  : "border-border bg-card text-foreground shadow-sm"
              }`}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? "border-primary-foreground bg-primary-foreground/20"
                    : "border-border"
                }`}
                aria-hidden
              >
                {isSelected && (
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className="flex-1">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
