import type { ReactNode } from "react";

export function AuthSimpleCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[420px] p-4">
      <div className="card rounded-3xl bg-card/60 p-8 shadow-xl backdrop-blur-xl">{children}</div>
    </div>
  );
}
