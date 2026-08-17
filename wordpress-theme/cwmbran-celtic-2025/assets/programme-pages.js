/**
 * Reading order for a match day programme.
 *
 * The club's programmes come out of Publisher as A4 landscape sheets, each
 * holding two readable A5 pages side by side, and sheet 1 is the outer wrap:
 * back cover on the left, front cover on the right. Splitting every sheet
 * plainly left-to-right would therefore open the programme on the back cover.
 *
 * Kept free of any PDF.js import so the CLI test can load it directly.
 */

/**
 * @param {number} sheets   pages in the PDF (each a sheet when landscape)
 * @param {object} [opts]
 * @param {boolean} [opts.landscape]  sheet is wider than tall — two pages up
 * @param {boolean} [opts.coverWrap]  sheet 1 is back cover | front cover
 * @param {number[]} [opts.whole]  sheets that are ONE full-width page, not two.
 *        Some sheets run a single item across the whole width — the Ammanford
 *        programme's sheet 9 is one fixtures-and-results grid edge to edge —
 *        and splitting those cuts the content in half. The reader works out
 *        which by looking for a clear gutter down the middle; this only has to
 *        honour the answer.
 * @returns {Array<{sheet:number, half:'left'|'right'|null}>} in reading order.
 *          `half` is null when the sheet is shown whole. `sheet` is 1-based, as
 *          PDF.js numbers pages.
 */
export function readingOrder(sheets, opts = {}) {
    const n = Math.max(0, Math.floor(Number(sheets) || 0));
    if (n === 0) return [];

    // Portrait: nothing to split, one page per sheet. A `whole` list is
    // meaningless here and is ignored rather than treated as an error.
    if (!opts.landscape) {
        return Array.from({ length: n }, (_, i) => ({ sheet: i + 1, half: null }));
    }

    const order = [];
    // Out-of-range entries are dropped so a bad detection pass can't shorten
    // the programme or point at a sheet that isn't there.
    const whole = new Set(
        (Array.isArray(opts.whole) ? opts.whole : [])
            .map(Number)
            .filter(s => Number.isInteger(s) && s >= 1 && s <= n)
    );
    // A cover sheet detected as whole isn't a wrap: there is no separate back
    // cover to move to the end, so it simply leads as one page.
    const wrap = !!opts.coverWrap && !whole.has(1);

    const put = (s) => {
        if (whole.has(s)) { order.push({ sheet: s, half: null }); return; }
        order.push({ sheet: s, half: 'left' });
        order.push({ sheet: s, half: 'right' });
    };

    // Front cover leads. Under a cover wrap it is the RIGHT half of sheet 1,
    // whose left half is the back cover and goes to the very end.
    if (wrap) order.push({ sheet: 1, half: 'right' });

    for (let s = wrap ? 2 : 1; s <= n; s++) put(s);

    if (wrap) order.push({ sheet: 1, half: 'left' });
    return order;
}

/** Total readable pages, i.e. what the counter divides by. */
export function pageCount(sheets, opts = {}) {
    return readingOrder(sheets, opts).length;
}
