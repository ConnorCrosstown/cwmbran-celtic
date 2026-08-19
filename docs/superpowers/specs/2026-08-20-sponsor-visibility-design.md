# Sponsor visibility — design

**Date:** 2026-08-20
**Theme:** `wordpress-theme/cwmbran-celtic-2025` (the live cwmbranceltic.com site)
**Status:** design agreed, not built

## The problem

The club has eighteen sponsors and five more waiting to go on. They are shown in
exactly two places — a three-column wall on the home page and the same wall again
on `/sponsors` — plus a one-logo strip in the footer. Every sponsor gets the same
tile whatever they paid, the wall is already eight rows deep at eighteen and will
be worse at twenty-three, and a sponsor visiting the site sees their logo once, in
a grey grid of logos, below the fold.

Two things follow from that. The club has nothing to say at renewal beyond "your
logo is on the website", and it has no new inventory to sell — every sponsor is
buying the same undifferentiated tile.

## Goals

1. Put sponsors on every page of the site, not two of them.
2. Show a different sponsor on every page load, so a season ticket holder browsing
   the site sees the whole roster rather than the same logo forever.
3. Create named, sellable slots on the pages that matter — news and match reports.
4. Give the club a number to quote at renewal.
5. Add the five new sponsors, and list Music Venue Trust as a charity partner
   rather than a paying sponsor.

## Non-goals

- **Sponsor tiering.** The sponsorship page sells Platinum/Gold/Silver/Board and
  the sponsor data has no tier field. Adding one is a real improvement and is
  deliberately not in this piece of work — it changes what every existing sponsor
  is shown as, which is a commercial decision, not a technical one.
- **Sponsors on the share/OG cards.** The 36 cards in `assets/img/share/` are
  static 1200x630 JPGs. Baking a sponsor into them means regenerating all 36, a
  fresh theme zip, and a Facebook re-scrape per URL — and the sponsor is then
  frozen into the image, so it neither rotates nor comes off when they leave.
- **Impression counting.** See "What is not measured" below.
- **Per-sponsor profile pages, supporters' offers.** Considered, not chosen.

## Data model

`inc/sponsors.php` today returns positional rows — `array(name, file, url)` — from
`cc25_sponsors()`, with the main sponsor separate in `cc25_sponsor_main()`.

Rows become keyed arrays:

```php
array('name' => 'Airbond', 'slug' => 'airbond', 'file' => 'airbond.png',
      'url' => 'https://...', 'dark' => false)
```

- `slug` is the `/go/<slug>` click-tracking key. It is stable and never reused —
  a slug that changes silently detaches a sponsor from their click history.
- `dark` marks a sponsor whose banner is white-on-black. `.sponsor-card` and the
  footer logo tile are both `background:#fff`, so MVT and Range After Care would
  render as black bricks against every other sponsor's white tile. Dark sponsors
  get a navy tile instead.

`cc25_sponsors()` gains four of the five new rows — Airbond, GMB Union, PC
Wannell and Range After Care — taking the paid roster from eighteen to twenty-two.
Music Venue Trust is the fifth and goes in `cc25_charity_partners()` below.
Callers that index positionally (`$s[0]`, `$s[1]`, `$s[2]`) are updated: the
home page, `template-sponsors.php`, and `cc25_featured_sponsor_html()`.

### Charity partners

Music Venue Trust is not a paying sponsor — the Music Shirts launch gave 10% to
MVT. A new `cc25_charity_partners()` returns partners in the same row shape, and
they are:

- shown on `/sponsors` under their own "Charity Partner" heading, below the paid
  wall, with wording that says supported-by rather than sponsored-by;
- **excluded from the rotation**, the band, the ticker and the named slots. Paid
  sponsors are not diluted by a partner the club supports rather than the other
  way round.

## Rotation

The rotation runs **client-side**, in `assets/premium.js` (already enqueued on
every page, cache-busted by file mtime).

This is the crux of the design, so the reasoning is worth recording. The obvious
implementation is `mt_rand` in PHP. `inc/sponsors.php` used to do exactly that and
was deliberately changed to a deterministic daily rotation, because under
full-page caching PHP-side random does not produce random — the first visitor's
roll is baked into the cached HTML and served to everyone until the cache expires.
It looks random in development and is frozen in production.

So:

- PHP renders **all twenty-two sponsors** into the band markup as real anchors.
- CSS shows a window of six.
- JS picks a random start offset on load, then advances the window every 7
  seconds.

Three things fall out of it. The rotation is genuinely random per visitor and
immune to any caching layer. A single page view shows fifteen to twenty sponsors
instead of one. And every sponsor holds a real, crawlable link on every page of
the site — an SEO benefit the club can describe at renewal, which a JS-injected
logo would not provide.

Image weight: only the visible window carries a real `src`; the rest carry
`data-src`, swapped in as they rotate, all `loading="lazy"`. With no JS the first
six render normally and do not rotate.

`cc25_featured_sponsor()`'s daily-offset rotation is kept for any server-rendered
single-sponsor slot (the ticker), because that one is not a caching problem — it
is meant to be the same all day.

## Placements

| Where | File | What |
|---|---|---|
| Every page | `template-parts/site-footer.php` | The band. Replaces the existing one-logo `cc25_featured_sponsor_html('strip')`. |
| News posts | `single.php` | Named block under the article. |
| Match reports | `template-match-report.php` | Named block under the report body. |
| Header ticker | `inc/sponsors.php` (`cc25_ticker_items`) | One `★ Brought to you by X` item after every fifth fixture. |

The band is **suppressed on the home page and `/sponsors`**, where the full wall
already renders — otherwise those two pages show sponsors twice within a screen
of each other.

Match reports are the club's most-shared pages and carry the most valuable slot on
the site.

## Named slots

The news and match-report blocks resolve their sponsor in this order:

1. an explicit sponsor set for that post or match — "Sponsored by X";
2. otherwise the rotation — "Brought to you by X".

So a slot can be sold to one sponsor for a specific match or story, and never
looks empty when it is not sold.

Explicit sponsors are set two ways, matching how the two systems already store
things:

- **Posts** — a Sponsor dropdown added to the existing match-report meta box
  (`cc25_mr_metabox` in `inc/match-reports.php`), saved as post meta
  `_cc25_sponsor`. The box exists; this is one more field in it, not new admin
  furniture.
- **Static match records** — an optional `'sponsor' => '<slug>'` key on rows in
  `cc25_season_matches_static()`.

An explicit slug that no longer matches a sponsor falls back to the rotation
rather than rendering a broken block — sponsors leave, and old match reports
should not break when they do.

## Click tracking

A `/go/<slug>` rewrite rule resolves the slug to a sponsor, increments a counter,
and 302s to their website.

- Counts are stored per sponsor per month in a **non-autoloaded** option
  (`cc25_sponsor_clicks`), shaped `slug => array('2026-08' => 12, ...)`. Monthly
  granularity is what a renewal conversation needs, and keeps the option small.
- `nocache_headers()` on the redirect, so no caching layer serves one sponsor's
  redirect to another sponsor's link.
- Obvious bot user-agents are not counted.
- Unknown slugs 404 rather than redirecting anywhere — an open redirect is not
  acceptable, and the slug list is the whitelist.
- **Rewrite flush.** The theme has no rewrite rules today, so this is the first.
  Without a flush every sponsor link 404s. The flush is version-gated — a stored
  theme-version option compared on `init`, flushed once when it changes — not run
  on every load.

All sponsor links across the site point at `/go/<slug>`, keeping `rel="sponsored"`
and `target="_blank"` as they do now.

A **Tools → Sponsor clicks** admin page lists clicks per sponsor per month, plus a
season total.

### What is not measured

Clicks are measured. **Impressions are not**, and the design does not pretend
otherwise: on a fully cached site a server-side impression counter under-reports
by whatever proportion of views the cache serves, and the club would be quoting a
number that is wrong in an unknown direction. If the club wants "appeared on
40,000 page views", that figure comes from analytics, not from here.

## Testing

`_tests/sponsors-test.php`, following the existing `_tests/wf-data-test.php`
pattern:

- every roster row has a banner file that exists on disk (the failure that
  produces a broken image on every page of the site);
- slugs are unique and URL-safe;
- `/go/` resolves each slug to that sponsor's URL, and an unknown slug 404s;
- an explicit named-slot sponsor wins over the rotation, and an explicit slug that
  matches nothing falls back to the rotation rather than rendering empty;
- charity partners never appear in the band, ticker or named slots;
- the rotation window contains no duplicates.

The JS rotation itself is covered by a `_tests/` node test in the style of
`reader-order-test.js`: a random offset always yields a full window, and the
window advances without repeating within one cycle.

## Rollout

1. Connor supplies the five website URLs and saves the five banners into
   `assets/img/sponsor-banners/` at 1058x282, matching the existing files.
2. Bump the theme version in `style.css`. CSS and JS cache-bust by file mtime
   already, so no manual asset versioning is needed.
3. Connor uploads a dated theme zip, as with every other theme release.
4. **After upload, confirm one `/go/` link redirects** — if the rewrite flush did
   not run, every sponsor link on the site 404s, and that is a worse state than
   before this work.

## Open items

Needed before step 1, and blocking nothing else:

- Website URLs for Airbond, GMB Union, PC Wannell, Range After Care, and Music
  Venue Trust.
- The five banner files at 1058x282.
