"use client";

import { Check, Copy } from "lucide-react";
import { surfaceCard } from "./profile-utils";

export function ProfileShareCard({
  userCode,
  copied,
  onCopy,
}: {
  userCode: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="card rounded-3xl p-5" style={surfaceCard()}>
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Share your account
      </p>
      <p className="mt-1 text-sm" style={{ color: "var(--evven-text-muted)" }}>
        Give this code to friends so they can add you to a group.
      </p>
      <button
        onClick={onCopy}
        className="mt-4 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors hover:opacity-90"
        style={{ background: "var(--evven-surface)" }}
      >
        <span style={{ fontFamily: "var(--font-mono)" }}>{userCode}</span>
        {copied ? (
          <span
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--evven-accent-primary)" }}
          >
            <Check size={15} />
            Copied
          </span>
        ) : (
          <Copy size={15} style={{ color: "var(--evven-text-muted)" }} />
        )}
      </button>
    </div>
  );
}
