"use client";

import { Edit3, Receipt, Trash2 } from "lucide-react";
import type { GroupExpense } from "@/types";
import { getCategoryMeta } from "@/lib/expense-categories";
import { formatAmount, formatDate } from "./group-detail-utils";
import type { UserNameFn } from "./group-detail-shared";

export function ExpensesTab({
  expenses,
  currentUserId,
  isCreator,
  userName,
  onViewExpense,
  onEditExpense,
  onDeleteExpense,
}: {
  expenses: GroupExpense[];
  currentUserId?: string;
  isCreator: boolean;
  userName: UserNameFn;
  onViewExpense: (expense: GroupExpense) => void;
  onEditExpense: (expense: GroupExpense) => void;
  onDeleteExpense: (expenseId: string) => void;
}) {
  if (expenses.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center border"
        style={{ background: "white", borderColor: "var(--evven-border)" }}
      >
        <Receipt size={20} className="mx-auto mb-3" style={{ color: "var(--evven-text-muted)" }} />
        <p className="text-sm font-medium mb-1" style={{ color: "var(--evven-text-primary)" }}>
          No expenses yet
        </p>
        <p className="text-xs mb-4" style={{ color: "var(--evven-text-muted)" }}>
          Log the first expense for this group.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-1 pb-8 space-y-2">
      {expenses.map((exp) => (
        <div
          key={exp.id}
          onClick={() => void onViewExpense(exp)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              void onViewExpense(exp);
            }
          }}
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all hover:opacity-80"
          style={{ background: "white", borderColor: "var(--evven-border)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: exp.category
                ? getCategoryMeta(exp.category).bg
                : "var(--evven-accent-secondary)",
            }}
          >
            {exp.category ? (
              (() => {
                const Icon = getCategoryMeta(exp.category).icon;
                return <Icon size={18} />;
              })()
            ) : (
              <Receipt size={15} style={{ color: "var(--evven-accent-primary)" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
              {exp.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
              Paid by {userName(exp.paid_by)} · {formatDate(exp.created_at)} · {exp.split_type}
              {exp.category ? ` · ${getCategoryMeta(exp.category).label}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
              {formatAmount(exp.amount)}
            </span>
            {exp.paid_by === currentUserId && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void onEditExpense(exp);
                }}
                className="p-1.5 rounded-lg transition-colors hover:bg-(--evven-surface)"
              >
                <Edit3 size={13} style={{ color: "var(--evven-text-muted)" }} />
              </button>
            )}
            {(isCreator || exp.paid_by === currentUserId) && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void onDeleteExpense(exp.id);
                }}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
              >
                <Trash2 size={13} style={{ color: "#A32D2D" }} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
