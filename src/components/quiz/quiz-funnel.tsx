"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AFFIRMATIONS, QUESTIONS, getHeadline } from "@/lib/quiz-data";
import {
  captureAttribution,
  getAttribution,
  haptic,
  trackLead,
  trackQuestionAnswer,
  trackQuizComplete,
  trackQuizStart,
  trackViewContent,
} from "@/lib/quiz-analytics";
import { HookScreen } from "./hook-screen";
import { QuestionScreen } from "./question-screen";
import { AffirmationScreen } from "./affirmation-screen";
import { AnalysisScreen } from "./analysis-screen";
import { RevealScreen } from "./reveal-screen";
import { EmailScreen } from "./email-screen";
import { DownloadScreen } from "./download-screen";

type Phase = "hook" | "question" | "affirmation" | "analysis" | "reveal" | "email" | "download";

const SELECT_BEAT_MS = 360; // highlight the chosen answer before moving on
const AFFIRM_MS = 1800; // warm line hold between questions — long enough to read

// Dev-only deep-link: /quiz?screen=reveal jumps straight to a screen with
// sample answers, so any screen can be previewed/screenshotted in isolation.
// Ignored entirely in production builds.
function devInitialState(screen?: string): {
  phase: Phase;
  qIndex: number;
  answers: Record<string, string>;
} | null {
  if (!screen || process.env.NODE_ENV === "production") return null;
  const sample = { age: "45-49", wound: "brushed-off" };
  const qMatch = /^q([1-8])$/.exec(screen);
  if (qMatch) return { phase: "question", qIndex: Number(qMatch[1]) - 1, answers: {} };
  if (["analysis", "reveal", "email", "download"].includes(screen)) {
    return { phase: screen as Phase, qIndex: QUESTIONS.length - 1, answers: sample };
  }
  return null;
}

export function QuizFunnel({
  initialVariant,
  initialScreen,
}: {
  initialVariant?: string;
  initialScreen?: string;
}) {
  const dev = devInitialState(initialScreen);
  const [phase, setPhase] = useState<Phase>(dev?.phase ?? "hook");
  const [qIndex, setQIndex] = useState(dev?.qIndex ?? 0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>(dev?.answers ?? {});
  const reduceMotion = useReducedMotion();

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const headline = useMemo(() => getHeadline(initialVariant), [initialVariant]);

  useEffect(() => {
    captureAttribution();
    trackViewContent();
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const handleStart = useCallback(() => {
    setPhase("question");
    setQIndex(0);
    setSelected(null);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      if (selected !== null) return; // guard against double taps
      const q = QUESTIONS[qIndex];
      setSelected(value);
      haptic();
      setAnswers((prev) => ({ ...prev, [q.id]: value }));
      if (qIndex === 0) trackQuizStart();
      trackQuestionAnswer(q.id, qIndex, value);

      timers.current.push(
        setTimeout(() => {
          if (qIndex === QUESTIONS.length - 1) {
            trackQuizComplete(answersRef.current.age);
            setPhase("analysis");
          } else {
            setPhase("affirmation");
            timers.current.push(
              setTimeout(() => {
                setQIndex((i) => i + 1);
                setSelected(null);
                setPhase("question");
              }, AFFIRM_MS),
            );
          }
        }, SELECT_BEAT_MS),
      );
    },
    [qIndex, selected],
  );

  const handleBack = useCallback(() => {
    // Cancel any in-flight select-beat / affirmation timers, then step back.
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSelected(null);
    if (qIndex === 0) {
      setPhase("hook");
    } else {
      setQIndex((i) => i - 1);
      setPhase("question");
    }
  }, [qIndex]);

  const handleAnalysisComplete = useCallback(() => setPhase("reveal"), []);

  // ──────────────────────────────────────────────────────────────────────────
  // PAYWALL SEAM (brief §8): a web-checkout step would slot in HERE, between the
  // acceptance reveal (Screen 11) and email capture (Screen 12). To add it:
  //   1. add a "checkout" phase to the Phase union
  //   2. point handleClaim at "checkout" instead of "email"
  //   3. render <CheckoutScreen/> and advance to "email"/"download" on success
  // v1 ships download-only, so reveal → email.
  // ──────────────────────────────────────────────────────────────────────────
  const handleClaim = useCallback(() => setPhase("email"), []);

  const handleEmailSubmit = useCallback(async (email: string): Promise<boolean> => {
    const attribution = getAttribution();
    const age = answersRef.current.age;
    try {
      const res = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, age, answers: answersRef.current, attribution }),
      });
      if (!res.ok) return false;
      trackLead(age, attribution);
      setPhase("download");
      return true;
    } catch {
      return false;
    }
  }, []);

  const showProgress = phase === "question" || phase === "affirmation";
  const progress = (qIndex + 1) / QUESTIONS.length;

  // Slide/fade between screens; opacity-only when reduced motion is requested.
  const variants = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  const screenKey =
    phase === "question" || phase === "affirmation" ? `${phase}-${qIndex}` : phase;

  return (
    <main className="quiz-shell relative flex flex-col overflow-hidden bg-background text-foreground">
      {/* Calm parchment background with a soft teal glow — pure CSS, fast LCP. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(0,70,74,0.06) 0%, rgba(0,70,74,0) 55%), radial-gradient(100% 60% at 50% 110%, rgba(0,70,74,0.05) 0%, rgba(0,70,74,0) 60%)",
        }}
      />

      {/* Full-bleed teal "you've arrived" backdrop for the reveal. Negative
          safe-area insets push it past the shell padding so it covers the whole
          viewport — behind the notch and home indicator too. */}
      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div
            key="reveal-bg"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute z-0"
            style={{
              top: "calc(-1 * env(safe-area-inset-top))",
              bottom: "calc(-1 * env(safe-area-inset-bottom))",
              left: "calc(-1 * env(safe-area-inset-left))",
              right: "calc(-1 * env(safe-area-inset-right))",
              background:
                "radial-gradient(125% 85% at 50% 0%, #0A565B 0%, #00464A 52%, #00383C 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Back button + soft, calm progress indicator */}
      <div className="shrink-0 px-4 pt-2" style={{ height: showProgress ? undefined : 0 }}>
        {showProgress && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className={`quiz-tap -ml-1 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-opacity active:bg-primary/5 ${
                phase === "question" ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/10">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            {/* symmetry spacer so the bar stays centered */}
            <div className="size-11 shrink-0" aria-hidden />
          </div>
        )}
      </div>

      {/* Screen region — definite height so each screen's h-full resolves. */}
      <div className="relative z-10 min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screenKey}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {phase === "hook" && <HookScreen headline={headline} onStart={handleStart} />}
            {phase === "question" && (
              <QuestionScreen
                question={QUESTIONS[qIndex]}
                selected={selected}
                onSelect={handleSelect}
              />
            )}
            {phase === "affirmation" && (
              <AffirmationScreen text={AFFIRMATIONS[qIndex] ?? AFFIRMATIONS[0]} />
            )}
            {phase === "analysis" && <AnalysisScreen onComplete={handleAnalysisComplete} />}
            {phase === "reveal" && (
              <RevealScreen age={answers.age} wound={answers.wound} onClaim={handleClaim} />
            )}
            {phase === "email" && <EmailScreen onSubmit={handleEmailSubmit} />}
            {phase === "download" && <DownloadScreen />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
