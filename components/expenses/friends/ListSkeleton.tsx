"use client";

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-24 rounded-3xl border border-[var(--evven-border)] bg-[var(--evven-surface)] animate-pulse"
        />
      ))}
    </div>
  );
}
