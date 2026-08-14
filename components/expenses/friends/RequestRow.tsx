"use client";

import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FriendRequest } from "@/types";
import { formatRelativeTime } from "@/lib/format";
import { FriendAvatar } from "./FriendAvatar";

export function RequestRow({
  request,
  tone,
  onAccept,
  onReject,
  busy,
}: {
  request: FriendRequest;
  tone: "incoming" | "outgoing";
  onAccept: () => void;
  onReject: () => void;
  busy: boolean;
}) {
  return (
    <div
      className="rounded-3xl border px-4 py-4"
      style={{
        background:
          tone === "incoming"
            ? "color-mix(in srgb, var(--evven-accent-secondary) 18%, var(--evven-background))"
            : "var(--evven-background)",
        borderColor: "var(--evven-border)",
      }}
    >
      <div className="flex items-start gap-3">
        <FriendAvatar friend={request} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{request.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {tone === "incoming" ? "Waiting for your response" : "Sent from your account"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {request.created_at ? formatRelativeTime(request.created_at) : "Recently"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {tone === "incoming" ? (
          <Button disabled={busy} className="w-full sm:w-auto" onClick={onAccept}>
            {busy ? <Loader2 className="animate-spin" /> : <Check />}
            Accept
          </Button>
        ) : (
          <div className="flex-1 rounded-2xl border px-4 py-2.5 text-xs text-muted-foreground" style={{ borderColor: "var(--evven-border)" }}>
            Pending approval
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={busy}
          onClick={onReject}
        >
          <X />
          {tone === "incoming" ? "Reject" : "Cancel"}
        </Button>
      </div>
    </div>
  );
}
