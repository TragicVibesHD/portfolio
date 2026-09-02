'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { contactSchema, type ContactInput } from '@/lib/validation';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  async function onSubmit(values: ContactInput) {
    setStatus('submitting');
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setServerError(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      reset();
      setStatus('success');
    } catch {
      setServerError('Could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="border-accent/30 bg-accent-subtle flex flex-col items-center gap-3 rounded-xl border px-6 py-12 text-center"
      >
        <span className="bg-accent text-accent-foreground flex size-11 items-center justify-center rounded-full">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h3 className="font-semibold">Message sent</h3>
        <p className="text-muted max-w-sm text-sm leading-relaxed">
          Thanks for getting in touch — I will reply as soon as I can.
        </p>
        <Button variant="ghost" onClick={() => setStatus('idle')} className="mt-1">
          Send another message
        </Button>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field
        label="Name"
        error={errors.name?.message}
        input={
          <input
            {...register('name')}
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={inputClass(Boolean(errors.name))}
            placeholder="Jane Doe"
          />
        }
      />

      <Field
        label="Email"
        error={errors.email?.message}
        input={
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={inputClass(Boolean(errors.email))}
            placeholder="jane@company.com"
          />
        }
      />

      <Field
        label="Subject"
        optional
        error={errors.subject?.message}
        input={
          <input
            {...register('subject')}
            type="text"
            aria-invalid={Boolean(errors.subject)}
            className={inputClass(Boolean(errors.subject))}
            placeholder="Junior developer role"
          />
        }
      />

      <Field
        label="Message"
        error={errors.message?.message}
        input={
          <textarea
            {...register('message')}
            rows={6}
            aria-invalid={Boolean(errors.message)}
            className={cn(inputClass(Boolean(errors.message)), 'resize-y')}
            placeholder="Tell me a little about the role or project…"
          />
        }
      />

      {/* Honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input {...register('website')} id="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {serverError ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {serverError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send aria-hidden="true" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}

function inputClass(invalid: boolean): string {
  return cn(
    'w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm transition-colors',
    'placeholder:text-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    invalid ? 'border-red-500/60' : 'border-border hover:border-border-strong',
  );
}

function Field({
  label,
  input,
  error,
  optional = false,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional ? <span className="text-muted text-xs font-normal">Optional</span> : null}
      </span>
      <span className="mt-1.5 block">{input}</span>
      {error ? (
        <span className="mt-1.5 block text-xs text-red-600 dark:text-red-400">{error}</span>
      ) : null}
    </label>
  );
}
