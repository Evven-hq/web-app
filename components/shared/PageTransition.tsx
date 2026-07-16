"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.4, 0, 0.2, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 10, scale: 0.995 }
        }
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: -6, scale: 0.995 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.24, ease: EASE }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}