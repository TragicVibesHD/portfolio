/**
 * Deterministic pseudo-random number generator (mulberry32).
 *
 * The 3D scenes need scattered positions, but `Math.random()` during render
 * is impure: React may re-run a render pass, and the particle field would
 * silently rearrange itself. Seeding makes the layout reproducible — the
 * same seed always produces the same scene, which also makes the visuals
 * reviewable and testable.
 *
 * Not cryptographically secure, and not intended to be.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
