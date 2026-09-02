import Link from 'next/link';
import { navLinks, site } from '@/lib/site';
import { isPlaceholder } from '@/lib/utils';
import { SocialLinks } from './social-links';

export function Footer() {
  const year = new Date().getFullYear();
  const displayName = isPlaceholder(site.name) ? site.shortName : site.name;

  return (
    <footer className="border-border mt-24 border-t">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-[15px] font-semibold">{site.shortName}</p>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              {site.role} based in {site.location}. {site.availability}
            </p>
            <SocialLinks className="mt-4 -ml-2.5" />
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-border text-muted mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {displayName}. All rights reserved.
          </p>
          <p>
            Built with Next.js, TypeScript, Tailwind CSS and React Three Fiber.
            {site.sourceRepo ? (
              <>
                {' '}
                <a
                  href={site.sourceRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground underline underline-offset-4"
                >
                  Source
                </a>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
