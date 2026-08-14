"use client";

import { Search } from "lucide-react";
import { formatAmount } from "@/lib/format";

export function ExpenseToolbar({
  query,
  onQueryChange,
  total,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  total: number;
}) {
  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_auto]">
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search expenses"
          className="w-full rounded-(--evven-radius-card) py-2.5 pl-10 pr-4 text-sm outline-none"
          style={{
            background: "var(--color-background-primary, var(--evven-background))",
            border: "0.5px solid var(--evven-border)",
          }}
        />
      </div>
      <div
        className="rounded-(--evven-radius-card) px-4 py-2.5 text-sm"
        style={{
          background: "var(--color-background-primary, var(--evven-background))",
          border: "0.5px solid var(--evven-border)",
        }}
      >
        <span className="text-muted-foreground">Total </span>
        <span className="font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
          {formatAmount(total)}
        </span>
      </div>
    </div>
  );
}
