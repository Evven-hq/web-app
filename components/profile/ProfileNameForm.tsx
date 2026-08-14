"use client";

import type { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { surfaceCard } from "./profile-utils";

export function ProfileNameForm({
  name,
  onNameChange,
  dirty,
  saving,
  message,
  error,
  onSubmit,
}: {
  name: string;
  onNameChange: (value: string) => void;
  dirty: boolean;
  saving: boolean;
  message: string;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="card mb-4 rounded-3xl p-5 sm:p-6" style={surfaceCard()}>
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
        Edit account
      </p>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
          Name
        </label>
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: "var(--evven-surface)", border: "0.5px solid var(--evven-border)" }}
          required
        />
      </div>

      {message && <p className="mb-4 text-sm" style={{ color: "var(--evven-accent-primary)" }}>{message}</p>}
      {error && <p className="mb-4 text-sm" style={{ color: "var(--evven-error)" }}>{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !name.trim() || !dirty}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50 sm:w-auto"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
