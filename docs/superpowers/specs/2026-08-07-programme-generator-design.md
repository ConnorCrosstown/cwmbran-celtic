# Match day programme generator

**Date:** 2026-08-07
**Supersedes:** parts of `2026-07-24-programme-builder-design.md` (the Vercel/KV
web builder). That design still describes the eventual system; this one is the
local-script route chosen on 7 August, and a narrower first cut.

## Problem

Every home game needs a 32-page programme, hand-built in Microsoft Publisher.
There are **22 home games** left this season — 15 men's first team, 7 women's.
Most of the document is either unchanged from issue to issue or is data the
website already holds and has just been corrected against the FAW.

## What actually changes

The programme is 16 A4-landscape sheets, two A5 pages up, saddle-stitch order
with sheet 1 as the outer wrap (back cover | front cover). Reading the 7 August
New Inn issue page by page:

| Pages | Content | Changes |
|---|---|---|
| 1 | Front cover | Every match — opponent, date, kick-off, competition, photo |
| 32 | Back cover: both squads, colours, officials | Every match; line-ups + officials are manual |
| 2 | League tables | Every match — live |
| 3 | Welcome to Celtic Park | Every match — editorial |
| 6 | Match report, previous game | Every match — editorial |
| 7 | Feature article | Occasionally — editorial |
| 8 | Our fixtures & results | Every match — live |
| 9 | Player statistics | Every match — hand-kept, no data source |
| 10–13, 16–17 | Division fixtures + results grid | Every match — live |
| 22 | 1st team statistics | Every match — hand-kept |
| 30–31 | Opponent history | Once per club, reused every season |
| 4–5, 14–15, 18–21, 23–29 | Club history, pen pictures, officials, honours, adverts | Static for the season |

So: **~11 pages are data**, ~4 are editorial, 2 are per-opponent, and **15 are
static**.

## Design

### Reuse the artwork, regenerate only what moves

The source PDF is vector — its text extracts — so the static pages are **cropped
out of the existing issue with pypdf and placed into the new one unchanged**.
No rebuilding of the club's layout, no rasterising, no quality loss, and the
sponsor adverts stay exactly as sold.

Generated pages are drawn with reportlab at A5 and composed onto A4-landscape
sheets in the same imposition as the original, so:

- it prints on the same kit, folded the same way; and
- it opens correctly in the programme reader built earlier today, which already
  understands the back|front cover wrap.

### First cut

Cover plus the data pages. Editorial pages carry over from the previous issue
with a visible `DRAFT — NEEDS UPDATING` stamp so nothing silently ships stale;
they are replaced as Connor supplies text. Player statistics have no data source
and carry over the same way until one exists.

### Data sources

- **League table** — FAW Comet, `competition/{id}/standings/official`. Live, 16 rows.
- **Division fixtures and results** — the same API, via the 240 match pages the
  competition taxonomy exposes. Harvested once per season into a local cache;
  match IDs don't change.
- **Our fixtures, dates, kick-offs** — the theme's own lists, now reconciled
  against the FAW.
- **Crests** — `assets/img/opponents/`.
- **Cover photo** — supplied per match by Connor in `~/Downloads/CCFC Programme
  Photos/`, since the match photography is a third party's and its licensing is
  not ours to assume. The photographer's credit is a required field, not
  optional.

### Per-match input

One small JSON per match holding only what a person must provide: line-ups,
officials, manager's notes, match report, cover photo and credit. Absent fields
fall back to carry-over-and-stamp rather than failing, so a draft can always be
produced.

### Approval round-trip

The script writes `YYYY-MM-DD Opponent — v1.pdf` and never overwrites. Connor
circulates it (Drive or email) to club officials; their edits go into the
match's JSON; re-running writes `v2`. Version history is the files themselves.
This is the reason the per-match input is a file rather than prompts: an
approval loop needs the input to still exist a week later.

## Testing

- Page-order and imposition maths, as pure functions with CLI assertions — the
  same class of bug the reader's `readingOrder` covers, and the same fix.
- A fixture with no input JSON must still produce a complete draft.
- Output opens in the programme reader and reads front cover first.
- Rendered output compared by eye against the New Inn issue before any of it
  reaches print.

## Out of scope

- The Vercel/KV web builder. Still the right long-term answer for multi-user
  editing; not needed to get 22 programmes out.
- Player statistics automation — no source exists.
- Women's programme layout. The source issue is the men's; the women's may need
  different static pages, and that is a second pass.
