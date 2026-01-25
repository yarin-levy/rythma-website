import { Badge } from "@/components/ui/badge";
import { PhoneFrame, Week1Screen, Week8Screen } from "@/components/screens";

export function Transformation() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="uppercase mb-6">
            Your Journey
          </Badge>
          <h2 className="text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
            From chaos to clarity
            <span className="text-muted-foreground block">in 8 weeks</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Week 1 */}
          <div className="bg-gradient-to-br from-raspberry/5 to-tangerine/5 rounded-3xl p-6 md:p-8 shadow-lg border border-raspberry/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-raspberry/10 flex items-center justify-center text-raspberry font-semibold text-sm">
                W1
              </div>
              <div>
                <p className="font-semibold text-foreground">Week 1</p>
                <p className="text-sm text-raspberry font-medium">&quot;What&apos;s happening to me?&quot;</p>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <PhoneFrame scale="sm">
                <Week1Screen />
              </PhoneFrame>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-foreground">
                <span className="w-2 h-2 rounded-full bg-raspberry mt-2 flex-shrink-0" />
                <span>Symptoms feel random</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="w-2 h-2 rounded-full bg-tangerine mt-2 flex-shrink-0" />
                <span>No predictions yet</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <span className="w-2 h-2 rounded-full bg-cyan mt-2 flex-shrink-0" />
                <span>Learning your patterns</span>
              </li>
            </ul>
          </div>

          {/* Week 8 */}
          <div className="bg-gradient-to-br from-green/5 to-cyan/5 rounded-3xl p-6 md:p-8 shadow-lg border border-green/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green text-white flex items-center justify-center font-semibold text-sm">
                W8
              </div>
              <div>
                <p className="font-semibold text-foreground">Week 8</p>
                <p className="text-sm text-green">&quot;I finally understand my body&quot;</p>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <PhoneFrame scale="sm">
                <Week8Screen />
              </PhoneFrame>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-foreground">
                <svg className="w-5 h-5 text-green flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>84% prediction accuracy</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <svg className="w-5 h-5 text-green flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>4 patterns identified</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <svg className="w-5 h-5 text-green flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>No more guessing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
