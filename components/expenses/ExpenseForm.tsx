"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { PersonalExpenseCreate } from "@/types";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";

export interface ExpenseFormValues {
  title: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
}

interface ExpenseFormProps {
  initialValues?: ExpenseFormValues;
  submitLabel: string;
  onSubmit: (expense: PersonalExpenseCreate) => Promise<void>;
}

const DEFAULT_VALUES: ExpenseFormValues = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export function ExpenseForm({
  initialValues = DEFAULT_VALUES,
  submitLabel,
  onSubmit,
}: ExpenseFormProps) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateValue = (field: keyof ExpenseFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(values.amount);

    if (!values.title.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a title and an amount greater than zero.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSubmit({
        title: values.title.trim(),
        amount,
        category: values.category.trim() || undefined,
        date: values.date ? new Date(`${values.date}T00:00:00`).toISOString() : undefined,
        notes: values.notes.trim() || undefined,
      });
    } catch {
      setError("Could not save this expense. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Title
        </label>
        <input
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
          placeholder="Lunch, rent, train ticket..."
          className={fieldClass}
          style={{ background: "var(--evven-surface)", borderColor: "var(--evven-border)" }}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Amount
          </label>
          <input
            value={values.amount}
            onChange={(event) => updateValue("amount", event.target.value)}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className={fieldClass}
            style={{ background: "var(--evven-surface)", borderColor: "var(--evven-border)" }}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Date
          </label>
          <input
            value={values.date}
            onChange={(event) => updateValue("date", event.target.value)}
            type="date"
            className={fieldClass}
            style={{ background: "var(--evven-surface)", borderColor: "var(--evven-border)" }}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;

              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    updateValue("category", values.category === cat.value ? "" : cat.value)
                  }
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: values.category === cat.value ? cat.bg : "var(--evven-surface)",
                    color: values.category === cat.value ? cat.text : "var(--evven-text-muted)",
                    border: `1px solid ${
                      values.category === cat.value
                        ? cat.bg
                        : "var(--evven-border)"
                    }`,
                  }}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Notes
        </label>
        <textarea
          value={values.notes}
          onChange={(event) => updateValue("notes", event.target.value)}
          placeholder="Optional details"
          rows={4}
          className={fieldClass}
          style={{ background: "var(--evven-surface)", borderColor: "var(--evven-border)" }}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
