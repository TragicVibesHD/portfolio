import { allProjects } from 'content-collections';

export type Project = (typeof allProjects)[number];

/**
 * Canonical sort: explicit `order` first, then newest year, then title.
 *
 * Sorting is centralised here so every surface (home grid, index page,
 * prev/next links, sitemap) presents projects in the same sequence.
 */
function byOrder(a: Project, b: Project): number {
  if (a.order !== b.order) return a.order - b.order;
  if (a.year !== b.year) return b.year.localeCompare(a.year);
  return a.title.localeCompare(b.title);
}

export const projects: Project[] = [...allProjects].sort(byOrder);

export const featuredProjects: Project[] = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Only projects that opt in to a generated case-study page. */
export const caseStudyProjects: Project[] = projects.filter((p) => p.caseStudy);

/** Every category actually in use, in the order projects present them. */
export function usedCategories(): string[] {
  const seen = new Set<string>();
  for (const project of projects) {
    for (const category of project.categories) seen.add(category);
  }
  return [...seen];
}

/**
 * Neighbouring case studies for prev/next navigation.
 * Wraps around so the last project links back to the first.
 */
export function projectNeighbours(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const list = caseStudyProjects;
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1 || list.length < 2) return { previous: null, next: null };

  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}
