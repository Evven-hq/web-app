"use client";

import Header from "@/components/landing/personal/Header";
import { Hero } from "@/components/landing/personal/hero";
import { Features } from "@/components/landing/personal/Features";
import { HowItWorks } from "@/components/landing/personal/HowItWorks";
import { UseCases } from "@/components/landing/personal/UseCases";
import { Testimonials } from "@/components/landing/personal/Testimonials";
import { Pricing } from "@/components/landing/personal/Pricing";
import { FAQ } from "@/components/landing/personal/FAQ";
import { CTA } from "@/components/landing/personal/CTA";
import { Footer } from "@/components/landing/personal/Footer";
import { useLandingAnimations } from "@/components/landing/useLandingAnimations";
import { useRef } from "react";

export default function HomePage() {
  const mainRef = useRef(null);
  useLandingAnimations();

  return (
    <main className="relative">
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
