# Edward Torres personal website

A static HTML and CSS portfolio presenting thirteen projects while
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
- `projects/az900-study.html`
- `projects/databricks-study.html`
- `projects/full-body.html`
- `projects/full-stretch.html`
- `projects/quoteflow.html`
- `projects/pocket-machinist.html`
- `projects/spc-dashboard.html`
- `projects/paperdrop.html`
- `projects/lithography-workbook.html`
- `projects/chess-game.html`
- `projects/ikigai.html`
- `projects/canvas-calendar.html`

Verified screenshots are organized under `assets/projects/`. Full Body's four
desktop captures show the live dashboard, active workout, back anatomy, and
training calendar; history-based views await representative completed
workouts. QuoteFlow's
supplied v1.0 captures and their placements are documented in
`assets/projects/quoteflow/README.md`.
Full Stretch's four real app captures show the dashboard, guided static stretch,
programs and weekly schedule, and Mobility warm-up overview. Capture provenance
is documented in `assets/projects/full-stretch/README.md`.
Application source code remains in its own repositories. AZ-900 Study's built
static files are included under `az900/`, with a scoped Content-Security-Policy
and service-worker cache rules in `_headers`. Open it at
`https://edwardtorres.dev/az900/`; its project page appears in Work.

Databricks Study (Lakehouse Quest) is published under `databricks/`, with a
scoped Content-Security-Policy allowing its scripts and WebAssembly SQL engine.
Its source remains in `edwardtorres/Databrick-Analyst-study-duide`. Build the source
with `npm run build`, replace the contents of `databricks/` with that build's
`dist/`, and push `main` to publish. Keep `index.html` and `chunk-map.json` fresh
while caching hashed assets immutably. The app is browser-local and does not
provide full offline/PWA support. Verified screenshots are under
`assets/projects/databricks-study/`.

To update AZ-900 Study, run `npm run audit` in its source repository, then
`node scripts/copy-to-site.mjs "<portfolio checkout>"`. Commit the updated
`az900/` folder and push `main` to deploy through Cloudflare Pages. Progress is
saved per browser; export/import transfers it between devices. Screenshot
provenance is recorded in `assets/projects/az900-study/README.md`.

`project1.html` is retained only as a no-index compatibility redirect to the
HomeVault page.

## Presentation notes

- All YouTube/video markup and shared video CSS have been removed.
- Every project uses the same Project Snapshot structure for type, status,
  capabilities, project visuals, and genuine live links where available.
- Open Graph images use root-relative local asset paths. Convert them to absolute
  production URLs after the final domain is selected.
- Resume integration remains pending until a verified resume file is supplied.
