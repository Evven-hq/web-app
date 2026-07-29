"use client";

import { ArrowLeftRight, Receipt, Scale, Users } from "lucide-react";

export type Tab = "expenses" | "balances" | "settlements" | "members";

const TAB_META: Record<Tab, { label: string; icon: typeof Receipt }> = {
  expenses: { label: "Expenses", icon: Receipt },
  balances: { label: "Balances", icon: Scale },
  settlements: { label: "Settlements", icon: ArrowLeftRight },
  members: { label: "Members", icon: Users },
};

const TAB_ORDER: Tab[] = ["expenses", "balances", "settlements", "members"];

export function GroupTabs({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <div
      className="flex gap-1 p-1 rounded-2xl mb-5"
      style={{ background: "var(--evven-surface)" }}
      role="tablist"
    >
      {TAB_ORDER.map((t) => {
        const active = tab === t;
        const { label, icon: Icon } = TAB_META[t];

        return (
          <button
            key={t}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t)}
            className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out"
            style={{
              flex: active ? "1.7 1 0%" : "1 1 0%",
              padding: "10px 6px",
              background: active ? "var(--evven-accent-primary)" : "transparent",
              color: active ? "var(--evven-text-inverse)" : "var(--evven-text-muted)",
              boxShadow: active ? "0 3px 10px -3px rgba(45,90,79,0.5)" : "none",
            }}
          >
            <Icon size={14} className="shrink-0" />
            <span
              className="overflow-hidden whitespace-nowrap transition-all duration-200 ease-out"
              style={{
                maxWidth: active ? 110 : 0,
                opacity: active ? 1 : 0,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}