'use client';

import { Float, Html, OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Tier } from '@/hooks/use-device-capability';

/**
 * The Lab.
 *
 * Projects arranged as a ring of floating solids you can orbit through.
 * This is a second, richer way to browse the same projects — never the only
 * way. The page renders a complete linked list of every project beneath the
 * canvas, so nothing here is reachable exclusively by dragging a 3D scene.
 */

export interface LabItem {
  slug: string;
  title: string;
  year: string;
  category: string;
}

interface LabSceneProps {
  items: LabItem[];
  tier: Exclude<Tier, 'none'>;
  color: string;
  onSelect: (slug: string) => void;
}

/** Geometry varies by index so each project reads as a distinct object. */
function ProjectSolid({
  item,
  index,
  total,
  color,
  detail,
  onSelect,
}: {
  item: LabItem;
  index: number;
  total: number;
  color: string;
  detail: boolean;
  onSelect: (slug: string) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { position, geometry } = useMemo(() => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 4.2;
    return {
      position: [
        Math.cos(angle) * radius,
        // Gentle vertical stagger so the ring is not a flat carousel
        Math.sin(index * 1.7) * 0.85,
        Math.sin(angle) * radius,
      ] as [number, number, number],
      geometry: index % 3,
    };
  }, [index, total]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.25;
    mesh.current.rotation.x += delta * 0.1;

    // Ease scale toward the hover target rather than snapping
    const target = hovered ? 1.28 : 1;
    mesh.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
      <group position={position}>
        <mesh
          ref={mesh}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = '';
          }}
          onClick={(event) => {
            event.stopPropagation();
            document.body.style.cursor = '';
            onSelect(item.slug);
          }}
        >
          {geometry === 0 ? (
            <icosahedronGeometry args={[0.68, detail ? 1 : 0]} />
          ) : geometry === 1 ? (
            <octahedronGeometry args={[0.76, 0]} />
          ) : (
            <torusKnotGeometry args={[0.44, 0.16, detail ? 96 : 48, detail ? 16 : 8]} />
          )}
          <meshStandardMaterial
            color={hovered ? color : '#8b95a6'}
            emissive={color}
            emissiveIntensity={hovered ? 0.75 : 0.12}
            roughness={0.25}
            metalness={0.75}
            flatShading={geometry !== 2}
          />
        </mesh>

        {/*
          Hover-only. Six labels in a ring inevitably overlap at some camera
          angles, and a permanent wall of text buries the objects. The list
          below the canvas is the discoverable, accessible index; this is
          just confirmation of what you are pointing at.
        */}
        {hovered ? (
          <Html
            center
            position={[0, -1.25, 0]}
            // No distanceFactor on purpose: the label stays a constant,
            // legible size instead of ballooning as the camera nears it.
            style={{ pointerEvents: 'none', userSelect: 'none' }}
            zIndexRange={[10, 0]}
          >
            <div className="border-accent/60 bg-background/95 rounded-lg border px-2.5 py-1.5 text-center whitespace-nowrap backdrop-blur-sm">
              <p className="text-foreground text-[12px] leading-tight font-medium">{item.title}</p>
              <p className="text-muted mt-0.5 font-mono text-[9px]">
                {item.category} · {item.year}
              </p>
            </div>
          </Html>
        ) : null}
      </group>
    </Float>
  );
}

export default function LabScene({ items, tier, color, onSelect }: LabSceneProps) {
  const high = tier === 'high';

  return (
    <Canvas
      camera={{ position: [0, 4.6, 10.5], fov: 50 }}
      dpr={high ? [1, 2] : [1, 1.5]}
      gl={{ antialias: high, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#06070a']} />
        <fog attach="fog" args={['#06070a', 12, 26]} />

        <ambientLight intensity={0.45} />
        <pointLight position={[0, 4, 0]} intensity={26} color={color} distance={18} />
        <directionalLight position={[6, 6, 6]} intensity={0.9} />

        {items.map((item, index) => (
          <ProjectSolid
            key={item.slug}
            item={item}
            index={index}
            total={items.length}
            color={color}
            detail={high}
            onSelect={onSelect}
          />
        ))}

        {/* Reflective floor plane grounds the ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
          <circleGeometry args={[9, 64]} />
          <meshStandardMaterial
            color="#0b0d12"
            roughness={0.55}
            metalness={0.6}
            transparent
            opacity={0.85}
          />
        </mesh>

        {high ? <Stars radius={60} depth={30} count={1400} factor={3} fade speed={0.6} /> : null}

        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          // Zoom is deliberately off. The canvas sits inside a scrolling page,
          // and wheel-to-zoom traps the visitor: scrolling past the scene
          // zooms it instead of moving the page. Orbit only.
          enableZoom={false}
          minDistance={8}
          maxDistance={18}
          // Keep the camera above the floor plane at all times
          minPolarAngle={Math.PI / 4.5}
          maxPolarAngle={Math.PI / 2.3}
          autoRotate
          autoRotateSpeed={0.45}
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  );
}
