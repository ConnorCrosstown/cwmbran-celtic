# Sponsor Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a randomly-rotating sponsor band on every page of cwmbranceltic.com, add named sellable sponsor slots to news and match reports, track sponsor clicks, and take the roster from eighteen paid sponsors to twenty-two plus one charity partner.

**Architecture:** Sponsor rows in `inc/sponsors.php` become keyed arrays carrying a stable `slug` and a `dark` flag. All sponsors are rendered into the page as real anchors; a small ES module picks a random six-logo window per page load and cycles it, because PHP-side random does not survive full-page caching. Sponsor links point at `/go/<slug>`, a rewrite rule that counts the click and redirects.

**Tech Stack:** WordPress child theme of Divi, PHP 7.4+ (no framework), vanilla ES modules, CLI test scripts run with `php` and `node`. No build step — files ship as written.

**Spec:** `docs/superpowers/specs/2026-08-20-sponsor-visibility-design.md`

## Global Constraints

- Theme root for every path in this plan: `wordpress-theme/cwmbran-celtic-2025/`. All commands run from that directory unless stated.
- Branch: `feat/sponsor-visibility`.
- **Never create a `.mjs` file, and never reference one.** The live host serves `.mjs` as `text/plain` and browsers refuse it. `_tests/module-assets-test.php` fails the build if one appears. ES modules use `.js`.
- Sponsor banners live in `assets/img/sponsor-banners/` and are **1058x282**. `cc25_sponsor_logo()` hardcodes `width="1058" height="282"`.
- Escape all output: `esc_url()`, `esc_attr()`, `esc_html()`. Existing code does this consistently; match it.
- PHP tests follow `_tests/wf-data-test.php`: guard with `if (PHP_SAPI !== 'cli') exit;`, stub `add_action`/`add_filter`, define `ABSPATH`, require `../functions.php`, use the `check()` helper, `exit(1)` on failure.
- Node tests follow `_tests/reader-order-test.js`: import the pure module from `../assets/`, use the `check()` helper, exit non-zero on failure.
- **Slugs are permanent.** A slug is a sponsor's click-history key; changing one silently detaches them from their own numbers.
- CSS and JS cache-bust by file mtime (`functions.php:19-21`) — never add a hardcoded asset version.
- Commit after every task with the theme's existing message style: `feat(theme): ...` / `fix(theme): ...` / `test(theme): ...`, lower case, describing the effect not the mechanism.

---

### Task 1: Sponsor rows become keyed, with slugs and a dark flag

Today's rows are positional — `array('Gigantic', 'gigantic.jpg', 'https://...')` — read as `$s[0]`, `$s[1]`, `$s[2]` in three places. Everything later in this plan needs a stable slug per sponsor and a way to know that a banner is white-on-black.

**Files:**
- Modify: `inc/sponsors.php` (rows in `cc25_sponsors()`, `cc25_sponsor_main()`, and `cc25_featured_sponsor_html()`)
- Modify: `front-page.php:556-564`
- Modify: `template-sponsors.php:16-33`
- Test: `_tests/sponsors-test.php` (create)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `cc25_sponsors(): array` — list of rows, each `array('name' => string, 'slug' => string, 'file' => string, 'url' => string, 'dark' => bool)`
  - `cc25_sponsor_main(): array` — one row, same keys
  - `cc25_sponsor_by_slug(string $slug): ?array` — the row with that slug (searching the paid roster **and** the main sponsor), or `null`

- [ ] **Step 1: Write the failing test**

Create `_tests/sponsors-test.php`:

```php
<?php
/**
 * Assertions over the sponsor data and its rendering. Run from the theme root:
 *   php _tests/sponsors-test.php
 * functions.php loads standalone with these no-op stubs; WordPress never loads
 * this file.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {}
function add_filter() {}
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

$root = dirname(__DIR__);
$all  = array_merge(array(cc25_sponsor_main()), cc25_sponsors());

/* ---- Row shape ------------------------------------------------------- */
check('every sponsor row has name, slug, file, url and dark', count(array_filter($all, function ($r) {
    return isset($r['name'], $r['slug'], $r['file'], $r['url'], $r['dark'])
        && $r['name'] !== '' && $r['slug'] !== '' && $r['file'] !== '';
})) === count($all));

/* ---- Slugs are the click-tracking key, so they must be unique and safe -- */
$slugs = array_column($all, 'slug');
check('slugs are unique', count(array_unique($slugs)) === count($slugs));
check('slugs are url-safe', count(array_filter($slugs, function ($s) {
    return (bool) preg_match('/^[a-z0-9-]+$/', $s);
})) === count($slugs));

/* ---- A missing banner is a broken image on every page of the site ----- */
$missing = array();
foreach ($all as $r) {
    if (!is_file($root . '/assets/img/sponsor-banners/' . $r['file'])) $missing[] = $r['file'];
}
check('every sponsor banner exists on disk' . ($missing ? ' (missing: ' . implode(', ', $missing) . ')' : ''), !$missing);

/* ---- Lookup by slug -------------------------------------------------- */
check('a known slug resolves to its sponsor', cc25_sponsor_by_slug('gigantic')['name'] === 'Gigantic');
check('the main sponsor resolves by slug', cc25_sponsor_by_slug('motazone')['name'] === 'Motazone');
check('an unknown slug resolves to null', cc25_sponsor_by_slug('no-such-sponsor') === null);
check('an empty slug resolves to null', cc25_sponsor_by_slug('') === null);

echo "\n";
if ($failures) { echo count($failures) . " FAILED\n"; exit(1); }
echo "all passed\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php _tests/sponsors-test.php`
Expected: FAIL — fatal error, `Call to undefined function cc25_sponsor_by_slug()`.

- [ ] **Step 3: Rewrite the rows in `inc/sponsors.php`**

Replace `cc25_sponsor_main()` and `cc25_sponsors()` with keyed rows. Keep the file/name/url values exactly as they are today — only the shape changes, plus the new `slug` and `dark`:

```php
function cc25_sponsor_main() {
    return array('name' => 'Motazone', 'slug' => 'motazone', 'file' => '_main-motazone.jpg',
                 'url' => 'https://motazone.net/', 'dark' => false);
}

/* Each row: name, slug, banner file, website URL, and whether the banner is
 * white-on-black. A blank URL renders the logo un-linked (used where a sponsor
 * has no confirmed website). A dark banner gets a navy tile instead of the
 * default white one, so it doesn't read as a black brick in the wall.
 * SLUGS ARE PERMANENT — they key the click counts in inc/sponsor-clicks.php. */
function cc25_sponsors() {
    $rows = array(
        array('Gigantic', 'gigantic', 'gigantic.jpg', 'https://www.gigantic.com/'),
        array('Crosstown Concerts', 'crosstown-concerts', 'crosstown-concerts.jpg', 'https://www.crosstownconcerts.com/'),
        array("Dudley's Aluminium", 'dudleys', 'dudleys.jpg', 'https://www.dudleys.uk.com/'),
        array('Coaltown', 'coaltown', 'coaltown.jpg', 'https://www.coaltowncoffee.co.uk/'),
        array('SERi', 'seri', 'seri.jpg', ''),
        array('Diverse Vinyl', 'diverse-vinyl', 'diverse-vinyl.jpg', 'https://www.diversevinyl.com/'),
        array('Country Connect', 'country-connect', 'country-connect.jpg', 'https://www.country-connect.co.uk/'),
        array('Hornbeam', 'hornbeam', 'hornbeam.jpg', ''),
        array('Hydro Group', 'hydro-group', 'hydro-group.jpg', ''),
        array('CRE', 'cre', 'cre.jpg', ''),
        array('TOR Sports', 'tor-sports', 'tor.jpg', 'https://www.tor-sports.co.uk/'),
        array('Avondale Vehicle Hire', 'avondale-vehicle-hire', 'avondale-vehicle-hire.png', 'https://www.avondalehire.co.uk/'),
        array('Coffiology', 'coffiology', 'coffiology.png', 'https://coffiology.com/'),
        array('Coleg Gwent', 'coleg-gwent', 'coleg-gwent.png', 'https://www.coleggwent.ac.uk/'),
        array('JW Stockwell', 'jw-stockwell', 'jw-stockwell.png', ''),
        array('Peter Villars', 'peter-villars', 'peter-villars.png', 'https://www.facebook.com/p/Peter-Villars-Sportsground-Maintenance-100063177401237/'),
        array('Blitz Media', 'blitz-media', 'blitz-media.jpg', 'https://www.blitzmedia.co.uk/'),
        array('Le Pub', 'le-pub', 'le-pub.jpg', 'https://www.lepublicspace.co.uk/'),
    );
    $out = array();
    foreach ($rows as $r) {
        $out[] = array('name' => $r[0], 'slug' => $r[1], 'file' => $r[2], 'url' => $r[3], 'dark' => false);
    }
    return $out;
}

/** The sponsor with this slug, or null. Searches the paid roster and the main
 *  sponsor — not charity partners, who are never click-tracked. */
function cc25_sponsor_by_slug($slug) {
    if ($slug === '' || $slug === null) return null;
    foreach (array_merge(array(cc25_sponsor_main()), cc25_sponsors()) as $r) {
        if ($r['slug'] === $slug) return $r;
    }
    return null;
}
```

- [ ] **Step 4: Update the three positional call sites**

In `inc/sponsors.php`, `cc25_featured_sponsor_html()` reads `$s[0]`, `$s[1]`, `$s[2]`. Replace those reads:

```php
function cc25_featured_sponsor_html($variant = 'card') {
    $s = cc25_featured_sponsor();
    if (!$s) return '';
    $logo = cc25_sponsor_logo($s['name'], $s['file'], $s['url'], ' loading="lazy"');
    if ($variant === 'strip') {
        return '<div class="ft-sponsor"><span class="ft-sponsor-eye kick">&#9733; Featured Sponsor</span>'
            . '<span class="ft-sponsor-logo">' . $logo . '</span></div>';
    }
    return '<div class="feat-sponsor reveal"><div class="feat-eye kick">&#9733; Featured Sponsor</div>'
        . '<div class="feat-logo">' . $logo . '</div>'
        . '<div class="feat-txt"><strong>' . esc_html($s['name']) . '</strong> is proud to support Cwmbran Celtic.'
        . '<a href="' . esc_url(cc25_page_url('sponsorship', home_url('/'))) . '">Become a sponsor &rarr;</a></div></div>';
}
```

In `front-page.php`, replace the wall loop body (line 562-564) and the main-sponsor line (557-559):

```php
    <div class="sponsor-main reveal">
      <?php echo cc25_sponsor_logo($cc25_main['name'], $cc25_main['file'], $cc25_main['url']); ?>
    </div>
    <?php echo cc25_featured_sponsor_html('card'); ?>
    <div class="sponsor-wall reveal d1">
    <?php foreach (cc25_sponsors() as $s): ?>
      <div class="sponsor-card"><?php echo cc25_sponsor_logo($s['name'], $s['file'], $s['url'], ' loading="lazy"'); ?></div>
    <?php endforeach; ?>
```

In `template-sponsors.php`, the same two edits:

```php
    <div class="sponsor-main sponsor-main-lg reveal">
      <?php echo cc25_sponsor_logo($main['name'], $main['file'], $main['url']); ?>
    </div>
```

```php
    <?php foreach (cc25_sponsors() as $s): ?>
      <div class="sponsor-card"><?php echo cc25_sponsor_logo($s['name'], $s['file'], $s['url'], ' loading="lazy"'); ?></div>
    <?php endforeach; ?>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `php _tests/sponsors-test.php`
Expected: PASS — "all passed".

- [ ] **Step 6: Check no positional read survives**

Run: `grep -rn '\$s\[0\]\|\$s\[1\]\|\$s\[2\]\|\$main\[' --include='*.php' .`
Expected: no output. Any hit is a call site left on the old shape, which renders an empty logo rather than erroring — fix it before committing.

- [ ] **Step 7: Run the whole PHP suite**

Run: `for t in _tests/*-test.php; do echo "== $t"; php "$t" || exit 1; done`
Expected: every file ends "all passed" / "All checks passed".

- [ ] **Step 8: Commit**

```bash
git add inc/sponsors.php front-page.php template-sponsors.php _tests/sponsors-test.php
git commit -m "refactor(theme): sponsors carry a permanent slug and know if their banner is dark"
```

---

### Task 2: Charity partners, listed apart from the paid roster

Music Venue Trust is a charity the club supports, not a sponsor who pays. It gets its own billing on `/sponsors` and is excluded from everything commercial. This task builds the support with an empty list; Task 9 adds MVT once its banner is on disk.

**Files:**
- Modify: `inc/sponsors.php`
- Modify: `template-sponsors.php`
- Test: `_tests/sponsors-test.php`

**Interfaces:**
- Consumes: row shape from Task 1.
- Produces:
  - `cc25_charity_partners(): array` — rows in the same shape as `cc25_sponsors()`
  - `cc25_charity_partners_html(): string` — the `/sponsors` section, or `''` when there are no partners

- [ ] **Step 1: Write the failing test**

Append to `_tests/sponsors-test.php`, above the closing `echo "\n";` block:

```php
/* ---- Charity partners ------------------------------------------------ */
$partners = cc25_charity_partners();
check('charity partners are rows in the same shape', count(array_filter($partners, function ($r) {
    return isset($r['name'], $r['slug'], $r['file'], $r['url'], $r['dark']);
})) === count($partners));
$paid_slugs = array_column(cc25_sponsors(), 'slug');
foreach ($partners as $p) {
    check("partner '{$p['name']}' is not in the paid roster", !in_array($p['slug'], $paid_slugs, true));
}
check('with no partners the section renders nothing', $partners ? true : cc25_charity_partners_html() === '');
if ($partners) {
    $html = cc25_charity_partners_html();
    check('the partner section says supported, not sponsored', stripos($html, 'sponsor') === false);
    check('the partner section names each partner', count(array_filter($partners, function ($p) use ($html) {
        return strpos($html, esc_attr($p['name'])) !== false;
    })) === count($partners));
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php _tests/sponsors-test.php`
Expected: FAIL — fatal error, `Call to undefined function cc25_charity_partners()`.

- [ ] **Step 3: Implement in `inc/sponsors.php`**

```php
/* ---- Charity partners ------------------------------------------------
 * Organisations the club supports, rather than sponsors who pay the club.
 * They are listed on the sponsors page in their own right and are deliberately
 * kept out of the rotating band, the ticker and the named slots — paid
 * sponsors are not diluted by a partner the club supports. */
function cc25_charity_partners() {
    return array();
}

/** The charity-partner section for the sponsors page. Empty when there are none. */
function cc25_charity_partners_html() {
    $partners = cc25_charity_partners();
    if (!$partners) return '';
    $out = '<div class="sec-head reveal" style="margin-top:56px"><div>'
         . '<div class="sec-eye kick"><span class="ix">03</span><span class="ln"></span> Giving something back</div>'
         . '<h2>Charity Partners</h2></div></div>'
         . '<p class="spx-lead reveal">Causes the club is proud to support.</p>'
         . '<div class="sponsor-wall reveal d1">';
    foreach ($partners as $p) {
        $cls = !empty($p['dark']) ? ' sponsor-card-dark' : '';
        $out .= '<div class="sponsor-card' . $cls . '">'
              . cc25_sponsor_logo($p['name'], $p['file'], $p['url'], ' loading="lazy"') . '</div>';
    }
    return $out . '</div>';
}
```

- [ ] **Step 4: Render it on the sponsors page**

In `template-sponsors.php`, immediately after the closing `</div>` of the `sponsor-wall` loop and before the `<div class="cta reveal"...>` block:

```php
    <?php echo cc25_charity_partners_html(); ?>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `php _tests/sponsors-test.php`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add inc/sponsors.php template-sponsors.php _tests/sponsors-test.php
git commit -m "feat(theme): charity partners are listed apart from the sponsors who pay"
```

---

### Task 3: The rotation window, as a pure module

The maths only: given a roster size, a window size and a start offset, which indices are showing. Pure and separately testable, exactly as `assets/programme-pages.js` is to `assets/programme-reader.js`.

**Files:**
- Create: `assets/sponsor-rotation.js`
- Test: `_tests/sponsor-rotation-test.js` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: `rotationWindow(count: number, size: number, offset: number): number[]` — `size` indices into a roster of `count`, starting at `offset`, wrapping. Returns fewer than `size` only when `count < size`. Returns `[]` when `count` is 0.

- [ ] **Step 1: Write the failing test**

Create `_tests/sponsor-rotation-test.js`:

```js
/**
 * Assertions over the sponsor rotation window. Run from the theme root:
 *   node _tests/sponsor-rotation-test.js
 * Imports the maths directly — it touches no DOM.
 */
import { rotationWindow } from '../assets/sponsor-rotation.js';

let failures = 0;
function check(label, cond) {
    if (cond) { console.log(`  ok  ${label}`); return; }
    failures++;
    console.log(`FAIL  ${label}`);
}

// The real thing: 22 sponsors, six on screen.
check('a window is six long', rotationWindow(22, 6, 0).length === 6);
check('it starts at the offset', rotationWindow(22, 6, 4)[0] === 4);
check('it wraps past the end', rotationWindow(22, 6, 20).join() === '20,21,0,1,2,3');
check('an offset past the end wraps round', rotationWindow(22, 6, 22)[0] === 0);

// No sponsor may appear twice on screen at once — two tiles of the same logo
// side by side reads as a bug to the sponsor looking at it.
check('no window repeats a sponsor', [...Array(22).keys()].every(o => new Set(rotationWindow(22, 6, o)).size === 6));

// Advancing by the window size cycles the whole roster and returns home.
const seen = new Set();
for (let step = 0; step * 6 < 22 * 6; step++) rotationWindow(22, 6, step * 6).forEach(i => seen.add(i));
check('advancing by a window covers every sponsor', seen.size === 22);

// Degenerate rosters must not hang or throw — a club with three sponsors and a
// six-wide band is a real state on a fresh install.
check('a roster smaller than the window shows what there is', rotationWindow(3, 6, 0).join() === '0,1,2');
check('a roster of one shows one', rotationWindow(1, 6, 0).join() === '0');
check('an empty roster shows nothing', rotationWindow(0, 6, 0).length === 0);
check('a negative offset is treated as zero', rotationWindow(22, 6, -1)[0] === 0);

console.log('');
if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
console.log('all passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node _tests/sponsor-rotation-test.js`
Expected: FAIL — `Cannot find module .../assets/sponsor-rotation.js`.

- [ ] **Step 3: Write the module**

Create `assets/sponsor-rotation.js`:

```js
/**
 * Which sponsors are on screen right now.
 *
 * The band renders every sponsor into the page and shows a window of them, so
 * the rotation is a matter of which indices are visible. The maths lives here,
 * apart from the DOM, so it can be tested without a browser.
 */

/** `size` indices into a roster of `count`, from `offset`, wrapping round. */
export function rotationWindow(count, size, offset) {
    if (!count || count < 1) return [];
    const n = Math.min(size, count);
    const start = ((Math.trunc(offset) % count) + count) % count;
    const out = [];
    for (let i = 0; i < n; i++) out.push((start + i) % count);
    return out;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node _tests/sponsor-rotation-test.js`
Expected: PASS — "all passed".

- [ ] **Step 5: Confirm the module rules still hold**

Run: `php _tests/module-assets-test.php`
Expected: PASS — proves no `.mjs` crept in and `assets/package.json` still marks the directory ESM.

- [ ] **Step 6: Commit**

```bash
git add assets/sponsor-rotation.js _tests/sponsor-rotation-test.js
git commit -m "feat(theme): the sponsor rotation window, as testable maths"
```

---

### Task 4: The site-wide band markup

PHP renders every paid sponsor as a real anchor. CSS shows six. No JS yet — this task's deliverable is a band that works, statically, on every page.

**Files:**
- Modify: `inc/sponsors.php`
- Modify: `template-parts/site-footer.php:34`
- Modify: `style.css` (append after the `.ft-sponsor` rules, around line 946)
- Test: `_tests/sponsors-test.php`

**Interfaces:**
- Consumes: `cc25_sponsors()`, `cc25_sponsor_logo()` from Task 1.
- Produces:
  - `cc25_sponsor_band_html(int $window = 6): string`
  - `cc25_show_sponsor_band(): bool` — false on the home page and the sponsors template, where the full wall already renders

- [ ] **Step 1: Write the failing test**

Append to `_tests/sponsors-test.php`, above the closing block:

```php
/* ---- The site-wide band ---------------------------------------------- */
$band = cc25_sponsor_band_html(6);
check('the band renders every sponsor, not just the visible six', count(cc25_sponsors()) === substr_count($band, 'cc-band-item'));
check('the band declares its window size', strpos($band, 'data-window="6"') !== false);
check('exactly six items start visible', substr_count($band, 'cc-band-item is-on') === 6);
check('the six visible items carry a real src', substr_count($band, '<img src=') === 6);
check('the rest carry data-src so they cost nothing until shown',
    substr_count($band, 'data-src=') === count(cc25_sponsors()) - 6);
check('the band links to the full sponsor list', strpos($band, 'All sponsors') !== false);
check('a dark-bannered sponsor gets a dark tile', count(array_filter(cc25_sponsors(), function ($r) {
    return !empty($r['dark']);
})) === substr_count($band, 'cc-band-dark'));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php _tests/sponsors-test.php`
Expected: FAIL — `Call to undefined function cc25_sponsor_band_html()`.

- [ ] **Step 3: Implement the band in `inc/sponsors.php`**

```php
/* ---- The site-wide sponsor band --------------------------------------
 * Every sponsor is rendered into the page as a real anchor and CSS shows a
 * window of them; assets/sponsor-band.js picks a random window per page load
 * and cycles it. Rendering the lot rather than the visible few is deliberate:
 * it is what makes the rotation immune to full-page caching, and it leaves
 * every sponsor a crawlable link on every page of the site.
 * Only the visible window carries a real src — the rest wait on data-src. */
function cc25_sponsor_band_html($window = 6) {
    $rows = cc25_sponsors();
    if (!$rows) return '';
    $window = max(1, min((int) $window, count($rows)));

    $items = '';
    foreach ($rows as $i => $r) {
        $on   = $i < $window;
        $src  = esc_url(cc25_sponsor_url($r['file']));
        $img  = '<img ' . ($on ? 'src="' . $src . '"' : 'data-src="' . $src . '"')
              . ' alt="' . esc_attr($r['name']) . '" width="1058" height="282" loading="lazy">';
        $link = cc25_sponsor_link($r);
        $body = $link
            ? '<a href="' . esc_url($link) . '" target="_blank" rel="noopener sponsored" aria-label="'
              . esc_attr($r['name']) . ' (opens in a new tab)">' . $img . '</a>'
            : $img;
        $items .= '<div class="cc-band-item' . ($on ? ' is-on' : '')
                . (!empty($r['dark']) ? ' cc-band-dark' : '') . '">' . $body . '</div>';
    }

    return '<div class="cc-band" data-window="' . (int) $window . '">'
         . '<div class="cc-band-head"><span class="kick">Proudly supported by</span>'
         . '<a class="cc-band-all" href="' . esc_url(cc25_page_url('sponsors', home_url('/'))) . '">All sponsors &rarr;</a>'
         . '</div><div class="cc-band-strip">' . $items . '</div></div>';
}

/** True where the band should render. The home page and the sponsors page
 *  already show the full wall; a band there is the same logos twice within a
 *  screen of each other. */
function cc25_show_sponsor_band() {
    if (!function_exists('is_front_page')) return true; // CLI tests
    return !is_front_page() && !is_page_template('template-sponsors.php');
}
```

Add `cc25_sponsor_link()` beside `cc25_sponsor_url()` — for now it returns the sponsor's own URL; Task 5 repoints it at `/go/`:

```php
/** Where a sponsor's logo links to. Blank when they have no website. */
function cc25_sponsor_link($row) {
    return isset($row['url']) ? $row['url'] : '';
}
```

- [ ] **Step 4: Swap the footer strip for the band**

In `template-parts/site-footer.php`, replace line 34:

```php
    <?php echo cc25_show_sponsor_band() ? cc25_sponsor_band_html(6) : ''; ?>
```

- [ ] **Step 5: Add the CSS**

Append to `style.css` after the `.ft-sponsor-logo` rule:

```css
/* ---- Site-wide sponsor band (template-parts/site-footer.php) ----
 * Every sponsor is in the markup; only .is-on is shown. assets/sponsor-band.js
 * moves that class along, so the band works without JS at the first six. */
.cc-band{padding:20px 0 6px;margin-top:8px;border-top:1px solid rgba(255,255,255,.12)}
.cc-band-head{display:flex;align-items:baseline;justify-content:space-between;gap:14px;margin-bottom:14px}
.cc-band-head .kick{color:var(--gold);letter-spacing:.12em;font-size:.68rem}
.cc-band-all{color:#fff;opacity:.72;font-size:.78rem;white-space:nowrap;text-decoration:none}
.cc-band-all:hover{opacity:1}
.cc-band-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;align-items:center}
.cc-band-item{display:none}
.cc-band-item.is-on{display:flex;align-items:center;justify-content:center;background:#fff;border-radius:6px;padding:8px 10px;min-height:52px;transition:opacity .45s}
.cc-band-item.is-on.is-fading{opacity:0}
.cc-band-dark.is-on{background:var(--navy-800,#12203c)}
.cc-band-item img{max-width:100%;max-height:38px;width:auto;height:auto;object-fit:contain;display:block}
@media(max-width:900px){.cc-band-strip{grid-template-columns:repeat(3,1fr)}}
@media(max-width:520px){.cc-band-strip{grid-template-columns:repeat(2,1fr)}}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `php _tests/sponsors-test.php`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add inc/sponsors.php template-parts/site-footer.php style.css _tests/sponsors-test.php
git commit -m "feat(theme): a sponsor band on every page, in place of one logo in the footer"
```

---

### Task 5: The band rotates, randomly, per visitor

**Files:**
- Create: `assets/sponsor-band.js`
- Modify: `functions.php:17-51` (enqueue) and `functions.php:53-57` (module filter)
- Test: manual browser check (this is DOM behaviour; the maths is already covered by Task 3)

**Interfaces:**
- Consumes: `rotationWindow()` from Task 3; the `.cc-band` markup from Task 4.
- Produces: no exports — a side-effecting module. Guarded so importing it in Node does nothing.

- [ ] **Step 1: Write the module**

Create `assets/sponsor-band.js`:

```js
/**
 * The sponsor band rotates.
 *
 * WHY THIS RUNS IN THE BROWSER
 * ----------------------------
 * The obvious implementation is a random pick in PHP. inc/sponsors.php used to
 * do exactly that and was changed away from it, because under full-page caching
 * a PHP-side random is rolled once, baked into the cached HTML, and served to
 * everybody until the cache expires. It looks random in development and is
 * frozen in production. Choosing the window here instead means it is genuinely
 * random per visitor, whatever any cache in front of the site is doing.
 */
import { rotationWindow } from './sponsor-rotation.js';

const CYCLE_MS = 7000;
const FADE_MS = 450;   // must match .cc-band-item transition in style.css

function startBand(band) {
    const items = Array.from(band.querySelectorAll('.cc-band-item'));
    const size = parseInt(band.dataset.window || '6', 10);
    if (items.length <= size) return;   // everyone is already on screen

    let offset = Math.floor(Math.random() * items.length);

    const show = (indices) => {
        indices.forEach((i) => {
            const img = items[i].querySelector('img');
            if (img && !img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
        });
        items.forEach((el, i) => el.classList.toggle('is-on', indices.includes(i)));
    };

    show(rotationWindow(items.length, size, offset));

    setInterval(() => {
        const on = items.filter((el) => el.classList.contains('is-on'));
        on.forEach((el) => el.classList.add('is-fading'));
        setTimeout(() => {
            offset += size;
            show(rotationWindow(items.length, size, offset));
            items.forEach((el) => el.classList.remove('is-fading'));
        }, FADE_MS);
    }, CYCLE_MS);
}

if (typeof document !== 'undefined') {
    document.querySelectorAll('.cc-band').forEach(startBand);
}
```

- [ ] **Step 2: Enqueue it as a module**

In `functions.php`, inside the `wp_enqueue_scripts` closure, after the `cc25-js` enqueue:

```php
    $bv = @filemtime($dir . '/assets/sponsor-band.js') ?: '0.1.0';
    wp_enqueue_script('cc25-sponsor-band', get_stylesheet_directory_uri() . '/assets/sponsor-band.js', array(), $bv, true);
```

Then widen the existing module filter (`functions.php:53`) — it currently matches one handle:

```php
/** PDF.js 6 ships ESM only, so the reader has to load as a module; the sponsor
 *  band imports its rotation maths, so it does too. */
add_filter('script_loader_tag', function ($tag, $handle) {
    if ($handle !== 'cc25-programme-reader' && $handle !== 'cc25-sponsor-band') return $tag;
    return str_replace('<script ', '<script type="module" ', $tag);
}, 10, 2);
```

- [ ] **Step 3: Verify the module rules and the whole suite**

Run: `php _tests/module-assets-test.php && node _tests/sponsor-rotation-test.js && php _tests/sponsors-test.php`
Expected: all three pass. The first proves the new module is `.js` and referenced as `.js`.

- [ ] **Step 4: Check it in a browser**

Load any page that is not the home page or `/sponsors` on a local or staging install, scroll to the footer, and confirm: six logos, changing every seven seconds, and a different starting set on each hard reload. With JS disabled, six logos and no rotation.

Expected failure to watch for: no rotation at all plus a console error `Failed to resolve module specifier` means the `type="module"` filter did not match the handle.

- [ ] **Step 5: Commit**

```bash
git add assets/sponsor-band.js functions.php
git commit -m "feat(theme): the sponsor band shows a different six on every page load"
```

---

### Task 6: `/go/<slug>` counts the click and redirects

**Files:**
- Create: `inc/sponsor-clicks.php`
- Modify: `functions.php:12` (module list)
- Modify: `inc/sponsors.php` (`cc25_sponsor_link()` from Task 4)
- Test: `_tests/sponsors-test.php`

**Interfaces:**
- Consumes: `cc25_sponsor_by_slug()` from Task 1.
- Produces:
  - `cc25_sponsor_click_url(string $slug): string` — `home_url('/go/<slug>')`
  - `cc25_sponsor_record_click(string $slug, string $month): void` — increments the stored count
  - `cc25_sponsor_clicks(): array` — `slug => array('YYYY-MM' => int)`
  - `cc25_sponsor_is_bot(string $ua): bool`

- [ ] **Step 1: Write the failing test**

Append to `_tests/sponsors-test.php`:

```php
/* ---- Click tracking --------------------------------------------------- */
check('a click URL is /go/ plus the slug', substr(cc25_sponsor_click_url('gigantic'), -12) === '/go/gigantic');
check('sponsor logos link through /go/', strpos(cc25_sponsor_link(cc25_sponsor_by_slug('gigantic')), '/go/gigantic') !== false);
check('a sponsor with no website still gets no link', cc25_sponsor_link(cc25_sponsor_by_slug('hornbeam')) === '');

// Bots must not inflate the number the club quotes at renewal.
check('googlebot is not counted', cc25_sponsor_is_bot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'));
check('bingbot is not counted', cc25_sponsor_is_bot('Mozilla/5.0 (compatible; bingbot/2.0)'));
check('curl is not counted', cc25_sponsor_is_bot('curl/8.4.0'));
check('a real browser is counted', !cc25_sponsor_is_bot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15'));
check('a blank user agent is not counted', cc25_sponsor_is_bot(''));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php _tests/sponsors-test.php`
Expected: FAIL — `Call to undefined function cc25_sponsor_click_url()`.

- [ ] **Step 3: Write `inc/sponsor-clicks.php`**

```php
<?php
/**
 * Sponsor click tracking.
 *
 * Every sponsor logo on the site links to /go/<slug>, which counts the click
 * and redirects. The point is renewal: "your logo was clicked 38 times in
 * August" is a sentence the club can say, and "it's on the website" is not.
 *
 * Clicks are counted; impressions are NOT, and deliberately so — on a cached
 * site a server-side impression count under-reports by whatever share of views
 * the cache serves, and a wrong number is worse than no number.
 */
if (!defined('ABSPATH')) exit;

define('CC25_CLICKS_OPTION', 'cc25_sponsor_clicks');
define('CC25_REWRITE_VERSION', '1');

/** Where a sponsor's logo points: /go/<slug>, not the sponsor's own URL. */
function cc25_sponsor_click_url($slug) {
    return home_url('/go/' . $slug);
}

/* ---- The rewrite ------------------------------------------------------ */

add_action('init', function () {
    add_rewrite_rule('^go/([a-z0-9-]+)/?$', 'index.php?cc25_go=$matches[1]', 'top');

    // The theme had no rewrite rules before this one, so the rules stored in the
    // database do not contain it and every sponsor link 404s until they are
    // rebuilt. Flushing on every load is expensive, so it happens once per
    // version — bump CC25_REWRITE_VERSION if the rule above ever changes.
    if (get_option('cc25_rewrite_version') !== CC25_REWRITE_VERSION) {
        flush_rewrite_rules();
        update_option('cc25_rewrite_version', CC25_REWRITE_VERSION, false);
    }
});

add_filter('query_vars', function ($vars) {
    $vars[] = 'cc25_go';
    return $vars;
});

add_action('template_redirect', function () {
    $slug = get_query_var('cc25_go');
    if (!$slug) return;

    $sponsor = cc25_sponsor_by_slug($slug);
    // An unknown slug 404s rather than redirecting. The slug list is the
    // whitelist; without that this is an open redirect with the club's domain
    // on the front of it.
    if (!$sponsor || empty($sponsor['url'])) {
        status_header(404);
        nocache_headers();
        include get_query_template('404');
        exit;
    }

    if (!cc25_sponsor_is_bot($_SERVER['HTTP_USER_AGENT'] ?? '')) {
        cc25_sponsor_record_click($slug, date('Y-m'));
    }

    // Without this a caching layer can store one sponsor's redirect and serve
    // it to everyone who clicks any sponsor.
    nocache_headers();
    wp_redirect($sponsor['url'], 302);
    exit;
});

/* ---- Counting --------------------------------------------------------- */

/** Everything counted so far: slug => array('YYYY-MM' => clicks). */
function cc25_sponsor_clicks() {
    $v = get_option(CC25_CLICKS_OPTION, array());
    return is_array($v) ? $v : array();
}

function cc25_sponsor_record_click($slug, $month) {
    $all = cc25_sponsor_clicks();
    if (!isset($all[$slug])) $all[$slug] = array();
    $all[$slug][$month] = (isset($all[$slug][$month]) ? (int) $all[$slug][$month] : 0) + 1;
    // Not autoloaded: this grows with every sponsor and month, and nothing on
    // the front end reads it.
    update_option(CC25_CLICKS_OPTION, $all, false);
}

/** Crawlers and command-line fetches, which must not inflate the count. */
function cc25_sponsor_is_bot($ua) {
    if ($ua === '' || $ua === null) return true;   // no agent, no human
    return (bool) preg_match('/bot|crawl|spider|slurp|curl|wget|headless|preview|facebookexternalhit|python-requests/i', $ua);
}
```

- [ ] **Step 4: Load the module and repoint the links**

In `functions.php` line 12, add `'sponsor-clicks'` to the list, after `'sponsors'`:

```php
foreach (array('hardening', 'bond-draws', 'fixtures', 'match-reports', 'comet', 'health', 'seo', 'programmes', 'kickoff', 'sponsors', 'sponsor-clicks', 'people', 'gallery', 'tickets') as $cc25_mod) {
```

In `inc/sponsors.php`, replace `cc25_sponsor_link()` from Task 4:

```php
/** Where a sponsor's logo links to — through /go/ so the click is counted.
 *  Blank when they have no website, which renders the logo un-linked. */
function cc25_sponsor_link($row) {
    if (empty($row['url']) || empty($row['slug'])) return '';
    return function_exists('cc25_sponsor_click_url') ? cc25_sponsor_click_url($row['slug']) : $row['url'];
}
```

And route the existing wall/main/featured logos through it — in `cc25_sponsor_logo()`, the `$url` argument now arrives as a `/go/` link from its callers, so change each caller to pass `cc25_sponsor_link($s)` in place of `$s['url']`:

- `inc/sponsors.php` — `cc25_featured_sponsor_html()`
- `front-page.php` — main sponsor and wall loop
- `template-sponsors.php` — main sponsor and wall loop
- `inc/sponsors.php` — `cc25_charity_partners_html()` keeps `$p['url']`; **partners are not click-tracked**

- [ ] **Step 5: Run the test to verify it passes**

Run: `php _tests/sponsors-test.php`
Expected: PASS.

Note: `home_url()` is undefined under the CLI test harness. Add this stub near the top of `_tests/sponsors-test.php`, beside the `add_action`/`add_filter` stubs:

```php
if (!function_exists('home_url')) { function home_url($p = '/') { return 'https://cwmbranceltic.com' . $p; } }
```

- [ ] **Step 6: Commit**

```bash
git add inc/sponsor-clicks.php inc/sponsors.php functions.php front-page.php template-sponsors.php _tests/sponsors-test.php
git commit -m "feat(theme): sponsor logos link through /go/, which counts the click"
```

---

### Task 7: Tools → Sponsor clicks

**Files:**
- Modify: `inc/sponsor-clicks.php`

**Interfaces:**
- Consumes: `cc25_sponsor_clicks()`, `cc25_sponsors()`, `cc25_sponsor_main()`.
- Produces: an admin page under Tools. No new functions other tasks depend on.

- [ ] **Step 1: Add the admin page**

Append to `inc/sponsor-clicks.php`:

```php
/* ---- Reporting -------------------------------------------------------- */

add_action('admin_menu', function () {
    add_management_page('Sponsor clicks', 'Sponsor clicks', 'edit_others_posts', 'cc25-sponsor-clicks', 'cc25_sponsor_clicks_page');
});

function cc25_sponsor_clicks_page() {
    $clicks = cc25_sponsor_clicks();
    $rows   = array_merge(array(cc25_sponsor_main()), cc25_sponsors());

    // The last twelve months, newest first — the span a renewal conversation
    // covers.
    $months = array();
    for ($i = 0; $i < 12; $i++) $months[] = date('Y-m', strtotime("-$i month"));

    echo '<div class="wrap"><h1>Sponsor clicks</h1>';
    echo '<p>Clicks on each sponsor&rsquo;s logo, counted at <code>/go/&lt;slug&gt;</code>. '
       . 'Crawlers are excluded. Impressions are not counted &mdash; take those from analytics.</p>';
    echo '<table class="widefat striped"><thead><tr><th>Sponsor</th><th>Total</th>';
    foreach ($months as $m) echo '<th>' . esc_html(date('M y', strtotime($m . '-01'))) . '</th>';
    echo '</tr></thead><tbody>';

    foreach ($rows as $r) {
        $mine  = isset($clicks[$r['slug']]) ? $clicks[$r['slug']] : array();
        $total = array_sum($mine);
        echo '<tr><td><strong>' . esc_html($r['name']) . '</strong><br><code>' . esc_html($r['slug']) . '</code></td>';
        echo '<td><strong>' . (int) $total . '</strong></td>';
        foreach ($months as $m) echo '<td>' . (isset($mine[$m]) ? (int) $mine[$m] : 0) . '</td>';
        echo '</tr>';
    }
    echo '</tbody></table></div>';
}
```

- [ ] **Step 2: Check it in wp-admin**

Load **Tools → Sponsor clicks**. Expected: every sponsor listed with zeroes. Click a sponsor logo on the front end, reload the page, and confirm that sponsor's total and current month both read 1.

Expected failure to watch for: clicking a logo gives a 404 rather than redirecting — the rewrite flush did not run. Visit **Settings → Permalinks** and press Save once, which forces a flush, then confirm the option: `wp option get cc25_rewrite_version`.

- [ ] **Step 3: Run the suite and commit**

Run: `php _tests/sponsors-test.php`

```bash
git add inc/sponsor-clicks.php
git commit -m "feat(theme): a clicks-per-sponsor report, so renewal has a number in it"
```

---

### Task 8: Named slots on news and match reports

A block that says "Sponsored by X" when the slot has been sold and "Brought to you by X" when it has not, so it is never empty.

**Files:**
- Modify: `inc/sponsors.php`
- Modify: `inc/match-reports.php` (meta box around line 30-50, and the `save_post_post` handler)
- Modify: `single.php` (after the `art-body` div, before the gallery block)
- Modify: `template-match-report.php` (after the Match Report block, around line 186)
- Modify: `style.css`
- Test: `_tests/sponsors-test.php`

**Interfaces:**
- Consumes: `cc25_sponsors()`, `cc25_sponsor_by_slug()`, `cc25_featured_sponsor()`, `cc25_sponsor_link()`.
- Produces:
  - `cc25_slot_sponsor(string $explicit = ''): ?array` — the explicit sponsor if that slug resolves, otherwise the daily rotation pick, otherwise null
  - `cc25_sponsor_slot_html(string $explicit = '', string $context = 'story'): string` — `$context` is `'story'` or `'report'` and only changes the wording

- [ ] **Step 1: Write the failing test**

Append to `_tests/sponsors-test.php`:

```php
/* ---- Named slots ------------------------------------------------------ */
check('an explicit slug wins', cc25_slot_sponsor('coaltown')['slug'] === 'coaltown');
check('an unsold slot falls back to the rotation', cc25_slot_sponsor('') !== null);
// Sponsors leave. An old report naming one must not render a broken block.
check('a slug that no longer exists falls back rather than breaking',
    cc25_slot_sponsor('a-sponsor-who-left') !== null);
check('a sold slot says sponsored by', strpos(cc25_sponsor_slot_html('coaltown', 'report'), 'Sponsored by') !== false);
check('a sold slot names the sponsor', strpos(cc25_sponsor_slot_html('coaltown', 'report'), 'Coaltown') !== false);
check('an unsold slot says brought to you by', strpos(cc25_sponsor_slot_html('', 'story'), 'Brought to you by') !== false);
check('a report slot names the report', strpos(cc25_sponsor_slot_html('coaltown', 'report'), 'match report') !== false);
check('a slot links through /go/', strpos(cc25_sponsor_slot_html('coaltown', 'story'), '/go/coaltown') !== false);
// Charity partners are never sold as a slot.
foreach (cc25_charity_partners() as $p) {
    check("partner '{$p['name']}' cannot fill a named slot", cc25_slot_sponsor($p['slug'])['slug'] !== $p['slug']);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php _tests/sponsors-test.php`
Expected: FAIL — `Call to undefined function cc25_slot_sponsor()`.

- [ ] **Step 3: Implement the slot in `inc/sponsors.php`**

```php
/* ---- Named slots ------------------------------------------------------
 * A slot can be sold to one sponsor for one story or one match; when it isn't
 * sold it carries the daily rotation instead, so it never renders empty and
 * the club never has to fill it. */

/** The sponsor for a named slot: the explicit one if it still resolves, the
 *  rotation otherwise. Sponsors leave, and an old report naming one that has
 *  gone falls back rather than rendering a broken block. */
function cc25_slot_sponsor($explicit = '') {
    $named = cc25_sponsor_by_slug($explicit);
    if ($named) return $named;   // no website is fine — the logo just isn't a link
    $rot = cc25_featured_sponsor();
    return $rot ?: null;
}

/** A named sponsor block. $context is 'story' or 'report' — wording only. */
function cc25_sponsor_slot_html($explicit = '', $context = 'story') {
    $s = cc25_slot_sponsor($explicit);
    if (!$s) return '';
    $sold  = cc25_sponsor_by_slug($explicit) !== null;
    $thing = $context === 'report' ? 'match report' : 'story';
    $lead  = $sold ? 'Sponsored by' : 'Brought to you by';
    $link  = cc25_sponsor_link($s);
    $img   = '<img src="' . esc_url(cc25_sponsor_url($s['file'])) . '" alt="' . esc_attr($s['name'])
           . '" width="1058" height="282" loading="lazy">';
    $logo  = $link
        ? '<a href="' . esc_url($link) . '" target="_blank" rel="noopener sponsored" aria-label="'
          . esc_attr($s['name']) . ' (opens in a new tab)">' . $img . '</a>'
        : $img;

    return '<aside class="cc-slot' . (!empty($s['dark']) ? ' cc-slot-dark' : '') . '">'
         . '<div class="cc-slot-eye kick">' . esc_html($lead) . '</div>'
         . '<div class="cc-slot-logo">' . $logo . '</div>'
         . '<div class="cc-slot-txt">This ' . esc_html($thing) . ' is '
         . ($sold ? 'sponsored by' : 'brought to you by') . ' <strong>'
         . esc_html($s['name']) . '</strong>. <a href="'
         . esc_url(cc25_page_url('sponsorship', home_url('/'))) . '">Sponsor the Celts &rarr;</a></div>'
         . '</aside>';
}
```

- [ ] **Step 4: Add the Sponsor dropdown to the match-report meta box**

In `inc/match-reports.php`, inside `cc25_mr_metabox()`, read the stored value beside the others:

```php
    $spon = get_post_meta($post->ID, '_cc25_sponsor', true);
```

and add the field after the Attendance paragraph:

```php
    <p><label for="cc25mr_sponsor"><strong>Sponsored by</strong></label><br>
      <select id="cc25mr_sponsor" name="cc25_sponsor" style="width:100%">
        <option value="">&mdash; not sold, rotate sponsors &mdash;</option>
        <?php foreach (cc25_sponsors() as $s): ?>
          <option value="<?php echo esc_attr($s['slug']); ?>"<?php selected($spon, $s['slug']); ?>><?php echo esc_html($s['name']); ?></option>
        <?php endforeach; ?>
      </select></p>
    <p style="color:#666;font-size:11px;margin-top:-6px">Leave this alone unless the slot has been sold. Unsold, it shows a different sponsor each day by itself.</p>
```

In the `save_post_post` handler, alongside the other saves:

```php
    // Only accept a slug we actually offered, so a stale form cannot attach a
    // sponsor who no longer exists.
    $spon = sanitize_text_field(wp_unslash($_POST['cc25_sponsor'] ?? ''));
    if ($spon !== '' && !cc25_sponsor_by_slug($spon)) $spon = '';
    update_post_meta($id, '_cc25_sponsor', $spon);
```

- [ ] **Step 5: Render the block on news posts**

In `single.php`, immediately after the `<div class="art-body prose">` line and before the gallery comment block:

```php
      <?php echo cc25_sponsor_slot_html(
          (string) get_post_meta(get_the_ID(), '_cc25_sponsor', true),
          (function_exists('cc25_is_report_post') && cc25_is_report_post()) ? 'report' : 'story'
      ); ?>
```

- [ ] **Step 6: Render the block on match reports**

In `template-match-report.php`, immediately after the closing `</div>` of the Match Report `mr-block` (after the byline line, around line 186):

```php
      <?php echo cc25_sponsor_slot_html(isset($m['sponsor']) ? $m['sponsor'] : '', 'report'); ?>
```

`cc25_season_matches_static()` rows may now carry an optional `'sponsor' => '<slug>'` key. Nothing needs adding to existing rows — a missing key is an unsold slot.

- [ ] **Step 7: Add the CSS**

Append to `style.css`:

```css
/* ---- Named sponsor slot (single.php, template-match-report.php) ---- */
.cc-slot{display:flex;align-items:center;gap:20px;flex-wrap:wrap;background:var(--surface);border:1px solid var(--hair);
  border-left:3px solid var(--gold);border-radius:10px;padding:16px 20px;margin:26px 0;box-shadow:var(--shadow-sm)}
.cc-slot-eye{color:var(--gold-deep);letter-spacing:.12em;font-size:.68rem;flex:none}
.cc-slot-logo{flex:none;max-width:190px}
.cc-slot-logo img{max-width:100%;height:auto;display:block}
.cc-slot-dark .cc-slot-logo{background:var(--navy-800,#12203c);border-radius:6px;padding:6px 10px}
.cc-slot-txt{color:var(--muted);font-size:.9rem;flex:1;min-width:200px}
.cc-slot-txt strong{color:var(--text)}
.cc-slot-txt a{color:var(--blue-500);font-weight:600;white-space:nowrap}
@media(max-width:600px){.cc-slot{gap:12px}.cc-slot-txt{font-size:.85rem}}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `php _tests/sponsors-test.php && php _tests/report-test.php`
Expected: both pass. `report-test.php` is included because this task edits `inc/match-reports.php`.

- [ ] **Step 9: Commit**

```bash
git add inc/sponsors.php inc/match-reports.php single.php template-match-report.php style.css _tests/sponsors-test.php
git commit -m "feat(theme): news and match reports carry a sponsor slot that can be sold"
```

---

### Task 9: A sponsor in the ticker

**Files:**
- Modify: `inc/sponsors.php` (`cc25_ticker_items()`, around line 90-120)
- Test: `_tests/sponsors-test.php`

**Interfaces:**
- Consumes: `cc25_featured_sponsor()`, `cc25_sponsor_link()`.
- Produces: no new functions — `cc25_ticker_items()` gains sponsor items.

- [ ] **Step 1: Write the failing test**

Append to `_tests/sponsors-test.php`:

```php
/* ---- Ticker ----------------------------------------------------------- */
$tk = cc25_ticker_items();
// Sponsor items are placed every fifth fixture, so out of season there may be
// none to place. Assert the placement only when there are enough fixtures —
// otherwise this test fails every June for no reason.
$tk_sponsors = substr_count($tk, 'tk-sponsor');
$tk_fixtures = substr_count($tk, 'tk-item') - $tk_sponsors;
if ($tk_fixtures >= 5) {
    check('the ticker carries a sponsor item', $tk_sponsors > 0);
    check('the ticker sponsor links through /go/', strpos($tk, '/go/') !== false);
    check('fixtures outnumber sponsors in the ticker', $tk_fixtures > $tk_sponsors * 2);
} else {
    check('too few upcoming fixtures to place a sponsor (out of season)', true);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php _tests/sponsors-test.php`
Expected: FAIL — "the ticker carries a sponsor item".

- [ ] **Step 3: Inject the item**

In `cc25_ticker_items()`, replace the final `foreach ($up as $f) { ... }` loop with one that counts as it goes:

```php
    $sponsor = cc25_featured_sponsor();
    $n = 0;
    foreach ($up as $f) {
        $match = $f['home']
            ? 'Cwmbran Celtic v ' . esc_html($f['opp'])
            : esc_html($f['opp']) . ' v Cwmbran Celtic';
        $out .= '<span class="tk-item"><em class="tk-team ' . $f['badge'][1] . '" title="' . esc_attr($f['title']) . '">' . esc_html($f['badge'][0]) . '</em><b class="tk-date">' . esc_html(cc25_date($f['ms'], 'D j M')) . '</b> ' . $match . ' <em class="tk-ha">' . ($f['home'] ? 'H' : 'A') . '</em></span>';

        // One sponsor every fifth fixture. The ticker is for telling people what
        // is coming up; the sponsor rides along rather than taking it over.
        if ($sponsor && ++$n % 5 === 0) {
            $link = cc25_sponsor_link($sponsor);
            $name = '&#9733; Brought to you by ' . esc_html($sponsor['name']);
            $out .= '<span class="tk-item tk-sponsor">' . ($link
                ? '<a href="' . esc_url($link) . '" target="_blank" rel="noopener sponsored">' . $name . '</a>'
                : $name) . '</span>';
        }
    }
```

- [ ] **Step 4: Style the item**

Append to `style.css`:

```css
.tk-sponsor,.tk-sponsor a{color:var(--gold);text-decoration:none}
.tk-sponsor a:hover{text-decoration:underline}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `php _tests/sponsors-test.php && php _tests/upcoming-test.php && php _tests/fixtures-page-test.php`
Expected: all pass. The last two cover the fixture data the ticker is built from.

- [ ] **Step 6: Commit**

```bash
git add inc/sponsors.php style.css _tests/sponsors-test.php
git commit -m "feat(theme): the match ticker carries a sponsor between fixtures"
```

---

### Task 10: The four new sponsors, and MVT as a charity partner

**Prerequisites — this task cannot start without both:**
1. The five banner files saved into `assets/img/sponsor-banners/` at **1058x282**: `airbond.png`, `gmb-union.png`, `pc-wannell.png`, `range-after-care.png`, `mvt.png`.
2. The website URLs. A sponsor whose URL is not yet known ships with `'url' => ''` — that renders the logo un-linked, which is existing, deliberate behaviour (SERi, Hornbeam, Hydro Group, CRE and JW Stockwell all ship that way today). Do not invent a URL.

**Files:**
- Modify: `inc/sponsors.php`
- Test: `_tests/sponsors-test.php`

**Interfaces:**
- Consumes: everything above. Produces no new functions.

- [ ] **Step 1: Confirm the banners are on disk and correctly sized**

Run:
```bash
for f in airbond gmb-union pc-wannell range-after-care mvt; do
  php -r "\$s=@getimagesize('assets/img/sponsor-banners/$f.png'); echo '$f: '.(\$s?\$s[0].'x'.\$s[1]:'MISSING').\"\n\";"
done
```
Expected: five lines reading `1058x282`. Anything else, stop — a wrongly-sized banner distorts on every page of the site, because `cc25_sponsor_logo()` hardcodes those dimensions.

- [ ] **Step 2: Write the failing test**

Append to `_tests/sponsors-test.php`:

```php
/* ---- The 2026/27 additions -------------------------------------------- */
check('the paid roster is twenty-two', count(cc25_sponsors()) === 22);
foreach (array('airbond', 'gmb-union', 'pc-wannell', 'range-after-care') as $new) {
    check("$new is a paid sponsor", cc25_sponsor_by_slug($new) !== null);
}
check('MVT is not a paid sponsor', cc25_sponsor_by_slug('mvt') === null);
check('MVT is a charity partner', count(array_filter(cc25_charity_partners(), function ($p) {
    return $p['slug'] === 'mvt';
})) === 1);
// White-on-black banners, which need the dark tile rather than the white one.
check('Range After Care is flagged dark', cc25_sponsor_by_slug('range-after-care')['dark'] === true);
check('MVT is flagged dark', cc25_charity_partners()[0]['dark'] === true);
```

- [ ] **Step 3: Run test to verify it fails**

Run: `php _tests/sponsors-test.php`
Expected: FAIL — "the paid roster is twenty-two" and the four lookups.

- [ ] **Step 4: Add the rows**

In `cc25_sponsors()`, append to the `$rows` array — replacing each empty URL string with the real one once known:

```php
        array('Airbond', 'airbond', 'airbond.png', ''),
        array('GMB Union', 'gmb-union', 'gmb-union.png', 'https://www.gmb.org.uk/'),
        array('PC Wannell', 'pc-wannell', 'pc-wannell.png', ''),
        array('Range After Care', 'range-after-care', 'range-after-care.png', ''),
```

`Range After Care` is white-on-black, so it needs the dark flag. The builder loop sets `'dark' => false` for every row; give it a fifth element and read it:

```php
    foreach ($rows as $r) {
        $out[] = array('name' => $r[0], 'slug' => $r[1], 'file' => $r[2], 'url' => $r[3],
                       'dark' => !empty($r[4]));
    }
```

and add `true` as the fifth element of the Range After Care row:

```php
        array('Range After Care', 'range-after-care', 'range-after-care.png', '', true),
```

Then fill in `cc25_charity_partners()`:

```php
function cc25_charity_partners() {
    return array(
        array('name' => 'Music Venue Trust', 'slug' => 'mvt', 'file' => 'mvt.png',
              'url' => 'https://musicvenuetrust.com/', 'dark' => true),
    );
}
```

- [ ] **Step 5: Run the whole suite**

Run: `for t in _tests/*-test.php; do echo "== $t"; php "$t" || exit 1; done && node _tests/sponsor-rotation-test.js`
Expected: everything passes, including the banner-exists check from Task 1 now covering all twenty-three images.

- [ ] **Step 6: Commit**

```bash
git add inc/sponsors.php _tests/sponsors-test.php assets/img/sponsor-banners/
git commit -m "feat(theme): four new sponsors, and Music Venue Trust as a charity partner"
```

---

### Task 11: Release

**Files:**
- Modify: `style.css:7`

- [ ] **Step 1: Bump the theme version**

In `style.css`, change `Version: 0.19.0` to `Version: 0.20.0`. CSS and JS cache-bust by file mtime already — no other version to touch.

- [ ] **Step 2: Run every test one last time**

Run: `for t in _tests/*-test.php; do echo "== $t"; php "$t" || exit 1; done && node _tests/reader-order-test.js && node _tests/sponsor-rotation-test.js`
Expected: all pass.

- [ ] **Step 3: Commit and build the zip**

```bash
git add style.css
git commit -m "chore(theme): 0.20.0"
```

Build the dated zip the same way as previous releases and hand it to Connor to upload.

- [ ] **Step 4: Post-upload check — the one that matters**

After the zip is live, in this order:

1. Click any sponsor logo. Expected: it redirects to the sponsor's site. **If it 404s, the rewrite flush did not run** — every sponsor link on the site is dead, which is worse than before this work. Fix: open Settings → Permalinks and press Save once.
2. Load a news post and confirm the sponsor block renders under the article.
3. Load any page twice and confirm the footer band starts on a different set of logos.
4. Open Tools → Sponsor clicks and confirm the click from step 1 was counted.

---

## Notes for whoever executes this

- **Tasks 1-9 are buildable today.** Task 10 waits on banner files and URLs from Connor and blocks nothing else.
- The riskiest change is the rewrite rule in Task 6, because its failure mode is site-wide and silent in every automated check — the PHP tests cannot exercise WordPress's rewrite system. Step 4 of Task 11 is the only thing that catches it.
- `cc25_featured_sponsor()`'s daily rotation is kept and reused by the ticker and the named slots. It is not a caching problem there: those are meant to be the same all day. Only the band needs per-load randomness, and only the band gets it.
