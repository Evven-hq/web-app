export const panelMotion = {
  initial: { opacity: 0, y: 12, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(10px)" },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
};

export const passwordMotion = {
  initial: { opacity: 0, y: 8, filter: "blur(10px)", scale: 0.985 },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, y: -6, filter: "blur(10px)", scale: 0.985 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};
