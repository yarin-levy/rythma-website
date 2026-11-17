import { Suspense } from "react";
import { FeedbackSurvey } from "@/components/feedback-survey";

export default function FeedbackPage() {
  return (
    <Suspense>
      <FeedbackSurvey />
    </Suspense>
  );
}
