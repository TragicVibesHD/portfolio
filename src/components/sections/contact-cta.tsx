import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { site } from '@/lib/site';
import { isPlaceholder } from '@/lib/utils';

export function ContactCta() {
  const hasEmail = !isPlaceholder(site.email);

  return (
    <Section id="contact-cta">
      <div className="border-border bg-surface/40 relative overflow-hidden rounded-2xl border px-6 py-14 text-center sm:px-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Let&rsquo;s build something
          </h2>
          <p className="text-muted mx-auto mt-4 max-w-xl text-base leading-relaxed">
            {site.availability} If you are hiring, or just want to talk about a
            project, I would be glad to hear from you.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">
                Get in touch
                <ArrowRight />
              </Link>
            </Button>

            {hasEmail ? (
              <Button asChild variant="outline" size="lg">
                <a href={`mailto:${site.email}`}>
                  <Mail />
                  {site.email}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
