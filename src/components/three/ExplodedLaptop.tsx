'use client';

import { useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplodedLaptopProps {
  progress: number;
  reducedMotion?: boolean;
}

// Ease-out cubic for organic separation curves
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const { lerp } = THREE.MathUtils;

// Mulberry32 seeded PRNG — deterministic, never Math.random()
function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── KeyGrid — improved with per-key height variation and blue emissive ───────
function KeyGrid({ emissiveIntensity }: { emissiveIntensity: number }) {
  const rng = mulberry32(42);
  const cols = 7;
  const rows = 3;
  const kw = 0.27;
  const kh = 0.19;
  const gapX = 0.37;
  const gapZ = 0.28;
  const startX = -((cols - 1) * gapX) / 2;
  const startZ = -((rows - 1) * gapZ) / 2;

  const keys = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const keyHeight = 0.026 + rng() * 0.009;
      keys.push(
        <mesh
          key={`k-${r}-${c}`}
          position={[startX + c * gapX, 0.044 + keyHeight / 2, startZ + r * gapZ]}
          castShadow
        >
          <boxGeometry args={[kw, keyHeight, kh]} />
          <meshStandardMaterial
            color="#1c1c2c"
            metalness={0.3}
            roughness={0.72}
            emissive="#2a40d8"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      );
    }
  }
  return <>{keys}</>;
}

// ─── BoardComponents — PCB traces, glowing chips, gold contact pads ───────────
function BoardComponents({ glowIntensity }: { glowIntensity: number }) {
  const chips = [
    { x: -0.58, z: -0.38, w: 0.42, d: 0.27, h: 0.07, color: '#0c2810', emissive: '#00ff44' },
    { x: 0.28, z: 0.18, w: 0.34, d: 0.30, h: 0.08, color: '#0a2010', emissive: '#00cc33' },
    { x: 0.82, z: -0.28, w: 0.48, d: 0.22, h: 0.06, color: '#102a10', emissive: '#00ff55' },
    { x: -0.22, z: 0.48, w: 0.26, d: 0.26, h: 0.09, color: '#081508', emissive: '#44ff55' },
    { x: 0.55, z: 0.52, w: 0.22, d: 0.18, h: 0.05, color: '#0e260e', emissive: '#00dd33' },
  ] as const;

  const caps = [
    { x: -0.88, z: 0.28 },
    { x: -0.68, z: -0.12 },
    { x: 0.58, z: 0.42 },
    { x: 0.88, z: 0.08 },
    { x: -0.3, z: -0.52 },
  ];

  // Gold contact pads
  const pads: [number, number][] = [
    [-0.82, 0.33], [-0.67, 0.33], [-0.52, 0.33],
    [0.48, -0.42], [0.63, -0.42], [0.78, -0.42],
    [-0.88, -0.22], [0.88, 0.22],
  ];

  const hTraces = [-0.44, -0.14, 0.14, 0.44];
  const vTraces = [-0.58, -0.18, 0.22, 0.62];

  return (
    <>
      {/* Horizontal PCB traces */}
      {hTraces.map((z, i) => (
        <mesh key={`th-${i}`} position={[0, 0.017, z]}>
          <boxGeometry args={[2.15, 0.002, 0.005]} />
          <meshStandardMaterial
            color="#0c3818"
            emissive="#00ff44"
            emissiveIntensity={glowIntensity * 0.35}
          />
        </mesh>
      ))}
      {/* Vertical PCB traces */}
      {vTraces.map((x, i) => (
        <mesh key={`tv-${i}`} position={[x, 0.017, 0]}>
          <boxGeometry args={[0.005, 0.002, 1.48]} />
          <meshStandardMaterial
            color="#0c3818"
            emissive="#00ff44"
            emissiveIntensity={glowIntensity * 0.35}
          />
        </mesh>
      ))}
      {/* IC chips with green emissive glow */}
      {chips.map((c, i) => (
        <mesh key={`chip-${i}`} position={[c.x, 0.03, c.z]} castShadow>
          <boxGeometry args={[c.w, c.h, c.d]} />
          <meshStandardMaterial
            color={c.color}
            metalness={0.42}
            roughness={0.38}
            emissive={c.emissive}
            emissiveIntensity={glowIntensity * 0.5}
          />
        </mesh>
      ))}
      {/* Capacitors */}
      {caps.map((c, i) => (
        <mesh key={`cap-${i}`} position={[c.x, 0.05, c.z]} castShadow>
          <cylinderGeometry args={[0.038, 0.038, 0.075, 8]} />
          <meshStandardMaterial
            color="#152210"
            metalness={0.3}
            roughness={0.5}
            emissive="#003300"
            emissiveIntensity={glowIntensity * 0.25}
          />
        </mesh>
      ))}
      {/* Gold contact pads */}
      {pads.map(([x, z], i) => (
        <mesh key={`pad-${i}`} position={[x, 0.015, z]}>
          <boxGeometry args={[0.065, 0.002, 0.042]} />
          <meshStandardMaterial color="#B8860B" metalness={0.88} roughness={0.12} />
        </mesh>
      ))}
    </>
  );
}

// ─── ExplodedLaptop ───────────────────────────────────────────────────────────
export function ExplodedLaptop({ progress, reducedMotion = false }: ExplodedLaptopProps) {
  const groupRef      = useRef<THREE.Group>(null);
  const screenRef     = useRef<THREE.Group>(null);
  const keyboardRef   = useRef<THREE.Group>(null);
  const moboRef       = useRef<THREE.Group>(null);
  const batteryRef    = useRef<THREE.Group>(null);
  const chassisRef    = useRef<THREE.Group>(null);

  // Material refs for dynamic emissive ramp driven in useFrame
  const displayMatRef   = useRef<THREE.MeshStandardMaterial>(null);
  const glowPlaneMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Keep progress in ref so useFrame always reads latest without re-subscribe
  const progressRef = useRef(progress);
  useLayoutEffect(() => {
    progressRef.current = progress;
  });

  const timeRef = useRef(0);

  useFrame((_, delta) => {
    const raw = Math.max(0, Math.min(1, progressRef.current));
    const pe = easeOutCubic(raw);

    // Slow continuous Y rotation — skip for reduced motion
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }

    // Breathing amplitude scales with eased progress
    const breathAmp = reducedMotion ? 0 : pe * 0.024;
    if (!reducedMotion) timeRef.current += delta;
    const t = timeRef.current;

    // ── Screen / Display ──────────────────────────────────────────────────
    if (screenRef.current) {
      screenRef.current.position.set(
        0,
        lerp(0.8, 3.5, pe) + Math.sin(t * 0.65) * breathAmp,
        0
      );
      screenRef.current.rotation.set(
        lerp(0, -0.3, pe),
        0,
        lerp(0, 0.04, pe) + Math.sin(t * 0.38) * breathAmp * 0.25
      );
    }

    // Emissive ramps driven per-frame (avoids React re-renders)
    if (displayMatRef.current) {
      displayMatRef.current.emissiveIntensity = lerp(0.15, 0.6, pe);
    }
    if (glowPlaneMatRef.current) {
      glowPlaneMatRef.current.opacity = lerp(0.02, 0.1, pe);
    }

    // ── Keyboard Deck ─────────────────────────────────────────────────────
    if (keyboardRef.current) {
      keyboardRef.current.position.set(
        lerp(0, -0.15, pe) + Math.sin(t * 0.48 + 1.2) * breathAmp * 0.5,
        lerp(0.15, 1.5, pe) + Math.sin(t * 0.54 + 0.5) * breathAmp,
        0
      );
      keyboardRef.current.rotation.set(
        lerp(0, 0.15, pe),
        0,
        Math.sin(t * 0.34 + 2.0) * breathAmp * 0.18
      );
    }

    // ── Motherboard ───────────────────────────────────────────────────────
    if (moboRef.current) {
      moboRef.current.position.set(
        lerp(0, 0.2, pe) + Math.sin(t * 0.44 + 0.8) * breathAmp * 0.38,
        lerp(0.05, -0.5, pe) + Math.sin(t * 0.58 + 1.5) * breathAmp * 0.65,
        0
      );
      moboRef.current.rotation.set(
        0,
        0,
        lerp(0, 0.12, pe) + Math.sin(t * 0.28 + 0.5) * breathAmp * 0.28
      );
    }

    // ── Battery ───────────────────────────────────────────────────────────
    if (batteryRef.current) {
      batteryRef.current.position.set(
        lerp(0, -0.4, pe) + Math.sin(t * 0.5 + 2.1) * breathAmp * 0.45,
        lerp(-0.05, -2.0, pe) + Math.sin(t * 0.68 + 0.3) * breathAmp,
        0.3
      );
      batteryRef.current.rotation.set(
        0,
        0,
        lerp(0, -0.08, pe) + Math.sin(t * 0.38 + 1.0) * breathAmp * 0.18
      );
    }

    // ── Chassis / Bottom ──────────────────────────────────────────────────
    if (chassisRef.current) {
      chassisRef.current.position.set(
        lerp(0, 0.1, pe) + Math.sin(t * 0.44 + 1.8) * breathAmp * 0.38,
        lerp(-0.15, -3.5, pe) + Math.sin(t * 0.58 + 2.5) * breathAmp,
        0
      );
      chassisRef.current.rotation.set(
        lerp(0, -0.1, pe),
        0,
        Math.sin(t * 0.32 + 0.7) * breathAmp * 0.18
      );
    }
  });

  // Compute pe for JSX-driven props (emissive on sub-components, etc.)
  const p  = Math.max(0, Math.min(1, progress));
  const pe = easeOutCubic(p);

  return (
    <group ref={groupRef}>

      {/* ── 1 — Screen / Display ───────────────────────────────────────── */}
      <group ref={screenRef}>
        {/* Soft glow halo behind display */}
        <mesh position={[0, 0, -0.03]} renderOrder={-1}>
          <planeGeometry args={[3.5, 2.3]} />
          <meshBasicMaterial
            ref={glowPlaneMatRef}
            color="#5B6EF5"
            transparent
            opacity={0.02}
            depthWrite={false}
          />
        </mesh>
        {/* Outer lid — very dark metallic */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.8, 0.05]} />
          <meshStandardMaterial color="#12121a" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Thin bezel frame */}
        <mesh position={[0, 0, 0.027]} castShadow>
          <boxGeometry args={[2.72, 1.72, 0.008]} />
          <meshStandardMaterial color="#0c0c16" metalness={0.75} roughness={0.22} />
        </mesh>
        {/* Inner display panel — emissive ramp driven by displayMatRef in useFrame */}
        <mesh position={[0, 0, 0.032]} castShadow receiveShadow>
          <boxGeometry args={[2.56, 1.58, 0.006]} />
          <meshStandardMaterial
            ref={displayMatRef}
            color="#0a0a14"
            emissive="#5B6EF5"
            emissiveIntensity={0.15}
            metalness={0.05}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* ── 2 — Keyboard Deck ──────────────────────────────────────────── */}
      <group ref={keyboardRef}>
        {/* Main deck body — dark anthracite */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 0.09, 2]} />
          <meshStandardMaterial color="#1a1a25" metalness={0.75} roughness={0.35} />
        </mesh>
        {/* Top surface — marginally lighter */}
        <mesh position={[0, 0.046, 0]}>
          <boxGeometry args={[2.9, 0.004, 1.9]} />
          <meshStandardMaterial color="#1d1d2a" metalness={0.65} roughness={0.4} />
        </mesh>
        <KeyGrid emissiveIntensity={lerp(0, 0.05, pe)} />
        {/* Touchpad */}
        <mesh position={[0, 0.047, 0.53]} castShadow>
          <boxGeometry args={[0.88, 0.004, 0.52]} />
          <meshStandardMaterial color="#141420" metalness={0.55} roughness={0.28} />
        </mesh>
      </group>

      {/* ── 3 — Motherboard ────────────────────────────────────────────── */}
      <group ref={moboRef}>
        {/* PCB base — deep green */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.032, 1.6]} />
          <meshStandardMaterial color="#0a3a1a" metalness={0.3} roughness={0.6} />
        </mesh>
        <BoardComponents glowIntensity={lerp(0, 1, pe)} />
      </group>

      {/* ── 4 — Battery ────────────────────────────────────────────────── */}
      <group ref={batteryRef}>
        {/* Main body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.09, 0.82]} />
          <meshStandardMaterial color="#1a1a2a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Cells — meshPhysicalMaterial with clearcoat for premium finish */}
        {([-0.62, 0, 0.62] as const).map((xOffset, i) => (
          <mesh key={`cell-${i}`} position={[xOffset, 0.05, 0]} castShadow>
            <boxGeometry args={[0.44, 0.04, 0.66]} />
            <meshPhysicalMaterial
              color="#1e1e3a"
              metalness={0.62}
              roughness={0.22}
              clearcoat={0.9}
              clearcoatRoughness={0.05}
              emissive="#1a1aaa"
              emissiveIntensity={lerp(0, 0.08, pe)}
            />
          </mesh>
        ))}
        {/* Cell dividers */}
        {[-0.32, 0.32].map((x, i) => (
          <mesh key={`div-${i}`} position={[x, 0.05, 0]}>
            <boxGeometry args={[0.008, 0.042, 0.67]} />
            <meshStandardMaterial color="#09090f" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}
      </group>

      {/* ── 5 — Chassis / Bottom ───────────────────────────────────────── */}
      <group ref={chassisRef}>
        {/* Main chassis — brushed metal */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 0.13, 2]} />
          <meshStandardMaterial color="#1a1a25" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Brushed top surface */}
        <mesh position={[0, 0.066, 0]}>
          <boxGeometry args={[2.94, 0.003, 1.94]} />
          <meshStandardMaterial color="#1d1d2a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 5 ventilation slots — dark interior */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((xOffset, i) => (
          <mesh key={`vent-${i}`} position={[xOffset, -0.066, 0.76]}>
            <boxGeometry args={[0.055, 0.008, 0.44]} />
            <meshStandardMaterial color="#06060e" metalness={0.95} roughness={0.08} />
          </mesh>
        ))}
        {/* Rubber feet — matte black */}
        {[[-1.25, 0.82], [1.25, 0.82], [-1.25, -0.82], [1.25, -0.82]].map(
          ([fx, fz], i) => (
            <mesh key={`foot-${i}`} position={[fx, -0.076, fz]} castShadow>
              <cylinderGeometry args={[0.065, 0.065, 0.018, 10]} />
              <meshStandardMaterial color="#040404" metalness={0.04} roughness={0.96} />
            </mesh>
          )
        )}
      </group>

    </group>
  );
}
