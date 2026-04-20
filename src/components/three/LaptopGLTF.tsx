'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';
import { heroBridge } from '@/lib/animations/hero-bridge';

type GLTFResult = GLTF & {
  nodes: {
    ['Silver_colour_Cover_Cover_Plane-Mesh']: THREE.Mesh;
    ['Silver_colour_Cover_Cover_Plane-Mesh_1']: THREE.Mesh;
    Rubber_Strip_Rubber_Stripes: THREE.Mesh;
    Keyboard_Keyboard_Plane: THREE.Mesh;
    ['Display_Display_Plane-Mesh']: THREE.Mesh;
    ['Display_Display_Plane-Mesh_1']: THREE.Mesh;
  };
  materials: {
    Cover_Silver: THREE.MeshStandardMaterial;
    TouchPad_Silver: THREE.MeshStandardMaterial;
    None: THREE.MeshStandardMaterial;
    Keyboard_Black_Plastic: THREE.MeshStandardMaterial;
    Display_Glass: THREE.MeshStandardMaterial;
  };
};

export function LaptopGLTF() {
  const { nodes, materials } = useGLTF('/models/laptop.glb', true) as unknown as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);

  // Drive rotation from bridge — no React re-renders
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = heroBridge.rotationY;
  });

  return (
    <group ref={groupRef} dispose={null} position={[0, -0.3, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Silver_colour_Cover_Cover_Plane-Mesh'].geometry}
        material={materials.Cover_Silver}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Silver_colour_Cover_Cover_Plane-Mesh_1'].geometry}
        material={materials.TouchPad_Silver}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rubber_Strip_Rubber_Stripes.geometry}
        material={materials.None}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Keyboard_Keyboard_Plane.geometry}
        material={materials.Keyboard_Black_Plastic}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Display_Display_Plane-Mesh'].geometry}
        material={materials.Cover_Silver}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Display_Display_Plane-Mesh_1'].geometry}
        material={materials.Display_Glass}
      />
    </group>
  );
}

useGLTF.preload('/models/laptop.glb', true);
