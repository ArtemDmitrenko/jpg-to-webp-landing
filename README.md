# jpg-to-webp.pro

Landing site with a free in-browser image converter for the **JPG to WebP** Chrome extension.
Hosted on GitHub Pages, custom domain `jpg-to-webp.pro`.

## Structure

- `src/pages.mjs` — content of every converter page (title, description, texts, FAQ). Add an entry → get a new page.
- `build.mjs` — static generator: renders pages, copies `static/`, writes `sitemap.xml` and `robots.txt` into `_site/`.
- `static/` — copied as-is:
  - `assets/converter.js` — the converter (runs locally, nothing is uploaded; max 10 files per batch)
  - `assets/site.css` — styles (light/dark)
  - `welcome.html` — page opened after the extension is installed
  - `uninstall.html` — feedback page opened after uninstall (URL is hard-coded in the extension — keep it)
  - `privacy.html`, `404.html`, `CNAME`

## Develop

```bash
npm install
npm run dev     # builds and serves _site on http://localhost:3000
```

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/pages.yml`) builds and deploys to GitHub Pages.
