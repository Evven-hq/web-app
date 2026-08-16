"use client";

import { useState } from "react";
import { Check, UtensilsCrossed } from "lucide-react";
import {
  ExpenseSuccessScreen,
  type ExpenseSuccessState,
} from "@/components/expenses/ExpenseSuccessScreen";
import { isSoundEnabled, setSoundEnabled } from "@/lib/expense-success-sound";

const PERSONAL: ExpenseSuccessState = {
  variant: "personal",
  amount: 1240,
  categoryIcon: <UtensilsCrossed size={38} />,
  categoryBg: "var(--evven-category-food-bg)",
  categoryText: "var(--evven-category-food-text)",
  merchant: "Lunch at Sagar Ratna",
  metaLabel: "Food · UPI",
};

const FRIEND: ExpenseSuccessState = {
  variant: "friend",
  amount: 860,
  categoryIcon: <UtensilsCrossed size={38} />,
  categoryBg: "var(--evven-category-food-bg)",
  categoryText: "var(--evven-category-food-text)",
  merchant: "Dinner at Social",
  metaLabel: {
    prefix: "Split with ",
    bold: "Riya",
    suffix: " · You paid",
  },
  avatars: [
    { initials: "RK", bg: "var(--evven-avatar-2-bg)", text: "var(--evven-avatar-2-text)" },
  ],
};

const GROUP: ExpenseSuccessState = {
  variant: "group",
  amount: 1240,
  categoryIcon: <UtensilsCrossed size={38} />,
  categoryBg: "var(--evven-category-food-bg)",
  categoryText: "var(--evven-category-food-text)",
  merchant: "Weekend BBQ",
  metaLabel: {
    prefix: "Split with ",
    bold: "4 people",
    suffix: " · You paid",
  },
  avatars: [
    { initials: "RK", bg: "var(--evven-avatar-1-bg)", text: "var(--evven-avatar-1-text)" },
    { initials: "SM", bg: "var(--evven-avatar-2-bg)", text: "var(--evven-avatar-2-text)" },
    { initials: "AP", bg: "var(--evven-avatar-3-bg)", text: "var(--evven-avatar-3-text)" },
    { initials: "TJ", bg: "var(--evven-avatar-4-bg)", text: "var(--evven-avatar-4-text)" },
    { initials: "NR", bg: "var(--evven-avatar-5-bg)", text: "var(--evven-avatar-5-text)" },
    { initials: "VP", bg: "var(--evven-avatar-6-bg)", text: "var(--evven-avatar-6-text)" },
  ],
};

const SETTLEMENT: ExpenseSuccessState = {
  variant: "settlement",
  amount: 560,
  categoryIcon: <Check size={38} />,
  categoryBg: "var(--evven-success-bg)",
  categoryText: "var(--evven-success-text)",
  merchant: "Settled with Arjun",
  metaLabel: {
    prefix: "You paid ",
    bold: "Arjun",
    suffix: " · UPI",
  },
  avatars: [
    { initials: "AR", bg: "var(--evven-avatar-2-bg)", text: "var(--evven-avatar-2-text)" },
  ],
};

export default function ExpenseSuccessPreviewPage() {
  const [success, setSuccess] = useState<ExpenseSuccessState | null>(null);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const fire = (state: ExpenseSuccessState) => setSuccess({ ...state });

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Dev preview — remove before merge
        </p>
        <h1 className="mb-6 text-2xl font-medium">Expense success screen</h1>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fire(PERSONAL)}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)" }}
          >
            Personal
          </button>
          <button
            type="button"
            onClick={() => fire(FRIEND)}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)" }}
          >
            Friend split
          </button>
          <button
            type="button"
            onClick={() => fire(GROUP)}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)" }}
          >
            Group split (6 avatars)
          </button>
          <button
            type="button"
            onClick={() => fire(SETTLEMENT)}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)" }}
          >
            Settlement
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              setSoundEnabled(next);
            }}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)" }}
          >
            Sound: {soundOn ? "on" : "off"}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Diff the animation timing against the v2 prototype.
        </p>
      </div>

      {success ? (
        <ExpenseSuccessScreen open {...success} onDone={() => setSuccess(null)} />
      ) : null}
    </div>
  );
}
