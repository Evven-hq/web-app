export function formatMoney(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return `₹${Math.abs(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatSignedMoney(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  const prefix = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${prefix}${formatMoney(amount)}`;
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function formatAmount(n: string | number, currency = "₹") {
  return `${currency}${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatDate(value?: string | null, fallback = "") {
  if (!value) return fallback;

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(value?: string | null, fallback = "") {
  if (!value) return fallback;

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function formatLongDate(value?: string | null, fallback = "") {
  if (!value) return fallback;

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRelativeTime(
  value?: string | null,
  fallbackFormatter: (value: string) => string = formatDate,
) {
  if (!value) return "just now";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return fallbackFormatter(value);
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
