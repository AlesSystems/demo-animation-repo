'use client';

import { useEffect, useRef, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from '@/lib/animations/gsap-config';
import { designTokens } from '@/lib/design-tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ExplodedLaptop } from '@/components/three/ExplodedLaptop';

// ─── Label data ───────────────────────────────────────────────────────────────

const LABELS = [
  {
    id: 'screen',
    text: 'Anti-Glare IPS Display',
    top: '12%',
    left: '68%',
    progressThreshold: 0.3,
  },
  {
    id: 'keyboard',
    text: 'Spill-Resistant Keyboard',
    top: '36%',
    left: '70%',
    progressThreshold: 0.4,
  },
  {
    id: 'motherboard',
    text: 'Enterprise-Grade Motherboard',
    top: '52%',
    left: '66%',
    progressThreshold: 0.5,
  },
  {
    id: 'battery',
    text: 'All-Day Battery Life',
    top: '66%',
    left: '68%',
    progressThreshold: 0.6,
  },
  {
    id: 'chassis',
    text: 'Military-Grade Chassis',
    top: '80%',
    left: '65%',
    progressThreshold: 0.7,
  },
] as const;

// ─── Mobile feature cards ─────────────────────────────────────────────────────

const MOBILE_CARDS = [
  {
    id: 'screen',
    icon: '🖥',
    title: 'Anti-Glare IPS Display',
    description:
      '2560×1600 resolution with 400-nit brightness — readable in direct sunlight.',
  },
  {
    id: 'keyboard',
    icon: '⌨',
    title: 'Spill-Resistant Keyboard',
    description:
      'MIL-SPEC 810H-rated deck channels up to 300ml before reaching the motherboard.',
  },
  {
    id: 'motherboard',
    icon: '🔌',
    title: 'Enterprise-Grade Motherboard',
    description:
      'Intel vPro with hardware-level remote management and TPM 2.0 security.',
  },
  {
    id: 'battery',
    icon: '🔋',
    title: 'All-Day Battery Life',
    description:
      '72Wh cell provides up to 18 hours on a single charge with rapid 65W charging.',
  },
  {
    id: 'chassis',
    icon: '🛡',
    title: 'Military-Grade Chassis',
    description:
      'CNC-machined aluminium alloy casing tested to 12 drop specifications.',
  },
];

// ─── ProgressBridge — reads the mutable ref each frame inside R3F ─────────────

interface ProgressBridgeProps {
  progressRef: React.RefObject<{ value: number }>;
  staticProgress: number;
  reducedMotion: boolean;
}

function ProgressBridge({ progressRef, staticProgress, reducedMotion }: ProgressBridgeProps) {
  const [displayProgress, setDisplayProgress] = useState(staticProgress);

  useFrame(() => {
    if (reducedMotion) return;
    const next = progressRef.current?.value ?? 0;
    setDisplayProgress((prev) => {
      if (Math.abs(next - prev) > 0.002) return next;
      return prev;
    });
  });

  return <ExplodedLaptop progress={displayProgress} reducedMotion={reducedMotion} />;
}

// ─── DeconstructedScene ───────────────────────────────────────────────────────

export function DeconstructedScene() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Mutable ref so R3F reads latest value without re-renders
  const progressRef = useRef<{ value: number }>({ value: 0 });

  // Label DOM refs for GSAP opacity animation
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Heading element refs for scroll-enter fade-in
  const subLabelRef = useRef<HTMLParagraphElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);

  // Reduced motion: show static mid-explode view
  const staticProgress = reducedMotion ? 0.6 : 0;

  // ── GSAP ScrollTrigger pinning ──────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const ctx = gsap.context(() => {
      // Heading fade-in when section scrolls into view
      gsap.fromTo(
        [subLabelRef.current, headingRef.current].filter(Boolean),
        { opacity: 0, y: -14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: designTokens.animation.ease.cinematic.css,
          scrollTrigger: {
            trigger: '#deconstructed-scene',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#deconstructed-scene',
          start: 'top top',
          end: '+=200%',
          pin: '#deconstructed-scene-inner',
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Drive explode progress 0 → 1 over the full scroll range
      tl.to(progressRef.current, { value: 1, ease: 'none' }, 0);

      // Stagger label opacity entrances keyed to scroll progress
      LABELS.forEach((label, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, x: 14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.12,
            ease: designTokens.animation.ease.cinematic.css,
          },
          label.progressThreshold
        );
      });
    });

    return () => ctx.revert(); // ERR-003: cleanup on unmount / Strict Mode remount
  }, [reducedMotion, isMobile]);

  // ── Show all overlay elements immediately for reduced motion ────────────
  useEffect(() => {
    if (!reducedMotion) return;
    labelRefs.current.forEach((el) => {
      if (el) el.style.opacity = '1';
    });
    if (subLabelRef.current) subLabelRef.current.style.opacity = '1';
    if (headingRef.current)  headingRef.current.style.opacity = '1';
  }, [reducedMotion]);

  // ── Mobile fallback ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        id="deconstructed-scene"
        className="px-6 py-20"
        style={{ backgroundColor: designTokens.colors.background }}
      >
        <ScrollReveal animation="fade-up">
          <p
            className="text-xs uppercase text-center mb-2"
            style={{
              color: designTokens.colors.accent.primary,
              fontFamily: designTokens.typography.fontFamily.mono,
              letterSpacing: designTokens.typography.letterSpacing.widest,
            }}
          >
            Component Breakdown
          </p>
          <h2
            className="text-2xl font-semibold mb-12 text-center"
            style={{
              color: designTokens.colors.text.primary,
              fontFamily: designTokens.typography.fontFamily.heading,
            }}
          >
            Built to Enterprise Spec
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-6 max-w-md mx-auto">
          {MOBILE_CARDS.map((card, i) => (
            <ScrollReveal key={card.id} animation="fade-up" delay={i * 0.08}>
              <div
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{
                  backgroundColor: designTokens.colors.surface,
                  border: `1px solid ${designTokens.colors.border}`,
                }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden>
                  {card.icon}
                </span>
                <div>
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{
                      color: designTokens.colors.text.primary,
                      fontFamily: designTokens.typography.fontFamily.mono,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: designTokens.colors.text.secondary }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    );
  }

  // ── Desktop: cinematic 3D explode ──────────────────────────────────────
  return (
    <section
      id="deconstructed-scene"
      style={{ height: '300vh', backgroundColor: designTokens.colors.background }}
    >
      {/* Pinned viewport div */}
      <div
        id="deconstructed-scene-inner"
        className="relative overflow-hidden"
        style={{ height: '100vh', backgroundColor: designTokens.colors.background }}
      >
        {/* Section heading — fades in on scroll enter via GSAP */}
        <div
          className="absolute top-10 left-0 right-0 z-10 text-center pointer-events-none"
          aria-hidden
        >
          <p
            ref={subLabelRef}
            className="text-xs uppercase mb-2"
            style={{
              color: designTokens.colors.accent.primary,
              fontFamily: designTokens.typography.fontFamily.mono,
              letterSpacing: designTokens.typography.letterSpacing.widest,
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            Component Breakdown
          </p>
          <h2
            ref={headingRef}
            className="text-3xl font-semibold"
            style={{
              color: designTokens.colors.text.primary,
              fontFamily: designTokens.typography.fontFamily.heading,
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            Built to Enterprise Spec
          </h2>
        </div>

        {/* R3F Canvas — dramatic lighting setup */}
        <Canvas
          camera={{ position: [0, 0.5, 6], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Subtle depth fog matching background */}
          <fog attach="fog" args={['#0A0A0F', 8, 20]} />

          {/* Ambient — slightly brighter than hero so parts read */}
          <ambientLight intensity={0.2} />

          {/* Main spotlight — warm white, dramatic key light */}
          <spotLight
            position={[5, 5, 5]}
            intensity={2}
            color="#fff8f0"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Fill light — electric indigo from left/below */}
          <pointLight position={[-3, -1, -2]} intensity={0.5} color="#5B6EF5" />

          {/* Rim light from below — cool blue underside glow */}
          <pointLight position={[0, -3, 0]} intensity={0.3} color="#4466cc" />

          <Suspense fallback={null}>
            <ProgressBridge
              progressRef={progressRef}
              staticProgress={staticProgress}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>

        {/* HTML overlay labels */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 }}
          aria-hidden
        >
          {LABELS.map((label, i) => (
            <div
              key={label.id}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute flex items-center"
              style={{
                top: label.top,
                left: label.left,
                opacity: reducedMotion ? 1 : 0,
                willChange: 'opacity, transform',
              }}
            >
              {/* Thin connecting line extending left toward the model */}
              <div
                style={{
                  width: 40,
                  height: 1,
                  backgroundColor: designTokens.colors.accent.primary,
                  opacity: 0.4,
                  flexShrink: 0,
                }}
              />
              {/* Accent dot with layered glow */}
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: designTokens.colors.accent.primary,
                  boxShadow: `0 0 6px 2px rgba(91, 110, 245, 0.55), 0 0 18px rgba(91, 110, 245, 0.2)`,
                  flexShrink: 0,
                  marginLeft: 5,
                  marginRight: 10,
                  display: 'block',
                }}
              />
              {/* Label text — backdrop blur for legibility over 3D */}
              <span
                style={{
                  color: designTokens.colors.text.secondary,
                  fontFamily: designTokens.typography.fontFamily.mono,
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(10, 10, 15, 0.7)',
                  padding: '4px 12px',
                  borderRadius: 4,
                  border: `1px solid rgba(91, 110, 245, 0.18)`,
                  whiteSpace: 'nowrap',
                }}
              >
                {label.text}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
          style={{ zIndex: 10 }}
          aria-hidden
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{
              color: designTokens.colors.text.tertiary,
              fontFamily: designTokens.typography.fontFamily.mono,
              letterSpacing: designTokens.typography.letterSpacing.widest,
            }}
          >
            Scroll to Disassemble
          </span>
          <div
            className="w-px animate-pulse"
            style={{
              height: 32,
              backgroundColor: designTokens.colors.accent.primary,
              opacity: 0.5,
            }}
          />
        </div>
      </div>
    </section>
  );
}
