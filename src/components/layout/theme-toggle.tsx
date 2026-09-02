'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

/**
 * Theme toggle.
 *
 * Both icons are always rendered and CSS decides which is visible, keyed off
 * the `dark` class that next-themes writes onto <html> before first paint.
 * That removes the usual mounted-flag dance entirely: no hydration
 * mismatch, no placeholder, no layout shift, and the correct icon is
 * painted on the very first frame rather than one render later.
 *
 * The label stays theme-neutral because the server genuinely cannot know
 * the visitor's stored theme — a label naming the target theme would be
 * announced wrongly until hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  // The current theme is read from the DOM at click time rather than from
  // `resolvedTheme`. next-themes writes the class before first paint but
  // only populates `resolvedTheme` after its provider has mounted, so an
  // early click would compare against `undefined` and re-apply the theme
  // that was already active — a dead first click on a slow connection.
  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className={cn(
        'text-muted hover:text-foreground hover:bg-surface inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors',
        className,
      )}
    >
      <Sun className="hidden size-[18px] dark:block" aria-hidden="true" />
      <Moon className="block size-[18px] dark:hidden" aria-hidden="true" />
    </button>
  );
}
