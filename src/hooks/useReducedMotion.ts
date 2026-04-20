'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Returns `true` when the user has requested reduced motion via the OS
 * accessibility setting. SSR-safe (returns `false` on the server).
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
