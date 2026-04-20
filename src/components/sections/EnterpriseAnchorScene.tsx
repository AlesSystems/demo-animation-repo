'use client';

import { useEffect } from 'react';
import { gsap, gsapEasing } from '@/lib/animations/gsap-config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/Button';
import { designTokens } from '@/lib/design-tokens';

const { colors } = designTokens;

const SUBTITLE_WORDS = 'Secure Your Enterprise'.split(' ');

const TRUST_INDICATORS = [
  'ISO 27001',
  'Yetkili Distribütör',
  '7/24 Destek',
];

export function EnterpriseAnchorScene() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const trigger = {
      trigger: '#enterprise-scene',
      start: 'top 60%',
      toggleActions: 'play none none none' as const,
    };

    const ctx = gsap.context(() => {
      // 1. Decorative top line
      gsap.from('#deco-line-top', {
        scrollTrigger: trigger,
        width: 0,
        opacity: 0,
        duration: 0.4,
        ease: gsapEasing.smooth,
      });

      // 2. Diamond accent shape
      gsap.from('#deco-diamond', {
        scrollTrigger: trigger,
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: gsapEasing.spring,
        delay: 0.15,
      });

      // 3. Turkish headline — blur + scale + y entrance
      gsap.from('#headline-tr', {
        scrollTrigger: trigger,
        filter: 'blur(8px)',
        scale: 1.08,
        y: -60,
        opacity: 0,
        duration: 0.9,
        ease: gsapEasing.cinematic,
        delay: 0.2,
      });

      // 4. Subtitle word-by-word stagger
      gsap.from('.subtitle-word', {
        scrollTrigger: trigger,
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: gsapEasing.decelerate,
        stagger: 0.08,
        delay: 0.55,
      });

      // 5. Side decorative lines flanking CTA
      gsap.from('.deco-side-line', {
        scrollTrigger: trigger,
        width: 0,
        opacity: 0,
        duration: 0.4,
        ease: gsapEasing.smooth,
        stagger: 0.05,
        delay: 0.8,
      });

      // 6. CTA button
      gsap.from('#cta-button', {
        scrollTrigger: trigger,
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: gsapEasing.smooth,
        delay: 0.65,
      });

      // 7. Location tag
      gsap.from('#location-tag', {
        scrollTrigger: trigger,
        opacity: 0,
        duration: 0.3,
        ease: gsapEasing.smooth,
        delay: 0.9,
      });

      // 8. Trust indicators
      gsap.from('.trust-indicator', {
        scrollTrigger: trigger,
        opacity: 0,
        duration: 0.3,
        ease: gsapEasing.smooth,
        stagger: 0.1,
        delay: 1.1,
      });
    });

    return () => ctx.revert(); // ERR-003 cleanup
  }, [reducedMotion]);

  return (
    <section
      id="enterprise-scene"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
      style={{
        background: [
          `radial-gradient(ellipse at center top, rgba(91, 110, 245, 0.06) 0%, transparent 50%)`,
          `radial-gradient(ellipse at 30% 70%, rgba(139, 92, 246, 0.04) 0%, transparent 40%)`,
          colors.background,
        ].join(', '),
      }}
    >
      {/* Content — max-width constrained */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">

        {/* Decorative top line */}
        <div
          id="deco-line-top"
          style={{
            width: '120px',
            height: '1px',
            background: `rgba(91, 110, 245, 0.2)`,
          }}
        />

        {/* Diamond accent */}
        <div
          id="deco-diamond"
          className="mt-8"
          style={{
            width: '8px',
            height: '8px',
            background: colors.accent.primary,
            opacity: 0.3,
            transform: 'rotate(45deg)',
          }}
        />

        {/* Turkish primary headline */}
        <h2
          id="headline-tr"
          className="mt-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          style={{
            color: colors.text.primary,
            fontFamily: designTokens.typography.fontFamily.heading,
          }}
        >
          Kurumsal Güvenliğinizi Sağlayın
        </h2>

        {/* English subtitle — word-by-word spans */}
        <p
          id="headline-en"
          className="mt-4 text-lg md:text-xl lg:text-2xl"
          style={{ color: colors.text.secondary }}
        >
          {SUBTITLE_WORDS.map((word, i) => (
            <span
              key={i}
              className="subtitle-word inline-block"
              style={{ marginRight: i < SUBTITLE_WORDS.length - 1 ? '0.35em' : 0 }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* CTA area — side lines + button */}
        <div className="mt-10 flex w-full items-center justify-center gap-4">
          {/* Left decorative line */}
          <div
            className="deco-side-line hidden sm:block"
            style={{
              width: '40px',
              height: '1px',
              background: `rgba(91, 110, 245, 0.15)`,
              flexShrink: 0,
            }}
          />

          {/* CTA button with glow wrapper */}
          <div
            id="cta-button"
            style={{
              boxShadow:
                '0 0 30px rgba(91, 110, 245, 0.15), 0 0 60px rgba(91, 110, 245, 0.05)',
              borderRadius: designTokens.borderRadius.lg,
            }}
          >
            <Button
              href="/quote"
              variant="primary"
              size="lg"
              className={reducedMotion ? '' : 'animate-pulse-glow'}
            >
              Teklif Alın / Request a Quote
            </Button>
          </div>

          {/* Right decorative line */}
          <div
            className="deco-side-line hidden sm:block"
            style={{
              width: '40px',
              height: '1px',
              background: `rgba(91, 110, 245, 0.15)`,
              flexShrink: 0,
            }}
          />
        </div>

        {/* Location tag */}
        <p
          id="location-tag"
          className="mt-8 text-xs"
          style={{ color: colors.text.tertiary }}
        >
          Lefkoşa, KKTC
        </p>

        {/* Trust indicators */}
        <div className="mt-6 flex items-center justify-center gap-0">
          {TRUST_INDICATORS.map((item, i) => (
            <span key={item} className="trust-indicator flex items-center">
              <span
                className="text-xs"
                style={{ color: colors.text.tertiary }}
              >
                {item}
              </span>
              {i < TRUST_INDICATORS.length - 1 && (
                <span
                  className="mx-3 inline-block"
                  style={{
                    width: '1px',
                    height: '10px',
                    background: colors.text.tertiary,
                    opacity: 0.4,
                  }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
