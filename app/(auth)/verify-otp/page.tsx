"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

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
      setError(
        isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "We couldn't verify that code."
      );
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
      setError(
        isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "We couldn't resend the code right now."
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="relative isolate w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500 lg:max-w-[400px] rounded-[2rem] overflow-hidden bg-(--evven-card-background) border border-border/60 shadow-[0_16px_50px_rgba(0,0,0,0.10)] sm:shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:backdrop-blur-2xl">
      <div className="hidden -inset-6 -z-10 rounded-4xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-60 blur-2xl md:absolute md:block" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.10)] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

        <div className="mb-7 text-center sm:mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Verify email
          </p>
          <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight sm:text-[2.6rem]">
            Check your inbox.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Enter the 6-digit code we sent to finish setting up your account.
          </p>
        </div>

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

          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium">
              Verification code
            </Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              maxLength={6}
              className="h-12 rounded-2xl border-border/60 bg-background/55 tracking-[0.35em] text-center text-base font-semibold transition-all duration-200 focus:border-primary focus:bg-background"
            />
          </div>

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
      </div>
    </div>
  );
}
