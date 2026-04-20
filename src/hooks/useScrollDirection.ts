'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

const THRESHOLD = 10;

// Singleton external store — shared across all hook instances
let _direction: ScrollDirection = null;
let _lastScrollY = 0;
const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((cb) => cb());
}

function _handleScroll() {
  const currentY = window.scrollY;
  const delta = currentY - _lastScrollY;

  if (Math.abs(delta) < THRESHOLD) return;

  const next: ScrollDirection = delta > 0 ? 'down' : 'up';
  _lastScrollY = currentY;

  if (next !== _direction) {
    _direction = next;
    _notify();
  }
}

/**
 * Detects scroll direction with a threshold to avoid jitter.
 * SSR-safe: returns `null` on the server / before hydration.
 */
export function useScrollDirection(): ScrollDirection {
  const subscribe = useCallback((callback: () => void) => {
    _listeners.add(callback);
    if (_listeners.size === 1) {
      window.addEventListener('scroll', _handleScroll, { passive: true });
    }
    return () => {
      _listeners.delete(callback);
      if (_listeners.size === 0) {
        window.removeEventListener('scroll', _handleScroll);
      }
    };
  }, []);

  const getSnapshot = useCallback(() => _direction, []);
  const getServerSnapshot = useCallback((): ScrollDirection => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
