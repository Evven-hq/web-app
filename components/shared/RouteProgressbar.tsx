"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigation } from "./NavigationProvider";

export function RouteProgressBar() {
  const { isNavigating } = useNavigation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      aria-hidden="true"
    >
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            key="route-progress"
            className="h-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, var(--evven-accent-primary), color-mix(in srgb, var(--evven-accent-primary) 60%, white))",
              boxShadow: "0 0 8px color-mix(in srgb, var(--evven-accent-primary) 70%, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{
              scaleX: shouldReduceMotion ? 1 : 0.78,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
            }}
            exit={{
              scaleX: 1,
              opacity: 0,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.28, ease: "easeOut" },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}