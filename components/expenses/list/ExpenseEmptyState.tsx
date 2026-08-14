"use client";

import { Plus, Receipt } from "lucide-react";

export function ExpenseEmptyState({
  hasAnyExpenses,
  onAdd,
}: {
  hasAnyExpenses: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="card rounded-(--evven-radius-card) p-10 text-center">
      <Receipt size={24} className="mx-auto mb-3 text-muted-foreground" />
      <p className="mb-1 text-sm font-medium">
        {hasAnyExpenses ? "No matching expenses" : "No personal expenses yet"}
      </p>
      <p className="mb-5 text-sm text-muted-foreground">
        {hasAnyExpenses
          ? "Try a different search term."
          : "Log your first expense to start tracking your spending."}
      </p>
      {!hasAnyExpenses && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus size={15} />
          Add expense
        </button>
      )}
    </div>
  );
}
