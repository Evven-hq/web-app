"use client";

import { fieldInputClass, fieldInputStyle } from "./form-utils";

export function NotesField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Notes
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Optional details"
        rows={4}
        className={fieldInputClass}
        style={fieldInputStyle}
      />
    </div>
  );
}
