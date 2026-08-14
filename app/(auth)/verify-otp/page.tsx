"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useAuthStore } from "@/store/auth-store";
import { getApiErrorMessage } from "@/lib/api-error";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const nextEmail = searchParams.get("email");
    if (nextEmail) {
      setEmail(nextEmail);
    }
  }, [searchParams]);

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "signup") {
      setNotice("We sent a verification code to your inbox.");
    } else if (reason === "unverified") {
      setNotice("This account still needs to be verified. Enter the code we sent.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const currentUser = await verifyOtp(email.trim(), otp.trim());
      if (currentUser.profile_picture) {
        router.replace("/dashboard");
      } else {
        router.replace("/avatar-setup");
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "We couldn't verify that code."));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    setIsResending(true);

    try {
      await resendOtp(email.trim());
      setNotice("A fresh verification code was sent.");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "We couldn't resend the code right now."));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthCard>
      <AuthHeader
        eyebrow="Verify email"
        title="Check your inbox."
        subtitle="Enter the 6-digit code we sent to finish setting up your account."
      />

      {notice && (
        <div className="mb-4 rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-3 text-sm leading-6 text-emerald-300 animate-in fade-in duration-200">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            autoComplete="email"
            readOnly
            required
            className="h-12 rounded-2xl border-border/60 bg-muted/40 text-muted-foreground transition-all duration-200 focus:border-primary focus:bg-muted/40"
          />
        </div>

        <OtpInput value={otp} onChange={setOtp} />

        {error && (
          <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-3 text-sm leading-6 text-red-300 animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="h-12 w-full rounded-2xl text-base font-medium shadow-lg shadow-primary/10 transition-transform duration-200 active:scale-[0.99]"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
              Verifying…
            </span>
          ) : (
            "Verify email"
          )}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || !email.trim()}
          className="font-semibold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? "Resending…" : "Resend code"}
        </button>

        <div className="text-muted-foreground">
          Wrong account?{" "}
          <Link href="/signup" className="font-semibold text-primary transition-colors hover:text-primary/80">
            Start over
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
