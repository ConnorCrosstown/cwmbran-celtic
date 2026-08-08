# Letting the club update the site themselves

**Date:** 2026-08-08
**Theme:** `wordpress-theme/cwmbran-celtic-2025`

## Problem

The club can already publish news, programmes, galleries and squad changes. Nearly
everything else — fixtures, kick-off times, postponements, scores, match reports,
Bond draws — is hardcoded in a 2,413-line `functions.php` and needs a developer
for jobs that come round every week.

The constraint is that the site must keep looking like itself. Volunteers should
not be able to break the styling, and should not have to think about it.

## Why this is safe

The theme already answers this, in the programme meta box: **the team fills in
labelled fields and the theme renders the presentation.** They never touch
markup, CSS or a page builder, so there is nothing to break. Every area below
copies that pattern rather than inventing one.

## Mechanism

Native WordPress — custom post types and meta boxes. No plugin.

- ACF's repeater field, which would be the obvious tool for line-ups and winners
  lists, is Pro-only, so it is not a free dependency.
- A plugin is another thing to update, another thing to break on update, and
  another admin screen to explain.

Where a list of things is needed, the field is **a textarea you paste a table
into**, one row per line, pipe-separated. That is not a compromise — it is how
the club already hands this data over. August's Bond winners arrived as a pasted
table; a field shaped like that is less work for them than six sets of four boxes.

## Phase 0 — hardening (do first, regardless)

There is no hardening at all today. Anyone with an Administrator login can open
**Appearance → Theme File Editor** and break the live site in a keystroke, and
nobody needs Administrator to write a match report.

1. `DISALLOW_FILE_EDIT` in `wp-config.php` (this cannot be set from a theme —
   wp-config loads first), plus a defensive `remove_menu_page` so the screen is
   gone even if the constant is missed.
2. The people updating content get **Editor**, not Administrator.
3. Bespoke templates already ignore page content, so Divi cannot wreck the shop,
   fixtures, programme or Bond pages. Keep that deliberate.

## Phase 1 — fixtures, kick-offs, postponements, scores

One post type, `cc25_fixture`, replaces four hardcoded lists:

| Replaces | Today |
|---|---|
| `cc25_static_fixtures()` | 70+ rows across three teams |
| `cc25_kickoff_overrides()` | 44 entries |
| `cc25_hidden_fixtures()` | postponements as a separate list |
| the score element on a fixture row | added 8 Aug |

Fields: team, date, kick-off, opponent (chosen from the crest list so the badge
always resolves), home/away, competition, **status** (scheduled / postponed /
played) and score.

One record per game is the point. A postponement becomes a dropdown rather than
an entry in a second list that has to agree with the first — which is exactly the
bug that put a called-off Risca game on the homepage as "next home game".

## Phase 2 — match reports

A post in a `match-report` category with one extra field: **which fixture this is
about**, picked from recent games. Everything factual — opponent, date, score,
competition — comes from the fixture, so it cannot contradict the results page.

The team supplies: scorers, attendance, the written report, and photos via the
normal WordPress gallery.

The report body is the standard editor, because prose should be prose. Style
safety comes from the wrapper: `.prose` constrains typography, and pasted inline
`style`/`font` attributes are stripped on save so a paste out of Word cannot
import its own formatting.

Results rows link to the report where one exists — the same treatment the
programme links get.

## Phase 3 — Celtic Bond draws

Post type `cc25_bond_draw`: date, label, and a winners field pasted as a table:

```
306 | £500     | Harri Pritchard | Youth Team
62  | £50      | Stephen Fry     | Walking Football
267 | Ear Buds | Joanne Berry    | Mens 1st Team
```

Parsed leniently — extra spaces, missing pipes on the last column, a header row,
and a `£` the editor forgot are all tolerated rather than fatal.

## Cutover

Each area reads **posts first, the existing PHP array second**. So uploading the
theme changes nothing until content is migrated, and a half-finished migration
degrades to the current behaviour rather than to a blank page.

A one-off importer on an admin screen creates posts from the current arrays, so
nobody retypes 70 fixtures. Idempotent — running it twice does not duplicate.

## Validation

No input may break a page. Every field is validated on save; anything
unparseable is reported back in the editor as an admin notice and the previous
value is kept. The parsed result is echoed back on save — for the pasted tables
especially — so the editor can see what landed rather than trusting it.

## Testing

- Table parsing: the real August Bond table, a header row, missing trailing
  columns, stray whitespace, a `£` in the wrong place, an empty paste.
- Fixture status: a postponed record never appears as a fixture or a result;
  a played one appears only as a result.
- Cutover: with no posts, every reader falls back to the PHP arrays and the site
  is byte-identical to today.
- Import is idempotent.

Admin screens need a browser and a WordPress install, so those are a staging
check.

## Out of scope

- Full match-centre reports — line-ups, minute-by-minute events, both XIs. The
  existing hardcoded reports have them, but that is a lot of typing every week
  and the club chose the simpler shape.
- Shop and sponsors. They change rarely; the weekly jobs come first.
