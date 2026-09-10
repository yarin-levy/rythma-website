import { QuizApp } from "@/components/quiz/quiz-app";
import { SpApp } from "@/components/sp/sp-app";
import { landingVariant } from "@/lib/sp/landing";

// One URL for the whole funnel (spec hard rule 2): no ?step=, no /quiz/results.
// Quiz state lives in memory only.
//
// The Starting Picture funnel (v3) and the live 14-screen funnel (v2) share this
// URL. The old funnel stays reachable until Yarin says cut over, and its files
// are deleted in a separate PR then.
//
// `?a=1…6` picks the mini LP's headline (blueprint §4, decision §12.9). It is an
// opaque integer, so no health term can ever sit in the query string, and it is
// read here rather than after hydration so the headline — the LP's LCP element —
// is server-rendered. Reading searchParams makes this route dynamic, which is
// the right trade for a paid lander whose headline changes per creative.

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
 * previews, off in production: the live funnel has one URL and no step in the
 * query string (blueprint §9), and this is how that stays true while the funnel
 * is still being reviewed screen by screen.
 */
function devLinksEnabled(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!v3Enabled()) return <QuizApp />;

  const params = await searchParams;
  return <SpApp variant={landingVariant(params.a)} devLinks={devLinksEnabled()} />;
}
