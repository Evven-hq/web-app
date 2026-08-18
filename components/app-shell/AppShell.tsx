"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { RouteProgressBar } from "@/components/shared/RouteProgressbar";
import { PageTransition } from "@/components/shared/PageTransition";
import { useConnectivity } from "@/hooks/use-connectivity";
import { DesktopIdentityChip } from "./DesktopIdentityChip";
import { DesktopLogoutButton } from "./DesktopLogoutButton";
import { Dock } from "./Dock";
import { MobileFloatingChrome } from "./MobileFloatingChrome";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const { isOnline } = useConnectivity();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  // any authenticated user without a profile_picture — not
  // just brand-new signups — gets routed through the same required avatar
  // step before they can see the dashboard.
  useEffect(() => {
    if (isInitialized && isAuthenticated && user && !user.profile_picture) {
      router.replace("/avatar-setup");
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (!isInitialized || !isAuthenticated || (user && !user.profile_picture)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div
          className="size-5 animate-spin rounded-full border-2 border-r-transparent"
          style={{
            borderColor: "var(--evven-accent-primary)",
            borderRightColor: "transparent",
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <RouteProgressBar />
      <div className="app-modal-blur-target flex min-w-0 flex-1 flex-col overflow-hidden">
        <OfflineBanner isOnline={isOnline} />
        <MobileFloatingChrome
          user={user}
          showAddExpense={pathname === "/dashboard"}
        />
        <DesktopIdentityChip user={user} />

        <main
          id="app-scroll-container"
          className="flex-1 overflow-y-auto pb-24 pt-16 md:pb-32 md:pt-24"
        >
          <PageTransition>{children}</PageTransition>
        </main>

        <Dock pathname={pathname} variant="mobile" isOnline={isOnline} />
        <Dock pathname={pathname} variant="desktop" isOnline={isOnline} />
        <DesktopLogoutButton onLogout={handleLogout} />
      </div>
    </div>
  );
}
