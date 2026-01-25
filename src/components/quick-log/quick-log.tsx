import { PhoneFrame, QuickLogScreen } from "@/components/screens";

export function QuickLog() {
  return (
    <section className="py-12 md:py-16 px-6 bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-shrink-0">
            <PhoneFrame scale="sm">
              <QuickLogScreen />
            </PhoneFrame>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Track in 30 seconds a day
            </h3>
            <p className="text-muted-foreground text-lg max-w-md">
              Quick taps to log how you&apos;re feeling. The more you track, the better your predictions become.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
