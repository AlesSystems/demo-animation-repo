'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  fadeInUp,
  fadeInDown,
  scaleIn,
  slideInLeft,
  slideInRight,
} from '@/lib/animations/variants';

type AnimationVariant = 'fade-up' | 'fade-down' | 'scale-in' | 'slide-left' | 'slide-right';

const variantMap: Record<AnimationVariant, Variants> = {
  'fade-up': fadeInUp,
  'fade-down': fadeInDown,
  'scale-in': scaleIn,
  'slide-left': slideInLeft,
  'slide-right': slideInRight,
};

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationVariant;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  className,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variantMap[animation]}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
