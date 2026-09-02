import { ArrowRight, FileText, MapPin } from 'lucide-react';
import Link from 'next/link';
import { HeroCanvas } from '@/components/three/hero-canvas';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';
import { isPlaceholder } from '@/lib/utils';

/**
 * Hero.
 *
 * All copy is server-rendered plain HTML so the <h1> is the LCP element and
 * never waits on the 3D chunk. The canvas is layered behind at z-0 with
 * pointer-events disabled, so it can never intercept a click or a tab stop.
 */
export function Hero() {
  const displayName = isPlaceholder(site.name) ? null : site.name;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.35]" />
      <HeroCanvas className="-z-10" />

      <div className="container-page relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20">
        <div className="max-w-3xl">
          <p className="border-border bg-surface/60 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="bg-accent absolute inline-flex size-full animate-ping rounded-full opacity-60" />
              <span className="bg-accent relative inline-flex size-2 rounded-full" />
            </span>
            {site.availabilityShort} · Graduating {site.expectedGraduation}
          </p>

          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            {displayName ? (
              <>
                <span className="block">{displayName}</span>
                <span className="text-muted mt-2 block text-2xl font-normal sm:text-3xl lg:text-4xl">
                  {site.headline}
                </span>
              </>
            ) : (
              site.headline
            )}
          </h1>

          <p className="text-muted mt-7 max-w-2xl text-base leading-relaxed sm:text-lg">
            {site.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/projects">
                View my work
                <ArrowRight />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <a href={site.resumePath} target="_blank" rel="noopener noreferrer">
                <FileText />
                Résumé
              </a>
            </Button>
          </div>

          <p className="text-muted mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {site.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-border-strong inline-block h-4 w-px" aria-hidden="true" />
              {site.educationStatus}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
