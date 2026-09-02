'use client';

import { Info, MousePointer2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import type { LabItem } from '@/components/three/lab-scene';
import { useDeviceCapability } from '@/hooks/use-device-capability';

const LabScene = dynamic(() => import('./lab-scene'), {
  ssr: false,
  loading: () => (
    <div className="text-muted flex h-full items-center justify-center text-sm">Loading scene…</div>
  ),
});

/**
 * Canvas wrapper for the Lab.
 *
 * Devices that report `none` get an explanatory panel instead of a canvas.
 * That is not a degraded experience here — the page below this component
 * lists every project as ordinary links, which is the primary path.
 */
export function LabCanvas({ items }: { items: LabItem[] }) {
  const tier = useDeviceCapability();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const accent = resolvedTheme === 'light' ? '#14b8a6' : '#2ee6c5';

  // Warm the case-study route on hover-select so the click feels instant
  const handleSelect = useCallback((slug: string) => router.push(`/projects/${slug}`), [router]);

  if (tier === 'none') {
    return (
      <div className="border-border bg-surface/40 flex min-h-[22rem] flex-col items-center justify-center gap-3 rounded-2xl border px-6 py-14 text-center">
        <Info className="text-muted size-6" aria-hidden="true" />
        <p className="text-sm font-medium">The 3D scene is turned off</p>
        <p className="text-muted max-w-md text-sm leading-relaxed">
          Your device or browser has reduced motion enabled, data saver on, or no WebGL support.
          Every project is listed below as a normal link.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border relative h-[min(70svh,34rem)] overflow-hidden rounded-2xl border">
      <LabScene items={items} tier={tier} color={accent} onSelect={handleSelect} />

      <p className="border-border bg-background/80 text-muted pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs backdrop-blur-sm">
        <MousePointer2 className="size-3.5" aria-hidden="true" />
        Drag to orbit · click a shape to open its case study
      </p>
    </div>
  );
}
