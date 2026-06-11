"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
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
              <Button className="rounded-full px-10 py-3.5 text-base bg-[var(--evven-accent-primary)] hover:bg-[var(--evven-accent-primary)]/90 text-white">
                Get started free
              </Button>
            </Link>
            <a href="https://github.com/jagdep-singh/Evven" target="_blank" rel="noreferrer">
              <Button variant="outline" className="rounded-full px-10 py-3.5 text-base border-[var(--evven-border)] hover:bg-[var(--evven-surface)]">
                View on GitHub
              </Button>
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
  );
}
