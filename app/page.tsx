"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className="size-5 animate-spin rounded-full border-2 border-r-transparent"
        style={{
          borderColor: "var(--evven-accent-primary)",
          borderRightColor: "transparent",
        }}
      />
    </div>
  );
}
