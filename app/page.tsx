"use client";

import Header from "@/components/landing/Header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { useLandingAnimations } from "@/components/landing/useLandingAnimations";
import { useRef } from "react";

export default function HomePage() {
  const mainRef = useRef(null);
  useLandingAnimations();

  return (
    <main ref={mainRef} className="bg-[var(--evven-background)] text-[var(--evven-text-primary)]">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
