import { Smartphone, Banknote } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PaymentMethod } from "@/types";

export interface PaymentModeMeta {
  value: PaymentMethod;
  label: string;
  icon: LucideIcon;
  bg: string;
  text: string;
}

export const PAYMENT_MODES: PaymentModeMeta[] = [
  { value: "upi", label: "UPI", icon: Smartphone, bg: "#E6F1FB", text: "#185FA5" },
  { value: "cash", label: "Cash", icon: Banknote, bg: "#EAF3DE", text: "#3B6D11" },
];

export function getPaymentModeMeta(mode?: string | null): PaymentModeMeta | null {
  if (!mode) return null;
  return PAYMENT_MODES.find((m) => m.value.toLowerCase() === mode.toLowerCase()) ?? null;
}