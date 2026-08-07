# Match day programme generator

Builds a home-game programme by reusing the club's existing artwork and
regenerating only the pages that change.

    python3 build.py 2026-08-22 --photo SOMEPHOTO.jpg

Design: `docs/superpowers/specs/2026-08-07-programme-generator-design.md`

## How it works

The programme is 16 A4-landscape sheets, two A5 pages up, with sheet 1 as the
outer wrap (back cover | front cover). The source issue is vector, so pages that
don't change are placed as vector — no rasterising, and the sponsor adverts stay
exactly as sold.

- `layout.py`  — sheet/page geometry. `test_layout.py` covers it.
- `compose.py` — seeds all 32 pages from a previous issue, swaps in replacements.
- `cover.py`   — patches the four things that change on the cover: opponent,
                 date/kick-off, action photo, crest.
- `build.py`   — CLI. Versions output as `… v1.pdf`, `v2.pdf`; never overwrites,
                 so a PDF out for approval survives the edits coming back.

## Inputs

- `fixtures.json` — exported from the theme's fixture lists and kick-off
  overrides (`tools/programme/../../wordpress-theme/...`, via export.php).
- Cover photos — `~/Downloads/CCFC Programme Photos/`.
- Crests — the theme's `assets/img/opponents/`.
- Source issue — `~/Downloads/2026.08.07 New Inn.pdf` by default, `--source` to change.

## Status

Regenerated: **cover**. The other 31 pages carry over from the source issue and
still show that match's content — league table, fixtures, match report and the
rest are the next pieces of work.

## Test

    python3 test_layout.py
