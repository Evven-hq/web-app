"use client";

import { motion, useReducedMotion } from "framer-motion";

const COLORS = [
  { bg: "var(--evven-avatar-1-bg)", text: "var(--evven-avatar-1-text)" },
  { bg: "var(--evven-avatar-2-bg)", text: "var(--evven-avatar-2-text)" },
  { bg: "var(--evven-avatar-3-bg)", text: "var(--evven-avatar-3-text)" },
  { bg: "var(--evven-avatar-4-bg)", text: "var(--evven-avatar-4-text)" },
];

function Pulse({
  className,
  style,
  delay = 0,
}: {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ background: "var(--evven-surface)", ...style }}
      animate={reduce ? { opacity: 0.5 } : { opacity: [0.4, 0.75, 0.4] }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay }
      }
    />
  );
}

export function GroupDetailSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="h-full overflow-hidden"
      style={{ background: "var(--evven-background)" }}
    >
      <div className="mx-auto flex h-full max-w-2xl flex-col px-4 py-6">
        {/* GroupHeader skeleton */}
        <div className="mb-6 shrink-0">
          <Pulse className="mb-4 h-3 w-16 rounded-full" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Pulse className="mb-2 h-7 w-2/5 rounded-xl" />
              <Pulse className="mb-3 h-2.5 w-1/3 rounded-full" delay={0.05} />

              {/* Avatar group */}
              <div className="flex items-center gap-0">
                {COLORS.map((c, i) => (
                  <div
                    key={i}
                    className="size-8 rounded-full border-2"
                    style={{
                      background: c.bg,
                      borderColor: "var(--evven-background)",
                      marginLeft: i > 0 ? -8 : 0,
                    }}
                  />
                ))}
                <div
                  className="flex size-8 items-center justify-center rounded-full text-[10px] font-semibold"
                  style={{
                    background: "var(--evven-surface)",
                    color: "var(--evven-text-muted)",
                    marginLeft: -8,
                  }}
                >
                  +1
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
              <Pulse className="h-9 w-16 rounded-xl" delay={0.1} />
              <Pulse
                className="h-9 w-24 rounded-xl"
                style={{
                  background: "var(--evven-accent-primary)",
                  opacity: 0.4,
                }}
                delay={0.15}
              />
            </div>
          </div>
        </div>

        {/* BalanceSummary skeleton */}
        <div
          className="mb-5 rounded-2xl px-3.5 py-3"
          style={{
            background: "var(--evven-surface)",
            border: "1px solid var(--evven-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="size-1.5 rounded-full"
              style={{ background: "var(--evven-accent-primary)" }}
            />
            <Pulse className="h-2 w-20 rounded-full" delay={0.05} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Pulse className="h-3 w-24 rounded-full" delay={0.1} />
              <Pulse className="h-3 w-16 rounded-full" delay={0.15} />
            </div>
            <div className="flex items-center justify-between">
              <Pulse className="h-3 w-20 rounded-full" delay={0.1} />
              <Pulse className="h-3 w-14 rounded-full" delay={0.15} />
            </div>
          </div>
        </div>

        {/* GroupTabs skeleton */}
        <div
          className="mb-5 flex gap-1 rounded-2xl p-1"
          style={{ background: "var(--evven-surface)" }}
        >
          {[0.55, 0.55, 0.65, 0.55].map((flex, i) => (
            <Pulse
              key={i}
              className="h-9 rounded-xl"
              style={{ flex }}
              delay={0.05 * i}
            />
          ))}
        </div>

        {/* Expense list skeleton */}
        <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="card flex items-center gap-3 rounded-2xl px-4 py-3.5"
              style={{ background: "var(--evven-card-background)" }}
            >
              <Pulse className="size-9 shrink-0 rounded-xl" delay={0.05 * i} />
              <div className="min-w-0 flex-1 space-y-2">
                <Pulse className="h-3.5 w-1/2 rounded-full" delay={0.05 * i} />
                <Pulse
                  className="h-2.5 w-1/3 rounded-full"
                  delay={0.05 * i + 0.05}
                />
              </div>
              <Pulse
                className="h-3.5 w-14 rounded-full"
                delay={0.05 * i + 0.1}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
