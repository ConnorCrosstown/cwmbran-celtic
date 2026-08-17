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

/* ---- spread view still opens on the front cover -------------------------
 * Shown as spreads (desktop, or the "Both pages" toggle), sheet 1 is still the
 * outer wrap — so drawing it whole puts the BACK cover to the left of the front
 * one, and the programme opens on its own back page. The reader asks for every
 * sheet whole EXCEPT the wrap, which unwraps the cover without splitting
 * anything else. */
const spread = readingOrder(16, { landscape: true, coverWrap: true, whole: Array.from({ length: 15 }, (_, k) => k + 2) });
check('a wrapped spread has one entry per sheet, plus the split cover', spread.length === 17);
check('the spread opens on the front cover alone', at(spread, 0) === '1R');
check('the spread ends on the back cover alone', at(spread, 16) === '1L');
check('every inner sheet of a spread is whole',
    spread.slice(1, 16).every(p => p.half === null));
check('inner sheets of a spread run 2..16 in order',
    spread.slice(1, 16).every((p, k) => p.sheet === k + 2));
check('no sheet but the cover appears twice in a spread',
    spread.filter(p => p.sheet !== 1).length === new Set(spread.filter(p => p.sheet !== 1).map(p => p.sheet)).size);

/* ---- extra pages --------------------------------------------------------
 * Pages the club adds to the digital programme that aren't in the printed PDF
 * — a sponsor's advert, say. They belong at the END of the read, but the back
 * cover has to stay the last thing anyone sees, so they go before it. */
const extra1 = readingOrder(16, { landscape: true, coverWrap: true, extra: 1 });
check('one extra page adds one to the count', extra1.length === 33);
check('the extra page is not a sheet', extra1[31].sheet === null && extra1[31].extra === 0);
check('the back cover is still last', at(extra1, 32) === '1L');
check('the page before the extra is the last inner sheet', at(extra1, 30) === '16R');

const extra2 = readingOrder(16, { landscape: true, coverWrap: true, extra: 2 });
check('two extras add two', extra2.length === 34);
check('extras keep their order', extra2[31].extra === 0 && extra2[32].extra === 1);
check('the back cover is still last with two extras', at(extra2, 33) === '1L');

// Without a wrap there is no back cover to protect: extras simply end the read.
const noWrap = readingOrder(16, { landscape: true, coverWrap: false, extra: 1 });
check('without a wrap an extra goes last', noWrap[noWrap.length - 1].extra === 0);

// Portrait archives and spread view get them too.
check('a portrait doc takes extras', readingOrder(12, { landscape: false, extra: 1 }).length === 13);
check('a portrait extra goes last', readingOrder(12, { landscape: false, extra: 1 })[12].extra === 0);
const spreadExtra = readingOrder(16, { landscape: true, coverWrap: true, whole: Array.from({ length: 15 }, (_, k) => k + 2), extra: 1 });
check('a spread read takes extras before the back cover', spreadExtra.length === 18 && spreadExtra[16].extra === 0 && at(spreadExtra, 17) === '1L');

check('no extras changes nothing', readingOrder(16, { landscape: true, coverWrap: true, extra: 0 }).length === 32);
check('a rubbish extra count is ignored', readingOrder(16, { landscape: true, coverWrap: true, extra: -4 }).length === 32);
check('extras still work when a sheet is whole',
    readingOrder(16, { landscape: true, coverWrap: true, whole: [9], extra: 1 }).length === 32);

console.log('\n' + (failures ? `${failures} FAILED` : 'All checks passed'));
process.exit(failures ? 1 : 0);
