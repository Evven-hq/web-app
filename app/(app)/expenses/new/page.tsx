"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ExpenseForm, type ExpenseFormValues } from "@/components/expenses/ExpenseForm";
import { createPersonalExpense } from "@/services/expenses";

export default function NewExpensePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ghostId = searchParams.get("ghost_id") ?? "";
  const direction = searchParams.get("direction");

  const initialValues: ExpenseFormValues = {
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    payment_method: "upi",
    ghost_id: ghostId,
    settlement_direction:
      direction === "you_owe" || direction === "they_owe" ? direction : "they_owe",
    settlement_amount: "",
  };

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
          <h1 className="text-2xl font-medium">Add expense</h1>
        </div>
        <div className="card rounded-2xl p-5 sm:p-6">
          <ExpenseForm
            initialValues={initialValues}
            submitLabel="Add expense"
            onSubmit={async (expense) => {
              await createPersonalExpense(expense);
              router.push("/expenses");
            }}
          />
        </div>
      </div>
    </div>
  );
}