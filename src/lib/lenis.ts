import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/animations/gsap-config';

export interface LenisConfig {
  duration?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

export interface LenisHandle {
  lenis: Lenis;
  cleanup: () => void;
}

/**
 * Creates and wires a Lenis smooth-scroll instance to GSAP's ticker and
 * ScrollTrigger. Safe to call only in browser contexts.
 *
 * ERR-002: Re-initialises Lenis on bfcache restore (Mobile Safari "back/forward"
 * navigation) so scroll state doesn't freeze after the user navigates back.
 */
export function createLenisInstance(config: LenisConfig = {}): LenisHandle {
  const lenis = new Lenis({
    duration: config.duration ?? 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: config.smoothWheel ?? true,
    wheelMultiplier: config.wheelMultiplier ?? 1,
    touchMultiplier: config.touchMultiplier ?? 2,
  });

  // Wire Lenis into GSAP so ScrollTrigger positions stay in sync.
  lenis.on('scroll', ScrollTrigger.update);

  const gsapTickerHandler = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(gsapTickerHandler);
  gsap.ticker.lagSmoothing(0);

  // ERR-002: Restore smooth scroll after bfcache navigation (Mobile Safari).
  const handlePageShow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      lenis.stop();
      lenis.start();
    }
  };
  window.addEventListener('pageshow', handlePageShow);

  const cleanup = () => {
    lenis.destroy();
    gsap.ticker.remove(gsapTickerHandler);
    window.removeEventListener('pageshow', handlePageShow);
  };

  return { lenis, cleanup };
}
