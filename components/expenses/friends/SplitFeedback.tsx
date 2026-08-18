"use client";

import type { SplitMode } from "@/types";
import { formatNumber } from "@/lib/format";

export function SplitFeedback({
  mode,
  totalAmount,
  totalPercentage,
  friendTotal,
  participantCount,
}: {
  mode: SplitMode;
  totalAmount: number;
  totalPercentage: number;
  friendTotal: number;
  participantCount: number;
}) {
  return (
    <>
      {mode === "percentage" && totalPercentage > 100 ? (
        <div
          className="rounded-2xl border px-3 py-2 text-xs"
          style={{
            background:
              "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
            borderColor:
              "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
            color: "var(--evven-error)",
          }}
        >
          Friend percentages total {Math.round(totalPercentage)}%. Keep them at
          or below 100% so your share can auto-fill the remainder.
        </div>
      ) : null}

      {mode === "custom" && friendTotal > totalAmount ? (
        <div
          className="rounded-2xl border px-3 py-2 text-xs"
          style={{
            background:
              "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
            borderColor:
              "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
            color: "var(--evven-error)",
          }}
        >
          Friend amounts total ₹{formatNumber(friendTotal)}. Keep them below ₹
          {formatNumber(totalAmount)} so your share can auto-fill the remainder.
        </div>
      ) : null}

      <div
        className="rounded-2xl border p-3"
        style={{
          background:
            "color-mix(in srgb, var(--evven-accent-secondary) 12%, var(--evven-background))",
          borderColor:
            "color-mix(in srgb, var(--evven-accent-primary) 20%, var(--evven-border))",
        }}
      >
        <p className="text-xs font-medium">
          Splitting ₹{formatNumber(totalAmount)} between you and{" "}
          {participantCount} friend
          {participantCount !== 1 ? "s" : ""}
        </p>
      </div>
    </>
  );
}
