"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ExpenseForm, type ExpenseFormValues } from "@/components/expenses/ExpenseForm";
import type { PersonalExpenseCreate } from "@/types";

export function AddExpenseModal({
  initialValues,
  initialSplitEnabled,
  onSubmit,
  onClose,
}: {
  initialValues: ExpenseFormValues;
  initialSplitEnabled: boolean;
  onSubmit: (expense: PersonalExpenseCreate | PersonalExpenseCreate[]) => Promise<void>;
  onClose: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="modal-panel card relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl p-5 shadow-xl sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5"
          style={{ background: "var(--evven-surface)" }}
          aria-label="Close add expense form"
        >
          <X size={15} />
        </button>

        <div className="mb-5 pr-9">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Personal ledger
          </p>
          <h2 className="text-xl font-medium">Add expense</h2>
        </div>

        <ExpenseForm
          initialValues={initialValues}
          submitLabel="Add expense"
          initialSplitEnabled={initialSplitEnabled}
          onSubmit={onSubmit}
        />
      </div>
    </div>,
    document.body
  );
}
