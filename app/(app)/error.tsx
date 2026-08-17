"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { reportError } from "@/lib/error-log";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    reportError(error, { route: pathname });
  }, [error, pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ background: "var(--evven-card-background)" }}
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
          Something went wrong
        </p>
        <p className="mb-6 text-sm" style={{ color: "var(--evven-text-muted)" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-2xl px-6 py-3 text-sm font-semibold text-[var(--evven-text-inverse)] transition-opacity hover:opacity-90"
          style={{ background: "var(--evven-accent-primary)" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
