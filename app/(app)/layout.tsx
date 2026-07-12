"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  House,
  ReceiptText,
  Users,
  HandCoins,
  CircleUserRound,
  LogOut,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DockItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  center?: boolean;
};

const DOCK_ITEMS: DockItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: House },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/friends", label: "Friends", icon: HandCoins },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Dock({ pathname, variant }: { pathname: string; variant: "mobile" | "desktop" }) {
  const isDesktop = variant === "desktop";

  return (
    <nav
      className={cn(
        "pointer-events-none fixed z-40",
        isDesktop
          ? "bottom-6 left-1/2 hidden -translate-x-1/2 px-0 md:block"
          : "inset-x-0 bottom-0 px-4 pb-4 md:hidden"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto grid items-center rounded-(--evven-radius-hero) border shadow-2xl shadow-black/20",
          isDesktop
            ? "grid-flow-col auto-cols-max gap-1.5 px-3 py-2.5"
            : "mx-auto h-16 max-w-md grid-cols-5 gap-1 px-3 py-0"
        )}
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--evven-surface) 96%, white), color-mix(in srgb, var(--evven-surface) 88%, transparent))",
          border: "0.5px solid var(--evven-border)",
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
        }}
      >
        {DOCK_ITEMS.map(({ href, label, icon: Icon, center }) => {
          const active = !center && isActiveRoute(pathname, href);
          const isAdd = Boolean(center);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={cn(
                "flex items-center justify-center justify-self-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--evven-accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isAdd
                  ? "size-12 shadow-md ring-1 ring-black/5 hover:-translate-y-0.5 hover:shadow-lg"
                  : "size-11 hover:-translate-y-0.5"
              )}
              style={{
                background: isAdd
                  ? "var(--evven-accent-primary)"
                  : active
                    ? "color-mix(in srgb, var(--evven-background) 88%, white)"
                    : "transparent",
                color: isAdd
                  ? "var(--evven-text-inverse)"
                  : active
                    ? "var(--evven-accent-primary)"
                    : "var(--evven-text-muted)",
                boxShadow: active
                  ? "0 1px 0 color-mix(in srgb, var(--evven-text-primary) 8%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--evven-border) 80%, transparent)"
                  : undefined,
              }}
            >
              <Icon size={isAdd ? 24 : 20} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function DesktopIdentityChip({
  user,
}: {
  user: ReturnType<typeof useAuthStore.getState>["user"];
}) {
  return (
    <Link
      href="/profile"
      className={`
        group pointer-events-auto fixed left-6 top-6 z-40 hidden items-center gap-3 
        rounded-(--evven-radius-hero) px-4 py-3 
        transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:bg-red-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background
        md:flex
        animate-[fadeIn_0.5s_ease-out]
      `}
      style={
        {
          "--chip-bg":
            "color-mix(in srgb, white 14%, color-mix(in srgb, var(--evven-background) 72%, var(--evven-surface)))",
          backgroundColor: "var(--chip-bg)",
        } as React.CSSProperties
      }
      aria-label="Profile"
    >
      {/* Avatar container */}
      <div
        className={`
          relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full 
          border-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          group-hover:border-[var(--evven-accent-primary)] group-hover:shadow-[0_0_12px_var(--evven-accent-primary)]
        `}
        style={{
          background: "var(--evven-accent-secondary)",
          color: "var(--evven-accent-primary)",
          borderColor: "var(--evven-accent-primary)",
        }}
      >
        {user?.profile_picture ? (
          <img
            src={user.profile_picture}
            alt={user.name ?? "Profile"}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          />
        ) : user?.name ? (
          <span className="transition-transform duration-500 group-hover:scale-110">
            {getInitials(user.name)}
          </span>
        ) : (
          "?"
        )}
      </div>

      {/* Text container */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
          {user?.name ?? ""}
        </p>
        <p
          className="truncate text-xs"
          style={{ color: "var(--evven-text-muted)", fontFamily: "var(--font-mono)" }}
        >
          {user?.user_code ?? ""}
        </p>
      </div>
    </Link>
  );
}

function DesktopLogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="fixed right-6 bottom-6 z-40 hidden md:block">
      <button
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
        className="group pointer-events-auto inline-flex h-12 items-center overflow-hidden rounded-(--evven-radius-hero) px-3 py-0  transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-error)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        
      >
        <span
          className="flex size-8 items-center justify-center rounded-full transition-all duration-200"
          style={{
            background: "color-mix(in srgb, var(--evven-error) 12%, var(--evven-surface))",
            border: "0.5px solid color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
            color: "var(--evven-error)",
          }}
        >
          <LogOut size={15} />
        </span>
        <span
          className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-[max-width,opacity,transform] duration-200 group-hover:ml-2 group-hover:max-w-24 group-hover:opacity-100"
          style={{ color: "var(--evven-error)" }}
        >
          Log out
        </span>
      </button>
    </div>
  );
}

function MobileFloatingChrome({
  user,
  showAddExpense,
}: {
  user: ReturnType<typeof useAuthStore.getState>["user"];
  showAddExpense: boolean;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-4 md:hidden">
      <Link
        href="/profile"
        className="pointer-events-auto flex size-11 items-center justify-center overflow-hidden rounded-full text-xs font-semibold shadow-lg"
        style={{
          background:
            "color-mix(in srgb, var(--evven-accent-secondary) 45%, transparent)",
          color: "var(--evven-accent-primary)",
          border: "1px solid var(--evven-border)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
        }}
        aria-label="Profile"
      >
        {user?.profile_picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profile_picture}
            alt={user.name ?? "Profile"}
            className="size-full object-cover"
          />
        ) : user?.name ? (
          getInitials(user.name)
        ) : (
          "?"
        )}
      </Link>

      {showAddExpense ? (
        <Link
          href="/expenses/new"
          aria-label="Add expense"
          className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:opacity-90"
        >
          <Plus size={16} />
        </Link>
      ) : null}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div
          className="size-5 animate-spin rounded-full border-2 border-r-transparent"
          style={{ borderColor: "var(--evven-accent-primary)", borderRightColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileFloatingChrome user={user} showAddExpense={pathname === "/dashboard"} />
        <DesktopIdentityChip user={user} />

        <main className="flex-1 overflow-y-auto pb-24 pt-16 md:pb-32 md:pt-24">
          {children}
        </main>

        <Dock pathname={pathname} variant="mobile" />
        <Dock pathname={pathname} variant="desktop" />
        <DesktopLogoutButton onLogout={handleLogout} />
      </div>
    </div>
  );
}
