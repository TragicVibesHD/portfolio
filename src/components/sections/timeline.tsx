import { Reveal } from '@/components/ui/reveal';
import { timeline } from '@/lib/data/timeline';

export function Timeline() {
  return (
    <ol className="border-border mt-8 border-l">
      {timeline.map((milestone, index) => (
        <li key={milestone.title}>
          <Reveal delay={index * 60}>
            <div className="relative pb-8 pl-6 sm:pl-8">
              <span
                className="border-background bg-accent absolute top-1.5 -left-[7px] size-3 rounded-full border-2"
                aria-hidden="true"
              />
              <p className="text-accent font-mono text-xs tracking-wide">{milestone.date}</p>
              <h3 className="mt-1.5 font-medium">{milestone.title}</h3>
              <p className="text-muted mt-1 text-sm leading-relaxed">{milestone.description}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
