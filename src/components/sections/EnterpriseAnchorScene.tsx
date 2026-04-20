'use client';

import { useEffect } from 'react';
import { gsap, gsapEasing } from '@/lib/animations/gsap-config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/Button';

export function EnterpriseAnchorScene() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Turkish headline slams in
      gsap.from('#headline-tr', {
        scrollTrigger: {
          trigger: '#enterprise-scene',
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
        y: -80,
        scale: 1.15,
        opacity: 0,
        duration: 0.8,
        ease: gsapEasing.cinematic,
      });

      // English subtitle follows
      gsap.from('#headline-en', {
        scrollTrigger: {
          trigger: '#enterprise-scene',
          start: 'top 55%',
          toggleActions: 'play none none none',
        },
        y: -40,
        opacity: 0,
        duration: 0.6,
        ease: gsapEasing.decelerate,
        delay: 0.3,
      });

      // CTA slides up
      gsap.from('#cta-button', {
        scrollTrigger: {
          trigger: '#enterprise-scene',
          start: 'top 50%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: gsapEasing.smooth,
        delay: 0.6,
      });
    });

    return () => ctx.revert(); // ERR-003 cleanup
  }, [reducedMotion]);

  return (
    <section
      id="enterprise-scene"
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{
        background:
          'radial-gradient(ellipse at center top, rgba(91, 110, 245, 0.08) 0%, #0A0A0F 60%)',
      }}
    >
      {/* Decorative horizontal line */}
      <div
        className="mb-8"
        style={{
          width: '120px',
          height: '1px',
          background: 'rgba(91, 110, 245, 0.2)',
        }}
      />

      {/* Turkish primary headline */}
      <h2
        id="headline-tr"
        className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
      >
        Kurumsal Güvenliğinizi Sağlayın
      </h2>

      {/* English subtitle */}
      <p
        id="headline-en"
        className="mt-4 text-xl text-neutral-400 md:text-2xl"
      >
        Secure Your Enterprise
      </p>

      {/* CTA button */}
      <div id="cta-button" className="mt-10">
        <Button
          href="/quote"
          variant="primary"
          size="lg"
          className={reducedMotion ? '' : 'animate-pulse-glow'}
        >
          Teklif Alın / Request a Quote
        </Button>
      </div>

      {/* Location tag */}
      <p className="mt-6 text-xs text-neutral-600">Lefkoşa, KKTC</p>
    </section>
  );
}
