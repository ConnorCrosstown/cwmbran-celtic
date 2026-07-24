# Next Home Game — Homepage Takeover

**Date:** 2026-07-24
**Scope:** `wordpress-theme/cwmbran-celtic-2025` (WordPress child theme)
**Goal:** Promote the next **home** fixture and drive matchday + season ticket sales via a dismissible full-screen homepage overlay.

## Behaviour

- **Where:** homepage only (`front-page.php`).
- **When shown:** only if there is an upcoming **home** fixture in the feed. No home game → the overlay is not rendered at all (no empty/"dead" promo, no season-ticket-only fallback — decided against).
- **Frequency:** once per home game, per visitor. On dismiss, set a `localStorage` flag keyed to the fixture (`cc25splash_hg-<date-ms>`). It won't re-show for that fixture; the next home game has a new key and re-triggers.
- **Appearance timing:** ~500ms after load (0ms if `prefers-reduced-motion`).
- **Dismiss:** X button, backdrop click, `Maybe later` link, or `Esc`.

## Content

- Eyebrow: "Next home game · Motazone Arena"
- Cwmbran Celtic (crest) **vs** Opponent (crest, from feed)
- Date · kick-off time · venue
- Live countdown to kick-off (days/hrs/mins/secs)
- CTAs: **Buy Matchday Ticket** (gold) + **Season Ticket** (outline) → Gigantic links (`cc25_ext_url('tickets')`)

## Components

- **`cc25_next_home_fixture($feed, $team)`** (functions.php) — first upcoming fixture with `homeAway === 'H'`; `null` if none. Built on existing `cc25_upcoming()`.
- **Overlay markup** (front-page.php) — rendered only when a home fixture exists; `hidden` by default; carries `data-key` (fixture date) + `data-ko` (countdown target).
- **Overlay behaviour** (premium.js) — storage check, open/close, countdown, focus trap, Esc, reduced-motion.
- **Styles** (style.css) — `.splash*` navy blurred backdrop + card, gold accents, full-screen on mobile; season-ticket button overridden for visibility on navy.

## Accessibility

`role="dialog"` + `aria-modal="true"` + `aria-labelledby`; focus moves to the close button on open and is trapped within the dialog; `Esc` closes and returns focus to the previously focused element; body scroll locked while open; animation suppressed under `prefers-reduced-motion`. Degrades safely if `localStorage` throws (shows once, no error).

## Non-goals / assumptions

- Shows for the next home game regardless of how far away (countdown carries urgency; no date-window gating).
- Homepage only, not site-wide.
- Matchday and season CTAs use the same Gigantic promoter link the rest of the site uses (can diverge later if a dedicated season-ticket URL exists).
