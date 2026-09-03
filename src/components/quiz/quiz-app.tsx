"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Landing } from "./landing";
import { captureAttribution, metaViewContent, trackLandingView } from "@/lib/quiz-analytics";

// Screens 2+ live in a chunk that is fetched, not rendered, until she taps.
// ssr:false is the compliance line (spec hard rule 3): no question, beat or
// results copy is ever present in the HTML served at rythma.co/quiz.
const QuizEngine = dynamic(() => import("./quiz-engine"), {
  ssr: false,
  loading: () => <div className="h-full" aria-hidden />,
});

/**
 * The quiz shell. State lives in memory only — never in the path or the query
 * string (spec hard rule 2), so the whole funnel runs at one URL and Meta sees
 * one neutral page.
 */
export function QuizApp() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    captureAttribution();
    metaViewContent();
    trackLandingView();
    // Warm the engine chunk while she reads the headline, so the first tap is
    // instant. Importing it does not put any of its copy in the HTML.
    const idle = setTimeout(() => void import("./quiz-engine"), 1200);
    return () => clearTimeout(idle);
  }, []);

  const handleStart = useCallback(() => setStarted(true), []);
  const handleExit = useCallback(() => setStarted(false), []);

  return (
    <main className="quiz-shell relative flex flex-col overflow-hidden bg-background text-foreground">
      {/* Calm parchment wash with a soft teal glow — pure CSS, fast LCP. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(0,70,74,0.06) 0%, rgba(0,70,74,0) 55%), radial-gradient(100% 60% at 50% 110%, rgba(0,70,74,0.05) 0%, rgba(0,70,74,0) 60%)",
        }}
      />

      {started ? (
        <QuizEngine onExit={handleExit} />
      ) : (
        <div className="relative z-10 min-h-0 flex-1">
          <Landing onStart={handleStart} />
        </div>
      )}
    </main>
  );
}
