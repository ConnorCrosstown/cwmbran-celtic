/**
 * Assertions over the programme reading order. Run from the theme root:
 *   node _tests/reader-order-test.mjs
 * Imports the mapping directly — it carries no PDF.js dependency.
 */
import { readingOrder, pageCount } from '../assets/programme-pages.mjs';

let failures = 0;
function check(label, cond) {
    if (cond) { console.log(`  ok  ${label}`); return; }
    failures++;
    console.log(`FAIL  ${label}`);
}
const at = (o, i) => `${o[i].sheet}${o[i].half === 'right' ? 'R' : o[i].half === 'left' ? 'L' : ''}`;

// The real thing: 2026.08.07 New Inn — 16 landscape sheets, cover wrap.
const booklet = readingOrder(16, { landscape: true, coverWrap: true });
check('16 landscape sheets give 32 readable pages', booklet.length === 32);
check('it opens on the front cover (sheet 1, right)', at(booklet, 0) === '1R');
check('page 2 is the left of sheet 2', at(booklet, 1) === '2L');
check('page 3 is the right of sheet 2', at(booklet, 2) === '2R');
check('the back cover comes last (sheet 1, left)', at(booklet, 31) === '1L');
check('sheet 1 appears exactly twice', booklet.filter(p => p.sheet === 1).length === 2);
check('every sheet is covered', new Set(booklet.map(p => p.sheet)).size === 16);
check('pageCount agrees with the order', pageCount(16, { landscape: true, coverWrap: true }) === 32);

// Cover wrap off — a landscape doc that simply runs left to right.
const plain = readingOrder(16, { landscape: true, coverWrap: false });
check('without cover wrap it still gives 32 pages', plain.length === 32);
check('without cover wrap it opens on sheet 1 left', at(plain, 0) === '1L');
check('without cover wrap it ends on sheet 16 right', at(plain, 31) === '16R');

// Portrait archive PDFs are shown whole, one per sheet.
const portrait = readingOrder(12, { landscape: false });
check('a portrait doc maps one page per sheet', portrait.length === 12);
check('a portrait page is not split', portrait.every(p => p.half === null));

// Degenerate input must not blow up — an unreadable PDF should fall back to the
// download link, not throw inside the reader.
check('a single landscape sheet with wrap gives front then back', readingOrder(1, { landscape: true, coverWrap: true }).length === 2);
check('zero sheets gives an empty order', readingOrder(0, { landscape: true, coverWrap: true }).length === 0);
check('a missing sheet count gives an empty order', readingOrder(undefined).length === 0);
check('a negative sheet count gives an empty order', readingOrder(-3, { landscape: true }).length === 0);

console.log('\n' + (failures ? `${failures} FAILED` : 'All checks passed'));
process.exit(failures ? 1 : 0);
