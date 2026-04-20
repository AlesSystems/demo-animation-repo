'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations/gsap-config';
import { designTokens } from '@/lib/design-tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { colors, animation, typography } = designTokens;

// ── Types ──────────────────────────────────────────────────────────────────────
interface CityConfig {
  id: string;
  name: string;
  cx: number;
  cy: number;
  icon: 'laptop' | 'camera' | 'accesspoint';
  // Label
  labelX: number;
  labelY: number;
  labelAnchor: 'start' | 'middle' | 'end';
  // Connector line from node edge to label
  connectorX1: number;
  connectorY1: number;
  connectorX2: number;
  connectorY2: number;
  // Product icon anchor
  iconX: number;
  iconY: number;
}

// ── City definitions ───────────────────────────────────────────────────────────
const CITIES: CityConfig[] = [
  {
    id: 'lefkosa',
    name: 'Lefkoşa',
    cx: 400, cy: 200,
    icon: 'laptop',
    labelX: 382, labelY: 226, labelAnchor: 'end',
    connectorX1: 394, connectorY1: 206, connectorX2: 386, connectorY2: 219,
    iconX: 432, iconY: 172,
  },
  {
    id: 'girne',
    name: 'Girne',
    cx: 330, cy: 148,
    icon: 'camera',
    labelX: 313, labelY: 130, labelAnchor: 'end',
    connectorX1: 325, connectorY1: 143, connectorX2: 317, connectorY2: 134,
    iconX: 298, iconY: 115,
  },
  {
    id: 'gazimagusa',
    name: 'Gazimağusa',
    cx: 640, cy: 195,
    icon: 'accesspoint',
    labelX: 660, labelY: 199, labelAnchor: 'start',
    connectorX1: 645, connectorY1: 195, connectorX2: 657, connectorY2: 196,
    iconX: 668, iconY: 166,
  },
];

// ── Connection paths ───────────────────────────────────────────────────────────
const CONNECTIONS = [
  { id: 'line-lefkosa-girne',      d: 'M400,200 C380,185 360,165 330,148' },
  { id: 'line-lefkosa-gazimagusa', d: 'M400,200 C470,195 545,192 640,195' },
  { id: 'line-girne-gazimagusa',   d: 'M330,148 C420,135 530,138 640,195' },
] as const;

// Staggered offsets for data-flow dots along each connection path
const DOT_OFFSETS = [0.08, 0.41, 0.74] as const;

// ── Icon sub-components ────────────────────────────────────────────────────────

function LaptopIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      className="product-icon"
      transform={`translate(${x - 12}, ${y - 12})`}
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* Screen */}
      <rect x="2" y="1" width="20" height="14" rx="1.5"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" />
      {/* Screen inner bezel */}
      <rect x="4" y="3" width="16" height="10" rx="0.5"
        stroke={colors.accent.primary} strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
      {/* Hinge */}
      <line x1="2" y1="15" x2="22" y2="15"
        stroke={colors.accent.primary} strokeWidth="0.5" strokeOpacity="0.4" />
      {/* Base */}
      <path d="M1,15 L1,17 Q1,18 2,18 L22,18 Q23,18 23,17 L23,15"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" strokeLinejoin="round" />
      {/* Keyboard notch */}
      <path d="M9,18 L9,19.5 Q9,20.5 10,20.5 L14,20.5 Q15,20.5 15,19.5 L15,18"
        stroke={colors.accent.primary} strokeWidth="0.8" fill="none" />
    </g>
  );
}

function CameraIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      className="product-icon"
      transform={`translate(${x - 12}, ${y - 12})`}
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* Mount arm */}
      <rect x="10" y="1" width="4" height="7" rx="1"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" />
      {/* Base plate */}
      <rect x="3" y="7" width="18" height="3" rx="1.5"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" />
      {/* Dome arc */}
      <path d="M4,10 Q12,22 20,10"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Lens ring */}
      <circle cx="12" cy="13.5" r="3"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" />
      {/* Lens center */}
      <circle cx="12" cy="13.5" r="1"
        fill={colors.accent.primary} fillOpacity="0.5" />
    </g>
  );
}

function AccessPointIcon({ x, y }: { x: number; y: number }) {
  return (
    <g
      className="product-icon"
      transform={`translate(${x - 12}, ${y - 12})`}
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* Center dot */}
      <circle cx="12" cy="16" r="1.5"
        fill={colors.accent.primary} />
      {/* Inner arc */}
      <path d="M7.5,12.5 A6.4,6.4 0 0 1 16.5,12.5"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Middle arc */}
      <path d="M4,8.5 A11.3,11.3 0 0 1 20,8.5"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Outer arc */}
      <path d="M0.5,4.5 A16.5,16.5 0 0 1 23.5,4.5"
        stroke={colors.accent.primary} strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function NetworkGridScene() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    // Tweens created outside gsap.context (in onUpdate callback) — tracked manually
    const dataFlowTweens: Array<{ kill: () => void }> = [];

    function startDataFlow(svgEl: SVGSVGElement) {
      CONNECTIONS.forEach((conn, ci) => {
        const path = svgEl.querySelector<SVGPathElement>(`#${conn.id}`);
        if (!path) return;
        const totalLength = path.getTotalLength();

        DOT_OFFSETS.forEach((startOffset, di) => {
          const dot = svgEl.querySelector<SVGCircleElement>(`#dot-${ci}-${di}`);
          if (!dot) return;

          // Snap dot to its starting position before animating
          const startPt = path.getPointAtLength(startOffset * totalLength);
          dot.setAttribute('cx', String(startPt.x));
          dot.setAttribute('cy', String(startPt.y));

          // Proxy object drives the path-tracing progress
          const proxy = { progress: startOffset };

          const moveTween = gsap.to(proxy, {
            progress: startOffset + 1,
            duration: 2.8 + ci * 0.35,
            repeat: -1,
            ease: 'none',
            delay: di * 0.25,
            onUpdate() {
              // Modulo wrap keeps progress in [0, 1)
              const t = ((proxy.progress % 1) + 1) % 1;
              const pt = path.getPointAtLength(t * totalLength);
              dot.setAttribute('cx', String(pt.x));
              dot.setAttribute('cy', String(pt.y));
            },
          });

          const fadeTween = gsap.to(dot, {
            opacity: 0.55,
            duration: 0.5,
            delay: di * 0.25 + 0.15,
            ease: animation.ease.decelerate.css,
          });

          dataFlowTweens.push(moveTween, fadeTween);
        });
      });
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Measure paths and initialise dashoffset ──
      const lines = section.querySelectorAll<SVGPathElement>('.network-line');
      lines.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const glowLines = section.querySelectorAll<SVGPathElement>('.network-line-glow');
      glowLines.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { opacity: 0, strokeDasharray: length, strokeDashoffset: length });
      });

      // ── Scrubbed scroll timeline ──
      let dataFlowStarted = false;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#network-scene',
          start: 'top top',
          end: '+=100%',
          pin: '#network-scene-inner',
          scrub: 1,
          anticipatePin: 1,
          onUpdate(self) {
            // Start data-flow dots once lines are fully drawn (~65% scroll)
            if (self.progress >= 0.65 && !dataFlowStarted) {
              dataFlowStarted = true;
              const svgEl = section.querySelector<SVGSVGElement>('#trnc-map');
              if (svgEl) startDataFlow(svgEl);
            }
          },
        },
      });

      // 0–15%: Map outline fades in + subtle scale
      tl.fromTo(
        '#trnc-map',
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.15, ease: animation.ease.cinematic.css },
        0,
      );

      // 15–30%: City nodes scale in with spring ease, staggered
      tl.fromTo(
        '.city-node',
        { opacity: 0, scale: 0 },
        {
          opacity: 1, scale: 1,
          stagger: 0.05, duration: 0.12,
          ease: animation.ease.spring.css,
          transformOrigin: 'center center',
        },
        0.15,
      );

      // 30–65%: Connection lines draw (main + glow), staggered
      tl.to(
        '.network-line',
        { strokeDashoffset: 0, stagger: 0.08, duration: 0.28, ease: animation.ease.smooth.css },
        0.3,
      );
      tl.to(
        '.network-line-glow',
        { opacity: 0.15, strokeDashoffset: 0, stagger: 0.08, duration: 0.28, ease: animation.ease.smooth.css },
        0.3,
      );

      // 65–80%: Product icons fade in with slight upward float
      tl.fromTo(
        '.product-icon',
        { opacity: 0, y: 8 },
        {
          opacity: 1, y: 0,
          stagger: 0.05, duration: 0.12,
          ease: animation.ease.decelerate.css,
        },
        0.65,
      );

      // 80–100%: Scene title letter-spacing entrance
      tl.fromTo(
        '#network-scene-title',
        { opacity: 0, y: 14, letterSpacing: '0.15em' },
        { opacity: 1, y: 0, letterSpacing: '0.1em', duration: 0.15, ease: animation.ease.cinematic.css },
        0.8,
      );
    }, sectionRef);

    // ERR-003: always clean up context + manually-tracked data-flow tweens
    return () => {
      ctx.revert();
      dataFlowTweens.forEach((t) => t.kill());
    };
  }, [reducedMotion]);

  return (
    <section
      id="network-scene"
      ref={sectionRef}
      style={{ height: '200vh', background: colors.background }}
    >
      {/* CSS keyframes: only for continuous ambient effects, never scroll-driven */}
      <style>{`
        @keyframes ngs-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.22; }
          65%  { transform: scale(1.85); opacity: 0.05; }
          100% { transform: scale(1.85); opacity: 0;    }
        }
        .city-pulse-outer {
          transform-box: fill-box;
          transform-origin: center;
          animation: ngs-pulse-ring 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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
          background: `radial-gradient(ellipse at 50% 45%, rgba(91,110,245,0.045) 0%, transparent 58%), ${colors.background}`,
        }}
      >
        {/* Vignette overlay — darkens edges for cinematic depth */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,15,0.68) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── SVG Map ── */}
        <svg
          id="trnc-map"
          viewBox="0 0 800 400"
          style={{
            width: '90%',
            maxWidth: 900,
            height: 'auto',
            opacity: reducedMotion ? 1 : 0,
            position: 'relative',
            zIndex: 2,
          }}
          aria-label="TRNC Ağ Haritası — Lefkoşa, Girne ve Gazimağusa arasındaki kurumsal ağ bağlantıları"
          role="img"
        >
          <defs>
            {/* City node ambient glow */}
            <filter id="ngs-node-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Blur for connection glow lines */}
            <filter id="ngs-line-glow" x="-5%" y="-200%" width="110%" height="500%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Faint indigo outer glow around the island outline */}
            <filter id="ngs-island-glow" x="-6%" y="-18%" width="112%" height="136%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feFlood floodColor="#5B6EF5" floodOpacity="0.1" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle radial background wash behind the island */}
          <ellipse
            cx="400" cy="200" rx="310" ry="148"
            fill="rgba(91,110,245,0.022)"
            aria-hidden="true"
          />

          {/* ── TRNC main outline — subtle fill + outer island glow ── */}
          <path
            d="M50,200 C80,180 120,160 180,150 C240,140 300,130 360,125 C420,120 480,118 540,120 C600,125 660,135 720,155 C750,165 770,180 750,200 C730,220 700,235 660,240 C620,245 580,248 540,245 C500,242 460,240 420,238 C380,236 340,235 300,238 C260,241 220,245 180,248 C140,250 100,245 70,230 C50,220 45,210 50,200 Z"
            fill="rgba(91, 110, 245, 0.03)"
            stroke="#3A3A45"
            strokeWidth={1.5}
            filter="url(#ngs-island-glow)"
          />

          {/* ── Glow lines (behind crisp lines) — opacity animated by GSAP ── */}
          {CONNECTIONS.map((conn) => (
            <path
              key={`${conn.id}-glow`}
              className="network-line-glow"
              d={conn.d}
              stroke={colors.accent.primary}
              strokeWidth={4}
              strokeOpacity={0.15}
              fill="none"
              strokeLinecap="round"
              filter="url(#ngs-line-glow)"
              aria-hidden="true"
            />
          ))}

          {/* ── Crisp connection lines — dash-drawn by GSAP ScrollTrigger ── */}
          {CONNECTIONS.map((conn) => (
            <path
              key={conn.id}
              id={conn.id}
              className="network-line"
              d={conn.d}
              stroke={colors.accent.primary}
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              aria-hidden="true"
              style={reducedMotion ? { strokeDasharray: 'none' } : undefined}
            />
          ))}

          {/* ── Data flow dots — animated along paths after lines are drawn ── */}
          <g aria-hidden="true">
            {CONNECTIONS.map((_, ci) =>
              DOT_OFFSETS.map((_offset, di) => (
                <circle
                  key={`dot-${ci}-${di}`}
                  id={`dot-${ci}-${di}`}
                  r={3}
                  cx={0}
                  cy={0}
                  fill={colors.accent.primary}
                  opacity={0}
                />
              ))
            )}
          </g>

          {/* ── City nodes — 3-ring design with CSS pulse ── */}
          {CITIES.map((city) => (
            <g
              key={city.id}
              id={`city-${city.id}`}
              className="city-node"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              {/* Animated pulse ring (CSS, ambient — independent of scroll) */}
              <circle
                cx={city.cx} cy={city.cy} r={14}
                fill="none"
                stroke={colors.accent.primary}
                strokeOpacity={0.2}
                strokeWidth={1}
                className="city-pulse-outer"
                aria-hidden="true"
              />
              {/* Outer static ring */}
              <circle
                cx={city.cx} cy={city.cy} r={14}
                fill="none"
                stroke={colors.accent.primary}
                strokeOpacity={0.2}
                strokeWidth={1}
                aria-hidden="true"
              />
              {/* Inner ring */}
              <circle
                cx={city.cx} cy={city.cy} r={9}
                fill="none"
                stroke={colors.accent.primary}
                strokeOpacity={0.4}
                strokeWidth={1}
                aria-hidden="true"
              />
              {/* Core dot with glow */}
              <circle
                cx={city.cx} cy={city.cy} r={5}
                fill={colors.accent.primary}
                filter="url(#ngs-node-glow)"
                aria-label={city.name}
              />
              {/* Connector line from node to label */}
              <line
                x1={city.connectorX1} y1={city.connectorY1}
                x2={city.connectorX2} y2={city.connectorY2}
                stroke={colors.accent.primary}
                strokeWidth={1}
                strokeOpacity={0.3}
                aria-hidden="true"
              />
              {/* City label */}
              <text
                x={city.labelX}
                y={city.labelY}
                fill={colors.text.secondary}
                fontSize={12}
                fontFamily={typography.fontFamily.body}
                fontWeight={typography.fontWeight.medium}
                textAnchor={city.labelAnchor}
                letterSpacing="0.04em"
              >
                {city.name}
              </text>
            </g>
          ))}

          {/* ── Product category icons ── */}
          {CITIES.map((city) => {
            if (city.icon === 'laptop')
              return <LaptopIcon key={city.id} x={city.iconX} y={city.iconY} />;
            if (city.icon === 'camera')
              return <CameraIcon key={city.id} x={city.iconX} y={city.iconY} />;
            return <AccessPointIcon key={city.id} x={city.iconX} y={city.iconY} />;
          })}
        </svg>

        {/* ── Scene title — letterSpacing entrance via GSAP ── */}
        <p
          id="network-scene-title"
          style={{
            marginTop: '2rem',
            color: colors.text.secondary,
            fontSize: '0.75rem',
            fontFamily: typography.fontFamily.heading,
            fontWeight: typography.fontWeight.semibold,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: reducedMotion ? 1 : 0,
            position: 'relative',
            zIndex: 2,
          }}
        >
          Ağ Altyapımız&nbsp;·&nbsp;Connecting TRNC Enterprises
        </p>
      </div>
    </section>
  );
}
