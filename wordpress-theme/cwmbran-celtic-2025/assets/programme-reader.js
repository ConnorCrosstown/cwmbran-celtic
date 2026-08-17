/**
 * Match day programme reader — renders the programme PDF on the club's own site,
 * replacing the Heyzine flipbooks whose links expire.
 *
 * The programmes come out of Publisher as A4 landscape sheets. Most hold two
 * readable A5 pages side by side, so a phone is shown one at a time; the
 * spread's text is unreadable at that width. But some sheets are ONE page
 * running the full width — a fixtures-and-results grid, say — and cutting
 * those down the middle destroys them. detectWholeSheets() tells the two apart
 * by looking for the gutter that only a genuine two-up sheet has. A reader can
 * override either way with the spread toggle.
 *
 * See programme-pages.js for why the reading order isn't simply left-to-right.
 *
 * The markup already carries the cover image and a download link, so if this
 * script never runs the page is still useful. Nothing here is load-bearing for
 * getting hold of the programme.
 *
 * NB this file must stay .js. Served as .mjs, cwmbranceltic.com labels it
 * text/plain and the browser refuses to execute it — which is exactly how this
 * reader spent its first months live, showing "Loading the programme…" forever.
 * See _tests/module-assets-test.php.
 */
/** Phones read single pages; from tablet up there's room for the spread. */
const SPLIT_UP_TO = 900;
/** Zoom stops. 1 is fit-to-width; the rest are for reading small print. */
const ZOOM_MIN = 1, ZOOM_MAX = 4, ZOOM_STEP = 0.5;
/** Never ask the browser for a canvas bigger than this many pixels. Safari
 *  throws above roughly 16M and returns a blank canvas rather than an error. */
const MAX_CANVAS_PX = 14e6;
/** How long to wait before telling the reader something is wrong. */
const WATCHDOG_MS = 12000;

// Declared before the call, not after: boot() reads these synchronously, and a
// `const` is in the temporal dead zone until its own line runs.
const el = document.getElementById('cc25-prog-reader');
if (el) boot(el).catch(fail.bind(null, el));

async function boot(root) {
    const url = root.getAttribute('data-pdf');
    if (!url) return;

    // Say something if we never paint. Without this the stage sits on
    // "Loading the programme…" indefinitely, which is what it did for months
    // when the module itself was refused by the browser.
    const watchdog = setTimeout(() => {
        if (!root.getAttribute('data-ready')) fail(root, new Error('timed out'));
    }, WATCHDOG_MS);

    // Both imported by URL rather than statically: the theme cache-busts by file
    // mtime, and a bare relative import would carry no version and go stale.
    const { readingOrder } = await import(root.getAttribute('data-pages'));
    const pdfjs = await import(root.getAttribute('data-pdfjs'));
    pdfjs.GlobalWorkerOptions.workerSrc = root.getAttribute('data-worker');

    const progress = root.querySelector('.prog-progress-bar');
    const task = pdfjs.getDocument({
        url,
        // Fetch pages as they're asked for rather than pulling all 7MB up front.
        disableAutoFetch: true,
        disableStream: false,
    });
    task.onProgress = ({ loaded, total }) => {
        if (!progress || !total) return;
        progress.style.width = Math.min(100, Math.round((loaded / total) * 100)) + '%';
    };
    const doc = await task.promise;

    const canvas = root.querySelector('.prog-canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const label = root.querySelector('.prog-count');
    const prevB = root.querySelector('.prog-nav.prev');
    const nextB = root.querySelector('.prog-nav.next');
    const stage = root.querySelector('.prog-stage');
    const zoomIn = root.querySelector('.prog-zoom-in');
    const zoomOut = root.querySelector('.prog-zoom-out');
    const fsB = root.querySelector('.prog-fs');
    const spreadB = root.querySelector('.prog-spread');
    const thumbsB = root.querySelector('.prog-thumbs-toggle');
    const thumbs = root.querySelector('.prog-thumbs');
    const coverWrap = root.getAttribute('data-cover-wrap') === '1';

    // Pages the club adds to the digital programme — season advertising that
    // isn't in the printed PDF. Bad JSON must not cost anyone the programme.
    let extras = [];
    try {
        const raw = JSON.parse(root.getAttribute('data-extras') || '[]');
        if (Array.isArray(raw)) extras = raw.filter(e => e && e.src);
    } catch (e) { extras = []; }

    const images = new Map();
    const extraImage = (k) => {
        if (!images.has(k)) {
            images.set(k, new Promise((resolve, reject) => {
                const img = new Image();
                img.decoding = 'async';
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('extra page ' + k + ' failed to load'));
                img.src = extras[k].src;
            }));
        }
        return images.get(k);
    };

    // Sheet 1 decides the shape of the whole document.
    const first = await doc.getPage(1);
    const box = first.getViewport({ scale: 1 });
    const landscape = box.width > box.height;

    let order = [];
    let i = 0;
    let zoom = 1;
    let forceSpread = false;
    let renderTask = null;
    const cache = new Map();
    /** Sheets that are one full-width page. Empty until the scan finishes; the
     *  first paint happens without it so the cover isn't held up. */
    let whole = [];

    const page = async (n) => {
        if (!cache.has(n)) cache.set(n, await doc.getPage(n));
        return cache.get(n);
    };

    /**
     * True when this sheet is a single page running the full width.
     *
     * Two A5 pages printed side by side leave a gutter: a narrow column at the
     * fold that is the same colour all the way down, because it is the two
     * pages' inner margins. Content that runs across the sheet — a fixtures
     * grid, a league table — breaks that column up with rules and cells.
     *
     * So the test is "is there a column at the fold that barely changes down
     * its height", not "is the fold white". Whiteness would be wrong: sheet 1
     * of the Ammanford programme is a white squad list beside a yellow cover,
     * and the yellow runs right to the fold.
     *
     * Text position was tried first and cannot work here. The spanning grids
     * are raster images — sheet 9 carries twelve text runs on a page that is
     * nothing but table — so there is no text at the fold to measure.
     *
     * Measured over that programme's 16 sheets: every two-up sheet scores 0,
     * the two full-width grids score 13.7% and 26.4%. The threshold sits in a
     * gap with an order of magnitude in it.
     */
    const FOLD_VARIES_MAX = 0.04;
    const scan = document.createElement('canvas');

    async function spansFold(pg) {
        const base = pg.getViewport({ scale: 1 });
        const vp = pg.getViewport({ scale: 300 / base.width });
        scan.width = Math.floor(vp.width);
        scan.height = Math.floor(vp.height);
        const g = scan.getContext('2d', { alpha: false, willReadFrequently: true });
        g.fillStyle = '#fff';
        g.fillRect(0, 0, scan.width, scan.height);
        await pg.render({ canvas: scan, viewport: vp }).promise;

        // A gutter is not always dead centre, so a few columns either side are
        // tried and the steadiest one decides.
        const mid = Math.floor(scan.width / 2);
        const x0 = Math.max(0, mid - 5);
        const w = Math.min(11, scan.width - x0);
        const h = scan.height;
        const data = g.getImageData(x0, 0, w, h).data;

        let steadiest = 1;
        for (let c = 0; c < w; c++) {
            const lum = new Float32Array(h);
            for (let y = 0; y < h; y++) {
                const k = (y * w + c) * 4;
                lum[y] = 0.299 * data[k] + 0.587 * data[k + 1] + 0.114 * data[k + 2];
            }
            const med = [...lum].sort((a, b) => a - b)[h >> 1];
            let off = 0;
            for (let y = 0; y < h; y++) if (Math.abs(lum[y] - med) > 18) off++;
            steadiest = Math.min(steadiest, off / h);
            if (steadiest === 0) break;      // a perfect gutter; nothing to beat
        }
        return steadiest > FOLD_VARIES_MAX;
    }

    async function detectWholeSheets() {
        const found = [];
        for (let s = 1; s <= doc.numPages; s++) {
            try {
                if (await spansFold(await page(s))) found.push(s);
            } catch (e) { /* one bad sheet must not stop the scan */ }
        }
        return found;
    }

    function splitting() {
        return landscape && !forceSpread && window.innerWidth <= SPLIT_UP_TO;
    }

    function rebuild(keepSheet) {
        const split = splitting();
        let opts;
        if (!landscape) {
            opts = { landscape: false };
        } else if (split) {
            opts = { landscape: true, coverWrap, whole };
        } else if (coverWrap) {
            // Shown as spreads, sheet 1 is still the outer wrap — so drawing it
            // whole opens the programme on its own back cover, sitting to the
            // left of the front one. Every sheet stays whole EXCEPT that wrap,
            // which unwraps to a front cover first and a back cover last.
            opts = {
                landscape: true,
                coverWrap: true,
                whole: Array.from({ length: doc.numPages - 1 }, (_, k) => k + 2),
            };
        } else {
            opts = { landscape: false };
        }
        order = readingOrder(doc.numPages, { ...opts, extra: extras.length });
        if (!order.length) throw new Error('programme has no pages');
        // Hold position across a rotation or a mode change rather than snapping
        // back to the cover.
        if (keepSheet) {
            const found = order.findIndex(p => p.sheet === keepSheet);
            i = found === -1 ? 0 : found;
        }
        i = Math.min(Math.max(i, 0), order.length - 1);
    }

    async function draw() {
        const spot = order[i];
        if (spot.extra != null) { await drawExtra(spot.extra); return; }
        const pg = await page(spot.sheet);

        // Fit the visible portion to the stage, at the device's pixel density so
        // small print stays legible, then multiply by the zoom. Rendering at the
        // zoomed scale rather than stretching the canvas is the whole point —
        // a magnified fixtures grid has to stay sharp enough to read.
        const base = pg.getViewport({ scale: 1 });
        const showW = spot.half ? base.width / 2 : base.width;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const avail = stage.clientWidth || showW;
        let scale = (avail / showW) * dpr * zoom;

        // Back off rather than hand the browser a canvas it will refuse.
        const px = (showW * scale) * (base.height * scale);
        if (px > MAX_CANVAS_PX) scale *= Math.sqrt(MAX_CANVAS_PX / px);

        canvas.setAttribute('aria-label', 'Programme page');
        const vp = pg.getViewport({ scale });
        canvas.width = Math.floor(spot.half ? vp.width / 2 : vp.width);
        canvas.height = Math.floor(vp.height);
        canvas.style.width = Math.round(100 * zoom) + '%';
        canvas.style.height = 'auto';

        if (renderTask) renderTask.cancel();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clip to a half by shifting the page left; the canvas is already halved.
        // `canvas` rather than `canvasContext` — the latter is back-compat only
        // in PDF.js 6 and requires canvas to be explicitly null.
        const offset = spot.half === 'right' ? -Math.floor(vp.width / 2) : 0;
        renderTask = pg.render({
            canvas,
            viewport: vp,
            transform: offset ? [1, 0, 0, 1, offset, 0] : null,
        });
        try {
            await renderTask.promise;
        } catch (e) {
            if (e && e.name === 'RenderingCancelledException') return;
            throw e;
        }
        renderTask = null;
        settle();
    }

    /**
     * An extra page is artwork, not a PDF sheet, so it is drawn rather than
     * rendered — but it is sized by the same rules, including the zoom, so it
     * magnifies and pans like every other page.
     */
    async function drawExtra(k) {
        const img = await extraImage(k);
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const avail = stage.clientWidth || w;
        let scale = (avail / w) * dpr * zoom;

        const px = (w * scale) * (h * scale);
        if (px > MAX_CANVAS_PX) scale *= Math.sqrt(MAX_CANVAS_PX / px);

        if (renderTask) { renderTask.cancel(); renderTask = null; }
        canvas.width = Math.max(1, Math.floor(w * scale));
        canvas.height = Math.max(1, Math.floor(h * scale));
        canvas.style.width = Math.round(100 * zoom) + '%';
        canvas.style.height = 'auto';
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.setAttribute('aria-label', extras[k].alt || 'Advertisement');
        settle();
    }

    /** Everything that is true once a page — of either kind — is on screen. */
    function settle() {
        label.textContent = `${i + 1} / ${order.length}`;
        prevB.disabled = i === 0;
        nextB.disabled = i === order.length - 1;
        zoomIn.disabled = zoom >= ZOOM_MAX;
        zoomOut.disabled = zoom <= ZOOM_MIN;
        root.setAttribute('data-zoomed', zoom > 1 ? '1' : '0');
        root.setAttribute('data-ready', '1');
        clearTimeout(watchdog);
        syncHash();
        markThumb();

        // Warm what comes next so the following turn doesn't wait on a fetch.
        const ahead = order[i + 1];
        if (!ahead) return;
        if (ahead.extra != null) extraImage(ahead.extra).catch(() => {});
        else page(ahead.sheet).catch(() => {});
    }

    const redraw = () => draw().catch(fail.bind(null, root));

    function go(delta) {
        const next = i + delta;
        if (next < 0 || next >= order.length) return;
        i = next;
        if (zoom > 1) { zoom = 1; }        // a new page starts fitted, not mid-magnification
        stage.scrollTo({ left: 0, top: 0 });
        redraw();
    }

    function setZoom(z) {
        const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 2) / 2));
        if (next === zoom) return;
        // Keep the middle of what's on screen under the reader's eye.
        const cx = (stage.scrollLeft + stage.clientWidth / 2) / (stage.scrollWidth || 1);
        const cy = (stage.scrollTop + stage.clientHeight / 2) / (stage.scrollHeight || 1);
        zoom = next;
        draw().then(() => {
            stage.scrollLeft = cx * stage.scrollWidth - stage.clientWidth / 2;
            stage.scrollTop = cy * stage.scrollHeight - stage.clientHeight / 2;
        }).catch(fail.bind(null, root));
    }

    /* ---- deep links: /programme/#page=7 ------------------------------- */
    let hashLock = false;
    function syncHash() {
        hashLock = true;
        history.replaceState(null, '', '#page=' + (i + 1));
        setTimeout(() => { hashLock = false; }, 0);
    }
    function fromHash() {
        const m = /(?:^|[#&])page=(\d+)/.exec(location.hash);
        if (!m) return false;
        const n = parseInt(m[1], 10);
        if (!Number.isInteger(n) || n < 1 || n > order.length) return false;
        i = n - 1;
        return true;
    }
    window.addEventListener('hashchange', () => {
        if (hashLock) return;
        if (fromHash()) redraw();
    });

    /* ---- controls ------------------------------------------------------ */
    prevB.addEventListener('click', () => go(-1));
    nextB.addEventListener('click', () => go(1));
    zoomIn.addEventListener('click', () => setZoom(zoom + ZOOM_STEP));
    zoomOut.addEventListener('click', () => setZoom(zoom - ZOOM_STEP));

    spreadB.addEventListener('click', () => {
        forceSpread = !forceSpread;
        spreadB.setAttribute('aria-pressed', forceSpread ? 'true' : 'false');
        spreadB.textContent = forceSpread ? 'Single pages' : 'Both pages';
        zoom = 1;
        rebuild(order.length ? order[i].sheet : 1);
        redraw();
    });

    fsB.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (root.requestFullscreen) root.requestFullscreen().catch(() => {});
    });
    document.addEventListener('fullscreenchange', () => {
        root.setAttribute('data-fullscreen', document.fullscreenElement === root ? '1' : '0');
        redraw();
    });

    root.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
        if (e.key === '+' || e.key === '=') { setZoom(zoom + ZOOM_STEP); e.preventDefault(); }
        if (e.key === '-') { setZoom(zoom - ZOOM_STEP); e.preventDefault(); }
    });

    /* ---- touch: swipe to turn, pinch to zoom, drag to pan -------------- */
    let x0 = null, y0 = null, pinch0 = null, zoom0 = 1;
    const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    stage.addEventListener('touchstart', e => {
        if (e.touches.length === 2) { pinch0 = dist(e.touches); zoom0 = zoom; x0 = null; return; }
        x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });

    stage.addEventListener('touchmove', e => {
        if (pinch0 && e.touches.length === 2) {
            e.preventDefault();
            setZoom(zoom0 * (dist(e.touches) / pinch0));
        }
    }, { passive: false });

    stage.addEventListener('touchend', e => {
        if (pinch0) { pinch0 = null; return; }
        if (x0 === null) return;
        // Zoomed in, a horizontal drag is panning the page, not turning it.
        if (zoom === 1) {
            const dx = e.changedTouches[0].clientX - x0;
            const dy = e.changedTouches[0].clientY - y0;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        }
        x0 = y0 = null;
    }, { passive: true });

    // Double-tap / double-click toggles between fitted and readable.
    stage.addEventListener('dblclick', e => { e.preventDefault(); setZoom(zoom > 1 ? 1 : 2.5); });

    // Drag to pan with a mouse once magnified.
    let drag = null;
    stage.addEventListener('pointerdown', e => {
        if (zoom === 1 || e.pointerType === 'touch') return;
        drag = { x: e.clientX, y: e.clientY, l: stage.scrollLeft, t: stage.scrollTop };
        stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', e => {
        if (!drag) return;
        stage.scrollLeft = drag.l - (e.clientX - drag.x);
        stage.scrollTop = drag.t - (e.clientY - drag.y);
    });
    stage.addEventListener('pointerup', () => { drag = null; });
    stage.addEventListener('pointercancel', () => { drag = null; });

    /* ---- page picker --------------------------------------------------- */
    let thumbsBuilt = false;
    function markThumb() {
        if (!thumbsBuilt) return;
        thumbs.querySelectorAll('button').forEach((b, n) => {
            b.setAttribute('aria-current', n === i ? 'true' : 'false');
        });
    }
    async function buildThumbs() {
        thumbs.textContent = '';
        for (let n = 0; n < order.length; n++) {
            const spot = order[n];
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'prog-thumb';
            b.setAttribute('aria-label', 'Page ' + (n + 1));
            const c = document.createElement('canvas');
            b.appendChild(c);
            const num = document.createElement('span');
            num.textContent = String(n + 1);
            b.appendChild(num);
            b.addEventListener('click', () => {
                i = n; zoom = 1; redraw();
                thumbs.hidden = true;
                thumbsB.setAttribute('aria-expanded', 'false');
            });
            thumbs.appendChild(b);

            try {
                if (spot.extra != null) {
                    const img = await extraImage(spot.extra);
                    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
                    c.width = 150;
                    c.height = Math.max(1, Math.round(150 * ih / iw));
                    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                } else {
                    const pg = await page(spot.sheet);
                    const base = pg.getViewport({ scale: 1 });
                    const showW = spot.half ? base.width / 2 : base.width;
                    const s = 150 / showW;
                    const vp = pg.getViewport({ scale: s });
                    c.width = Math.floor(spot.half ? vp.width / 2 : vp.width);
                    c.height = Math.floor(vp.height);
                    const off = spot.half === 'right' ? -Math.floor(vp.width / 2) : 0;
                    await pg.render({ canvas: c, viewport: vp, transform: off ? [1, 0, 0, 1, off, 0] : null }).promise;
                }
            } catch (e) { /* a thumbnail is not worth failing the reader over */ }
        }
        thumbsBuilt = true;
        markThumb();
    }
    thumbsB.addEventListener('click', async () => {
        const open = thumbs.hidden;
        thumbs.hidden = !open;
        thumbsB.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open && !thumbsBuilt) await buildThumbs();
    });

    /* ---- resize -------------------------------------------------------- */
    // Redraw on resize regardless of whether the split flipped — the canvas is
    // rendered to the stage's pixel width, so any width change needs a repaint.
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            rebuild(order.length ? order[i].sheet : 1);
            thumbsBuilt = false;
            if (!thumbs.hidden) buildThumbs();
            redraw();
        }, 150);
    });

    /* ---- first paint, then the scan ------------------------------------ */
    rebuild(null);
    fromHash();
    await draw();

    // The gutter scan reads every sheet's text layer, so it runs after the
    // cover is on screen rather than before it. Only a split view cares.
    if (landscape) {
        whole = await detectWholeSheets();
        if (whole.length && splitting()) {
            rebuild(order[i].sheet);
            thumbsBuilt = false;
            if (!thumbs.hidden) buildThumbs();
            await draw();
        }
    }
}

/** Leave the cover and the download link standing — they're in the markup. */
function fail(root, err) {
    root.setAttribute('data-failed', '1');
    root.removeAttribute('data-ready');
    if (window.console) console.error('[cc25] programme reader:', err);
}
