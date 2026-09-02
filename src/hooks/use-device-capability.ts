'use client';

import { useEffect, useState } from 'react';

export type Tier = 'none' | 'low' | 'high';

/**
 * Decides how much 3D this device should be asked to render.
 *
 * `none`  - no WebGL, or the visitor asked for reduced motion. Show a static
 *           fallback instead of a canvas.
 * `low`   - small screens, few cores, or a data-saver connection. Render the
 *           scene with reduced geometry, no post-processing and capped DPR.
 * `high`  - everything else.
 *
 * Starts at `none` so the first paint is always the cheap one; upgrading
 * after mount costs a frame, whereas starting high and downgrading would
 * mean shipping an expensive scene to the devices least able to run it.
 */
export function useDeviceCapability(): Tier {
  const [tier, setTier] = useState<Tier>('none');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTier('none');
      return;
    }

    if (!hasWebGL()) {
      setTier('none');
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;
    const connection = (navigator as NavigatorWithConnection).connection;
    const saveData = connection?.saveData === true;
    const slowNetwork = /(^|-)2g$/.test(connection?.effectiveType ?? '');
    const smallScreen = window.matchMedia('(max-width: 640px)').matches;

    if (saveData || slowNetwork) {
      setTier('none');
      return;
    }

    setTier(cores <= 4 || memory <= 4 || smallScreen ? 'low' : 'high');
  }, []);

  return tier;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: { saveData?: boolean; effectiveType?: string };
}
