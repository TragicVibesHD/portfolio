# Portfolio

A production-grade personal portfolio for a Computer Science graduate of The University of the West Indies, St. Augustine — built to be fast, accessible, and honest about what it does.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · React Three Fiber · MDX · Neon Postgres + Drizzle

## Contents

- [What is here](#what-is-here)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Commands](#commands)
- [Editing your content](#editing-your-content)
- [Before you publish](#before-you-publish)
- [Optional services](#optional-services)
- [Deployment](#deployment)
- [Architecture notes](#architecture-notes)

## What is here

| Route              | What it does                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| `/`                | Hero with an ambient 3D object, featured projects, about, skills, experience |
| `/projects`        | Every project, filterable by category                                        |
| `/projects/[slug]` | Generated case study per project, with prev/next navigation                  |
| `/about`           | Long-form bio, career timeline, education, experience, skills                |
| `/lab`             | Interactive 3D scene — projects as orbitable objects                         |
| `/contact`         | Validated contact form                                                       |

Also generated: `sitemap.xml`, `robots.txt`, a social sharing image at `/opengraph-image`, JSON-LD for `Person`, `WebSite` and `SoftwareSourceCode`, and a 404 page.

### Deliberate choices

- **The 3D never blocks anything.** three.js is code split and never server-rendered, so the `<h1>` is the LCP element and never waits on it. Before the scene mounts, the device is checked for WebGL, core count, memory, data-saver mode and `prefers-reduced-motion`. Weak devices get simplified geometry; devices that opt out of motion get no canvas at all. Rendering stops when the canvas scrolls out of view.
- **The 3D is never the only path.** `/lab` lists every project as ordinary links beneath the canvas.
- **Placeholders can't become dead links.** Any value still written as `[BRACKET_TEXT]` is treated as unset, and the button or link that would have used it is not rendered.
- **The database is optional.** Without `DATABASE_URL` the site is fully functional — view counts simply do not appear.
- **No proficiency percentages.** Skills are grouped, not rated; the case studies are the evidence.

## Requirements

- [Node.js](https://nodejs.org) 20.9 or newer
- npm
- Git

## Getting started

```bash
npm install
```

```bash
npm run dev
```

The site runs at <http://localhost:3000>. No environment variables are needed for local development.

## Commands

| Command                 | What it does                                    |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Dev server on port 3000                         |
| `npm run build`         | Production build                                |
| `npm run start`         | Serve the production build                      |
| `npm run content:build` | Regenerate the typed content layer from MDX     |
| `npm run lint`          | ESLint                                          |
| `npm run typecheck`     | TypeScript, no emit                             |
| `npm test`              | Unit tests (Vitest)                             |
| `npm run test:e2e`      | End-to-end tests (Playwright)                   |
| `npm run format`        | Format everything with Prettier                 |
| `npm run db:generate`   | Generate SQL migrations from the Drizzle schema |
| `npm run db:migrate`    | Apply migrations                                |
| `npm run db:studio`     | Browse the database                             |

## Editing your content

Everything lives in data files — you should never need to edit a component to change your information.

| What                              | Where                        |
| --------------------------------- | ---------------------------- |
| Name, headline, links, email, SEO | `src/lib/site.ts`            |
| Navigation and social links       | `src/lib/site.ts`            |
| "Currently" panel and interests   | `src/lib/site.ts`            |
| Skills                            | `src/lib/data/skills.ts`     |
| Experience                        | `src/lib/data/experience.ts` |
| Education and coursework          | `src/lib/data/education.ts`  |
| Career timeline                   | `src/lib/data/timeline.ts`   |
| Projects and case studies         | `src/content/projects/*.mdx` |

### Adding a project

1. Copy any file in `src/content/projects/` and rename it. The filename becomes the URL slug.
2. Edit the frontmatter. `title`, `summary`, `categories`, `tech` and `year` are required; the schema in `content-collections.ts` validates the rest **at build time**, so a mistake fails the build with a clear message rather than shipping a broken card.
3. Omit `repo` and `demo` (or leave them as `[PLACEHOLDERS]`) and those buttons simply do not render.
4. Set `featured: true` to surface it on the home page; `order` controls sorting.
5. Add an image to `public/images/projects/` and reference it as `image: /images/projects/name.svg`.
6. Write the case study in the Markdown body. Set `caseStudy: false` to skip generating a page.

## Before you publish

Every item below is currently a placeholder. Search the repo for `[` to find them.

- [ ] `site.name` and `site.shortName` — your full name (`src/lib/site.ts`)
- [ ] `site.email` — your real email address
- [ ] `site.github` and `site.linkedin` — your real profile URLs
- [ ] `site.seo.titleTemplate`, `defaultTitle`, `description` — replace `[FULL_NAME]`
- [ ] `public/resume.pdf` — replace the placeholder PDF with your real résumé
- [ ] `repo` and `demo` URLs in each `src/content/projects/*.mdx`
- [ ] `NEXT_PUBLIC_SITE_URL` — your production URL, so canonical tags and OG images resolve
- [ ] `public/favicon.svg` — replace if you want your own mark

Nothing on this list will render as a broken link while it is unfilled; the affected element hides itself instead.

## Optional services

Both are free-tier and both are optional — the site works without either.

### Database (view counts, contact storage)

1. Create a project at [neon.tech](https://neon.tech).
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
3. Push the schema:

```bash
npm run db:push
```

Neon is used rather than Supabase specifically because Supabase's free tier pauses a project after about a week of inactivity and needs a manual unpause — a portfolio gets exactly that kind of sporadic traffic, and a recruiter hitting a paused backend is the worst possible time to find out.

### Email (contact form delivery)

1. Create an account at [resend.com](https://resend.com).
2. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in `.env.local`.

Without these, submissions are still stored in the database if one is configured. With neither configured, the form tells the visitor to email directly rather than pretending to send.

## Deployment

Built for [Vercel](https://vercel.com):

1. Push to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new). The framework is detected automatically.
3. Add environment variables (`NEXT_PUBLIC_SITE_URL`, and `DATABASE_URL` / `RESEND_API_KEY` / `CONTACT_TO_EMAIL` if used).
4. Deploy. Every pull request afterwards gets its own preview URL.

Vercel's Hobby plan is free but restricted to non-commercial use, which a personal portfolio satisfies. If that ever stops being true, Cloudflare Pages allows commercial use on its free tier.

## Architecture notes

```
src/
├── app/                    # Routes, API handlers, sitemap, robots, OG image
├── components/
│   ├── layout/             # Header, footer, theme
│   ├── sections/           # Composed page sections
│   ├── three/              # React Three Fiber scenes and their loaders
│   └── ui/                 # Primitives (button, badge, card, reveal)
├── content/projects/       # Case studies as MDX
├── db/                     # Drizzle schema and client
├── hooks/                  # useReducedMotion, useDeviceCapability
└── lib/                    # site config, data, SEO, validation, utils
```

- **Theming** is token-based. Every colour resolves through a semantic CSS variable defined once for light and once for dark, so the two themes cannot drift apart. `next-themes` sets the class before first paint, so there is no flash.
- **The theme toggle renders both icons** and lets CSS pick, rather than gating on a mounted flag — no hydration mismatch and no layout shift.
- **Browser state is read with `useSyncExternalStore`**, not `useEffect` + `setState`, because media queries and connection info are exactly the external stores it exists for.
- **3D scenes use a seeded PRNG** rather than `Math.random()`, so a re-render cannot silently rearrange a scene.
- **The contact route persists before it emails**, so a mail-provider outage never loses a message.
