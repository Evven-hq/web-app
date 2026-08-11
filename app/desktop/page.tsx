"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { AlertCircle, ShieldAlert, WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DesktopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [isOnline, setIsOnline] = useState(true);

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
    const updateOnlineState = () => setIsOnline(window.navigator.onLine);

    updateOnlineState();
    window.addEventListener("online", updateOnlineState);
    window.addEventListener("offline", updateOnlineState);

    return () => {
      window.removeEventListener("online", updateOnlineState);
      window.removeEventListener("offline", updateOnlineState);
    };
  }, []);

  useEffect(() => {
    if (loading || !isOnline) return;

    if (isAuthenticated && user) {
      router.replace("/dashboard");
      return;
    }

    router.replace(
      reason ? `/login?reason=${encodeURIComponent(reason)}` : "/login"
    );
  }, [
    loading,
    isAuthenticated,
    user,
    reason,
    router,
    isOnline,
  ]);

  const expiredSession = reason === "session-expired";

  if (!isOnline) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="card w-full max-w-md rounded-3xl bg-card/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <WifiOff className="size-6" />
          </div>

          <h1 className="mb-2 text-2xl font-semibold">You’re offline</h1>

          <p className="mb-6 text-sm text-muted-foreground">
            Evven needs an internet connection to open your workspace on desktop. Reconnect to continue.
          </p>

          <Button
            className="w-full rounded-xl"
            onClick={() => setIsOnline(window.navigator.onLine)}
          >
            Check again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="card w-full max-w-md rounded-3xl bg-card/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {expiredSession ? <ShieldAlert className="size-6" /> : <AlertCircle className="size-6" />}
        </div>

        <h1 className="mb-2 text-2xl font-semibold">
          {expiredSession ? "Session needs to be refreshed" : "Launching Evven"}
        </h1>

        <p className="mb-6 text-sm text-muted-foreground">
          {expiredSession
            ? "Your desktop session expired or the token could not be found. We’ll take you back to sign in so you can continue safely."
            : "We’re checking your desktop session and opening your workspace."}
        </p>

        {expiredSession ? (
          <Button asChild className="w-full rounded-xl">
            <Link href="/login">Go to login</Link>
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-block size-3 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            Please wait...
          </div>
        )}
      </div>
    </div>
  );
}
