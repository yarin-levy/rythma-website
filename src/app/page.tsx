"use client";

import { DoctorReport } from "@/components/doctor-report";
import { FAQs } from "@/components/faqs/faqs";
import { Features } from "@/components/features/features";
import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero/hero";
import { PainPoints } from "@/components/pain-points/pain-points";
import { Transformation } from "@/components/transformation/transformation";
import { Testimonials } from "@/components/testimonials/testimonials";
import { Waitlist } from "@/components/waitlist/waitlist";
import { StickyCTA } from "@/components/sticky-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Features />
      <DoctorReport />
      <Transformation />
      <Testimonials />
      <Waitlist />
      <FAQs />
      <Footer />
      <StickyCTA />
    </>
  );
}
