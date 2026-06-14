"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  LayoutDashboard,
  Users,
  Receipt,
  User,
  LogOut,
  Plus,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/groups",    label: "Groups",    icon: Users },
  { href: "/expenses",  label: "Expenses",  icon: Receipt },
  { href: "/profile",   label: "Profile",   icon: User },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SidebarProps {
  pathname: string;
  user: ReturnType<typeof useAuthStore.getState>["user"];
  mobile?: boolean;
  onNavigate: () => void;
  onLogout: () => void;
}

function Sidebar({
  pathname,
  user,
  mobile = false,
  onNavigate,
  onLogout,
}: SidebarProps) {
  return (
    <div className={cn("flex h-full flex-col", mobile ? "p-4" : "p-4")}>
      {/* Logo */}
      <div className="mb-8 px-2 pt-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/EvenUp-black.svg"
            alt="Evven"
            width={42}
            height={42}
          />
          <span className="font-semibold text-sm tracking-wide" style={{ color: "var(--evven-text-primary)" }}>
            Evven
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-[var(--evven-accent-primary)] text-white"
                  : "text-[var(--evven-text-muted)] hover:bg-[var(--evven-surface)] hover:text-[var(--evven-text-primary)]"
              )}
            >
              <Icon size={16} className="flex-shrink-0" />
              {label}
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Quick add */}
      <div className="mb-4">
        <Link
          href="/expenses/new"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-150 hover:opacity-90"
          style={{ background: "var(--evven-accent-primary)" }}
        >
          <Plus size={15} />
          Log expense
        </Link>
      </div>

      {/* User */}
      <div
        className="flex items-center gap-3 px-3 py-3 rounded-xl"
        style={{ background: "var(--evven-surface)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{ background: "var(--evven-accent-secondary)", color: "var(--evven-accent-primary)" }}
        >
          {user?.name ? getInitials(user.name) : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
            {user?.name ?? ""}
          </p>
          <p className="text-[10px] truncate" style={{ color: "var(--evven-text-muted)" }}>
            {user?.email ?? ""}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--evven-border)]"
          title="Log out"
        >
          <LogOut size={14} style={{ color: "var(--evven-text-muted)" }} />
        </button>
      </div>
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 flex-shrink-0 border-r"
        style={{
          background: "var(--evven-background)",
          borderColor: "var(--evven-border)",
        }}
      >
        <Sidebar
          pathname={pathname}
          user={user}
          onNavigate={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{
              background: "var(--evven-background)",
              borderRight: "1px solid var(--evven-border)",
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ background: "var(--evven-surface)" }}
            >
              <X size={16} />
            </button>
            <Sidebar
              mobile
              pathname={pathname}
              user={user}
              onNavigate={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{
            background: "var(--evven-background)",
            borderColor: "var(--evven-border)",
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg"
            style={{ background: "var(--evven-surface)" }}
          >
            <Menu size={18} />
          </button>
          <Link href="/">
            <Image src="/EvenUp-black.svg" alt="Evven" width={24} height={24} />
          </Link>
          <Link
            href="/expenses/new"
            className="p-1.5 rounded-lg text-white"
            style={{ background: "var(--evven-accent-primary)" }}
          >
            <Plus size={18} />
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
