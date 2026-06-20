"use client";

import { CheckCircle, Loader2, Plus, UserPlus, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { getCategoryMeta, EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import type { ExpenseSplit, GroupExpense } from "@/types";
import { formatAmount } from "./group-detail-utils";

type SplitType = "equal" | "exact" | "percentage";
type UserNameFn = (id: string) => string;

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
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-3xl p-6 shadow-xl"
        style={{ background: "white", border: "1px solid var(--evven-border)" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
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
          <div className="rounded-2xl p-4" style={{ background: "var(--evven-surface)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Total</p>
            <p className="text-base font-semibold" style={{ color: "var(--evven-text-primary)" }}>
              {formatAmount(detailExpense.amount)}
            </p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "var(--evven-surface)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Split</p>
            <p className="text-base font-semibold capitalize" style={{ color: "var(--evven-text-primary)" }}>
              {detailExpense.split_type}
            </p>
          </div>
          {detailExpense.category && (
            <div className="rounded-2xl p-4 col-span-2" style={{ background: "var(--evven-surface)" }}>
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
                <div key={split.id} className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "var(--evven-surface)" }}>
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
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-xl"
        style={{ background: "white", border: "1px solid var(--evven-border)" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
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
                    className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"
                    style={{
                      background: selected ? "#EEEDFE" : "white",
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
            <div className="rounded-2xl border p-3" style={{ borderColor: "var(--evven-border)" }}>
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
                <p className="rounded-xl px-3 py-2 text-xs" style={{ background: "var(--evven-surface)", color: "var(--evven-error)" }}>
                  Group members are still loading. Try again in a moment.
                </p>
              ) : selectedParticipants.length === 0 ? (
                <p className="rounded-xl px-3 py-2 text-xs" style={{ background: "var(--evven-surface)", color: "var(--evven-text-muted)" }}>
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

export function AddMemberModal({
  open,
  onClose,
  memberCode,
  setMemberCode,
  onSubmit,
  savingMember,
  memberError,
}: {
  open: boolean;
  onClose: () => void;
  memberCode: string;
  setMemberCode: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  savingMember: boolean;
  memberError: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-xl"
        style={{ background: "white", border: "1px solid var(--evven-border)" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
          <X size={15} />
        </button>
        <h2 className="text-base font-semibold mb-1" style={{ color: "var(--evven-text-primary)" }}>
          Add member
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--evven-text-muted)" }}>
          Enter the person&apos;s user code — they can find it in their profile.
        </p>
        <input
          autoFocus
          type="text"
          placeholder="e.g. USR-XXXX"
          value={memberCode}
          onChange={(e) => setMemberCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 mb-3"
          style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
        />
        {memberError && <p className="text-xs mb-2" style={{ color: "var(--evven-error)" }}>{memberError}</p>}
        <button
          onClick={onSubmit}
          disabled={!memberCode.trim() || savingMember}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "var(--evven-accent-primary)" }}
        >
          {savingMember ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
          {savingMember ? "Adding…" : "Add member"}
        </button>
      </div>
    </div>
  );
}

export function SettleModal({
  open,
  onClose,
  settleReceiver,
  settleAmount,
  setSettleAmount,
  userName,
  onSubmit,
  savingSettle,
  settleError,
}: {
  open: boolean;
  onClose: () => void;
  settleReceiver: string;
  settleAmount: string;
  setSettleAmount: Dispatch<SetStateAction<string>>;
  userName: UserNameFn;
  onSubmit: () => void;
  savingSettle: boolean;
  settleError: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-xl"
        style={{ background: "white", border: "1px solid var(--evven-border)" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
          <X size={15} />
        </button>
        <h2 className="text-base font-semibold mb-1" style={{ color: "var(--evven-text-primary)" }}>
          Record settlement
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--evven-text-muted)" }}>
          Confirm you paid <strong>{userName(settleReceiver)}</strong>.
        </p>
        <input
          autoFocus
          type="number"
          min="0.01"
          step="0.01"
          value={settleAmount}
          onChange={(e) => setSettleAmount(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 mb-3"
          style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
        />
        {settleError && <p className="text-xs mb-2" style={{ color: "var(--evven-error)" }}>{settleError}</p>}
        <button
          onClick={onSubmit}
          disabled={!settleAmount || savingSettle}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "var(--evven-accent-primary)" }}
        >
          {savingSettle ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
          {savingSettle ? "Saving…" : "Confirm"}
        </button>
      </div>
    </div>
  );
}
