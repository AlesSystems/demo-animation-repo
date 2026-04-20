import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { designTokens } from '@/lib/design-tokens';

// ERR-001: Guard ScrollTrigger registration — references `self` at module eval time,
// which crashes Next.js static generation if called unconditionally.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const { ease, durationSeconds } = designTokens.animation;

/**
 * Call once in a client component (e.g. in a layout useEffect) to register
 * GSAP plugins and apply project-wide defaults.
 */
export function initGSAP(): void {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.defaults({
    ease: ease.cinematic.css,
    duration: durationSeconds.slower,
  });

  ScrollTrigger.defaults({
    toggleActions: 'play none none none',
  });
}

export { gsap, ScrollTrigger };
export const gsapEasing = {
  cinematic: ease.cinematic.css,
  smooth: ease.smooth.css,
  sharp: ease.sharp.css,
  spring: ease.spring.css,
  decelerate: ease.decelerate.css,
  accelerate: ease.accelerate.css,
} as const;
