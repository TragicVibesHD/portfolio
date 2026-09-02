import { FileText, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/brand-icons';
import { socialLinks, type SocialIcon } from '@/lib/site';
import { cn, isPlaceholder } from '@/lib/utils';

const icons: Record<SocialIcon, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  resume: FileText,
};

/**
 * Social icon row.
 *
 * Links whose URL is still a [PLACEHOLDER] are filtered out entirely — a
 * missing icon is far better than one that 404s in front of a recruiter.
 */
export function SocialLinks({ className }: { className?: string }) {
  const links = socialLinks.filter((link) => {
    if (link.icon === 'email') return !isPlaceholder(link.href.replace('mailto:', ''));
    return !isPlaceholder(link.href);
  });

  if (links.length === 0) return null;

  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {links.map((link) => {
        const Icon = icons[link.icon];
        const external = link.href.startsWith('http');
        return (
          <li key={link.label}>
            <a
              href={link.href}
              aria-label={link.label}
              title={link.label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-muted hover:text-foreground hover:bg-surface inline-flex size-10 items-center justify-center rounded-lg transition-colors"
            >
              <Icon className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
