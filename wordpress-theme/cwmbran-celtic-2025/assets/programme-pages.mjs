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
 * @returns {Array<{sheet:number, half:'left'|'right'|null}>} in reading order.
 *          `half` is null when the sheet is shown whole. `sheet` is 1-based, as
 *          PDF.js numbers pages.
 */
export function readingOrder(sheets, opts = {}) {
    const n = Math.max(0, Math.floor(Number(sheets) || 0));
    if (n === 0) return [];

    // Portrait: nothing to split, one page per sheet.
    if (!opts.landscape) {
        return Array.from({ length: n }, (_, i) => ({ sheet: i + 1, half: null }));
    }

    const order = [];
    const wrap = !!opts.coverWrap;

    // Front cover leads. Under a cover wrap it is the RIGHT half of sheet 1,
    // whose left half is the back cover and goes to the very end.
    if (wrap) order.push({ sheet: 1, half: 'right' });

    for (let s = wrap ? 2 : 1; s <= n; s++) {
        order.push({ sheet: s, half: 'left' });
        order.push({ sheet: s, half: 'right' });
    }

    if (wrap) order.push({ sheet: 1, half: 'left' });
    return order;
}

/** Total readable pages, i.e. what the counter divides by. */
export function pageCount(sheets, opts = {}) {
    return readingOrder(sheets, opts).length;
}
