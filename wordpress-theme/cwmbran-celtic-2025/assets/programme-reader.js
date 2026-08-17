/**
 * Match day programme reader — renders the programme PDF on the club's own site,
 * replacing the Heyzine flipbooks whose links expire.
 *
 * Desktop shows the landscape sheet whole, as the spread it was designed as.
 * A phone shows one A5 page at a time, because the spread's text is unreadable
 * at that width — see programme-pages.js for why the order isn't simply
 * left-to-right.
 *
 * The markup already carries the cover image and a download link, so if this
 * script never runs the page is still useful. Nothing here is load-bearing for
 * getting hold of the programme.
 */
const el = document.getElementById('cc25-prog-reader');
if (el) boot(el).catch(fail.bind(null, el));

/** Phones read single pages; from tablet up there's room for the spread. */
const SPLIT_UP_TO = 900;

async function boot(root) {
    const url = root.getAttribute('data-pdf');
    if (!url) return;

    // Both imported by URL rather than statically: the theme cache-busts by file
    // mtime, and a bare relative import would carry no version and go stale.
    const { readingOrder } = await import(root.getAttribute('data-pages'));
    const pdfjs = await import(root.getAttribute('data-pdfjs'));
    pdfjs.GlobalWorkerOptions.workerSrc = root.getAttribute('data-worker');

    const doc = await pdfjs.getDocument({
        url,
        // Fetch pages as they're asked for rather than pulling all 7MB up front.
        disableAutoFetch: true,
        disableStream: false,
    }).promise;

    const canvas = root.querySelector('.prog-canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const label = root.querySelector('.prog-count');
    const prevB = root.querySelector('.prog-nav.prev');
    const nextB = root.querySelector('.prog-nav.next');
    const stage = root.querySelector('.prog-stage');
    const coverWrap = root.getAttribute('data-cover-wrap') === '1';

    // Sheet 1 decides the shape of the whole document.
    const first = await doc.getPage(1);
    const box = first.getViewport({ scale: 1 });
    const landscape = box.width > box.height;

    let order = [];
    let i = 0;
    let renderTask = null;
    let cache = new Map();

    function rebuild(keepSheet) {
        const split = landscape && window.innerWidth <= SPLIT_UP_TO;
        order = readingOrder(doc.numPages, { landscape: split, coverWrap: split && coverWrap });
        if (!order.length) throw new Error('programme has no pages');
        // Hold position across a rotation rather than snapping back to the cover.
        if (keepSheet) {
            const found = order.findIndex(p => p.sheet === keepSheet);
            i = found === -1 ? 0 : found;
        }
        i = Math.min(Math.max(i, 0), order.length - 1);
    }

    async function page(n) {
        if (!cache.has(n)) cache.set(n, await doc.getPage(n));
        return cache.get(n);
    }

    async function draw() {
        const spot = order[i];
        const pg = await page(spot.sheet);

        // Fit the visible portion to the stage, at the device's pixel density so
        // small print stays legible.
        const base = pg.getViewport({ scale: 1 });
        const showW = spot.half ? base.width / 2 : base.width;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const avail = stage.clientWidth || showW;
        const scale = (avail / showW) * dpr;
        const vp = pg.getViewport({ scale });

        canvas.width = Math.floor(spot.half ? vp.width / 2 : vp.width);
        canvas.height = Math.floor(vp.height);
        canvas.style.width = '100%';
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

        label.textContent = `${i + 1} / ${order.length}`;
        prevB.disabled = i === 0;
        nextB.disabled = i === order.length - 1;
        root.setAttribute('data-ready', '1');
    }

    function go(delta) {
        const next = i + delta;
        if (next < 0 || next >= order.length) return;
        i = next;
        draw().catch(fail.bind(null, root));
    }

    prevB.addEventListener('click', () => go(-1));
    nextB.addEventListener('click', () => go(1));

    root.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    });

    // Swipe, ignoring mostly-vertical drags so the page still scrolls.
    let x0 = null, y0 = null;
    stage.addEventListener('touchstart', e => {
        x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        const dy = e.changedTouches[0].clientY - y0;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        x0 = y0 = null;
    }, { passive: true });

    // Redraw on resize regardless of whether the split flipped — the canvas is
    // rendered to the stage's pixel width, so any width change needs a repaint.
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            rebuild(order.length ? order[i].sheet : 1);
            draw().catch(fail.bind(null, root));
        }, 150);
    });

    rebuild(null);
    await draw();
}

/** Leave the cover and the download link standing — they're in the markup. */
function fail(root, err) {
    root.setAttribute('data-failed', '1');
    root.removeAttribute('data-ready');
    if (window.console) console.error('[cc25] programme reader:', err);
}
