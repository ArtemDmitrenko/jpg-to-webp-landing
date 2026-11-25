/* JPG to WebP — in-browser image converter.
 * Everything runs locally: files are never uploaded anywhere.
 */
(() => {
  'use strict';

  const MAX_FILES = 10;
  const FORMATS = {
    webp: { mime: 'image/webp', ext: 'webp', label: 'WebP' },
    jpg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPG' },
    png: { mime: 'image/png', ext: 'png', label: 'PNG' }
  };
  const ACCEPTED = /^image\/(jpeg|png|webp|gif|bmp|avif|x-icon|vnd\.microsoft\.icon)$/i;
  const ACCEPTED_EXT = /\.(jpe?g|jfif|png|webp|gif|bmp|avif|ico)$/i;

  const root = document.getElementById('converter');
  if (!root) return;
  const $ = (sel) => root.querySelector(sel);

  const drop = $('[data-drop]');
  const input = $('[data-input]');
  const formatSel = $('[data-format]');
  const quality = $('[data-quality]');
  const qualityOut = $('[data-quality-value]');
  const qualityRow = $('[data-quality-row]');
  const list = $('[data-results]');
  const bar = $('[data-bar]');
  const summary = $('[data-summary]');
  const zipBtn = $('[data-zip]');
  const clearBtn = $('[data-clear]');
  const notice = $('[data-notice]');
  const upsell = document.querySelector('[data-upsell]');

  /** @type {{id:number,file:File,el:HTMLElement,blob?:Blob,url?:string,error?:string,job:number}[]} */
  let items = [];
  let nextId = 1;
  let queue = Promise.resolve();

  formatSel.value = FORMATS[root.dataset.to] ? root.dataset.to : 'webp';

  const track = (name, data) => {
    try { window.umami && window.umami.track(name, data); } catch (e) { /* analytics is optional */ }
  };

  const fmtSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const baseName = (name) => {
    const i = name.lastIndexOf('.');
    return i > 0 ? name.slice(0, i) : name;
  };

  const settings = () => {
    const f = FORMATS[formatSel.value] || FORMATS.webp;
    return { ...f, key: formatSel.value, quality: Number(quality.value) / 100 };
  };

  function showNotice(text, withUpsell) {
    notice.textContent = '';
    notice.append(text);
    if (withUpsell) {
      notice.append(' ');
      const a = document.createElement('a');
      a.href = root.dataset.store;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Get the free Chrome extension →';
      a.addEventListener('click', () => track('store-click', { from: 'notice' }));
      notice.append(a);
    }
    notice.hidden = false;
  }

  function hideNotice() { notice.hidden = true; }

  async function decode(file) {
    if ('createImageBitmap' in window) {
      try {
        const bmp = await createImageBitmap(file);
        return { source: bmp, width: bmp.width, height: bmp.height, done: () => bmp.close && bmp.close() };
      } catch (e) { /* fall back to <img> (e.g. SVG, ICO on some browsers) */ }
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    try {
      await img.decode();
    } catch (e) {
      URL.revokeObjectURL(url);
      throw new Error('This file could not be read as an image.');
    }
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  }

  async function convert(file, s) {
    const img = await decode(file);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (s.mime === 'image/jpeg') {
        // JPG has no transparency: paint white instead of the default black.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img.source, 0, 0);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, s.mime, s.mime === 'image/png' ? undefined : s.quality)
      );
      canvas.width = canvas.height = 0;
      if (!blob) throw new Error('Conversion failed.');
      if (blob.type !== s.mime) {
        throw new Error('Your browser cannot save ' + s.label + ' files. Try Chrome or Edge.');
      }
      return blob;
    } finally {
      img.done();
    }
  }

  function renderItem(item) {
    const s = settings();
    const el = item.el;
    el.className = 'result' + (item.error ? ' is-error' : item.blob ? ' is-done' : ' is-busy');
    const thumb = el.querySelector('.result-thumb');
    const meta = el.querySelector('.result-meta');
    const dl = el.querySelector('.result-download');

    if (item.blob) {
      thumb.style.backgroundImage = 'url("' + item.url + '")';
      const before = item.file.size;
      const after = item.blob.size;
      const pct = Math.round((1 - after / before) * 100);
      meta.textContent = '';
      meta.append(fmtSize(before) + ' → ' + fmtSize(after) + ' ');
      const badge = document.createElement('span');
      badge.className = 'badge ' + (pct >= 0 ? 'badge-good' : 'badge-bad');
      badge.textContent = pct >= 0 ? '−' + pct + '%' : '+' + Math.abs(pct) + '%';
      meta.append(badge);
      dl.href = item.url;
      dl.download = baseName(item.file.name) + '.' + s.ext;
      dl.hidden = false;
    } else if (item.error) {
      thumb.style.backgroundImage = '';
      meta.textContent = item.error;
      dl.hidden = true;
    } else {
      thumb.style.backgroundImage = '';
      meta.textContent = 'Converting…';
      dl.hidden = true;
    }
  }

  function createItemEl(item) {
    const li = document.createElement('li');
    li.innerHTML =
      '<span class="result-thumb" aria-hidden="true"></span>' +
      '<span class="result-info"><span class="result-name"></span><span class="result-meta"></span></span>' +
      '<a class="btn btn-small result-download" hidden>Download</a>' +
      '<button type="button" class="result-remove" aria-label="Remove">×</button>';
    li.querySelector('.result-name').textContent = item.file.name;
    li.querySelector('.result-name').title = item.file.name;
    li.querySelector('.result-remove').addEventListener('click', () => removeItem(item.id));
    li.querySelector('.result-download').addEventListener('click', () =>
      track('download', { to: settings().key, mode: 'single' })
    );
    return li;
  }

  function enqueue(item) {
    const job = ++item.job;
    item.error = undefined;
    if (item.url) URL.revokeObjectURL(item.url);
    item.blob = item.url = undefined;
    renderItem(item);
    queue = queue.then(async () => {
      if (job !== item.job || !items.includes(item)) return;
      try {
        const blob = await convert(item.file, settings());
        if (job !== item.job || !items.includes(item)) return;
        item.blob = blob;
        item.url = URL.createObjectURL(blob);
      } catch (e) {
        if (job !== item.job) return;
        item.blob = undefined;
        item.error = e && e.message ? e.message : 'Conversion failed.';
      }
      renderItem(item);
      updateBar();
    });
    return queue;
  }

  function updateBar() {
    const done = items.filter((i) => i.blob);
    bar.hidden = items.length === 0;
    list.hidden = items.length === 0;
    zipBtn.hidden = done.length < 2;
    zipBtn.disabled = done.length !== items.filter((i) => !i.error).length;
    if (done.length) {
      const before = done.reduce((a, i) => a + i.file.size, 0);
      const after = done.reduce((a, i) => a + i.blob.size, 0);
      const pct = Math.round((1 - after / before) * 100);
      summary.textContent =
        done.length + ' of ' + items.length + ' converted · ' + fmtSize(before) + ' → ' + fmtSize(after) +
        (pct > 0 ? ' (saved ' + pct + '%)' : '');
    } else {
      summary.textContent = items.length ? 'Converting…' : '';
    }
    if (upsell && done.length) upsell.hidden = false;
  }

  function removeItem(id) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.url) URL.revokeObjectURL(item.url);
    item.el.remove();
    items = items.filter((i) => i !== item);
    hideNotice();
    updateBar();
  }

  function clearAll() {
    items.forEach((i) => i.url && URL.revokeObjectURL(i.url));
    items = [];
    list.textContent = '';
    hideNotice();
    updateBar();
  }

  function addFiles(fileList) {
    hideNotice();
    const files = Array.from(fileList || []);
    const ok = files.filter((f) => ACCEPTED.test(f.type) || ACCEPTED_EXT.test(f.name));
    const skipped = files.length - ok.length;
    const room = MAX_FILES - items.length;
    const taken = ok.slice(0, Math.max(0, room));

    if (ok.length > taken.length) {
      showNotice(
        'The online converter handles up to ' + MAX_FILES + ' images at a time. ' +
        'Need bigger batches, or want to convert images right from any website?',
        true
      );
      track('limit-hit', { tried: items.length + ok.length });
    } else if (skipped) {
      showNotice(skipped + ' file(s) skipped: only JPG, PNG, WebP, GIF, BMP, AVIF and ICO images are supported.');
    }
    if (!taken.length) return;

    track('convert', { to: settings().key, count: taken.length });
    taken.forEach((file) => {
      const item = { id: nextId++, file, el: null, job: 0 };
      item.el = createItemEl(item);
      items.push(item);
      list.append(item.el);
      enqueue(item);
    });
    updateBar();
  }

  let reconvertTimer;
  function reconvertAll() {
    clearTimeout(reconvertTimer);
    reconvertTimer = setTimeout(() => {
      items.forEach((i) => enqueue(i));
      updateBar();
    }, 250);
  }

  async function downloadZip() {
    const done = items.filter((i) => i.blob);
    if (done.length < 2) return;
    zipBtn.disabled = true;
    const label = zipBtn.textContent;
    zipBtn.textContent = 'Packing…';
    try {
      const JSZip = await loadJSZip();
      const zip = new JSZip();
      const ext = settings().ext;
      const used = new Set();
      done.forEach((i) => {
        let name = baseName(i.file.name) + '.' + ext;
        for (let n = 2; used.has(name); n++) name = baseName(i.file.name) + '_' + n + '.' + ext;
        used.add(name);
        zip.file(name, i.blob);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-images.zip';
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      track('download', { to: ext, mode: 'zip', count: done.length });
    } catch (e) {
      showNotice('Could not create the ZIP file. Please download the images one by one.');
    } finally {
      zipBtn.textContent = label;
      zipBtn.disabled = false;
    }
  }

  let jszipPromise;
  function loadJSZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    jszipPromise = jszipPromise || new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/assets/jszip.min.js';
      s.onload = () => resolve(window.JSZip);
      s.onerror = () => { jszipPromise = null; reject(new Error('JSZip failed to load')); };
      document.head.append(s);
    });
    return jszipPromise;
  }

  function syncQualityUI() {
    qualityOut.textContent = quality.value;
    qualityRow.hidden = formatSel.value === 'png';
  }

  // --- wiring ---
  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
  drop.addEventListener('click', () => input.click());
  drop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => {
    e.preventDefault();
    drop.classList.add('is-over');
  }));
  ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, (e) => {
    e.preventDefault();
    drop.classList.remove('is-over');
  }));
  drop.addEventListener('drop', (e) => addFiles(e.dataTransfer && e.dataTransfer.files));
  // Avoid the browser opening an image dropped slightly outside the zone.
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());

  document.addEventListener('paste', (e) => {
    const files = Array.from((e.clipboardData && e.clipboardData.files) || []);
    if (files.length) {
      e.preventDefault();
      addFiles(files);
    }
  });

  formatSel.addEventListener('change', () => { syncQualityUI(); reconvertAll(); });
  quality.addEventListener('input', syncQualityUI);
  quality.addEventListener('change', reconvertAll);
  zipBtn.addEventListener('click', downloadZip);
  clearBtn.addEventListener('click', clearAll);

  syncQualityUI();
  updateBar();
})();
