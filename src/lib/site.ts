/**
 * Single source of truth for personal details, links and navigation.
 *
 * Anything wrapped in [SQUARE_BRACKETS] is a placeholder. `isPlaceholder()`
 * in lib/utils.ts detects these so unfilled links hide themselves rather
 * than rendering as broken buttons. See the "Before you publish"
 * checklist in README.md.
 */

export const site = {
  name: 'Shivan Justin Singh',
  /** Short form used in the header wordmark */
  shortName: 'Shivan Singh',

  role: 'Software Developer',
  headline: 'Computer Science graduate building practical software.',

  intro:
    'I have completed the required coursework for my BSc in Computer Science at The University of the West Indies, St. Augustine, and graduate in October 2026. I build practical software - web apps, optimization tools, machine-learning models and mobile apps - with Python, Java, Flask, SQL and JavaScript.',

  location: 'Trinidad and Tobago',
  timezone: 'America/Port_of_Spain',

  educationStatus: 'BSc Computer Science - coursework complete',
  expectedGraduation: 'October 2026',

  availability:
    'Open to junior developer, graduate programme and internship-to-hire opportunities.',
  availabilityShort: 'Open to work',

  targetRoles: [
    'Junior Software Developer',
    'Graduate Software Engineer',
    'Web / Backend Developer',
    'Data Analyst',
  ],

  email: 'shivan562@yahoo.com',
  /** Optional. Leave '' to keep your phone number off the site. */
  phone: '',

  /** Resume lives in /public. */
  resumePath: '/resume.pdf',

  github: 'https://github.com/TragicVibesHD',
  linkedin: 'https://www.linkedin.com/in/shivan-singh-8639b2360',
  /** Public repo for this site, shown in the footer. Leave '' to hide. */
  sourceRepo: 'https://github.com/TragicVibesHD/portfolio',

  seo: {
    titleTemplate: '%s - Shivan Justin Singh',
    defaultTitle: 'Shivan Justin Singh - Software Developer',
    description:
      'Portfolio of Shivan Justin Singh, a Computer Science graduate from The University of the West Indies based in Trinidad and Tobago, building software with Python, Java, Flask, SQL and JavaScript.',
    keywords: [
      'software developer',
      'computer science graduate',
      'Trinidad and Tobago',
      'Python',
      'Java',
      'Flask',
      'machine learning',
      'portfolio',
    ],
  },
} as const;

export const FALLBACK_SITE_URL = 'http://localhost:3000';

/**
 * Resolve the canonical origin from the first usable candidate.
 *
 * Two things make this less trivial than it looks:
 *
 * 1. Next inlines `process.env.NEXT_PUBLIC_*` at build time and substitutes
 *    an EMPTY STRING when the variable is unset. `?? fallback` therefore
 *    does not fire, because `''` is not nullish. That empty string reached
 *    `new URL()` in the root layout and failed the entire Vercel build with
 *    ERR_INVALID_URL. Candidates are trimmed and emptiness-checked instead.
 *
 * 2. `new URL()` throws. At module scope that is unrecoverable and takes the
 *    whole build down, so every candidate is validated and a bad one is
 *    skipped rather than thrown.
 *
 * Bare hostnames (Vercel supplies `my-app.vercel.app`, no protocol) are
 * upgraded to https.
 */
export function resolveSiteUrl(...candidates: (string | undefined)[]): string {
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;

    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

    try {
      return new URL(withProtocol).href.replace(/\/$/, '');
    } catch {
      // Malformed value — try the next candidate rather than failing the build.
    }
  }

  return FALLBACK_SITE_URL;
}

/**
 * Canonical origin.
 *
 * Set NEXT_PUBLIC_SITE_URL once there is a custom domain. Until then the
 * Vercel-provided values keep canonical tags, the sitemap and OG images
 * pointing at the real deployment with no configuration at all.
 */
export const siteUrl = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  // Stable across deploys, unlike VERCEL_URL which is per-deployment.
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL,
  process.env.VERCEL_URL,
);

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Lab', href: '/lab' },
  { label: 'Contact', href: '/contact' },
];

export type SocialIcon = 'github' | 'linkedin' | 'email' | 'resume';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: site.github, icon: 'github' },
  { label: 'LinkedIn', href: site.linkedin, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${site.email}`, icon: 'email' },
  { label: 'Resume', href: site.resumePath, icon: 'resume' },
];

/** Small "Currently" panel - cheap to keep fresh, reads as an active profile. */
export const currently = {
  building: 'Polishing my portfolio and project case studies',
  learning: 'Cloud platforms and containerized deployment (Docker)',
  certification: 'CompTIA A+ (in progress)',
  goal: 'Landing an entry-level software developer or graduate programme role',
  lastUpdated: 'September 2026',
};

/** Deliberately secondary to the professional content. */
export const interests = [
  'Football',
  'Trading card games',
  'Fitness',
  'Kickboxing',
  'Hiking',
  'Swimming',
];
