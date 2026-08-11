"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { sendOtp, verifySignupOtp } from "@/services/auth";

type SignupStep = "email" | "otp" | "profile";

type PasswordStrength = {
  label: string;
  helper: string;
  score: number;
  color: string;
};

const panelMotion = {
  initial: { opacity: 0, y: 12, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(10px)" },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
};

const passwordMotion = {
  initial: { opacity: 0, y: 8, filter: "blur(10px)", scale: 0.985 },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, y: -6, filter: "blur(10px)", scale: 0.985 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      label: "Start typing",
      helper: "Use 8-16 characters with a mix of letters, numbers, and symbols.",
      score: 0,
      color: "var(--evven-text-muted)",
    };
  }

  if (password.length < 8) {
    return {
      label: "Too short",
      helper: `You need ${8 - password.length} more character${8 - password.length === 1 ? "" : "s"} to reach the minimum.`,
      score: 1,
      color: "var(--evven-error)",
    };
  }

  if (password.length > 16) {
    return {
      label: "Too long",
      helper: "Keep it to 16 characters or fewer.",
      score: 1,
      color: "var(--evven-error)",
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (variety <= 1) {
    return {
      label: "Weak",
      helper: "Add a mix of uppercase, lowercase, numbers, and symbols.",
      score: 1,
      color: "var(--evven-error)",
    };
  }

  if (variety === 2) {
    return {
      label: "Fair",
      helper: "A little more variety will make this stronger.",
      score: 2,
      color: "#c08a18",
    };
  }

  if (variety === 3) {
    return {
      label: "Good",
      helper: "This has a solid mix of length and character variety.",
      score: 3,
      color: "var(--evven-accent-primary)",
    };
  }

  return {
    label: "Strong",
    helper: "Great balance. This is a strong password.",
    score: 4,
    color: "var(--evven-accent-primary)",
  };
}

export default function Register() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);

  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [signupToken, setSignupToken] = useState("");

  const normalizedEmail = email.trim().toLowerCase();
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const setMessage = (next: { error?: string; notice?: string }) => {
    setError(next.error ?? "");
    setNotice(next.notice ?? "");
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({});

    if (!normalizedEmail) {
      setMessage({ error: "Enter your email address." });
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await sendOtp(normalizedEmail, "signup");
      setChallengeToken(response.challenge_token ?? "");
      setOtp("");
      setStep("otp");
      setMessage({ notice: `We sent a 6-digit code to ${normalizedEmail}.` });
    } catch (err: unknown) {
      setMessage({
        error: isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "We couldn’t send the code right now.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({});

    if (!challengeToken) {
      setMessage({ error: "Request a new code first." });
      setStep("email");
      return;
    }

    if (otp.trim().length !== 6) {
      setMessage({ error: "Enter the 6-digit verification code." });
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const response = await verifySignupOtp(normalizedEmail, otp.trim(), challengeToken);
      setSignupToken(response.signup_token ?? "");
      setStep("profile");
      setMessage({ notice: "Email verified. Finish creating your account." });
    } catch (err: unknown) {
      setMessage({
        error: isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "We couldn’t verify that code.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCompleteSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({});

    const nextName = name.trim();
    const nextPassword = password;

    if (!nextName) {
      setMessage({ error: "Enter your name." });
      return;
    }

    if (!signupToken) {
      setMessage({ error: "Verify your email first." });
      setStep("otp");
      return;
    }

    if (nextPassword.length < 8 || nextPassword.length > 16) {
      setMessage({ error: "Password must be between 8 and 16 characters." });
      return;
    }

    setIsCreatingAccount(true);

    try {
      const createdUser = await signup(nextName, normalizedEmail, nextPassword, signupToken);
      router.replace(createdUser.profile_picture ? "/dashboard" : "/avatar-setup");
    } catch (err: unknown) {
      setMessage({
        error: isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "We couldn’t finish creating your account.",
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleResend = async () => {
    if (!normalizedEmail) return;

    setMessage({});
    setIsSendingOtp(true);

    try {
      const response = await sendOtp(normalizedEmail, "signup");
      setChallengeToken(response.challenge_token ?? "");
      setMessage({ notice: `A fresh code was sent to ${normalizedEmail}.` });
    } catch (err: unknown) {
      setMessage({
        error: isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "We couldn’t resend the code right now.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="relative isolate w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500 lg:max-w-[400px] rounded-[2rem] overflow-hidden bg-(--evven-card-background) border border-border/60 shadow-[0_16px_50px_rgba(0,0,0,0.10)] sm:shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:backdrop-blur-2xl">
      <div className="hidden -inset-6 -z-10 rounded-4xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-60 blur-2xl md:absolute md:block" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.10)] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

        <div className="mb-7 text-center sm:mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Sign up
          </p>
          <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight sm:text-[2.6rem]">
            Create an account.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Start with your email, verify the code, then choose your name and password.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-900/30 bg-red-950/20 p-3 text-sm leading-6 text-red-300 animate-in fade-in duration-200">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="mb-4 rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-3 text-sm leading-6 text-emerald-300 animate-in fade-in duration-200">
            {notice}
          </div>
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
          {step === "email" ? (
            <motion.div key="email" {...panelMotion}>
              <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5">
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
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="h-12 rounded-2xl border-border/60 bg-background/55 transition-all duration-200 focus:border-primary focus:bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-2xl text-base font-medium shadow-lg shadow-primary/10 transition-transform duration-200 active:scale-[0.99]"
                  size="lg"
                  disabled={isSendingOtp || !normalizedEmail}
                >
                  {isSendingOtp ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Sending code...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            </motion.div>
          ) : null}

          {step === "otp" ? (
            <motion.div key="otp" {...panelMotion}>
              <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-5">
                <div className="rounded-2xl border px-4 py-3 text-sm" style={{ background: "var(--evven-background)", borderColor: "var(--evven-border)" }}>
                  <p className="font-medium text-[var(--evven-text-primary)]">Code sent</p>
                  <p className="mt-1 text-muted-foreground">{normalizedEmail}</p>
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
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="h-12 rounded-2xl border-border/60 bg-background/55 tracking-[0.35em] text-center text-base font-semibold transition-all duration-200 focus:border-primary focus:bg-background"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-2xl"
                    onClick={() => {
                      setStep("email");
                      setMessage({});
                    }}
                  >
                    <ArrowLeft className="size-4" />
                    Change email
                  </Button>

                  <Button
                    type="submit"
                    className="h-12 flex-1 rounded-2xl text-base font-medium shadow-lg shadow-primary/10 transition-transform duration-200 active:scale-[0.99]"
                    size="lg"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      "Verify code"
                    )}
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isSendingOtp || !normalizedEmail}
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSendingOtp ? "Resending..." : "Resend code"}
                </button>
              </form>
            </motion.div>
          ) : null}

          {step === "profile" ? (
            <motion.div key="profile" {...panelMotion}>
              <form onSubmit={handleCompleteSignup} className="space-y-4 sm:space-y-5">
                <div className="rounded-2xl border px-4 py-3 text-sm" style={{ background: "var(--evven-background)", borderColor: "var(--evven-border)" }}>
                  <p className="font-medium text-[var(--evven-text-primary)]">Verified email</p>
                  <p className="mt-1 text-muted-foreground">{normalizedEmail}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    autoComplete="name"
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="h-12 rounded-2xl border-border/60 bg-background/55 transition-all duration-200 focus:border-primary focus:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>

                  <AnimatePresence mode="wait" initial={false}>
                    {showPassword ? (
                      <motion.div key="password-visible" {...passwordMotion} className="relative">
                        <Input
                          id="password"
                          type="text"
                          placeholder="8-16 characters"
                          value={password}
                          onChange={(event) => setPassword(event.target.value.slice(0, 16))}
                          required
                          minLength={8}
                          maxLength={16}
                          autoComplete="new-password"
                          className="h-12 rounded-2xl border-border/60 bg-background/55 pr-10 transition-all duration-200 focus:border-primary focus:bg-background"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(false)}
                          aria-label="Hide password"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <EyeOff className="size-5" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="password-hidden" {...passwordMotion} className="relative">
                        <Input
                          id="password"
                          type="password"
                          placeholder="8-16 characters"
                          value={password}
                          onChange={(event) => setPassword(event.target.value.slice(0, 16))}
                          required
                          minLength={8}
                          maxLength={16}
                          autoComplete="new-password"
                          className="h-12 rounded-2xl border-border/60 bg-background/55 pr-10 transition-all duration-200 focus:border-primary focus:bg-background"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(true)}
                          aria-label="Show password"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Eye className="size-5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2 rounded-2xl border px-4 py-3" style={{ background: "var(--evven-background)", borderColor: "var(--evven-border)" }}>
                    <div className="flex items-center justify-between gap-3 text-xs font-medium">
                      <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                      <span className="text-muted-foreground">{password.length}/16</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <span
                          key={index}
                          className="h-1.5 rounded-full transition-colors"
                          style={{
                            background:
                              index < passwordStrength.score
                                ? passwordStrength.color
                                : "color-mix(in srgb, var(--evven-border) 70%, transparent)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">{passwordStrength.helper}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-2xl"
                    onClick={() => {
                      setStep("otp");
                      setMessage({});
                    }}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="h-12 flex-1 rounded-2xl text-base font-medium shadow-lg shadow-primary/10 transition-transform duration-200 active:scale-[0.99]"
                    size="lg"
                    disabled={isCreatingAccount}
                  >
                    {isCreatingAccount ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className="card px-4 text-muted-foreground border-none shadow-none"
              style={{ border: "none", boxShadow: "none" }}
            >
              Or continue with
            </span>
          </div>
        </div>

        {step === "email" ? <GoogleSignInButton /> : null}

        <div className="mt-7 text-center text-sm text-muted-foreground sm:mt-8">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
