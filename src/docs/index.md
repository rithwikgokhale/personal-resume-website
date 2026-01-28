---
layout: docs.njk
title: Website Technical Documentation
---

# Website Technical Documentation

This document explains how this website is built, organized, and deployed so another engineer can replicate or extend it. It focuses on how the content is structured, how layouts are composed, and how the blog system scales as more posts are added.

## Executive Summary

The site is a static build created with Eleventy. Content lives in JSON and Markdown files and is rendered through Nunjucks templates. Styling and scripts come from the original HTML5UP assets through passthrough copy. Netlify runs `npm run build` and publishes `_site`. The blog includes date formatting, tags, and a feed.

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

Global structured content lives under `src/_data/` and is injected into templates. `site.json` holds site metadata like title, tagline, and url. `nav.json` stores the header navigation. `about.json`, `education.json`, `experience.json`, `projects.json`, `skills.json`, and `contact.json` map directly to the home page sections.

Example experience object:

```json
{
  "company": "Adatafy (Novaspect)",
  "title": "Software Engineer II · Full-time",
  "startDate": "2022-06",
  "endDate": null,
  "dates": "June 2022 to Present",
  "location": "Schaumburg, Illinois · Hybrid",
  "highlights": ["Led digital transformation initiatives..."],
  "techStack": ["Python", "PowerShell", "SQL", "REST APIs"]
}
```

### Layout System (Template Inheritance)

All layouts use Nunjucks block inheritance and extend `base.njk`. The base layout defines blocks for title, meta, head, bodyClass, main, and scripts. The blog layout renders formatted dates, shows tags, and avoids SPA scripts since posts are standalone pages. The docs layout adds a noindex meta tag and also skips SPA scripts for the same reason.

### Templates and Components

The header reads from `site.json` and `nav.json`. The footer is a shared include. Each major home section is a template in `includes/sections/` and is bound to the matching data file.

## Blog System

### Creating Posts

Create a Markdown file in `src/blog/` with front matter like this:

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

Dates are formatted with the `formatDate` filter. Tags are listed on the post and used to generate tag pages under `/tags/`. An index of all tags is available at `/tags/`. The feed is available at `/feed.xml`. The home page shows the six most recent posts and the blog collection is sorted by date, newest first.

### Collections

`collections.blog` includes all posts and is sorted by date. `collections.tagList` includes the unique tag list and excludes the internal `blog` tag.

## Filters Available

The `formatDate` filter formats dates as "MMMM d, yyyy". The `dateToRfc3339` filter outputs ISO time for feeds. The `calculateDuration` filter computes experience duration between dates. The `limit` filter returns the first N items of a list.

## Build and Deployment

### Dependencies

The project uses `@11ty/eleventy` for static builds and `luxon` for date formatting.

### Commands

```bash
npm install         # Install dependencies
npm run dev         # Start dev server with live reload
npm run build       # Build for production to _site/
```

### Netlify Config

Netlify runs `npm run build`, publishes `_site`, and uses Node 18 as set in `netlify.toml`.

## Security

All external links that open in a new tab include `rel="noopener noreferrer"` to prevent reverse tabnabbing and to avoid exposing `window.opener`.

## Extending the Site

Add a project by appending to `src/_data/projects.json`. Add a job by appending to `src/_data/experience.json`. Add a blog post by creating a new file in `src/blog/`. Add a new section by creating a section include and referencing it in `src/index.njk`.

## Data Flow

1. Content is updated in JSON and Markdown under `src/_data` and `src/blog`.\n2. Eleventy builds pages by binding data to Nunjucks templates.\n3. Filters transform dates, durations, and lists.\n4. Output is written to `_site` and deployed by Netlify.

## Appendix: Decisions and Tradeoffs

Eleventy keeps the site simple, fast, and SEO friendly without client side hydration. Template inheritance reduces duplication and keeps the layout consistent. Luxon provides reliable date formatting and time zone handling. Passthrough assets preserve the original HTML5UP design without modification. The docs page is marked noindex so it stays available only by explicit link.
