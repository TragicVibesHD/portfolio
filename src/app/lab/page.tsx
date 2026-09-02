import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LabCanvas } from '@/components/three/lab-canvas';
import { Badge } from '@/components/ui/badge';
import { Section, SectionHeading } from '@/components/ui/section';
import { caseStudyProjects } from '@/lib/projects';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Lab',
  description:
    'An interactive 3D view of my projects, built with React Three Fiber — orbit the scene and open any case study.',
  path: '/lab',
});

export default function LabPage() {
  const items = caseStudyProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    year: project.year,
    category: project.categories[0],
  }));

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Interactive"
        title="The Lab"
        description="My projects as objects in space, rendered with React Three Fiber and three.js. Orbit around and click any shape to read its case study."
      />

      <div className="mt-10">
        <LabCanvas items={items} />
      </div>

      {/*
        The canvas is an alternative route to the same content, never the only
        one. This list is the accessible path: real links, in the tab order,
        readable by screen readers and present without JavaScript.
      */}
      <div className="mt-14">
        <h2 className="text-lg font-semibold">All projects in the scene</h2>
        <p className="text-muted mt-2 text-sm">
          The same projects as plain links, in case you would rather not use the 3D view.
        </p>

        <ul className="border-border mt-6 divide-y rounded-xl border">
          {caseStudyProjects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group hover:bg-surface flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors"
              >
                <div className="min-w-0">
                  <span className="group-hover:text-accent font-medium transition-colors">
                    {project.title}
                  </span>
                  <span className="text-muted mt-0.5 block text-sm">{project.summary}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge size="sm" variant="outline">
                    {project.categories[0]}
                  </Badge>
                  <ArrowUpRight
                    className="text-muted group-hover:text-accent size-4 transition-colors"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-border bg-surface/40 mt-12 rounded-xl border p-6">
        <h2 className="text-sm font-semibold">How this page is built</h2>
        <p className="text-muted mt-3 text-sm leading-relaxed">
          The scene is a React Three Fiber canvas, code split so three.js never loads on the home
          page. Before it mounts, the device is checked for WebGL support, core count, memory,
          data-saver mode and{' '}
          <code className="bg-surface rounded px-1 py-0.5 font-mono text-xs">
            prefers-reduced-motion
          </code>
          . Low-capability devices get simplified geometry and no post-processing; devices that opt
          out of motion get no canvas at all. Rendering also stops entirely when the canvas scrolls
          out of view.
        </p>
      </div>
    </Section>
  );
}
