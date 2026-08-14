import type { CSSProperties } from "react";

export function surfaceCard(extra?: CSSProperties): CSSProperties {
  return {
    background: "var(--evven-card-background)",
    border: "0.5px solid var(--evven-border)",
    ...extra,
  };
}
