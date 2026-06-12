"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
        className="
          section-animate
          px-6
          py-24
          sm:py-32
          mb-20
          sm:mb-28
          bg-background
        "
      >
      <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--evven-accent-primary)] px-8 sm:px-12 py-16 sm:py-20 text-white">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight leading-tight">
              Ready to stop splitting bills the hard way?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl">
              Join Evven free — no credit card, no spreadsheets, no more awkward money talks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/signup">
              <Button className="rounded-full bg-white text-[var(--evven-accent-primary)] hover:bg-white/90 px-8 py-3 text-base font-semibold">
                Start for free
              </Button>
            </Link>
            <a
              href="https://github.com/jagdep-singh/Evven"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
