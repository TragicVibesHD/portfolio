import { describe, expect, it } from 'vitest';
import { createRandom } from './random';
import {
  caseStudyProjects,
  featuredProjects,
  getProject,
  projectNeighbours,
  projects,
  usedCategories,
} from './projects';

describe('projects collection', () => {
  it('loads every case study from content', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('sorts by explicit order', () => {
    const orders = projects.map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('gives every project a unique slug', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('requires a summary and at least one technology on every project', () => {
    for (const project of projects) {
      expect(project.summary.length).toBeGreaterThan(0);
      expect(project.tech.length).toBeGreaterThan(0);
    }
  });

  it('only exposes featured projects that are actually flagged', () => {
    expect(featuredProjects.every((p) => p.featured)).toBe(true);
  });

  it('finds a project by slug and returns undefined for an unknown one', () => {
    const first = projects[0];
    expect(getProject(first.slug)?.title).toBe(first.title);
    expect(getProject('no-such-project')).toBeUndefined();
  });

  it('lists each used category exactly once', () => {
    const categories = usedCategories();
    expect(new Set(categories).size).toBe(categories.length);
  });
});

describe('projectNeighbours', () => {
  it('wraps around so the last case study links back to the first', () => {
    const last = caseStudyProjects[caseStudyProjects.length - 1];
    const { next } = projectNeighbours(last.slug);
    expect(next?.slug).toBe(caseStudyProjects[0].slug);
  });

  it('wraps backwards from the first case study to the last', () => {
    const { previous } = projectNeighbours(caseStudyProjects[0].slug);
    expect(previous?.slug).toBe(caseStudyProjects[caseStudyProjects.length - 1].slug);
  });

  it('returns no neighbours for an unknown slug', () => {
    expect(projectNeighbours('no-such-project')).toEqual({
      previous: null,
      next: null,
    });
  });
});

describe('createRandom', () => {
  it('is deterministic for a given seed, so 3D scenes are reproducible', () => {
    const a = createRandom(1234);
    const b = createRandom(1234);
    const drawsA = [a(), a(), a(), a(), a()];
    const drawsB = [b(), b(), b(), b(), b()];
    expect(drawsA).toEqual(drawsB);
  });

  it('produces different sequences for different seeds', () => {
    const a = createRandom(1);
    const b = createRandom(2);
    expect([a(), a(), a()]).not.toEqual([b(), b(), b()]);
  });

  it('stays within [0, 1)', () => {
    const random = createRandom(99);
    for (let i = 0; i < 500; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
