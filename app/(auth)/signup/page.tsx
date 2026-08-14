"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useAuthStore } from "@/store/auth-store";
import { sendOtp, verifySignupOtp } from "@/services/auth";
import { getApiErrorMessage } from "@/lib/api-error";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignupEmailStep } from "@/components/auth/SignupEmailStep";
import { SignupOtpStep } from "@/components/auth/SignupOtpStep";
import { SignupProfileStep } from "@/components/auth/SignupProfileStep";
import { getPasswordStrength } from "@/components/auth/password-strength";

type SignupStep = "email" | "otp" | "profile";

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
      setMessage({ error: getApiErrorMessage(err, "We couldn’t send the code right now.") });
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
      setMessage({ error: getApiErrorMessage(err, "We couldn’t verify that code.") });
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
      setMessage({ error: getApiErrorMessage(err, "We couldn’t finish creating your account.") });
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
      setMessage({ error: getApiErrorMessage(err, "We couldn’t resend the code right now.") });
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        eyebrow="Sign up"
        title="Create an account."
        subtitle="Start with your email, verify the code, then choose your name and password."
      />

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
          <SignupEmailStep
            email={email}
            onEmailChange={setEmail}
            isSendingOtp={isSendingOtp}
            onSubmit={handleEmailSubmit}
          />
        ) : null}

        {step === "otp" ? (
          <SignupOtpStep
            email={normalizedEmail}
            otp={otp}
            onOtpChange={setOtp}
            isSendingOtp={isSendingOtp}
            isVerifyingOtp={isVerifyingOtp}
            onChangeEmail={() => {
              setStep("email");
              setMessage({});
            }}
            onResend={handleResend}
            onSubmit={handleOtpSubmit}
          />
        ) : null}

        {step === "profile" ? (
          <SignupProfileStep
            email={normalizedEmail}
            name={name}
            onNameChange={setName}
            password={password}
            onPasswordChange={setPassword}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((v) => !v)}
            passwordStrength={passwordStrength}
            isCreatingAccount={isCreatingAccount}
            onBack={() => {
              setStep("otp");
              setMessage({});
            }}
            onSubmit={handleCompleteSignup}
          />
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
    </AuthCard>
  );
}
