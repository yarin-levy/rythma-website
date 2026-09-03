import { QuizApp } from "@/components/quiz/quiz-app";

// One URL for the whole funnel (spec hard rule 2): no ?step=, no /quiz/results,
// no variant params. Quiz state lives in memory only.
export default function QuizPage() {
  return <QuizApp />;
}
