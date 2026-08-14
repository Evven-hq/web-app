import type { ReactNode } from "react";

const defaultOuterClassName =
  "relative isolate w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500 lg:max-w-[400px] rounded-[2rem] overflow-hidden bg-(--evven-card-background) border border-border/60 shadow-[0_16px_50px_rgba(0,0,0,0.10)] sm:shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:backdrop-blur-2xl";

const defaultInnerClassName =
  "relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.10)] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:backdrop-blur-2xl";

export function AuthCard({
  children,
  outerClassName = defaultOuterClassName,
  innerClassName = defaultInnerClassName,
}: {
  children: ReactNode;
  outerClassName?: string;
  innerClassName?: string;
}) {
  return (
    <div className={outerClassName}>
      <div className="hidden -inset-6 -z-10 rounded-4xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-60 blur-2xl md:absolute md:block" />
      <div className={innerClassName}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        {children}
      </div>
    </div>
  );
}
