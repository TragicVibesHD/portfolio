import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Database client.
 *
 * DATABASE_URL is deliberately optional. The portfolio is fully functional
 * without a database — view counts hide themselves and contact submissions
 * fall back to email only. This keeps local development and the very first
 * deploy working before Neon is provisioned, and means a database outage
 * degrades one widget rather than taking down the site.
 */

const connectionString = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(connectionString);

export const db = connectionString
  ? drizzle(neon(connectionString), { schema })
  : null;

export { schema };
