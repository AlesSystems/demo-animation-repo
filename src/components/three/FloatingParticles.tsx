'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { heroBridge } from '@/lib/animations/hero-bridge';

/**
 * 300 ambient dust/light particles drifting through the spotlight beam.
 * Uses Points + BufferGeometry — no re-renders, all updates in useFrame.
 * Seeded PRNG (mulberry32) — no Math.random() per guidelines.
 */
export function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, colors } = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // mulberry32 seeded PRNG — deterministic, no Math.random()
    let seed = 0x6d2b79f5;
    function rand() {
      seed += 0x6d2b79f5;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    for (let i = 0; i < count; i++) {
      // Uniform sphere distribution
      const phi = Math.acos(2 * rand() - 1);
      const theta = rand() * Math.PI * 2;
      const r = 2.5 + rand() * 2.5; // radius 2.5–5

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // White with subtle blue tint, varying brightness (0.1–0.4 range)
      const brightness = 0.25 + rand() * 0.35;
      colors[i * 3]     = brightness * 0.88; // R — slightly cooler
      colors[i * 3 + 1] = brightness * 0.91; // G
      colors[i * 3 + 2] = brightness;         // B — full for blue cast
    }

    return { positions, colors };
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !matRef.current) return;

    // Slow drift — deterministic rotation
    pointsRef.current.rotation.y += 0.0003;
    pointsRef.current.rotation.x += 0.00008;

    // Fade in across the first 50% of scroll, max opacity 0.4
    const targetOpacity = Math.min((heroBridge.scrollProgress / 0.5) * 0.4, 0.4);
    matRef.current.opacity = targetOpacity;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.022}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
