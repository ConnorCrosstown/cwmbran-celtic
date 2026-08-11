# Fixture list update — the club's list of 11 August 2026

Source: `~/Downloads/Fixtures.xlsx`, 11 Aug 2026 16:10, 59,608 bytes, seven sheets.

The previous update (`5b32e56`, the club's list of 10 Aug) left the site accurate for the
five teams it carries. This list's substance is therefore not corrections — it is **two
teams the site has never had**, plus two venue swaps.

Every date in the file was converted from its Excel serial and checked against the
day-of-week the club typed next to it. One disagreement across 109 rows: 21 August is
labelled "Sat" on the master tab and is a Friday. Their own Reserves sheet says "Fri" with
a 6:30pm kick-off, which confirms the call we made yesterday and flagged as a guess. No
change needed.

## What changes for the five existing teams

Diffing all 109 master rows against the site from 14 August onward — the date the club's
list starts — produces exactly two changes, both Men's Reserves v Tredegar Town:

| Date | Site today | Club list | Club's own note |
| --- | --- | --- | --- |
| 2026-09-05 | Home | **Away** | "Was Home" |
| 2026-12-12 | Away | **Home** | "Was Away" |

Everything else agrees. All 14 Women's fixtures, all 28 U18s, the Vets cup tie, and every
Men's First Team game are identical to what is live. Goytre on 5 September is absent from
the club's list, which again confirms the Amateur Trophy tie holds that date and the
postponement stands.

Two apparent differences are not differences:

- **Men's, 24 October** — the club's row reads "League Cup (R2)" in the opponent column
  with no venue, i.e. the tie is still undrawn. The site's `TBC` placeholder already says
  this and says it better. No change.
- **Reserves, 15 August and 21 November** — tagged "Was Away" and "Was Home". Both were
  applied yesterday; the tags are the club echoing changes we already hold.

## The two new teams

### Women's Reserves

SWWGL Women's Development League, 18 league fixtures, Sundays, 6 Sep 2026 to 24 Jan 2027.

These appear **only** on the "Womens (Reserves)" sheet. The master "This Year Games" tab
does not list the team at all, so that sheet is the source. Rows below the league block on
that sheet belong to last season (2025-09 to 2026-04, including an Alun Evans League Cup
run) and are excluded.

### Women's U19s

Adran U19s, 11 league fixtures, Friday nights, 11 Sep to 20 Nov 2026.

The list genuinely ends on 20 November — it is the first half of the season, not a
truncated sheet. The team's fixtures also appear on the master tab, and the two sources
agree.

Both teams are added to `cc25_static_fixtures_static()` as blocks in the same shape as the
existing five, so they inherit the posts-first / hardcoded-fallback behaviour unchanged,
and both get entries in `cc25_fx_teams()` so the fixture editor offers them.

## The fixtures page stops repeating itself

`template-fixtures.php` hard-codes one `teamwrap` block per team, each a copy of the last
with the names edited. That pattern has already produced a live bug once: the U18s and
Vets blocks were copied from the Women's block and inherited its league name and a link to
the women's squad page. Seven copies would mean seven places to keep in step.

The blocks are replaced by a single loop over the team registry. Each team supplies as
data:

- its league name, for the eyebrow
- its squad-page slugs, for the team link
- which tabs it has — Men's First Team is the only team with a league table today, and
  Reserves has fixtures and results only

**The five live teams must render identically.** This is verified by capturing the
rendered page before the change and diffing it against the page after, not by reading it.
Only the two new teams' markup may be new.

The team selector goes from five buttons to seven. Its behaviour at narrow widths is out
of scope here and noted below.

## Kick-offs

Both new teams fall through to `cc25_kickoff_default()`:

- Women's U19s, Fridays → **19:30**
- Women's Reserves, Sundays → **14:00**

Neither is confirmed by the club. They are assumptions, recorded as such in a comment on
each block, and they are the sort of thing that should become explicit
`cc25_kickoff_overrides()` entries once real times are known. Agreed with Connor to run on
the defaults for now.

## Crests

Nine opponents across the two new teams have no crest in the theme. One is recoverable:
**Aberystwyth Town** already has a crest at `public/images/opponents/aberystwyth-town.png`
on the Next.js side and is copied into the theme's `assets/img/opponents/`.

The remaining eight show initials until the club supplies artwork:

Porth Harlequins BGC, North Cardiff Cosmos, Caerphilly Dragons, Briton Ferry Llansawel,
Barry Town United, Cardiff Met, Swansea City, Cardiff City.

The badge-coverage test in `_tests/fixture-record-test.php` asserts that the badge-less
opponents are *exactly* a named list of eleven — an equality check, not a count. The eight
above are added, taking it to nineteen names, and it stays an equality check so a twentieth
fails loudly and gets a decision rather than quietly rendering initials. The comment above
it, which says a "TWELFTH" badge-less opponent will fail, is updated to match.

## Downstream

`tools/graphics/fixtures.json` and `tools/programme/fixtures.json` are generated by
`php export.php`, which reads the theme's lists. Both are regenerated.

`export.php` walks `mens`, `reserves` and `womens` only. It has never covered U18s or
Vets, and it will not cover the two new teams. **Widening it is deliberately out of scope
here** — it needs frame artwork and crest decisions per team, and belongs in its own piece
of work.

## Raised, not changed

Per Connor's decision, the unambiguous parts of the list are imported and the following
are left exactly as the site has them, for him to put to the club:

- **Women's Reserves are down for two home games on the same afternoon** — Porth
  Harlequins BGC (round 4) and North Cardiff Cosmos (round 6), both at home, both Sunday 4
  October. Their round numbers also run out of order and rounds 3 and 10 are missing
  entirely, so the sheet holds 18 games where the numbering implies 20.
- **U18s skips rounds 5 and 19** — two games unaccounted for in an otherwise complete
  28-game list.
- **The Amateur Trophy tie v Penygraig United is "R1" on the master tab and "QR2" on the
  postponement note.** The site says R1 and keeps saying R1.
- **Reserves v Cwmbran Town, 19 September** — the club has *asked* to move it to Friday 18
  September. It is a request, not a fixture change, and the site keeps the 19th.
- **"Cardiff Corries" and "Cardiff Corinthians"** appear on different sheets for the same
  club. The site keeps the longer form; it is the one that resolves to a crest.

## Out of scope

- Widening the matchday-graphics export to all seven teams.
- The team selector's layout at narrow widths, now that it carries seven buttons.
- The Next.js site, which takes fixtures from the allwalessport feed and needs no
  hand-editing.
