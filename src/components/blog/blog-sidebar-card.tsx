import { CTAButton } from "@/components/blog/cta-button";

export function BlogSidebarCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-display text-lg font-medium text-ink">Rythma</h3>
      <p className="mt-1 text-sm text-ink-soft">Know your hard days before they hit.</p>
      <ul className="mt-4 space-y-2 text-sm text-ink-soft">
        <li className="flex gap-2"><span className="text-primary">•</span> Built for the unpredictability of perimenopause</li>
        <li className="flex gap-2"><span className="text-primary">•</span> Predicts difficult days from your own patterns</li>
        <li className="flex gap-2"><span className="text-primary">•</span> A clear symptom report for your doctor</li>
      </ul>
      <div className="mt-5 flex flex-col items-center gap-3">
        <CTAButton />
      </div>
    </div>
  );
}
