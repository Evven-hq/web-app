import type { FriendActivity } from "@/types";
import { formatMoney } from "./friend-utils";

export function getActivityTime(entry: FriendActivity) {
  return entry.date ?? entry.created_at ?? "";
}

export function getActivityType(entry: FriendActivity) {
  if (entry.type === "settlement" || entry.settlement_amount)
    return "settlement";
  return "expense";
}

export function getActivityTitle(entry: FriendActivity) {
  return (
    entry.title ||
    (getActivityType(entry) === "settlement" ? "Settlement" : "Expense")
  );
}

export function getActivityMeta(entry: FriendActivity, friendName: string) {
  const amount = formatMoney(entry.settlement_amount ?? entry.amount);
  const type = getActivityType(entry);

  if (type === "settlement") {
    const label =
      entry.settlement_direction === "you_owe"
        ? `${friendName} paid`
        : "You paid";
    return {
      label,
      amount,
      tone: entry.settlement_direction === "you_owe" ? "positive" : "negative",
      badge: "Settlement",
    };
  }

  const label =
    entry.direction === "you_owe"
      ? `${friendName} paid`
      : entry.direction === "they_owe"
        ? "You paid"
        : "Expense";

  return {
    label,
    amount,
    tone: entry.direction === "you_owe" ? "positive" : "negative",
    badge: "Expense",
  };
}
