"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { resetPassword } from "@/services/auth";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError("This reset link is missing its token.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await resetPassword(token, password);
      setComplete(true);
    } catch {
      setError("This reset link is invalid or expired.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] p-4">
      <div className="rounded-3xl border border-border/40 bg-card/60 p-8 shadow-xl backdrop-blur-xl">
        {complete ? (
          <div className="text-center">
            <CheckCircle size={28} className="mx-auto mb-4 text-primary" />
            <h1 className="mb-2 text-2xl font-bold">Password updated</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
            <Link href="/login" className="text-sm font-semibold text-primary">
              Go to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-2xl font-bold">Set a new password</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Choose a password you have not used before.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="New password"
                className="h-12 w-full rounded-xl border bg-background/50 px-4 text-sm"
                required
              />
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                placeholder="Confirm password"
                className="h-12 w-full rounded-xl border bg-background/50 px-4 text-sm"
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[420px] p-4">
          <div className="rounded-3xl border border-border/40 bg-card/60 p-8 shadow-xl backdrop-blur-xl">
            <div className="mx-auto size-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
