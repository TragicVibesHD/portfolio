import { describe, expect, it } from 'vitest';
import { FALLBACK_SITE_URL, resolveSiteUrl, site } from './site';
import { isPlaceholder } from './utils';

describe('resolveSiteUrl', () => {
  it('falls back when the value is an empty string', () => {
    // The bug that failed the first Vercel deploy: Next substitutes '' for an
    // unset NEXT_PUBLIC_* at build time, and '' is not nullish, so `??` never
    // fired and new URL('') threw at module scope.
    expect(resolveSiteUrl('')).toBe(FALLBACK_SITE_URL);
    expect(resolveSiteUrl(undefined)).toBe(FALLBACK_SITE_URL);
    expect(resolveSiteUrl('   ')).toBe(FALLBACK_SITE_URL);
    expect(resolveSiteUrl()).toBe(FALLBACK_SITE_URL);
  });

  it('uses the first usable candidate and skips empty ones', () => {
    expect(resolveSiteUrl('', undefined, 'https://example.com')).toBe('https://example.com');
  });

  it('upgrades a bare hostname to https, as Vercel supplies it', () => {
    expect(resolveSiteUrl('my-app.vercel.app')).toBe('https://my-app.vercel.app');
  });

  it('preserves an explicit protocol', () => {
    expect(resolveSiteUrl('http://localhost:4000')).toBe('http://localhost:4000');
  });

  it('strips a trailing slash so paths concatenate cleanly', () => {
    expect(resolveSiteUrl('https://example.com/')).toBe('https://example.com');
  });

  it('skips a malformed candidate instead of throwing', () => {
    // Throwing here would fail the build, not just this one value.
    expect(() => resolveSiteUrl('ht!tp://%%%')).not.toThrow();
    expect(resolveSiteUrl('http://', 'https://example.com')).toBe('https://example.com');
  });

  it('never returns a value that new URL() rejects', () => {
    for (const candidate of ['', '   ', undefined, 'nonsense', 'https://ok.dev/']) {
      expect(() => new URL(resolveSiteUrl(candidate))).not.toThrow();
    }
  });
});

describe('site config', () => {
  it('has no unfilled placeholders in published identity fields', () => {
    expect(isPlaceholder(site.name)).toBe(false);
    expect(isPlaceholder(site.shortName)).toBe(false);
    expect(isPlaceholder(site.email)).toBe(false);
    expect(isPlaceholder(site.github)).toBe(false);
    expect(isPlaceholder(site.linkedin)).toBe(false);
    expect(isPlaceholder(site.seo.defaultTitle)).toBe(false);
    expect(isPlaceholder(site.seo.description)).toBe(false);
  });
});
