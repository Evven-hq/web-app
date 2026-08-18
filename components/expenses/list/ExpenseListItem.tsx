"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Edit3, Loader2, Trash2 } from "lucide-react";
import { FriendSummaryLine } from "@/components/expenses/friends";
import { formatAmount, formatDate } from "@/lib/format";
import { getCategoryMeta } from "@/lib/expense-categories";
import type { PersonalExpense } from "@/types";

const ROW_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ExpenseListItem({
  expense,
  deletePending,
  index = 0,
  onSelect,
  onDelete,
}: {
  expense: PersonalExpense;
  deletePending: boolean;
  index?: number;
  onSelect: (expense: PersonalExpense) => void;
  onDelete: (expense: PersonalExpense) => void;
}) {
  const reduce = useReducedMotion();
  const categoryMeta = getCategoryMeta(expense.category);
  const CategoryIcon = categoryMeta.icon;
  const enterDelay = index * 0.04;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={
        reduce
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              transition: { duration: 0.32, delay: enterDelay, ease: ROW_EASE },
            }
      }
      exit={
        reduce
          ? { opacity: 0 }
          : {
              opacity: 0,
              scale: 0.97,
              filter: "blur(4px)",
              transition: { duration: 0.2, ease: ROW_EASE },
            }
      }
      whileHover={
        reduce
          ? undefined
          : { y: -2, transition: { duration: 0.18, ease: ROW_EASE } }
      }
      whileTap={
        reduce
          ? undefined
          : { scale: 0.99, transition: { duration: 0.12, ease: ROW_EASE } }
      }
      onClick={() => onSelect(expense)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(expense);
        }
      }}
      className="card flex items-center gap-3 rounded-(--evven-radius-card) px-4 py-3.5 text-left transition-colors hover:bg-(--evven-surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] cursor-pointer"
    >
      <motion.div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: categoryMeta.bg }}
        whileHover={
          reduce
            ? undefined
            : { scale: 1.05, transition: { duration: 0.18, ease: ROW_EASE } }
        }
      >
        <CategoryIcon size={16} />
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium sm:truncate">{expense.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {categoryMeta.label} ·{" "}
          {formatDate(expense.date ?? expense.created_at)}
        </p>
        <FriendSummaryLine expense={expense} />
      </div>
      <span
        className="shrink-0 text-sm font-semibold"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {formatAmount(expense.amount)}
      </span>
      <ChevronRight
        size={16}
        className="shrink-0 text-muted-foreground sm:hidden"
      />
      <div className="hidden items-center gap-1 sm:flex">
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
          style={{
            color: deletePending ? "var(--evven-text-muted)" : undefined,
          }}
        >
          {deletePending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </motion.div>
  );
}
