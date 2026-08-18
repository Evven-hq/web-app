"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { updateCurrentUser } from "@/services/users";
import { AvatarPicker } from "@/components/onboarding/AvatarPicker";

export default function AvatarSetupPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  // Already has an avatar and landed here directly (e.g. back button) —
  // no need to force the step again.
  useEffect(() => {
    if (isInitialized && isAuthenticated && user?.profile_picture) {
      router.replace("/dashboard");
    }
  }, [isInitialized, isAuthenticated, user, router]);

  async function handleConfirm(avatarUrl: string) {
    setError("");
    setSaving(true);
    try {
      const updatedUser = await updateCurrentUser({
        profile_picture: avatarUrl,
      });
      setUser(updatedUser);
      router.replace("/dashboard");
    } catch {
      setError("Could not save your avatar. Please try again.");
      setSaving(false);
    }
  }

  if (!isInitialized || !isAuthenticated || !user || user.profile_picture) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-background">
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
    <div className="flex min-h-[100svh] items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="card rounded-[2rem] bg-card/70 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-xl sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Pick your avatar
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose one to finish setting up your profile. Shuffle for more
              options.
            </p>
          </div>

          <AvatarPicker
            initialSeed={user.name}
            confirmLabel="Use this avatar"
            isSaving={saving}
            onConfirm={handleConfirm}
          />

          {error && (
            <div className="mt-4 rounded-lg border border-red-900/30 bg-red-950/20 p-3 text-sm text-red-400 animate-in fade-in duration-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
