"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SpLanding } from "./landing";
import { captureAttribution, metaViewContent, trackLpViewed } from "@/lib/sp/analytics";

// Screens 1–31 and the LP's below-the-fold block both live in chunks that are
// fetched, not rendered, until after hydration. `ssr:false` is the compliance
// line (blueprint §9): no question, beat, video caption or evidence footer is
// ever present in the HTML served at rythma.co/quiz.
const SpEngine = dynamic(() => import("./sp-engine"), {
  ssr: false,
  loading: () => <div className="min-h-svh" aria-hidden />,
});

const SpLandingBelow = dynamic(() => import("./landing-below"), {
  ssr: false,
  loading: () => null,
});

/**
 * The Starting Picture funnel's shell. State lives in memory only — never in
 * the path or the query string — so the whole funnel runs at one URL and Meta
 * sees one neutral page. Literally one page: there are no ad variants and no
 * `?a=` param (build brief rule 0).
 *
 * `.sp` is set here and nowhere else: it is what scopes the funnel's tokens so
 * the marketing site and the blog are untouched by them.
 */
/** Importing the engine puts none of its copy in the HTML; it only fetches. */
function warmEngine() {
  void import("./sp-engine");
}

export function SpApp({ devLinks = false }: { devLinks?: boolean }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    captureAttribution();
    metaViewContent();
    trackLpViewed();
    // `?screen=` has to open the engine, not just position it: the engine does
    // not mount until she taps Begin, so without this the deep link silently
    // did nothing and left her on the LP. Read here rather than during render,
    // so the server and the first client pass agree.
    if (devLinks && new URLSearchParams(window.location.search).has("screen")) {
      setStarted(true);
    }
    // Warm the engine chunk once the page is idle, so the first tap is still
    // instant. Not on a fixed 1.2s timer: that parsed the whole engine in the
    // middle of the landing page's load, which Lighthouse charged as blocking
    // time. Intent (below) warms it sooner if she heads for the button first.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(warmEngine, { timeout: 4000 });
      else timer = setTimeout(warmEngine, 2500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
    };
  }, [devLinks]);

  const handleStart = useCallback(() => setStarted(true), []);
  const handleExit = useCallback(() => setStarted(false), []);

  return (
    <main className="sp flex flex-col">
      {started ? (
        <SpEngine devLinks={devLinks} onExit={handleExit} />
      ) : (
        <SpLanding onStart={handleStart} onIntent={warmEngine} below={<SpLandingBelow />} />
      )}
    </main>
  );
}
