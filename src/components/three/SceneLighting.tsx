'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { heroBridge } from '@/lib/animations/hero-bridge';

/**
 * Dramatic multi-light rig:
 * - Very dim ambient (dark room, almost no fill)
 * - Main warm key spotlight (scroll-driven intensity)
 * - Cool blue accent point light (accent color)
 * - Rim directional light from behind (edge definition)
 * - Night environment map (subtle metallic reflections)
 */
export function SceneLighting() {
  const spotRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const progress = heroBridge.scrollProgress;

    if (spotRef.current) {
      // Spotlight fades up 0 → 3.5 over first 60% of scroll
      spotRef.current.intensity = Math.min(progress / 0.6, 1) * 3.5;
    }
    if (fillRef.current) {
      fillRef.current.intensity = Math.min(progress / 0.6, 1) * 0.5;
    }
  });

  return (
    <>
      {/* Very dim ambient — preserves depth without washing out the scene */}
      <ambientLight intensity={0.04} />

      {/* Main warm key spotlight — scroll-driven, starts at 0 */}
      <spotLight
        ref={spotRef}
        position={[5, 5, 5]}
        intensity={0}
        angle={0.45}
        penumbra={0.85}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />

      {/* Cool blue accent fill — matches brand accent color */}
      <pointLight
        ref={fillRef}
        position={[-3, -1, -2]}
        intensity={0}
        color="#5B6EF5"
        distance={12}
        decay={2}
      />

      {/* Rim light from behind — subtle edge definition, always on */}
      <directionalLight
        position={[-2, 3, -5]}
        intensity={0.12}
        color="#e8eeff"
      />

      {/* Night HDRI — provides subtle metallic reflections on laptop surfaces */}
      <Environment preset="night" />
    </>
  );
}

