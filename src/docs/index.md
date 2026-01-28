---
layout: docs.njk
title: Website Technical Documentation
---

# Website Technical Documentation

This document explains how this website is built, organized, and deployed so another engineer can replicate or extend it.

## Executive Summary

- Static site built with Eleventy (11ty)
- Content separated into structured data (JSON) and Markdown
- Reuses existing HTML5UP CSS/JS via passthrough copy
- Deployed to Netlify with `npm run build` producing `_site`
- Blog system with tags, RSS feed, and date formatting

## Architecture Overview

```
root/
  .eleventy.js             # Build config, filters, collections, passthroughs
  .gitignore               # Ignores node_modules, _site, OS artifacts
  package.json             # Scripts and dependencies (@11ty/eleventy, luxon)
  netlify.toml             # Netlify build config
  resume-website/          # Original assets/images (passthrough)
  src/                     # Eleventy source
    _data/                 # Global data (JSON)
    includes/              # Shared partials/sections
    layouts/               # Base/blog/docs layouts (template inheritance)
    blog/                  # Markdown posts
    docs/                  # This documentation
    tags/                  # Tag index and auto-generated tag pages
    feed.njk               # RSS/Atom feed template
    index.njk              # Home page composed of sections
```

### Data Model

Global structured content lives under `src/_data/` and is injected into templates:

- `site.json`: site-wide metadata (title, tagline, url)
- `nav.json`: navigation items for header
- `about.json`: paragraphs and media for About section
- `education.json`: schools and certifications arrays
- `experience.json`: job entries with highlight bullets and tech stacks
- `projects.json`: project cards with tech tags and links
- `skills.json`: grouped skill lists
- `contact.json`: email, phone, social links

Example experience object:

```json
{
  "company": "Adatafy (Novaspect)",
  "title": "Software Engineer II · Full-time",
  "startDate": "2022-06",
  "endDate": null,
  "dates": "June 2022 - Present",
  "location": "Schaumburg, Illinois · Hybrid",
  "highlights": ["Led digital transformation initiatives..."],
  "techStack": ["Python", "PowerShell", "SQL", "REST APIs"]
}
```

### Layout System (Template Inheritance)

All layouts use Nunjucks block inheritance extending `base.njk`:

**`layouts/base.njk`** - Core HTML structure with overridable blocks:
- `{% block title %}` - Page title
- `{% block meta %}` - Additional meta tags (noindex, etc.)
- `{% block head %}` - Additional head content
- `{% block bodyClass %}` - Body class (default: `is-preload`)
- `{% block main %}` - Main content area
- `{% block scripts %}` - JavaScript includes

**`layouts/blog.njk`** - Extends base for blog posts:
- Renders formatted date with `formatDate` filter
- Displays tags (excluding "blog" collection tag)
- No SPA scripts (standalone page)

**`layouts/docs.njk`** - Extends base for documentation:
- Adds `noindex` meta tag
- No SPA scripts (standalone page)

### Templates and Components

- `includes/header.njk`: Reads `site.json` and `nav.json` for header/nav
- `includes/footer.njk`: Footer with copyright
- `includes/sections/*.njk`: Each home section bound to data objects

## Blog System

### Creating Posts

Create a Markdown file in `src/blog/`:

```markdown
---
layout: blog.njk
title: "Your Post Title"
date: 2025-08-01
tags: ["Product Management", "Technical", "blog"]
excerpt: "A brief description for the listing..."
---

Your content here...
```

### Features

- **Date Formatting**: Uses Luxon via `formatDate` filter (e.g., "August 1, 2025")
- **Tags**: Posts can have tags; tag pages auto-generated at `/tags/[tag-name]/`
- **Tag Index**: Browse all tags at `/tags/`
- **RSS Feed**: Available at `/feed.xml` for syndication
- **Homepage Limit**: Shows latest 6 posts; blog collection sorted by date descending

### Collections

- `collections.blog` - All blog posts sorted by date (newest first)
- `collections.tagList` - All unique tags (excluding "blog")

## Filters Available

| Filter | Description | Example |
|--------|-------------|---------|
| `formatDate` | Format date as "MMMM d, yyyy" | `{{ date \| formatDate }}` |
| `dateToRfc3339` | ISO date format for feeds | `{{ date \| dateToRfc3339 }}` |
| `calculateDuration` | Duration between dates | `{{ startDate \| calculateDuration(endDate) }}` |
| `limit` | Limit array to N items | `{{ posts \| limit(6) }}` |

## Build and Deployment

### Dependencies

- `@11ty/eleventy`: Static site generator
- `luxon`: Date formatting library

### Commands

```bash
npm install         # Install dependencies
npm run dev         # Start dev server with live reload
npm run build       # Build for production to _site/
```

### Netlify Config

- Build command: `npm run build`
- Publish directory: `_site`
- Node version: 18 (via `netlify.toml`)

## Security

All external links with `target="_blank"` include `rel="noopener noreferrer"` to prevent:
- Reverse tabnabbing attacks
- Performance issues from `window.opener` access

## Extending the Site

- **Add a project**: Append object to `src/_data/projects.json`
- **Add a job**: Append to `src/_data/experience.json`
- **Add a blog post**: Create `src/blog/new-post.md` with front matter
- **Add a section**: Create `includes/sections/new-section.njk` and include in `index.njk`

## Data Flow

1. Author updates JSON and Markdown files under `src/_data` and `src/blog`
2. Eleventy builds pages binding data to Nunjucks templates
3. Filters transform data (dates, durations, limits)
4. Output HTML emitted to `_site/` and deployed by Netlify

## Appendix: Decisions and Tradeoffs

- **Eleventy over SPA**: Simplicity, speed, SEO, no client-side hydration
- **Template inheritance**: Reduces duplication, centralizes HTML structure
- **Luxon for dates**: Robust date formatting, timezone handling
- **Passthrough assets**: Preserves original HTML5UP design without modification
- **noindex on docs**: Keeps documentation discoverable only via explicit link
