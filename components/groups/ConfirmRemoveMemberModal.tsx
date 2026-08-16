"use client";

import { Loader2, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
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
  if (!member || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-backdrop absolute inset-0" onClick={removing ? undefined : onClose} />
      <div
        className="modal-panel card relative w-full max-w-sm rounded-3xl p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          disabled={removing}
          className="absolute right-4 top-4 rounded-lg p-1.5 disabled:opacity-50"
          style={{ background: "var(--evven-surface)" }}
        >
          <X size={15} />
        </button>

        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: "var(--evven-destructive-bg)", color: "var(--evven-destructive-text)" }}
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
              background: "var(--evven-card-background)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={removing}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "var(--evven-destructive-text)" }}
          >
            {removing ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
