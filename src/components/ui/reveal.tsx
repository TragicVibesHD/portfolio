'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Reveals its children once they scroll into view.
 *
 * Uses IntersectionObserver rather than a scroll listener, so it costs
 * nothing on the main thread, and disconnects as soon as it has fired.
 *
 * Under `prefers-reduced-motion` the content is visible from the first
 * render and no observer is created at all — visibility is derived from the
 * media query rather than pushed into state by an effect.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [scrolledIntoView, setScrolledIntoView] = useState(false);

  const visible = reducedMotion || scrolledIntoView;

  useEffect(() => {
    if (reducedMotion || scrolledIntoView) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScrolledIntoView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, scrolledIntoView]);

  return (
    <div
      ref={ref}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
