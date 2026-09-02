'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useDeviceCapability } from '@/hooks/use-device-capability';
import { cn } from '@/lib/utils';

/**
 * Loads the 3D hero only when it is worth loading.
 *
 * three.js and its dependencies are a large bundle, so the scene is code
 * split and never server-rendered. Devices that report `none` (no WebGL,
 * reduced motion, data saver) never download it at all and get a static
 * gradient instead. The hero text is plain server-rendered HTML underneath,
 * so the LCP element does not wait on any of this.
 */
const HeroScene = dynamic(() => import('./hero-scene'), {
  ssr: false,
  loading: () => null,
});

export function HeroCanvas({ className }: { className?: string }) {
  const tier = useDeviceCapability();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Stop rendering entirely once the hero scrolls away. A canvas that keeps
  // animating off-screen is pure battery drain on laptops and phones.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const accent = resolvedTheme === 'light' ? '#0f766e' : '#2ee6c5';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* Always present: a cheap gradient that reads as intentional on its
          own, and covers the gap while the scene chunk loads. */}
      <div
        className="absolute top-1/2 left-1/2 size-[min(38rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl dark:opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 68%)',
        }}
      />

      {tier !== 'none' ? (
        <HeroScene
          tier={tier}
          color={accent}
          frameloop={inView ? 'always' : 'never'}
        />
      ) : null}
    </div>
  );
}
