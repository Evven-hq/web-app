"use client";

import { ArrowLeftRight, Receipt, Scale, Users } from "lucide-react";

export type Tab = "expenses" | "balances" | "settlements" | "members";

export function GroupTabs({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "var(--evven-surface)" }}>
      {(["expenses", "balances", "settlements", "members"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium capitalize transition-all"
          style={{
            background: tab === t ? "white" : "transparent",
            color: tab === t ? "var(--evven-text-primary)" : "var(--evven-text-muted)",
            boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {t === "expenses" && <Receipt size={12} />}
          {t === "balances" && <Scale size={12} />}
          {t === "settlements" && <ArrowLeftRight size={12} />}
          {t === "members" && <Users size={12} />}
          {t}
        </button>
      ))}
    </div>
  );
}
