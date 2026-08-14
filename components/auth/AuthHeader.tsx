import type { ReactNode } from "react";

export function AuthHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-7 text-center sm:mb-8">
      {children}
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight sm:text-[2.6rem]">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
