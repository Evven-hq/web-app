/**
 * app/(auth)/layout.tsx
 * Server component — no "use client" here.
 * Wraps children in the slide shell and renders a fixed logo
 * in the top-left corner across both login and signup pages.
 */

import Image from "next/image";
import { AuthSlideShell } from "@/components/auth/AuthSlideShell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSlideShell>
      {/* Fixed logo — always top-left, both pages, inverts on light bg */}
      <div className="fixed top-6 left-8 z-50">
        <Image
          src="/EvenUp-white.svg"
          alt="EvenUp"
          width={70}
          height={70}
          className="invert"
          priority
        />
      </div>

      {children}
    </AuthSlideShell>
  );
}