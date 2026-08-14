"use client";

import { UserRoundPlus } from "lucide-react";
import type { FriendRequest } from "@/types";
import { RequestRow } from "./RequestRow";

export function RequestsTab({
  requests,
  isLoading,
  onAccept,
  onReject,
  busy,
}: {
  requests: { incoming: FriendRequest[]; outgoing: FriendRequest[] };
  isLoading: boolean;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  busy: boolean;
}) {
  return (
    <section className="space-y-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
            Requests
          </p>
          <h2 className="mt-2 text-lg font-medium sm:text-xl">Incoming and outgoing</h2>
        </div>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--evven-accent-secondary) 32%, var(--evven-background))",
            color: "var(--evven-accent-primary)",
          }}
        >
          <UserRoundPlus size={18} />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((item) => (
            <div key={item} className="h-24 rounded-3xl border border-[var(--evven-border)] bg-[var(--evven-surface)] animate-pulse" />
          ))}
        </div>
      ) : requests.incoming.length === 0 && requests.outgoing.length === 0 ? (
        <div className="rounded-3xl border border-dashed px-4 py-6 text-sm text-muted-foreground" style={{ borderColor: "var(--evven-border)" }}>
          No pending requests right now.
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {requests.incoming.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
                Incoming
              </p>
              <div className="space-y-2">
                {requests.incoming.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    onAccept={() => onAccept(request.id)}
                    onReject={() => onReject(request.id)}
                    busy={busy}
                    tone="incoming"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {requests.outgoing.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
                Outgoing
              </p>
              <div className="space-y-2">
                {requests.outgoing.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    onAccept={() => onAccept(request.id)}
                    onReject={() => onReject(request.id)}
                    busy={busy}
                    tone="outgoing"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
