"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  FLOW,
  METHOD,
  PRIVACY,
  RAIL_TYPES,
  VIDEOS,
  question,
  type ChipsQuestion,
  type MultiQuestion,
  type SingleQuestion,
} from "@/lib/sp/data";
import {
  buildStartingPicture,
  recognizedHeadline,
  selectAdvertorial,
  selectBridge,
  selectEcho,
  selectMethodEcho,
  selectQuoteOrder,
  selectUrgency,
  type SpAnswers,
} from "@/lib/sp/reveal";
import type { PlanId } from "@/lib/sp/pricing";
import {
  metaInitiateCheckout,
  metaLead,
  getAttribution,
  haptic,
  newEventId,
  trackActViewed,
  trackAgeBand,
  trackAppStoreRedirect,
  trackCheckoutViewed,
  trackCtaTapped,
  trackGateFailed,
  trackGateSubmitted,
  trackGateViewed,
  trackHandoffViewed,
  trackLoaderShown,
  trackPaywallViewed,
  trackPlanSelected,
  trackRevealViewed,
  trackStarted,
  trackStepAnswered,
  trackStepViewed,
} from "@/lib/sp/analytics";
import { SectionRail } from "./rail";
import { AdvertorialScreen, BridgeScreen, EchoScreen, RecognizedScreen, RuledBeatScreen } from "./screens/beats";
import { CheckoutScreen } from "./screens/checkout";
import { GateScreen } from "./screens/gate";
import { HandoffScreen } from "./screens/handoff";
import { LoaderScreen } from "./screens/loader";
import { PlanCardsScreen } from "./screens/plan-cards";
import { PlanScreen } from "./screens/plan";
import { QuotesScreen } from "./screens/quotes";
import { RevealScreen } from "./screens/reveal";
import { ChipsScreen, MultiQuestionScreen, SingleQuestionScreen } from "./screens/question";
import { VideoScreen } from "./screens/video";

// Screens 1–31. This module is imported with ssr:false, so none of its copy is
// ever in the HTML served at /quiz — that is the whole reason the mini LP lives
// in its own component and its own import-free module.
//
// The engine holds no branching of its own: every branch, order and derived
// string comes from reveal.ts, which is unit-tested without a DOM.

const SELECT_HOLD_MS = 340; // let the chosen answer register before moving on

/**
 * NEW STRING (for Yarin): the blueprint has no error state for screen 24.
 * Written in its voice, no banned substring, and it says what to do next.
 */
const GATE_ERROR = "That didn’t save. Check the address and try again.";

/** Screen 10a is a fork off `cycle`, not a step; the rail's count is unchanged. */
const FORK_AFTER = "cycle";
const FORK_TRIGGER = "noPeriods";
const FORK_ID = "no_period_reason";

/** Previous question screen. Back never lands on a beat, a video or the reveal. */
function previousQuestionIndex(index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    if (RAIL_TYPES.includes(FLOW[i].type)) return i;
  }
  return -1;
}

/**
 * Dev-only deep link: `?screen=<id>` jumps straight to a screen. Never in
 * production — the funnel has one URL and no step in the query string
 * (blueprint §9).
 */
function devScreenIndex(): number | null {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") return null;
  const id = new URLSearchParams(window.location.search).get("screen");
  if (!id) return null;
  const byId = FLOW.findIndex((s) => s.id === id);
  if (byId >= 0) return byId;
  const byNumber = FLOW.findIndex((s) => String(s.n) === id);
  return byNumber >= 0 ? byNumber : null;
}

export default function SpEngine({ variant, onExit }: { variant: number; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SpAnswers>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [onFork, setOnFork] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<PlanId>("annual");
  const [gatePending, setGatePending] = useState(false);
  const [gateError, setGateError] = useState<string | undefined>();
  /**
   * Her profile key. Sent back on a resubmit so a corrected email updates her
   * row instead of orphaning it behind a second profile, and it is what M3
   * hands Stripe as `client_reference_id`.
   */
  const [rythmaId, setRythmaId] = useState<string | undefined>();
  const reduceMotion = useReducedMotion();

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const leadFired = useRef(false);
  const lastAct = useRef<string | null>(null);

  useEffect(() => {
    trackStarted(variant);
    const start = devScreenIndex();
    if (start !== null) setIndex(start);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [variant]);

  const screen = FLOW[index];
  const picture = useMemo(() => buildStartingPicture(answers), [answers]);

  // One step_viewed per screen, and one act_viewed per act boundary.
  useEffect(() => {
    trackStepViewed(onFork ? FORK_ID : screen.id, screen.n, screen.act);
    if (lastAct.current !== screen.act) {
      lastAct.current = screen.act;
      trackActViewed(screen.act);
    }
  }, [onFork, screen.act, screen.id, screen.n]);

  const goTo = useCallback((next: number) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSelected(null);
    setOnFork(false);
    setIndex(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const advance = useCallback(() => goTo(index + 1), [goTo, index]);

  const handleBack = useCallback(() => {
    if (onFork) {
      setOnFork(false);
      setSelected(null);
      return;
    }
    const prev = previousQuestionIndex(index);
    if (prev < 0) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      onExit();
      return;
    }
    goTo(prev);
  }, [goTo, index, onExit, onFork]);

  const record = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    trackStepAnswered(id, value);
  }, []);

  /** Single select: highlight, record, auto-advance — or open the 10a fork. */
  const handleSelect = useCallback(
    (id: string, value: string) => {
      if (selected !== null) return; // guard double taps
      setSelected(value);
      haptic();
      record(id, value);
      if (id === "age") trackAgeBand(value);

      const opensFork = id === FORK_AFTER && value === FORK_TRIGGER;
      timers.current.push(
        setTimeout(() => {
          if (opensFork) {
            setSelected(null);
            setOnFork(true);
          } else {
            goTo(index + 1);
          }
        }, SELECT_HOLD_MS),
      );
    },
    [goTo, index, record, selected],
  );

  const handleForkSelect = useCallback(
    (value: string) => {
      if (selected !== null) return;
      setSelected(value);
      haptic();
      record(FORK_ID, value);
      timers.current.push(setTimeout(() => goTo(index + 1), SELECT_HOLD_MS));
    },
    [goTo, index, record, selected],
  );

  const handleToggle = useCallback((id: string, value: string, q: MultiQuestion | ChipsQuestion) => {
    haptic();
    setAnswers((prev) => {
      const current = (prev[id as keyof SpAnswers] as string[] | undefined) ?? [];
      const exclusive = q.kind === "multi" ? q.exclusive : undefined;
      // "None of these" clears everything else, and anything else clears it.
      if (exclusive && value === exclusive) {
        return { ...prev, [id]: current.includes(value) ? [] : [value] };
      }
      const without = exclusive ? current.filter((v) => v !== exclusive) : current;
      const next = without.includes(value) ? without.filter((v) => v !== value) : [...without, value];
      const max = q.kind === "multi" ? q.max : undefined;
      return { ...prev, [id]: max !== undefined ? next.slice(-max) : next };
    });
  }, []);

  const handleMultiContinue = useCallback(
    (id: string) => {
      trackStepAnswered(id, (answers[id as keyof SpAnswers] as string[] | undefined) ?? []);
      advance();
    },
    [advance, answers],
  );

  /**
   * Screen 24. The profile write is what the funnel exists for, so a failure
   * keeps her here with a worded error rather than dropping her into a reveal
   * whose handoff would be broken. The browser `Lead` fires only once, and only
   * after the write succeeds, so a retry cannot double-count her.
   */
  const handleGateSubmit = useCallback(async () => {
    setGatePending(true);
    setGateError(undefined);
    const eventId = newEventId();
    try {
      const res = await fetch("/api/sp/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rythmaId,
          email,
          firstName,
          variant,
          eventId,
          answers,
          symptoms: answers.symptoms ?? [],
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error(`profile ${res.status}`);
      const body = (await res.json()) as { rythmaId?: string };
      setRythmaId(body.rythmaId);
    } catch (e) {
      console.error("sp: profile write failed", e);
      setGatePending(false);
      setGateError(GATE_ERROR);
      trackGateFailed();
      return;
    }
    setGatePending(false);
    if (!leadFired.current) {
      leadFired.current = true;
      metaLead(eventId);
    }
    trackGateSubmitted();
    advance();
  }, [advance, answers, email, firstName, rythmaId, variant]);

  const handlePlanCta = useCallback(() => {
    trackCtaTapped(plan);
    metaInitiateCheckout();
    advance();
  }, [advance, plan]);

  // ── One-shot events tied to specific screens ────────────────────────────
  useEffect(() => {
    if (screen.type === "loader") trackLoaderShown();
    if (screen.type === "gate") trackGateViewed();
    if (screen.type === "reveal") {
      trackRevealViewed({
        validationCount: picture.count,
        candidateTest: picture.candidate.id,
        topCategory: picture.topCategory,
      });
    }
    if (screen.type === "plan") trackPaywallViewed(picture.planOrder[0]);
    if (screen.type === "checkout") trackCheckoutViewed(plan);
    if (screen.type === "handoff") trackHandoffViewed();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one fire per screen
  }, [screen.id]);

  const topSymptoms = useMemo(() => (answers.symptoms ?? []).slice(0, 3), [answers.symptoms]);
  const railVisible = RAIL_TYPES.includes(screen.type);

  // 320ms fade + 16px slide on entry; prefers-reduced-motion drops the slide
  // (blueprint §2, Motion).
  //
  // Entry only, and deliberately not `AnimatePresence mode="wait"` (which the
  // v2 engine uses): that mode holds the outgoing screen until its exit
  // animation reports complete, so moving between screens depends on an
  // animation callback firing. The blueprint asks for no exit animation, so
  // that dependency buys nothing, and a keyed enter-only transition cannot get
  // stuck part-way. Navigation should not be able to fail because an animation
  // did not.
  const enter = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <>
      {railVisible && (
        <SectionRail
          actId={screen.act}
          screenNumber={screen.n}
          onBack={handleBack}
          selectedCount={screen.id === "symptoms" ? (answers.symptoms ?? []).length : undefined}
        />
      )}

      <motion.div
        key={onFork ? `${screen.id}:fork` : screen.id}
        initial={enter.initial}
        animate={enter.animate}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        {onFork ? (
          <SingleQuestionScreen
            question={question(FORK_ID) as SingleQuestion}
            selected={selected}
            answered={answers.no_period_reason}
            onSelect={handleForkSelect}
          />
        ) : (
          renderScreen()
        )}
      </motion.div>
    </>
  );

  function renderScreen() {
    switch (screen.type) {
      case "question": {
        const q = question(screen.id);
        if (q.kind === "single") {
          return (
            <SingleQuestionScreen
              question={q}
              selected={selected}
              answered={answers[screen.id as keyof SpAnswers] as string | undefined}
              onSelect={(value) => handleSelect(screen.id, value)}
            />
          );
        }
        if (q.kind === "multi") {
          return (
            <MultiQuestionScreen
              question={q}
              selected={(answers[screen.id as keyof SpAnswers] as string[] | undefined) ?? []}
              onToggle={(value) => handleToggle(screen.id, value, q)}
              onContinue={() => handleMultiContinue(screen.id)}
            />
          );
        }
        return null;
      }

      case "chips": {
        const q = question(screen.id) as ChipsQuestion;
        return (
          <ChipsScreen
            question={q}
            selected={answers.symptoms ?? []}
            onToggle={(value) => handleToggle("symptoms", value, q)}
            onContinue={() => handleMultiContinue("symptoms")}
          />
        );
      }

      case "echo":
        // Screen 8 is an echo whose headline is her own count.
        return screen.id === "recognized" ? (
          <RecognizedScreen count={picture.count} headline={recognizedHeadline(picture.count)} onContinue={advance} />
        ) : (
          <EchoScreen echo={selectEcho(answers.moment)} onContinue={advance} />
        );

      case "video":
        return <VideoScreen spec={VIDEOS[screen.id]} onContinue={advance} />;

      case "advertorial":
        return (
          <AdvertorialScreen paragraphs={selectAdvertorial(answers.tracking, answers.cycle)} onContinue={advance} />
        );

      case "method":
        return screen.id === "privacy" ? (
          <RuledBeatScreen screen={PRIVACY} onContinue={advance} />
        ) : (
          <RuledBeatScreen screen={METHOD} echo={selectMethodEcho(answers.doctor)} onContinue={advance} />
        );

      case "loader":
        return <LoaderScreen onComplete={advance} />;

      case "gate":
        return (
          <GateScreen
            firstName={firstName}
            email={email}
            onChange={(patch) => {
              if (patch.firstName !== undefined) setFirstName(patch.firstName);
              if (patch.email !== undefined) setEmail(patch.email);
            }}
            onSubmit={() => void handleGateSubmit()}
            pending={gatePending}
            error={gateError}
          />
        );

      case "reveal":
        return <RevealScreen picture={picture} firstName={firstName} onContinue={advance} />;

      case "plan-cards":
        return <PlanCardsScreen order={picture.planOrder} onContinue={advance} />;

      case "quotes":
        return <QuotesScreen order={selectQuoteOrder(answers.moment)} onContinue={advance} />;

      case "bridge":
        return <BridgeScreen bridge={selectBridge(answers)} onContinue={advance} />;

      case "plan":
        return (
          <PlanScreen
            firstName={firstName}
            topSymptoms={topSymptoms}
            proofOrder={picture.proofOrder}
            quoteId={selectQuoteOrder(answers.moment)[0]}
            urgency={selectUrgency(answers.intensity)}
            plan={plan}
            onSelectPlan={(next) => {
              setPlan(next);
              trackPlanSelected(next);
            }}
            onContinue={handlePlanCta}
          />
        );

      case "checkout":
        return <CheckoutScreen firstName={firstName} topSymptoms={topSymptoms} plan={plan} onContinue={advance} />;

      case "handoff":
        return <HandoffScreen onAppStore={trackAppStoreRedirect} />;

      default:
        return null;
    }
  }
}
