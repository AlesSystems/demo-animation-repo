'use client';

import { useScroll, useMotionValueEvent, useMotionValue, type MotionValue } from 'framer-motion';

export interface ScrollProgressValues {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

/**
 * Tracks window scroll position and progress (0–1) as Framer Motion
 * MotionValues — safe to pass directly to `motion` components.
 */
export function useScrollProgress(): ScrollProgressValues {
  const { scrollY: rawScrollY, scrollYProgress: rawScrollYProgress } = useScroll();

  const scrollY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);

  useMotionValueEvent(rawScrollY, 'change', (v) => scrollY.set(v));
  useMotionValueEvent(rawScrollYProgress, 'change', (v) => scrollYProgress.set(v));

  return { scrollY, scrollYProgress };
}
