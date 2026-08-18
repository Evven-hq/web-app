"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useNavigation, type NavDirection } from "./NavigationProvider";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function getVariants(direction: NavDirection) {
  if (direction === "back") {
    return {
      initial: { opacity: 0, x: -24, filter: "blur(4px)" },
      animate: { opacity: 1, x: 0, filter: "blur(0px)" },
      exit: { opacity: 0, x: 24, filter: "blur(4px)" },
    };
  }
  return {
    initial: { opacity: 0, x: 24, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -24, filter: "blur(4px)" },
  };
}

function getReducedVariants() {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { direction } = useNavigation();

  const variants = shouldReduceMotion
    ? getReducedVariants()
    : getVariants(direction);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.3, ease: EASE_OUT }
        }
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
