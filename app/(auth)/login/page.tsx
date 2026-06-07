"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuthStore } from "@/store/auth-store";
import { CharacterAnimation } from "@/components/characters/CharacterAnimation";

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Focus state – drives the animation ────────────────────────────────────
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── Left – animation panel ─────────────────────────────────────────── */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 text-primary-foreground">
        {/* Brand */}
        <div className="relative z-20 flex items-center gap-2 text-lg font-semibold">
          
            <Image src="/EvenUp-black.svg" alt="YourBrand" width={70} height={70} />
          
        </div>

        {/* Characters */}
        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <CharacterAnimation
            isEmailFocused={isEmailFocused}
            isPasswordFocused={isPasswordFocused}
            password={password}
            showPassword={showPassword}
          />
        </div>

        {/* Footer links */}
        <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/60">
          {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-primary-foreground transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* ── Right – form panel ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image src="/EvenUp-white.svg" alt="YourBrand" width={32} height={32} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
            <p className="text-muted-foreground text-sm">Enter stuff and lets get to business!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                required
                className="h-12 bg-background border-border/60 focus:border-primary"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  className="h-12 pr-10 bg-background border-border/60 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember for 30 days
                </Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div> */}

            {/* Error */}
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Log in"}
            </Button>
          </form>

          {/* Google */}
          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full h-12 bg-background border-border/60 hover:bg-accent"
              type="button"
            >
              <Mail className="mr-2 size-5" />
              Log in with Google
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-foreground font-medium hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}