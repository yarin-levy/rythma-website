"use client";

import { useEffect, useState } from "react";
import { LOADER } from "@/lib/sp/data";
import { CheckGlyph, Footnote, Prompt, Screen } from "../ui";
import { usePrefersReducedMotion } from "../use-reduced-motion";

/**
 * Screen 23. Four lines tick in over ~5s, then it advances on its own.
 * Nothing spins, nothing counts down, nothing celebrates (blueprint §2, Motion).
 *
 * Under prefers-reduced-motion every line is there from the start — the
 * blueprint drops "every stagger" — and the screen still holds for the same
 * ~5s, because the wait is pacing, not motion.
 */
export function LoaderScreen({ onComplete }: { onComplete: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [ticked, setTicked] = useState(0);
  const shown = reduced ? LOADER.lines.length : ticked;
  const step = LOADER.totalMs / LOADER.lines.length;

  useEffect(() => {
    const timers = LOADER.lines.map((_, i) => setTimeout(() => setTicked(i + 1), step * (i + 1)));
    const done = setTimeout(onComplete, LOADER.totalMs);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete, step]);

  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-8">
        <Prompt>{LOADER.title}</Prompt>
        <ol className="flex flex-col gap-4" aria-live="polite">
          {LOADER.lines.map((line, i) => (
            <li
              key={line}
              className={`flex items-center gap-3 text-[length:var(--sp-text-body)] leading-[1.4] ${
                i < shown ? "sp-tick text-sp-ink" : "text-sp-ink3 opacity-0"
              }`}
            >
              <CheckGlyph className="size-5 shrink-0" />
              {line}
            </li>
          ))}
        </ol>
        <Footnote>{LOADER.sub}</Footnote>
      </div>
    </Screen>
  );
}
