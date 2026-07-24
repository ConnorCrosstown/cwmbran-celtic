# Cwmbran Celtic Match-Day Programme Builder — Design

**Date:** 2026-07-24
**Status:** Approved (design), pending implementation plan
**Repo:** `/Users/connorcupples/cwmbran-celtic` (Next.js, Vercel)

## Problem

The match-day programme is currently hand-built each match in Microsoft Publisher
(`~/Downloads/2026.07.28 Cwmbran Town.pub`, ~20 pages). It is slow, tied to one
person's desktop, and duplicates data that already lives in the website's live
feed. We want a builder that auto-pulls the match-day info from the site's
existing tools and is simple enough for the whole team to update.

## Current state (what already exists)

- A scaffolded programme builder: `/admin/programme` (form + preview),
  `/api/programme/pdf` and `/admin/programme/pdf` (`@react-pdf/renderer`),
  public `/programme/[slug]` + `/programme/[slug]/print`.
- Components: `programme/ProgrammePreview.tsx`, `programme/CoverPage.tsx`,
  `programme-pdf/ProgrammePDF.tsx`.
- **Gaps:** the builder is wired to **static mock data** (`data/mock-data.ts`,
  `data/opposition-data.ts`) and persists to **`localStorage`** — so a programme
  only exists in the browser of whoever created it; nothing is shared.
- A working live feed: `lib/allwalessport.ts` (fixtures, results, league table
  via scrape), `lib/feed.ts`, `lib/team-crest.ts`, `lib/comet.ts`.
- A staff-auth scaffold in `lib/auth.ts` (bcrypt, staff accounts) — needs to be
  actually enforced on the admin routes.

## Goal

One saved **Programme** record per match drives **both** outputs (a digital web
programme and a print-ready PDF that replaces the Publisher document). The team's
per-match work shrinks to three things — **line-ups, manager's notes/team news,
match officials** — because everything else is auto-pulled from the feed or set
up once as reusable data.

## Architecture

### Storage (approach A — full Vercel stack)

- **Vercel KV** (Upstash Redis via Vercel Marketplace) for structured records.
- **Vercel Blob** for uploaded images (player photos, cover/action shots).
- Opponent crests continue to come from the existing feed crest logic
  (`lib/team-crest.ts`), not Blob.
- Requires a one-time provisioning step in the Vercel dashboard (enable KV +
  Blob, set env vars). Documented click-by-click at build time.

### Data model (KV record types)

1. **Squad player** — `squadNo`, `firstName`, `lastName`, `position`,
   `photoUrl` (Blob), `penPicture` (short text). Maintained on a squad admin page.
2. **Opposition profile** — keyed per club: `name`, `nickname`, `ground`,
   `founded`, `colours`, `briefHistory`, `squad` (list), `headToHead`. Written
   **once per club**, reused every fixture against them.
3. **Programme** — one per match: auto-filled match core (opponent, date,
   kickoff, competition, matchday number, league table snapshot, recent results,
   upcoming fixtures) + the three manual fields (line-ups, notes/team news,
   officials) + `status` (`draft`/`published`) + `slug`.
4. **Static content** — club officials, club history, honours, contact/HQ info,
   and the sponsor advert pages. Edited once in a Settings area; untouched
   week-to-week.

### Auto-fill from the live feed

A **next-match resolver** reads the existing `allwalessport` feed to find the
upcoming fixture and pre-fills opponent, date, kickoff, and competition, plus
snapshots the **current league table, recent results & form, and upcoming
fixtures list** into the programme record. The opponent profile is pulled from
the Opposition library. Net effect: a new programme opens ~80% filled in.

### Builder flow (the team's per-match task)

1. Log into `/admin` → **"New programme for next match"** (feed pre-fills match core).
2. Pick **starting XI, subs, captain** from the squad (tap-to-select).
3. Type **manager's notes / team news**.
4. Enter **match officials**.
5. Preview → **Publish** → web page live + PDF downloadable.

### Outputs

- **Web programme** — mobile-friendly public page per match (shareable link),
  rendered from the saved record.
- **Print PDF** — existing `@react-pdf/renderer` pipeline fed from the same
  record; layout replaces the Publisher document: cover, line-ups, league table,
  form/results, fixtures, opponent profile, club officials/history/honours,
  sponsor adverts.

Both outputs render from the **same** Programme record — no double entry.

## Sections included in the programme

- **Match core** (AUTO): cover, line-ups page, league table, recent results &
  form, upcoming fixtures.
- **Opponent profile** (LIBRARY, written once per club): brief history + squad.
- **Club static pages** (STATIC template, set up once): officials, history,
  honours, contact/HQ.
- **Sponsor adverts** (STATIC template, set up once): Avondale, J.W. Stockwell,
  Celtic Bond 100-club, etc.

## Auth, migration, testing

- Enforce the existing staff auth (`lib/auth.ts`) on the admin/builder routes.
- Migrate the builder **off `localStorage`** onto shared KV.
- Tests: feed→auto-fill field mapping, next-match resolver, KV read/write round
  trip, and web + PDF render from a fixture Programme record.

## Build order (phased)

1. **Foundation** — provision KV + Blob; data model + KV access layer; squad
   admin page; move the builder off `localStorage` onto shared storage.
2. **Auto-fill** — next-match resolver + feed→builder wiring (match core, table,
   results, fixtures).
3. **Content** — opposition library + static-content Settings editor.
4. **Outputs** — web programme page + PDF generated from the saved record.

## Out of scope (YAGNI)

- Per-match match-sponsor entry (sponsors handled as static template; not a
  per-match field). Revisit only if the team asks.
- Automatic opponent history/squad scraping — the opposition library is written
  by hand once per club and reused.
- Public-facing editing; all editing is behind `/admin` staff auth.

## Provisioning note

Build time requires ~15 min in the Vercel dashboard: enable Vercel KV and Vercel
Blob for the project and copy the env vars. Exact steps provided when Phase 1
starts.
