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

export default function HomePage() {
  return (
    <div className="bg-[#0A0A0F] text-white">
      <HeroScene />
      <DeconstructedScene />
      <NetworkGridScene />
      <EnterpriseAnchorScene />
    </div>
  );
}
