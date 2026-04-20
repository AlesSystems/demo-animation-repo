/**
 * hero-bridge.ts — Shared mutable state bridge between GSAP and R3F.
 *
 * GSAP tweens this object directly (no React setState per frame).
 * R3F useFrame reads it each tick to update Three.js objects imperatively.
 * This avoids React re-renders on every scroll event.
 */
export const heroBridge = {
  scrollProgress: 0,
  rotationY: -Math.PI / 2,
  screenOpen: 0,
  wordmarkOpacity: 0,
  wordmarkY: 50,
};
