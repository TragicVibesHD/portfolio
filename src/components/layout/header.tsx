'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog } from 'radix-ui';
import { navLinks, site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { SocialLinks } from './social-links';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-border bg-background/80 border-b backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="hover:text-accent text-[15px] font-semibold tracking-tight transition-colors"
        >
          {site.shortName}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive(link.href)
                      ? 'text-foreground bg-surface'
                      : 'text-muted hover:text-foreground hover:bg-surface',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <SocialLinks className="hidden sm:flex" />
          <ThemeToggle />

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="text-muted hover:text-foreground hover:bg-surface inline-flex size-10 items-center justify-center rounded-lg transition-colors md:hidden"
              >
                <Menu className="size-5" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden" />
              <Dialog.Content className="bg-background border-border fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col border-l p-6 shadow-xl md:hidden">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-sm font-semibold">Menu</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="text-muted hover:text-foreground hover:bg-surface inline-flex size-10 items-center justify-center rounded-lg transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Site navigation links</Dialog.Description>

                <nav aria-label="Mobile" className="mt-6">
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={isActive(link.href) ? 'page' : undefined}
                          // Close on click rather than reacting to a pathname
                          // change: navigating to the current route would not
                          // fire that effect, leaving the sheet stuck open.
                          onClick={() => setOpen(false)}
                          className={cn(
                            'block rounded-lg px-3 py-3 text-base transition-colors',
                            isActive(link.href)
                              ? 'text-foreground bg-surface'
                              : 'text-muted hover:text-foreground hover:bg-surface',
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto pt-6">
                  <SocialLinks />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
