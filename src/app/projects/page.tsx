import type { Metadata } from 'next';
import { ProjectFilter } from '@/components/sections/project-filter';
import { Section, SectionHeading } from '@/components/ui/section';
import { projects, usedCategories } from '@/lib/projects';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description:
    'Software projects spanning constraint optimization, machine learning, full-stack web development and native Android — each with a full case study.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Everything I have built"
        title="Projects"
        description="Constraint optimization, machine learning, full-stack web and native Android. Every project has a write-up covering the problem, how I approached it and what I would do differently."
      />

      <div className="mt-12">
        <ProjectFilter projects={projects} categories={usedCategories()} />
      </div>
    </Section>
  );
}
