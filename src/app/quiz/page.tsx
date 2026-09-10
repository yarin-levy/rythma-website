import { QuizApp } from "@/components/quiz/quiz-app";
import { SpApp } from "@/components/sp/sp-app";
import { landingVariant } from "@/lib/sp/landing";

// One URL for the whole funnel (spec hard rule 2): no ?step=, no /quiz/results.
// Quiz state lives in memory only.
//
// The Starting Picture funnel (v3) and the live 14-screen funnel (v2) share this
// URL, switched by NEXT_PUBLIC_QUIZ_V3. The old funnel stays reachable until
// Yarin says cut over, and its files are deleted in a separate PR then.
//
// `?a=1…6` picks the mini LP's headline (blueprint §4, decision §12.9). It is an
// opaque integer, so no health term can ever sit in the query string, and it is
// read here rather than after hydration so the headline — the LP's LCP element —
// is server-rendered. Reading searchParams makes this route dynamic, which is
// the right trade for a paid lander whose headline changes per creative.
export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (process.env.NEXT_PUBLIC_QUIZ_V3 !== "1") return <QuizApp />;

  const params = await searchParams;
  return <SpApp variant={landingVariant(params.a)} />;
}
