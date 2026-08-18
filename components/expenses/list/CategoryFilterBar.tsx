"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";

const PILL_BG = "var(--color-background-primary, var(--evven-background))";
const PILL_BORDER = "0.5px solid var(--evven-border)";

export function CategoryFilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const reduce = useReducedMotion();

  const renderPill = (active: boolean) =>
    active ? (
      <motion.span
        layoutId="expense-category-pill"
        className="absolute inset-0 rounded-full"
        style={{ background: PILL_BG, border: PILL_BORDER }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 35 }
        }
      />
    ) : null;

  return (
    <div
      className="mb-5 inline-flex max-w-full flex-wrap gap-1 rounded-xl p-1"
      style={{ background: "var(--evven-surface)" }}
    >
      <button
        onClick={() => onChange("all")}
        className="relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
        style={{
          color:
            value === "all"
              ? "var(--evven-text-primary)"
              : "var(--evven-text-muted)",
        }}
      >
        {renderPill(value === "all")}
        <span className="relative">All</span>
      </button>
      {EXPENSE_CATEGORIES.map((cat) => {
        const Icon = cat.icon;

        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              color: value === cat.value ? cat.text : "var(--evven-text-muted)",
            }}
          >
            {renderPill(value === cat.value)}
            <span className="relative flex items-center gap-1.5">
              <Icon size={14} />
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
