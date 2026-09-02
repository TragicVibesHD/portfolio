import { MDXContent } from '@content-collections/mdx/react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { GithubIcon } from '@/components/ui/brand-icons';
import { Button } from '@/components/ui/button';
import { ViewCounter } from '@/components/ui/view-counter';
import { caseStudyProjects, getProject, projectNeighbours } from '@/lib/projects';
import { buildMetadata, JsonLd, projectJsonLd } from '@/lib/seo';
import { realValue } from '@/lib/utils';

export function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return buildMetadata({ title: 'Project not found' });

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: 'article',
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project || !project.caseStudy) notFound();

  const repo = realValue(project.repo);
  const demo = realValue(project.demo);
  const { previous, next } = projectNeighbours(project.slug);

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />

      <article className="container-page py-16 sm:py-20">
        <Link
          href="/projects"
          className="text-muted hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>

        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent" size="sm">
              {project.status}
            </Badge>
            <span className="text-muted font-mono text-xs">{project.year}</span>
            <span className="text-muted font-mono text-xs">{project.readingMinutes} min read</span>
            <ViewCounter slug={project.slug} />
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>

          <p className="text-muted mt-5 text-lg leading-relaxed">{project.summary}</p>

          {repo || demo ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {repo ? (
                <Button asChild>
                  <a href={repo} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="size-4" />
                    View source
                  </a>
                </Button>
              ) : null}
              {demo ? (
                <Button asChild variant="outline">
                  <a href={demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    Live demo
                  </a>
                </Button>
              ) : null}
            </div>
          ) : null}
        </header>

        {project.image ? (
          <div className="border-border bg-surface relative mt-12 aspect-[16/9] overflow-hidden rounded-xl border">
            <Image
              src={project.image}
              alt={project.imageAlt || ''}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div className="prose-case min-w-0">
            <MDXContent code={project.mdx} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold">Tech stack</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <li key={tech}>
                      <Badge size="sm">{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-semibold">Categories</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.categories.map((category) => (
                    <li key={category}>
                      <Badge size="sm" variant="outline">
                        {category}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              {project.contribution ? (
                <div className="border-accent/25 bg-accent-subtle rounded-xl border p-4">
                  <h2 className="text-accent text-sm font-semibold">My contribution</h2>
                  <p className="text-muted mt-2 text-sm leading-relaxed">{project.contribution}</p>
                </div>
              ) : null}

              {project.features.length ? (
                <SidebarList title="Key features" items={project.features} />
              ) : null}

              {project.challenges.length ? (
                <SidebarList title="Challenges" items={project.challenges} />
              ) : null}

              {project.lessons.length ? (
                <SidebarList title="What I learned" items={project.lessons} />
              ) : null}
            </div>
          </aside>
        </div>

        {previous || next ? (
          <nav
            aria-label="More projects"
            className="border-border mt-20 grid gap-4 border-t pt-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className="group border-border hover:border-accent/50 hover:bg-surface rounded-xl border p-4 transition-colors"
              >
                <span className="text-muted inline-flex items-center gap-1.5 text-xs">
                  <ArrowLeft className="size-3.5" />
                  Previous
                </span>
                <span className="group-hover:text-accent mt-1.5 block font-medium transition-colors">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group border-border hover:border-accent/50 hover:bg-surface rounded-xl border p-4 text-right transition-colors sm:col-start-2"
              >
                <span className="text-muted inline-flex items-center gap-1.5 text-xs">
                  Next
                  <ArrowRight className="size-3.5" />
                </span>
                <span className="group-hover:text-accent mt-1.5 block font-medium transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>
    </>
  );
}

function SidebarList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="text-muted mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span
              className="text-accent mt-[7px] size-1 shrink-0 rounded-full bg-current"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
