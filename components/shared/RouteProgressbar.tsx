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
                "linear-gradient(90deg, var(--evven-accent-primary), color-mix(in srgb, var(--evven-accent-primary) 70%, white))",
              boxShadow:
                "0 0 12px color-mix(in srgb, var(--evven-accent-primary) 50%, transparent), 0 0 4px color-mix(in srgb, var(--evven-accent-primary) 30%, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{
              scaleX: shouldReduceMotion ? 1 : [0.3, 0.7, 0.85],
              transition: shouldReduceMotion
                ? { duration: 0 }
                : {
                    scaleX: {
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
            }}
            exit={{
              scaleX: 1,
              opacity: 0,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
