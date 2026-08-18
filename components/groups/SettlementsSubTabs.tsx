"use client";

import {
  ArrowLeftRight,
  CheckCircle,
  Receipt,
  Split,
  type LucideIcon,
} from "lucide-react";
import type { SettlementsSubTab } from "./settlements-utils";

export function SettlementsSubTabs({
  subTab,
  onChange,
}: {
  subTab: SettlementsSubTab;
  onChange: (tab: SettlementsSubTab) => void;
}) {
  const subTabs: Array<{
    key: SettlementsSubTab;
    label: string;
    icon: LucideIcon;
  }> = [
    { key: "past", label: "Settled", icon: CheckCircle },
    { key: "final", label: "To settle", icon: ArrowLeftRight },
    { key: "receivables", label: "To collect", icon: Split },
    { key: "breakdown", label: "Breakdown", icon: Receipt },
  ];

  return (
    // Compact 4-up segmented control: icon-over-label, tighter grid instead of
    // the previous 2x2 card grid, so it reads as one control, not a second
    // stacked tab bar.
    <div
      className="shrink-0 mb-4 grid grid-cols-4 gap-1 rounded-2xl p-1"
      style={{
        background: "var(--evven-surface)",
        border: "1px solid var(--evven-border)",
      }}
      role="tablist"
    >
      {subTabs.map(({ key, label, icon: Icon }) => {
        const active = subTab === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-[10.5px] font-medium leading-tight transition-all"
            style={{
              background: active
                ? "var(--evven-accent-secondary)"
                : "transparent",
              color: active
                ? "var(--evven-warning-text)"
                : "var(--evven-text-muted)",
            }}
          >
            <Icon size={14} />
            <span className="truncate w-full text-center">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
