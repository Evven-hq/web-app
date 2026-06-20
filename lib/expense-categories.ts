import {
  UtensilsCrossed,
  Plane,
  House,
  Film,
  Lightbulb,
  ShoppingBag,
  HeartPulse,
  CircleEllipsis,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ExpenseCategory {
  value: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  text: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { value: "food", label: "Food", icon: UtensilsCrossed, bg: "#FAEEDA", text: "#854F0B" },
  { value: "travel", label: "Travel", icon: Plane, bg: "#E6F1FB", text: "#185FA5" },
  { value: "home", label: "Home", icon: House , bg: "#EAF3DE", text: "#3B6D11" },
  { value: "entertainment", label: "Entertainment", icon: Film, bg: "#FBEAF0", text: "#993556" },
  { value: "utilities", label: "Utilities", icon: Lightbulb, bg: "#FEF6E0", text: "#8A6C0A" },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, bg: "#EEEDFE", text: "#534AB7" },
  { value: "health", label: "Health", icon: HeartPulse, bg: "#E1F5EE", text: "#0F6E56" },
  { value: "other", label: "Other", icon: CircleEllipsis, bg: "#EEEDFE", text: "#534AB7" },
];

const FALLBACK = EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];

export function getCategoryMeta(category?: string | null): ExpenseCategory {
  if (!category) return FALLBACK;
  return (
    EXPENSE_CATEGORIES.find((c) => c.value === category.toLowerCase()) ?? FALLBACK
  );
}