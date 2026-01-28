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
npm run dev
```

Open the local URL Eleventy prints, usually http://localhost:8080.

## Build

```bash
npm run build
```

The build outputs the static site to `_site/`.

## Deploy (Netlify)

Netlify uses `npm run build` and publishes `_site`. The Node version is 18 as configured in `netlify.toml`.

## Content Editing

Site metadata and navigation live in `src/_data/site.json` and `src/_data/nav.json`. The About, Education, Experience, Projects, Skills, and Contact sections are JSON files in `src/_data/`. Blog posts are Markdown files in `src/blog/` and use `layout: blog.njk`. The technical docs live at `src/docs/index.md` and use `layout: docs.njk`.

## Features

### Layout Inheritance
All layouts extend `base.njk` using Nunjucks block inheritance. `base.njk` holds the core HTML structure with blocks for title, meta, main, and scripts. `blog.njk` extends it for blog posts, adds formatted dates and tags, and avoids SPA scripts. `docs.njk` extends it for documentation, adds noindex, and also avoids SPA scripts.

### Blog System
Dates are formatted with the `formatDate` filter from Luxon and appear like "August 1, 2025". Tags are defined in front matter and tag pages are generated under `/tags/`. The RSS feed is available at `/feed.xml`. The home page shows the six most recent posts and links to the feed.

### Filters Available
Available filters include `formatDate` for readable dates, `dateToRfc3339` for ISO feed dates, `calculateDuration` for experience durations, and `limit` for trimming lists.

## Security

All external links with `target="_blank"` include `rel="noopener noreferrer"` for security.

## Notes

The homepage is a composed single page while blog posts, docs, and tag pages render as separate routes. Assets such as CSS, JS, fonts, and images are copied via Eleventy passthrough from `resume-website/`. The blog collection is sorted by date in descending order.
