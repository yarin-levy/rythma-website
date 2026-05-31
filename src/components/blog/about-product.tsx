import { CTAButton } from "@/components/blog/cta-button";

export function AboutProduct() {
  return (
    <div className="my-12 rounded-2xl border border-primary/20 bg-card p-6 sm:p-8">
      <h3 className="font-display text-xl font-medium text-ink">About Rythma</h3>
      <p className="mt-3 leading-7 text-ink-soft">
        Rythma is a perimenopause tracking app for iPhone that learns each user&apos;s personal symptom
        patterns and predicts difficult days before they arrive. Built specifically for the
        unpredictability of perimenopause — rather than the fixed 28-day cycle most period apps assume —
        it helps women anticipate symptoms, plan their lives around hard days, and bring a clear symptom
        report to their doctor.
      </p>
      <div className="mt-5">
        <CTAButton />
      </div>
    </div>
  );
}
