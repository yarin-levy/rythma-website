import { QuizFunnel } from "@/components/quiz/quiz-funnel";

// Ad-angle headline variant comes in via ?v= (e.g. /quiz?v=sleep). See
// HEADLINE_VARIANTS in lib/quiz-data.ts.
export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; screen?: string }>;
}) {
  const { v, screen } = await searchParams;
  return <QuizFunnel initialVariant={v} initialScreen={screen} />;
}
