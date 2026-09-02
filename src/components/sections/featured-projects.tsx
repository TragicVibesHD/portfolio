import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { ProjectCard } from '@/components/ui/project-card';
import { Button } from '@/components/ui/button';
import { featuredProjects, projects } from '@/lib/projects';

export function FeaturedProjects() {
  // Fall back to the first three overall if nothing is flagged featured,
  // so the section never renders empty after a content edit.
  const shown = (featuredProjects.length ? featuredProjects : projects).slice(0, 3);

  if (shown.length === 0) return null;

  return (
    <Section id="projects">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects"
          description="A few things I have designed, built and shipped. Each one has a full write-up covering the problem, the approach and what I learned."
        />
        <Button asChild variant="ghost" className="shrink-0">
          <Link href="/projects">
            All projects
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, index) => (
          <Reveal key={project.slug} delay={index * 80}>
            <ProjectCard project={project} priority={index === 0} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
