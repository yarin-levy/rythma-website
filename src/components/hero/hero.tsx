import { Nav } from "@/components/hero/nav";
import { BackgroundBlur } from "@/components/ui/background-blur";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <div className="relative w-full">
      <div className="z-1 grid w-full place-items-center p-6 sm:p-8 pb-0">
        <BackgroundBlur className="-top-40 md:-top-0" />
        <Nav />
        <div className="mt-2 sm:mt-12 flex flex-col items-center gap-3 sm:gap-5">
          <Pill>
            <p className="text-muted-foreground px-2 sm:px-3 text-[11px] font-medium sm:text-sm">
              <span className="text-foreground font-semibold">2,000+</span> women on the waitlist
            </p>
          </Pill>
          <h1 className="text-center text-[1.85rem] leading-[1.1] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            <span className="whitespace-nowrap">Know your hard days</span>
            <span className="text-muted-foreground block">before they hit</span>
          </h1>
          <p className="max-w-xl text-center leading-6 sm:leading-7 tracking-tight text-ink-soft text-[13px] sm:text-xl px-2">
            Rythma is the perimenopause app that learns your patterns and predicts symptoms before they arrive. Finally plan your life around your body, not the other way around.
          </p>
          <Button className="w-fit" size="lg" asChild>
            <Link href="/#waitlist">Join the Waitlist</Link>
          </Button>
        </div>

        {/* Hero image */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mt-6 sm:mt-8 z-10">
          <Image
            src="/hero-hand.png"
            alt="Hand holding phone showing Rythma app"
            width={800}
            height={1000}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Full-width gradient at bottom that fades to white */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F9FAFB] to-transparent z-20 pointer-events-none" />
    </div>
  );
}
