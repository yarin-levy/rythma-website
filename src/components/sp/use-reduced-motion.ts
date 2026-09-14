"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether she has asked for less motion. Blueprint §2: "prefers-reduced-motion
 * drops the slide and every stagger."
 *
 * Its own hook rather than motion's `useReducedMotion`, which caches the answer
 * globally on first read: this one follows the setting if she changes it
 * mid-funnel, and it can be driven in tests with a plain `matchMedia` stub.
 * `false` on the server and before hydration, so markup matches.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}
