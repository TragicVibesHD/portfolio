import type { Metadata } from 'next';
import { AboutPreview } from '@/components/sections/about-preview';
import { ContactCta } from '@/components/sections/contact-cta';
import { ExperienceSection } from '@/components/sections/experience';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { Hero } from '@/components/sections/hero';
import { SkillsSection } from '@/components/sections/skills';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({ path: '/' });

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <AboutPreview />
      <SkillsSection />
      <ExperienceSection />
      <ContactCta />
    </>
  );
}
