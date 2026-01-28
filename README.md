# Personal Resume Website (Eleventy)

A maintainable, content-driven personal website for Rithwik Gokhale built with Eleventy (11ty). Content is stored in JSON/Markdown and rendered with Nunjucks templates. Assets and styling reuse the original HTML5UP template.

## Project Structure

```
root/
  .eleventy.js           # Eleventy config (filters, collections, passthroughs)
  .gitignore             # Ignores node_modules, _site, OS files
  netlify.toml           # Netlify build config
  package.json           # Scripts and dependencies
  resume-website/        # Original assets/images (passthrough)
  src/
    _data/               # Global data (JSON)
    includes/            # Shared partials and section templates
    layouts/             # Base/blog/docs layouts (using template inheritance)
    blog/                # Markdown blog posts
    docs/                # Technical documentation page
    tags/                # Tag index and tag pages (auto-generated)
    feed.njk             # RSS/Atom feed template
    index.njk            # Home page composed of sections
```

## Local Development

Requirements: Node 18+

```bash
npm install
npm run dev    # starts Eleventy dev server
# open the local URL Eleventy prints (usually http://localhost:8080)
```

## Build

```bash
npm run build  # outputs the static site to _site/
```

## Deploy (Netlify)

- Build command: `npm run build`
- Publish directory: `_site`
- Node version: 18 (configured via `netlify.toml`)

## Content Editing

- **Site meta and navigation**: `src/_data/site.json`, `src/_data/nav.json`
- **About/Education/Experience/Projects/Skills/Contact**: JSON files in `src/_data/`
- **Blog posts**: Markdown files in `src/blog/*.md` (use `layout: blog.njk`)
- **Technical docs**: `src/docs/index.md` (uses `layout: docs.njk`)

## Features

### Layout Inheritance
All layouts extend `base.njk` using Nunjucks block inheritance:
- `base.njk` - Core HTML structure with blocks for `title`, `meta`, `main`, `scripts`
- `blog.njk` - Extends base for blog posts (no SPA scripts, formatted date, tags)
- `docs.njk` - Extends base for documentation (noindex, no SPA scripts)

### Blog System
- **Date formatting**: Uses Luxon via `formatDate` filter (e.g., "August 1, 2025")
- **Tags**: Posts can have tags in frontmatter; tag pages auto-generated at `/tags/`
- **RSS Feed**: Available at `/feed.xml`
- **Homepage**: Shows latest 6 posts; link to RSS feed

### Filters Available
- `formatDate` - Format dates as "MMMM d, yyyy"
- `dateToRfc3339` - ISO date format for feeds
- `calculateDuration` - Calculate duration between dates (for experience)
- `limit` - Limit array to first N items

## Security

All external links with `target="_blank"` include `rel="noopener noreferrer"` for security.

## Notes

- The homepage is a composed single page. Blog posts, docs, and tag pages render as separate routes.
- Assets (CSS/JS/fonts/images) are copied via Eleventy passthrough from `resume-website/`.
- The `blog` collection is sorted by date descending.
