"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { PersonalExpense } from "@/types";
import { getCategoryMeta } from "@/lib/expense-categories";
import { getPaymentModeMeta } from "@/lib/payment-modes";
import { getInitials } from "@/lib/format";
import {
  isSoundEnabled,
  playExpenseStampThud,
  playExpenseSuccessChime,
} from "@/lib/expense-success-sound";

export type ExpenseSuccessVariant = "personal" | "friend" | "group" | "settlement";

export interface ExpenseSuccessAvatar {
  initials: string;
  bg: string;
  text: string;
}

export type ExpenseSuccessMetaLabel =
  | string
  | {
      prefix?: string;
      bold: string;
      suffix?: string;
    };

export type ExpenseSuccessState = Omit<ExpenseSuccessScreenProps, "open" | "onDone">;

export interface ExpenseSuccessScreenProps {
  open: boolean;
  onDone: () => void;
  variant: ExpenseSuccessVariant;

  amount: number;
  categoryIcon: ReactNode;
  categoryBg: string;
  categoryText: string;
  merchant: string;
  metaLabel: ExpenseSuccessMetaLabel;
  avatars?: ExpenseSuccessAvatar[];
  amountLabelOverride?: string;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_BACK = [0.34, 1.56, 0.64, 1] as const;
const EASE_OUT = [0, 0, 0.58, 1] as const;

const FRIEND_AVATAR_BG =
  "color-mix(in srgb, var(--evven-accent-secondary) 28%, var(--evven-background))";
const FRIEND_AVATAR_TEXT = "var(--evven-accent-primary)";

const PARTICLE_PATHS = [
  { dx: 46, dy: 0, rot: 15 },
  { dx: 23, dy: 39.8, rot: -12 },
  { dx: -23, dy: 39.8, rot: 12 },
  { dx: -46, dy: 0, rot: -15 },
  { dx: -23, dy: -39.8, rot: 10 },
  { dx: 23, dy: -39.8, rot: -10 },
];

export function buildPersonalSuccess(
  created: PersonalExpense | PersonalExpense[]
): ExpenseSuccessState {
  const list = Array.isArray(created) ? created : [created];
  const last = list[list.length - 1];
  const category = getCategoryMeta(last.category);
  const paymentLabel = getPaymentModeMeta(last.payment_method)?.label ?? "UPI";

  const friendEntries = list
    .filter((entry) => entry.friend ?? entry.ghost ?? entry.friend_id ?? entry.ghost_id)
    .map((entry) => ({
      name: entry.friend?.name ?? entry.ghost?.name ?? "Friend",
      avatar: {
        initials: getInitials(entry.friend?.name ?? entry.ghost?.name ?? "Friend"),
        bg: FRIEND_AVATAR_BG,
        text: FRIEND_AVATAR_TEXT,
      } satisfies ExpenseSuccessAvatar,
    }));

  const base = {
    categoryIcon: <category.icon size={38} />,
    categoryBg: category.bg,
    categoryText: category.text,
    merchant: last.title,
  };

  if (friendEntries.length === 0) {
    return {
      ...base,
      variant: "personal" as const,
      amount: Number(last.amount),
      metaLabel: `${category.label} · ${paymentLabel}`,
    };
  }

  const paidByYou = last.settlement_direction !== "you_owe";

  if (list.length === 1) {
    const name = friendEntries[0].name;
    return {
      ...base,
      variant: "friend",
      amount: Number(last.amount),
      metaLabel: {
        prefix: "Split with ",
        bold: name,
        suffix: paidByYou ? " · You paid" : ` · ${name} paid`,
      },
      avatars: [friendEntries[0].avatar],
    };
  }

  const total = list.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const isSingleParticipant = friendEntries.length === 1;

  return {
    ...base,
    variant: "friend",
    amount: total,
    metaLabel: isSingleParticipant
      ? {
          prefix: "Split with ",
          bold: friendEntries[0].name,
          suffix: " · You paid",
        }
      : {
          prefix: "Split with ",
          bold: `${friendEntries.length} people`,
          suffix: " · You paid",
        },
    avatars: friendEntries.map((entry) => entry.avatar),
  };
}

export function ExpenseSuccessScreen({
  open,
  onDone,
  variant,
  amount,
  categoryIcon,
  categoryBg,
  categoryText,
  merchant,
  metaLabel,
  avatars = [],
  amountLabelOverride,
}: ExpenseSuccessScreenProps) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(open);
  const isSettlement = variant === "settlement";
  const soundOn = isSoundEnabled();

  useEffect(() => {
    if (!open) return;

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([12, 30, 18]);
    }

    const timers: number[] = [];
    if (!isSettlement && !reduce && soundOn) {
      timers.push(window.setTimeout(() => playExpenseStampThud(), 760));
    }
    if (soundOn) {
      timers.push(window.setTimeout(() => playExpenseSuccessChime(), 1050));
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [open, isSettlement, reduce, soundOn]);

  const label = amountLabelOverride ?? (isSettlement ? "Settlement recorded" : "Expense logged");
  const iconBg = isSettlement ? "var(--evven-success-bg)" : categoryBg;
  const iconText = isSettlement ? "var(--evven-success-text)" : categoryText;

  const showAvatars = avatars.length > 0;
  const primaryAvatars = avatars.slice(0, 3);
  const overflowCount = avatars.length - 3;
  const handleBackdropClick = () => setVisible(false);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence onExitComplete={onDone}>
      {visible ? (
        <motion.div
          key="expense-success"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: reduce ? { duration: 0.2 } : { duration: 0.2, ease: EASE },
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: reduce ? { duration: 0.15 } : { duration: 0.2, ease: EASE },
          }}
        >
          <motion.div
            aria-hidden
            className="modal-backdrop absolute inset-0 cursor-pointer"
            onClick={handleBackdropClick}
            initial={{
              opacity: 0,
              backdropFilter: "blur(0px) saturate(100%) contrast(100%) brightness(100%)",
            }}
            animate={{
              opacity: 1,
              backdropFilter:
                "blur(var(--evven-modal-backdrop-blur)) saturate(180%) contrast(88%) brightness(98%)",
              transition: reduce ? { duration: 0.2 } : { duration: 0.25, ease: EASE },
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px) saturate(100%) contrast(100%) brightness(100%)",
              transition: reduce ? { duration: 0.15 } : { duration: 0.2, ease: EASE },
            }}
          />

          <motion.div
            className="modal-panel card relative z-10 w-full max-w-[340px] overflow-visible rounded-[28px] px-6 pb-6 pt-9 text-center shadow-[0_24px_64px_-16px_rgba(0,0,0,0.35)]"
            style={{ background: "var(--evven-card-background)" }}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: reduce
                ? { duration: 0.2 }
                : { duration: 0.48, ease: EASE_OUT_EXPO },
            }}
          >
            {!isSettlement ? (
              <motion.div
                aria-hidden
                className="absolute -top-[18px] right-[22px] flex size-[58px] items-center justify-center rounded-full border-[3px] border-dashed"
                style={{
                  background: "var(--evven-success-bg)",
                  color: "var(--evven-success-text)",
                  borderColor: "currentColor",
                }}
                initial={{ opacity: 0, scale: 1.7, rotate: -16 }}
                animate={
                  reduce
                    ? {
                        opacity: 1,
                        scale: 1,
                        rotate: -8,
                        transition: { duration: 0.2 },
                      }
                    : {
                        opacity: [0, 1, 1, 1],
                        scale: [1.7, 0.92, 1.05, 1],
                        rotate: [-16, -6, -9, -8],
                        transition: {
                          delay: 0.76,
                          duration: 0.42,
                          times: [0, 0.55, 0.75, 1],
                          ease: EASE_OUT_EXPO,
                        },
                      }
                }
              >
                <Check size={24} strokeWidth={3} />
              </motion.div>
            ) : null}

            <motion.div
              className="relative mx-auto mb-3.5 flex size-[88px] items-center justify-center rounded-[26px]"
              style={{ background: iconBg, color: iconText }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: reduce
                  ? { duration: 0.2 }
                  : { delay: 0.42, duration: 0.36, ease: EASE_BACK },
              }}
            >
              {isSettlement ? <Check size={38} strokeWidth={2.5} /> : categoryIcon}

              {!isSettlement && !reduce ? (
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  {PARTICLE_PATHS.map((path, index) => (
                    <motion.span
                      key={index}
                      className="absolute size-2 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        marginLeft: -4,
                        marginTop: -4,
                        background: "var(--evven-success-text)",
                      }}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        x: path.dx,
                        y: path.dy,
                        scale: 0.3,
                        rotate: path.rot,
                        transition: { delay: 1, duration: 0.52, ease: EASE_OUT },
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </motion.div>

            <motion.p
              className="m-0 text-base font-semibold"
              style={{ color: "var(--evven-text-primary)" }}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: reduce
                  ? { duration: 0.2, delay: 0.47 }
                  : { delay: 0.47, duration: 0.3, ease: EASE },
              }}
            >
              {merchant}
            </motion.p>

            <motion.p
              className="m-0 mb-1 mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--evven-text-muted)" }}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: reduce
                  ? { duration: 0.2, delay: 0.5 }
                  : { delay: 0.5, duration: 0.3, ease: EASE },
              }}
            >
              {label}
            </motion.p>

            <motion.p
              className="m-0 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums"
              style={{
                color: "var(--evven-text-primary)",
                fontFamily: "var(--font-mono)",
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: reduce ? { duration: 0.2, delay: 0.5 } : { duration: 0, delay: 0.5 },
              }}
            >
              <CountUp amount={amount} />
            </motion.p>

            <motion.hr
              className="my-[18px] border-0 border-t-2 border-dashed"
              style={{ borderColor: "var(--evven-border)" }}
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: reduce
                  ? { duration: 0.2, delay: 0.62 }
                  : { delay: 0.62, duration: 0.34, ease: EASE },
              }}
            />

            <motion.p
              className="mb-4 text-[13px]"
              style={{ color: "var(--evven-text-muted)" }}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: reduce
                  ? { duration: 0.2, delay: 0.78 }
                  : { delay: 0.78, duration: 0.32, ease: EASE },
              }}
            >
              <MetaText metaLabel={metaLabel} />
            </motion.p>

            {showAvatars ? (
              <motion.div
                className="mb-4 flex items-center justify-center gap-2.5"
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: reduce
                    ? { duration: 0.2, delay: 0.84 }
                    : { delay: 0.84, duration: 0.32, ease: EASE },
                }}
              >
                {primaryAvatars.map((avatar, index) => (
                  <span
                    key={index}
                    className="flex size-[34px] items-center justify-center rounded-full border text-[11px] font-semibold"
                    style={{
                      background: avatar.bg,
                      color: avatar.text,
                      borderColor: "var(--evven-border)",
                    }}
                  >
                    {avatar.initials}
                  </span>
                ))}
                {overflowCount > 0 ? (
                  <span
                    className="flex size-[34px] items-center justify-center rounded-full border text-[11px] font-semibold"
                    style={{
                      background: "var(--evven-surface)",
                      color: "var(--evven-text-muted)",
                      borderColor: "var(--evven-border)",
                    }}
                  >
                    +{overflowCount}
                  </span>
                ) : null}
              </motion.div>
            ) : null}

            <motion.button
              type="button"
              onClick={() => setVisible(false)}
              className="w-full cursor-pointer appearance-none rounded-[14px] border-0 px-4 py-[13px] text-sm font-semibold text-white"
              style={{ background: "var(--evven-accent-primary)" }}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: reduce
                  ? { duration: 0.2, delay: 1.08 }
                  : { delay: 1.08, duration: 0.32, ease: EASE },
              }}
            >
              Done
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

function formatSuccessAmount(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function CountUp({ amount }: { amount: number }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() => (reduce ? amount : 0));

  useEffect(() => {
    if (reduce) return;

    const controls = animate(0, amount, {
      duration: 0.55,
      delay: 0.5,
      ease: (t: number) => 1 - Math.pow(1 - t, 3),
      onUpdate: (value) => setDisplay(value),
    });
    return () => controls.stop();
  }, [reduce, amount]);

  return <>{formatSuccessAmount(display)}</>;
}

function MetaText({ metaLabel }: { metaLabel: ExpenseSuccessMetaLabel }) {
  if (typeof metaLabel === "string") {
    return <span>{metaLabel}</span>;
  }

  return (
    <>
      {metaLabel.prefix ? <span>{metaLabel.prefix}</span> : null}
      <b
        style={{
          color: "var(--evven-text-primary)",
          fontWeight: 500,
        }}
      >
        {metaLabel.bold}
      </b>
      {metaLabel.suffix ? <span>{metaLabel.suffix}</span> : null}
    </>
  );
}
