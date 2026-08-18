import { COLORS } from "@/lib/avatar";

export { COLORS };
export { getInitials } from "@/lib/format";

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
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function splitEvenly(total: number, count: number) {
  if (count <= 0) return [];

  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const remainder = cents - base * count;

  return Array.from({ length: count }, (_, index) =>
    ((base + (index < remainder ? 1 : 0)) / 100).toFixed(2),
  );
}
