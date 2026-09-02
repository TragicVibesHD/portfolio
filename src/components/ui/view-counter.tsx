'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Project view counter.
 *
 * Records the visit once after paint and renders nothing at all until a
 * real number comes back — so with no database configured, or with the
 * database down, the widget simply is not there rather than showing a
 * spinner or a zero that is not true.
 *
 * The guard ref survives React 18+ double-invocation in development, which
 * would otherwise count every local page view twice.
 */
export function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const key = `viewed:${slug}`;

    // Only count a given visitor once per session, so a reload or a
    // back-navigation does not inflate the number.
    let alreadyViewed = false;
    try {
      alreadyViewed = sessionStorage.getItem(key) === '1';
    } catch {
      // Private mode or blocked storage — fall through and just count it.
    }

    const request = alreadyViewed
      ? fetch(`/api/views/${slug}`, { cache: 'no-store' })
      : fetch(`/api/views/${slug}`, { method: 'POST', cache: 'no-store' });

    request
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count: number | null } | null) => {
        if (cancelled || !data || typeof data.count !== 'number') return;
        setCount(data.count);
        try {
          sessionStorage.setItem(key, '1');
        } catch {
          // Non-fatal.
        }
      })
      .catch(() => {
        // A missing view count is never worth surfacing to the visitor.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (count === null) return null;

  return (
    <span className="text-muted inline-flex items-center gap-1.5 font-mono text-xs">
      <Eye className="size-3.5" aria-hidden="true" />
      {count.toLocaleString()} {count === 1 ? 'view' : 'views'}
    </span>
  );
}
