import { describe, expect, it } from 'vitest';
import { contactSchema } from './validation';

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'I would like to talk to you about a junior developer role.',
};

describe('contactSchema', () => {
  it('accepts a well-formed submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    const result = contactSchema.parse({ ...valid, name: '  Jane Doe  ' });
    expect(result.name).toBe('Jane Doe');
  });

  it('rejects an invalid email address', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a message that is too short to act on', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'hi' });
    expect(result.success).toBe(false);
  });

  it('rejects an oversized message rather than storing it', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'x'.repeat(5001) });
    expect(result.success).toBe(false);
  });

  it('allows the honeypot to be absent or empty', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, website: '' }).success).toBe(true);
  });

  it('rejects a filled honeypot, which only a bot would submit', () => {
    const result = contactSchema.safeParse({ ...valid, website: 'http://spam.example' });
    expect(result.success).toBe(false);
  });

  it('treats subject as optional', () => {
    expect(contactSchema.safeParse({ ...valid, subject: undefined }).success).toBe(true);
  });
});
