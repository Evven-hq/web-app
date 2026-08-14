"use client";

import type { SettlementRow } from "./settlements-utils";
import { formatAmount } from "./group-detail-utils";
import { SettlementEmptyState } from "./SettlementEmptyState";

export function ToCollectPanel({
  rows,
  displayName,
  line,
}: {
  rows: SettlementRow[];
  displayName: (userId: string) => string;
  line: (giverId: string, receiverId: string) => string;
}) {
  return (
    <div className="h-full overflow-y-auto pr-1 pb-8">
      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map(({ sourceId, entries, total }) => (
            <div
              key={sourceId}
              className="card rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                    {displayName(sourceId)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                    To collect from {entries.length} member{entries.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: "var(--evven-surface)", color: "var(--evven-text-muted)" }}
                >
                  {formatAmount(total)}
                </span>
              </div>

              <div className="space-y-2">
                {entries.map(({ targetId, amount }) => (
                  <div
                    key={targetId}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                    style={{ background: "var(--evven-surface)" }}
                  >
                    <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                      {line(targetId, sourceId)}
                    </p>
                    <span className="text-sm font-semibold shrink-0" style={{ color: "var(--evven-text-primary)" }}>
                      {formatAmount(amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SettlementEmptyState title="Nothing to collect" description="Members you can collect from will show up here." />
      )}
    </div>
  );
}
