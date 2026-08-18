"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";

import { isSoundEnabled, setSoundEnabled } from "@/lib/expense-success-sound";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { surfaceCard } from "./profile-utils";

export function SoundPreferenceCard() {
  const [enabled, setEnabled] = useState(() => isSoundEnabled());

  const handleCheckedChange = (checked: boolean) => {
    const next = checked === true;
    setEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <div className="card rounded-3xl p-5" style={surfaceCard()}>
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Preferences
      </p>
      <div className="mt-3 flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full"
          style={{
            background: "var(--evven-accent-secondary)",
            color: "var(--evven-accent-primary)",
          }}
        >
          <Volume2 size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <Label
            htmlFor="expense-sound-enabled"
            className="text-sm font-medium"
          >
            Expense success sound
          </Label>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--evven-text-muted)" }}
          >
            Play the success chime and stamp when an expense completes.
          </p>
        </div>
        <Checkbox
          id="expense-sound-enabled"
          checked={enabled}
          onCheckedChange={(checked) => handleCheckedChange(checked === true)}
          aria-label="Toggle expense success sound"
          className="mt-0.5 shrink-0"
        />
      </div>
    </div>
  );
}
