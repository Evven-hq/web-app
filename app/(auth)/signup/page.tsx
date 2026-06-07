"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuthStore } from "@/store/auth-store";
import { CharacterAnimation } from "@/components/characters/CharacterAnimation";

export default function Register() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);

  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);

  const [isNameFocused, setIsNameFocused]         = useState(false);
  const [isEmailFocused, setIsEmailFocused]       = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signup(name, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex lg:grid lg:grid-cols-2">

      {/* ── Left – form panel ──────────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-center p-4 lg:p-8 bg-background relative">
        <div className="w-full max-w-[420px] lg:max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="absolute -inset-4 lg:-inset-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-4xl blur-2xl -z-10 opacity-60" />

          <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl p-8 shadow-xl ring-1 ring-white/10">

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
              <p className="text-muted-foreground text-sm">Join us and get started today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  required
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:bg-background transition-all duration-200"
                />
              </div>

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
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:bg-background transition-all duration-200"
                />
              </div>

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
                    className="h-12 pr-10 bg-background/50 border-border/60 focus:border-primary focus:bg-background transition-all duration-200"
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

              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block size-4 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin" />
                    Creating account…
                  </span>
                ) : "Sign up"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/60 px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 bg-background/50 border-border/60 hover:bg-background hover:border-primary/40 transition-all duration-200"
              type="button"
            >
              <Mail className="mr-2 size-5" />
              Google <span className="text-xs text-muted-foreground">(it does nothing now)</span>
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right – animation panel ────────────────────────────────────────── */}
      <div className="hidden lg:flex relative flex-col justify-between bg-background from-primary/90 via-primary to-primary/80 p-12 text-primary-foreground overflow-hidden">
        {/* Characters */}
        <div className="flex-1 flex items-center justify-center">
          <CharacterAnimation
            isEmailFocused={isEmailFocused || isNameFocused}
            isPasswordFocused={isPasswordFocused}
            password={password}
            showPassword={showPassword}
          />
        </div>

        {/* Footer links */}
        <div className="relative z-20 flex items-center justify-end gap-8 text-sm text-primary/50">
          {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-primary transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}