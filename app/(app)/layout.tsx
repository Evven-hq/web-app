"use client";

import { NavigationProvider } from "@/components/shared/NavigationProvider";
import { AppShell } from "@/components/app-shell/AppShell";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <ErrorBoundary>
        <AppShell>{children}</AppShell>
      </ErrorBoundary>
    </NavigationProvider>
  );
}
