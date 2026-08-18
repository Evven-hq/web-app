"use client";

import { CheckCircle } from "lucide-react";
import type { Settlement } from "@/types";
import { formatAmount } from "./group-detail-utils";
import { SettlementEmptyState } from "./SettlementEmptyState";

export function PastSettlementsPanel({
  settlements,
  line,
}: {
  settlements: Settlement[];
  line: (giverId: string, receiverId: string) => string;
}) {
  return (
    <div className="h-full overflow-y-auto pr-1 pb-8">
      {settlements.length > 0 ? (
        <div className="space-y-2">
          {settlements.map((settlement) => (
            <div
              key={settlement.id}
              className="card flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <CheckCircle
                size={15}
                style={{ color: "var(--evven-success-text)" }}
                className="shrink-0"
              />
              <p
                className="text-sm flex-1 font-medium"
                style={{ color: "var(--evven-text-primary)" }}
              >
                {line(settlement.payer_id, settlement.receiver_id)}
              </p>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--evven-success-text)" }}
              >
                {formatAmount(settlement.amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <SettlementEmptyState
          title="No settled payments"
          description="Payments you mark as settled will show up here."
        />
      )}
    </div>
  );
}
