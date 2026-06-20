"use client";

import { CheckCircle, Loader2, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { UserNameFn } from "./group-detail-shared";

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
