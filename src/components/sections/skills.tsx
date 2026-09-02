import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { currentlyLearning, skillGroups } from '@/lib/data/skills';

export function SkillsSection() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="What I work with"
        title="Skills & tools"
        description="Grouped by area rather than rated with percentages — proficiency bars are unverifiable, so the projects above are the real evidence."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.title} delay={index * 60}>
            <div className="border-border bg-surface/40 h-full rounded-xl border p-5">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Badge size="sm">{skill}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6">
        <div className="border-accent/25 bg-accent-subtle rounded-xl border p-5">
          <h3 className="text-accent text-sm font-semibold">Currently learning</h3>
          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {currentlyLearning.map((item) => (
              <li key={item}>
                <Badge size="sm" variant="accent">
                  {item}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
