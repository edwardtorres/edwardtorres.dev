# Edward Torres personal website

A static HTML and CSS portfolio presenting six verified projects while
preserving the site's monochrome visual language, bottom navigation,
asymmetric project-card grid, and shared project-detail structure.

## Local development

No package installation or build step is required. From the project directory,
run any static server, for example:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Hosting configuration

- Production origin: `https://edwardtorres.dev`
- Platform: Cloudflare Pages with Git integration
- Production branch: `main`
- Build command: none
- Output directory: repository root (`.`)
- Environment variables: none
- Routing: static HTML files with relative links
- SPA fallback: not required
- Error page: `404.html`

Cloudflare Pages serves the `.html` documents at extensionless production URLs;
those final destinations are used by the canonical, Open Graph, and sitemap
metadata. `_headers` defines browser security policy and conservative caching,
while `_redirects` keeps the legacy `project1` URL working.

## Repository hygiene

The repository intentionally excludes editor settings, local environment files,
dependency folders, Cloudflare development state, logs, and automated test
artifacts. No runtime credentials or environment variables are required.

## Project pages

- `projects/homevault.html`
- `projects/pocket-machinist.html`
- `projects/spc-dashboard.html`
- `projects/paperdrop.html`
- `projects/lithography-workbook.html`
- `projects/chess-game.html`

Verified screenshots are organized under `assets/projects/`. Application source
code remains in its own repositories and is not copied into this site.

`project1.html` is retained only as a no-index compatibility redirect to the
HomeVault page.

## Presentation notes

- All YouTube/video markup and shared video CSS have been removed.
- Every project uses the same Project Snapshot structure for type, status,
  capabilities, verified screenshots, source, and genuine live links.
- Open Graph images use root-relative local asset paths. Convert them to absolute
  production URLs after the final domain is selected.
- Resume integration remains pending until a verified resume file is supplied.
