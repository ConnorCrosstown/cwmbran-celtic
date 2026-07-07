# Live match data from allwalessport — design

**Date:** 2026-07-07
**Repo:** `cwmbran-celtic` (Next.js 16, App Router, TS)
**Status:** Approved design, ready for implementation plan

## Problem

The site already renders league tables, fixtures, and results through a clean
data façade (`src/lib/comet.ts` → `getMensLeagueTable()`, `getFixtures()`,
`getResults()`, `getLeaguePosition()`, …), consumed by finished UI components
(`LeagueTable`, `FixtureCard`, `ResultCard`, `LeaguePosition`,
`UpcomingFixtures`, `LatestResult`).

Behind the façade are three providers in priority order:

1. **Comet** (FAW official) — needs paid API keys, **not configured**
2. **SofaScore** (via Apify actor `azzouzana/sofascore-scraper-pro`) — needs a
   paid `APIFY_API_TOKEN`, **not configured**, and covers tier-3 Welsh football
   poorly
3. **Mock data** — the fallback that is **currently what renders live**

So the public site shows placeholder data. Both live sources cost money and
neither reliably carries the divisions Cwmbran Celtic actually play in.

`allwalessport.co.uk` is the free, authoritative source for those exact
divisions and serves clean, static, server-rendered HTML (verified).

## Goal

Feed **all Cwmbran Celtic teams (men's and women's)** — league table, fixtures,
and results — from allwalessport, through the existing façade, so the whole site
flips from placeholder to live. Refresh "regularly" (daily is sufficient).
Retire the manual/Google-Sheet fixtures system; allwalessport becomes the sole
source.

## Source characteristics (verified 2026-07-07)

- Division page: `https://www.allwalessport.co.uk/football.aspx?cid=<id>`.
  Men's first team (Ardal League South East) = `cid=20149`.
- It is an ASP.NET WebForms page, **but** the Fixtures and Results tabs are an
  AJAX Control Toolkit `TabContainer` whose **both panels' HTML are already in
  the initial server response** (the Results panel is present, just
  `display:none`). So **one GET yields both fixtures and results** — no
  postback / `__doPostBack` gymnastics.
- Fixtures markup is clean and predictable:
  - Date headers: `<h2>7 August 2026</h2>`
  - Rows: `<td class="team1">Team A</td><td class="versus"> v </td><td class="team2">Team B</td>`
  - When a game is played, the `versus` cell is expected to carry the score
    (e.g. `2 - 1`) instead of ` v ` — **to be confirmed against live data**.
- The **league table is not on the division page** and has no visible link
  pre-season; its URL must be located once the season starts (kickoff late
  July 2026). Fallback if awkward: the official FAW/Ardal table — out of scope
  unless needed.

## Design

One new provider + one registry, wired into the existing façade. **No UI
changes.**

### 1. Team registry — `src/data/allwalessport-teams.ts`

A typed list mapping each Cwmbran Celtic side to its allwalessport division:

```ts
export interface AwsTeam {
  key: 'mens' | 'ladies' | /* future: */ 'reserves';
  label: string;            // display name for the team page
  cid: number;              // allwalessport competition id
  clubName: string;         // canonical name as it appears on allwalessport
}

export const AWS_TEAMS: AwsTeam[] = [
  { key: 'mens',   label: "Men's First Team", cid: 20149, clubName: 'Cwmbran Celtic' },
  { key: 'ladies', label: 'Ladies',           cid: /* TBD, likely 10641 */ 0, clubName: 'Cwmbran Celtic' },
];
```

`cid`/`clubName` for the women's (and any reserve) side are **confirmed as a
setup step** by browsing the candidate divisions on allwalessport (women's
candidate: S Wales Womens & Girls League, `cid=10641`). A team whose `cid` is
still `0`/unset is skipped, not errored.

### 2. Provider — `src/lib/allwalessport.ts`

Pure functions, isolated and unit-testable:

- `parseFixturesAndResults(html, clubName)` → `{ fixtures: Fixture[]; results: Result[] }`
  - Splits date sections on `<h2>`, walks `team1/versus/team2` rows.
  - `versus` cell = ` v ` → **fixture**; `versus` cell = a score → **result**.
  - Date string (`7 August 2026`) → epoch ms for `Fixture.date` / `Result.date`.
  - `homeAway` derived from which side is `clubName`.
  - `scorers` / `attendance` left empty (source does not provide them).
- `parseLeagueTable(html)` → `LeagueTableRow[]`
  - position, club, played, won, drawn, lost, gd, points; `form` if present.
- `fetchTeam(team: AwsTeam)` → fetches the division page (fixtures+results) and
  the table page, parses, filters fixtures/results to `clubName`, returns typed
  `CometResponse<T>` payloads.
- Uses **cheerio** (new dependency) for parsing. Network fetches use Next.js
  caching: `fetch(url, { next: { revalidate: 21600 } })` (≈6h), which
  self-heals by serving the last good copy on source outage.

The parsers take **HTML strings**, so they are tested against saved fixture
files (`src/lib/__tests__/fixtures/aws-*.html`) with no network.

### 3. Façade wiring — `src/lib/comet.ts`

allwalessport becomes the **primary provider**, occupying the currently
commented-out SofaScore hook in `getFixtures()`, `getResults()`,
`getMensLeagueTable()`, `getLeaguePosition()`, and the per-team variants. Order
becomes: allwalessport → mock fallback. `getFixturesByTeam` / the ladies table
map onto the registry by `key`.

### 4. Retire the manual system

Remove the Google-Sheet/localStorage path and its admin surface:
`src/lib/fixtures-api.ts`, `src/app/admin/fixtures/page.tsx`, and the
`NEXT_PUBLIC_FIXTURES_API_URL` env reference. Confirm no other module imports
them before deleting.

### 5. Caching / "regularly"

No cron, no database, no third-party cost. Next.js `revalidate` on the fetches
provides daily-fresh data and stale-on-error resilience. A short-TTL API route
(`/api/allwalessport`) may be exposed for debugging/manual refresh but is not
required by the UI.

## Data flow

```
allwalessport division page ──fetch(revalidate)──┐
allwalessport table page   ──fetch(revalidate)──┤
                                                 ▼
                     src/lib/allwalessport.ts (parse → typed)
                                                 ▼
                     src/lib/comet.ts (façade, primary provider)
                                                 ▼
        LeagueTable / FixtureCard / ResultCard / LeaguePosition (unchanged)
```

## Error handling

- Fetch failure or parse yielding zero rows → provider returns empty/typed
  fallback; façade drops to mock data. Never throws into a page render.
- Unset team `cid` → skipped.
- Parser is defensive about missing cells (postponed rows, blank `<h3>`), but
  does **not** pile on speculative guards — it targets the actual observed
  markup and is corrected against live data once the season starts.

## Testing

- Unit tests for `parseFixturesAndResults` and `parseLeagueTable` against saved
  HTML fixtures: a pre-season page (fixtures only, no results — real, saved
  today) and, once available, an in-season page (mixed fixtures + results) and a
  populated table page.
- A façade test asserting allwalessport output is preferred over mock and that
  mock is used when the provider returns empty.

## Out of scope

- FAW/Comet official table as a secondary source (only if allwalessport's table
  proves unparseable).
- Scorers, attendance, match reports (source lacks them; manual entry retired).
- Youth/development/walking sides unless they turn out to have allwalessport
  divisions.

## Open items (resolved during implementation / setup)

1. Confirm women's (and any reserve) `cid` + exact `clubName` on allwalessport.
2. Locate + verify the league-table page URL per division once the season
   starts.
3. Verify the played-match score markup in the `versus` cell against live data.
