"use client";

import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { panelMotion } from "./auth-motion";
import { OtpInput } from "./OtpInput";

export function SignupOtpStep({
  email,
  otp,
  onOtpChange,
  isSendingOtp,
  isVerifyingOtp,
  onChangeEmail,
  onResend,
  onSubmit,
}: {
  email: string;
  otp: string;
  onOtpChange: (value: string) => void;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  onChangeEmail: () => void;
  onResend: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <motion.div key="otp" {...panelMotion}>
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{ background: "var(--evven-background)", borderColor: "var(--evven-border)" }}
        >
          <p className="font-medium text-[var(--evven-text-primary)]">Code sent</p>
          <p className="mt-1 text-muted-foreground">{email}</p>
        </div>

        <OtpInput value={otp} onChange={onOtpChange} />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-2xl"
            onClick={onChangeEmail}
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
          onClick={onResend}
          disabled={isSendingOtp || !email}
          className="text-sm font-semibold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSendingOtp ? "Resending..." : "Resend code"}
        </button>
      </form>
    </motion.div>
  );
}
