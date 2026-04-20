'use client';

/**
 * HeroThreeScene — the actual R3F <Canvas> component.
 * Dynamically imported by HeroScene.tsx with `ssr: false`.
 * Kept in a separate file so the Canvas and Three.js bundle are
 * never included in the server-rendered output.
 */

import { Canvas } from '@react-three/fiber';
import { SceneLighting } from './SceneLighting';
import { LaptopModel } from './LaptopModel';
import { designTokens } from '@/lib/design-tokens';

interface HeroThreeSceneProps {
  scrollProgress: number;
  laptopRotation: [number, number, number];
  screenOpen: number;
}

export default function HeroThreeScene({
  scrollProgress,
  laptopRotation,
  screenOpen,
}: HeroThreeSceneProps) {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      style={{ backgroundColor: designTokens.colors.background }}
      camera={{ position: [0, 1, 5], fov: 45 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneLighting progress={scrollProgress} />
      <LaptopModel rotation={laptopRotation} screenOpen={screenOpen} />
    </Canvas>
  );
}
