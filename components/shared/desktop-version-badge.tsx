"use client";

import { useEffect, useState } from "react";
import { isDesktop } from "@/lib/desktop";

export default function DesktopVersionBadge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(isDesktop());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-3 right-3 z-50 select-none rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.35em] text-muted-foreground shadow-sm backdrop-blur"
    >
      v1.0.0
    </div>
  );
}
