"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ExpenseForm, type ExpenseFormValues } from "@/components/expenses/ExpenseForm";
import { getPersonalExpense, updatePersonalExpense } from "@/services/expenses";

export default function EditExpensePage() {
  const { expenseID } = useParams<{ expenseID: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<ExpenseFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPersonalExpense(expenseID)
      .then((expense) => {
        setInitialValues({
          title: expense.title,
          amount: expense.amount,
          category: expense.category ?? "",
          date: expense.date ? expense.date.slice(0, 10) : "",
          notes: expense.notes ?? "",
          payment_mode: expense.payment_mode ?? "upi",
          ghost_id: expense.ghost_id ?? expense.ghost?.id ?? "",
          settlement_direction: expense.settlement_direction ?? "they_owe",
          settlement_amount: expense.settlement_amount ?? "",
        });
      })
      .catch(() => setError("Could not load this expense."));
  }, [expenseID]);

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/expenses"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <ArrowLeft size={14} />
          Expenses
        </Link>
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Personal ledger
          </p>
          <h1 className="text-2xl font-medium">Edit expense</h1>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-destructive">{error}</div>
        ) : !initialValues ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="card rounded-2xl p-5 sm:p-6">
            <ExpenseForm
              initialValues={initialValues}
              submitLabel="Save changes"
              onSubmit={async (expense) => {
                await updatePersonalExpense(expenseID, expense);
                router.push("/expenses");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}