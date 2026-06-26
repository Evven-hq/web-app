"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function DesktopPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const user = useAuthStore(
    (state) => state.user
  );

  const loading = useAuthStore(
    (state) => state.isLoading
  );

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && user) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/login");
  }, [
    loading,
    isAuthenticated,
    user,
    router,
  ]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">
        Launching Evven...
      </p>
    </div>
  );
}