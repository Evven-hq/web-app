"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ExpenseListSkeleton({ rows = 4 }: { rows?: number }) {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          className="card flex items-center gap-3 rounded-(--evven-radius-card) px-4 py-3.5"
          animate={reduce ? { opacity: 0.6 } : { opacity: [0.45, 1, 0.45] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ background: "var(--evven-card-background)" }}
        >
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "var(--evven-surface)" }}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div
              className="h-3.5 w-1/2 rounded-full"
              style={{ background: "var(--evven-surface)" }}
            />
            <div
              className="h-2.5 w-1/3 rounded-full"
              style={{ background: "var(--evven-surface)" }}
            />
          </div>
          <div
            className="h-3.5 w-14 rounded-full"
            style={{ background: "var(--evven-surface)" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
