"use client";

import Image from "next/image";

export function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: "var(--evven-background)" }}
    >
      <div className="flex w-full max-w-xs flex-col items-center text-center">
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{
            background: "white",
            borderColor: "var(--evven-border)",
            boxShadow: "0 16px 40px rgba(26, 24, 22, 0.08)",
          }}
        >
          <Image src="/EvenUp-black.svg" alt="Evven" width={30} height={30} priority />
        </div>

        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--evven-text-muted)" }}
        >
          Evven
        </p>
        <h1 className="mt-2 text-lg font-semibold" style={{ color: "var(--evven-text-primary)" }}>
          Preparing your workspace
        </h1>

        <div className="mt-6 flex h-1.5 w-44 overflow-hidden rounded-full" style={{ background: "var(--evven-surface)" }}>
          <div
            className="h-full w-1/2 animate-[evven-load_1.35s_ease-in-out_infinite] rounded-full"
            style={{ background: "var(--evven-accent-primary)" }}
          />
        </div>

        <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{
                animationDelay: `${index * 160}ms`,
                background: "var(--evven-text-muted)",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes evven-load {
          0% {
            transform: translateX(-110%);
          }
          50% {
            transform: translateX(55%);
          }
          100% {
            transform: translateX(230%);
          }
        }
      `}</style>
    </div>
  );
}
