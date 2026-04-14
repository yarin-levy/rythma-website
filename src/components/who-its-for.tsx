import { Badge } from "@/components/ui/badge";

export function WhoItsFor() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Badge variant="secondary" className="uppercase mb-4">
          Who It&apos;s For
        </Badge>
        <h2 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl mb-4 font-display">
          Designed for women navigating
          <span className="text-raspberry block">perimenopause</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          For women aged 40–55 where cycles range from 21 to 50+ days and
          traditional trackers fall short. Rythma understands that irregular is
          your new normal — and gives you clarity instead of confusion.
        </p>
      </div>
    </section>
  );
}
