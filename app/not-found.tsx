"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
