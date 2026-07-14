"use client";

import { CheckCircle, Loader2, X } from "lucide-react";
import type { GroupExpense, ExpenseSplit } from "@/types";
import { getCategoryMeta } from "@/lib/expense-categories";
import { getPaymentModeMeta } from "@/lib/payment-modes";
import { formatAmount } from "./group-detail-utils";
import type { UserNameFn } from "./group-detail-shared";

export function ExpenseDetailsModal({
  detailExpense,
  detailSplits,
  loadingDetails,
  detailError,
  currentUserId,
  userName,
  onClose,
  onEditExpense,
  canEdit,
}: {
  detailExpense: GroupExpense;
  detailSplits: ExpenseSplit[];
  loadingDetails: boolean;
  detailError: string;
  currentUserId?: string;
  userName: UserNameFn;
  onClose: () => void;
  onEditExpense: () => void;
  canEdit: boolean;
}) {
  const paymentModeMeta = getPaymentModeMeta(detailExpense.payment_mode);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="card relative w-full max-w-md rounded-3xl p-6 shadow-xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5" style={{ background: "var(--evven-surface)" }}>
          <X size={15} />
        </button>

        <div className="pr-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--evven-text-muted)" }}>
            Expense details
          </p>
          <h2 className="text-lg font-semibold" style={{ color: "var(--evven-text-primary)" }}>
            {detailExpense.title}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--evven-text-muted)" }}>
            Paid by {userName(detailExpense.paid_by)} · {new Date(detailExpense.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="card rounded-2xl p-4">
            <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Total</p>
            <p className="text-base font-semibold" style={{ color: "var(--evven-text-primary)" }}>
              {formatAmount(detailExpense.amount)}
            </p>
          </div>
          <div className="card rounded-2xl p-4">
            <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Split</p>
            <p className="text-base font-semibold capitalize" style={{ color: "var(--evven-text-primary)" }}>
              {detailExpense.split_type}
            </p>
          </div>
          {detailExpense.category && (
            <div className="card rounded-2xl p-4">
              <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Category</p>
              <p className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--evven-text-primary)" }}>
                {(() => {
                  const Icon = getCategoryMeta(detailExpense.category).icon;
                  return <Icon size={16} />;
                })()}
                {getCategoryMeta(detailExpense.category).label}
              </p>
            </div>
          )}
          {paymentModeMeta && (
            <div className="card rounded-2xl p-4">
              <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Payment mode</p>
              <p className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--evven-text-primary)" }}>
                <paymentModeMeta.icon size={16} />
                {paymentModeMeta.label}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--evven-text-muted)" }}>
            Breakdown
          </p>
          {loadingDetails ? (
            <div className="flex h-20 items-center justify-center">
              <Loader2 size={18} className="animate-spin" style={{ color: "var(--evven-accent-primary)" }} />
            </div>
          ) : detailError ? (
            <p className="text-sm" style={{ color: "var(--evven-error)" }}>{detailError}</p>
          ) : (
            <div className="space-y-2">
              {detailSplits.map((split) => (
                <div key={split.id} className="card flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                    {userName(split.user_id)}
                    {split.user_id === currentUserId ? " (you)" : ""}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                    {formatAmount(split.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {canEdit && (
          <button
            onClick={onEditExpense}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white"
            style={{ background: "var(--evven-accent-primary)" }}
          >
            <CheckCircle size={15} />
            Edit expense
          </button>
        )}
      </div>
    </div>
  );
}