"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { PersonalExpenseCreate } from "@/types";
import {
  FriendExpenseFields,
  FriendSplitSection,
} from "@/components/expenses/friends";
import { CategoryPicker } from "@/components/expenses/form/CategoryPicker";
import { NotesField } from "@/components/expenses/form/NotesField";
import { PaymentModePicker } from "@/components/expenses/form/PaymentModePicker";
import { TextField } from "@/components/expenses/form/TextField";
import {
  buildSingleExpense,
  buildSplitExpenses,
  DEFAULT_VALUES,
  type ExpenseFormValues,
} from "@/components/expenses/form/form-utils";

export type { ExpenseFormValues } from "@/components/expenses/form/form-utils";

interface ExpenseFormProps {
  initialValues?: ExpenseFormValues;
  submitLabel: string;
  onSubmit: (
    expense: PersonalExpenseCreate | PersonalExpenseCreate[],
  ) => Promise<void>;
  allowSplit?: boolean;
  initialSplitEnabled?: boolean;
}

export function ExpenseForm({
  initialValues = DEFAULT_VALUES,
  submitLabel,
  onSubmit,
  allowSplit = true,
  initialSplitEnabled,
}: ExpenseFormProps) {
  const [values, setValues] = useState(initialValues);
  const [useSplit, setUseSplit] = useState(
    initialSplitEnabled ?? initialValues.split_participants.length > 0,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateValue = (field: keyof ExpenseFormValues, value: string) => {
    setValues((current) => {
      const next = { ...current, [field]: value };

      if (
        field === "amount" &&
        !useSplit &&
        current.friend_id &&
        (!current.settlement_amount ||
          current.settlement_amount === current.amount)
      ) {
        next.settlement_amount = value;
      }

      return next;
    });
  };

  const handleSplitChange = (
    updates: Partial<
      Pick<ExpenseFormValues, "split_mode" | "split_participants">
    >,
  ) => {
    setValues((current) => ({ ...current, ...updates }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number(values.amount);

    if (!values.title.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a title and an amount greater than zero.");
      return;
    }

    if (useSplit) {
      const splitResult = buildSplitExpenses(values);
      if (splitResult.error) {
        setError(splitResult.error);
        return;
      }

      if (!splitResult.payloads.length) {
        setError("Add at least one friend to split this expense.");
        return;
      }

      setSaving(true);
      setError("");

      try {
        await onSubmit(splitResult.payloads);
      } catch {
        setError("Could not save this expense. Please try again.");
      } finally {
        setSaving(false);
      }

      return;
    }

    const settlementAmount = Number(values.settlement_amount || values.amount);

    if (
      values.friend_id &&
      (!Number.isFinite(settlementAmount) || settlementAmount <= 0)
    ) {
      setError("Enter a settlement amount greater than zero.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSubmit(buildSingleExpense(values));
    } catch {
      setError("Could not save this expense. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TextField
        label="Title"
        value={values.title}
        onChange={(value) => updateValue("title", value)}
        placeholder="Lunch, rent, train ticket..."
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Amount"
          value={values.amount}
          onChange={(value) => updateValue("amount", value)}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
        />
        <TextField
          label="Date"
          value={values.date}
          onChange={(value) => updateValue("date", value)}
          type="date"
        />
      </div>

      <CategoryPicker
        value={values.category}
        onChange={(value) => updateValue("category", value)}
      />

      <PaymentModePicker
        value={values.payment_method}
        onChange={(value) =>
          setValues((current) => ({ ...current, payment_method: value }))
        }
      />

      <NotesField
        value={values.notes}
        onChange={(value) => updateValue("notes", value)}
      />

      {allowSplit ? (
        <FriendSplitSection
          amount={values.amount}
          values={{
            split_mode: values.split_mode,
            split_participants: values.split_participants,
          }}
          enabled={useSplit}
          onToggle={(enabled) => setUseSplit(enabled)}
          onChange={handleSplitChange}
          initialFriendId={values.friend_id || undefined}
        />
      ) : null}

      {!useSplit || !allowSplit ? (
        <FriendExpenseFields
          amount={values.amount}
          values={{
            friend_id: values.friend_id,
            settlement_direction: values.settlement_direction,
            settlement_amount: values.settlement_amount,
          }}
          onChange={(updates) =>
            setValues((current) => ({
              ...current,
              ...updates,
            }))
          }
        />
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

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
