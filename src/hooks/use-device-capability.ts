'use client';

import { useSyncExternalStore } from 'react';

export type Tier = 'none' | 'low' | 'high';

/**
 * Decides how much 3D this device should be asked to render.
 *
 * `none`  - no WebGL, reduced motion, or data saver. Show a static
 *           fallback instead of a canvas.
 * `low`   - small screens, few cores, or little memory. Reduced geometry,
 *           no post-processing, capped DPR.
 * `high`  - everything else.
 *
 * The server snapshot is `none`, so the first paint never assumes a capable
 * device; upgrading after hydration costs one render, whereas starting high
 * would ship an expensive scene to the devices least able to run it.
 *
 * Uses useSyncExternalStore because the inputs are external browser state
 * (media queries, the network connection) that can change while the page
 * is open — a rotated phone or a switched-on data saver re-evaluates.
 */

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SMALL_SCREEN_QUERY = '(max-width: 640px)';

/**
 * WebGL support cannot change for the lifetime of the document, and probing
 * it allocates a canvas and a context, so the answer is cached after the
 * first call. getSnapshot runs on every render pass.
 */
let webglSupport: boolean | null = null;

function hasWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;

  try {
    const canvas = document.createElement('canvas');
    webglSupport = Boolean(
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl'),
    );
  } catch {
    webglSupport = false;
  }

  return webglSupport;
}

function subscribe(onChange: () => void): () => void {
  const motion = window.matchMedia(MOTION_QUERY);
  const smallScreen = window.matchMedia(SMALL_SCREEN_QUERY);
  const connection = (navigator as NavigatorWithConnection).connection;

  motion.addEventListener('change', onChange);
  smallScreen.addEventListener('change', onChange);
  connection?.addEventListener?.('change', onChange);

  return () => {
    motion.removeEventListener('change', onChange);
    smallScreen.removeEventListener('change', onChange);
    connection?.removeEventListener?.('change', onChange);
  };
}

function getSnapshot(): Tier {
  if (window.matchMedia(MOTION_QUERY).matches) return 'none';
  if (!hasWebGL()) return 'none';

  const connection = (navigator as NavigatorWithConnection).connection;
  if (connection?.saveData === true) return 'none';
  if (/(^|-)2g$/.test(connection?.effectiveType ?? '')) return 'none';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;
  const smallScreen = window.matchMedia(SMALL_SCREEN_QUERY).matches;

  return cores <= 4 || memory <= 4 || smallScreen ? 'low' : 'high';
}

function getServerSnapshot(): Tier {
  return 'none';
}

export function useDeviceCapability(): Tier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
    addEventListener?: (type: 'change', listener: () => void) => void;
    removeEventListener?: (type: 'change', listener: () => void) => void;
  };
}
