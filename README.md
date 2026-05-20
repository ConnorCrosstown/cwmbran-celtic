# Cwmbran Celtic AFC — Website

Official website of [Cwmbran Celtic AFC](https://cwmbran-celtic.vercel.app), a Welsh football club competing in the JD Cymru South (Men's) and Genero Adran South (Women's).

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**, deployed on **Vercel**.

## Stack

| Area | Tool |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind v4 |
| Email | [Resend](https://resend.com) + `@react-email/components` |
| Live data | [FAW Comet](https://www.faw.cymru) (planned), SofaScore via [Apify](https://apify.com) |
| Auth | Custom localStorage staff gate (interim — see audit) |
| Rich text | TipTap |
| PDF | `@react-pdf/renderer` |
| Hosting | Vercel |

## Quick start

```bash
# 1. Install deps (Puppeteer was removed — no Chromium download needed)
npm install

# 2. Copy env and fill in any keys you have
cp .env.example .env.local

# 3. Dev server (Turbopack)
npm run dev

# 4. Production build
npm run build && npm start
```

## Environment variables

See [`.env.example`](.env.example) for the full list. The site renders without any keys set — it falls back to mock data — but live functionality requires:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL, used in `sitemap.xml`, OG tags and JSON-LD. Defaults to the Vercel preview URL.
- `COMET_API_KEY_*` — FAW Comet API for fixtures/results/standings ([request access](https://kb.analyticom.de/comet/api-access-to-comet-data)).
- `RESEND_API_KEY` + `NEWSLETTER_STAFF_SECRET` — newsletter send.
- `APIFY_API_TOKEN` + `APIFY_WEBHOOK_SECRET` — SofaScore scrape pipeline.
- `AUTH_SECRET` — reserved for the proper auth migration (see audit P0-6).

**Never** prefix server-only secrets with `NEXT_PUBLIC_` — that inlines them into the browser bundle.

## Scripts

```bash
npm run dev     # Turbopack dev server
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # next lint
```

## Project layout

```
src/
  app/                Next.js App Router routes (pages + api/*)
    api/              Server endpoints (newsletter, sofascore, programme PDF…)
    admin/            Staff-only admin UI (currently client-gated only)
  components/         Reusable UI
    home/             Sections used by /
    banners/          Promo banners (Celtic Bond, Gift Ticket, etc.)
    layout/           Header, Footer, Navigation, ThemeToggle
    seo/              JsonLd structured-data emitter
  lib/                Helpers (auth, csrf, comet, sofascore, validation, site)
  data/               Hardcoded mock data + structural constants
  emails/             React Email templates
  contexts/           React contexts (ThemeProvider)
  types/              Shared TS types
public/               Static assets, manifest, icons, sponsor logos, player photos
scripts/              One-off data scrape / import scripts
```

## Audit & known issues

A full launch-readiness audit was performed on **2026-05-20** — see [`AUDIT-2026-05-20.md`](AUDIT-2026-05-20.md). The most urgent open items are:

- **P0-1**: canonical domain (`cwmbranceltic.com`) currently 403s — repoint DNS or commit to the `vercel.app` host.
- **P0-2**: homepage data falls back to mock data from January (Comet keys not provisioned).
- **P0-4**: Match Day pricing on `/tickets` (£7.50/£5/FREE Men's, £3.50/£2.50/FREE Women's) disagrees with the `/` Visit block and Footer summary (£5/£3/FREE). Sources are tagged with `TODO(audit ...)` comments in `src/data/mock-data.ts`.
- **P0-6**: `/admin/*` is gated client-side only. Stash a proper server-side session gate (middleware + httpOnly cookie) before treating it as private.

This branch (`feat/audit-2026-05-20`) addresses the audit items that don't need a product decision — full list in the PR description / commit message.

## Deploy

This project deploys automatically to Vercel on push to `main`. Preview deployments are created for every branch.

The Vercel project name is `cwmbran-celtic`. Production URL: <https://cwmbran-celtic.vercel.app>.

## License

This repository is the property of Cwmbran Celtic AFC. All rights reserved. See [`LICENSE`](LICENSE).
