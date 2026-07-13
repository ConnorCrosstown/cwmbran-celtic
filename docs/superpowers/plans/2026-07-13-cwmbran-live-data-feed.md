# Cwmbran Celtic Live-Data Feed — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose the existing Next.js allwalessport parsing as a cached JSON feed, and build a WordPress plugin that consumes it and renders fixtures/results/table (with crests) via shortcodes — so the live WordPress site auto-updates without changing hosts.

**Architecture:** The Next.js app (`cwmbran-celtic.vercel.app`) gains one `GET /api/feed` endpoint that returns `{ fixtures, results, tables, crests }` as JSON, reusing `fetchAllTeams()`. A standalone WordPress plugin (`cwmbran-celtic-feed`) fetches that JSON hourly, caches the last-good copy in a WordPress transient, and renders it through `[cc_fixtures]`, `[cc_results]`, `[cc_table]` shortcodes. WordPress is the site of record; Vercel is invisible plumbing; the WP cache guarantees the page never breaks if the feed is briefly unavailable.

**Tech Stack:** Next.js 16 (App Router), TypeScript 5.9, cheerio, vitest (feed side); PHP 7.4+ / WordPress plugin API, WP Transients + WP-Cron (WordPress side).

**Scope note:** This plan is **sub-project A** of the approved spec (`docs/superpowers/specs/2026-07-13-cwmbran-wordpress-redesign-design.md`). **Sub-project B** — the Divi full redesign, speed pass, WordPress/plugin security updates, staging build and one-clean-switch go-live — is largely manual admin/Divi work, is blocked on WordPress admin access, and gets its own runbook. It is **out of scope here.**

## Global Constraints

- Next.js `^16.2.6`, React `^19.2.6`, TypeScript `^5.9.3`, vitest `^3.2.7` — copied from `package.json`. Do not add dependencies.
- The feed side must **never throw to the caller**: `fetchTeamData`/`fetchAllTeams` already degrade to empty arrays on failure; the route preserves that (worst case: empty feed, HTTP 200).
- Women's team has `cid: 0` in `src/data/allwalessport-teams.ts` and is auto-skipped by `activeTeams()`. Do not hardcode a women's cid; it activates by editing that one file when the cid is sourced.
- Crest image `src` values from `resolveTeamCrest()` are **app-relative** (e.g. `/images/club-logo.webp`). The feed MUST rewrite them to **absolute URLs** against the app origin so WordPress can render them.
- Existing API routes under `src/app/api/**` must keep working — add a route, change none.
- WordPress plugin: no external PHP dependencies; standard WordPress functions only; must pass `php -l` (syntax lint). Real behaviour is validated on the **staging** site during sub-project B, not against production.

---

## File Structure

**Feed side (Next.js repo, `/Users/connorcupples/cwmbran-celtic`):**
- Create `src/lib/feed.ts` — pure payload builder: collect club names, absolutize crests, assemble `FeedPayload`. One responsibility: shape the JSON. No network.
- Create `src/app/api/feed/route.ts` — thin HTTP handler: call `fetchAllTeams()`, call `buildFeed()`, return JSON with cache + CORS headers.
- Create `src/lib/__tests__/feed.test.ts` — unit tests for `src/lib/feed.ts`.
- Create `src/app/api/feed/__tests__/route.test.ts` — route test with `fetchAllTeams` mocked.

**WordPress side (new, in the same repo under `wordpress-plugin/`):**
- Create `wordpress-plugin/cwmbran-celtic-feed/cwmbran-celtic-feed.php` — plugin bootstrap, constants, activation/deactivation (cron scheduling).
- Create `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-client.php` — fetch + transient cache + hourly refresh + manual refresh.
- Create `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-render.php` — pure PHP render helpers (fixtures/results/table/crest → HTML string).
- Create `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-shortcodes.php` — registers `[cc_fixtures]`, `[cc_results]`, `[cc_table]`.
- Create `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-admin.php` — settings page (feed URL), status readout, "Refresh now" button.
- Create `wordpress-plugin/cwmbran-celtic-feed/assets/ccf.css` — baseline styling (tuned to match the redesign during sub-project B).
- Create `wordpress-plugin/cwmbran-celtic-feed/readme.txt` — install/usage.

---

## Task 1: Feed payload builder (`src/lib/feed.ts`)

**Files:**
- Create: `src/lib/feed.ts`
- Test: `src/lib/__tests__/feed.test.ts`

**Interfaces:**
- Consumes: `Fixture`, `Result`, `LeagueTableRow` from `@/types`; `CrestResult`, `resolveTeamCrest` from `@/lib/team-crest`; `AWS_TEAMS`, `activeTeams`, `TeamKey` from `@/data/allwalessport-teams`.
- Produces:
  - `interface FeedPayload { generatedAt: number; teams: { key: TeamKey; label: string; league: string }[]; fixtures: Fixture[]; results: Result[]; tables: Record<string, LeagueTableRow[]>; crests: Record<string, CrestResult> }`
  - `collectClubNames(data: { fixtures: Fixture[]; results: Result[]; tables: Record<string, LeagueTableRow[]> }): string[]`
  - `absolutizeCrest(crest: CrestResult, origin: string): CrestResult`
  - `buildFeed(data: { fixtures: Fixture[]; results: Result[]; tables: Record<string, LeagueTableRow[]> }, origin: string, now: number): FeedPayload`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/__tests__/feed.test.ts
import { describe, it, expect } from 'vitest';
import { collectClubNames, absolutizeCrest, buildFeed } from '@/lib/feed';
import type { Fixture, Result, LeagueTableRow } from '@/types';

const fixtures: Fixture[] = [
  { matchId: 1, date: 100, time: '15:00', homeTeam: 'Cwmbran Celtic', awayTeam: 'Goytre AFC', competition: 'Ardal SE', venue: 'X', homeAway: 'H', team: 'mens' },
];
const results: Result[] = [
  { matchId: 2, date: 90, homeTeam: 'Trethomas Bluebirds', awayTeam: 'Cwmbran Celtic', homeScore: 1, awayScore: 2, competition: 'Ardal SE', scorers: '', attendance: 0, team: 'mens' },
];
const tables: Record<string, LeagueTableRow[]> = {
  mens: [{ position: 1, club: 'Cwmbran Celtic', played: 1, won: 1, drawn: 0, lost: 0, gd: 1, points: 3 }],
};
const data = { fixtures, results, tables };

describe('collectClubNames', () => {
  it('returns unique club names across fixtures, results and tables', () => {
    const names = collectClubNames(data).sort();
    expect(names).toEqual(['Cwmbran Celtic', 'Goytre AFC', 'Trethomas Bluebirds']);
  });
});

describe('absolutizeCrest', () => {
  it('prefixes app-relative image src with the origin', () => {
    const out = absolutizeCrest({ kind: 'image', src: '/images/club-logo.webp', alt: 'a' }, 'https://cwmbran-celtic.vercel.app');
    expect(out).toEqual({ kind: 'image', src: 'https://cwmbran-celtic.vercel.app/images/club-logo.webp', alt: 'a' });
  });
  it('leaves already-absolute src untouched', () => {
    const out = absolutizeCrest({ kind: 'image', src: 'https://cdn.example/x.png', alt: 'a' }, 'https://o');
    expect(out).toEqual({ kind: 'image', src: 'https://cdn.example/x.png', alt: 'a' });
  });
  it('passes monogram crests through unchanged', () => {
    const c = { kind: 'monogram' as const, initials: 'GA', hue: 120, alt: 'Goytre AFC' };
    expect(absolutizeCrest(c, 'https://o')).toEqual(c);
  });
});

describe('buildFeed', () => {
  it('assembles a payload with a crest per club name and absolutized image src', () => {
    const feed = buildFeed(data, 'https://cwmbran-celtic.vercel.app', 12345);
    expect(feed.generatedAt).toBe(12345);
    expect(feed.fixtures).toHaveLength(1);
    expect(feed.results).toHaveLength(1);
    expect(feed.tables.mens[0].club).toBe('Cwmbran Celtic');
    expect(Object.keys(feed.crests).sort()).toEqual(['Cwmbran Celtic', 'Goytre AFC', 'Trethomas Bluebirds']);
    const own = feed.crests['Cwmbran Celtic'];
    expect(own.kind).toBe('image');
    if (own.kind === 'image') expect(own.src.startsWith('https://cwmbran-celtic.vercel.app/')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/feed.test.ts`
Expected: FAIL — `feed.ts` does not exist / exports undefined.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/feed.ts
import 'server-only';
import type { Fixture, Result, LeagueTableRow } from '@/types';
import { resolveTeamCrest, type CrestResult } from '@/lib/team-crest';
import { activeTeams, AWS_TEAMS, type TeamKey } from '@/data/allwalessport-teams';

export interface FeedPayload {
  generatedAt: number;
  teams: { key: TeamKey; label: string; league: string }[];
  fixtures: Fixture[];
  results: Result[];
  tables: Record<string, LeagueTableRow[]>;
  crests: Record<string, CrestResult>;
}

type FeedData = { fixtures: Fixture[]; results: Result[]; tables: Record<string, LeagueTableRow[]> };

/** Every distinct club name that appears anywhere in the feed. */
export function collectClubNames(data: FeedData): string[] {
  const names = new Set<string>();
  for (const f of data.fixtures) { names.add(f.homeTeam); names.add(f.awayTeam); }
  for (const r of data.results) { names.add(r.homeTeam); names.add(r.awayTeam); }
  for (const rows of Object.values(data.tables)) for (const row of rows) names.add(row.club);
  return [...names];
}

/** Rewrite an app-relative crest image src to an absolute URL. Monograms and
 *  already-absolute srcs pass through unchanged. */
export function absolutizeCrest(crest: CrestResult, origin: string): CrestResult {
  if (crest.kind !== 'image') return crest;
  if (/^https?:\/\//i.test(crest.src)) return crest;
  const src = `${origin.replace(/\/$/, '')}/${crest.src.replace(/^\//, '')}`;
  return { ...crest, src };
}

/** Assemble the JSON payload WordPress consumes. Pure — no network. */
export function buildFeed(data: FeedData, origin: string, now: number): FeedPayload {
  const crests: Record<string, CrestResult> = {};
  for (const name of collectClubNames(data)) {
    crests[name] = absolutizeCrest(resolveTeamCrest(name), origin);
  }
  const active = activeTeams();
  const teams = active.map(t => {
    const meta = AWS_TEAMS.find(x => x.key === t.key)!;
    return { key: meta.key, label: meta.label, league: meta.league };
  });
  return { generatedAt: now, teams, fixtures: data.fixtures, results: data.results, tables: data.tables, crests };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/feed.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/feed.ts src/lib/__tests__/feed.test.ts
git commit -m "feat(feed): pure JSON payload builder with crest resolution"
```

---

## Task 2: Feed HTTP route (`src/app/api/feed/route.ts`)

**Files:**
- Create: `src/app/api/feed/route.ts`
- Test: `src/app/api/feed/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `fetchAllTeams` from `@/lib/allwalessport` (signature `(fetchImpl?) => Promise<{ fixtures; results; tables }>`), `buildFeed` from `@/lib/feed`.
- Produces: `GET(request: Request): Promise<Response>` returning `FeedPayload` JSON. Sets `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` and `Access-Control-Allow-Origin: *` (feed is public read-only data).

- [ ] **Step 1: Write the failing test**

```ts
// src/app/api/feed/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/allwalessport', () => ({
  fetchAllTeams: vi.fn(async () => ({
    fixtures: [{ matchId: 1, date: 100, time: '15:00', homeTeam: 'Cwmbran Celtic', awayTeam: 'Goytre AFC', competition: 'Ardal SE', venue: 'X', homeAway: 'H', team: 'mens' }],
    results: [],
    tables: { mens: [] },
  })),
}));

import { GET } from '@/app/api/feed/route';

describe('GET /api/feed', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns feed JSON with fixtures and cache headers', async () => {
    const res = await GET(new Request('https://cwmbran-celtic.vercel.app/api/feed'));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toContain('s-maxage=3600');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const body = await res.json();
    expect(body.fixtures).toHaveLength(1);
    expect(body.crests['Goytre AFC']).toBeTruthy();
    expect(typeof body.generatedAt).toBe('number');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/feed/__tests__/route.test.ts`
Expected: FAIL — route module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/app/api/feed/route.ts
import { fetchAllTeams } from '@/lib/allwalessport';
import { buildFeed } from '@/lib/feed';

// Revalidate the underlying fetch hourly; SWR keeps the last good copy warm.
export const revalidate = 3600;

export async function GET(request: Request): Promise<Response> {
  const origin = new URL(request.url).origin;
  const data = await fetchAllTeams(); // already degrades to empty arrays on error
  const feed = buildFeed(data, origin, Date.now());
  return new Response(JSON.stringify(feed), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/feed/__tests__/route.test.ts`
Expected: PASS.

- [ ] **Step 5: Full test + build sanity**

Run: `npx vitest run && npm run build`
Expected: all tests PASS; build succeeds with `/api/feed` listed as a route.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/feed/route.ts src/app/api/feed/__tests__/route.test.ts
git commit -m "feat(feed): GET /api/feed endpoint returning cached JSON feed"
```

---

## Task 3: WordPress plugin — bootstrap + feed client with cache

**Files:**
- Create: `wordpress-plugin/cwmbran-celtic-feed/cwmbran-celtic-feed.php`
- Create: `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-client.php`

**Interfaces:**
- Produces (used by later tasks):
  - `CCF_Client::get_feed(): array` — returns the cached decoded feed (associative array) or `[]` if never fetched.
  - `CCF_Client::refresh(): bool` — fetches the feed URL, stores it in transient `ccf_feed_cache` and option `ccf_last_fetch` (timestamp) / `ccf_last_error` (string|''); returns success. On HTTP/JSON failure it keeps the previous cache (never wipes good data).
  - Option `ccf_feed_url` (string) — the `/api/feed` URL; read by the client.
  - Cron hook `ccf_hourly_refresh` scheduled hourly on activation, cleared on deactivation.

- [ ] **Step 1: Write the plugin bootstrap**

```php
<?php
// wordpress-plugin/cwmbran-celtic-feed/cwmbran-celtic-feed.php
/**
 * Plugin Name: Cwmbran Celtic Live Feed
 * Description: Pulls fixtures, results and league table from the Cwmbran Celtic data feed and renders them via shortcodes.
 * Version: 1.0.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) exit;

define('CCF_DIR', plugin_dir_path(__FILE__));
define('CCF_URL', plugin_dir_url(__FILE__));

require_once CCF_DIR . 'includes/class-ccf-client.php';
require_once CCF_DIR . 'includes/class-ccf-render.php';
require_once CCF_DIR . 'includes/class-ccf-shortcodes.php';
require_once CCF_DIR . 'includes/class-ccf-admin.php';

// Hourly cron -> refresh cache.
add_action('ccf_hourly_refresh', ['CCF_Client', 'refresh']);

register_activation_hook(__FILE__, function () {
    if (!wp_next_scheduled('ccf_hourly_refresh')) {
        wp_schedule_event(time() + 60, 'hourly', 'ccf_hourly_refresh');
    }
});
register_deactivation_hook(__FILE__, function () {
    wp_clear_scheduled_hook('ccf_hourly_refresh');
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('ccf', CCF_URL . 'assets/ccf.css', [], '1.0.0');
});

CCF_Shortcodes::register();
CCF_Admin::register();
```

- [ ] **Step 2: Write the feed client**

```php
<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-client.php
if (!defined('ABSPATH')) exit;

class CCF_Client {
    const CACHE_KEY = 'ccf_feed_cache';

    /** Decoded cached feed, or [] if none. */
    public static function get_feed(): array {
        $cached = get_transient(self::CACHE_KEY);
        return is_array($cached) ? $cached : [];
    }

    public static function feed_url(): string {
        return trim((string) get_option('ccf_feed_url', ''));
    }

    /** Fetch the feed URL; on success replace the cache, on failure keep it. */
    public static function refresh(): bool {
        $url = self::feed_url();
        if ($url === '') {
            update_option('ccf_last_error', 'Feed URL is not set.');
            return false;
        }
        $resp = wp_remote_get($url, ['timeout' => 15, 'headers' => ['Accept' => 'application/json']]);
        if (is_wp_error($resp)) {
            update_option('ccf_last_error', $resp->get_error_message());
            return false;
        }
        $code = wp_remote_retrieve_response_code($resp);
        if ($code !== 200) {
            update_option('ccf_last_error', "HTTP $code from feed.");
            return false;
        }
        $data = json_decode(wp_remote_retrieve_body($resp), true);
        if (!is_array($data) || !isset($data['fixtures'])) {
            update_option('ccf_last_error', 'Feed response was not valid JSON.');
            return false;
        }
        // Store for 26h so a missed cron still serves last-good until the next run.
        set_transient(self::CACHE_KEY, $data, 26 * HOUR_IN_SECONDS);
        update_option('ccf_last_fetch', time());
        update_option('ccf_last_error', '');
        return true;
    }
}
```

- [ ] **Step 3: Syntax-lint both PHP files**

Run: `php -l wordpress-plugin/cwmbran-celtic-feed/cwmbran-celtic-feed.php && php -l wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-client.php`
Expected: `No syntax errors detected` for both. (If `php` is not installed locally, install via `brew install php` or defer this lint to staging.)

- [ ] **Step 4: Commit**

```bash
git add wordpress-plugin/cwmbran-celtic-feed/cwmbran-celtic-feed.php wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-client.php
git commit -m "feat(wp-plugin): bootstrap + feed client with transient cache and hourly cron"
```

---

## Task 4: WordPress plugin — render helpers + shortcodes

**Files:**
- Create: `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-render.php`
- Create: `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-shortcodes.php`
- Create: `wordpress-plugin/cwmbran-celtic-feed/assets/ccf.css`

**Interfaces:**
- Consumes: `CCF_Client::get_feed()`.
- Produces: shortcodes `[cc_fixtures team="mens"]`, `[cc_results team="mens"]`, `[cc_table team="mens"]`. `team` defaults to `mens`; unknown/empty data renders nothing (section self-hides). All output escaped with `esc_html`/`esc_url`/`esc_attr`.

- [ ] **Step 1: Write the render helpers**

```php
<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-render.php
if (!defined('ABSPATH')) exit;

class CCF_Render {
    /** Crest HTML from the feed's crests map, keyed by exact club name. */
    public static function crest(array $feed, string $name, int $size = 40): string {
        $c = $feed['crests'][$name] ?? null;
        $style = "width:{$size}px;height:{$size}px";
        if (is_array($c) && ($c['kind'] ?? '') === 'image') {
            return '<img class="ccf-crest" style="' . esc_attr($style) . '" src="' . esc_url($c['src']) . '" alt="' . esc_attr($c['alt'] ?? $name) . '" loading="lazy" />';
        }
        if (is_array($c) && ($c['kind'] ?? '') === 'monogram') {
            $hue = (int) ($c['hue'] ?? 0);
            $bg = "hsl($hue,55%,42%)";
            return '<span class="ccf-crest ccf-monogram" style="' . esc_attr($style . ";background:$bg") . '">' . esc_html($c['initials'] ?? '') . '</span>';
        }
        return '<span class="ccf-crest ccf-monogram" style="' . esc_attr($style) . '">' . esc_html(mb_substr($name, 0, 2)) . '</span>';
    }

    private static function team_items(array $list, string $team): array {
        return array_values(array_filter($list, fn($x) => ($x['team'] ?? 'mens') === $team));
    }

    public static function fixtures(array $feed, string $team): string {
        if (empty($feed['fixtures'])) return '';
        $items = self::team_items($feed['fixtures'], $team);
        if (!$items) return '';
        $out = '<ul class="ccf-list ccf-fixtures">';
        foreach ($items as $f) {
            $date = date_i18n('D j M', (int) round(((int) $f['date']) / 1000));
            $out .= '<li class="ccf-row">'
                . '<span class="ccf-date">' . esc_html($date . ' · ' . ($f['time'] ?? '')) . '</span>'
                . '<span class="ccf-team">' . self::crest($feed, $f['homeTeam']) . esc_html($f['homeTeam']) . '</span>'
                . '<span class="ccf-vs">v</span>'
                . '<span class="ccf-team">' . self::crest($feed, $f['awayTeam']) . esc_html($f['awayTeam']) . '</span>'
                . '<span class="ccf-comp">' . esc_html($f['competition'] ?? '') . '</span>'
                . '</li>';
        }
        return $out . '</ul>';
    }

    public static function results(array $feed, string $team): string {
        if (empty($feed['results'])) return '';
        $items = self::team_items($feed['results'], $team);
        if (!$items) return '';
        $out = '<ul class="ccf-list ccf-results">';
        foreach ($items as $r) {
            $date = date_i18n('D j M', (int) round(((int) $r['date']) / 1000));
            $score = (int) $r['homeScore'] . '–' . (int) $r['awayScore'];
            $out .= '<li class="ccf-row">'
                . '<span class="ccf-date">' . esc_html($date) . '</span>'
                . '<span class="ccf-team">' . self::crest($feed, $r['homeTeam']) . esc_html($r['homeTeam']) . '</span>'
                . '<span class="ccf-score">' . esc_html($score) . '</span>'
                . '<span class="ccf-team">' . self::crest($feed, $r['awayTeam']) . esc_html($r['awayTeam']) . '</span>'
                . '</li>';
        }
        return $out . '</ul>';
    }

    public static function table(array $feed, string $team): string {
        $rows = $feed['tables'][$team] ?? [];
        if (!$rows) return '';
        $out = '<table class="ccf-table"><thead><tr>'
            . '<th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>'
            . '</tr></thead><tbody>';
        foreach ($rows as $row) {
            $own = (strpos((string) $row['club'], 'Cwmbran Celtic') !== false) ? ' class="ccf-own"' : '';
            $out .= "<tr$own>"
                . '<td>' . (int) $row['position'] . '</td>'
                . '<td class="ccf-club">' . self::crest($feed, $row['club'], 24) . esc_html($row['club']) . '</td>'
                . '<td>' . (int) $row['played'] . '</td>'
                . '<td>' . (int) $row['won'] . '</td>'
                . '<td>' . (int) $row['drawn'] . '</td>'
                . '<td>' . (int) $row['lost'] . '</td>'
                . '<td>' . (int) $row['gd'] . '</td>'
                . '<td><strong>' . (int) $row['points'] . '</strong></td>'
                . '</tr>';
        }
        return $out . '</tbody></table>';
    }
}
```

- [ ] **Step 2: Write the shortcodes**

```php
<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-shortcodes.php
if (!defined('ABSPATH')) exit;

class CCF_Shortcodes {
    public static function register(): void {
        add_shortcode('cc_fixtures', [__CLASS__, 'fixtures']);
        add_shortcode('cc_results', [__CLASS__, 'results']);
        add_shortcode('cc_table', [__CLASS__, 'table']);
    }

    private static function team(array $atts): string {
        $a = shortcode_atts(['team' => 'mens'], $atts);
        return sanitize_key($a['team']);
    }

    public static function fixtures($atts): string {
        return '<div class="ccf">' . CCF_Render::fixtures(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
    public static function results($atts): string {
        return '<div class="ccf">' . CCF_Render::results(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
    public static function table($atts): string {
        return '<div class="ccf">' . CCF_Render::table(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
}
```

- [ ] **Step 3: Write baseline CSS**

```css
/* wordpress-plugin/cwmbran-celtic-feed/assets/ccf.css
   Baseline layout only. Colours/spacing are tuned to match the redesign in sub-project B. */
.ccf-list { list-style: none; margin: 0; padding: 0; }
.ccf-row { display: grid; grid-template-columns: auto 1fr auto 1fr auto; align-items: center; gap: .5rem; padding: .6rem .4rem; border-bottom: 1px solid rgba(0,0,0,.08); }
.ccf-team { display: inline-flex; align-items: center; gap: .4rem; }
.ccf-crest { border-radius: 50%; object-fit: cover; display: inline-block; flex: none; }
.ccf-monogram { display: inline-flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: .7rem; background: #556; }
.ccf-score { font-weight: 700; }
.ccf-table { width: 100%; border-collapse: collapse; }
.ccf-table th, .ccf-table td { padding: .45rem .5rem; text-align: center; border-bottom: 1px solid rgba(0,0,0,.08); }
.ccf-table .ccf-club { text-align: left; display: flex; align-items: center; gap: .4rem; }
.ccf-table .ccf-own { background: rgba(0,120,60,.10); font-weight: 600; }
@media (max-width: 600px) { .ccf-row { grid-template-columns: 1fr auto 1fr; } .ccf-date, .ccf-comp { grid-column: 1 / -1; opacity: .7; font-size: .8rem; } }
```

- [ ] **Step 4: Syntax-lint the new PHP**

Run: `php -l wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-render.php && php -l wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-shortcodes.php`
Expected: `No syntax errors detected` for both.

- [ ] **Step 5: Commit**

```bash
git add wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-render.php wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-shortcodes.php wordpress-plugin/cwmbran-celtic-feed/assets/ccf.css
git commit -m "feat(wp-plugin): render helpers, shortcodes and baseline CSS"
```

---

## Task 5: WordPress plugin — admin settings, status + manual refresh

**Files:**
- Create: `wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-admin.php`
- Create: `wordpress-plugin/cwmbran-celtic-feed/readme.txt`

**Interfaces:**
- Consumes: `CCF_Client::refresh()`, `CCF_Client::feed_url()`; options `ccf_feed_url`, `ccf_last_fetch`, `ccf_last_error`.
- Produces: a Settings → "Cwmbran Feed" page with a feed-URL field, a "Refresh now" button, and a status line (last fetch time / last error). No new interfaces consumed by other tasks.

- [ ] **Step 1: Write the admin page**

```php
<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-admin.php
if (!defined('ABSPATH')) exit;

class CCF_Admin {
    public static function register(): void {
        add_action('admin_menu', [__CLASS__, 'menu']);
        add_action('admin_init', [__CLASS__, 'settings']);
        add_action('admin_post_ccf_refresh', [__CLASS__, 'handle_refresh']);
    }

    public static function menu(): void {
        add_options_page('Cwmbran Feed', 'Cwmbran Feed', 'manage_options', 'ccf', [__CLASS__, 'page']);
    }

    public static function settings(): void {
        register_setting('ccf', 'ccf_feed_url', ['sanitize_callback' => 'esc_url_raw']);
    }

    public static function handle_refresh(): void {
        if (!current_user_can('manage_options')) wp_die('Nope');
        check_admin_referer('ccf_refresh');
        CCF_Client::refresh();
        wp_safe_redirect(admin_url('options-general.php?page=ccf&refreshed=1'));
        exit;
    }

    public static function page(): void {
        $last = (int) get_option('ccf_last_fetch', 0);
        $err = (string) get_option('ccf_last_error', '');
        echo '<div class="wrap"><h1>Cwmbran Celtic Live Feed</h1>';
        echo '<form method="post" action="options.php">';
        settings_fields('ccf');
        echo '<table class="form-table"><tr><th>Feed URL</th><td>';
        echo '<input type="url" name="ccf_feed_url" class="regular-text" value="' . esc_attr(get_option('ccf_feed_url', '')) . '" placeholder="https://cwmbran-celtic.vercel.app/api/feed" />';
        echo '</td></tr></table>';
        submit_button('Save');
        echo '</form>';

        echo '<hr /><h2>Status</h2><p>';
        echo $last ? 'Last successful fetch: ' . esc_html(date_i18n('j M Y H:i', $last)) : 'No successful fetch yet.';
        if ($err !== '') echo '<br /><strong style="color:#b32d2e">Last error:</strong> ' . esc_html($err);
        echo '</p>';

        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
        echo '<input type="hidden" name="action" value="ccf_refresh" />';
        wp_nonce_field('ccf_refresh');
        submit_button('Refresh now', 'secondary');
        echo '</form></div>';
    }
}
```

- [ ] **Step 2: Write the readme**

```
// wordpress-plugin/cwmbran-celtic-feed/readme.txt
=== Cwmbran Celtic Live Feed ===

Pulls fixtures, results and the league table from the Cwmbran Celtic data feed
(https://cwmbran-celtic.vercel.app/api/feed) and renders them via shortcodes.

Install:
1. Zip the `cwmbran-celtic-feed` folder and upload via Plugins > Add New > Upload, then Activate.
2. Settings > Cwmbran Feed: paste the feed URL, Save, then "Refresh now".

Shortcodes:
- [cc_fixtures team="mens"]  upcoming fixtures
- [cc_results team="mens"]   recent results
- [cc_table team="mens"]     league table

`team` accepts "mens" (and "ladies" once the women's feed cid is live). Data
refreshes hourly via WP-Cron; use "Refresh now" on match days.
```

- [ ] **Step 3: Syntax-lint**

Run: `php -l wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-admin.php`
Expected: `No syntax errors detected`.

- [ ] **Step 4: Commit**

```bash
git add wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-admin.php wordpress-plugin/cwmbran-celtic-feed/readme.txt
git commit -m "feat(wp-plugin): admin settings page with status and manual refresh"
```

---

## Task 6: Staging integration + smoke test (deferred to admin access)

**Depends on:** WordPress admin access + staging site (sub-project B, task 1). This task is the hand-off point where the feed goes live end-to-end. No code — a checklist executed on staging.

- [ ] **Step 1: Deploy the feed endpoint**

Deploy the Next.js app so `/api/feed` is live. Verify:
Run: `curl -sS https://cwmbran-celtic.vercel.app/api/feed | head -c 400`
Expected: JSON containing `fixtures`, `results`, `tables`, `crests`, `generatedAt`.

- [ ] **Step 2: Install the plugin on staging**

Zip `wordpress-plugin/cwmbran-celtic-feed`, upload + activate on the **staging** WordPress site. Settings → Cwmbran Feed → paste feed URL → Save → "Refresh now". Confirm status shows a successful fetch and no error.

- [ ] **Step 3: Place shortcodes and verify render**

Add `[cc_fixtures]`, `[cc_results]`, `[cc_table]` to a staging page. Confirm on desktop + mobile: fixtures/results/table render, crests show (image or monogram fallback), Cwmbran's own row is highlighted.

- [ ] **Step 4: Verify graceful degradation**

Temporarily set an invalid feed URL and "Refresh now": the page must still show the last-good data (not error). Restore the correct URL. Confirm women's shortcode (`team="ladies"`) renders nothing while its cid is 0.

- [ ] **Step 5: Confirm auto-refresh**

Confirm `ccf_hourly_refresh` is scheduled (e.g. WP Crontrol plugin or `wp cron event list`). Note: this task completes as part of sub-project B go-live.

---

## Self-Review

**Spec coverage (sub-project A scope):**
- Vercel JSON feed endpoint → Tasks 1–2 ✓
- WordPress plugin: hourly fetch + cache → Task 3 ✓; shortcodes `[cc_fixtures]/[cc_results]/[cc_table]` → Task 4 ✓; render styled markup + crests with monogram fallback → Task 4 ✓; admin "Refresh now" + status → Task 5 ✓
- Men's + women's same pipeline, women's activates via cid → honored (Global Constraints; `team` attr; Task 6 Step 4) ✓
- Graceful degradation to last cache; empty sections self-hide → Task 3 (keep-on-failure) + Task 4 (empty returns '') + Task 6 Step 4 ✓
- Crest src absolutized for cross-origin use → Task 1 `absolutizeCrest` ✓
- Redesign / speed / security / staging / go-live → explicitly **sub-project B**, own runbook ✓ (not a gap)

**Placeholder scan:** No TBD/TODO in code steps; every code step shows complete code. Task 6 is intentionally a manual checklist gated on access, not placeholder code.

**Type consistency:** `FeedPayload` fields (`fixtures/results/tables/crests/generatedAt/teams`) are produced in Task 1 and consumed identically by the route test (Task 2) and the PHP render/client (Tasks 3–4: `$feed['fixtures']`, `$feed['tables'][$team]`, `$feed['crests'][$name]`). `CrestResult` `kind: 'image'|'monogram'` matches the PHP `($c['kind'] ?? '')` checks. `activeTeams()`/`AWS_TEAMS`/`fetchAllTeams` signatures match the real source read during planning.
