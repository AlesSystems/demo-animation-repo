'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap, gsapEasing } from '@/lib/animations/gsap-config';
import { designTokens } from '@/lib/design-tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// ── Dynamic imports to avoid SSR ────────────────────────────────────────────
const ThreeScene = dynamic(() => import('../three/HeroThreeScene'), { ssr: false });

// ── Static fallback for reduced-motion ───────────────────────────────────────
function StaticHero() {
  const { colors } = designTokens;
  return (
    <div
      className="absolute inset-0 flex items-end justify-center pb-32"
      style={{
        background: `radial-gradient(ellipse at center, ${colors.accent.primaryMuted} 0%, transparent 70%)`,
        backgroundColor: colors.background,
      }}
    >
      <h1
        className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white"
        style={{ fontFamily: designTokens.typography.fontFamily.heading }}
      >
        ALES
      </h1>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function HeroScene() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useReducedMotion();

  // ── Reduced motion: static layout, no GSAP ──────────────────────────────
  if (prefersReducedMotion) {
    return (
      <section
        id="hero-scene"
        style={{ height: '100vh', backgroundColor: designTokens.colors.background }}
        className="relative overflow-hidden"
      >
        <StaticHero />
      </section>
    );
  }

  // ── Mobile: no Canvas, gradient bg + wordmark fade ───────────────────────
  if (isMobile) {
    return (
      <MobileHero />
    );
  }

  return <DesktopHero />;
}

// ── Mobile Hero ───────────────────────────────────────────────────────────────
function MobileHero() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const { colors } = designTokens;

  useEffect(() => {
    if (!wordmarkRef.current) return;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(wordmarkRef.current, {
      opacity: 0,
      y: 40,
      duration: designTokens.animation.durationSeconds.cinematic,
      ease: gsapEasing.cinematic,
    });
    return () => { tl.kill(); };
  }, []);

  return (
    <section
      id="hero-scene"
      style={{
        height: '100vh',
        backgroundColor: colors.background,
      }}
      className="relative overflow-hidden flex items-end justify-center pb-32"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${colors.accent.primaryMuted} 0%, transparent 70%)`,
        }}
      />
      <h1
        ref={wordmarkRef}
        className="relative text-7xl md:text-8xl font-bold tracking-tight text-white"
        style={{ fontFamily: designTokens.typography.fontFamily.heading }}
      >
        ALES
      </h1>
    </section>
  );
}

// ── Desktop Hero (full cinematic) ─────────────────────────────────────────────
function DesktopHero() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { colors } = designTokens;

  // Proxy object that GSAP tweens — values are read each rAF tick
  const proxy = useRef({
    scrollProgress: 0,
    rotationY: -Math.PI / 2,
    screenOpen: 0,
    wordmarkOpacity: 0,
    wordmarkY: 50,
  });

  // React state that the Three.js scene reads
  const [threeState, setThreeState] = useState({
    scrollProgress: 0,
    laptopRotation: [0, -Math.PI / 2, 0] as [number, number, number],
    screenOpen: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!innerRef.current || !wordmarkRef.current) return;

    const p = proxy.current;

    // Sync proxy → React state each frame (throttled via ScrollTrigger scrub)
    function syncThreeState() {
      setThreeState({
        scrollProgress: p.scrollProgress,
        laptopRotation: [0, p.rotationY, 0],
        screenOpen: p.screenOpen,
      });
    }

    // Wordmark: direct DOM mutation (no React state re-render needed)
    function syncWordmark() {
      if (!wordmarkRef.current) return;
      wordmarkRef.current.style.opacity = String(p.wordmarkOpacity);
      wordmarkRef.current.style.transform = `translateY(${p.wordmarkY}px)`;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-scene',
          start: 'top top',
          end: '+=200%',
          pin: '#hero-scene-inner',
          scrub: 1,
          anticipatePin: 1,
          onUpdate: () => {
            syncThreeState();
            syncWordmark();
          },
        },
      });

      // ── Act 1: 0–30% — Spotlight fades in, laptop rotates to front ─────
      tl.to(p, {
        scrollProgress: 0.3,
        rotationY: 0.15, // slight angle toward viewer
        duration: 1,
        ease: 'none',
      }, 0);

      // ── Act 2: 30–60% — Screen opens ─────────────────────────────────
      tl.to(p, {
        scrollProgress: 0.6,
        screenOpen: 1,
        duration: 1,
        ease: 'none',
      }, 1);

      // ── Act 3: 60–100% — Wordmark reveals ────────────────────────────
      tl.to(p, {
        scrollProgress: 1,
        wordmarkOpacity: 1,
        wordmarkY: 0,
        duration: 1,
        ease: 'none',
      }, 2);
    });

    return () => {
      ctx.revert(); // ERR-003: kills timeline + ScrollTrigger
    };
  }, []);

  return (
    <section
      id="hero-scene"
      style={{ height: '300vh', backgroundColor: colors.background }}
      className="relative"
    >
      {/* Pinned inner viewport */}
      <div
        id="hero-scene-inner"
        ref={innerRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* ── 3D Canvas ──────────────────────────────────────────── */}
        <Suspense fallback={<div className="absolute inset-0" style={{ backgroundColor: colors.background }} />}>
          <ThreeScene
            scrollProgress={threeState.scrollProgress}
            laptopRotation={threeState.laptopRotation}
            screenOpen={threeState.screenOpen}
          />
        </Suspense>

        {/* ── Wordmark overlay ───────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-20 md:pb-28 lg:pb-32">
          <h1
            ref={wordmarkRef}
            className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white"
            style={{
              fontFamily: designTokens.typography.fontFamily.heading,
              opacity: 0,
              transform: 'translateY(50px)',
              willChange: 'opacity, transform',
            }}
          >
            ALES
          </h1>
        </div>

        {/* ── Scroll hint ────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.4 }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: colors.text.secondary, fontFamily: designTokens.typography.fontFamily.body }}
          >
            scroll
          </span>
          <div
            className="h-8 w-px"
            style={{ backgroundColor: colors.text.tertiary }}
          />
        </div>
      </div>
    </section>
  );
}
