"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BEAT_NAMING,
  BEAT_PATTERN,
  NAMING_ECHO,
  QUESTIONS,
  type MultiQuestion,
  type SingleQuestion,
} from "@/lib/quiz-data";
import { computeScore } from "@/lib/quiz-score";
import {
  getAttribution,
  haptic,
  metaCompleteRegistration,
  metaLead,
  newEventId,
  trackAnswer,
  trackAppStoreClick,
  trackBeat,
  trackComplete,
  trackEmailSkipped,
  trackEmailSubmitted,
  trackStart,
  tagAgeBucket,
} from "@/lib/quiz-analytics";
import { QuestionScreen } from "./screens/question-screen";
import { SymptomScreen } from "./screens/symptom-screen";
import { BeatScreen } from "./screens/beat-screen";
import { CalculatingScreen } from "./screens/calculating-screen";
import { EmailScreen } from "./screens/email-screen";
import { ResultsScreen } from "./screens/results-screen";

// Everything from screen 2 on. This module is imported lazily with ssr:false,
// so none of the copy below is ever in the HTML served at /quiz — that is the
// whole reason the landing lives in a separate component and separate module.

type Step =
  | { type: "question"; id: string }
  | { type: "beat"; id: "naming" | "pattern" }
  | { type: "calculating" }
  | { type: "email" }
  | { type: "results" };

const FLOW: Step[] = [
  { type: "question", id: "age" }, // 2
  { type: "question", id: "recognition" }, // 3
  { type: "question", id: "wound" }, // 4
  { type: "beat", id: "naming" }, // 5 — where "perimenopause" first lands
  { type: "question", id: "symptoms" }, // 6
  { type: "question", id: "severity" }, // 7
  { type: "question", id: "cycle" }, // 8
  { type: "beat", id: "pattern" }, // 9
  { type: "question", id: "hope" }, // 10
  { type: "question", id: "readiness" }, // 11
  { type: "calculating" }, // 12
  { type: "email" }, // 13
  { type: "results" }, // 14
];

const TOTAL_QUESTIONS = FLOW.filter((s) => s.type === "question").length;
const SELECT_HOLD_MS = 340; // let the chosen answer register before moving on

function questionNumber(stepIndex: number): number {
  return FLOW.slice(0, stepIndex + 1).filter((s) => s.type === "question").length;
}

/** Previous question step, skipping beats — back never lands on a beat. */
function previousQuestionIndex(stepIndex: number): number {
  for (let i = stepIndex - 1; i >= 0; i--) {
    if (FLOW[i].type === "question") return i;
  }
  return -1;
}

export default function QuizEngine({ onExit }: { onExit: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // A ref, not state: nothing renders off it, and the App Store handler needs
  // the current value without re-subscribing.
  const gaveEmailRef = useRef(false);
  const completeFired = useRef(false);

  useEffect(() => {
    trackStart();
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const step = FLOW[stepIndex];
  const score = useMemo(() => computeScore(answers, symptoms), [answers, symptoms]);

  const goTo = useCallback((index: number) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSelected(null);
    setStepIndex(index);
  }, []);

  const advance = useCallback(() => goTo(stepIndex + 1), [goTo, stepIndex]);

  const handleBack = useCallback(() => {
    const prev = previousQuestionIndex(stepIndex);
    if (prev < 0) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      onExit();
      return;
    }
    goTo(prev);
  }, [goTo, onExit, stepIndex]);

  // Single-select: highlight, record, auto-advance.
  const handleSelect = useCallback(
    (questionId: string, value: string) => {
      if (selected !== null) return; // guard double taps
      setSelected(value);
      haptic();
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      trackAnswer(questionId, questionNumber(stepIndex), value);
      if (questionId === "age") tagAgeBucket(value);
      timers.current.push(setTimeout(() => goTo(stepIndex + 1), SELECT_HOLD_MS));
    },
    [goTo, selected, stepIndex],
  );

  const handleToggleSymptom = useCallback((value: string) => {
    haptic();
    setSymptoms((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const handleSymptomsContinue = useCallback(() => {
    trackAnswer("symptoms", questionNumber(stepIndex), symptoms);
    advance();
  }, [advance, stepIndex, symptoms]);

  const handleBeatContinue = useCallback(
    (beatId: string) => {
      trackBeat(beatId);
      advance();
    },
    [advance],
  );

  const handleEmailSubmit = useCallback(
    async (email: string): Promise<boolean> => {
      // The dedup key pairs this browser `Lead` with the Conversions API `Lead`
      // the route sends, so Meta counts the two as one event.
      const eventId = newEventId();
      try {
        const res = await fetch("/api/quiz-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            eventId,
            answers,
            symptoms,
            attribution: getAttribution(),
          }),
        });
        if (!res.ok) return false;
      } catch {
        return false;
      }
      gaveEmailRef.current = true;
      metaLead(eventId);
      trackEmailSubmitted();
      advance();
      return true;
    },
    [advance, answers, symptoms],
  );

  const handleEmailSkip = useCallback(() => {
    trackEmailSkipped();
    advance();
  }, [advance]);

  const handleAppStore = useCallback(() => {
    // Exactly one Lead per completer: if she gave her email we already fired it,
    // so this tap is a CompleteRegistration. If she skipped, this is her Lead.
    if (gaveEmailRef.current) metaCompleteRegistration();
    else metaLead();
    trackAppStoreClick(gaveEmailRef.current);
  }, []);

  // Fire the funnel-complete event once, when the results actually render.
  useEffect(() => {
    if (step.type !== "results" || completeFired.current) return;
    completeFired.current = true;
    trackComplete({
      ageBucket: answers.age,
      band: score.band,
      score: score.score,
      symptomCount: symptoms.length,
      gaveEmail: gaveEmailRef.current,
    });
  }, [answers.age, score.band, score.score, step.type, symptoms.length]);

  const showProgress = step.type === "question";

  const variants = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  return (
    <>
      {/* The wordmark rides every screen. Screen 1 was the only place the brand
          appeared, so the whole middle of the funnel was unbranded and the App
          Store handoff at the end arrived from an anonymous page. */}
      <div className="flex shrink-0 items-center justify-center pt-2">
        <span className="text-[15px] font-bold tracking-tight text-primary">Rythma</span>
      </div>

      {/* Progress — question screens only. Beats, calculating and the results
          stay chrome-free, and none of them has a way back. */}
      <div className="shrink-0 px-4 pt-2" style={{ height: showProgress ? undefined : 0 }}>
        {showProgress && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="quiz-tap -ml-1 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-soft active:bg-primary/5"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/10">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${(questionNumber(stepIndex) / TOTAL_QUESTIONS) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span className="shrink-0 text-[12px] font-medium tabular-nums text-ink-muted">
              Question {questionNumber(stepIndex)} of {TOTAL_QUESTIONS}
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepIndex}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {step.type === "question" && step.id === "symptoms" && (
              <SymptomScreen
                question={question(step.id) as MultiQuestion}
                selected={symptoms}
                onToggle={handleToggleSymptom}
                onContinue={handleSymptomsContinue}
              />
            )}

            {step.type === "question" && step.id !== "symptoms" && (
              <QuestionScreen
                question={question(step.id) as SingleQuestion}
                selected={selected}
                answered={answers[step.id]}
                onSelect={(value) => handleSelect(step.id, value)}
              />
            )}

            {step.type === "beat" && step.id === "naming" && (
              <BeatScreen
                echo={answers.wound ? NAMING_ECHO[answers.wound] : undefined}
                body={BEAT_NAMING.body}
                cta={BEAT_NAMING.cta}
                onContinue={() => handleBeatContinue("naming")}
              />
            )}

            {step.type === "beat" && step.id === "pattern" && (
              <BeatScreen
                body={BEAT_PATTERN.body}
                cta={BEAT_PATTERN.cta}
                onContinue={() => handleBeatContinue("pattern")}
              />
            )}

            {step.type === "calculating" && <CalculatingScreen onComplete={advance} />}

            {step.type === "email" && (
              <EmailScreen onSubmit={handleEmailSubmit} onSkip={handleEmailSkip} />
            )}

            {step.type === "results" && (
              <ResultsScreen
                score={score}
                symptoms={symptoms}
                hope={answers.hope}
                wound={answers.wound}
                onAppStore={handleAppStore}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function question(id: string) {
  const q = QUESTIONS.find((q) => q.id === id);
  if (!q) throw new Error(`quiz: unknown question "${id}"`);
  return q;
}
