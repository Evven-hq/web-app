"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { useAuthStore } from "@/store/auth-store";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const reason = searchParams.get("reason");
  const isSessionExpired = reason === "session-expired";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative isolate w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500 lg:max-w-[400px]">
      <div className="hidden -inset-6 -z-10 rounded-4xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-60 blur-2xl md:absolute md:block" />

      <div className="card relative overflow-hidden rounded-[1.75rem] border border-border/60 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.10)] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

        <div className="mb-7 text-center sm:mb-8">
          {isSessionExpired && (
            <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-sm leading-6 text-amber-200">
              Your desktop session expired or the token was unavailable. Log in again to keep Evven open.
            </div>
          )}
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Log in
          </p>
          <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight sm:text-[2.6rem]">
            Welcome back.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            {isSessionExpired
              ? "We saved your place. Just log in again to continue."
              : "Enter your credentials to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-2xl border-border/60 bg-background/55 transition-all duration-200 focus:border-primary focus:bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-2xl border-border/60 bg-background/55 pr-10 transition-all duration-200 focus:border-primary focus:bg-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
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
                Signing in…
              </span>
            ) : (
              "Log in"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className="inline-flex px-4 text-muted-foreground bg-(--evven-card-background)"
              style={{ border: "none", boxShadow: "none" }}
            >
              Or continue with
            </span>
          </div>
        </div>

        <GoogleSignInButton />

        <div className="mt-7 text-center text-sm text-muted-foreground sm:mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary transition-colors hover:text-primary/80">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="size-5 animate-spin rounded-full border-2 border-r-transparent" style={{ borderColor: "var(--evven-accent-primary)", borderRightColor: "transparent" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
