"use client";

import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { panelMotion } from "./auth-motion";
import { PasswordField } from "./PasswordField";
import type { PasswordStrength } from "./password-strength";

export function SignupProfileStep({
  email,
  name,
  onNameChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  passwordStrength,
  isCreatingAccount,
  onBack,
  onSubmit,
}: {
  email: string;
  name: string;
  onNameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  passwordStrength: PasswordStrength;
  isCreatingAccount: boolean;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <motion.div key="profile" {...panelMotion}>
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{ background: "var(--evven-background)", borderColor: "var(--evven-border)" }}
        >
          <p className="font-medium text-[var(--evven-text-primary)]">Verified email</p>
          <p className="mt-1 text-muted-foreground">{email}</p>
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
            onChange={(event) => onNameChange(event.target.value)}
            required
            className="h-12 rounded-2xl border-border/60 bg-background/55 transition-all duration-200 focus:border-primary focus:bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>

          <PasswordField
            value={password}
            onChange={onPasswordChange}
            showPassword={showPassword}
            onToggleShow={onToggleShowPassword}
            placeholder="8-16 characters"
            autoComplete="new-password"
            minLength={8}
            maxLength={16}
            animated
          />

          <div
            className="space-y-2 rounded-2xl border px-4 py-3"
            style={{ background: "var(--evven-background)", borderColor: "var(--evven-border)" }}
          >
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
            onClick={onBack}
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
  );
}
