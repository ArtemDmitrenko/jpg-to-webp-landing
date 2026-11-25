// Static site generator: node build.mjs  →  _site/
// - copies everything from static/ as-is
// - renders one page per entry in src/pages.mjs
// - writes sitemap.xml and robots.txt
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pages } from './src/pages.mjs';

const SITE = 'https://jpg-to-webp.pro';
const STORE = 'https://chromewebstore.google.com/detail/jpg-to-webp/idiaamllmenbecdfkjggnoeliaajecea';
const UMAMI_ID = '4dbf0add-2493-4eb1-a9c7-c87365ac02c9';
const OUT = '_site';
const YEAR = new Date().getFullYear();
const TODAY = new Date().toISOString().slice(0, 10);

const FORMAT_LABEL = { webp: 'WebP', jpg: 'JPG', png: 'PNG' };

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pageUrl = (p) => SITE + '/' + (p.slug ? p.slug + '/' : '');
const storeUrl = (p, medium) =>
  `${STORE}?utm_source=jpg-to-webp.pro&utm_medium=${medium}&utm_campaign=${p.slug || 'home'}`;

function jsonLd(p) {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: p.h1,
    url: pageUrl(p),
    description: p.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  };
  return [app, faq]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');
}

const icon = {
  upload:
    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chrome:
    '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".25"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>',
  check:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5 9-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
};

function render(p) {
  const toLabel = FORMAT_LABEL[p.to];
  const others = pages.filter((o) => o !== p);
  const yes = `<span class="yes">${icon.check}</span>`;
  const no = `<span class="no">${icon.cross}</span>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}">
    <link rel="canonical" href="${pageUrl(p)}">
    <meta name="theme-color" content="#3d3df5">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="JPG to WebP">
    <meta property="og:title" content="${esc(p.title)}">
    <meta property="og:description" content="${esc(p.description)}">
    <meta property="og:url" content="${pageUrl(p)}">
    <meta property="og:image" content="${SITE}/images/og-image.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="manifest" href="/favicons/site.webmanifest">
    <link rel="stylesheet" href="/assets/site.css">
    ${jsonLd(p)}
    <script defer src="https://cloud.umami.is/script.js" data-website-id="${UMAMI_ID}"></script>
  </head>
  <body>
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="/"><img src="/assets/logo-48.png" width="32" height="32" alt=""> JPG to WebP</a>
        <a class="btn btn-accent btn-small" href="${storeUrl(p, 'header')}" target="_blank" rel="noopener" data-umami-event="store-click" data-umami-event-from="header">${icon.chrome} Add to Chrome</a>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="wrap">
          <h1>${esc(p.h1)}</h1>
          <p class="lead">${esc(p.lead)}</p>

          <div class="converter" id="converter" data-to="${p.to}" data-store="${storeUrl(p, 'converter')}">
            <div class="controls">
              <label class="control">
                <span>Convert to</span>
                <select data-format>
                  <option value="webp">WebP</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                </select>
              </label>
              <label class="control control-quality" data-quality-row>
                <span>Quality <output data-quality-value>85</output>%</span>
                <input type="range" min="1" max="100" value="85" data-quality>
              </label>
            </div>

            <div class="drop" data-drop role="button" tabindex="0" aria-label="Choose images to convert">
              ${icon.upload}
              <p class="drop-title">Drop ${esc(p.from)} images here or <u>browse</u></p>
              <p class="drop-hint">Up to 10 files · JPG, PNG, WebP, GIF, BMP, AVIF · or paste with Ctrl+V</p>
              <input type="file" accept="image/*,.jfif,.avif" multiple hidden data-input>
            </div>

            <p class="notice" data-notice hidden></p>

            <div class="bar" data-bar hidden>
              <span class="summary" data-summary></span>
              <span class="bar-actions">
                <button type="button" class="btn btn-ghost btn-small" data-clear>Clear</button>
                <button type="button" class="btn btn-primary btn-small" data-zip hidden>Download all (ZIP)</button>
              </span>
            </div>
            <ul class="results" data-results hidden></ul>

            <p class="privacy-note">🔒 Your images never leave your device. Conversion runs locally in your browser.</p>
          </div>

          <aside class="upsell" data-upsell hidden>
            <div>
              <strong>Done! Next time, skip the website.</strong>
              <p>Right-click any image on any site → <em>Convert image to → ${toLabel}</em>. Free Chrome extension, works offline.</p>
            </div>
            <a class="btn btn-accent" href="${storeUrl(p, 'upsell')}" target="_blank" rel="noopener" data-umami-event="store-click" data-umami-event-from="upsell">${icon.chrome} Add to Chrome — free</a>
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="wrap split">
          <div>
            <h2>Convert images without leaving the page</h2>
            <p>The free <strong>JPG to WebP</strong> extension for Chrome puts the converter one click away — on every website.</p>
            <ul class="ticks">
              <li>${icon.check} Right-click any image → convert to WebP, JPG or PNG</li>
              <li>${icon.check} Drag &amp; drop files into the toolbar popup</li>
              <li>${icon.check} Bulk conversion with one ZIP download — no 10-file limit</li>
              <li>${icon.check} Quality and resize settings (by width, height or longest side)</li>
              <li>${icon.check} 100% local and private, works without internet</li>
            </ul>
            <a class="btn btn-accent" href="${storeUrl(p, 'features')}" target="_blank" rel="noopener" data-umami-event="store-click" data-umami-event-from="features">${icon.chrome} Add to Chrome — it’s free</a>
          </div>
          <img class="shot" src="/images/extension-popup.jpg" width="960" height="600" loading="lazy" alt="JPG to WebP Chrome extension popup with format, quality and drag-and-drop area">
        </div>
      </section>

      <section class="section section-alt">
        <div class="wrap">
          <h2>Online converter vs. Chrome extension</h2>
          <div class="table-scroll">
            <table class="compare">
              <thead><tr><th></th><th>Online</th><th>Extension</th></tr></thead>
              <tbody>
                <tr><td>Convert JPG, PNG, WebP</td><td>${yes}</td><td>${yes}</td></tr>
                <tr><td>Files stay on your device</td><td>${yes}</td><td>${yes}</td></tr>
                <tr><td>Images per batch</td><td>up to 10</td><td>unlimited</td></tr>
                <tr><td>Right-click images on any website</td><td>${no}</td><td>${yes}</td></tr>
                <tr><td>Resize while converting</td><td>${no}</td><td>${yes}</td></tr>
                <tr><td>Always one click away</td><td>${no}</td><td>${yes}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <h2>How to convert ${esc(p.from)} to ${toLabel}</h2>
          <ol class="steps">
            <li><strong>Add images.</strong> Drag &amp; drop ${esc(p.from)} files into the box above, click to browse, or paste an image with Ctrl+V.</li>
            <li><strong>Pick format and quality.</strong> ${toLabel} is preselected. ${p.to === 'png' ? 'PNG is lossless, so there is no quality setting.' : 'The default 85% quality is a good balance of size and clarity.'}</li>
            <li><strong>Download.</strong> Save each image or grab them all in a single ZIP file. You see the exact size before and after.</li>
          </ol>
        </div>
      </section>

      <section class="section section-alt">
        <div class="wrap prose">
          <h2>Why convert ${esc(p.from)} to ${toLabel}?</h2>
          ${p.why.map((t) => `<p>${esc(t)}</p>`).join('\n          ')}
        </div>
      </section>

      <section class="section">
        <div class="wrap prose">
          <h2>Frequently asked questions</h2>
          ${p.faq
            .map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`)
            .join('\n          ')}
        </div>
      </section>

      <section class="section section-alt">
        <div class="wrap">
          <h2>More free image converters</h2>
          <nav class="tools" aria-label="Other converters">
            ${others.map((o) => `<a href="/${o.slug ? o.slug + '/' : ''}">${esc(o.h1)}</a>`).join('\n            ')}
          </nav>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="wrap footer-inner">
        <span>© ${YEAR} JPG to WebP</span>
        <nav>
          <a href="${storeUrl(p, 'footer')}" target="_blank" rel="noopener">Chrome Web Store</a>
          <a href="/privacy.html">Privacy policy</a>
        </nav>
      </div>
    </footer>

    <script src="/assets/converter.js" defer></script>
  </body>
</html>
`;
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await cp('static', OUT, { recursive: true, filter: (src) => !src.endsWith('.DS_Store') });

  for (const p of pages) {
    const dir = join(OUT, p.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), render(p));
  }

  const urls = pages.map(
    (p) => `  <url><loc>${pageUrl(p)}</loc><lastmod>${TODAY}</lastmod>${p.slug ? '' : '<priority>1.0</priority>'}</url>`
  );
  await writeFile(
    join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  );
  await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

  console.log(`Built ${pages.length} pages into ${OUT}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
