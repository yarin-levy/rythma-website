"use client";

import {
  SYMPTOMS,
  SYMPTOM_CATEGORIES,
  type ChipsQuestion,
  type MultiQuestion,
  type SingleQuestion,
} from "@/lib/sp/data";
import { Actions, CheckGlyph, Footnote, PrimaryButton, Prompt, Screen, Sub } from "../ui";

// Choice card, blueprint §2: white, 1.5px hairline, 16px radius, 19px ink, 60px
// minimum, left-aligned, no icons. Selected carries THREE cues — the limeWash
// fill, a 2px ink border and a check glyph — because colour alone is never the
// signal.
const CARD_BASE =
  "sp-tap flex min-h-[60px] w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-left text-[length:var(--sp-text-body)] leading-[1.35] transition-colors";
const CARD_OFF = "border-[1.5px] border-sp-hair bg-sp-page text-sp-ink";
const CARD_ON = "border-2 border-sp-ink bg-sp-lime-wash text-sp-ink";

function Card({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`${CARD_BASE} ${selected ? CARD_ON : CARD_OFF} disabled:opacity-50`}
    >
      <span className="flex-1">{label}</span>
      {selected && <CheckGlyph className="text-sp-ink size-5 shrink-0" />}
    </button>
  );
}

/** Single select. Auto-advances; the engine holds the highlight for 340ms first. */
export function SingleQuestionScreen({
  question,
  selected,
  answered,
  onSelect,
}: {
  question: SingleQuestion;
  /** Chosen here, during the hold before advancing. */
  selected: string | null;
  /** What she picked last time, so a back-tap shows her own answer again. */
  answered?: string;
  onSelect: (value: string) => void;
}) {
  const active = selected ?? answered;
  const note = question.options.find((o) => o.id === active)?.note;

  return (
    <Screen>
      <Prompt>{question.prompt}</Prompt>
      {question.sub && <Sub>{question.sub}</Sub>}

      <div role="radiogroup" aria-label={question.prompt} className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active === opt.id}
            disabled={selected !== null}
            onClick={() => onSelect(opt.id)}
            className={`${CARD_BASE} ${active === opt.id ? CARD_ON : CARD_OFF}`}
          >
            <span className="flex-1">{opt.label}</span>
            {active === opt.id && <CheckGlyph className="text-sp-ink size-5 shrink-0" />}
          </button>
        ))}
      </div>

      {/* Screen 3's under-38 line. Appears on selection and never blocks. */}
      {note && <Footnote>{note}</Footnote>}
      {question.footer && <Footnote>{question.footer}</Footnote>}
    </Screen>
  );
}

/** Multi select with a cap (screen 6) or an exclusive option (screen 11). */
export function MultiQuestionScreen({
  question,
  selected,
  onToggle,
  onContinue,
}: {
  question: MultiQuestion;
  selected: readonly string[];
  onToggle: (value: string) => void;
  onContinue: () => void;
}) {
  const atCap = question.max !== undefined && selected.length >= question.max;

  return (
    <Screen>
      <Prompt>{question.prompt}</Prompt>
      {question.sub && <Sub>{question.sub}</Sub>}

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const isOn = selected.includes(opt.id);
          return (
            <Card
              key={opt.id}
              label={opt.label}
              selected={isOn}
              disabled={!isOn && atCap}
              onClick={() => onToggle(opt.id)}
            />
          );
        })}
      </div>

      <Actions>
        <PrimaryButton onClick={onContinue} disabled={selected.length === 0}>
          {question.cta}
        </PrimaryButton>
      </Actions>
    </Screen>
  );
}

/**
 * Screen 7, the intake's centrepiece: 30 chips under five body-system headers,
 * in the app's canonical order. The running count lives in the rail.
 */
export function ChipsScreen({
  question,
  selected,
  onToggle,
  onContinue,
}: {
  question: ChipsQuestion;
  selected: readonly string[];
  onToggle: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <Screen>
      <Prompt>{question.prompt}</Prompt>
      <Sub>{question.sub}</Sub>

      <div className="flex flex-col gap-6">
        {SYMPTOM_CATEGORIES.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-3">
            <h3 className="text-sp-ink3 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase">
              {cat.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.filter((s) => s.category === cat.id).map((s) => {
                const isOn = selected.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isOn}
                    onClick={() => onToggle(s.id)}
                    className={`sp-tap flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[length:var(--sp-text-chip)] transition-colors ${
                      isOn
                        ? "border-sp-ink bg-sp-ink text-sp-page border-2"
                        : "border-sp-hair bg-sp-page text-sp-ink border-[1.5px]"
                    }`}
                  >
                    {s.label}
                    {isOn && <CheckGlyph className="size-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Actions>
        <PrimaryButton onClick={onContinue} disabled={selected.length === 0}>
          {question.cta}
        </PrimaryButton>
        {selected.length === 0 && <Footnote>{question.emptyHint}</Footnote>}
      </Actions>
    </Screen>
  );
}
