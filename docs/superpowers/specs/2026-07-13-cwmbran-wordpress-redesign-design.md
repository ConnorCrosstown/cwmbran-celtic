# Cwmbran Celtic — WordPress Redesign + Live Data Feed

**Date:** 2026-07-13
**Status:** Design approved, ready for implementation planning

## Goal

Bring the live WordPress site `cwmbranceltic.com` into much better shape — a full
visual redesign, faster load, and up-to-date/secure WordPress — **without changing
hosts or migrating platforms**, while giving it the same **auto-updating fixtures,
results and league table** the existing Vercel rebuild has.

The site stays on WordPress. The existing Next.js app (`cwmbran-celtic.vercel.app`)
is repurposed as an invisible backend data feed — not a replacement site.

## Current state

**Live site — `cwmbranceltic.com`:**
- WordPress **6.4.8** (out of date — a live security risk), **Divi** theme,
  **WooCommerce** (shop), **SportsPress** (fixtures/results/table), WP Event
  Manager, sliders, galleries, MonsterInsights, cookie-consent.
- Served through BunnyCDN. Homepage is ~380 KB of HTML plus heavy sliders/images.
- We have the WordPress **admin login**. Origin host TBC (sits behind BunnyCDN).

**Vercel rebuild — `cwmbran-celtic.vercel.app` (repo: `/Users/connorcupples/cwmbran-celtic`):**
- Next.js app that fetches and parses the allwalessport league page
  (`football.aspx?cid=20149`, Ardal SE) into fixtures, results and table, with
  opponent crests (15/15 + monogram fallback) and match formatting.
- Core logic lives in `src/lib/allwalessport.ts`, `src/lib/comet.ts`,
  `src/lib/allwalessport-parse.ts`; already has tests.

## Decisions made (with the user)

| Question | Decision |
|---|---|
| Which site to improve | **Keep & improve the live WordPress site in place** (no host change) |
| Design ambition | **Full redesign** |
| Visual direction | **Match the Vercel rebuild** |
| Live data to auto-update | Men's fixtures & results, league table, opponent crests, **and women's** (women's blocked on sourcing its feed `cid`) |
| Data mechanism | **Option ①** — Vercel app as an invisible JSON data feed |
| Go-live | **One clean switch** after full approval on staging, with backup + rollback |

## Architecture & data flow

```
allwalessport (football.aspx?cid=…)
        │  (parsed by existing Next.js code)
        ▼
Vercel app  ──►  NEW /api/feed endpoint  ──►  clean JSON
        │            { fixtures, results, table, crests }
        ▼
WordPress plugin  ──►  fetches JSON hourly, caches last-good copy in WP
        │                (visitors never wait on / hit Vercel directly)
        ▼
Shortcodes in Divi  ──►  [cc_fixtures] [cc_results] [cc_table]
        │
        ▼
Fixture cards / league table, styled to match the Vercel look
```

**Principles:**
- **WordPress is the site of record.** Vercel is invisible plumbing; no visitor
  hits it directly.
- **Cache = safety.** WordPress stores the last-good feed. If Vercel is slow or
  down, the page shows the most recent data — never an error or a spinner.
- **Automatic hourly refresh**, plus a manual "refresh now" button in WP admin for
  match days.
- **Men's and women's share one pipeline**, differing only by `cid`. Women's
  activates once its feed ID is sourced; until then that section hides itself.

## Components

### 1. Vercel JSON feed endpoint (in the existing Next.js repo)
- New route (e.g. `/api/feed`) that returns `{ fixtures, results, table, crests }`
  as JSON, reusing the existing parsing/crest logic.
- Parameterised by team/`cid` so men's and women's use the same code.
- Tested: unit tests for the endpoint shape + reuse of existing parser tests, so a
  change to the allwalessport page can't silently break the feed.

### 2. WordPress plugin (`cwmbran-celtic-feed`)
- Fetches the JSON on an **hourly schedule**, stores a cached copy in WordPress
  (transient/option), and serves that cache to visitors.
- Registers shortcodes: `[cc_fixtures]`, `[cc_results]`, `[cc_table]` (with
  attributes for team = men's/women's).
- Renders fixture cards / table markup **styled to match the redesign** (not
  SportsPress's markup).
- Admin: a **"Refresh now"** button; a status readout (last successful fetch).
- Graceful degradation: on feed failure, serve last cache; if no data at all,
  hide the section.

### 3. Divi full redesign (Theme Builder)
Rebuild the look using **Divi Theme Builder**, porting the Vercel design.
WooCommerce, SportsPress and existing content keep working underneath — reskin,
not rebuild.
- **Global header & footer** (nav, crest, sponsor strip, socials) — one rebuild,
  site-wide.
- **Homepage** — hero, next-fixture / latest-result cards, league-table snippet,
  latest news, sponsors — matching the Vercel layout.
- **Fixtures & results page** — full list + table, driven by the live feed.
- **News/blog templates** — list + single-post.
- **Key content pages** (About, Club, Contact, etc.) — restyled.
- **Shop** — WooCommerce pages restyled, kept functional.

### 4. Speed & security (folded into the rebuild)
- Compress images, trim sliders, reduce what Divi loads → smaller/faster homepage,
  better mobile + Google ranking.
- Update **WordPress core 6.4.8 → current** and all plugins, **on staging first**
  to catch breakage safely; ships as part of go-live.

## Build & go-live strategy

1. **Build on a staging copy** (private clone). Confirm whether the host provides
   staging when we're in; if not, provision one or use Divi unpublished drafts.
2. **User reviews each part on staging** — real pages, real live data, mobile +
   desktop.
3. **One clean switch** to go live once the whole site is approved.
4. **Full backup captured right before the switch**, for instant rollback.

## Error handling & testing

- Vercel feed endpoint: unit-tested; existing parser tests retained.
- WordPress: always degrades to last cached data; empty/unavailable sections hide
  themselves rather than erroring.
- **Pre-go-live checklist on staging:** every template on mobile + desktop; shop
  checkout works; contact forms work; fixtures/results/table/crests display
  correctly; WordPress + plugin updates haven't broken anything.
- Backup + rollback verified before switch.

## Open items / dependencies

- **Women's league feed `cid`** — must be sourced before women's fixtures can turn
  on. Mechanism is built generically so it's a one-line config once known.
- **Origin host / staging availability** — confirm when logged in; determines
  staging approach.
- **Domain/CDN (BunnyCDN)** — confirm cache-purge step is in the go-live runbook so
  the new site isn't masked by stale CDN cache.

## Out of scope (for now)

- Migrating hosts or replacing WordPress with the Next.js site.
- Rebuilding site content from scratch (we reskin existing content).
- New functionality beyond the live-data feed and the redesign.
