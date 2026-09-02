'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/ui/project-card';
import type { Project } from '@/lib/projects';
import { cn } from '@/lib/utils';

const ALL = 'All';

/**
 * Filterable project grid.
 *
 * Filtering happens client-side over an already-rendered list: the full set
 * ships in the HTML, so the projects are present for search engines and for
 * anyone without JavaScript, and switching filters costs no navigation.
 */
export function ProjectFilter({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>(ALL);

  const options = useMemo(() => [ALL, ...categories], [categories]);

  const visible = useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((project) => (project.categories as readonly string[]).includes(active)),
    [active, projects],
  );

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === active;
          const count =
            option === ALL
              ? projects.length
              : projects.filter((p) => (p.categories as readonly string[]).includes(option)).length;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(option)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                selected
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border text-muted hover:border-border-strong hover:text-foreground',
              )}
            >
              {option}
              <span className="ml-1.5 text-[11px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Announce the result count so filtering is perceivable to screen readers */}
      <p aria-live="polite" className="text-muted mt-6 text-sm">
        Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        {active === ALL ? '' : ` in ${active}`}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => (
          <ProjectCard key={project.slug} project={project} priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
