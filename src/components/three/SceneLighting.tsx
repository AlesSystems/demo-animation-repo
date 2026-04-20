'use client';

interface SceneLightingProps {
  /** 0–1 scroll progress that drives spotlight intensity */
  progress: number;
}

/**
 * Shared dramatic lighting rig for 3D hero scenes.
 * Ambient stays constant; spotlight + fill scale with scroll progress.
 */
export function SceneLighting({ progress }: SceneLightingProps) {
  const spotIntensity = progress * 2;
  const fillIntensity = progress * 0.3;

  return (
    <>
      {/* Depth preservation — always on, very dim */}
      <ambientLight intensity={0.05} />

      {/* Main dramatic spotlight — controlled by scroll progress */}
      <spotLight
        position={[5, 5, 5]}
        intensity={spotIntensity}
        angle={0.5}
        penumbra={0.8}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* Subtle fill from opposite side — prevents pure silhouette */}
      <pointLight
        position={[-3, -1, -2]}
        intensity={fillIntensity}
        color="#5B6EF5"
      />
    </>
  );
}
