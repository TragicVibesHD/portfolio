import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { experience } from '@/lib/data/experience';

export function ExperienceSection() {
  return (
    <Section id="experience" className="bg-surface/30 border-border border-y">
      <SectionHeading
        eyebrow="Where I have worked"
        title="Experience"
        description="Internships across corporate strategy and digital government, covering web systems, networking and digital media."
      />

      <ol className="mt-12 space-y-10">
        {experience.map((role, index) => (
          <li key={`${role.organisation}-${role.dates}`}>
            <Reveal delay={index * 90}>
              <div className="border-border relative border-l pb-2 pl-6 sm:pl-8">
                <span
                  className="border-background bg-accent absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2"
                  aria-hidden="true"
                />

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold">{role.role}</h3>
                  <span className="text-accent text-sm font-medium">{role.organisation}</span>
                </div>

                <p className="text-muted mt-1 font-mono text-xs">
                  {role.dates} · {role.location}
                </p>

                <p className="text-muted mt-3 text-sm leading-relaxed">{role.summary}</p>

                <ul className="text-muted mt-4 space-y-2 text-sm">
                  {role.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span className="text-accent mt-[7px] size-1 shrink-0 rounded-full bg-current" />
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {role.tech.map((tech) => (
                    <li key={tech}>
                      <Badge size="sm">{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
