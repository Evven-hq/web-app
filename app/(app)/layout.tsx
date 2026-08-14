"use client";

import { NavigationProvider } from "@/components/shared/NavigationProvider";
import { AppShell } from "@/components/app-shell/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <AppShell>{children}</AppShell>
    </NavigationProvider>
  );
}
