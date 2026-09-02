import { describe, expect, it } from 'vitest';
import { cn, isPlaceholder, realValue } from './utils';

describe('isPlaceholder', () => {
  it('treats bracket placeholders as unset', () => {
    expect(isPlaceholder('[GITHUB_URL]')).toBe(true);
    expect(isPlaceholder('[FULL_NAME]')).toBe(true);
    expect(isPlaceholder('[PROJECT_2_DEMO_URL]')).toBe(true);
  });

  it('treats empty and missing values as unset', () => {
    expect(isPlaceholder('')).toBe(true);
    expect(isPlaceholder(undefined)).toBe(true);
    expect(isPlaceholder(null)).toBe(true);
  });

  it('detects a placeholder embedded in an otherwise valid-looking URL', () => {
    // The bug this guards against: an unanchored-looking URL that renders as
    // a live link in the header and 404s for anyone who clicks it.
    expect(isPlaceholder('https://github.com/[GITHUB_USERNAME]')).toBe(true);
    expect(isPlaceholder('https://www.linkedin.com/in/[LINKEDIN_USERNAME]')).toBe(true);
    expect(isPlaceholder('mailto:[EMAIL_ADDRESS]')).toBe(true);
  });

  it('treats real values as set', () => {
    expect(isPlaceholder('https://github.com/someone')).toBe(false);
    expect(isPlaceholder('someone@example.com')).toBe(false);
  });

  it('does not mistake ordinary bracketed prose for a placeholder', () => {
    // Lowercase and spaces are not placeholder syntax, so a title like this
    // must still render rather than silently vanishing from the page.
    expect(isPlaceholder('[draft] notes')).toBe(false);
    expect(isPlaceholder('[SOME TEXT]')).toBe(false);
  });
});

describe('realValue', () => {
  it('returns undefined for placeholders so callers can hide the element', () => {
    expect(realValue('[REPO_URL]')).toBeUndefined();
    expect(realValue('')).toBeUndefined();
  });

  it('passes real values straight through', () => {
    expect(realValue('https://example.com')).toBe('https://example.com');
  });
});

describe('cn', () => {
  it('merges conflicting tailwind utilities, last one winning', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });
});
