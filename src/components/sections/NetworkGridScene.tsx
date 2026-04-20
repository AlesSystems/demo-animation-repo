'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations/gsap-config';
import { designTokens } from '@/lib/design-tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { colors, animation } = designTokens;

// City node data
const CITIES = [
  { id: 'lefkosa', name: 'Lefkoşa', cx: 400, cy: 200, icon: 'laptop' },
  { id: 'girne', name: 'Girne', cx: 330, cy: 148, icon: 'camera' },
  { id: 'gazimagusa', name: 'Gazimağusa', cx: 640, cy: 195, icon: 'accesspoint' },
] as const;

// Connection line data
const CONNECTIONS = [
  {
    id: 'line-lefkosa-girne',
    d: 'M400,200 C380,185 360,165 330,148',
  },
  {
    id: 'line-lefkosa-gazimagusa',
    d: 'M400,200 C470,195 545,192 640,195',
  },
  {
    id: 'line-girne-gazimagusa',
    d: 'M330,148 C420,135 530,138 640,195',
  },
] as const;

// ── Icon sub-components ───────────────────────────────────────────────────────

function LaptopIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      className="product-icon"
      transform={`translate(${x - 12}, ${y - 12})`}
      style={{ opacity: 0 }}
    >
      {/* Screen */}
      <rect x="3" y="2" width="18" height="12" rx="1.5"
        stroke={colors.accent.primary} strokeWidth="1.5" fill="none" />
      {/* Base */}
      <rect x="1" y="14" width="22" height="2.5" rx="1"
        stroke={colors.accent.primary} strokeWidth="1.5" fill="none" />
    </g>
  );
}

function CameraIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      className="product-icon"
      transform={`translate(${x - 12}, ${y - 12})`}
      style={{ opacity: 0 }}
    >
      {/* Body */}
      <rect x="2" y="6" width="20" height="14" rx="2"
        stroke={colors.accent.primary} strokeWidth="1.5" fill="none" />
      {/* Lens */}
      <circle cx="12" cy="13" r="4"
        stroke={colors.accent.primary} strokeWidth="1.5" fill="none" />
      {/* Viewfinder bump */}
      <rect x="8" y="3" width="5" height="3" rx="1"
        stroke={colors.accent.primary} strokeWidth="1.5" fill="none" />
    </g>
  );
}

function AccessPointIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      className="product-icon"
      transform={`translate(${x - 12}, ${y - 12})`}
      style={{ opacity: 0 }}
    >
      {/* Center dot */}
      <circle cx="12" cy="14" r="2"
        fill={colors.accent.primary} />
      {/* Inner arc */}
      <path d="M8,11 A5.66,5.66 0 0 1 16,11"
        stroke={colors.accent.primary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Outer arc */}
      <path d="M4,8 A11.3,11.3 0 0 1 20,8"
        stroke={colors.accent.primary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function NetworkGridScene() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Measure all path lengths and set dasharray/dashoffset
      const lines = document.querySelectorAll<SVGPathElement>('.network-line');
      lines.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      // Also set glow-line dasharray/dashoffset to match
      const glowLines = document.querySelectorAll<SVGPathElement>('.network-line-glow');
      glowLines.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#network-scene',
          start: 'top top',
          end: '+=100%',
          pin: '#network-scene-inner',
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // 0–20%: Map fades in with slight scale
      tl.fromTo(
        '#trnc-map',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.2, ease: animation.ease.cinematic.css },
      );

      // 20–40%: City nodes pulse in, staggered
      tl.fromTo(
        '.city-node',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.05,
          duration: 0.15,
          ease: animation.ease.spring.css,
          transformOrigin: 'center center',
        },
        0.2,
      );

      // 40–80%: Lines draw (main + glow together)
      tl.to(
        '.network-line, .network-line-glow',
        {
          strokeDashoffset: 0,
          stagger: 0.1,
          duration: 0.3,
          ease: animation.ease.smooth.css,
        },
        0.4,
      );

      // 70–100%: Product icons fade in, staggered
      tl.fromTo(
        '.product-icon',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.15,
          ease: animation.ease.decelerate.css,
        },
        0.7,
      );

      // Scene title fades in last
      tl.fromTo(
        '#network-scene-title',
        { opacity: 0, y: 14, letterSpacing: '0.15em' },
        { opacity: 1, y: 0, letterSpacing: '0.1em', duration: 0.15, ease: animation.ease.cinematic.css },
        0.85,
      );
    }, sectionRef);

    // ERR-003 cleanup — kills timeline + ScrollTrigger on unmount
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="network-scene"
      ref={sectionRef}
      style={{ height: '200vh', background: colors.background }}
    >
      {/* ── Dot-grid background ── */}
      <style>{`
        #network-scene-inner {
          background-image: radial-gradient(circle, ${colors.border} 1px, transparent 1px);
          background-size: 32px 32px;
        }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.35; }
          60%  { transform: scale(1.55); opacity: 0.12; }
          100% { transform: scale(1.55); opacity: 0;    }
        }

        .city-pulse-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse-ring 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .city-pulse-ring:nth-of-type(2) { animation-delay: 0.8s; }
        .city-pulse-ring:nth-of-type(3) { animation-delay: 1.6s; }

        @keyframes glow-breathe {
          0%, 100% { stroke-opacity: 0.15; }
          50%       { stroke-opacity: 0.28; }
        }

        .network-line-glow.drawn {
          animation: glow-breathe 3s ease-in-out infinite;
        }
      `}</style>

      <div
        id="network-scene-inner"
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        {/* ── SVG Map ── */}
        <svg
          id="trnc-map"
          viewBox="0 0 800 400"
          style={{
            width: '90%',
            maxWidth: 900,
            height: 'auto',
            opacity: reducedMotion ? 1 : 0,
          }}
          aria-label="TRNC Network Map"
          role="img"
        >
          <defs>
            {/* Ambient glow filter for nodes */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Blur for glow lines */}
            <filter id="line-glow" x="-10%" y="-200%" width="120%" height="500%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Topographic contour fills ── */}
          {/* Outermost — subtle terrain suggestion */}
          <path
            d="M42,205 C72,183 112,162 172,152 C232,142 292,132 352,127 C412,122 472,120 532,122 C592,127 652,137 712,157 C742,167 762,183 756,205 C748,227 718,242 678,247 C638,252 598,255 558,252 C518,249 478,247 438,245 C398,243 358,242 318,245 C278,248 238,252 198,255 C158,258 118,252 88,237 C62,224 38,215 42,205 Z"
            fill={colors.borderSubtle}
            stroke="none"
            opacity={0.4}
          />
          {/* Middle terrain band */}
          <path
            d="M80,202 C108,186 145,168 200,158 C255,148 310,138 368,133 C426,128 482,126 538,128 C594,133 648,143 700,160 C724,170 740,184 736,202 C728,220 700,233 662,237 C624,241 586,244 548,241 C510,238 472,236 434,234 C396,232 358,231 320,234 C282,237 244,241 206,244 C168,246 130,240 102,226 C82,215 64,210 80,202 Z"
            fill="none"
            stroke={colors.border}
            strokeWidth={0.6}
            opacity={0.5}
          />
          {/* Inner ridge line */}
          <path
            d="M120,200 C148,188 182,174 232,165 C282,156 336,148 390,145 C444,142 498,142 550,146 C602,151 650,161 694,176 C714,184 726,194 722,205 C714,218 692,228 658,232 C624,235 590,238 554,235 C518,232 482,230 446,228 C410,226 374,225 338,228 C302,231 266,235 230,238 C194,240 160,234 136,222 C120,212 108,206 120,200 Z"
            fill="none"
            stroke={colors.border}
            strokeWidth={0.4}
            opacity={0.4}
          />
          {/* Innermost highland ridge */}
          <path
            d="M160,198 C188,188 218,178 264,170 C310,162 360,156 410,153 C460,150 510,150 558,154 C606,159 648,169 682,182 C698,189 706,197 702,207 C696,218 676,226 648,229 C620,232 590,234 558,231 C526,228 494,226 462,224 C430,222 398,221 366,224 C334,227 302,230 270,233 C238,235 208,229 184,218 C168,210 148,203 160,198 Z"
            fill="none"
            stroke={colors.borderSubtle}
            strokeWidth={0.5}
            opacity={0.35}
          />

          {/* ── Main TRNC outline ── */}
          <path
            d="M50,200 C80,180 120,160 180,150 C240,140 300,130 360,125 C420,120 480,118 540,120 C600,125 660,135 720,155 C750,165 770,180 750,200 C730,220 700,235 660,240 C620,245 580,248 540,245 C500,242 460,240 420,238 C380,236 340,235 300,238 C260,241 220,245 180,248 C140,250 100,245 70,230 C50,220 45,210 50,200 Z"
            fill="none"
            stroke="#3A3A45"
            strokeWidth={1.5}
          />

          {/* ── Glow lines (drawn behind crisp lines) ── */}
          {CONNECTIONS.map((conn) => (
            <path
              key={`${conn.id}-glow`}
              className="network-line-glow"
              d={conn.d}
              stroke={colors.accent.primary}
              strokeWidth={6}
              strokeOpacity={reducedMotion ? 0.15 : 0}
              fill="none"
              filter="url(#line-glow)"
              style={{ opacity: reducedMotion ? 1 : undefined }}
            />
          ))}

          {/* ── Crisp connection lines ── */}
          {CONNECTIONS.map((conn) => (
            <path
              key={conn.id}
              id={conn.id}
              className="network-line"
              d={conn.d}
              stroke={colors.accent.primary}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              style={reducedMotion ? { strokeDasharray: 'none' } : undefined}
            />
          ))}

          {/* ── City nodes ── */}
          {CITIES.map((city) => (
            <g
              key={city.id}
              id={`city-${city.id}`}
              className="city-node"
              style={{ opacity: reducedMotion ? 1 : 0 }}
              filter="url(#node-glow)"
            >
              {/* Outer pulse ring */}
              <circle
                cx={city.cx}
                cy={city.cy}
                r={14}
                fill="none"
                stroke={colors.accent.primary}
                strokeOpacity={0.3}
                className="city-pulse-ring"
              />
              {/* Mid ring */}
              <circle
                cx={city.cx}
                cy={city.cy}
                r={10}
                fill="none"
                stroke={colors.accent.primary}
                strokeOpacity={0.2}
                strokeWidth={1}
              />
              {/* Core dot */}
              <circle
                cx={city.cx}
                cy={city.cy}
                r={6}
                fill={colors.accent.primary}
              />
              {/* City label */}
              <text
                x={city.cx + (city.id === 'gazimagusa' ? 10 : -10)}
                y={city.cy - 20}
                fill={colors.text.secondary}
                fontSize={13}
                fontFamily={designTokens.typography.fontFamily.body}
                textAnchor={city.id === 'gazimagusa' ? 'start' : 'end'}
                letterSpacing="0.04em"
              >
                {city.name}
              </text>
            </g>
          ))}

          {/* ── Product category icons ── */}
          {CITIES.map((city) => {
            const offset = city.id === 'gazimagusa' ? { x: 18, y: -8 } : { x: -18, y: -8 };
            const iconX = city.cx + offset.x + (city.id === 'gazimagusa' ? 12 : -12);
            const iconY = city.cy + offset.y + 12;
            if (city.icon === 'laptop') return <LaptopIcon key={city.id} x={iconX} y={iconY} />;
            if (city.icon === 'camera') return <CameraIcon key={city.id} x={iconX} y={iconY} />;
            return <AccessPointIcon key={city.id} x={iconX} y={iconY} />;
          })}
        </svg>

        {/* ── Scene title ── */}
        <p
          id="network-scene-title"
          style={{
            marginTop: '2rem',
            color: colors.text.secondary,
            fontSize: '0.75rem',
            fontFamily: designTokens.typography.fontFamily.heading,
            fontWeight: designTokens.typography.fontWeight.semibold,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          Ağ Altyapımız&nbsp;·&nbsp;Connecting TRNC Enterprises
        </p>
      </div>
    </section>
  );
}
