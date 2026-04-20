'use client';

import { Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap, gsapEasing } from '@/lib/animations/gsap-config';
import { heroBridge } from '@/lib/animations/hero-bridge';
import { designTokens } from '@/lib/design-tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// ── Dynamic import — keeps Three.js bundle server-free ──────────────────────
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
        className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight"
        style={{
          fontFamily: designTokens.typography.fontFamily.heading,
          color: designTokens.colors.text.primary,
          letterSpacing: designTokens.typography.letterSpacing.tight,
        }}
      >
        ALES
      </h1>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function HeroScene() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useReducedMotion();

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

  if (isMobile) {
    return <MobileHero />;
  }

  return <DesktopHero />;
}

// ── Mobile Hero ───────────────────────────────────────────────────────────────
function MobileHero() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { colors } = designTokens;

  useEffect(() => {
    if (!wordmarkRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(wordmarkRef.current!, {
        opacity: 0,
        y: 40,
        duration: designTokens.animation.durationSeconds.cinematic,
        ease: gsapEasing.cinematic,
        delay: 0.3,
      });
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 20,
          duration: designTokens.animation.durationSeconds.slower,
          ease: gsapEasing.decelerate,
          delay: 0.7,
        });
      }
    });
    return () => { ctx.revert(); };
  }, []);

  return (
    <section
      id="hero-scene"
      style={{ height: '100vh', backgroundColor: colors.background }}
      className="relative overflow-hidden flex flex-col items-center justify-end pb-28"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 60%, ${colors.accent.primaryMuted} 0%, transparent 70%)`,
        }}
      />
      <h1
        ref={wordmarkRef}
        className="relative font-bold tracking-tight"
        style={{
          fontFamily: designTokens.typography.fontFamily.heading,
          fontSize: 'clamp(5rem, 20vw, 8rem)',
          color: designTokens.colors.text.primary,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          willChange: 'opacity, transform',
        }}
      >
        ALES
      </h1>
      <p
        ref={subtitleRef}
        className="relative mt-4 text-sm tracking-widest uppercase"
        style={{
          color: colors.text.secondary,
          fontFamily: designTokens.typography.fontFamily.body,
          letterSpacing: designTokens.typography.letterSpacing.widest,
        }}
      >
        Enterprise Hardware
      </p>
    </section>
  );
}

// ── Desktop Hero (full cinematic) ─────────────────────────────────────────────
function DesktopHero() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const { colors } = designTokens;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!wordmarkRef.current) return;

    // Reset bridge to initial state
    heroBridge.scrollProgress = 0;
    heroBridge.rotationY = -Math.PI / 2;
    heroBridge.screenOpen = 0;
    heroBridge.wordmarkOpacity = 0;
    heroBridge.wordmarkY = 50;

    // Sync wordmark DOM directly — avoids React re-renders
    function syncWordmark() {
      if (!wordmarkRef.current || !subtitleRef.current) return;
      wordmarkRef.current.style.opacity = String(heroBridge.wordmarkOpacity);
      wordmarkRef.current.style.transform = `translateY(${heroBridge.wordmarkY}px)`;
      subtitleRef.current.style.opacity = String(heroBridge.wordmarkOpacity * 0.7);
      subtitleRef.current.style.transform = `translateY(${heroBridge.wordmarkY * 1.5}px)`;
    }

    // Fade scroll hint out as user scrolls
    function syncScrollHint() {
      if (!scrollHintRef.current) return;
      const fadeOut = Math.max(0, 1 - heroBridge.scrollProgress * 5);
      scrollHintRef.current.style.opacity = String(fadeOut * 0.4);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-scene',
          start: 'top top',
          end: '+=200%',
          pin: '#hero-scene-inner',
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: () => {
            syncWordmark();
            syncScrollHint();
          },
        },
      });

      // ── Act 1 (0–30%): Spotlight rises, laptop rotates from side profile ──
      tl.to(heroBridge, {
        scrollProgress: 0.3,
        rotationY: 0.15,
        duration: 1,
        ease: 'none',
      }, 0);

      // ── Act 2 (30–60%): Model settles, slight continued rotation ──────────
      tl.to(heroBridge, {
        scrollProgress: 0.6,
        rotationY: 0.08,
        duration: 1,
        ease: 'none',
      }, 1);

      // ── Act 3 (60–100%): Wordmark fades up ───────────────────────────────
      tl.to(heroBridge, {
        scrollProgress: 1,
        wordmarkOpacity: 1,
        wordmarkY: 0,
        duration: 1,
        ease: 'none',
      }, 2);
    });

    return () => {
      ctx.revert(); // ERR-003: kills timeline + ScrollTrigger
      // Reset bridge so next mount starts clean
      heroBridge.scrollProgress = 0;
      heroBridge.rotationY = -Math.PI / 2;
      heroBridge.wordmarkOpacity = 0;
      heroBridge.wordmarkY = 50;
    };
  }, []);

  return (
    <section
      id="hero-scene"
      style={{ height: '300vh', backgroundColor: colors.background }}
      className="relative"
    >
      {/* Pinned viewport container */}
      <div
        id="hero-scene-inner"
        className="relative w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* ── Vignette overlay — softens edges of the 3D scene ──────────── */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, rgba(10,10,15,0.6) 100%)',
          }}
        />

        {/* ── 3D Canvas ─────────────────────────────────────────────────── */}
        <Suspense
          fallback={
            <div
              className="absolute inset-0"
              style={{ backgroundColor: colors.background }}
            />
          }
        >
          <ThreeScene />
        </Suspense>

        {/* ── Wordmark overlay ──────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 md:pb-24 lg:pb-28">
          <h1
            ref={wordmarkRef}
            className="font-bold tracking-tight"
            style={{
              fontFamily: designTokens.typography.fontFamily.heading,
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              color: designTokens.colors.text.primary,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              opacity: 0,
              transform: 'translateY(50px)',
              willChange: 'opacity, transform',
            }}
          >
            ALES
          </h1>
          <p
            ref={subtitleRef}
            className="mt-3 text-xs tracking-widest uppercase"
            style={{
              color: colors.text.secondary,
              fontFamily: designTokens.typography.fontFamily.body,
              letterSpacing: designTokens.typography.letterSpacing.widest,
              opacity: 0,
              transform: 'translateY(75px)',
              willChange: 'opacity, transform',
            }}
          >
            Enterprise Hardware · TRNC
          </p>
        </div>

        {/* ── Scroll hint ───────────────────────────────────────────────── */}
        <div
          ref={scrollHintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.4 }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{
              color: colors.text.secondary,
              fontFamily: designTokens.typography.fontFamily.body,
            }}
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

