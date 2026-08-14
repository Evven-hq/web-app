"use client";

import { Plus } from "lucide-react";

export function ExpensePageHeader({
  count,
  isLoading,
  onAdd,
}: {
  count: number;
  isLoading: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="mb-7 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Expenses · {isLoading ? "isLoading" : `${count} logged`}
        </p>
        <h1 className="text-2xl font-medium">Expenses</h1>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
      >
        <Plus size={15} />
        Add expense
      </button>
    </div>
  );
}
