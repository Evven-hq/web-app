"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TeamsCTA() {
  return (
    <section className="section-animate px-6 py-24 sm:py-32 mb-20 sm:mb-28 bg-background">
      <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--evven-accent-primary)] px-8 sm:px-12 py-16 sm:py-20 text-white">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-6xl font-heading tracking-tight leading-tight">
              Ready to bring your team onboard?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl">
              Set up a shared workspace in minutes and keep every team expense
              transparent, fair, and easy to settle.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/signup">
              <Button className="rounded-full bg-white text-[var(--evven-accent-primary)] hover:bg-white/90 px-8 py-3 text-base font-semibold">
                Get started free
              </Button>
            </Link>
            <Link
              href="/enterprise"
              className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white"
            >
              Looking for Enterprise? →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}