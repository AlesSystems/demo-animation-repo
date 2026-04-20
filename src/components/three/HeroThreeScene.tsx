'use client';

/**
 * HeroThreeScene — R3F Canvas component.
 * Dynamically imported by HeroScene.tsx with `ssr: false`.
 * Reads animation state from heroBridge (module-level mutable object) —
 * no React props needed, no re-renders on scroll.
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneLighting } from './SceneLighting';
import { LaptopGLTF } from './LaptopGLTF';
import { FloatingParticles } from './FloatingParticles';
import { designTokens } from '@/lib/design-tokens';

export default function HeroThreeScene() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      style={{ backgroundColor: designTokens.colors.background }}
      camera={{ position: [0, 0.4, 4.5], fov: 42 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <SceneLighting />
        <LaptopGLTF />
        <FloatingParticles />
      </Suspense>
    </Canvas>
  );
}

