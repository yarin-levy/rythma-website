"use client";

import { motion } from "motion/react";
import type { MultiQuestion } from "@/lib/quiz-data";
import { Icon } from "../icons";

/**
 * Screen 6 — the evidence layer, and the only multi-select. A 3-column icon
 * grid that mirrors the app's onboarding grid, so the moment she opens Rythma
 * she recognizes the screen she already filled in.
 *
 * Continue stays enabled at zero selections on purpose: this is a paid lander,
 * and a blocked CTA loses more women than an empty score gains.
 */
export function SymptomScreen({
  question,
  selected,
  onToggle,
  onContinue,
}: {
  question: MultiQuestion;
  selected: string[];
  onToggle: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4">
        <h2 className="font-display text-[26px] font-medium leading-[1.18] tracking-tight text-foreground sm:text-[28px]">
          {question.prompt}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{question.sub}</p>

        <div className="mt-5 grid grid-cols-3 gap-2.5 pb-4">
          {question.options.map((opt, i) => {
            const isSelected = selected.includes(opt.value);
            return (
              <motion.button
                key={opt.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggle(opt.value)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.025 * i }}
                className={`quiz-tap flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border px-1.5 py-3 transition-colors duration-200 active:scale-[0.98] ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-3xl"
                    : "border-border bg-card text-foreground shadow-sm"
                }`}
              >
                <Icon name={opt.value} className="size-7" />
                <span className="text-center text-[12.5px] font-semibold leading-tight">
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 px-6 pb-2 pt-3">
        <button
          type="button"
          onClick={onContinue}
          className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[18px] font-semibold text-primary-foreground shadow-3xl transition-transform active:scale-[0.98]"
        >
          {question.cta}
          {selected.length > 0 && (
            <span className="text-[15px] font-medium opacity-80">({selected.length})</span>
          )}
        </button>
      </div>
    </div>
  );
}
