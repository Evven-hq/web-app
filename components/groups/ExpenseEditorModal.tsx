"use client";

import { Loader2, Plus, CheckCircle, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import { PAYMENT_MODES } from "@/lib/payment-modes";
import type { GroupExpense, PaymentMethod } from "@/types";
import { formatAmount } from "./group-detail-utils";
import type { UserNameFn } from "./group-detail-shared";

type SplitType = "equal" | "exact" | "percentage";

export function ExpenseEditorModal({
  open,
  onClose,
  editingExpense,
  expTitle,
  setExpTitle,
  expAmount,
  setExpAmount,
  expSplitType,
  expCategory,
  setExpCategory,
  expPaymentMethod,
  setExpPaymentMethod,
  selectedParticipants,
  setSelectedParticipants,
  splitInputs,
  setSplitInputs,
  splitParticipantIds,
  currentUserId,
  userName,
  onSelectSplitType,
  onFillSplitsEqually,
  onSave,
  expError,
  savingExp,
}: {
  open: boolean;
  onClose: () => void;
  editingExpense: GroupExpense | null;
  expTitle: string;
  setExpTitle: Dispatch<SetStateAction<string>>;
  expAmount: string;
  setExpAmount: Dispatch<SetStateAction<string>>;
  expSplitType: SplitType;
  expCategory: string;
  setExpCategory: Dispatch<SetStateAction<string>>;
  expPaymentMethod: PaymentMethod;
  setExpPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
  selectedParticipants: string[];
  setSelectedParticipants: Dispatch<SetStateAction<string[]>>;
  splitInputs: Record<string, string>;
  setSplitInputs: Dispatch<SetStateAction<Record<string, string>>>;
  splitParticipantIds: string[];
  currentUserId?: string;
  userName: UserNameFn;
  onSelectSplitType: (splitType: SplitType) => void;
  onFillSplitsEqually: () => void;
  onSave: () => void;
  expError: string;
  savingExp: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="card relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5" style={{ background: "var(--evven-surface)" }}>
          <X size={15} />
        </button>
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--evven-text-primary)" }}>
          {editingExpense ? "Edit expense" : "Add expense"}
        </h2>

        <div className="space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="What was it for?"
            value={expTitle}
            onChange={(e) => setExpTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
            style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--evven-text-muted)" }}>₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              className="w-full pl-7 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
              style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
              Category (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setExpCategory((current) => (current === cat.value ? "" : cat.value))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: expCategory === cat.value ? cat.bg : "var(--evven-surface)",
                    color: expCategory === cat.value ? cat.text : "var(--evven-text-muted)",
                  }}
                >
                  {(() => {
                    const Icon = cat.icon;
                    return <Icon size={14} />;
                  })()}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
              Payment mode
            </p>
            <div className="flex flex-wrap gap-2">
{PAYMENT_MODES.map((mode) => {
      const Icon = mode.icon;
      const active = expPaymentMethod?.toLowerCase() === mode.value;

                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setExpPaymentMethod(mode.value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: active ? mode.bg : "var(--evven-surface)",
                      color: active ? mode.text : "var(--evven-text-muted)",
                    }}
                  >
                    <Icon size={14} />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            {(["equal", "exact", "percentage"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onSelectSplitType(t)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: expSplitType === t ? "var(--evven-accent-primary)" : "var(--evven-surface)",
                  color: expSplitType === t ? "white" : "var(--evven-text-muted)",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
              Participants
            </label>
            <div className="grid grid-cols-2 gap-2">
              {splitParticipantIds.map((userId) => {
                const selected = selectedParticipants.includes(userId);

                return (
                  <button
                    key={userId}
                    type="button"
                    onClick={() => {
                      setSelectedParticipants((prev) =>
                        selected ? prev.filter((id) => id !== userId) : [...prev, userId]
                      );
                    }}
                    className="card flex items-center justify-between rounded-xl px-3 py-2 text-sm"
                    style={{
                      background: selected ? "#EEEDFE" : "var(--evven-card-background)",
                      borderColor: selected ? "#534AB7" : "var(--evven-border)",
                    }}
                  >
                    <span className="truncate">{userName(userId)}</span>
                    {selected && <CheckCircle size={14} color="#534AB7" />}
                  </button>
                );
              })}
            </div>
            <p className="text-xs" style={{ color: "var(--evven-text-muted)" }}>
              {selectedParticipants.length} selected
            </p>
          </div>

          {expSplitType !== "equal" && (
            <div className="card rounded-2xl p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
                  {expSplitType === "exact" ? "Exact amounts" : "Percentages"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium" style={{ color: "var(--evven-text-muted)" }}>
                    {expSplitType === "exact"
                      ? `${formatAmount(Object.values(splitInputs).reduce((sum, value) => sum + Number(value || 0), 0))} / ${formatAmount(Number(expAmount || 0))}`
                      : `${Object.values(splitInputs).reduce((sum, value) => sum + Number(value || 0), 0).toFixed(2)}% / 100%`}
                  </p>
                  <button
                    type="button"
                    onClick={onFillSplitsEqually}
                    disabled={selectedParticipants.length === 0}
                    className="rounded-lg px-2 py-1 text-xs font-medium disabled:opacity-50"
                    style={{
                      background: "var(--evven-surface)",
                      color: "var(--evven-text-primary)",
                    }}
                  >
                    Fill equally
                  </button>
                </div>
              </div>
              {splitParticipantIds.length === 0 ? (
                <p className="card rounded-xl px-3 py-2 text-xs" style={{ color: "var(--evven-error)" }}>
                  Group members are still loading. Try again in a moment.
                </p>
              ) : selectedParticipants.length === 0 ? (
                <p className="card rounded-xl px-3 py-2 text-xs" style={{ color: "var(--evven-text-muted)" }}>
                  Select at least one participant to enter split amounts.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedParticipants.map((userId) => (
                    <div key={userId} className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                          {userName(userId)}
                          {userId === currentUserId ? " (you)" : ""}
                        </p>
                      </div>
                      <div className="relative w-28">
                        {expSplitType === "exact" && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--evven-text-muted)" }}>₹</span>
                        )}
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={splitInputs[userId] ?? ""}
                          onChange={(event) =>
                            setSplitInputs((current) => ({
                              ...current,
                              [userId]: event.target.value,
                            }))
                          }
                          className={`w-full rounded-xl border py-2 text-right text-sm outline-none focus:ring-2 ${expSplitType === "exact" ? "pl-6 pr-3" : "px-3"}`}
                          style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
                        />
                        {expSplitType === "percentage" && (
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--evven-text-muted)" }}>%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {expError && <p className="text-xs mt-2" style={{ color: "var(--evven-error)" }}>{expError}</p>}

        <button
          onClick={onSave}
          disabled={!expTitle.trim() || !expAmount || savingExp}
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "var(--evven-accent-primary)" }}
        >
          {savingExp ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          {savingExp ? "Saving…" : editingExpense ? "Save changes" : "Add expense"}
        </button>
      </div>
    </div>
  );
}