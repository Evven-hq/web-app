import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--evenup-background)] px-6">
      {/* Glow */}
      <div className="absolute h-[520px] w-[520px] rounded-full bg-sky-50/6 blur-3xl" />

      {/* Content */}
      <section className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        
        {/* Logo */}
        <Image
          src="/EvenUp-black.svg"
          alt="EvenUp"
          width={80}
          height={80}
          className="mb-8 w-16 select-none opacity-95 sm:w-20 dark:hidden"
          draggable={false}
        />
        <Image
          src="/EvenUp-black.svg"
          alt="EvenUp"
          width={80}
          height={80}
          className="mb-8 w-16 select-none opacity-95 sm:w-20 hidden dark:block"
          draggable={false}
        />

        <h1 className="font-heading text-6xl font-medium tracking-[-0.03em] text-[var(--evenup-text-primary)] sm:text-8xl mb-2">
          EvenUp
        </h1>

        <p className="mt-6 text-lg  text-[var(--evenup-text-muted)] sm:text-sm">
          Split expenses without the awkward math.
        </p>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--evenup-text-muted)] sm:text-lg">
          Track personal and group expenses, balances, and settlements in one
          clean shared space.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button
              className="rounded-full px-6 py-3 "
            >
              Get Started
            </Button>
          </Link>

          <a href="https://github.com/jagdep-singh/EvenUp" target="_blank" rel="noopener noreferrer">
            <Button
              className="rounded-full px-6 py-3 "
            >
              GitHub
            </Button>
          </a>
        </div>
      </section>

      <footer className="absolute bottom-6 text-[10px] uppercase tracking-[0.24em] text-[var(--evenup-text-muted)] sm:text-xs">
        EvenUp • v0.0.1
      </footer>
    </main>
  );
}