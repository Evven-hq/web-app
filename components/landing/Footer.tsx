"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--evven-border)] bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/EvenUp-black.svg" alt="Evven" className="w-6 h-6" />
              <p className="font-semibold text-[var(--evven-text-primary)]">Evven</p>
            </div>
            <p className="text-sm text-[var(--evven-text-muted)]">
              Split expenses cleanly with groups, trips, and roommates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link href="/signup" className="text-[var(--evven-text-muted)] hover:text-[var(--evven-text-primary)]">
              Sign up
            </Link>
            <a
              href="https://github.com/jagdep-singh/Evven"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--evven-text-muted)] hover:text-[var(--evven-text-primary)]"
            >
              GitHub
            </a>
            <a href="#faq" className="text-[var(--evven-text-muted)] hover:text-[var(--evven-text-primary)]">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
