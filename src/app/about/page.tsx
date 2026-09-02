import { ArrowRight, FileText, GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceSection } from '@/components/sections/experience';
import { SkillsSection } from '@/components/sections/skills';
import { Timeline } from '@/components/sections/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Section, SectionHeading } from '@/components/ui/section';
import { education } from '@/lib/data/education';
import { buildMetadata } from '@/lib/seo';
import { currently, interests, site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: site.intro,
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <Section>
        <SectionHeading as="h1" eyebrow="Who I am" title="About me" description={site.intro} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="max-w-2xl">
            <div className="text-muted space-y-4 text-base leading-relaxed">
              <p>
                I am a Computer Science graduate from The University of the West Indies, St.
                Augustine, based in {site.location}. I have completed all required coursework and
                graduate in {site.expectedGraduation}.
              </p>
              <p>
                Most of what I have built started as a real problem rather than a tutorial. A
                scheduler that stops students sitting four assessments in one day became a
                constraint-programming model. A health-screening question became a full
                machine-learning pipeline with the preprocessing pinned down so training and
                inference can never disagree. A team internship platform became an exercise in
                designing a relational schema around three different user roles.
              </p>
              <p>
                Two internships shaped how I think about shipping. At the Ministry of Digital
                Transformation I worked on PHP and WordPress systems, an Nginx reverse proxy,
                service-design wireframes and event networking — which taught me that the
                interesting constraints are usually organisational, not technical. At Avasant I
                maintained website content and produced digital media for a global consulting firm,
                where the deadline was the specification.
              </p>
              <p>
                {site.availability} I am most interested in teams where I will be reviewed properly
                and learn from people further along than I am.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/projects">
                  See my work
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={site.resumePath} target="_blank" rel="noopener noreferrer">
                  <FileText />
                  Résumé
                </a>
              </Button>
            </div>

            <div className="mt-12">
              <h2 className="text-lg font-semibold">How I got here</h2>
              <Timeline />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border-border bg-surface/40 rounded-xl border p-5">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="text-accent size-4" aria-hidden="true" />
                <h2 className="text-sm font-semibold">Education</h2>
              </div>
              <p className="mt-3 font-medium">{education.qualification}</p>
              <p className="text-muted mt-1 text-sm">{education.institution}</p>
              <p className="text-muted mt-1 text-sm">{education.location}</p>

              <dl className="text-muted mt-4 space-y-1.5 text-xs">
                <div className="flex gap-2">
                  <dt className="text-foreground font-medium">Status:</dt>
                  <dd>{education.status}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-foreground font-medium">Graduating:</dt>
                  <dd>{education.expectedGraduation}</dd>
                </div>
              </dl>

              <h3 className="mt-5 text-xs font-semibold">Relevant coursework</h3>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {education.coursework.map((course) => (
                  <li key={course}>
                    <Badge size="sm">{course}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-accent/25 bg-accent-subtle rounded-xl border p-5">
              <h2 className="text-accent text-sm font-semibold">Currently</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-muted text-xs">Building</dt>
                  <dd className="mt-0.5">{currently.building}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs">Learning</dt>
                  <dd className="mt-0.5">{currently.learning}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs">Certification</dt>
                  <dd className="mt-0.5">{currently.certification}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs">Goal</dt>
                  <dd className="mt-0.5">{currently.goal}</dd>
                </div>
              </dl>
              <p className="text-muted mt-4 font-mono text-[11px]">
                Updated {currently.lastUpdated}
              </p>
            </div>

            <div className="border-border bg-surface/40 rounded-xl border p-5">
              <h2 className="text-sm font-semibold">Outside of work</h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {interests.map((interest) => (
                  <li key={interest}>
                    <Badge size="sm" variant="outline">
                      {interest}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <ExperienceSection />
      <SkillsSection />
    </>
  );
}
