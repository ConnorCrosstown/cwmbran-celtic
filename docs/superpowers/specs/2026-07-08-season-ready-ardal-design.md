# Season Ready: Ardal League South East — design

**Date:** 2026-07-08
**Repo:** `cwmbran-celtic` (Next.js 16, App Router, TS)
**Status:** Approved design, ready for implementation plan
**Depends on:** the allwalessport live feed (already live in production)

## Problem

Cwmbran Celtic's men's first team was relegated from **JD Cymru South** to
**Ardal League South East** for the 2026-27 season. The live allwalessport feed
(`cid=20149`) already serves the correct Ardal SE fixtures, but the rest of the
site is stale for the new season:

1. **~30 files still say "JD Cymru South"** — page copy, metadata, hero, footer,
   tickets, membership, newsletter, JSON-LD, search, programme defaults.
2. **The opponent-crest dataset is last season's league.** `opposition-data.ts`
   + `public/images/opponents/` hold ~18 JD Cymru South clubs (Llanelli,
   Carmarthen, …). None of the 15 current Ardal SE opponents have a crest.
3. **Crest display is incomplete.** `FixtureCard`, `ResultCard`, `LatestResult`,
   `UpcomingFixtures` already render an opponent crest via
   `getOppositionByName(name)?.badge`; the **league table** and
   **league-position** widget show no crests. When a crest is missing there is
   no graceful fallback, so unknown opponents render badge-less.

## Goal

Make the site look ready for the new season: **Ardal League South East** branding
everywhere it currently says JD Cymru South (for the men's first team), and an
**opponent crest on every fixture, result, and league-table row** — with a clean
monogram fallback so nothing is ever blank.

The 15 current opponents (exact names as the feed prints them, for crest keying):
Abercarn United, Abergavenny Town, Blaenavon Blues, Brecon Corries, Caldicot
Town, Chepstow Town, Croesyceiliog, Cwmbran Town, Goytre, Lliswerry, New Inn,
Newport Corinthians, Risca United, Tredegar Town, Undy.

## Design

### 1. `TeamCrest` component — the backbone

`src/components/teams/TeamCrest.tsx`. One component every crest routes through:

```tsx
<TeamCrest name="Tredegar Town" size={40} />
```

- Looks the club up via `getOppositionByName(name)` (and treats "Cwmbran
  Celtic"/"Cwmbran Celtic Ladies" as ourselves → the club logo).
- If a `badge` image exists, render it via next `<Image>`.
- Else render a **monogram**: a coloured disc with the club's initials (1-3
  letters derived from the name), using the club's primary colour when known,
  else a neutral brand colour. Deterministic — same club always looks the same.
- Accessible: `alt`/`aria-label` = club name.

This centralises the crest-or-fallback decision so no call site has to branch.

### 2. Ardal SE opposition dataset

Extend `src/data/opposition-data.ts`: **add** the 15 Ardal SE clubs (do NOT
remove the JD Cymru South entries — historical/archive pages still resolve names
through `getOppositionByName`). Each new entry:

```ts
{ id, name, /* exact feed name */ badge?, colours, ground?, website?, nickname? }
```

- `name` must match the feed string exactly so `getOppositionByName` resolves.
- `badge` points at the sourced crest (Task below); omit it when we have no
  crest → `TeamCrest` falls back to a monogram.
- `colours` drives the monogram; fill from the club's known kit where findable,
  else a sensible default.
- Keep the existing `getOppositionByName` / `getOppositionById` API unchanged.

### 3. Source the crests

For each of the 15 opponents, find the club crest (official site / FAW / club
social) and save an optimised copy to `public/images/opponents/<slug>.png` (or
`.webp`), wiring its path into the dataset `badge`. Any club without a clean,
usable crest is simply left without a `badge` → monogram fallback. Log which
clubs got a real crest vs a monogram so the coverage is explicit, not silent.

### 4. Crests on the league table + position widget

- `src/components/tables/LeagueTable.tsx`: render `<TeamCrest name={row.club} />`
  beside each club name; keep the existing Cwmbran-Celtic row highlight.
- `src/components/home/LeaguePosition.tsx`: show the club crest with the
  position.
- Confirm the four surfaces that already show crests (`FixtureCard`,
  `ResultCard`, `LatestResult`, `UpcomingFixtures`) route through `TeamCrest`
  (refactor them to use it) so they also get the monogram fallback for unknown
  Ardal SE opponents — today they render nothing when `badge` is absent.

### 5. Stale-league sweep: "JD Cymru South" → "Ardal League South East"

Replace **present-tense / current-season** references across the ~30 files:
page copy ("Today we compete in …"), `metadata` descriptions, `HeroSection`
league name (men's branch), `Footer`, `AllTeamsOverview`, tickets/membership
copy, `NewsletterEmail`, `JsonLd`, `SearchModal`, `TeamSelector`, `players`
page, `teams`/`teams/mens` pages and their "… Table" headings, and the
programme-generator defaults (`programme/page.tsx`, `admin/programme/page.tsx`,
`programme/[slug]/**`, `ProgrammePDF.tsx`, `ProgrammePreview.tsx`,
`opposition-data.ts` header comment).

**Leave genuinely historical mentions intact** — e.g. `club/history` narrative
("from CYMS to the JD Cymru South"), `season-archives.ts`, past `news-data.ts`
entries, and the "Modern Era achieving promotion to the Cymru South" history
text. Only change text that describes the club's *current* league.

Canonical string: **"Ardal League South East"** (as the allwalessport source
prints it). Add a single shared constant (e.g. `MENS_LEAGUE_NAME` in
`src/lib/site.ts`) and reference it where practical, so a future league change is
one edit — but do not over-refactor deep programme templates if a direct string
replace is cleaner there.

### 6. Registry: league name for the fixture `competition`

`src/data/allwalessport-teams.ts` currently sets `competition = team.label`
("Men's First Team"). Add a `league` field to `AwsTeam` (mens =
`"Ardal League South East"`) and have the parser use `team.league` for
`Fixture.competition` / `Result.competition`, so fixtures/results display the
league, not the team label. (`label` stays for team-page headings.)

## Out of scope

- **Women's side.** The women's `cid` is unresolved, so its league
  (`Genero Adran South` in `HeroSection`) and opponent crests wait. Flag — do
  not guess — any women's-specific league text touched incidentally.
- Head-to-head / historical stats for the new opponents (no reliable source).
- Reworking the programme generator beyond the league-name swap.

## Testing

- `TeamCrest`: unit tests — renders an `<img>` when a badge exists; renders a
  monogram with correct initials + `aria-label` when it doesn't; treats Cwmbran
  as self.
- Opposition dataset: a test asserting every one of the 15 Ardal SE feed names
  resolves via `getOppositionByName` (guards against name-key drift from the
  feed).
- Registry/parser: a test that `Fixture.competition` is the league name
  ("Ardal League South East"), not the team label.
- Stale-league sweep: a guard test/grep asserting no *current-season* surface
  still emits "JD Cymru South" (scoped to the swept files, allowing the
  historical allow-list).

## Open items

- Exact crest availability per club is discovered during sourcing; monogram
  fallback guarantees completeness regardless.
- Confirm the women's league/opponents in a later pass once the `cid` lands.
