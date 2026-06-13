"use client";

import Header from "@/components/landing/personal/Header";
import { TeamsHero } from "@/components/landing/teams/TeamsHero";
import { TeamsFeatures } from "@/components/landing/teams/TeamsFeatures";
import { TeamsHowItWorks } from "@/components/landing/teams/TeamsHowItWorks";
import { TeamsUseCases } from "@/components/landing/teams/TeamsUseCases";
import { TeamsTestimonials } from "@/components/landing/teams/TeamsTestimonials";
import { TeamsPricing } from "@/components/landing/teams/TeamsPricing";
import { TeamsFAQ } from "@/components/landing/teams/TeamsFAQ";
import { TeamsCTA } from "@/components/landing/teams/TeamsCTA";
import { Footer } from "@/components/landing/personal/Footer";
import { useLandingAnimations } from "@/components/landing/useLandingAnimations";

export default function TeamsPage() {
  useLandingAnimations();

  return (
    <main className="relative theme-teams">
      <Header />
      <TeamsHero />
      <TeamsFeatures />
      <TeamsHowItWorks />
      <TeamsUseCases />
      <TeamsTestimonials />
      <TeamsPricing />
      <TeamsFAQ />
      <TeamsCTA />
      <Footer />
    </main>
  );
}