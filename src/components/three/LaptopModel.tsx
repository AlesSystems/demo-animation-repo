'use client';

import { useRef } from 'react';
import { Group } from 'three';

interface LaptopModelProps {
  /** Euler rotation applied to the whole model in radians */
  rotation?: [number, number, number];
  /** 0 = closed flat, 1 = fully open (~110°) */
  screenOpen?: number;
}

const MAX_SCREEN_ANGLE = (110 * Math.PI) / 180; // 110° in radians

/**
 * Procedural laptop built from R3F primitives — no external model file needed.
 * All dimensions are in Three.js world units.
 */
export function LaptopModel({ rotation = [0, 0, 0], screenOpen = 0 }: LaptopModelProps) {
  const groupRef = useRef<Group>(null);

  // Screen lid pivots backward from the rear edge of the base.
  // Base depth = 2 units; hinge sits at z = +1 (rear edge).
  // Pivot point is at the bottom edge of the screen panel.
  const screenAngle = screenOpen * MAX_SCREEN_ANGLE;

  return (
    <group ref={groupRef} rotation={rotation}>
      {/* ── Base / Chassis ──────────────────────────────────────── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.15, 2]} />
        <meshStandardMaterial
          color="#1a1a25"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* ── Keyboard deck (slightly raised surface on top) ──────── */}
      <mesh castShadow receiveShadow position={[0, 0.09, 0.1]}>
        <boxGeometry args={[2.6, 0.02, 1.5]} />
        <meshStandardMaterial
          color="#141420"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* ── Trackpad ─────────────────────────────────────────────── */}
      <mesh receiveShadow position={[0, 0.1, 0.65]}>
        <boxGeometry args={[0.7, 0.01, 0.45]} />
        <meshStandardMaterial
          color="#1e1e2e"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* ── Hinge (small cylinder at rear edge) ─────────────────── */}
      <mesh castShadow position={[0, 0.09, -1]}>
        <cylinderGeometry args={[0.04, 0.04, 2.6, 16]} />
        <meshStandardMaterial
          color="#0e0e18"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* ── Screen assembly — pivot group at hinge position ──────── */}
      {/*
        The group origin sits at the hinge (rear-bottom of screen).
        We rotate the group around X to open the lid.
        Negative angle = opens backward (tilts away from viewer).
      */}
      <group position={[0, 0.075, -1]} rotation={[-screenAngle, 0, 0]}>
        {/* Screen back panel */}
        <mesh castShadow receiveShadow position={[0, 0.9, -0.025]}>
          <boxGeometry args={[2.8, 1.8, 0.05]} />
          <meshStandardMaterial
            color="#12121a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Screen display (inner emissive face) */}
        <mesh receiveShadow position={[0, 0.9, 0.001]}>
          <boxGeometry args={[2.6, 1.6, 0.01]} />
          <meshStandardMaterial
            color="#0a0a1a"
            emissive="#5B6EF5"
            emissiveIntensity={0.15 * screenOpen}
          />
        </mesh>

        {/* Thin bezel highlight — top edge */}
        <mesh position={[0, 1.82, -0.025]}>
          <boxGeometry args={[2.8, 0.04, 0.06]} />
          <meshStandardMaterial color="#0e0e18" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
