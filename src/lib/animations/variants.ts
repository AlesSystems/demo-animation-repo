import { type Variants, type Transition } from 'framer-motion';
import { designTokens } from '@/lib/design-tokens';

const { ease, durationSeconds } = designTokens.animation;

const DURATION = {
  fast: durationSeconds.fast,
  normal: durationSeconds.normal,
  slow: durationSeconds.slow,
  cinematic: durationSeconds.cinematic,
} as const;

const EASE = {
  cinematic: ease.cinematic.array,
  smooth: ease.smooth.array,
  decelerate: ease.decelerate.array,
} as const;

type TransitionSpeed = 'fast' | 'normal' | 'slow' | 'cinematic';

/**
 * Returns a Framer Motion transition config using design-token durations.
 */
export function getTransition(speed: TransitionSpeed = 'normal'): Transition {
  return {
    duration: DURATION[speed],
    ease: EASE.cinematic,
  };
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: getTransition('normal'),
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: getTransition('normal'),
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: getTransition('normal'),
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: getTransition('normal'),
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: getTransition('normal'),
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: getTransition('normal'),
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.cinematic,
      ease: EASE.cinematic,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: DURATION.normal,
      ease: EASE.smooth,
    },
  },
};
