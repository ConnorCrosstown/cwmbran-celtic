# Walking Football section — design

**Date:** 2026-08-03
**Theme:** `wordpress-theme/cwmbran-celtic-2025`
**Status:** Approved, ready for planning

## Problem

Cwmbran Celtic's walking football section runs its own site at
<https://cwmbrancelticwalkingfootball.co.uk/> with a lot of good material — a
dated club story, seven weekly sessions, prices, a social inclusion statement
and sponsorship tiers. None of it appears on the main club site, and walking
football is missing from the Teams hub and the All Teams nav dropdown.

The section keeps its own site updated. Anything copied into the theme is a
snapshot that only changes when someone edits PHP and redeploys.

## Approach

A rich standalone page for content that changes rarely, signposting out for
content that changes often.

- **Rendered on the club site:** what walking football is, who can play,
  session times, prices, the club story timeline, social inclusion.
- **Linked out to their site:** fixtures, photo gallery, sponsorship tiers.

Their fixtures list currently shows July dates, which is exactly the staleness
this split avoids. Sponsorship links out for a second reason: the club site
already sells its own sponsorship packages and runs the Celtic Bond, and two
competing price lists on one domain would confuse a business trying to work out
who it is paying.

## Page structure

One template, `template-walking-football.php`, following the
`template-vets.php` / `template-juniors.php` pattern: `site-header` → sections →
`site-footer`. Not sub-pages — the source site's eight pages are individually
short and would read as thin if split across eight WP pages.

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | `phero` block, ghost text `WALKING`, breadcrumb Home / Teams / Walking Football |
| 2 | What it is & who can play | No-running explainer; audience; benefits list; "first played in 2011" fun fact |
| 3 | Session times | Seven session cards + venue address once + map link |
| 4 | Prices | Three price lines; Bond line cross-linked to the club's Celtic Bond page |
| 5 | Our story | Dated vertical timeline, Jan 2024 → Nov/Dec 2025 |
| 6 | More than just football | Values, health & wellbeing, commitment to equality |
| 7 | Fixtures & gallery | Two signpost cards linking to their site |
| 8 | Get involved | Tap-to-call, WhatsApp, Facebook, short sponsorship note linking out |

Two testimonials run as pull-quotes — one against the story section, one against
inclusion.

## Content

### Sessions

All at Llantarnam Community Primary School, James Prosser Way, Llantarnam,
Cwmbran, NP44 3XB.

| Session | Day | Time |
|---------|-----|------|
| Men's Under 50s | Thursday | 7:00pm |
| Men's Over 50s | Thursday | 7:00pm |
| Men's Over 60s | Thursday | 7:00pm |
| Men's Social | Wednesday | 4:00pm |
| Women's Competitive (Over 35s) | Friday | 6:00pm |
| Women's Social (all ages) | Friday | 6:00pm |
| Mixed (all ages) | Sunday | 9:00am |

### Prices

- Social — £6.00 per month
- Competitive only — £10.00 per month
- Cwmbran Celtic Bond (all players) — £10.00 per month

### Timeline

| When | Milestone |
|------|-----------|
| Jan 2024 | A small group of men decide to bring football back into their lives |
| Apr 2024 | Women's group launched |
| Jun 2024 | Women's first friendly, against Caldicot |
| Sep 2024 | First Fun Day |
| Sep 2024 | Women's team joins its first competitive league |
| Nov 2024 | Sponsorship and grants secured for tracksuits and training kits |
| Mar 2025 | Men's 50s team formed |
| Apr 2025 | First anniversary — 100 members |
| May 2025 | Women's team wins its first league campaign |
| Aug 2025 | First walking football tournament hosted — 300 players |
| Sep 2025 | First social mixed tournament for non-league players |
| Nov/Dec 2025 | Tri-national tournament — Wales, Ireland and England |

### Who can play

Aimed at 50+, people recovering from injury, people managing health conditions,
and anyone who prefers a gentler pace — regardless of age or gender.

Benefits: fitness, balance and cardiovascular health without the strain of
running; friendships and community; a welcoming, inclusive atmosphere; keeping
lifelong football fans connected to the game.

### Social inclusion

Football should be accessible to everyone regardless of age, background,
ability, fitness level or financial circumstances.

Values: everyone is welcome; newcomers are encouraged; social connection matters
as much as competition.

Health and wellbeing: physical fitness, mental wellbeing, healthy ageing,
community engagement, reducing loneliness and isolation.

Commitment: treating all members fairly and with respect; promoting equality,
diversity and inclusion; challenging discrimination in all its forms.

### Sponsorship note (summary only)

Sponsorship funds pitch hire, equipment and kit, competition fees, insurance and
medical cover, community activities, and help for new members. Tiers and prices
link out to their sponsorship page.

### Contact

- Phone: 07919323520 (tap-to-call)
- WhatsApp: link from their contact page
- Facebook: <https://www.facebook.com/p/Cwmbran-Celtic-Walking-Football-Club-61573941128119/>

## Data & wiring

Content lives in `functions.php` as data functions, mirroring
`cc25_junior_teams()`, so future edits are one line in an array rather than
surgery on markup:

- `cc25_wf_sessions()` — label, day, time per session
- `cc25_wf_timeline()` — date and milestone per row
- `cc25_wf_links()` — every outbound URL in one place (site home, session times,
  sponsorship, photo gallery, Facebook, WhatsApp, phone)

Three wiring touch points:

1. `cc25_walking_football_url()` beside `cc25_vets_url()` in `functions.php`,
   resolving slug candidates `walking-football` / `walkingfootball` with a
   teams-hub fallback.
2. A sixth card in `$cc25_hub` in `template-teams.php:12` — name "Walking
   Football", sub "Men's, Women's & Mixed · All ages welcome", CTA "View
   section", no Fixtures button (not in the feed, same as Vets). The sub-label
   avoids an age range because the sessions span Under 50s through Over 60s
   plus two all-ages sessions.
3. A sixth child under **All Teams** in `cc25_nav_items()`, after Juniors &
   Minis.

Styling reuses existing classes — `phero`, `band`, `wrap`, `sec-head`, card
grids, `cta`, `reveal`. New CSS is limited to the timeline.

## Error handling & edge cases

- `cc25_walking_football_url()` falls back to the Teams hub if the WP page is
  absent, so the hub card and nav item never dead-link.
- Outbound links get `rel="noopener"` and open in a new tab, matching how
  `cc25_ext_url()` links are treated elsewhere.
- Phone renders as a `tel:` link with whitespace stripped, as in
  `template-juniors.php`.
- If the section's site goes down, only the signpost cards degrade — every
  rendered section stays intact.

## Testing

Manual, matching how the rest of the theme is verified — there is no PHP test
harness in this theme:

- Page renders at its slug with header, footer and all eight sections.
- Teams hub shows six cards; the Walking Football card links to the page.
- All Teams dropdown shows Walking Football and it links to the page.
- Every outbound link resolves (not 404).
- Mobile: session and timeline layouts hold at 390px; hamburger menu shows the
  new item.
- Fallback: with no WP page present, the hub card and nav item point at the
  Teams hub rather than dead-linking.

## To confirm before publishing

Building with these as stated; Connor to verify:

1. **Nick Beckett** named as Chair/Founder. Publicly named on their site — confirm
   he is happy to appear on the club site.
2. **07919323520** published as the public contact number.
3. **Prices** — £6 social / £10 competitive / £10 Bond — still current.
4. **Testimonial attribution.** Their mission page credits "Our Arrie" against
   "means the world to me... finding who I am again"; the second is credited to
   Emma. Confirm both are quoted and attributed correctly, or run them
   unattributed.

## Note on their domain

Their pages print the site address as `cwmbrancelticwalkingfootballclub.co.uk`,
but the site resolves at `cwmbrancelticwalkingfootball.co.uk` — no "club". All
links use the resolving domain.

## Out of scope

- Copying fixtures or the photo gallery into the theme.
- Adding walking football to the allwalessport feed or the fixtures page tabs —
  they are not in that feed.
- Any change to the club's own sponsorship or Celtic Bond pages.
