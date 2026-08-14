"use client";

import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { panelMotion } from "./auth-motion";

export function SignupEmailStep({
  email,
  onEmailChange,
  isSendingOtp,
  onSubmit,
}: {
  email: string;
  onEmailChange: (value: string) => void;
  isSendingOtp: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    <motion.div key="email" {...panelMotion}>
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
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
            onChange={(event) => onEmailChange(event.target.value)}
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
  );
}
