"use client";

import { DoctorReport } from "@/components/doctor-report";
import { FAQs } from "@/components/faqs/faqs";
import { Features } from "@/components/features/features";
import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero/hero";
import { PainPoints } from "@/components/pain-points/pain-points";
import { Transformation } from "@/components/transformation/transformation";
import { Testimonials } from "@/components/testimonials/testimonials";
import { WhoItsFor } from "@/components/who-its-for";
import { SiteSchema } from "@/components/site-schema";

export default function Home() {
  return (
    <>
      <SiteSchema />
      <Hero />
      <PainPoints />
      <Features />
      <DoctorReport />
      <WhoItsFor />
      <Transformation />
      <Testimonials />
      <FAQs />
      <Footer />
    </>
  );
}
