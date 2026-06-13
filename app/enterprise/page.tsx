"use client";

import Header from "@/components/landing/personal/Header";
import { EnterpriseHero } from "@/components/landing/enterprise/EnterpriseHero";
import { EnterpriseFeatures } from "@/components/landing/enterprise/EnterpriseFeatures";
import { EnterpriseHowItWorks } from "@/components/landing/enterprise/EnterpriseHowItWorks";
import { EnterpriseUseCases } from "@/components/landing/enterprise/EnterpriseUseCases";
import { EnterpriseTestimonials } from "@/components/landing/enterprise/EnterpriseTestimonials";
import { EnterprisePricing } from "@/components/landing/enterprise/EnterprisePricing";
import { EnterpriseFAQ } from "@/components/landing/enterprise/EnterpriseFAQ";
import { EnterpriseCTA } from "@/components/landing/enterprise/EnterpriseCTA";
import { Footer } from "@/components/landing/personal/Footer";
import { useLandingAnimations } from "@/components/landing/useLandingAnimations";

export default function EnterprisePage() {
  useLandingAnimations();

  return (
    <main className="relative theme-enterprise">
      <Header />
      <EnterpriseHero />
      <EnterpriseFeatures />
      <EnterpriseHowItWorks />
      <EnterpriseUseCases />
      <EnterpriseTestimonials />
      <EnterprisePricing />
      <EnterpriseFAQ />
      <EnterpriseCTA />
      <Footer />
    </main>
  );
}