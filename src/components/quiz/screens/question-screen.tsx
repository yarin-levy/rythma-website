"use client";

import { motion } from "motion/react";
import type { SingleQuestion } from "@/lib/quiz-data";
import { CheckIcon } from "../icons";

/**
 * A single-select question (screens 2, 3, 4, 7, 8, 10, 11). Auto-advances on
 * tap — the engine holds the highlight for a beat first so the choice registers.
 */
export function QuestionScreen({
  question,
  selected,
  answered,
  onSelect,
}: {
  question: SingleQuestion;
  /** The value chosen here, during the brief hold before advancing. */
  selected: string | null;
  /** What she picked last time, so a back-tap shows her own answer again. */
  answered?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-8 overflow-y-auto px-6 py-6">
      <h2 className="font-display text-[26px] font-medium leading-[1.18] tracking-tight text-foreground sm:text-[30px]">
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected =
            selected === opt.value || (selected === null && answered === opt.value);
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
                  isSelected ? "border-primary-foreground bg-primary-foreground/20" : "border-border"
                }`}
                aria-hidden
              >
                {isSelected && <CheckIcon className="size-4" />}
              </span>
              <span className="flex-1">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
