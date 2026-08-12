"use client";

export function SectionWarning({ message }: { message: string }) {
  return (
    <div
      className="mb-5 rounded-2xl border px-4 py-3 text-sm"
      style={{
        background: "var(--evven-warning-bg)",
        borderColor: "var(--evven-warning-border)",
        color: "var(--evven-warning-text)",
      }}
    >
      {message}
    </div>
  );
}
