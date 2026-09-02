import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projectViews } from '@/db/schema';
import { caseStudyProjects } from '@/lib/projects';

/**
 * Project view counter.
 *
 * Kept as a route handler rather than a server action so the case-study
 * pages stay fully static — the count is fetched and incremented from the
 * client after paint, and a database outage costs one small widget rather
 * than the page.
 */

const validSlugs = new Set(caseStudyProjects.map((project) => project.slug));

function isValidSlug(slug: string): boolean {
  return validSlugs.has(slug);
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Unknown project' }, { status: 404 });
  }

  if (!db) return NextResponse.json({ count: null });

  try {
    const [row] = await db
      .select({ count: projectViews.count })
      .from(projectViews)
      .where(sql`${projectViews.slug} = ${slug}`)
      .limit(1);

    return NextResponse.json({ count: row?.count ?? 0 });
  } catch (error) {
    console.error('Failed to read view count', error);
    return NextResponse.json({ count: null });
  }
}

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Unknown project' }, { status: 404 });
  }

  if (!db) return NextResponse.json({ count: null });

  try {
    // Single atomic upsert: concurrent visits can never lose an increment
    // the way a read-then-write pair would.
    const [row] = await db
      .insert(projectViews)
      .values({ slug, count: 1 })
      .onConflictDoUpdate({
        target: projectViews.slug,
        set: {
          count: sql`${projectViews.count} + 1`,
          updatedAt: sql`now()`,
        },
      })
      .returning({ count: projectViews.count });

    return NextResponse.json({ count: row?.count ?? null });
  } catch (error) {
    console.error('Failed to record view', error);
    return NextResponse.json({ count: null });
  }
}
