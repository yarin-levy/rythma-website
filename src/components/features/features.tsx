"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  PhoneFrame,
  PredictionScreen,
  CycleScreen,
  PatternsScreen,
  QuickLogScreen,
} from "@/components/screens";

// Legacy type for backwards compatibility
export type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
};

const features = [
  {
    id: "predict",
    title: "Predict Tomorrow",
    subtitle: "Plan ahead",
    description: "Know what's coming so you can plan ahead. Get personalized predictions based on your unique patterns.",
    screen: PredictionScreen,
  },
  {
    id: "cycle",
    title: "Irregular is Normal",
    subtitle: "Your cycle, your way",
    description: "Built for 24-50+ day cycles, not 28-day assumptions. Finally, an app that gets perimenopause.",
    screen: CycleScreen,
  },
  {
    id: "patterns",
    title: "Discover Triggers",
    subtitle: "Connect the dots",
    description: "See what's actually causing your symptoms. Poor sleep? Caffeine? Stress? Find the connections.",
    screen: PatternsScreen,
  },
  {
    id: "quicklog",
    title: "30-Second Tracking",
    subtitle: "Log in seconds",
    description: "Quick taps to log how you're feeling. The more you track, the better your predictions become.",
    screen: QuickLogScreen,
  },
];

export function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ActiveScreen = features[activeIndex].screen;

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="features" className="flex w-full flex-col items-center gap-6 px-6 py-14 md:px-10 md:py-20">
      <Badge variant="secondary" className="uppercase">
        Features
      </Badge>
      <h2 className="text-center text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
        Meet Rythma
        <span className="text-muted-foreground block">Built for the chaos of perimenopause</span>
      </h2>

      <div className="mt-8 w-full max-w-5xl">
        {/* Mobile: Tabs above phone - full width, single line */}
        <div className="lg:hidden mb-8">
          <div className="flex w-full gap-1 sm:gap-2">
            {features.map((feature, i) => (
              <button
                key={feature.id}
                onClick={() => setActiveIndex(i)}
                className={`flex-1 px-2 sm:px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors text-center ${
                  activeIndex === i
                    ? "bg-raspberry text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: Phone with arrow buttons */}
        <div className="lg:hidden flex flex-col items-center">
          <div className="flex items-center gap-4">
            {/* Left arrow */}
            <button
              onClick={goToPrev}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous feature"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <PhoneFrame scale="xs">
              <ActiveScreen />
            </PhoneFrame>

            {/* Right arrow */}
            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next feature"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Subtitle and description */}
          <div className="text-center mt-6 max-w-sm">
            <p className="text-raspberry font-medium text-sm mb-1">
              {features[activeIndex].subtitle}
            </p>
            <p className="text-muted-foreground">
              {features[activeIndex].description}
            </p>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex flex-row items-start gap-12">
          {/* Phone mockup - sticky on desktop */}
          <div className="flex-shrink-0 sticky top-24">
            <PhoneFrame scale="md">
              <ActiveScreen />
            </PhoneFrame>
          </div>

          {/* Desktop: Vertical feature list */}
          <div className="flex-1 flex flex-col gap-3">
            {features.map((feature, i) => (
              <button
                key={feature.id}
                onClick={() => setActiveIndex(i)}
                className={`text-left p-5 rounded-2xl transition-all ${
                  activeIndex === i
                    ? "bg-card shadow-lg border border-raspberry/20"
                    : "bg-transparent hover:bg-muted/50"
                }`}
              >
                <h3 className={`text-lg font-semibold mb-1 ${
                  activeIndex === i ? "text-raspberry" : "text-foreground"
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  activeIndex === i ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {feature.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
