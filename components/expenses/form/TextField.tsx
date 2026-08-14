"use client";

import { fieldInputClass, fieldInputStyle } from "./form-utils";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  step,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        min={min}
        step={step}
        placeholder={placeholder}
        className={fieldInputClass}
        style={fieldInputStyle}
        required={required}
      />
    </div>
  );
}
