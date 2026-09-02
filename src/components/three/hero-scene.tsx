'use client';

import { Environment, Float, Lightformer, MeshDistortMaterial } from '@react-three/drei';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef, Suspense } from 'react';
import * as THREE from 'three';
import type { Tier } from '@/hooks/use-device-capability';

/**
 * Ambient hero object.
 *
 * A slowly distorting icosahedron with a metallic surface, lit entirely by
 * lightformers so no HDR environment map is fetched over the network. The
 * whole scene is decorative: it sits behind the hero copy, is marked
 * aria-hidden, and never carries information that only exists in 3D.
 */

interface SceneProps {
  tier: Exclude<Tier, 'none'>;
  /** Accent colour, sampled from the active theme */
  color: string;
}

interface HeroSceneProps extends SceneProps {
  /** 'never' parks the render loop while the hero is scrolled out of view */
  frameloop?: 'always' | 'never';
}

function DistortedCore({ tier, color }: SceneProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Continuous slow spin, framerate-independent
    mesh.current.rotation.y += delta * 0.12;
    mesh.current.rotation.x += delta * 0.045;

    // Ease toward the pointer for a parallax tilt that never fully arrives,
    // so the object keeps drifting instead of snapping to the cursor.
    const { x, y } = state.pointer;
    mesh.current.position.x += (x * 0.32 - mesh.current.position.x) * 0.03;
    mesh.current.position.y += (y * 0.22 - mesh.current.position.y) * 0.03;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.55}>
      <mesh ref={mesh} scale={tier === 'high' ? 1.32 : 1.2}>
        <icosahedronGeometry args={[1, tier === 'high' ? 24 : 10]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.85}
          roughness={0.16}
          metalness={0.92}
          distort={0.38}
          speed={1.4}
        />
      </mesh>
    </Float>
  );
}

/** Sparse point cloud shell. Purely atmospheric. */
function Particles({ count, color }: { count: number; color: string }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Distribute on a spherical shell so the cloud reads as depth
      // around the core rather than a flat rectangle of dots.
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.4 + Math.random() * 2.1;

      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y -= delta * 0.028;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          // React 19 + R3F 9 requires the explicit args form here
          {...({
            attach: 'attributes-position',
            args: [positions, 3],
          } as ThreeElements['bufferAttribute'])}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color={color}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene({
  tier,
  color,
  frameloop = 'always',
}: HeroSceneProps) {
  const high = tier === 'high';

  return (
    <Canvas
      // Decorative only — hidden from the accessibility tree entirely.
      aria-hidden="true"
      frameloop={frameloop}
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={high ? [1, 2] : [1, 1.5]}
      gl={{
        antialias: high,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      // Rendering on demand would freeze the ambient motion; the per-frame
      // cost is capped by keeping geometry and effects tier-dependent.
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 4, 4]} intensity={1.1} />

        <DistortedCore tier={tier} color={color} />
        <Particles count={high ? 420 : 160} color={color} />

        {/* Local lightformer rig — no external HDR request */}
        <Environment resolution={high ? 256 : 128}>
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[3, 3, 2]}
            scale={[5, 5, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="circle"
            intensity={1.6}
            position={[-4, -1, 2]}
            scale={[3, 3, 1]}
            color={color}
          />
          <Lightformer
            form="rect"
            intensity={0.9}
            position={[0, -4, -2]}
            scale={[8, 3, 1]}
            color="#6366f1"
          />
        </Environment>

        {/* Bloom is the most expensive pass here, so high tier only */}
        {high ? (
          <EffectComposer enableNormalPass={false}>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
          </EffectComposer>
        ) : null}
      </Suspense>
    </Canvas>
  );
}
