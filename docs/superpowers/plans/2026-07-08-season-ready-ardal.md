# Season Ready: Ardal SE Branding + Opponent Crests — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the site for the men's team's new league (Ardal League South East) and put an opponent crest — real or monogram fallback — on every fixture, result, and league-table row.

**Architecture:** A pure `resolveTeamCrest(name)` helper decides crest-image-vs-monogram from the opposition dataset; a thin `TeamCrest` component renders it and is used at every call site. The team registry gains a `league` field so fixtures show the league name. A canonical `MENS_LEAGUE_NAME` constant backs a text sweep of stale "JD Cymru South" references.

**Tech Stack:** Next.js 16 (App Router, RSC), TypeScript, vitest (node env — pure helpers tested, thin components verified by build).

## Global Constraints

- Canonical men's league string: **`Ardal League South East`** (exactly as the allwalessport feed prints it). Source it from `MENS_LEAGUE_NAME` in `src/lib/site.ts` where practical.
- Opposition dataset entries for current opponents MUST use the **exact feed names** so `getOppositionByName` resolves by exact match (it tries exact match before its suffix-stripping partial match): Abercarn United, Abergavenny Town, Blaenavon Blues, Brecon Corries, Caldicot Town, Chepstow Town, Croesyceiliog, Cwmbran Town, Goytre, Lliswerry, New Inn, Newport Corinthians, Risca United, Tredegar Town, Undy.
- **Add** to `opposition-data.ts`; never remove the existing JD Cymru South clubs (archive/history pages resolve names through it).
- Missing crest ⇒ monogram fallback, never a blank. Monogram = deterministic colour from the club name (no per-club colour data required).
- The **stale-league sweep** changes only text describing the club's *current* league. Leave the historical allow-list untouched: `src/data/club-history.ts`, `src/data/season-archives.ts`, `src/data/news-data.ts`, `src/data/gallery-data.ts`, and past-tense history narrative in `club/history` and `programme/[slug]/print` ("achieving promotion to the Cymru South").
- Vitest is node-env; do not add jsdom/RTL. Test pure helpers; verify components via `npm run build` + the final e2e drive.
- Women's side is out of scope (cid unresolved). Do not change women's league text (`Genero Adran South`) except to route it through the registry `league` field with its current value preserved.

---

### Task 1: League-name constant + registry `league` field

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/data/allwalessport-teams.ts`
- Modify: `src/lib/allwalessport.ts:47,53` (use `team.league` for `competition`)
- Modify tests: `src/lib/__tests__/allwalessport.fixtures.test.ts`, `src/lib/__tests__/allwalessport.fetch.test.ts`, `src/lib/__tests__/comet.provider.test.ts` (their inline `AwsTeam` literals need the new `league` field)
- Test: `src/lib/__tests__/allwalessport.league.test.ts` (new)

**Interfaces:**
- Produces: `MENS_LEAGUE_NAME` (string) in `site.ts`; `AwsTeam.league: string`; `Fixture.competition`/`Result.competition` now equal `team.league`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/allwalessport.league.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseFixturesAndResults } from '@/lib/allwalessport';
import { AWS_TEAMS } from '@/data/allwalessport-teams';
import { MENS_LEAGUE_NAME } from '@/lib/site';

describe('fixtures carry the league name as competition', () => {
  it('MENS_LEAGUE_NAME is Ardal League South East', () => {
    expect(MENS_LEAGUE_NAME).toBe('Ardal League South East');
  });
  it('the mens registry entry uses that league', () => {
    const mens = AWS_TEAMS.find(t => t.key === 'mens')!;
    expect(mens.league).toBe('Ardal League South East');
  });
  it('parsed fixtures set competition to the league, not the team label', () => {
    const html = readFileSync(
      path.join(__dirname, 'fixtures', 'aws-preseason-mens-20149.html'), 'utf8');
    const mens = AWS_TEAMS.find(t => t.key === 'mens')!;
    const { fixtures } = parseFixturesAndResults(html, mens);
    expect(fixtures.length).toBeGreaterThan(0);
    expect(fixtures.every(f => f.competition === 'Ardal League South East')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/allwalessport.league.test.ts`
Expected: FAIL — `MENS_LEAGUE_NAME` not exported / `league` undefined.

- [ ] **Step 3: Add the constant**

In `src/lib/site.ts` append:
```ts
/** Men's first team league (2026-27). Single source of truth for the league name. */
export const MENS_LEAGUE_NAME = 'Ardal League South East';
```

- [ ] **Step 4: Add `league` to the registry**

In `src/data/allwalessport-teams.ts`: import the constant and extend the type + entries.
```ts
import { MENS_LEAGUE_NAME } from '@/lib/site';
```
Add `league: string;` to `interface AwsTeam` (with a comment `// competition/league name shown on fixtures`). Update entries:
```ts
export const AWS_TEAMS: AwsTeam[] = [
  { key: 'mens', label: "Men's First Team", league: MENS_LEAGUE_NAME, cid: 20149, clubName: 'Cwmbran Celtic' },
  { key: 'ladies', label: 'Ladies', league: 'Genero Adran South', cid: 0, clubName: 'Cwmbran Celtic' },
];
```

- [ ] **Step 5: Parser uses `team.league`**

In `src/lib/allwalessport.ts`, change both `competition: team.label,` (lines ~47 and ~53) to `competition: team.league,`.

- [ ] **Step 6: Fix existing test fixtures' AwsTeam literals**

The inline `AwsTeam` objects in these tests lack `league` (TS error) and some assert the old competition. Update each literal to include `league`:
- `allwalessport.fixtures.test.ts`: the `mens` literal → add `league: 'Ardal League South East'`; the `splott` literal → add `league: 'S Wales Womens'`. If any assertion checks `competition`, update it to the league value.
- `allwalessport.fetch.test.ts`: the `mens` literal → add `league: 'Ardal League South East'`.
- `comet.provider.test.ts`: the mocked `mens` object → add `league: 'Ardal League South East'`.

- [ ] **Step 7: Run tests**

Run: `npm test` and `npx tsc --noEmit`
Expected: all pass, tsc clean.

- [ ] **Step 8: Commit**

```bash
git add src/lib/site.ts src/data/allwalessport-teams.ts src/lib/allwalessport.ts src/lib/__tests__/
git commit -m "feat: league name constant + registry league field; fixtures show Ardal SE"
```

---

### Task 2: `resolveTeamCrest` pure helper

**Files:**
- Create: `src/lib/team-crest.ts`
- Test: `src/lib/__tests__/team-crest.test.ts`

**Interfaces:**
- Consumes: `getOppositionByName` from `@/data/opposition-data`.
- Produces:
  - `type CrestResult = { kind: 'image'; src: string; alt: string } | { kind: 'monogram'; initials: string; hue: number; alt: string }`
  - `function resolveTeamCrest(name: string): CrestResult`
  - `function crestInitials(name: string): string` (exported for testing)
  - Rules: a name containing "Cwmbran Celtic" → the club logo image (`/images/club-logo.webp`); else if the opposition entry has a `badge` → that image; else a monogram (deterministic `hue` from the name, initials from `crestInitials`).

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/team-crest.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { resolveTeamCrest, crestInitials } from '@/lib/team-crest';

describe('crestInitials', () => {
  it('uses first letters of multi-word names', () => {
    expect(crestInitials('Cwmbran Town')).toBe('CT');
    expect(crestInitials('Newport Corinthians')).toBe('NC');
  });
  it('uses first two letters of single-word names', () => {
    expect(crestInitials('Goytre')).toBe('GO');
    expect(crestInitials('Undy')).toBe('UN');
  });
});

describe('resolveTeamCrest', () => {
  it('maps Cwmbran Celtic to the club logo image', () => {
    const r = resolveTeamCrest('Cwmbran Celtic');
    expect(r.kind).toBe('image');
    if (r.kind === 'image') expect(r.src).toBe('/images/club-logo.webp');
  });
  it('falls back to a monogram for an opponent with no crest', () => {
    const r = resolveTeamCrest('Zzz Unknown FC');
    expect(r.kind).toBe('monogram');
    if (r.kind === 'monogram') {
      expect(r.initials).toBe('ZU');
      expect(r.hue).toBeGreaterThanOrEqual(0);
      expect(r.hue).toBeLessThan(360);
      expect(r.alt).toBe('Zzz Unknown FC');
    }
  });
  it('is deterministic (same name → same hue)', () => {
    const a = resolveTeamCrest('Risca United');
    const b = resolveTeamCrest('Risca United');
    expect(a).toEqual(b);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/team-crest.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helper**

Create `src/lib/team-crest.ts`:
```ts
import { getOppositionByName } from '@/data/opposition-data';

const CLUB_LOGO = '/images/club-logo.webp';

export type CrestResult =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'monogram'; initials: string; hue: number; alt: string };

/** 1-2 letter monogram: initials of the first two words, or first two letters
 *  of a single-word name. Uppercased. */
export function crestInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0] ?? '').slice(0, 2).toUpperCase();
}

function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % 360;
}

/** Decide how to render a club's crest: our own logo, a real crest image, or a
 *  deterministic monogram fallback. */
export function resolveTeamCrest(name: string): CrestResult {
  if (name.includes('Cwmbran Celtic')) {
    return { kind: 'image', src: CLUB_LOGO, alt: name };
  }
  const badge = getOppositionByName(name)?.badge;
  if (badge) return { kind: 'image', src: badge, alt: name };
  return { kind: 'monogram', initials: crestInitials(name), hue: hueFromName(name), alt: name };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/team-crest.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/team-crest.ts src/lib/__tests__/team-crest.test.ts
git commit -m "feat: resolveTeamCrest helper (crest image or monogram fallback)"
```

---

### Task 3: `TeamCrest` component

**Files:**
- Create: `src/components/teams/TeamCrest.tsx`

**Interfaces:**
- Consumes: `resolveTeamCrest` from `@/lib/team-crest`.
- Produces: `export default function TeamCrest({ name, size }: { name: string; size?: number })` — renders a next `<Image>` for `image` results, else a coloured monogram disc. No unit test (thin render layer, verified by build + e2e).

- [ ] **Step 1: Implement the component**

Create `src/components/teams/TeamCrest.tsx`:
```tsx
import Image from 'next/image';
import { resolveTeamCrest } from '@/lib/team-crest';

export default function TeamCrest({ name, size = 40 }: { name: string; size?: number }) {
  const crest = resolveTeamCrest(name);

  if (crest.kind === 'image') {
    return (
      <Image
        src={crest.src}
        alt={crest.alt}
        width={size}
        height={size}
        className="rounded-full object-contain bg-white"
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${crest.hue}, 55%, 40%)`,
        fontSize: Math.round(size * 0.38),
      }}
      role="img"
      aria-label={crest.alt}
    >
      {crest.initials}
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: succeeds (component compiles; not yet used).

- [ ] **Step 3: Commit**

```bash
git add src/components/teams/TeamCrest.tsx
git commit -m "feat: TeamCrest component (image or monogram)"
```

---

### Task 4: Ardal SE opposition dataset

**Files:**
- Modify: `src/data/opposition-data.ts` (add the 15 clubs; update the stale header comment)
- Test: `src/data/__tests__/opposition-ardal.test.ts`

**Interfaces:**
- Consumes: `getOppositionByName`.
- Produces: 15 new `OppositionTeam` entries, exact feed names, `badge` omitted for now (filled in Task 5), `id` a kebab slug, `colours` a description string.

- [ ] **Step 1: Write the failing test**

Create `src/data/__tests__/opposition-ardal.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getOppositionByName } from '@/data/opposition-data';

const ARDAL_SE = [
  'Abercarn United', 'Abergavenny Town', 'Blaenavon Blues', 'Brecon Corries',
  'Caldicot Town', 'Chepstow Town', 'Croesyceiliog', 'Cwmbran Town', 'Goytre',
  'Lliswerry', 'New Inn', 'Newport Corinthians', 'Risca United',
  'Tredegar Town', 'Undy',
];

describe('Ardal South East opposition data', () => {
  it('resolves every current opponent by its exact feed name', () => {
    for (const name of ARDAL_SE) {
      const team = getOppositionByName(name);
      expect(team, `missing: ${name}`).toBeDefined();
      expect(team!.name).toBe(name);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/__tests__/opposition-ardal.test.ts`
Expected: FAIL — several names unresolved (or resolve to a wrong partial match).

- [ ] **Step 3: Add the 15 entries**

In `src/data/opposition-data.ts`, update the header comment to note it now covers both the historical JD Cymru South clubs and the current Ardal League South East clubs. Then add these entries to the `oppositionTeams` array (badge intentionally omitted — Task 5 fills the ones we find a crest for):
```ts
  { id: 'abercarn-united', name: 'Abercarn United', ground: 'Recreation Ground', colours: 'Blue and White' },
  { id: 'abergavenny-town', name: 'Abergavenny Town', ground: 'Pen-y-Pound', colours: 'Blue and White' },
  { id: 'blaenavon-blues', name: 'Blaenavon Blues', ground: 'Recreation Ground', colours: 'Blue' },
  { id: 'brecon-corries', name: 'Brecon Corries', ground: 'The Rich Field', colours: 'Green and White' },
  { id: 'caldicot-town', name: 'Caldicot Town', ground: 'Jubilee Way', colours: 'Yellow and Black' },
  { id: 'chepstow-town', name: 'Chepstow Town', ground: 'Larkfield Park', colours: 'Red and Black' },
  { id: 'croesyceiliog', name: 'Croesyceiliog', ground: 'Woodland Road', colours: 'Blue and White' },
  { id: 'cwmbran-town', name: 'Cwmbran Town', ground: 'Cwmbran Stadium', colours: 'Green and White' },
  { id: 'goytre', name: 'Goytre', ground: 'Plough Road', colours: 'Blue and White' },
  { id: 'lliswerry', name: 'Lliswerry', ground: 'Lliswerry Rec', colours: 'Red' },
  { id: 'new-inn', name: 'New Inn', ground: 'Hazell Drive', colours: 'Red and Black' },
  { id: 'newport-corinthians', name: 'Newport Corinthians', ground: 'Coronation Park', colours: 'Green and White' },
  { id: 'risca-united', name: 'Risca United', ground: 'Ty-Isaf', colours: 'Red and Black' },
  { id: 'tredegar-town', name: 'Tredegar Town', ground: 'Tredegar Recreation Ground', colours: 'Blue and White' },
  { id: 'undy', name: 'Undy', ground: 'The Causeway', colours: 'Yellow and Blue' },
```
(These `ground`/`colours` are reasonable defaults for display; correct any you can verify during Task 5. `colours` is descriptive only — monograms use a name-derived colour, so accuracy here is non-critical.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/data/__tests__/opposition-ardal.test.ts`
Expected: PASS (all 15 resolve by exact name).

- [ ] **Step 5: Commit**

```bash
git add src/data/opposition-data.ts src/data/__tests__/opposition-ardal.test.ts
git commit -m "feat: add Ardal South East opponents to opposition dataset"
```

---

### Task 5: Source the crest images (best-effort + monogram fallback)

**Files:**
- Create: `public/images/opponents/<slug>.png|webp` (only for clubs a crest is found)
- Modify: `src/data/opposition-data.ts` (set `badge` on the entries that got a crest)

**Interfaces:** none (assets + data). Monogram fallback guarantees completeness for any club left without a crest.

- [ ] **Step 1: Find + download crests**

For each of the 15 clubs, search the club's official site / FAW Full-Time / club social media for its crest. When a clean square-ish crest image is found, download it into `public/images/opponents/` named by the entry's `id` (e.g. `tredegar-town.png`). Prefer transparent PNG. Example per club:
```bash
curl -sL "<crest-image-url>" -o public/images/opponents/<id>.png
# sanity-check it is a real image, not an HTML error page:
file public/images/opponents/<id>.png
```
Skip any club with no clean crest — it will monogram automatically. Do not commit broken/placeholder images.

- [ ] **Step 2: Wire `badge` paths**

For each club that got a crest, set `badge: '/images/opponents/<id>.png'` on its entry in `opposition-data.ts`.

- [ ] **Step 3: Log coverage explicitly**

In the commit body (and task report), list which of the 15 clubs got a real crest and which fall back to a monogram — so coverage is explicit, not silently partial.

- [ ] **Step 4: Verify build + crest resolution**

Run: `npm run build` (Next Image needs valid files) and `npm test` (dataset test still green).
Expected: build succeeds; no broken image references.

- [ ] **Step 5: Commit**

```bash
git add public/images/opponents src/data/opposition-data.ts
git commit -m "feat: source Ardal SE club crests (monogram fallback for the rest)"
```

---

### Task 6: Crests in the league table + position widget

**Files:**
- Modify: `src/components/tables/LeagueTable.tsx`
- Modify: `src/components/home/LeaguePosition.tsx`

**Interfaces:**
- Consumes: `TeamCrest` from `@/components/teams/TeamCrest`.

- [ ] **Step 1: Add a crest to each league-table row**

In `src/components/tables/LeagueTable.tsx`, add the import:
```tsx
import TeamCrest from '@/components/teams/TeamCrest';
```
Replace the club cell body (currently `{row.club}`) with a crest + name:
```tsx
                <td className={`px-1.5 sm:px-3 py-2 sm:py-3 ${isHighlighted ? 'text-celtic-blue' : ''} max-w-[100px] sm:max-w-none`}>
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0"><TeamCrest name={row.club} size={20} /></span>
                    <span className="truncate">{row.club}</span>
                  </span>
                </td>
```

- [ ] **Step 2: Add the club crest to the position widget**

In `src/components/home/LeaguePosition.tsx`, add the import and place a crest next to the heading:
```tsx
import TeamCrest from '@/components/teams/TeamCrest';
```
Change the heading block to include the crest (uses the highlighted club — this widget is always Cwmbran):
```tsx
        <div className="flex items-center gap-2 mb-4">
          <TeamCrest name={position.club} size={28} />
          <h3 className="text-lg font-bold text-celtic-dark">League Position</h3>
        </div>
```
(Remove the old standalone `<h3>League Position</h3>` line.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/tables/LeagueTable.tsx src/components/home/LeaguePosition.tsx
git commit -m "feat: show club crests in league table and position widget"
```

---

### Task 7: Route existing crest surfaces through `TeamCrest`

**Files:**
- Modify: `src/components/fixtures/FixtureCard.tsx`
- Modify: `src/components/fixtures/ResultCard.tsx`
- Modify: `src/components/home/LatestResult.tsx`
- Modify: `src/components/home/UpcomingFixtures.tsx`

**Interfaces:**
- Consumes: `TeamCrest`.
- Rationale: these four render an opponent crest only when `getOppositionByName(name)?.badge` exists — Ardal opponents without a sourced crest currently render blank/inconsistent. Route the **opponent** crest through `TeamCrest` so they get the monogram fallback. Leave the Cwmbran-side logo as-is (or also use `<TeamCrest name="Cwmbran Celtic" />`).

- [ ] **Step 1: Refactor FixtureCard**

In `src/components/fixtures/FixtureCard.tsx`: add `import TeamCrest from '@/components/teams/TeamCrest';`. Remove the now-unused `getOppositionByName`/`opponentData`/`opponentBadge` lines. Replace the opponent-badge block (the `{opponentBadge ? <Image…/> : <div…monogram…/>}`) with:
```tsx
        {/* Opponent badge */}
        <div className="flex-shrink-0">
          <TeamCrest name={opponent} size={40} />
        </div>
```
If `Image` is no longer used after this and the Cwmbran logo still uses it, keep the import; otherwise remove the unused `Image` import.

- [ ] **Step 2: Refactor ResultCard, LatestResult, UpcomingFixtures**

In each of `ResultCard.tsx`, `LatestResult.tsx`, `UpcomingFixtures.tsx`: add the `TeamCrest` import and replace their opponent crest block (the `getOppositionByName(...)?.badge` → `<Image>`/fallback pattern) with `<TeamCrest name={opponent} size={<existing size>} />`, preserving each file's existing wrapper markup and size. Remove now-unused `getOppositionByName`/`opponentBadge` locals and any now-unused `Image` import (keep `Image` if still used for the Cwmbran logo or elsewhere).

- [ ] **Step 3: Build + tsc**

Run: `npm run build` and `npx tsc --noEmit`
Expected: succeed, no unused-import errors (clean up any the build flags).

- [ ] **Step 4: Commit**

```bash
git add src/components/fixtures/FixtureCard.tsx src/components/fixtures/ResultCard.tsx src/components/home/LatestResult.tsx src/components/home/UpcomingFixtures.tsx
git commit -m "refactor: route opponent crests through TeamCrest (monogram fallback everywhere)"
```

---

### Task 8: Stale-league sweep — "JD Cymru South" → "Ardal League South East"

**Files (current-season references only):**
- Modify: `src/app/page.tsx`, `src/app/club/page.tsx`, `src/app/tickets/page.tsx`,
  `src/app/players/page.tsx`, `src/app/teams/page.tsx`, `src/app/teams/mens/page.tsx`,
  `src/app/fixtures/page.tsx`, `src/app/fans/potm/page.tsx`, `src/app/membership/page.tsx`,
  `src/app/programme/page.tsx`, `src/app/admin/programme/page.tsx`,
  `src/app/programme/[slug]/page.tsx`, `src/app/programme/[slug]/print/page.tsx`,
  `src/emails/NewsletterEmail.tsx`, `src/components/seo/JsonLd.tsx`,
  `src/components/ui/SearchModal.tsx`, `src/components/home/AllTeamsOverview.tsx`,
  `src/components/home/HeroSection.tsx`, `src/components/layout/Footer.tsx`,
  `src/components/fixtures/TeamSelector.tsx`, `src/components/programme-pdf/ProgrammePDF.tsx`,
  `src/components/programme/ProgrammePreview.tsx`
- **Do NOT touch (historical allow-list):** `src/data/club-history.ts`, `src/data/season-archives.ts`, `src/data/news-data.ts`, `src/data/gallery-data.ts`, `src/data/welsh-translations.ts`, and the past-tense narrative in `src/app/club/history/page.tsx` + `src/app/programme/[slug]/print/page.tsx` line ~625 ("achieving promotion to the Cymru South").

**Interfaces:** none — text/branding only.

- [ ] **Step 1: Enumerate current-season hits**

Run:
```bash
grep -rniE 'JD Cymru South|Cymru South' src/app src/components src/emails --include='*.ts' --include='*.tsx'
```
For each hit, decide: does the surrounding text describe the club's **current** league (change it) or its **history** (leave it)? The `club/history` narrative and the `print/page.tsx` "achieving promotion to the Cymru South" line are historical — leave them.

- [ ] **Step 2: Replace current-season references**

Change each current-season `"JD Cymru South"` to `"Ardal League South East"`. Prefer importing `MENS_LEAGUE_NAME` from `@/lib/site` in `.tsx`/`.ts` files where a string literal is being rendered dynamically (e.g. `HeroSection.tsx`'s `isLadies ? 'Genero Adran South' : MENS_LEAGUE_NAME`, `AllTeamsOverview.tsx`'s `league:` field, programme `competition:` defaults). For deep static PDF/print templates where a literal is clearer, a direct string replacement to `'Ardal League South East'` is fine. Leave the women's `'Genero Adran South'` value unchanged.

- [ ] **Step 3: Guard test**

Create `src/__tests__/no-stale-league.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('no current-season JD Cymru South references', () => {
  it('swept app/components/emails contain no "JD Cymru South"', () => {
    const out = execSync(
      `grep -rIl "JD Cymru South" src/app src/components src/emails || true`,
      { encoding: 'utf8' },
    ).trim();
    // Allow the historical narrative files only.
    const allowed = new Set([
      'src/app/club/history/page.tsx',
      'src/app/programme/[slug]/print/page.tsx',
    ]);
    const offenders = out.split('\n').filter(Boolean).filter(f => !allowed.has(f));
    expect(offenders, `stale refs in: ${offenders.join(', ')}`).toEqual([]);
  });
});
```

- [ ] **Step 4: Run the guard + full suite + build**

Run: `npm test` and `npm run build`
Expected: guard passes (only allow-listed historical files may still contain the phrase), full suite green, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: rebrand current-season league text to Ardal League South East"
```

---

### Task 9: End-to-end verification

**Files:** none (verification).

- [ ] **Step 1: Full suite + build**

Run: `npm test` then `npm run build`. Expected: all pass, build succeeds.

- [ ] **Step 2: Drive the pages**

Start `npm run dev`, then load and confirm:
- `/fixtures` — each fixture shows an opponent crest **or** a coloured monogram (no blanks); the page/league label reads "Ardal League South East", not "JD Cymru South".
- `/` (home) — league position widget shows a crest; upcoming fixtures show crests; no "JD Cymru South" text.
- `/teams/mens` — "Ardal League South East" in the header and "… Table" heading.
Note which opponents rendered a real crest vs a monogram. Shut the dev server down after.

- [ ] **Step 3: Commit any doc note**

If anything needs recording, update the fixtures README or a short note; otherwise no commit needed.

---

## Self-Review

- **Spec coverage:** TeamCrest component (Tasks 2-3) ✓; Ardal dataset exact-name-keyed (Task 4) ✓; crest sourcing + monogram fallback (Tasks 2,5) ✓; crests on league table + position (Task 6) + existing surfaces refactored (Task 7) ✓; stale-league sweep with historical allow-list (Task 8) ✓; league-name constant + registry `league` field driving `competition` (Task 1) ✓; women's out of scope, value preserved (Tasks 1,8) ✓.
- **Type/name consistency:** `MENS_LEAGUE_NAME` (Task 1) used in Tasks 4/8; `AwsTeam.league` (Task 1) consumed by the parser + Task 1 tests; `resolveTeamCrest`/`crestInitials`/`CrestResult` (Task 2) consumed by `TeamCrest` (Task 3) consumed by Tasks 6-7; `getOppositionByName` unchanged, keyed by exact feed names (Task 4) which Task 2's fallback and Task 5's `badge` rely on.
- **Placeholders:** none — the only deferred content is per-club crest availability (Task 5), explicitly best-effort with a guaranteed monogram fallback and logged coverage.
