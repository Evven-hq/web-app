"use client";

import Link from "next/link";
import { PencilLine, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { getCategoryMeta } from "@/lib/expense-categories";
import { getPaymentModeMeta } from "@/lib/payment-modes";
import { formatLongDate } from "@/lib/format";
import type { PersonalExpense } from "@/types";
import {
  formatMoney,
  getFriendExpenseSummary,
  getFriendHistoryDirection,
} from "./friends/friend-utils";

function getCounterpartyLabel(expense: PersonalExpense) {
  const name = expense.friend?.name ?? expense.ghost?.name;
  if (name) return name;
  if (expense.friend_id || expense.ghost_id) return "Unresolved friend";
  return "Not linked";
}

function getSourceLabel(expense: PersonalExpense) {
  if (expense.group_expense_id) {
    return "Synced from group expense";
  }

  if (expense.group_id) {
    return "Linked to a group";
  }

  if (expense.friend_id || expense.ghost_id) {
    return "Direct friend expense";
  }

  return "Standalone personal expense";
}

function getSettlementAmount(expense: PersonalExpense) {
  return expense.settlement_amount ?? expense.amount;
}

function getRecordType(expense: PersonalExpense) {
  if (expense.group_expense_id) {
    return "Synced group split";
  }

  if (expense.settlement_direction || expense.friend_id || expense.ghost_id) {
    return "Linked split record";
  }

  return "Standalone personal expense";
}

export function ExpenseDetailModal({
  expense,
  open,
  onClose,
  onDelete,
}: {
  expense: PersonalExpense;
  open: boolean;
  onClose: () => void;
  onDelete: (expense: PersonalExpense) => void;
}) {
  const categoryMeta = getCategoryMeta(expense.category);
  const paymentMeta = getPaymentModeMeta(expense.payment_method);
  const summary = getFriendExpenseSummary(expense);
  const counterpartyLabel = getCounterpartyLabel(expense);
  const sourceLabel = getSourceLabel(expense);
  const settlementAmount = getSettlementAmount(expense);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="modal-panel card relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5"
          style={{ background: "var(--evven-surface)" }}
          aria-label="Close expense details"
        >
          <X size={15} />
        </button>

        <div className="pr-8">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--evven-text-muted)" }}
          >
            Expense details
          </p>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--evven-text-primary)" }}
          >
            {expense.title}
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--evven-text-muted)" }}
          >
            {summary ?? "Personal expense"} ·{" "}
            {formatLongDate(expense.date ?? expense.created_at, "Recently")}
          </p>
        </div>

        <div
          className="mt-5 rounded-2xl border p-4"
          style={{
            background:
              "color-mix(in srgb, var(--evven-accent-secondary) 12%, var(--evven-background))",
            borderColor:
              "color-mix(in srgb, var(--evven-accent-primary) 20%, var(--evven-border))",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--evven-accent-primary)" }}
          >
            Amount
          </p>
          <p
            className="mt-2 text-3xl font-semibold"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--evven-accent-primary)",
            }}
          >
            {formatMoney(expense.amount)}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="card rounded-2xl p-4">
            <p
              className="mb-1 text-xs"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Date
            </p>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--evven-text-primary)" }}
            >
              {formatLongDate(expense.date ?? expense.created_at, "Recently")}
            </p>
          </div>
          <div className="card rounded-2xl p-4">
            <p
              className="mb-1 text-xs"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Payment mode
            </p>
            <p
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--evven-text-primary)" }}
            >
              {paymentMeta ? <paymentMeta.icon size={16} /> : null}
              {paymentMeta?.label ?? "Unspecified"}
            </p>
          </div>
          <div className="card rounded-2xl p-4">
            <p
              className="mb-1 text-xs"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Category
            </p>
            <p
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--evven-text-primary)" }}
            >
              <categoryMeta.icon size={16} />
              {categoryMeta.label}
            </p>
          </div>
          <div className="card rounded-2xl p-4">
            <p
              className="mb-1 text-xs"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Settlement
            </p>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--evven-text-primary)" }}
            >
              {getFriendHistoryDirection(expense)}
            </p>
          </div>
        </div>

        <div
          className="mt-5 rounded-2xl border p-4"
          style={{
            background: "var(--evven-background)",
            borderColor: "var(--evven-border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--evven-text-muted)" }}
          >
            Split context
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div
              className="rounded-2xl border p-3"
              style={{ borderColor: "var(--evven-border)" }}
            >
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                Counterparty
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {counterpartyLabel}
              </p>
            </div>
            <div
              className="rounded-2xl border p-3"
              style={{ borderColor: "var(--evven-border)" }}
            >
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                Settlement amount
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {formatMoney(settlementAmount)}
              </p>
            </div>
            <div
              className="rounded-2xl border p-3"
              style={{ borderColor: "var(--evven-border)" }}
            >
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                Source
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {sourceLabel}
              </p>
            </div>
            <div
              className="rounded-2xl border p-3"
              style={{ borderColor: "var(--evven-border)" }}
            >
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                Record type
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {getRecordType(expense)}
              </p>
            </div>
          </div>
        </div>

        {summary ? (
          <div
            className="mt-5 rounded-2xl border p-4"
            style={{
              background: "var(--evven-background)",
              borderColor: "var(--evven-border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Friend context
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--evven-text-primary)" }}
            >
              {summary}
            </p>
          </div>
        ) : null}

        {expense.notes ? (
          <div
            className="mt-5 rounded-2xl border p-4"
            style={{
              background: "var(--evven-background)",
              borderColor: "var(--evven-border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Notes
            </p>
            <p
              className="mt-2 text-sm leading-6"
              style={{ color: "var(--evven-text-primary)" }}
            >
              {expense.notes}
            </p>
          </div>
        ) : null}

        <div
          className="mt-5 rounded-2xl border p-4"
          style={{
            background: "var(--evven-background)",
            borderColor: "var(--evven-border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--evven-text-muted)" }}
          >
            Record metadata
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                Expense ID
              </p>
              <p
                className="break-all text-xs font-mono"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {expense.id}
              </p>
            </div>
            <div>
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                Created at
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {formatLongDate(expense.created_at, "Recently")}
              </p>
            </div>
            <div>
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                User ID
              </p>
              <p
                className="break-all text-xs font-mono"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {expense.user_id}
              </p>
            </div>
            <div>
              <p
                className="mb-1 text-[11px] uppercase tracking-widest"
                style={{ color: "var(--evven-text-muted)" }}
              >
                Linked source
              </p>
              <p
                className="break-words text-sm font-medium"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {expense.group_expense_id ?? expense.group_id ?? "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link
            href={`/expenses/${expense.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <PencilLine size={15} />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(expense)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
            style={{
              borderColor:
                "color-mix(in srgb, var(--evven-error) 30%, var(--evven-border))",
              color: "var(--evven-error)",
              background:
                "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
            }}
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
