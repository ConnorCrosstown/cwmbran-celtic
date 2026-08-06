# Splash: next home game alongside the Music Shirts

**Date:** 2026-08-07
**Theme:** `wordpress-theme/cwmbran-celtic-2025`
**Branch:** `feat/splash-next-home-game` (stacks on `fix/new-inn-kickoff-time`, which is not yet merged)

## Problem

The homepage takeover is an `if/elseif` chain in `front-page.php:16–25`:

```
launch → countdown → result celebration → next home game
```

The Music Shirts launch went live on 30 July and sits at the top of that chain, so
for as long as it runs the next-home-game splash never renders at all. Two things
follow: the fixture gets no billing on the homepage, and the bold "It's Matchday!"
takeover stays buried even on the morning of a home game.

## Design

### 1. Matchday leapfrogs the shirts

Hoist the matchday test above the chain and gate only the two Music Shirts branches
on it:

```php
$cc25_hg = cc25_next_home_fixture($feed, $team);
$cc25_md = cc25_is_matchday($cc25_hg);

if     ($cc25_kllive && !$cc25_md):              // shirts + fixture strip
elseif (cc25_kit_launch_countdown() && !$cc25_md):
elseif ($cc25_cel):                              // result celebration — unchanged
elseif ($cc25_hg):                               // next home game / "It's Matchday!"
```

The gate is deliberately narrow. Only the shirts branches learn about matchday, so
the result celebration keeps the precedence it has today and no other state moves.

The matchday test is currently inlined at `front-page.php:102`. Extracting it into
`cc25_is_matchday()` means the rule is defined once rather than in the two places
that now need it.

`cc25_is_matchday()` resolves "today" in `Europe/London` rather than via WordPress's
`date_i18n()`. That matches the convention the kick-off code already sets — see the
`cc25_kickoff_overrides()` docblock, "All times are UK local (Europe/London)" — and it
keeps the helper testable from the CLI, where no WordPress is loaded. A null or
date-less fixture returns `false`.

### 2. The fixture strip

A compact `.splash-next` block inside `.splash-launch-body`, below the shirt CTAs:

```
│ [See the shirts] [Pre-order]  │
│ ╭─────────────────────────╮ │
│ │ NEXT HOME · SAT 16 AUG   │ │
│ │ ⚽ Celtic  vs  ⚽ Taffs Well│ │
│ │      [Buy Ticket]        │ │
│ ╰─────────────────────────╯ │
│        Maybe later           │
```

This reuses the markup and styling already proven in the result splash
(`front-page.php:87–92`, `style.css:976–980`) — eyebrow line with date and kick-off,
both crests, opponent name — and adds a `btn-ghost btn-sm` ticket link.

Shirts stay the hero; the fixture is a supporting strip. The whole block is wrapped
in `if ($cc25_hg)`, so once the season's home fixtures run out the launch splash
renders exactly as it does now.

`$cc25_hg` and `$cc25_hgo` are already computed above the chain, so the strip needs
no new feed access.

### 3. CSS

Spacing for `.splash-next` inside the launch card, and the ticket button, near
`style.css:1311`. `.splash-next` itself is reused unchanged.

## Testing

`cc25_is_matchday()` gets assertions in `_tests/kickoff-test.php` (CLI PHP, already
set up with stubs and a `ko_fx()` fixture builder): a fixture dated today is
matchday, one dated tomorrow is not, one dated yesterday is not, and `null` is not.

Rendering is verified by eye across three states — shirts with the strip, matchday,
and no home fixture remaining.

## Out of scope

The result celebration's own `.splash-next` block is left alone. Retiring the Music
Shirts launch remains a `cc25_kit_launch()` config change, unaffected by this work.

## Release

Theme version bumps 0.3.1 → 0.3.2 so the deploy is verifiable.
