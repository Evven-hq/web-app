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
  { value: "food", label: "Food", icon: UtensilsCrossed, bg: "var(--evven-category-food-bg)", text: "var(--evven-category-food-text)" },
  { value: "travel", label: "Travel", icon: Plane, bg: "var(--evven-category-travel-bg)", text: "var(--evven-category-travel-text)" },
  { value: "home", label: "Home", icon: House , bg: "var(--evven-category-home-bg)", text: "var(--evven-category-home-text)" },
  { value: "entertainment", label: "Entertainment", icon: Film, bg: "var(--evven-category-entertainment-bg)", text: "var(--evven-category-entertainment-text)" },
  { value: "utilities", label: "Utilities", icon: Lightbulb, bg: "var(--evven-category-utilities-bg)", text: "var(--evven-category-utilities-text)" },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, bg: "var(--evven-category-shopping-bg)", text: "var(--evven-category-shopping-text)" },
  { value: "health", label: "Health", icon: HeartPulse, bg: "var(--evven-category-health-bg)", text: "var(--evven-category-health-text)" },
  { value: "other", label: "Other", icon: CircleEllipsis, bg: "var(--evven-category-other-bg)", text: "var(--evven-category-other-text)" },
];

const FALLBACK = EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];

export function getCategoryMeta(category?: string | null): ExpenseCategory {
  if (!category) return FALLBACK;
  return (
    EXPENSE_CATEGORIES.find((c) => c.value === category.toLowerCase()) ?? FALLBACK
  );
}
