'use client';

import { motion, useReducedMotion } from 'framer-motion';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'p';

interface TextRevealProps {
  children: string;
  as?: HeadingTag;
  className?: string;
  delay?: number;
}

const containerVariants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { staggerChildren: 0.04, delayChildren: delay },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, y: '110%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function TextReveal({ children, as: Tag = 'p', className, delay = 0 }: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = children.split(' ');

  if (shouldReduceMotion) {
    const Static = Tag;
    return <Static className={className}>{children}</Static>;
  }

  const MotionTag = motion[Tag] as typeof motion.p;

  return (
    <MotionTag
      className={className}
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      custom={delay}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span style={{ display: 'inline-block' }} variants={wordVariants}>
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
