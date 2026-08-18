"use client";

import Link from "next/link";
import { HandCoins, ReceiptText } from "lucide-react";
import { surfaceCard } from "./profile-utils";

export function ProfileQuickLinks() {
  return (
    <div className="card rounded-3xl p-5" style={surfaceCard()}>
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Quick links
      </p>
      <div className="mt-3 space-y-2">
        <Link
          href="/friends"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:opacity-80"
          style={{ background: "var(--evven-surface)" }}
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "var(--evven-accent-secondary)",
              color: "var(--evven-accent-primary)",
            }}
          >
            <HandCoins size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">Friends</span>
            <span
              className="block text-xs"
              style={{ color: "var(--evven-text-muted)" }}
            >
              See who paid what
            </span>
          </span>
        </Link>
        <Link
          href="/expenses"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:opacity-80"
          style={{ background: "var(--evven-surface)" }}
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "var(--evven-accent-secondary)",
              color: "var(--evven-accent-primary)",
            }}
          >
            <ReceiptText size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">Expenses</span>
            <span
              className="block text-xs"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Review your spending
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
