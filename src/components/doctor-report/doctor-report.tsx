"use client";

import { Badge } from "@/components/ui/badge";
import { PhoneFrame, ReportScreen } from "@/components/screens";

export function DoctorReport() {
  return (
    <section className="py-16 md:py-24 bg-[#F9FAFB]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <Badge variant="secondary" className="uppercase mb-4">
              Doctor Reports
            </Badge>
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl mb-4">
              Be heard at your
              <span className="text-raspberry block">next appointment</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto lg:mx-0">
              One-tap PDF to advocate for yourself. Finally have the data to back up what you&apos;ve been feeling.
            </p>

            <ul className="space-y-3 text-left max-w-sm mx-auto lg:mx-0">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-raspberry/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-raspberry" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Symptom summary with frequency data</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-raspberry/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-raspberry" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Cycle length patterns over time</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-raspberry/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-raspberry" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Identified triggers and correlations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-raspberry/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-raspberry" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">Share instantly via email or print</span>
              </li>
            </ul>
          </div>

          {/* Phone mockup */}
          <div className="flex-shrink-0">
            <PhoneFrame scale="md">
              <ReportScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
