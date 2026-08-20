/**
 * Which sponsors are on screen right now.
 *
 * The band renders every sponsor into the page and shows a window of them, so
 * the rotation is a matter of which indices are visible. The maths lives here,
 * apart from the DOM, so it can be tested without a browser.
 */

/** `size` indices into a roster of `count`, from `offset`, wrapping round. */
export function rotationWindow(count, size, offset) {
    if (!count || count < 1) return [];
    const n = Math.min(size, count);
    const start = Math.max(0, Math.trunc(offset)) % count;
    const out = [];
    for (let i = 0; i < n; i++) out.push((start + i) % count);
    return out;
}
