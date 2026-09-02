import { createHash, randomUUID } from 'node:crypto';
import { and, gte, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/db';
import { contactSubmissions } from '@/db/schema';
import { site } from '@/lib/site';
import { contactSchema } from '@/lib/validation';

/**
 * Contact form handler.
 *
 * Order of operations matters: the message is persisted first, then email
 * is attempted. If the email provider is down the submission is still
 * recorded, so a message is never silently lost — the visitor gets a
 * success response because, from their point of view, it arrived.
 */

const RATE_LIMIT_WINDOW_MINUTES = 60;
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request body' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please check the form and try again',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot tripped. Return a success shape so bots learn nothing from
  // the response, but do not store or forward anything.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const ipHash = hashIp(request);

  if (db) {
    try {
      const withinWindow = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000);

      const [recent] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(contactSubmissions)
        .where(
          and(
            sql`${contactSubmissions.ipHash} = ${ipHash}`,
            gte(contactSubmissions.createdAt, withinWindow),
          ),
        );

      if ((recent?.count ?? 0) >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: 'Too many messages from this address. Please try again later.' },
          { status: 429 },
        );
      }

      await db.insert(contactSubmissions).values({
        id: randomUUID(),
        name,
        email,
        subject: subject || null,
        message,
        ipHash,
        userAgent: request.headers.get('user-agent')?.slice(0, 400) ?? null,
      });
    } catch (error) {
      // A database problem must not cost the visitor their message — fall
      // through to email rather than failing the request outright.
      console.error('Failed to persist contact submission', error);
    }
  }

  const sent = await sendEmail({ name, email, subject, message });

  // With neither a database nor a mail provider configured there is nowhere
  // for the message to go, and saying "sent" would be a lie.
  if (!sent && !db) {
    return NextResponse.json(
      { error: 'The contact form is not configured yet. Please email me directly.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}

async function sendEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) return false;

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to,
      // Reply goes to the sender, not to the from address
      replyTo: email,
      subject: subject?.trim() ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        subject ? `Subject: ${subject}` : null,
        '',
        message,
      ]
        .filter((line) => line !== null)
        .join('\n'),
    });

    if (error) {
      console.error('Resend rejected the message', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send contact email', error);
    return false;
  }
}

/**
 * Salted hash of the client IP.
 *
 * Only ever stored hashed — the raw address is never written down. Used
 * solely for the rate-limit window above.
 */
function hashIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const salt = process.env.RESEND_API_KEY ?? site.seo.defaultTitle;

  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 64);
}
