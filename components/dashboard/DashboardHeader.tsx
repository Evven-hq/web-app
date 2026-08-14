"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function DashboardHeader({
  greeting,
  firstName,
}: {
  greeting: string;
  firstName: string;
}) {
  return (
    <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 sm:pr-0">
        {/* <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--evven-text-muted)" }}
        >
          Overview
        </p> */}
        <h1 className="mt-2 flex min-w-0 flex-wrap items-end gap-x-2 gap-y-1 text-2xl font-medium leading-snug sm:text-[2rem]">
          <span className="shrink-0">{greeting},</span>
          <span
            className="inline-block max-w-full pr-2"
            style={{
              color: "var(--evven-primary)",
              fontFamily: "var(--font-instrument-serif)",
              fontStyle: "italic",
              fontSize: "inherit",
              fontWeight: 500,
              letterSpacing: "0.05em",
              lineHeight: 1.05,
              marginBottom: "0",
            }}
          >
            {firstName}
          </span>
        </h1>
        <p
          className="mt-2 max-w-xl text-sm leading-6 sm:text-[15px]"
          style={{ color: "var(--evven-text-muted)" }}
        >
          Your shared spending, groups, and recent activity all in one place.
        </p>
      </div>

      <Link
        href="/expenses?new=1"
        className="hidden shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 sm:inline-flex"
      >
        <Plus size={15} />
        Add expense
      </Link>

    </div>
  );
}
