import { type ScrollTrigger } from 'gsap/ScrollTrigger';

type ScrollTriggerVars = ScrollTrigger.Vars;

export interface FadeInTriggerOptions {
  trigger: string | Element;
  start?: string;
  end?: string;
  markers?: boolean;
}

export interface ParallaxTriggerOptions {
  trigger: string | Element;
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

export interface PinTriggerOptions {
  trigger: string | Element;
  start?: string;
  end?: string;
  pinSpacing?: boolean;
}

export interface StaggerTriggerOptions {
  trigger: string | Element;
  start?: string;
}

/**
 * Fade + translateY reveal on scroll enter.
 * Apply to a gsap.fromTo() or gsap.from() call.
 */
export function fadeInTrigger({
  trigger,
  start = 'top 80%',
  end = 'top 20%',
  markers = false,
}: FadeInTriggerOptions): ScrollTriggerVars {
  return {
    trigger,
    start,
    end,
    toggleActions: 'play none none reverse',
    markers,
  };
}

/**
 * Parallax scrub effect. Wire to a gsap.to() animating `y`.
 */
export function parallaxTrigger({
  trigger,
  scrub = 1,
  start = 'top bottom',
  end = 'bottom top',
}: ParallaxTriggerOptions): ScrollTriggerVars {
  return {
    trigger,
    scrub,
    start,
    end,
  };
}

/**
 * Pin a section in place while the user scrolls through it.
 */
export function pinTrigger({
  trigger,
  start = 'top top',
  end = '+=100%',
  pinSpacing = true,
}: PinTriggerOptions): ScrollTriggerVars {
  return {
    trigger,
    start,
    end,
    pin: true,
    pinSpacing,
    anticipatePin: 1,
  };
}

/**
 * Staggered children reveal. Combine with gsap.fromTo() targeting child elements.
 */
export function staggerTrigger({
  trigger,
  start = 'top 75%',
}: StaggerTriggerOptions): ScrollTriggerVars {
  return {
    trigger,
    start,
    toggleActions: 'play none none none',
  };
}
