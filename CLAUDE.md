# Starweft Docs

A static documentation site for the Starweft distributed multi-agent coordination CLI.

## Tech Stack

- **Framework**: Next.js 16 (App Router, static export to `out/`)
- **Content**: MDX via next-mdx-remote, frontmatter parsed with gray-matter
- **Styling**: Tailwind CSS 4 + PostCSS, CSS custom properties for dark/light theme
- **Code Highlighting**: Shiki with rehype-pretty-code
- **Search**: Orama (client-side full-text search, index built at compile time)
- **Validation**: Zod for frontmatter and config schemas

## Commands

- `npm run dev` — Dev server
- `npm run build` — Generate search index + Next.js static export
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript validation

## Key Directories

- `content/docs/` — MDX documentation files organized by section. Each section has a `meta.json` for page ordering.
- `src/app/docs/[[...slug]]/page.tsx` — Dynamic docs page (generates static paths)
- `src/components/docs/mdx/` — Custom MDX components (Callout, Steps, Tabs, CodeBlock, etc.)
- `src/lib/docs/` — Content layer (content.ts, mdx.ts, toc.ts, schemas.ts, search-index.ts)

## Content Conventions

- **Language**: All user-facing text on the site MUST be written in English. Do not use Japanese or any other language for page content, UI labels, headings, descriptions, or documentation prose.
- **Frontmatter**: Requires `title` and `description`. Supports `icon`, `badge`, `toc` (default true), `draft` (excluded in prod).
- **Section metadata**: `meta.json` in each content directory defines page order and section title.

## Deployment

- GitHub Pages at `https://co-r-e.github.io/starweft-docs/`
- `basePath: "/starweft-docs"` in next.config.ts
- `.nojekyll` in `public/` to prevent GitHub Pages from ignoring `_next/`
