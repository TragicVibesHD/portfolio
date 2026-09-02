'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Theme toggle.
 *
 * Renders a fixed-size inert placeholder until mounted. The server cannot
 * know the visitor's stored theme, so rendering the real icon immediately
 * would either mismatch during hydration or cause a layout shift.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <div
        className={cn('size-10 shrink-0', className)}
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={cn(
        'text-muted hover:text-foreground hover:bg-surface inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors',
        className,
      )}
    >
      {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}
