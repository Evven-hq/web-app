"use client";

import type { PaymentMethod } from "@/types";
import { PAYMENT_MODES } from "@/lib/payment-modes";

export function PaymentModePicker({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Payment mode
      </label>
      <div className="flex flex-wrap gap-2">
        {PAYMENT_MODES.map((mode) => {
          const Icon = mode.icon;
          const active = value?.toLowerCase() === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange(mode.value)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: active ? mode.bg : "var(--evven-surface)",
                color: active ? mode.text : "var(--evven-text-muted)",
                border: `1px solid ${active ? mode.bg : "var(--evven-border)"}`,
              }}
            >
              <Icon size={14} />
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
