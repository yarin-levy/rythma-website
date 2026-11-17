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
// With no query string to read, this route is static again, which is the right
// shape for a paid lander: the headline is the LCP element and now ships from
// the edge cache rather than a render.
export default function QuizPage() {
  if (process.env.NEXT_PUBLIC_QUIZ_V3 !== "1") return <QuizApp />;
  return <SpApp />;
}
