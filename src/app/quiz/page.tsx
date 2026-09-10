import { QuizApp } from "@/components/quiz/quiz-app";
import { SpApp } from "@/components/sp/sp-app";

// One URL for the whole funnel (spec hard rule 2): no ?step=, no /quiz/results,
// and — since Yarin's rule 0 — no `?a=` either. One landing page, one headline,
// the same for every ad. Quiz state lives in memory only.
//
// The Starting Picture funnel (v3) and the live 14-screen funnel (v2) share this
// URL. The old funnel stays reachable until Yarin says cut over, and its files
// are deleted in a separate PR then.
//
// With no query string to read, this route is static: the headline is the LP's
// LCP element and ships from the edge cache rather than a render.

/**
 * v3 serves when the flag says so, and on every Vercel preview deployment.
 *
 * Previews exist to be looked at, they carry no ad traffic, and they sit behind
 * Vercel's own access control — so the funnel being visible there costs nothing
 * and saves setting an environment variable per branch. Production still needs
 * `NEXT_PUBLIC_QUIZ_V3=1` explicitly, which is what keeps the cutover a
 * deliberate act.
 */
function v3Enabled(): boolean {
  return process.env.NEXT_PUBLIC_QUIZ_V3 === "1" || process.env.VERCEL_ENV === "preview";
}

/**
 * `?screen=<id>` jumps straight to a screen. On for local development and for
 * previews, off in production: the live funnel has one URL and nothing in the
 * query string (blueprint §9), and this is how that stays true while the funnel
 * is still being reviewed screen by screen.
 */
function devLinksEnabled(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

export default function QuizPage() {
  if (!v3Enabled()) return <QuizApp />;
  return <SpApp devLinks={devLinksEnabled()} />;
}
