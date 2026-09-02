import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';

/**
 * Project case studies.
 *
 * Frontmatter is validated at build time, so a malformed project fails the
 * build with a clear message instead of shipping a broken card. Optional
 * links may be omitted entirely or left as [BRACKET_PLACEHOLDERS] — either
 * way the UI hides the button rather than rendering a dead link.
 */

export const PROJECT_CATEGORIES = [
  'Web Development',
  'Backend Development',
  'Data & Machine Learning',
  'Mobile Development',
  'Java Development',
  'Academic Projects',
  'Infrastructure & Networking',
] as const;

export const PROJECT_STATUSES = ['Completed', 'In development', 'Concept'] as const;

const projects = defineCollection({
  name: 'projects',
  directory: 'src/content/projects',
  include: '**/*.mdx',
  schema: z.object({
    /** The MDX body. Declared explicitly rather than relying on the
     *  implicit content property, which content-collections deprecated. */
    content: z.string(),
    title: z.string().min(1),
    /** One or two sentences, shown on the project card */
    summary: z.string().min(1),
    categories: z.array(z.enum(PROJECT_CATEGORIES)).min(1),
    tech: z.array(z.string()).min(1),
    features: z.array(z.string()).default([]),
    challenges: z.array(z.string()).default([]),
    /** What you personally did — reviewers look for this on team projects */
    contribution: z.string().optional(),
    lessons: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    repo: z.string().optional(),
    demo: z.string().optional(),
    status: z.enum(PROJECT_STATUSES).default('Completed'),
    year: z.string(),
    featured: z.boolean().default(false),
    /** Set false to skip generating a case-study page */
    caseStudy: z.boolean().default(true),
    /** Lower sorts first */
    order: z.number().default(99),
  }),
  transform: async (doc, ctx) => {
    const mdx = await compileMDX(ctx, doc);
    const words = doc.content.split(/\s+/g).filter(Boolean).length;
    return {
      ...doc,
      mdx,
      slug: doc._meta.path,
      /** 200 wpm, floored at 1 minute */
      readingMinutes: Math.max(1, Math.round(words / 200)),
    };
  },
});

export default defineConfig({
  content: [projects],
});
