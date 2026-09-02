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
 * reduced motion, data saver) never download it at all and get the static
 * gradient instead. The hero text is plain server-rendered HTML underneath,
 * so the LCP element does not wait on any of this.
 *
 * Composition rule: the object is confined to the right of the viewport and
 * a scrim is laid over it, because the hero copy has to stay readable no
 * matter what frame the animation happens to be on. A decorative background
 * that fights the text is a bug, not a style.
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

  // Stop rendering once the hero scrolls away. A canvas that keeps
  // animating off-screen is pure battery drain on laptops and phones.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '120px',
    });
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
      {/* Confined to the right so it never sits under the headline or body
          copy on wide screens. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        {/* Cheap gradient that reads as intentional on its own, and covers
            the gap while the scene chunk downloads. */}
        <div
          className="absolute top-1/2 left-1/2 size-[min(34rem,85vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-3xl dark:opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 68%)',
          }}
        />

        {tier !== 'none' ? (
          <div className="absolute inset-0 opacity-55 dark:opacity-100">
            <HeroScene tier={tier} color={accent} frameloop={inView ? 'always' : 'never'} />
          </div>
        ) : null}
      </div>

      {/* Contrast scrim. Solid behind the text column, clearing to nothing on
          the right so the object still reads. */}
      <div className="from-background via-background/92 to-background/45 absolute inset-0 bg-gradient-to-r lg:via-70% lg:to-transparent" />

      {/* Fade the scene out into the section below rather than cutting it off */}
      <div className="from-background absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t to-transparent" />
    </div>
  );
}
