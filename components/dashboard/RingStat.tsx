"use client";

export function RingStat({
  label,
  value,
  sub,
  progress = 68,
  color = "var(--evven-accent-primary)",
}: {
  label: string;
  value: string;
  sub: string;
  progress?: number;
  color?: string;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(progress, 100));

  return (
    <div
      className="flex min-w-0 items-center gap-3 rounded-3xl p-4"
      style={{
        background: "var(--color-background-primary, var(--evven-background))",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      <svg
        className="size-12 shrink-0 -rotate-90"
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="var(--evven-border)"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (clamped / 100) * circumference}
        />
      </svg>
      <div className="min-w-0">
        <p
          className="truncate text-lg font-medium leading-none"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {value}
        </p>
        <p
          className="mt-1 text-xs font-medium"
          style={{ color: "var(--evven-text-primary)" }}
        >
          {label}
        </p>
        <p
          className="mt-0.5 truncate text-xs"
          style={{ color: "var(--evven-text-muted)" }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}
