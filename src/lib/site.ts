/**
 * Single source of truth for personal details, links and navigation.
 *
 * Anything wrapped in [SQUARE_BRACKETS] is a placeholder. `isPlaceholder()`
 * in lib/utils.ts detects these so unfilled links hide themselves rather
 * than rendering as broken buttons. See the "Before you publish"
 * checklist in README.md.
 */

export const site = {
  /** PLACEHOLDER - replace with your full name */
  name: '[FULL_NAME]',
  /** Short form used in the header wordmark */
  shortName: '[FULL_NAME]',

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

  /** PLACEHOLDER - your real email address */
  email: '[EMAIL_ADDRESS]',
  /** Optional. Leave '' to keep your phone number off the site. */
  phone: '',

  /** Resume lives in /public. Replace the placeholder PDF before launch. */
  resumePath: '/resume.pdf',

  github: 'https://github.com/TragicVibesHD',
  /** PLACEHOLDER - replace with your real LinkedIn profile */
  linkedin: 'https://www.linkedin.com/in/[LINKEDIN_USERNAME]',
  /** Public repo for this site, shown in the footer. Leave '' to hide. */
  sourceRepo: 'https://github.com/TragicVibesHD/portfolio',

  seo: {
    titleTemplate: '%s - [FULL_NAME]',
    defaultTitle: '[FULL_NAME] - Software Developer',
    description:
      'Portfolio of [FULL_NAME], a Computer Science graduate from The University of the West Indies based in Trinidad and Tobago, building software with Python, Java, Flask, SQL and JavaScript.',
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

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
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
