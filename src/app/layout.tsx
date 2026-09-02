import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { buildMetadata, JsonLd, personJsonLd, websiteJsonLd } from '@/lib/seo';
import { site, siteUrl } from '@/lib/site';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata(),
  title: {
    default: site.seo.defaultTitle,
    template: site.seo.titleTemplate,
  },
  keywords: [...site.seo.keywords],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#08090b' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is required by next-themes: it writes the
    // theme class onto <html> before React hydrates, so server and client
    // markup intentionally differ on this one element.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main" className="skip-link btn-focus">
            <span className="bg-accent text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium">
              Skip to content
            </span>
          </a>

          <Header />

          <main id="main" className="flex-1 pt-16">
            {children}
          </main>

          <Footer />
        </ThemeProvider>

        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
