"use client";

import { Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function SplitHeader({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: "color-mix(in srgb, var(--evven-accent-secondary) 38%, var(--evven-background))",
          color: "var(--evven-accent-primary)",
        }}
      >
        <Users size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={enabled}
              onCheckedChange={(checked) => onToggle(Boolean(checked))}
            />
            <label className="text-sm font-medium">Split between friends</label>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Divide this expense across multiple friends without leaving the current flow.
        </p>
      </div>
    </div>
  );
}
