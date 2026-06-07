/**
 * app/(auth)/layout.tsx
 * Server component — no "use client" here.
 * Just wraps children in the slide shell.
 */

import { AuthSlideShell } from "@/components/auth/AuthSlideShell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthSlideShell>{children}</AuthSlideShell>;
}