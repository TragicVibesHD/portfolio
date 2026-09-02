import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge conditional class names, resolving conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Bracket placeholders like `[GITHUB_URL]` are treated as "not set yet".
 * Components use this so an unfilled value hides its button instead of
 * rendering a dead link.
 *
 * Matches anywhere in the string, not just the whole string: the common
 * case is a placeholder embedded in an otherwise valid-looking URL, e.g.
 * `https://github.com/[GITHUB_USERNAME]`. Anchoring this would let exactly
 * that shape through and render a link that 404s.
 *
 * The pattern deliberately requires SCREAMING_SNAKE_CASE inside the
 * brackets, so ordinary prose like "[draft] notes" is left alone.
 */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /\[[A-Z0-9_]+\]/.test(value);
}

/** Returns the value only if it is a real, non-placeholder string. */
export function realValue(value: string | undefined | null): string | undefined {
  return isPlaceholder(value) ? undefined : (value as string);
}
