'use client';

import { useSyncExternalStore } from 'react';

/**
 * Tracks `prefers-reduced-motion`.
 *
 * Implemented with useSyncExternalStore rather than useEffect + setState:
 * a media query is exactly the external store this hook exists for, and it
 * avoids the extra render pass that the effect version costs on mount.
 *
 * The server snapshot is `true`, so the first paint is always the calm one.
 * Starting at `false` would let a visitor who asked for reduced motion
 * catch a frame of animation before hydration corrected it.
 */

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return true;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
