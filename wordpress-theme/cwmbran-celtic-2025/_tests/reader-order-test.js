/**
 * Assertions over the programme reading order. Run from the theme root:
 *   node _tests/reader-order-test.js
 * Imports the mapping directly — it carries no PDF.js dependency.
 */
import { readingOrder, pageCount } from '../assets/programme-pages.js';

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

/* ---- sheets that must not be split -------------------------------------
 * Some sheets are one full-width page, not two: the Ammanford programme's
 * sheet 9 is a single fixtures-and-results grid running the width of the A4.
 * Splitting it cuts the table in half down the middle. The reader detects
 * these and passes them here; the order must show them whole. */
const withWide = readingOrder(16, { landscape: true, coverWrap: true, whole: [9] });
check('a whole sheet contributes one page, not two', withWide.length === 31);
check('the whole sheet is not split', withWide.filter(p => p.sheet === 9).every(p => p.half === null));
check('the whole sheet appears exactly once', withWide.filter(p => p.sheet === 9).length === 1);
check('it still opens on the front cover', at(withWide, 0) === '1R');
check('it still ends on the back cover', at(withWide, 30) === '1L');
check('sheets either side are still split',
    withWide.filter(p => p.sheet === 8).length === 2 && withWide.filter(p => p.sheet === 10).length === 2);
check('reading order stays monotonic across a whole sheet', (() => {
    const seq = withWide.slice(0, 30).map(p => p.sheet);   // drop the trailing back cover
    for (let i = 1; i < seq.length; i++) if (seq[i] < seq[i - 1]) return false;
    return true;
})());
check('pageCount agrees when a sheet is whole',
    pageCount(16, { landscape: true, coverWrap: true, whole: [9] }) === 31);

// The cover sheet is a wrap by definition; marking it whole must not strand
// the back cover or produce a sheet that appears both whole and split.
const wholeCover = readingOrder(6, { landscape: true, coverWrap: true, whole: [1] });
check('a whole cover sheet appears once', wholeCover.filter(p => p.sheet === 1).length === 1);
check('a whole cover sheet is unsplit', wholeCover.filter(p => p.sheet === 1)[0].half === null);
check('a whole cover sheet still leads', wholeCover[0].sheet === 1);

// Nothing marked, and rubbish marked, must both behave as before.
check('an empty whole list changes nothing',
    readingOrder(16, { landscape: true, coverWrap: true, whole: [] }).length === 32);
check('out-of-range whole sheets are ignored',
    readingOrder(16, { landscape: true, coverWrap: true, whole: [0, 99, -2] }).length === 32);
check('whole has no effect on a portrait doc',
    readingOrder(12, { landscape: false, whole: [3] }).length === 12);

console.log('\n' + (failures ? `${failures} FAILED` : 'All checks passed'));
process.exit(failures ? 1 : 0);
