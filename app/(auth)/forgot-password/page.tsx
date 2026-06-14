"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { requestPasswordReset } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch {
      setError("Could not send a reset email. Check the address and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] p-4">
      <div className="rounded-3xl border border-border/40 bg-card/60 p-8 shadow-xl backdrop-blur-xl">
        {sent ? (
          <div className="text-center">
            <MailCheck size={28} className="mx-auto mb-4 text-primary" />
            <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              We sent password reset instructions to {email}.
            </p>
            <Link href="/login" className="text-sm font-semibold text-primary">
              Return to login
            </Link>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
            <h1 className="mb-2 text-2xl font-bold">Forgot password?</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Enter your email and we will send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
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
                {saving ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
