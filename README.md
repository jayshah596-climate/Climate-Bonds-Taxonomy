# Climate Bonds Taxonomy Explorer

An interactive knowledge platform for the [Climate Bonds Taxonomy](https://www.climatebonds.net/expertise/taxonomy/climate-bonds-taxonomy): Mitigation, Resilience, Blue and Methane Abatement. Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

**This is an independent, unofficial project** — a navigational layer over publicly available Climate Bonds Initiative content. It is not affiliated with or endorsed by the Climate Bonds Initiative. Every criteria page links back to the official source on `climatebonds.net`.

## What's inside

- **Taxonomy Explorer** — 4 categories, 29 sectors, each with eligible activities, technical criteria, certification notes, official links, downloads, related blogs, FAQs and related sectors.
- **Knowledge Graph** — an interactive React Flow network of every category/sector/relationship, with a click-to-inspect side panel.
- **Global Map** — Leaflet map of real, verified Climate Bonds Certified issuance (sourced from the Certified Bonds Database) plotted by country.
- **Global search** — a `⌘K` command palette plus a dedicated `/search` page, powered by Fuse.js over the full indexed content (sectors, downloads, blogs, case studies, FAQs, glossary).
- **Investor Hub / Issuer Hub / Certification Pathway** — role-oriented guidance, including an animated 9-stage certification workflow.
- **Case Studies / Blog Hub / Download Center** — content browsers with filtering, previewable PDFs, and links to official sources.
- **AI Assistant** — a chat widget backed by `/api/assistant`. Runs a local retrieval-only mode by default (Fuse.js search over the knowledge base with citations); if `ANTHROPIC_API_KEY` is set, it grounds a real Claude call in the same retrieved context.
- **Analytics dashboard** — Recharts visualizations of sector coverage, certification status and document counts, computed live from the knowledge base.
- **Bookmarks, history, compare, print/export** — client-side, persisted to `localStorage` via Zustand.
- **Admin panel** — trigger a recrawl, run a live broken-link check, and review recent content/version history.
- **SEO** — dynamic `sitemap.xml` / `robots.txt`, JSON-LD (WebSite, BreadcrumbList, FAQPage, Article), OpenGraph/Twitter metadata on every page.

## The knowledge base and crawler

All content lives in [`src/data/knowledge-base.json`](src/data/knowledge-base.json), typed by [`src/lib/types.ts`](src/lib/types.ts) and accessed through [`src/lib/data.ts`](src/lib/data.ts).

[`scripts/crawl.mjs`](scripts/crawl.mjs) is a real, working breadth-first crawler that starts from the Climate Bonds taxonomy hub pages, stays strictly within `climatebonds.net`, and produces a flat catalog of discovered pages and documents (`src/data/crawl-output.json`). Run it directly:

```bash
npm run crawl
```

or trigger it from the Admin panel (`/admin` → "Trigger recrawl"), which calls `POST /api/admin/check-links` and `POST /api/admin/recrawl` server-side.

> **Note:** this crawler needs outbound network access to `climatebonds.net`. In network-restricted sandboxes (including the one this project was originally built in) those requests will fail — the endpoints report that clearly rather than failing silently. The curated `knowledge-base.json` was seeded from verified, real `climatebonds.net` URLs and public search results, not fabricated. The crawler's raw output is intended to feed an editorial review step before being merged into the curated dataset — sector/criteria mapping is a judgment call that shouldn't be fully automated.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · React Flow · Recharts · Leaflet / react-leaflet · Fuse.js · Zustand · next-themes · Radix UI primitives (hand-rolled shadcn/ui-style components in `src/components/ui`) · Lucide icons · `@anthropic-ai/sdk` (optional, for the AI assistant's LLM mode).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No (defaults to a placeholder) | Canonical URL used in metadata, sitemap and JSON-LD. |
| `ANTHROPIC_API_KEY` | No | If set, the AI Assistant grounds a real Claude call in the retrieved knowledge-base context instead of the local retrieval-only fallback. |

### Scripts

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
npm run crawl   # run the site crawler/indexer (scripts/crawl.mjs)
```

## Deployment

Designed for zero-config deployment on [Vercel](https://vercel.com):

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` (and optionally `ANTHROPIC_API_KEY`) as environment variables.
4. Deploy — `vercel.json` pins the Next.js framework preset.

All taxonomy/sector/case-study/blog pages are statically generated (`generateStaticParams`) with ISR-friendly data access; the AI assistant and admin endpoints run as Node.js route handlers.

## Project structure

```
src/
  app/                    # App Router routes (pages + API routes)
  components/
    ui/                   # Hand-rolled shadcn/ui-style primitives (Radix + CVA)
    layout/                # Header, footer, theme toggle
    home/ taxonomy/ graph/ map/ certification/ downloads/ charts/ assistant/ faq/ search/ common/
  data/
    knowledge-base.json   # Curated taxonomy content (categories, sectors, downloads, blogs, case studies, FAQs, glossary, certification pathway)
    crawl-output.json     # Raw crawler output (generated by scripts/crawl.mjs; not committed by default)
  lib/                    # Data access, search index, assistant logic, store, SEO helpers
scripts/
  crawl.mjs               # Site crawler / indexer
```

## Content accuracy note

Sector descriptions, criteria summaries and glossary entries are original explanatory text written for this project, cross-referenced against real, verified `climatebonds.net` URLs discovered via search — not scraped verbatim. Case studies (Grand Paris Express, NAB SDG Green Bond Programme, Vadodara Municipal Corporation, EnBW, Huadian New Energy Group) reflect publicly reported facts about real Certified issuances. Always follow the "Official Climate Bonds Links" on each page for authoritative criteria documents before making financing decisions.
