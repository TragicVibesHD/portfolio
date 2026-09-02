import { ArrowRight, GraduationCap, Target } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { education } from '@/lib/data/education';
import { currently, site } from '@/lib/site';

export function AboutPreview() {
  return (
    <Section id="about" className="bg-surface/30 border-border border-y">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Who I am"
            title="About me"
            description={site.intro}
          />

          <div className="mt-8">
            <p className="text-muted text-sm leading-relaxed">
              I am looking for roles where I can keep building real systems and
              learn from people further along than me. The work below spans
              constraint optimization, machine learning, full-stack web and
              native Android — all of it built end to end rather than followed
              from a tutorial.
            </p>

            <h3 className="mt-8 text-sm font-semibold">Roles I am targeting</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {site.targetRoles.map((role) => (
                <li key={role}>
                  <Badge size="sm" variant="accent">
                    {role}
                  </Badge>
                </li>
              ))}
            </ul>

            <Button asChild variant="ghost" className="mt-8 -ml-3">
              <Link href="/about">
                More about me
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Reveal>
            <div className="border-border bg-background rounded-xl border p-5">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="text-accent size-4" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Education</h3>
              </div>
              <p className="mt-3 text-sm font-medium">{education.qualification}</p>
              <p className="text-muted mt-1 text-sm">{education.institution}</p>
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
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="border-border bg-background rounded-xl border p-5">
              <div className="flex items-center gap-2.5">
                <Target className="text-accent size-4" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Currently</h3>
              </div>
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
              </dl>
              <p className="text-muted mt-4 font-mono text-[11px]">
                Updated {currently.lastUpdated}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
