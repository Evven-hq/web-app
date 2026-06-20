"use client";

import { Loader2, UserPlus, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

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
