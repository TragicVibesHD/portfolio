import { z } from 'zod';

/**
 * Contact form schema, shared by the client form and the route handler.
 *
 * One definition means the browser and the server can never disagree about
 * what is valid. The client copy is a convenience; the server revalidates
 * everything because client-side validation is not a security boundary.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120, 'That name is too long'),

  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .max(254, 'That email address is too long')
    .email('Please enter a valid email address'),

  subject: z.string().trim().max(200, 'That subject is too long').optional(),

  message: z
    .string()
    .trim()
    .min(20, 'Please write at least 20 characters so I know how to help')
    .max(5000, 'Please keep your message under 5000 characters'),

  /**
   * Honeypot. Hidden from real users via CSS and aria-hidden, so anything
   * that fills it in is a bot. Named innocuously on purpose.
   */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
