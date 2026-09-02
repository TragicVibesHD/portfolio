import { Mail, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/sections/contact-form';
import { Badge } from '@/components/ui/badge';
import { GithubIcon, LinkedinIcon } from '@/components/ui/brand-icons';
import { Section, SectionHeading } from '@/components/ui/section';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import { isPlaceholder } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: `Get in touch with me about junior developer, graduate programme and internship-to-hire opportunities. Based in ${site.location}.`,
  path: '/contact',
});

export default function ContactPage() {
  const hasEmail = !isPlaceholder(site.email);
  const hasGithub = !isPlaceholder(site.github);
  const hasLinkedin = !isPlaceholder(site.linkedin);

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Get in touch"
        title="Contact"
        description={site.availability}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="max-w-xl">
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="border-border bg-surface/40 rounded-xl border p-5">
            <h2 className="text-sm font-semibold">Other ways to reach me</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {hasEmail ? (
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-muted hover:text-accent inline-flex items-center gap-2.5 transition-colors"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden="true" />
                    {site.email}
                  </a>
                </li>
              ) : null}
              {hasLinkedin ? (
                <li>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent inline-flex items-center gap-2.5 transition-colors"
                  >
                    <LinkedinIcon className="size-4 shrink-0" />
                    LinkedIn
                  </a>
                </li>
              ) : null}
              {hasGithub ? (
                <li>
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent inline-flex items-center gap-2.5 transition-colors"
                  >
                    <GithubIcon className="size-4 shrink-0" />
                    GitHub
                  </a>
                </li>
              ) : null}
              <li className="text-muted inline-flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {site.location}
              </li>
            </ul>
          </div>

          <div className="border-accent/25 bg-accent-subtle rounded-xl border p-5">
            <h2 className="text-accent text-sm font-semibold">What I am looking for</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {site.targetRoles.map((role) => (
                <li key={role}>
                  <Badge size="sm" variant="accent">
                    {role}
                  </Badge>
                </li>
              ))}
            </ul>
            <p className="text-muted mt-4 text-sm leading-relaxed">
              Graduating {site.expectedGraduation} · {site.educationStatus}
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
