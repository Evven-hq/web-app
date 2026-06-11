"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 px-8 py-4 shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <img src="/EvenUp-black.svg" alt="Evven" className="w-8 h-8" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--evven-text-primary)] transition hover:text-[var(--evven-accent-primary)] font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/signup">
            <Button className="rounded-full px-6 py-2.5 text-sm bg-[var(--evven-accent-primary)] hover:bg-[var(--evven-accent-primary)]/90 text-white font-semibold">
              Start free
            </Button>
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-6 right-6 mt-4 rounded-2xl bg-white/30 backdrop-blur-2xl border border-white/30 p-6 space-y-4 shadow-lg">
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
      </div>
    </header>
  );
}
