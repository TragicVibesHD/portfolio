'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion`.
 *
 * Starts at `true` so the very first client render is the calm one. If the
 * default were `false`, a visitor who asked for reduced motion would still
 * catch a frame of animation before the media query resolved.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
