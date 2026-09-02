import type { Metadata } from 'next';
import { site, siteUrl } from './site';
import { isPlaceholder } from './utils';

/**
 * Builds page metadata from a small set of per-page overrides.
 *
 * Every page routes through this so canonical URLs, OG images and the title
 * template can never drift apart between routes.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
} = {}): Metadata {
  const url = `${siteUrl}${path}`;
  const resolvedTitle = title ?? site.seo.defaultTitle;
  const resolvedDescription = description ?? site.seo.description;
  const ogImage = image ?? `${siteUrl}/opengraph-image`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: site.seo.defaultTitle,
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: resolvedTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
  };
}

/**
 * schema.org Person graph.
 *
 * Placeholder links are stripped rather than emitted — publishing a
 * structured-data profile that points at a non-existent GitHub account is
 * worse than publishing no profile at all.
 */
export function personJsonLd() {
  const sameAs = [site.github, site.linkedin].filter((url) => !isPlaceholder(url));

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: isPlaceholder(site.name) ? site.shortName : site.name,
    url: siteUrl,
    jobTitle: site.role,
    description: site.intro,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TT',
      addressLocality: site.location,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'The University of the West Indies, St. Augustine Campus',
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(isPlaceholder(site.email) ? {} : { email: `mailto:${site.email}` }),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.seo.defaultTitle,
    url: siteUrl,
    description: site.seo.description,
    inLanguage: 'en',
  };
}

/** Per-project structured data for case-study pages. */
export function projectJsonLd(project: {
  title: string;
  summary: string;
  slug: string;
  tech: readonly string[];
  repo?: string;
  year: string;
}) {
  const codeRepository = isPlaceholder(project.repo) ? undefined : project.repo;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    programmingLanguage: [...project.tech],
    dateCreated: project.year,
    author: {
      '@type': 'Person',
      name: isPlaceholder(site.name) ? site.shortName : site.name,
      url: siteUrl,
    },
    ...(codeRepository ? { codeRepository } : {}),
  };
}

/** Renders a JSON-LD block. Serialised defensively against `</script>` injection. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
