import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { GithubIcon } from '@/components/ui/brand-icons';
import type { Project } from '@/lib/projects';
import { cn, realValue } from '@/lib/utils';

const statusVariant = {
  Completed: 'default',
  'In development': 'accent',
  Concept: 'outline',
} as const;

/**
 * Project card.
 *
 * The whole card is a link to the case study via a stretched overlay, with
 * the repo/demo icons layered above it so they stay independently
 * clickable. Only the title anchor is in the tab order, so keyboard users
 * get one stop for the card rather than a duplicate.
 */
export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const repo = realValue(project.repo);
  const demo = realValue(project.demo);
  const href = project.caseStudy ? `/projects/${project.slug}` : null;

  return (
    <article
      className={cn(
        'group border-border bg-surface/40 relative flex flex-col overflow-hidden rounded-xl border',
        'hover:border-accent/50 hover:bg-surface transition-all duration-300',
        'focus-within:border-accent/60',
      )}
    >
      {project.image ? (
        <div className="bg-surface relative aspect-[16/9] overflow-hidden">
          <Image
            src={project.image}
            alt={project.imageAlt || ''}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug font-semibold">
            {href ? (
              <Link href={href} className="after:absolute after:inset-0">
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          {href ? (
            <ArrowUpRight
              className="text-muted group-hover:text-accent mt-1 size-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          ) : null}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[project.status]} size="sm">
            {project.status}
          </Badge>
          <span className="text-muted font-mono text-xs">{project.year}</span>
        </div>

        <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">{project.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Badge size="sm">{tech}</Badge>
            </li>
          ))}
          {project.tech.length > 5 ? (
            <li>
              <Badge size="sm" variant="outline">
                +{project.tech.length - 5}
              </Badge>
            </li>
          ) : null}
        </ul>

        {repo || demo ? (
          <div className="border-border relative z-10 mt-4 flex items-center gap-1 border-t pt-4">
            {repo ? (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                className="text-muted hover:text-foreground hover:bg-surface-raised inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors"
              >
                <GithubIcon className="size-3.5" />
                Code
              </a>
            ) : null}
            {demo ? (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="text-muted hover:text-foreground hover:bg-surface-raised inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors"
              >
                <ExternalLink className="size-3.5" />
                Demo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
