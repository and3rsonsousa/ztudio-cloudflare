export const scaleUp = (duration = 0.5) => ({
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeOut",
      duration: duration,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: duration * 0.5,
    },
  },
});
export const fadeDown = (duration = 0.5) => ({
  initial: { opacity: 0, y: "-100%" },
  animate: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: duration,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: duration * 0.5,
    },
  },
});

export const fade = (duration = 0.1) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration,
    },
  },
});
