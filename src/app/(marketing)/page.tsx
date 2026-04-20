'use client';

import dynamic from 'next/dynamic';

const HeroScene = dynamic(
  () => import('@/components/sections/HeroScene').then(m => ({ default: m.HeroScene })),
  { ssr: false }
);
const DeconstructedScene = dynamic(
  () => import('@/components/sections/DeconstructedScene').then(m => ({ default: m.DeconstructedScene })),
  { ssr: false }
);
const NetworkGridScene = dynamic(
  () => import('@/components/sections/NetworkGridScene').then(m => ({ default: m.NetworkGridScene })),
  { ssr: false }
);
const EnterpriseAnchorScene = dynamic(
  () => import('@/components/sections/EnterpriseAnchorScene').then(m => ({ default: m.EnterpriseAnchorScene })),
  { ssr: false }
);

/**
 * Gradient divider between scenes — creates visual continuity.
 * Uses a radial glow in the brand accent color to soften boundaries.
 */
function SceneDivider({ variant = 'default' }: { variant?: 'default' | 'glow' | 'fade' }) {
  const gradients: Record<string, string> = {
    default:
      'linear-gradient(to bottom, #0A0A0F, rgba(91,110,245,0.03) 50%, #0A0A0F)',
    glow:
      'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(91,110,245,0.05) 0%, transparent 70%), linear-gradient(to bottom, #0A0A0F, #0A0A0F)',
    fade:
      'linear-gradient(to bottom, transparent, rgba(91,110,245,0.02) 40%, rgba(139,92,246,0.02) 60%, transparent)',
  };

  return (
    <div
      aria-hidden="true"
      style={{
        height: '120px',
        width: '100%',
        background: gradients[variant],
        position: 'relative',
        zIndex: 5,
        marginTop: '-60px',
        marginBottom: '-60px',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#0A0A0F] text-white">
      <HeroScene />
      <SceneDivider variant="glow" />
      <DeconstructedScene />
      <SceneDivider variant="default" />
      <NetworkGridScene />
      <SceneDivider variant="fade" />
      <EnterpriseAnchorScene />
    </div>
  );
}
