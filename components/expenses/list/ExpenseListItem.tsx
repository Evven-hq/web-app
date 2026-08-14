"use client";

import Link from "next/link";
import { Edit3, Loader2, Trash2 } from "lucide-react";
import { FriendSummaryLine } from "@/components/expenses/friends";
import { formatAmount, formatDate } from "@/lib/format";
import { getCategoryMeta } from "@/lib/expense-categories";
import type { PersonalExpense } from "@/types";

export function ExpenseListItem({
  expense,
  deletePending,
  onSelect,
  onDelete,
}: {
  expense: PersonalExpense;
  deletePending: boolean;
  onSelect: (expense: PersonalExpense) => void;
  onDelete: (expense: PersonalExpense) => void;
}) {
  const categoryMeta = getCategoryMeta(expense.category);
  const CategoryIcon = categoryMeta.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(expense)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(expense);
        }
      }}
      className="card flex items-center gap-3 rounded-(--evven-radius-card) px-4 py-3.5 text-left transition-colors hover:bg-(--evven-surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] cursor-pointer"
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: categoryMeta.bg,
        }}
      >
        <CategoryIcon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{expense.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {categoryMeta.label} · {formatDate(expense.date ?? expense.created_at)}
        </p>
        <FriendSummaryLine expense={expense} />
      </div>
      <span className="shrink-0 text-sm font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
        {formatAmount(expense.amount)}
      </span>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(expense);
        }}
        className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-(--evven-surface)"
        style={{
          borderColor: "var(--evven-border)",
          color: "var(--evven-text-primary)",
        }}
        aria-label={`View details for ${expense.title}`}
      >
        View
      </button>
      <Link
        href={`/expenses/${expense.id}/edit`}
        aria-label={`Edit ${expense.title}`}
        onClick={(event) => event.stopPropagation()}
        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Edit3 size={14} />
      </Link>
      <button
        onClick={(event) => {
          event.stopPropagation();
          onDelete(expense);
        }}
        disabled={deletePending}
        aria-label={`Delete ${expense.title}`}
        className="rounded-lg p-2 text-muted-foreground hover:bg-(--evven-surface) disabled:opacity-50"
        style={{ color: deletePending ? "var(--evven-text-muted)" : undefined }}
      >
        {deletePending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
}
