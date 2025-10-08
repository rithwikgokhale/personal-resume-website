# Personal Resume Website (Eleventy)

A maintainable, content-driven personal website for Rithwik Gokhale built with Eleventy (11ty). Content is stored in JSON/Markdown and rendered with Nunjucks templates. Assets and styling reuse the original HTML5UP template.

## Project Structure

```
root/
  .eleventy.js           # Eleventy config (input/output, passthroughs, collections)
  netlify.toml           # Netlify build config
  package.json           # Scripts and dev dependency on @11ty/eleventy
  resume-website/        # Original assets/images (passthrough)
  src/
    _data/               # Global data (JSON)
    includes/            # Shared partials and section templates
    layouts/             # Base/blog/docs layouts
    blog/                # Markdown blog posts
    docs/                # Technical documentation page
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

- Site meta and navigation: `src/_data/site.json`, `src/_data/nav.json`
- About/Education/Experience/Projects/Skills/Contact: JSON files in `src/_data/`
- Blog posts: Markdown files in `src/blog/*.md` (use `layout: blog.njk`)
- Technical docs: `src/docs/index.md` (uses `layout: docs.njk`)

## Notes

- The homepage is a composed single page. Blog posts and docs render as separate routes using dedicated layouts (no SPA intercepts).
- Assets (CSS/JS/fonts/images) are copied via Eleventy passthrough from `resume-website/`.
