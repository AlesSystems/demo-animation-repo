'use client';

import { useRef, type ReactElement } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplodedLaptopProps {
  progress: number;
}

// Tiny key representation on keyboard deck
function KeyGrid() {
  const keys: ReactElement[] = [];
  const cols = 6;
  const rows = 3;
  const kw = 0.32;
  const kh = 0.22;
  const gapX = 0.42;
  const gapZ = 0.3;
  const startX = -(cols - 1) * gapX * 0.5;
  const startZ = -(rows - 1) * gapZ * 0.5;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      keys.push(
        <mesh
          key={`key-${r}-${c}`}
          position={[startX + c * gapX, 0.055, startZ + r * gapZ]}
          castShadow
        >
          <boxGeometry args={[kw, 0.04, kh]} />
          <meshStandardMaterial color="#2a2a38" metalness={0.4} roughness={0.6} />
        </mesh>
      );
    }
  }
  return <>{keys}</>;
}

// Small chips/capacitors on motherboard
function BoardComponents() {
  const chips: { x: number; z: number; w: number; d: number; h: number; color: string }[] = [
    { x: -0.6, z: -0.4, w: 0.35, d: 0.25, h: 0.06, color: '#1a3a1a' },
    { x: 0.3, z: 0.2, w: 0.28, d: 0.28, h: 0.07, color: '#0d2a0d' },
    { x: 0.8, z: -0.3, w: 0.45, d: 0.2, h: 0.05, color: '#1a4a1a' },
    { x: -0.2, z: 0.4, w: 0.2, d: 0.2, h: 0.08, color: '#0a1a0a' },
  ];

  const caps: { x: number; z: number }[] = [
    { x: -0.9, z: 0.3 },
    { x: -0.7, z: -0.1 },
    { x: 0.6, z: 0.45 },
    { x: 0.9, z: 0.1 },
  ];

  return (
    <>
      {chips.map((c, i) => (
        <mesh key={`chip-${i}`} position={[c.x, 0.03, c.z]} castShadow>
          <boxGeometry args={[c.w, c.h, c.d]} />
          <meshStandardMaterial color={c.color} metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      {caps.map((c, i) => (
        <mesh key={`cap-${i}`} position={[c.x, 0.045, c.z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.07, 8]} />
          <meshStandardMaterial color="#2a1a0a" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </>
  );
}

export function ExplodedLaptop({ progress }: ExplodedLaptopProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow continuous Y rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const p = Math.max(0, Math.min(1, progress));

  // Screen/Display positions and rotations
  const screenY = THREE.MathUtils.lerp(0.8, 3.5, p);
  const screenRotX = THREE.MathUtils.lerp(0, -0.3, p); // tilts back as it separates
  const screenRotZ = THREE.MathUtils.lerp(0, 0.04, p);
  const screenEmissive = THREE.MathUtils.lerp(0.15, 0.4, p);

  // Keyboard deck
  const keyboardY = THREE.MathUtils.lerp(0.15, 1.5, p);
  const keyboardRotX = THREE.MathUtils.lerp(0, 0.15, p); // tilts forward
  const keyboardX = THREE.MathUtils.lerp(0, -0.15, p);

  // Motherboard
  const moboY = THREE.MathUtils.lerp(0.05, -0.5, p);
  const moboRotZ = THREE.MathUtils.lerp(0, 0.12, p);
  const moboX = THREE.MathUtils.lerp(0, 0.2, p);

  // Battery
  const batteryY = THREE.MathUtils.lerp(-0.05, -2.0, p);
  const batteryX = THREE.MathUtils.lerp(0, -0.4, p);
  const batteryRotZ = THREE.MathUtils.lerp(0, -0.08, p);

  // Chassis
  const chassisY = THREE.MathUtils.lerp(-0.15, -3.5, p);
  const chassisRotX = THREE.MathUtils.lerp(0, -0.1, p);
  const chassisX = THREE.MathUtils.lerp(0, 0.1, p);

  return (
    <group ref={groupRef}>
      {/* 1 — Screen / Display */}
      <group
        position={[0, screenY, 0]}
        rotation={[screenRotX, 0, screenRotZ]}
      >
        {/* Outer lid */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.8, 0.05]} />
          <meshStandardMaterial color="#12121a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Inner display panel */}
        <mesh position={[0, 0, 0.031]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 1.6, 0.01]} />
          <meshStandardMaterial
            color="#0a0a14"
            emissive="#5B6EF5"
            emissiveIntensity={screenEmissive}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* 2 — Keyboard Deck */}
      <group
        position={[keyboardX, keyboardY, 0]}
        rotation={[keyboardRotX, 0, 0]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 0.08, 2]} />
          <meshStandardMaterial color="#1a1a25" metalness={0.7} roughness={0.4} />
        </mesh>
        <KeyGrid />
      </group>

      {/* 3 — Motherboard */}
      <group
        position={[moboX, moboY, 0]}
        rotation={[0, 0, moboRotZ]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.03, 1.6]} />
          <meshStandardMaterial color="#0a3a1a" metalness={0.3} roughness={0.6} />
        </mesh>
        <BoardComponents />
      </group>

      {/* 4 — Battery */}
      <group
        position={[batteryX, batteryY, 0.3]}
        rotation={[0, 0, batteryRotZ]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.08, 0.8]} />
          <meshStandardMaterial color="#1a1a2a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Battery cells suggestion */}
        {[-0.55, 0, 0.55].map((xOffset, i) => (
          <mesh key={`cell-${i}`} position={[xOffset, 0.045, 0]} castShadow>
            <boxGeometry args={[0.42, 0.04, 0.6]} />
            <meshStandardMaterial color="#22225a" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* 5 — Chassis / Bottom */}
      <group
        position={[chassisX, chassisY, 0]}
        rotation={[chassisRotX, 0, 0]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 0.12, 2]} />
          <meshStandardMaterial color="#1a1a25" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Ventilation slots suggestion */}
        {[-0.6, 0, 0.6].map((xOffset, i) => (
          <mesh key={`vent-${i}`} position={[xOffset, -0.061, 0.7]} castShadow>
            <boxGeometry args={[0.08, 0.01, 0.5]} />
            <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Rubber feet */}
        {[
          [-1.2, 0.85],
          [1.2, 0.85],
          [-1.2, -0.85],
          [1.2, -0.85],
        ].map(([fx, fz], i) => (
          <mesh key={`foot-${i}`} position={[fx, -0.072, fz]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 8]} />
            <meshStandardMaterial color="#080808" metalness={0.1} roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
