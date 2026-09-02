import { sql } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * Per-project view counter.
 *
 * One row per project slug. Incremented from the case-study page via an
 * upsert, so there is no read-modify-write race between concurrent visits.
 */
export const projectViews = pgTable('project_views', {
  slug: varchar('slug', { length: 128 }).primaryKey(),
  count: integer('count').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

/**
 * Contact form submissions.
 *
 * Stored as a durable record so a transient email-provider outage never
 * loses a message. `ipHash` is a salted hash, never a raw IP address — it
 * exists only for rate limiting and abuse triage.
 */
export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 120 }).notNull(),
    email: varchar('email', { length: 254 }).notNull(),
    subject: varchar('subject', { length: 200 }),
    message: text('message').notNull(),
    ipHash: varchar('ip_hash', { length: 64 }),
    userAgent: varchar('user_agent', { length: 400 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [index('contact_created_at_idx').on(table.createdAt)],
);

export type ProjectView = typeof projectViews.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
