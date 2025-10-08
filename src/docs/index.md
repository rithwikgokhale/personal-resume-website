---
layout: layouts/base.njk
title: Website Technical Documentation
noindex: true
---

# Website Technical Documentation

This document explains how this website is built, organized, and deployed so another engineer can replicate or extend it. It draws inspiration for structure and clarity from the Image AI Detector docs site [`aipicdetector.netlify.app`](https://aipicdetector.netlify.app/).

## Executive Summary

- Static site built with Eleventy (11ty)
- Content separated into structured data (JSON) and Markdown
- Reuses existing HTML5UP CSS/JS via passthrough copy
- Deployed to Netlify with `npm run build` producing `_site`

## Architecture Overview

```
root/
  .eleventy.js             # Build config and passthroughs
  package.json             # Scripts and dev dependency on @11ty/eleventy
  resume-website/          # Original assets/images (passthrough)
  src/                     # Eleventy source
    _data/                 # Global data (JSON)
    includes/              # Shared partials/sections
    layouts/               # Base layout
    blog/                  # Markdown posts
    docs/                  # This documentation
    index.njk              # Home page composed of sections
```

### Data Model

Global structured content lives under `src/_data/` and is injected into templates:

- `site.json`: site-wide metadata (title, tagline)
- `nav.json`: navigation items for header
- `about.json`: paragraphs and media for About section
- `education.json`: schools and certifications arrays
- `experience.json`: job entries with highlight bullets
- `projects.json`: project cards with tech tags and links
- `skills.json`: grouped skill lists
- `contact.json`: email, phone, social links

This mirrors an object-based content model. Example objects:

```json
{
  "company": "Adatafy",
  "title": "Software Engineer · Full-time",
  "dates": "June 2022 - Present",
  "location": "Schaumburg, IL · Hybrid",
  "highlights": [
    "Led digital transformation initiatives",
    "Built integrations with Python and PowerShell"
  ]
}
```

### Templates and Components

- `layouts/base.njk`: HTML shell loading CSS/JS assets, renders header/footer and the page body.
- `includes/header.njk`: Reads `site.json` and `nav.json` to render branded header and nav.
- `includes/footer.njk`: Footer with copyright.
- `includes/sections/*.njk`: Each major home section (About, Education, Experience, Projects, Blog, Skills, Resume, Contact) is a reusable include bound to data objects.

This aligns with component-driven composition: data-in, HTML-out, no client-side framework required.

### Content Collections

- `src/blog/*.md` are Eleventy posts in a `blog` collection using front matter. The list on the home page is rendered by `includes/sections/blog.njk` via `collections.blog`.
- `src/docs/index.md` (this page) uses the same layout but is excluded from search engines with `noindex: true`.

## Build and Deployment

### Dependencies

- `@11ty/eleventy`: static site generator
- HTML, Nunjucks templates, Markdown, JSON data (no runtime JS framework)

Install and run locally:

```bash
brew install node   # if Node is not installed
npm install
npm run dev         # serves _site with live reload
npm run build       # outputs to _site for Netlify
```

### Eleventy Config (`.eleventy.js`)

Key responsibilities:

- Define input/output directories (`src` → `_site`)
- Passthrough copy of existing assets and images:
  - `resume-website/assets` → `/assets`
  - `resume-website/images` → `/images`
  - `resume-website/documents` → `/documents`
- Watch asset folders for live reload

## Styling and Assets

The site uses existing CSS/JS from the original HTML5UP template via passthrough copy:

- CSS: `/assets/css/main.css`, `/assets/css/noscript.css`
- JS: `/assets/js/{jquery.min.js,browser.min.js,breakpoints.min.js,util.js,main.js}`
- Fonts and icons via included webfonts

Templates reference assets with absolute paths beginning at site root (`/assets/...`).

## Data Flow

1. Author updates JSON and Markdown files under `src/_data` and `src/blog`.
2. Eleventy builds pages by binding data objects to Nunjucks includes.
3. Output HTML is emitted to `_site/` and deployed by Netlify.

## Extending the Site

- Add a new project: append an object to `src/_data/projects.json`.
- Add a new job: append to `src/_data/experience.json`.
- Add a blog post: create `src/blog/new-post.md` with front matter.
- Add a new section: create `includes/sections/new-section.njk` and include it in `src/index.njk`.

## External References

This documentation format and organization were inspired by:

- Image AI Detector Documentation: [`aipicdetector.netlify.app`](https://aipicdetector.netlify.app/)

## Appendix: Decisions and Tradeoffs

- Chose Eleventy over SPA frameworks for simplicity, speed, and SEO.
- Separated data from templates to reduce merge conflicts and improve maintainability.
- Kept original assets to preserve the existing visual design.
- Added `noindex` to docs to keep it discoverable only via explicit link.

