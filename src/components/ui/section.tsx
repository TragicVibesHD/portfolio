import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  /** Renders a constrained inner container. Set false for full-bleed content. */
  contained?: boolean;
}

export function Section({ id, className, contained = true, children, ...props }: SectionProps) {
  return (
    <section id={id} className={cn('py-20 sm:py-28', className)} {...props}>
      {contained ? <div className="container-page">{children}</div> : children}
    </section>
  );
}

interface SectionHeadingProps {
  /** Small uppercase label above the title */
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  /** Heading level — keep exactly one h1 per page */
  as?: 'h1' | 'h2';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow ? (
        <p className="text-accent mb-3 font-mono text-xs tracking-[0.18em] uppercase">{eyebrow}</p>
      ) : null}
      <Heading className="text-3xl font-semibold sm:text-4xl">{title}</Heading>
      {description ? (
        <p className="text-muted mt-4 text-base leading-relaxed sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
