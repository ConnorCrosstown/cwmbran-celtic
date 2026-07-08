# allwalessport Live Data Feed — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Feed every Cwmbran Celtic team's league table, fixtures, and results from allwalessport.co.uk through the site's existing data façade, replacing the unconfigured Comet/SofaScore providers and the manual fixtures system.

**Architecture:** A team registry maps each Cwmbran side to its allwalessport competition id (`cid`). One new provider module (`src/lib/allwalessport.ts`) fetches each division's page — a single GET yields fixtures, results, and the league table — and parses the static HTML into the site's existing `Fixture` / `Result` / `LeagueTableRow` types. The `comet.ts` façade calls this provider first, falling back to mock data. No UI components change.

**Tech Stack:** Next.js 16 (App Router, RSC), TypeScript, cheerio (HTML parsing, new dep), vitest (unit tests, new dev dep).

## Global Constraints

- Node/Next fetches only run **server-side** (façade + RSC); never fetch allwalessport from a client component (CSP `connect-src` forbids it, and parsing needs cheerio which is server-only).
- All network fetches use `fetch(url, { next: { revalidate: 21600 } })` (6h ISR) — no cron, no database, no paid API.
- Parsers are **pure functions of an HTML string** — no network inside them — so they are tested against saved fixture files.
- Existing shared types live in `src/types/index.ts`; extend, don't fork them.
- The façade is the only consumer boundary the UI knows — public function signatures in `comet.ts` must not change (only their internals).
- allwalessport markup, verified 2026-07-08:
  - Date header: `<h2>7 August 2026</h2>` per match day.
  - **Fixture** row: `<td class="team1">Home</td><td class="versus"> v </td><td class="team2">Away</td>` (one `versus` cell containing ` v `).
  - **Result** row: `<td class="team1">Home</td><td class="versus">3</td><td class="versus">1</td><td class="team2">Away</td>` (two `versus` cells = home score, away score).
  - **Table** row: `<tr><td class="tablededucted">…</td><td class="tableteam">Club</td><td class="tablecolumn">P</td><td class="tablecolumn">W</td><td class="tablecolumn">D</td><td class="tablecolumn">L</td><td class="tablecolumn">GD</td><td class="tablecolumn">Pts</td></tr>`; position is row order (no position column, no form column).

---

### Task 1: Test tooling + team registry

**Files:**
- Modify: `package.json` (add deps + `test` script)
- Create: `vitest.config.ts`
- Create: `src/data/allwalessport-teams.ts`
- Test: `src/data/__tests__/allwalessport-teams.test.ts`

**Interfaces:**
- Produces:
  - `type TeamKey = 'mens' | 'ladies' | 'reserves'`
  - `interface AwsTeam { key: TeamKey; label: string; cid: number; clubName: string }`
  - `const AWS_TEAMS: AwsTeam[]`
  - `function activeTeams(): AwsTeam[]` — returns entries with `cid > 0`

- [ ] **Step 1: Install dependencies**

Run:
```bash
cd /Users/connorcupples/cwmbran-celtic
npm install --save-dev vitest@^3 @vitejs/plugin-react
npm install cheerio@^1.0.0
```
Expected: added to `package.json`, no peer-dep errors.

- [ ] **Step 2: Add test script to package.json**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 4: Write the failing test**

Create `src/data/__tests__/allwalessport-teams.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { AWS_TEAMS, activeTeams } from '@/data/allwalessport-teams';

describe('allwalessport team registry', () => {
  it('registers the mens first team with the verified cid', () => {
    const mens = AWS_TEAMS.find(t => t.key === 'mens');
    expect(mens).toBeDefined();
    expect(mens!.cid).toBe(20149);
    expect(mens!.clubName).toBe('Cwmbran Celtic');
  });

  it('has unique team keys', () => {
    const keys = AWS_TEAMS.map(t => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('activeTeams() excludes teams whose cid is unset (0)', () => {
    const withUnset = AWS_TEAMS.some(t => t.cid === 0);
    const active = activeTeams();
    expect(active.every(t => t.cid > 0)).toBe(true);
    if (withUnset) expect(active.length).toBeLessThan(AWS_TEAMS.length);
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test -- src/data/__tests__/allwalessport-teams.test.ts`
Expected: FAIL — cannot resolve `@/data/allwalessport-teams`.

- [ ] **Step 6: Create the registry**

Create `src/data/allwalessport-teams.ts`:
```ts
/**
 * Registry of Cwmbran Celtic teams and their allwalessport competition ids.
 *
 * cid = the `cid` query param on football.aspx?cid=<id> for that team's division.
 * A team with cid: 0 is not yet resolved and is skipped until filled in.
 *
 * To resolve a team's cid: open allwalessport.co.uk football, drill into the
 * league that team plays in, and read the cid from the URL. Confirm the club's
 * exact spelling (clubName) as it appears in that division's table.
 */
export type TeamKey = 'mens' | 'ladies' | 'reserves';

export interface AwsTeam {
  key: TeamKey;
  label: string;    // heading shown on the team page
  cid: number;      // allwalessport competition id; 0 = unresolved, skipped
  clubName: string; // exact club name as printed on allwalessport
}

export const AWS_TEAMS: AwsTeam[] = [
  { key: 'mens', label: "Men's First Team", cid: 20149, clubName: 'Cwmbran Celtic' },
  // Women's cid to be resolved (pre-season, division not yet published).
  // Likely the S Wales Womens & Girls League. Set cid + confirm clubName, then this activates.
  { key: 'ladies', label: 'Ladies', cid: 0, clubName: 'Cwmbran Celtic' },
];

export function activeTeams(): AwsTeam[] {
  return AWS_TEAMS.filter(t => t.cid > 0);
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- src/data/__tests__/allwalessport-teams.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/data/allwalessport-teams.ts src/data/__tests__/allwalessport-teams.test.ts
git commit -m "feat: add vitest, cheerio, and allwalessport team registry"
```

---

### Task 2: Date and match-id helpers

**Files:**
- Create: `src/lib/allwalessport-parse.ts`
- Test: `src/lib/__tests__/allwalessport-parse.test.ts`

**Interfaces:**
- Produces:
  - `function parseAwsDate(text: string): number` — `"7 August 2026"` → epoch ms (UTC noon)
  - `function stableMatchId(date: number, home: string, away: string): number` — deterministic positive int

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/allwalessport-parse.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parseAwsDate, stableMatchId } from '@/lib/allwalessport-parse';

describe('parseAwsDate', () => {
  it('parses "7 August 2026" to UTC-noon epoch ms', () => {
    expect(parseAwsDate('7 August 2026')).toBe(Date.UTC(2026, 7, 7, 12, 0, 0));
  });
  it('trims surrounding whitespace', () => {
    expect(parseAwsDate('  15 May 2022 ')).toBe(Date.UTC(2022, 4, 15, 12, 0, 0));
  });
  it('returns NaN for unparseable input', () => {
    expect(Number.isNaN(parseAwsDate('not a date'))).toBe(true);
  });
});

describe('stableMatchId', () => {
  it('is deterministic for the same inputs', () => {
    const d = Date.UTC(2026, 7, 7, 12, 0, 0);
    expect(stableMatchId(d, 'Cwmbran Celtic', 'Risca United'))
      .toBe(stableMatchId(d, 'Cwmbran Celtic', 'Risca United'));
  });
  it('differs when teams differ', () => {
    const d = Date.UTC(2026, 7, 7, 12, 0, 0);
    expect(stableMatchId(d, 'A', 'B')).not.toBe(stableMatchId(d, 'B', 'A'));
  });
  it('is a positive integer', () => {
    expect(stableMatchId(1, 'A', 'B')).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/allwalessport-parse.test.ts`
Expected: FAIL — cannot resolve `@/lib/allwalessport-parse`.

- [ ] **Step 3: Implement the helpers**

Create `src/lib/allwalessport-parse.ts`:
```ts
const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/** "7 August 2026" -> epoch ms at 12:00 UTC (noon avoids TZ date-shift). NaN if unparseable. */
export function parseAwsDate(text: string): number {
  const m = text.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return NaN;
  const day = parseInt(m[1], 10);
  const month = MONTHS[m[2].toLowerCase()];
  const year = parseInt(m[3], 10);
  if (month === undefined) return NaN;
  return Date.UTC(year, month, day, 12, 0, 0);
}

/** Deterministic positive 31-bit id from match identity (allwalessport has no match id). */
export function stableMatchId(date: number, home: string, away: string): number {
  const s = `${date}|${home}|${away}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 2147483647 || 1;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/allwalessport-parse.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/allwalessport-parse.ts src/lib/__tests__/allwalessport-parse.test.ts
git commit -m "feat: add allwalessport date and match-id parse helpers"
```

---

### Task 3: Extend shared types with a team tag

**Files:**
- Modify: `src/types/index.ts` (the `Fixture` and `Result` interfaces, ~lines 37-62)
- Test: `src/types/__tests__/team-tag.test.ts`

**Interfaces:**
- Consumes: `TeamKey` from `@/data/allwalessport-teams`
- Produces: `Fixture` and `Result` each gain an optional `team?: TeamKey` field (optional keeps existing mock data and Comet shapes valid).

- [ ] **Step 1: Write the failing test**

Create `src/types/__tests__/team-tag.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import type { Fixture, Result } from '@/types';

describe('team tag on fixtures/results', () => {
  it('accepts a team tag on Fixture', () => {
    const f: Fixture = {
      matchId: 1, date: 0, time: '', homeTeam: 'A', awayTeam: 'B',
      competition: 'X', venue: '', homeAway: 'H', team: 'mens',
    };
    expect(f.team).toBe('mens');
  });
  it('accepts a team tag on Result', () => {
    const r: Result = {
      matchId: 1, date: 0, homeTeam: 'A', awayTeam: 'B', homeScore: 1,
      awayScore: 0, competition: 'X', scorers: '', attendance: 0, team: 'ladies',
    };
    expect(r.team).toBe('ladies');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/types/__tests__/team-tag.test.ts`
Expected: FAIL — TS error: `team` does not exist on `Fixture`/`Result` (vitest reports a type/compile error).

- [ ] **Step 3: Add the field**

In `src/types/index.ts`, add an import at the top (after existing imports):
```ts
import type { TeamKey } from '@/data/allwalessport-teams';
```
Add `team?: TeamKey;` as the last field of `interface Fixture` and of `interface Result`:
```ts
export interface Fixture {
  matchId: number;
  date: number;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  homeAway: 'H' | 'A';
  team?: TeamKey; // which Cwmbran side this belongs to (allwalessport feed)
}
```
```ts
export interface Result {
  matchId: number;
  date: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  scorers: string;
  attendance: number;
  team?: TeamKey; // which Cwmbran side this belongs to (allwalessport feed)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/types/__tests__/team-tag.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/types/__tests__/team-tag.test.ts
git commit -m "feat: add optional team tag to Fixture and Result types"
```

---

### Task 4: Parse fixtures and results from a division page

**Files:**
- Create: `src/lib/allwalessport.ts`
- Test: `src/lib/__tests__/allwalessport.fixtures.test.ts`
- Fixtures (already present in repo): `src/lib/__tests__/fixtures/aws-preseason-mens-20149.html`, `src/lib/__tests__/fixtures/aws-inseason-womens-10641.html`

**Interfaces:**
- Consumes: `parseAwsDate`, `stableMatchId` from `@/lib/allwalessport-parse`; `AwsTeam`, `TeamKey` from `@/data/allwalessport-teams`; `Fixture`, `Result` from `@/types`.
- Produces:
  - `function parseFixturesAndResults(html: string, team: AwsTeam): { fixtures: Fixture[]; results: Result[] }`
    - Fixture (one `.versus` cell = ` v `): `homeAway`, `competition = team.label`, `time = ''`, `venue = ''`, `team = team.key`, filtered to rows involving `team.clubName`.
    - Result (two `.versus` cells): `homeScore`/`awayScore` from the two cells, `scorers = ''`, `attendance = 0`, `team = team.key`, filtered to rows involving `team.clubName`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/allwalessport.fixtures.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseFixturesAndResults } from '@/lib/allwalessport';
import type { AwsTeam } from '@/data/allwalessport-teams';

const read = (f: string) =>
  readFileSync(path.join(__dirname, 'fixtures', f), 'utf8');

const mens: AwsTeam = { key: 'mens', label: 'Ardal South East', cid: 20149, clubName: 'Cwmbran Celtic' };

describe('parseFixturesAndResults — pre-season mens page (fixtures only)', () => {
  const { fixtures, results } = parseFixturesAndResults(read('aws-preseason-mens-20149.html'), mens);

  it('extracts Cwmbran Celtic fixtures', () => {
    expect(fixtures.length).toBeGreaterThan(0);
    for (const f of fixtures) {
      expect(f.homeTeam === 'Cwmbran Celtic' || f.awayTeam === 'Cwmbran Celtic').toBe(true);
    }
  });
  it('tags fixtures with the team key and label', () => {
    expect(fixtures[0].team).toBe('mens');
    expect(fixtures[0].competition).toBe('Ardal South East');
  });
  it('sets homeAway correctly', () => {
    const home = fixtures.find(f => f.homeTeam === 'Cwmbran Celtic');
    const away = fixtures.find(f => f.awayTeam === 'Cwmbran Celtic');
    if (home) expect(home.homeAway).toBe('H');
    if (away) expect(away.homeAway).toBe('A');
  });
  it('yields no results pre-season', () => {
    expect(results.length).toBe(0);
  });
});

describe('parseFixturesAndResults — in-season page (results present)', () => {
  // Filter to a club known to appear in the archived women's fixture file.
  const splott: AwsTeam = { key: 'ladies', label: 'S Wales Womens', cid: 10641, clubName: 'Splott Albion' };
  const { results } = parseFixturesAndResults(read('aws-inseason-womens-10641.html'), splott);

  it('extracts results with numeric scores for the club', () => {
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(Number.isInteger(r.homeScore)).toBe(true);
      expect(Number.isInteger(r.awayScore)).toBe(true);
      expect(r.homeTeam === 'Splott Albion' || r.awayTeam === 'Splott Albion').toBe(true);
    }
  });
  it('reads the "7 0" row as 7-0', () => {
    const r = results.find(x => x.homeTeam === 'Newport City Dev' && x.awayTeam === 'Splott Albion');
    expect(r).toBeDefined();
    expect(r!.homeScore).toBe(7);
    expect(r!.awayScore).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/allwalessport.fixtures.test.ts`
Expected: FAIL — `parseFixturesAndResults` is not exported from `@/lib/allwalessport`.

- [ ] **Step 3: Implement the parser**

Create `src/lib/allwalessport.ts`:
```ts
import * as cheerio from 'cheerio';
import type { Fixture, Result } from '@/types';
import type { AwsTeam } from '@/data/allwalessport-teams';
import { parseAwsDate, stableMatchId } from '@/lib/allwalessport-parse';

/**
 * Parse a football.aspx?cid=<id> page into fixtures and results for one team.
 *
 * A match-day is an <h2>date</h2> followed by rows. Each row has:
 *   .team1 | .versus (" v ")             .team2   -> fixture (unplayed)
 *   .team1 | .versus (home) | .versus (away) | .team2 -> result (played)
 * Only rows involving team.clubName are returned.
 */
export function parseFixturesAndResults(
  html: string,
  team: AwsTeam
): { fixtures: Fixture[]; results: Result[] } {
  const $ = cheerio.load(html);
  const fixtures: Fixture[] = [];
  const results: Result[] = [];
  let currentDate = NaN;

  // Walk every <h2> (date) and <tr> (row) in document order.
  $('h2, tr').each((_, el) => {
    if (el.tagName === 'h2') {
      currentDate = parseAwsDate($(el).text());
      return;
    }
    const row = $(el);
    const home = row.find('td.team1').first().text().trim();
    const away = row.find('td.team2').first().text().trim();
    if (!home || !away) return;
    if (home !== team.clubName && away !== team.clubName) return;

    const versus = row.find('td.versus');
    const homeAway: 'H' | 'A' = home === team.clubName ? 'H' : 'A';
    const date = currentDate;

    if (versus.length >= 2) {
      const hs = parseInt($(versus[0]).text().trim(), 10);
      const as = parseInt($(versus[1]).text().trim(), 10);
      if (Number.isNaN(hs) || Number.isNaN(as)) return;
      results.push({
        matchId: stableMatchId(date, home, away),
        date, homeTeam: home, awayTeam: away,
        homeScore: hs, awayScore: as,
        competition: team.label, scorers: '', attendance: 0, team: team.key,
      });
    } else {
      fixtures.push({
        matchId: stableMatchId(date, home, away),
        date, time: '', homeTeam: home, awayTeam: away,
        competition: team.label, venue: '', homeAway, team: team.key,
      });
    }
  });

  return { fixtures, results };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/allwalessport.fixtures.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/allwalessport.ts src/lib/__tests__/allwalessport.fixtures.test.ts
git commit -m "feat: parse allwalessport fixtures and results"
```

---

### Task 5: Parse the league table

**Files:**
- Modify: `src/lib/allwalessport.ts` (add `parseLeagueTable`)
- Test: `src/lib/__tests__/allwalessport.table.test.ts`

**Interfaces:**
- Consumes: `LeagueTableRow` from `@/types`; the in-season fixture file.
- Produces: `function parseLeagueTable(html: string): LeagueTableRow[]` — position by row order (1-indexed); six `.tablecolumn` cells map to played, won, drawn, lost, gd, points; `form` omitted (source has none).

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/allwalessport.table.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseLeagueTable } from '@/lib/allwalessport';

const html = readFileSync(
  path.join(__dirname, 'fixtures', 'aws-inseason-womens-10641.html'), 'utf8'
);

describe('parseLeagueTable', () => {
  const table = parseLeagueTable(html);

  it('reads every club row', () => {
    expect(table.length).toBeGreaterThanOrEqual(10);
  });
  it('numbers positions by row order starting at 1', () => {
    expect(table[0].position).toBe(1);
    expect(table[0].club).toBe('Pontypridd United');
    expect(table[table.length - 1].position).toBe(table.length);
  });
  it('parses P/W/D/L/GD/Pts as numbers for the top row', () => {
    const top = table[0];
    expect(top.played).toBe(17);
    expect(top.won).toBe(13);
    expect(Number.isInteger(top.drawn)).toBe(true);
    expect(Number.isInteger(top.lost)).toBe(true);
    expect(Number.isInteger(top.gd)).toBe(true);
    expect(Number.isInteger(top.points)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/allwalessport.table.test.ts`
Expected: FAIL — `parseLeagueTable` is not exported.

- [ ] **Step 3: Implement parseLeagueTable**

Append to `src/lib/allwalessport.ts` (add `LeagueTableRow` to the `@/types` import):
```ts
/**
 * Parse the standings table. Each club row is a <tr> containing a td.tableteam
 * followed by six td.tablecolumn cells: P, W, D, L, GD, Pts. Position = order.
 */
export function parseLeagueTable(html: string): LeagueTableRow[] {
  const $ = cheerio.load(html);
  const rows: LeagueTableRow[] = [];

  $('tr').each((_, el) => {
    const row = $(el);
    const club = row.find('td.tableteam').first().text().trim();
    if (!club) return;
    const cols = row.find('td.tablecolumn');
    if (cols.length < 6) return;
    const n = (i: number) => parseInt($(cols[i]).text().trim(), 10) || 0;
    rows.push({
      position: rows.length + 1,
      club,
      played: n(0), won: n(1), drawn: n(2), lost: n(3), gd: n(4), points: n(5),
    });
  });

  return rows;
}
```
Update the import line to:
```ts
import type { Fixture, Result, LeagueTableRow } from '@/types';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/allwalessport.table.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/allwalessport.ts src/lib/__tests__/allwalessport.table.test.ts
git commit -m "feat: parse allwalessport league table"
```

---

### Task 6: Network fetchers over the parsers

**Files:**
- Modify: `src/lib/allwalessport.ts` (add fetch layer)
- Test: `src/lib/__tests__/allwalessport.fetch.test.ts`

**Interfaces:**
- Consumes: `activeTeams`, `AwsTeam` from `@/data/allwalessport-teams`; the parsers above.
- Produces:
  - `function divisionUrl(cid: number): string` — `https://www.allwalessport.co.uk/football.aspx?cid=<cid>`
  - `async function fetchTeamData(team: AwsTeam, fetchImpl?: typeof fetch): Promise<{ fixtures: Fixture[]; results: Result[]; table: LeagueTableRow[] }>`
  - `async function fetchAllTeams(fetchImpl?: typeof fetch): Promise<{ fixtures: Fixture[]; results: Result[]; tables: Record<string, LeagueTableRow[]> }>` — `tables` keyed by `TeamKey`; iterates `activeTeams()`; a failing team is logged and skipped (empty), never throws.

The optional `fetchImpl` parameter exists purely so tests inject a stub; production passes nothing and the global `fetch` (with ISR options) is used.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/allwalessport.fetch.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { divisionUrl, fetchTeamData } from '@/lib/allwalessport';
import type { AwsTeam } from '@/data/allwalessport-teams';

const html = readFileSync(
  path.join(__dirname, 'fixtures', 'aws-preseason-mens-20149.html'), 'utf8'
);
const mens: AwsTeam = { key: 'mens', label: 'Ardal South East', cid: 20149, clubName: 'Cwmbran Celtic' };

describe('divisionUrl', () => {
  it('builds the football.aspx url', () => {
    expect(divisionUrl(20149)).toBe('https://www.allwalessport.co.uk/football.aspx?cid=20149');
  });
});

describe('fetchTeamData', () => {
  it('fetches the division page once and returns parsed data', async () => {
    const fake = vi.fn(async () => new Response(html, { status: 200 }));
    const data = await fetchTeamData(mens, fake as unknown as typeof fetch);
    expect(fake).toHaveBeenCalledTimes(1);
    expect(fake).toHaveBeenCalledWith(divisionUrl(20149), expect.anything());
    expect(data.fixtures.length).toBeGreaterThan(0);
    expect(Array.isArray(data.table)).toBe(true);
  });

  it('returns empty arrays (no throw) on a non-ok response', async () => {
    const fake = vi.fn(async () => new Response('nope', { status: 500 }));
    const data = await fetchTeamData(mens, fake as unknown as typeof fetch);
    expect(data.fixtures).toEqual([]);
    expect(data.results).toEqual([]);
    expect(data.table).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/allwalessport.fetch.test.ts`
Expected: FAIL — `divisionUrl` / `fetchTeamData` not exported.

- [ ] **Step 3: Implement the fetch layer**

Append to `src/lib/allwalessport.ts` (add the registry import at the top of the file):
```ts
import { activeTeams, type AwsTeam } from '@/data/allwalessport-teams';
```
```ts
const BASE = 'https://www.allwalessport.co.uk/football.aspx';

export function divisionUrl(cid: number): string {
  return `${BASE}?cid=${cid}`;
}

/** Fetch one division page (fixtures + results + table). Never throws — empty on failure. */
export async function fetchTeamData(
  team: AwsTeam,
  fetchImpl: typeof fetch = fetch
): Promise<{ fixtures: Fixture[]; results: Result[]; table: LeagueTableRow[] }> {
  try {
    const res = await fetchImpl(divisionUrl(team.cid), {
      next: { revalidate: 21600 },
    } as RequestInit);
    if (!res.ok) throw new Error(`allwalessport ${team.cid}: ${res.status}`);
    const html = await res.text();
    const { fixtures, results } = parseFixturesAndResults(html, team);
    return { fixtures, results, table: parseLeagueTable(html) };
  } catch (err) {
    console.warn(`[allwalessport] ${team.key} (cid ${team.cid}) failed:`, err);
    return { fixtures: [], results: [], table: [] };
  }
}

/** Fetch every active team and merge. tables keyed by TeamKey. */
export async function fetchAllTeams(
  fetchImpl: typeof fetch = fetch
): Promise<{ fixtures: Fixture[]; results: Result[]; tables: Record<string, LeagueTableRow[]> }> {
  const teams = activeTeams();
  const all = await Promise.all(teams.map(t => fetchTeamData(t, fetchImpl)));
  const fixtures: Fixture[] = [];
  const results: Result[] = [];
  const tables: Record<string, LeagueTableRow[]> = {};
  teams.forEach((t, i) => {
    fixtures.push(...all[i].fixtures);
    results.push(...all[i].results);
    tables[t.key] = all[i].table;
  });
  return { fixtures, results, tables };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/allwalessport.fetch.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/allwalessport.ts src/lib/__tests__/allwalessport.fetch.test.ts
git commit -m "feat: add allwalessport network fetch layer"
```

---

### Task 7: Wire allwalessport into the comet.ts façade

**Files:**
- Modify: `src/lib/comet.ts`
- Test: `src/lib/__tests__/comet.provider.test.ts`

**Interfaces:**
- Consumes: `fetchAllTeams` from `@/lib/allwalessport`; `AWS_TEAMS` from `@/data/allwalessport-teams`.
- Produces: unchanged public signatures — `getFixtures`, `getResults`, `getMensLeagueTable`, `getLadiesLeagueTable` now return allwalessport data (falling back to mock when the feed is empty). `getFixturesByTeam` filters on the `team` tag. `getLeaguePosition` unchanged (reads `getMensLeagueTable`).

This task adds a single cached loader and rewires four fetchers. A cached module-level promise avoids refetching all teams once per fetcher call within a render.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/comet.provider.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const mensHtml = readFileSync(
  path.join(__dirname, 'fixtures', 'aws-preseason-mens-20149.html'), 'utf8'
);

// Force only the mens team active for a deterministic test.
vi.mock('@/data/allwalessport-teams', async (orig) => {
  const actual = await orig<typeof import('@/data/allwalessport-teams')>();
  const mens = { key: 'mens', label: 'Ardal South East', cid: 20149, clubName: 'Cwmbran Celtic' };
  return { ...actual, AWS_TEAMS: [mens], activeTeams: () => [mens] };
});

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(mensHtml, { status: 200 })));
});

describe('comet façade backed by allwalessport', () => {
  it('getFixtures returns live Cwmbran fixtures, not mock', async () => {
    const { getFixtures } = await import('@/lib/comet');
    const data = await getFixtures();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.every(f =>
      f.homeTeam === 'Cwmbran Celtic' || f.awayTeam === 'Cwmbran Celtic')).toBe(true);
  });

  it('getFixturesByTeam("mens") filters on the team tag', async () => {
    const { getFixturesByTeam } = await import('@/lib/comet');
    const mens = await getFixturesByTeam('mens');
    expect(mens.length).toBeGreaterThan(0);
    expect(mens.every(f => f.team === 'mens')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/comet.provider.test.ts`
Expected: FAIL — `getFixtures` still returns `mockFixtures` (assertion on Cwmbran-only fails, or length differs).

- [ ] **Step 3: Add a cached loader in comet.ts**

In `src/lib/comet.ts`, add imports after the existing `@/data/mock-data` import:
```ts
import { fetchAllTeams } from '@/lib/allwalessport';
import type { TeamKey } from '@/data/allwalessport-teams';
```
Add, just below the `USE_LIVE_API` / `USE_SOFASCORE` constants:
```ts
// allwalessport is the primary live provider. One fetch of all active teams,
// memoised per server render (ISR handles cross-render caching).
let _awsPromise: ReturnType<typeof fetchAllTeams> | null = null;
function loadAllwalessport() {
  if (!_awsPromise) _awsPromise = fetchAllTeams();
  return _awsPromise;
}
```

- [ ] **Step 4: Rewire getFixtures**

Replace the body of `getFixtures` (keep the Comet priority-1 block) so priority 2 is allwalessport:
```ts
export async function getFixtures(): Promise<CometResponse<Fixture>> {
  if (USE_LIVE_API && API_KEYS.fixtures) {
    return fetchFromComet<Fixture>(API_KEYS.fixtures);
  }
  const aws = await loadAllwalessport();
  if (aws.fixtures.length > 0) {
    return wrap('Fixtures', aws.fixtures);
  }
  return mockFixtures as CometResponse<Fixture>;
}
```

- [ ] **Step 5: Rewire getResults**

```ts
export async function getResults(): Promise<CometResponse<Result>> {
  if (USE_LIVE_API && API_KEYS.results) {
    return fetchFromComet<Result>(API_KEYS.results);
  }
  const aws = await loadAllwalessport();
  if (aws.results.length > 0) {
    return wrap('Results', aws.results);
  }
  return mockResults as CometResponse<Result>;
}
```

- [ ] **Step 6: Rewire getMensLeagueTable and getLadiesLeagueTable**

Replace the whole SofaScore block in `getMensLeagueTable` with:
```ts
export async function getMensLeagueTable(): Promise<CometResponse<LeagueTableRow>> {
  if (USE_LIVE_API && API_KEYS.leagueTable) {
    return fetchFromComet<LeagueTableRow>(API_KEYS.leagueTable);
  }
  const aws = await loadAllwalessport();
  const table = aws.tables['mens'] ?? [];
  if (table.length > 0) return wrap('League Table', table);
  return mockLeagueTable as CometResponse<LeagueTableRow>;
}
```
```ts
export async function getLadiesLeagueTable(): Promise<CometResponse<LeagueTableRow>> {
  if (USE_LIVE_API && API_KEYS.ladiesLeague) {
    return fetchFromComet<LeagueTableRow>(API_KEYS.ladiesLeague);
  }
  const aws = await loadAllwalessport();
  const table = aws.tables['ladies'] ?? [];
  if (table.length > 0) return wrap('Ladies League Table', table);
  return mockLadiesLeagueTable as CometResponse<LeagueTableRow>;
}
```

- [ ] **Step 7: Rewire getFixturesByTeam to use the team tag**

```ts
export async function getFixturesByTeam(team: TeamKey): Promise<Fixture[]> {
  const data = await getFixtures();
  return data.results.filter(f => f.team ? f.team === team : (
    team === 'ladies'
      ? f.homeTeam.includes('Ladies') || f.awayTeam.includes('Ladies')
      : !f.homeTeam.includes('Ladies') && !f.awayTeam.includes('Ladies')
  ));
}
```
(The fallback branch preserves behaviour for mock data, which has no `team` tag.)

- [ ] **Step 8: Add the `wrap` helper**

Add near the top of the DATA FETCHERS section:
```ts
/** Wrap a typed row array in the CometResponse envelope the UI expects. */
function wrap<T>(reportName: string, results: T[]): CometResponse<T> {
  return {
    reportName,
    columnTypes: [],
    columnNames: [],
    columnKeys: [],
    results,
    totalSize: results.length,
    page: 0,
    pageSize: results.length,
  };
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/comet.provider.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 10: Run the full suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 11: Commit**

```bash
git add src/lib/comet.ts src/lib/__tests__/comet.provider.test.ts
git commit -m "feat: back comet façade with allwalessport live data"
```

---

### Task 8: Retire the manual fixtures system

**Files:**
- Delete: `src/lib/fixtures-api.ts`
- Delete: `src/app/admin/fixtures/page.tsx`
- Modify: `.env.example` (remove `NEXT_PUBLIC_FIXTURES_API_URL`)
- Modify: any admin nav/index that links to `/admin/fixtures` (found in step 1)

**Interfaces:**
- Consumes: nothing new.
- Produces: no `fixtures-api` module; admin no longer exposes manual fixture CRUD.

- [ ] **Step 1: Find all references**

Run:
```bash
cd /Users/connorcupples/cwmbran-celtic
grep -rn "fixtures-api" src
grep -rn "NEXT_PUBLIC_FIXTURES_API_URL" src .env.example
grep -rn "admin/fixtures" src
```
Expected: references only in `src/lib/fixtures-api.ts`, `src/app/admin/fixtures/page.tsx`, and possibly `src/app/admin/page.tsx` (nav link). Note each hit.

- [ ] **Step 2: Delete the modules**

Run:
```bash
git rm src/lib/fixtures-api.ts src/app/admin/fixtures/page.tsx
```

- [ ] **Step 3: Remove references**

Remove the `NEXT_PUBLIC_FIXTURES_API_URL` line from `.env.example`. Remove any admin dashboard link to `/admin/fixtures` found in step 1 (e.g. delete the card/`<Link href="/admin/fixtures">…</Link>` in `src/app/admin/page.tsx`).

- [ ] **Step 4: Verify nothing still imports the deleted code**

Run:
```bash
grep -rn "fixtures-api\|admin/fixtures\|NEXT_PUBLIC_FIXTURES_API_URL" src .env.example
```
Expected: no output.

- [ ] **Step 5: Typecheck / build**

Run: `npm run build`
Expected: build succeeds with no unresolved-import errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: retire manual fixtures system in favour of allwalessport"
```

---

### Task 9: End-to-end verification

**Files:**
- Modify (if needed): `src/lib/__tests__/fixtures/README.md` (create) documenting the saved captures.

**Interfaces:** none — this task proves the feature works against the live source and records the pre-season caveats.

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Drive the live pages**

Run: `npm run dev`, then load `/fixtures`, `/` (home — LeaguePosition, UpcomingFixtures, LatestResult), and `/matchday`. Confirm men's fixtures show real Cwmbran Celtic opponents (Tredegar Town, Risca United, etc. from the live feed) rather than mock names. Pre-season, results and the table may be empty — the site should fall back to mock for those without error. Note in the commit message what was observed.

- [ ] **Step 4: Document the fixtures**

Create `src/lib/__tests__/fixtures/README.md`:
```markdown
# Saved allwalessport captures (test fixtures)

- `aws-preseason-mens-20149.html` — Cwmbran Celtic men's (Ardal SE), captured
  2026-07-08 pre-season: fixtures only, no results/table yet.
- `aws-inseason-womens-10641.html` — an archived in-season women's division,
  used to exercise result + league-table parsing (real markup for played games
  and standings).

Refresh a capture with:
`curl -s "https://www.allwalessport.co.uk/football.aspx?cid=<cid>" -o <file>`
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/__tests__/fixtures/README.md
git commit -m "docs: document allwalessport test captures and verification"
```

---

## Post-implementation setup (needs live data / human confirmation)

These are tracked as follow-ups, not code tasks — they can only be completed once the 2026/27 season is live:

1. **Resolve the women's `cid`** — browse allwalessport's women's leagues, find the division listing Cwmbran Celtic, set `cid` + confirm `clubName` in `src/data/allwalessport-teams.ts`. The `ladies` team activates automatically.
2. **Confirm men's results + table** once games are played — the parsers are modelled on real in-season markup from another division, but verify Cwmbran's own page renders correctly and adjust `clubName` if allwalessport prints it differently (e.g. a suffix).
3. **Add reserves/other sides** if they turn out to have allwalessport divisions — add a registry row.

## Self-Review

- **Spec coverage:** registry (Task 1) ✓; provider fetch+parse of fixtures/results/table (Tasks 4–6) ✓; façade wiring, no UI change (Task 7) ✓; retire manual system (Task 8) ✓; caching via `revalidate` (Task 6) ✓; pure-function parsers tested on saved HTML (Tasks 2,4,5) ✓; all-teams via registry (Task 6 `fetchAllTeams`) ✓; caveats/open items captured (Task 9 + Post-implementation) ✓.
- **Type consistency:** `TeamKey`/`AwsTeam`/`AWS_TEAMS`/`activeTeams` (Task 1) used identically in Tasks 3,4,6,7; `parseFixturesAndResults`/`parseLeagueTable`/`fetchTeamData`/`fetchAllTeams`/`divisionUrl` names consistent across Tasks 4–7; `wrap` defined and used in Task 7; `Fixture.team`/`Result.team` added in Task 3 before use in Task 4.
- **Placeholders:** none — every code step shows full code; the women's `cid: 0` is an intentional, documented unresolved value with a skip path, not a stub.
