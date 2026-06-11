"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navigation = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const features = [
  {
    title: "Shared expense tracking",
    description:
      "Invite friends, roommates, or travel partners and keep every charge visible in one shared space.",
  },
  {
    title: "Auto balance calculations",
    description:
      "Let Evven do the math: see who owes what instantly and eliminate awkward settling conversations.",
  },
  {
    title: "Fast settlements",
    description:
      "Create payment plans, record reimbursements, and close out group expenses in minutes.",
  },
];

const useCases = [
  {
    title: "Roommates",
    description: "Split rent, utilities, groceries, and shared subscriptions without confusion.",
  },
  {
    title: "Trips",
    description: "Manage travel costs, activity tickets, and shared meals with real-time clarity.",
  },
  {
    title: "Events",
    description: "Keep wedding gifts, dinners, and group outings balanced across every participant.",
  },
];

const testimonials = [
  {
    quote:
      "Evven made our travel planning so much easier. No more calculating who paid for what — everything is clear and fair.",
    name: "Maya R.",
    role: "Travel group organizer",
  },
  {
    quote:
      "My roommates love it. We finally stayed on top of utilities and groceries without uncomfortable money talks.",
    name: "Jordan L.",
    role: "College student",
  },
];

const faqs = [
  {
    question: "Can I use EvenUp for recurring expenses?",
    answer:
      "Yes. You can track subscriptions, monthly bills, and repeated payments with flexible split options.",
  },
  {
    question: "Is my data shared securely?",
    answer:
      "Your expense history is stored securely and only visible to the people in your group.",
  },
  {
    question: "Do I need to pay to start?",
    answer:
      "You can get started for free with the basic plan and upgrade only when your group needs advanced reporting.",
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    // Entrance animations
    const tl = gsap.timeline();

    // Animate hero heading
    tl.fromTo(
      ".hero-heading",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0
    );

    // Animate hero subheading
    tl.fromTo(
      ".hero-subheading",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.2
    );

    // Animate hero buttons
    tl.fromTo(
      ".hero-buttons",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.4
    );

    // Animate stats card
    tl.fromTo(
      ".stats-card",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      0.6
    );

    // Scroll trigger animations for sections
    const sections = document.querySelectorAll(".section-animate");
    sections.forEach((section, index) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        }
      );
    });

    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Close mobile menu when link is clicked
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <main ref={mainRef} className="bg-[var(--evven-background)] text-[var(--evven-text-primary)]">
      <header className="fixed inset-x-0 top-0 z-50 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 px-8 py-4 shadow-lg">
          <Link href="/" className="flex items-center gap-2">
            <img src="/EvenUp-black.svg" alt="Evven" className="w-8 h-8" />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-[var(--evven-text-primary)] transition hover:text-[var(--evven-accent-primary)] font-medium">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/signup">
              <Button className="rounded-full px-6 py-2.5 text-sm bg-[var(--evven-accent-primary)] hover:bg-[var(--evven-accent-primary)]/90 text-white font-semibold">Start free</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col items-center justify-center gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-5 bg-[var(--evven-text-primary)] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-5 bg-[var(--evven-text-primary)] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 bg-[var(--evven-text-primary)] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden absolute top-full left-6 right-6 mt-4 rounded-2xl bg-white/30 backdrop-blur-2xl border border-white/30 p-6 space-y-4 shadow-lg"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="block text-sm text-[var(--evven-text-primary)] hover:text-[var(--evven-accent-primary)] font-medium transition"
              >
                {item.label}
              </a>
            ))}
            <Link href="/signup" onClick={handleNavClick}>
              <Button className="w-full rounded-full bg-[var(--evven-accent-primary)] hover:bg-[var(--evven-accent-primary)]/90 text-white font-semibold">
                Start free
              </Button>
            </Link>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden px-6 pt-32 sm:pt-48 lg:pt-64 pb-32 sm:pb-48 lg:pb-56">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="hero-heading text-6xl sm:text-7xl lg:text-8xl font-heading tracking-tight leading-tight">
                Keep shared costs fair, clear, and totally handled.
              </h1>
              <p className="hero-subheading mx-auto max-w-2xl text-xl sm:text-2xl text-[var(--evven-text-muted)] leading-relaxed">
                Evven makes group expense tracking simple. Log costs, split automatically, and settle without the awkward conversations.
              </p>
            </div>

            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button className="rounded-full px-10 py-3.5 text-base bg-[var(--evven-accent-primary)] hover:bg-[var(--evven-accent-primary)]/90 text-white">Get started free</Button>
              </Link>
              <a href="https://github.com/jagdep-singh/Evven" target="_blank" rel="noreferrer">
                <Button variant="outline" className="rounded-full px-10 py-3.5 text-base border-[var(--evven-border)] hover:bg-[var(--evven-surface)]">View on GitHub</Button>
              </a>
            </div>
          </div>

          <div className="stats-card mt-28 sm:mt-32 rounded-2xl border border-[var(--evven-border)] bg-white p-8 sm:p-12 shadow-lg">
            <div className="grid gap-12 sm:grid-cols-3">
              <div className="text-center space-y-3">
                <p className="text-4xl sm:text-5xl font-semibold text-[var(--evven-accent-primary)]">25%</p>
                <p className="text-sm text-[var(--evven-text-muted)]">Avg. time saved</p>
              </div>
              <div className="text-center space-y-3">
                <p className="text-4xl sm:text-5xl font-semibold text-[var(--evven-accent-primary)]">1.2k+</p>
                <p className="text-sm text-[var(--evven-text-muted)]">Groups onboarded</p>
              </div>
              <div className="text-center space-y-3">
                <p className="text-4xl sm:text-5xl font-semibold text-[var(--evven-accent-primary)]">3.4k+</p>
                <p className="text-sm text-[var(--evven-text-muted)]">Settlements closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-animate border-t border-[var(--evven-border)] px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 mb-20">
            <p className="section-label">Core Features</p>
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
              Everything you need to split expenses and settle up.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div key={feature.title} className="feature-card space-y-4 pt-8 pb-8 border-t border-[var(--evven-border)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--evven-accent-secondary)] flex items-center justify-center text-base font-semibold text-[var(--evven-accent-primary)]">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-[var(--evven-text-primary)]">{feature.title}</h3>
                <p className="text-[var(--evven-text-muted)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-animate bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 mb-16">
            <p className="section-label">How It Works</p>
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
              Three simple steps to manage group expenses.
            </h2>
          </div>

          <div className="space-y-12">
            {[
              { step: "Track", title: "Capture every expense", desc: "Log payments instantly, categorize bills, and add notes so your group always knows who paid what." },
              { step: "Split", title: "Split it your way", desc: "Choose split methods for each expense and let Evven handle exact shares for each person." },
              { step: "Settle", title: "Close the loop", desc: "Review group balances, send settlement reminders, and record reimbursements with a few clicks." }
            ].map((item, idx) => (
              <div key={idx} className="grid gap-8 sm:grid-cols-[120px_1fr] items-start pb-12 border-b border-[var(--evven-border)]">
                <div>
                  <p className="text-sm uppercase tracking-wide text-[var(--evven-text-muted)]">{item.step}</p>
                  <div className="mt-3 w-10 h-10 rounded-lg bg-[var(--evven-accent-primary)] text-white flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-[var(--evven-text-primary)]">{item.title}</h3>
                  <p className="text-lg text-[var(--evven-text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-animate px-6 py-24 sm:py-32 bg-[var(--evven-background)]">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 mb-16">
            <p className="section-label">Use Cases</p>
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
              Works for any group or occasion.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="space-y-4">
                <h3 className="text-2xl font-semibold">{useCase.title}</h3>
                <p className="text-[var(--evven-text-muted)] leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-animate bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 mb-16">
            <p className="section-label">Testimonials</p>
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
              Trusted by groups everywhere.
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name} className="space-y-6 pb-12 border-b border-[var(--evven-border)]">
                <p className="text-lg sm:text-xl leading-relaxed text-[var(--evven-text-primary)]">"{testimonial.quote}"</p>
                <footer className="space-y-1">
                  <strong className="block text-base font-semibold text-[var(--evven-text-primary)]">{testimonial.name}</strong>
                  <p className="text-sm text-[var(--evven-text-muted)]">{testimonial.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section-animate px-6 py-24 sm:py-32 bg-[var(--evven-background)]">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 mb-16">
            <p className="section-label">Pricing</p>
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
              Plans for every budget.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { name: "Basic", price: "Free", desc: "Perfect for small groups.", features: ["Unlimited groups", "Automatic balances", "Expense history"] },
              { name: "Pro", price: "$9/mo", desc: "For frequent groups and budgets.", features: ["Detailed reports", "Advanced split rules", "Priority support"], featured: true },
              { name: "Team", price: "Custom", desc: "For clubs, co-ops, and large groups.", features: ["Group management", "Custom templates", "Admin tools"] }
            ].map((plan) => (
              <div key={plan.name} className={`space-y-6 p-8 rounded-2xl border ${plan.featured ? 'border-[var(--evven-accent-primary)] bg-white' : 'border-[var(--evven-border)] bg-white'}`}>
                <div>
                  <p className="text-sm uppercase tracking-wide text-[var(--evven-text-muted)]">{plan.name}</p>
                  <p className="mt-4 text-4xl font-semibold">{plan.price}</p>
                  <p className="mt-3 text-[var(--evven-text-muted)]">{plan.desc}</p>
                </div>
                <div className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <p key={feature} className="text-[var(--evven-text-muted)]">✓ {feature}</p>
                  ))}
                </div>
                <Link href="/signup">
                  <Button className="w-full rounded-full py-3 bg-[var(--evven-accent-primary)] hover:bg-[var(--evven-accent-primary)]/90 text-white">
                    {plan.name === "Team" ? "Contact us" : "Get started"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section-animate bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 mb-16">
            <p className="section-label">FAQ</p>
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
              Got questions? We have answers.
            </h2>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={faq.question} className="space-y-4 pb-8 border-b border-[var(--evven-border)]">
                <h3 className="text-lg font-semibold text-[var(--evven-text-primary)]">{faq.question}</h3>
                <p className="text-[var(--evven-text-muted)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-animate px-6 py-24 sm:py-32 bg-[var(--evven-background)]">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--evven-accent-primary)] px-8 sm:px-12 py-16 sm:py-20 text-white">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl sm:text-6xl font-heading tracking-tight leading-tight">
                Ready to simplify group expenses?
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl">
                Join groups who trust Evven to keep every shared expense transparent, fair, and easy to resolve.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/signup">
                <Button className="rounded-full bg-white text-[var(--evven-accent-primary)] hover:bg-white/90 px-8 py-3 text-base font-semibold">Get started free</Button>
              </Link>
              <a href="https://github.com/jagdep-singh/Evven" target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white">
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--evven-border)] bg-white px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img src="/EvenUp-black.svg" alt="Evven" className="w-6 h-6" />
                <p className="font-semibold text-[var(--evven-text-primary)]">Evven</p>
              </div>
              <p className="text-sm text-[var(--evven-text-muted)]">Split expenses cleanly with groups, trips, and roommates.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link href="/signup" className="text-[var(--evven-text-muted)] hover:text-[var(--evven-text-primary)]">Sign up</Link>
              <a href="https://github.com/jagdep-singh/Evven" target="_blank" rel="noreferrer" className="text-[var(--evven-text-muted)] hover:text-[var(--evven-text-primary)]">GitHub</a>
              <a href="#faq" className="text-[var(--evven-text-muted)] hover:text-[var(--evven-text-primary)]">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
