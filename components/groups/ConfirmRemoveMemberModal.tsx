"use client";

import { Loader2, Trash2, X } from "lucide-react";
import type { GroupMember } from "@/types";

export function ConfirmRemoveMemberModal({
  member,
  memberName,
  onClose,
  onConfirm,
  removing,
}: {
  member: GroupMember | null;
  memberName: string;
  onClose: () => void;
  onConfirm: () => void;
  removing: boolean;
}) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={removing ? undefined : onClose} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-xl"
        style={{ background: "white", border: "1px solid var(--evven-border)" }}
      >
        <button
          onClick={onClose}
          disabled={removing}
          className="absolute top-4 right-4 p-1.5 rounded-lg disabled:opacity-50"
          style={{ background: "var(--evven-surface)" }}
        >
          <X size={15} />
        </button>

        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: "#FEF2F2", color: "#A32D2D" }}
        >
          <Trash2 size={18} />
        </div>
        <h2 className="text-base font-semibold mb-1" style={{ color: "var(--evven-text-primary)" }}>
          Remove member?
        </h2>
        <p className="text-sm mb-5" style={{ color: "var(--evven-text-muted)" }}>
          {memberName} will lose access to this group. Members with outstanding balances may not be removable.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={removing}
            className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            style={{
              borderColor: "var(--evven-border)",
              color: "var(--evven-text-primary)",
              background: "white",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={removing}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#A32D2D" }}
          >
            {removing ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
