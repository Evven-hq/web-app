export const COLORS = [
  { bg: "var(--evven-avatar-1-bg)", text: "var(--evven-avatar-1-text)" },
  { bg: "var(--evven-avatar-2-bg)", text: "var(--evven-avatar-2-text)" },
  { bg: "var(--evven-avatar-3-bg)", text: "var(--evven-avatar-3-text)" },
  { bg: "var(--evven-avatar-4-bg)", text: "var(--evven-avatar-4-text)" },
  { bg: "var(--evven-avatar-5-bg)", text: "var(--evven-avatar-5-text)" },
  { bg: "var(--evven-avatar-6-bg)", text: "var(--evven-avatar-6-text)" },
];

export function colorForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}

export function formatAmount(n: string | number) {
  return `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function splitEvenly(total: number, count: number) {
  if (count <= 0) return [];

  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const remainder = cents - base * count;

  return Array.from({ length: count }, (_, index) =>
    ((base + (index < remainder ? 1 : 0)) / 100).toFixed(2)
  );
}
