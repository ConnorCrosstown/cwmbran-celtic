# On-site match day programme reader

**Date:** 2026-08-07
**Theme:** `wordpress-theme/cwmbran-celtic-2025`
**Branch:** `feat/programme-reader`

## Problem

Match day programmes for 2026/27 are hosted as Heyzine flipbooks
(`heyzine.com/flip-book/…`), and the club has been told those links will expire. When
they do, this season's programmes become unreachable — the links are the only copy
the site has.

Everything from 2023/24 to 2025/26 is already a self-hosted PDF under
`wp-content/uploads/`, so the archive is safe. The gap is only that a raw PDF link is
a poor read: it downloads, or opens in a browser PDF viewer, with no sense of turning
pages.

So this is about owning where the flipping happens, not rebuilding the archive.

## What exists

Programmes are Posts in the `programme` category — cover as Featured Image, match date
as post date, and a link in the `_cc25_prog_url` meta box. `cc25_programme_url()`
(`functions.php:774`) returns that URL when set and the post permalink when not, and
`template-programmes.php` renders the season-tabbed grid from it.

That permalink fallback is the hook this design uses: every programme post already has
a page of its own that nothing currently renders.

## The source PDFs

`2026.08.07 New Inn.pdf` is representative: 16 pages of **A4 landscape**
(841.92 × 595.32pt), 6.9MB, `Producer: Microsoft: Print To PDF` out of Publisher, all
fonts embedded.

Each page is a **two-up reader spread**, not printer imposition — page 2 carries
printed folios "2" and "3", page 3 carries "4" and "5". Page 1 is the outer wrap:
back cover on the left, front cover on the right. So 16 sheets hold 32 readable A5
pages, and a naive left-to-right split would open the programme on the team-list page
rather than the cover.

## Design

### 1. Where the reader lives

The programme post's own permalink. `single.php` branches: a post in the `programme`
category with a PDF renders the reader instead of the news-article layout.

Each programme therefore gets a permanent, shareable URL on the club's own domain —
what Heyzine was really providing — and it cannot expire.

### 2. What triggers it

The existing `_cc25_prog_url` value, tested by `cc25_is_pdf_url()`:

- a `.pdf` URL (query string and fragment ignored) → the reader renders it
- anything else → today's behaviour, unchanged, linking straight out

The Heyzine links keep working untouched until each is swapped for its PDF, so the
migration is per-programme with no flag day. The archive's self-hosted PDFs gain the
reader immediately with no data entry at all.

`cc25_programme_read_url()` decides where a grid card points: the post permalink when
the programme has a PDF, else the external URL as now.

### 3. The reader

PDF.js 6.2.108, `legacy/build` (transpiled, widest browser support), vendored into
`assets/vendor/pdfjs/` as `pdf.min.mjs` (500K) and `pdf.worker.min.mjs` (1.3M). ESM
only in this release, so the reader loads as `type="module"` via a
`script_loader_tag` filter.

Enqueued **only** on programme singles. It must not touch the weight of any other
page.

Controls: previous/next, keyboard arrows, swipe, a page counter, and a download link.

`cmaps/` and `standard_fonts/` are deliberately not shipped — the club's PDFs embed
their fonts, and both directories together are ~1.4MB against a theme already at 14MB.
A PDF relying on non-embedded standard fonts would render without text; the download
link below is the escape hatch.

### 4. Desktop spreads, mobile single pages

Desktop renders the full landscape sheet — the spread, as designed. On a phone that
same spread is unreadable, so the reader clips the canvas to one half and the 16
sheets read as 32 pages. Portrait PDFs are shown a page at a time on both.

The split order is where the cover wrap is handled:

```
1R, 2L, 2R, 3L, 3R, … 16L, 16R, 1L
```

Front cover first, back cover last. This lives in `assets/programme-pages.mjs` as a
pure function of (sheet count, landscape, cover-wrap) — no PDF.js import — so both the
reader and the CLI test can load it.

Cover-wrap defaults on for landscape documents, with a checkbox in the programme meta
box to turn it off for a PDF not laid out that way.

### 5. Degrading

No JavaScript, or PDF.js failing to load, leaves the existing Featured Image cover and
a plain "Download the programme (PDF)" link. Never a blank box. The download link is
present in the markup regardless, not injected by script.

## Testing

- `_tests/programme-test.php` — `cc25_is_pdf_url()` against `.pdf`, `.PDF`, a query
  string, a fragment, a Heyzine URL, and an empty value; plus
  `cc25_programme_read_url()`'s choice of permalink vs external.
- `_tests/reader-order-test.mjs` — the page-order mapping: a 16-sheet landscape
  booklet with cover wrap gives 32 pages starting `1R` and ending `1L`; the same
  without cover wrap runs plainly left to right; a portrait document maps one page per
  sheet; and 1-sheet and 0-sheet documents don't blow up.

The clipping arithmetic was verified headlessly against the real New Inn PDF, driving
the vendored PDF.js from Node with `@napi-rs/canvas` and the same reading order the
reader uses: page 1 renders the front cover, page 2 the league tables carrying printed
folio "2", page 32 the back cover, each 505×714 — A5 portrait, as a half of the A4
landscape sheet should be.

What that cannot cover, and so remains a staging check: layout and controls in a real
browser, the desktop spread, the split actually triggering at the mobile breakpoint,
touch swipe, and the no-JS fallback.

## Out of scope

- Re-pointing the 2026/27 Heyzine programmes at their PDFs. That is content work, and
  it needs the source PDFs; the code handles both link types meanwhile.
- Compressing the export. 6.9MB for 16 pages is Publisher's "Print To PDF" leaving
  images uncompressed. Range requests mean the first page still arrives quickly, so
  this is a workflow improvement, not a blocker.
