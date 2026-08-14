import type { ComponentType } from "react";
import { CircleUserRound, HandCoins, House, ReceiptText, Users } from "lucide-react";

export type DockItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  center?: boolean;
};

export const DOCK_ITEMS: DockItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: House },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/friends", label: "Friends", icon: HandCoins },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
] as const;

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
