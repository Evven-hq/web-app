"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type {
  PaymentMethod,
  PersonalExpenseCreate,
  SettlementDirection,
  SplitMode,
  SplitParticipant,
} from "@/types";
import { FriendExpenseFields, FriendSplitSection } from "@/components/expenses/friends";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import { PAYMENT_MODES } from "@/lib/payment-modes";

export interface ExpenseFormValues {
  title: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
  payment_method: PaymentMethod;
  friend_id: string;
  settlement_direction: SettlementDirection;
  settlement_amount: string;
  split_mode: SplitMode;
  split_participants: SplitParticipant[];
}

interface ExpenseFormProps {
  initialValues?: ExpenseFormValues;
  submitLabel: string;
  onSubmit: (expense: PersonalExpenseCreate | PersonalExpenseCreate[]) => Promise<void>;
  allowSplit?: boolean;
  initialSplitEnabled?: boolean;
}

const DEFAULT_VALUES: ExpenseFormValues = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
  payment_method: "upi",
  friend_id: "",
  settlement_direction: "they_owe",
  settlement_amount: "",
  split_mode: "equal",
  split_participants: [],
};

function formatMoney(value: number) {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function splitEvenly(total: number, count: number) {
  if (count <= 0) return [];

  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  return Array.from({ length: count }, (_, index) => (baseCents + (index < remainder ? 1 : 0)) / 100);
}

function splitByPercentage(total: number, percentages: number[]) {
  if (percentages.length === 0) return [];

  const totalCents = Math.round(total * 100);
  let allocated = 0;

  return percentages.map((percentage, index) => {
    if (index === percentages.length - 1) {
      return (totalCents - allocated) / 100;
    }

    const cents = Math.round(total * percentage);
    allocated += cents;
    return cents / 100;
  });
}

function remainderAmount(total: number, allocated: number) {
  const totalCents = Math.round(total * 100);
  const allocatedCents = Math.round(allocated * 100);
  return Math.max(0, (totalCents - allocatedCents) / 100);
}

function buildSingleExpense(values: ExpenseFormValues): PersonalExpenseCreate {
  const amount = Number(values.settlement_amount || values.amount);

  const payload: PersonalExpenseCreate = {
    title: values.title.trim(),
    amount,
    category: values.category.trim() || undefined,
    date: values.date ? new Date(`${values.date}T00:00:00`).toISOString() : undefined,
    notes: values.notes.trim() || undefined,
    payment_method: values.payment_method,
  };

  if (values.friend_id) {
    payload.friend_id = values.friend_id;
    payload.settlement_direction = values.settlement_direction;
    payload.settlement_amount = amount;
  }

  return payload;
}

function buildSplitExpenses(values: ExpenseFormValues): {
  payloads: PersonalExpenseCreate[];
  error?: string;
} {
  const amount = Number(values.amount);
  const participants = values.split_participants;

  if (participants.length < 1) {
    return { payloads: [], error: "Add at least one friend to split this expense." };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { payloads: [], error: "Enter an amount greater than zero." };
  }

  const common = {
    title: values.title.trim(),
    category: values.category.trim() || undefined,
    date: values.date ? new Date(`${values.date}T00:00:00`).toISOString() : undefined,
    notes: values.notes.trim() || undefined,
    payment_method: values.payment_method,
  };

  if (values.split_mode === "equal") {
    const shares = splitEvenly(amount, participants.length + 1);
    const userShare = shares[0] ?? 0;
    return {
      payloads: [
        ...(userShare > 0
          ? [
              {
                ...common,
                amount: userShare,
              },
            ]
          : []),
        ...participants.map((participant, index) => ({
          ...common,
          amount: shares[index + 1] ?? 0,
          friend_id: participant.friend_id,
          settlement_direction: values.settlement_direction,
          settlement_amount: shares[index + 1] ?? 0,
        })),
      ],
    };
  }

  if (values.split_mode === "percentage") {
    const totalPercentage = participants.reduce(
      (sum, participant) => sum + Number(participant.split_percentage ?? 0),
      0
    );
    if (totalPercentage > 100) {
      return {
        payloads: [],
        error: "Friend percentages must stay at or below 100%.",
      };
    }

    const friendPercentages = participants.map((participant) => Number(participant.split_percentage ?? 0));
    const friendShares = splitByPercentage(amount, friendPercentages);
    const userShare = remainderAmount(amount, friendShares.reduce((sum, value) => sum + value, 0));

    return {
      payloads: [
        ...(userShare > 0
          ? [
              {
                ...common,
                amount: userShare,
              },
            ]
          : []),
        ...participants.map((participant, index) => ({
          ...common,
          amount: friendShares[index] ?? 0,
          friend_id: participant.friend_id,
          settlement_direction: values.settlement_direction,
          settlement_amount: friendShares[index] ?? 0,
        })),
      ],
    };
  }

  const totalCustom = participants.reduce(
    (sum, participant) => sum + Number(participant.split_amount ?? 0),
    0
  );

  if (totalCustom > amount) {
    return {
      payloads: [],
      error: `Friend amounts must stay below ₹${formatMoney(amount)}.`,
    };
  }

  const userShare = remainderAmount(amount, totalCustom);

  return {
    payloads: [
      ...(userShare > 0
        ? [
            {
              ...common,
              amount: userShare,
            },
          ]
        : []),
      ...participants.map((participant) => ({
        ...common,
        amount: Number(participant.split_amount ?? 0),
        friend_id: participant.friend_id,
        settlement_direction: values.settlement_direction,
        settlement_amount: Number(participant.split_amount ?? 0),
      })),
    ],
  };
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
    initialSplitEnabled ?? initialValues.split_participants.length > 0
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
        (!current.settlement_amount || current.settlement_amount === current.amount)
      ) {
        next.settlement_amount = value;
      }

      return next;
    });
  };

  const handleSplitChange = (updates: Partial<Pick<ExpenseFormValues, "split_mode" | "split_participants">>) => {
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
                    values.category === cat.value ? cat.bg : "var(--evven-border)"
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
          Payment mode
        </label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_MODES.map((mode) => {
            const Icon = mode.icon;
            const active = values.payment_method?.toLowerCase() === mode.value;

            return (
              <button
                key={mode.value}
                type="button"
                onClick={() =>
                  setValues((current) => ({ ...current, payment_method: mode.value }))
                }
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: active ? mode.bg : "var(--evven-surface)",
                  color: active ? mode.text : "var(--evven-text-muted)",
                  border: `1px solid ${active ? mode.bg : "var(--evven-border)"}`,
                }}
              >
                <Icon size={14} />
                {mode.label}
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
