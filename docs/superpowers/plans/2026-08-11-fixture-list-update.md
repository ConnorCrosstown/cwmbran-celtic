# Fixture List Update (club list of 11 Aug 2026) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the club's fixture list of 11 August 2026 — two venue corrections, two entirely new teams (Women's Reserves, Women's U19s) — and replace the fixtures page's seven copy-pasted per-team blocks with one loop over the team registry.

**Architecture:** Fixture data lives in `cc25_static_fixtures_static()` in `functions.php` as the hand-maintained fallback; `cc25_fx_teams()` in `inc/fixtures.php` is the single team registry that drives the WP admin editor, match reports, tickets and (after this change) the fixtures page. A team's hardcoded list is used until that team has fixture posts in WP admin, at which point the posts replace it wholesale.

**Tech Stack:** PHP 8 (WordPress theme, no framework), plain CLI test scripts under `_tests/` that stub WordPress functions and `require ../functions.php`. Python 3 + `php` for the tools regeneration.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-11-fixture-list-update-design.md`. Source data: `~/Downloads/Fixtures.xlsx`, 11 Aug 2026 16:10, 59,608 bytes.
- Branch is `feat/fixtures-11-aug`. Do not commit to `main`.
- All tests run from the theme root `wordpress-theme/cwmbran-celtic-2025/`, e.g. `php _tests/fixture-record-test.php`.
- Test files ship inside the theme zip and MUST begin with `if (PHP_SAPI !== 'cli') exit;`.
- **The five existing teams must render byte-for-byte identically after the template refactor.** Verified by diffing captured output, not by reading.
- Kick-offs for both new teams are **assumptions**, not club-confirmed: U19s Fridays fall to `19:30`, Women's Reserves Sundays to `14:00` via `cc25_kickoff_default()`. Comment them as assumptions. Do not add `cc25_kickoff_overrides()` entries.
- Do NOT modify `tools/graphics/export.php`. Widening the graphics pipeline beyond `mens`/`reserves`/`womens` is explicitly out of scope.
- Do NOT "fix" the five items listed in the spec's "Raised, not changed" section. Leave the site as it is for those and write them up in Task 6.
- Team registry order is: `mens`, `reserves`, `womens`, `womens_res`, `womens_u19`, `u18s`, `vets`.

---

## File Structure

| File | Responsibility | Task |
| --- | --- | --- |
| `functions.php` → `cc25_static_fixtures_static()` | Hand-maintained fixture lists per team | 1, 4 |
| `inc/fixtures.php` → `cc25_fx_teams()` | The team registry — drives admin editor, reports, tickets, fixtures page | 3, 4 |
| `_tests/fixture-record-test.php` | Fixture-record and badge-coverage assertions | 1, 4 |
| `_tests/fixtures-page-test.php` (new) | Renders `template-fixtures.php` under stubs; guards the refactor | 2, 3 |
| `template-fixtures.php` | The fixtures page — seven hardcoded blocks become one loop | 3 |
| `assets/img/opponents/aberystwyth-town.png` (new) | Recovered crest | 4 |
| `tools/graphics/fixtures.json`, `tools/programme/fixtures.json` | Generated, not edited | 5 |
| `docs/2026-08-11-club-fixture-queries.md` (new) | The five items to put to the club | 6 |

**Commit hygiene note:** Task 4 merges both new teams with the crest fix into ONE commit. The badge-coverage test is an equality check against a named list, so it cannot be green until both teams AND the extended list exist. Splitting them would commit a red suite twice. No commit in this plan leaves the suite failing.

---

### Task 1: Correct the two Reserves venues

The only fixture corrections in the whole list. Both are Men's Reserves v Tredegar Town.

**Files:**
- Modify: `wordpress-theme/cwmbran-celtic-2025/functions.php` (the `reserves` block in `cc25_static_fixtures_static()`)
- Test: `wordpress-theme/cwmbran-celtic-2025/_tests/fixture-record-test.php`

**Interfaces:**
- Consumes: `cc25_static_fixtures_static()` returning `array<teamKey, array{league:string, title:string, badge:array, list:array}>`, each `list` row being `array(string $ymd, string $opponent, bool $isHome, string $competition, ?array $score)`.
- Produces: nothing new.

- [ ] **Step 1: Write the failing test**

Append to `_tests/fixture-record-test.php`, just before the final summary/exit block:

```php
/* The club's list of 11 Aug 2026 swapped the venue on both Reserves v Tredegar
 * Town games — 5 September was ours, 12 December was theirs. Their sheet tags
 * these "Was Home" and "Was Away" respectively. */
$res = cc25_static_fixtures_static()['reserves']['list'];
function cc25_t_row($list, $ymd, $opp) {
    foreach ($list as $r) if ($r[0] === $ymd && $r[1] === $opp) return $r;
    return null;
}
$sep = cc25_t_row($res, '2026-09-05', 'Tredegar Town');
$dec = cc25_t_row($res, '2026-12-12', 'Tredegar Town');
check('Reserves v Tredegar Town, 5 Sep, is AWAY', $sep !== null && empty($sep[2]));
check('Reserves v Tredegar Town, 12 Dec, is HOME', $dec !== null && !empty($dec[2]));
```

- [ ] **Step 2: Run test to verify it fails**

Run from `wordpress-theme/cwmbran-celtic-2025/`:
```bash
php _tests/fixture-record-test.php
```
Expected: FAIL on "Reserves v Tredegar Town, 5 Sep, is AWAY" (currently home) and on the 12 Dec check (currently away).

- [ ] **Step 3: Make the change**

In `functions.php`, in the `reserves` list, change these two rows:

```php
// was: array('2026-09-05', 'Tredegar Town', true, 'League'),
array('2026-09-05', 'Tredegar Town', false, 'League'),  // club's 11 Aug list: "Was Home"
```
```php
// was: array('2026-12-12', 'Tredegar Town', false, 'League'),
array('2026-12-12', 'Tredegar Town', true, 'League'),   // club's 11 Aug list: "Was Away"
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
php _tests/fixture-record-test.php
php _tests/upcoming-test.php
php _tests/tickets-test.php
```
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/functions.php wordpress-theme/cwmbran-celtic-2025/_tests/fixture-record-test.php
git commit -m "fix(theme): Reserves v Tredegar Town venues, per the club's 11 Aug list

Two swaps, both flagged by the club themselves: 5 September was down as home
and is away, 12 December was away and is home. The only fixture corrections in
a list of 109 rows — the rest already matched."
```

---

### Task 2: A render harness for the fixtures page

The refactor in Task 3 is only safe if we can prove the five live teams render identically. Nothing in `_tests/` renders a template today, so build that first, against the CURRENT seven-block template.

**Files:**
- Create: `wordpress-theme/cwmbran-celtic-2025/_tests/fixtures-page-test.php`

**Interfaces:**
- Consumes: `template-fixtures.php`, `cc25_static_fixtures()`, `cc25_fx_teams()`.
- Produces: `cc25_render_fixtures_page(): string` — renders the template under WordPress stubs and returns the HTML. Task 3 relies on this exact name.

- [ ] **Step 1: Write the harness and its assertions**

Create `_tests/fixtures-page-test.php`:

```php
<?php
/**
 * Assertions over the rendered fixtures page. Run from the theme root:
 *   php _tests/fixtures-page-test.php
 *
 * This exists because the page repeated a near-identical block per team, and
 * copy-paste already shipped a bug: the Under-18s and Vets blocks were copied
 * from the Women's block and inherited its league name and its squad link. The
 * page is now one loop, and these assertions are what stop a team picking up
 * another team's copy again.
 *
 * Also used as a before/after snapshot: --dump writes the rendered HTML so the
 * refactor can be proved to change nothing for the teams already live.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
function esc_url($u) { return htmlspecialchars((string) $u, ENT_QUOTES); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function add_query_arg($k, $v, $u) { return $u . (strpos($u, '?') === false ? '?' : '&') . $k . '=' . rawurlencode($v); }
function home_url($p = '') { return 'https://www.cwmbranceltic.com' . $p; }
function get_page_by_path($s) { return null; }
function get_permalink($p = 0) { return 'https://www.cwmbranceltic.com/'; }
function get_template_part($slug, $name = null) { echo "<!--part:$slug-->"; }
// Needed by cc25_crest() -> cc25_own_crest() -> cc25_club_logo(), which the
// results loop reaches because the Men's list carries hand-recorded scores.
function get_stylesheet_directory_uri() { return 'https://www.cwmbranceltic.com/wp-content/themes/cwmbran-celtic-2025'; }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

/** Render template-fixtures.php under the stubs above and return the HTML. */
function cc25_render_fixtures_page() {
    ob_start();
    include __DIR__ . '/../template-fixtures.php';
    return (string) ob_get_clean();
}

$html = cc25_render_fixtures_page();

if (in_array('--dump', $argv, true)) { echo $html; exit(0); }

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    echo "  FAIL  $label\n"; $failures[] = $label;
}

/* Every team in the registry gets a selector button and a wrapper. */
$teams = cc25_fx_teams();
foreach ($teams as $key => $label) {
    check("selector has a button for $key", strpos($html, 'data-team="' . $key . '"') !== false);
    check("page has a wrapper for $key", strpos($html, 'id="team-' . $key . '"') !== false);
}

/* A team must show its OWN league name, not a neighbour's. This is the exact
 * bug that shipped when blocks were copied. */
$sf = cc25_static_fixtures();
foreach ($teams as $key => $label) {
    if (!isset($sf[$key]['league'])) continue;
    $start = strpos($html, 'id="team-' . $key . '"');
    check("$key wrapper exists for the league check", $start !== false);
    if ($start === false) continue;
    $end = strpos($html, '<!-- /#team-', $start);
    $block = substr($html, $start, ($end === false ? strlen($html) : $end) - $start);
    check("$key shows its own league name", strpos($block, esc_html($sf[$key]['league'])) !== false);
    foreach ($sf as $other => $data) {
        if ($other === $key || !isset($data['league']) || $data['league'] === $sf[$key]['league']) continue;
        check("$key does not show $other's league name", strpos($block, esc_html($data['league'])) === false);
    }
}

echo $failures ? "\n" . count($failures) . " FAILED\n" : "\nall passed\n";
exit($failures ? 1 : 0);
```

- [ ] **Step 2: Run it against the current template**

```bash
php _tests/fixtures-page-test.php
```
Expected: the five current teams PASS every check. This proves the harness works before it is trusted.

If a "does not show another team's league name" check fails here, that is a REAL pre-existing bug in the current template — stop and report it rather than weakening the assertion.

- [ ] **Step 3: Capture the baseline snapshot**

```bash
php _tests/fixtures-page-test.php --dump > /tmp/fixtures-before.html
wc -c /tmp/fixtures-before.html
```
Expected: a non-empty HTML file. Keep it; Task 3 diffs against it.

- [ ] **Step 4: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/_tests/fixtures-page-test.php
git commit -m "test(theme): render the fixtures page and assert each team owns its own copy

Nothing in _tests rendered a template before. The fixtures page repeats a
near-identical block per team, and that copy-paste already shipped a bug where
the U18s and Vets blocks carried the Women's league name and squad link.

Passes against the current template, so it is trustworthy before the refactor
it exists to protect."
```

---

### Task 3: One loop instead of seven blocks

**Files:**
- Modify: `wordpress-theme/cwmbran-celtic-2025/template-fixtures.php`
- Modify: `wordpress-theme/cwmbran-celtic-2025/inc/fixtures.php` (add per-team presentation data)

**Interfaces:**
- Consumes: `cc25_render_fixtures_page()` from Task 2; `cc25_fx_teams(): array<string,string>`; `cc25_static_fixtures(): array<string, array{league:string,...,list:array}>`; `cc25_render_static_fixtures(array $list, string $teamKey): void`; `cc25_render_static_results(string $teamKey): void`.
- Produces: `cc25_fx_team_meta(string $key): array{squad_slugs: string[], squad_label: string}` — Task 4 adds entries to it.

- [ ] **Step 1a: Reconcile the registry order with the page order — do this first**

⚠️ **The registry and the page disagree today.** `cc25_fx_teams()` returns
`mens, womens, reserves, u18s, vets`, but `template-fixtures.php` renders the
selector as `mens, reserves, womens, u18s, vets`. Nothing notices, because the
page never reads the registry. The moment the loop does, Reserves and Women's
swap places on the live site — and the byte-for-byte diff in Step 4 will fail.

Reorder `cc25_fx_teams()` in `inc/fixtures.php` to match what the page shows
today:

```php
/** team key => label, in the order the club thinks about them — and the order
 *  the fixtures page renders them, which now reads this list. */
function cc25_fx_teams() {
    return array(
        'mens'     => "Men's First Team",
        'reserves' => "Men's Reserves",
        'womens'   => "Women's First Team",
        'u18s'     => "Under-18s",
        'vets'     => "Men's Vets",
    );
}
```

This also reorders the team dropdown in the WP admin fixture editor, the match
report team list and the tickets team list. All three are cosmetic orderings and
all three become consistent with the public page, which is an improvement.

- [ ] **Step 1b: Add the per-team presentation data**

In `inc/fixtures.php`, after `cc25_fx_teams()`, add:

```php
/** Presentation data the fixtures page needs per team, kept beside the team
 * registry so a new team is one entry in two places rather than a copied block.
 *  - squad_slugs: candidate page slugs for the team's squad page, first match wins
 *  - squad_label: the button's text; '' means the team has no squad page yet */
function cc25_fx_team_meta($key) {
    $meta = array(
        'mens'     => array('squad_slugs' => array('mens-team', 'mens-1st-team'),     'squad_label' => "Men's First Team squad"),
        'reserves' => array('squad_slugs' => array(),                                 'squad_label' => "Men's Reserves"),
        'womens'   => array('squad_slugs' => array('ladies-team', 'ladies-1st-team'), 'squad_label' => "Women's First Team squad"),
        'u18s'     => array('squad_slugs' => array(), 'squad_label' => ''),
        'vets'     => array('squad_slugs' => array(), 'squad_label' => ''),
    );
    return isset($meta[$key]) ? $meta[$key] : array('squad_slugs' => array(), 'squad_label' => '');
}
```

Note: `reserves` keeps its existing `cc25_reserves_url()` link, so the loop must special-case an empty `squad_slugs` with a non-empty `squad_label` by calling `cc25_reserves_url()`. Keep that behaviour exactly as it is today.

- [ ] **Step 2: Run the harness to confirm nothing has changed yet**

```bash
php _tests/fixtures-page-test.php --dump > /tmp/fixtures-step2.html
diff /tmp/fixtures-before.html /tmp/fixtures-step2.html && echo "IDENTICAL"
```
Expected: `IDENTICAL`. Reordering the registry and adding a function that nothing
calls yet must both be invisible to the page, because the page does not read the
registry until Step 3. If this diff is non-empty, something already read
`cc25_fx_teams()` that this plan did not account for — stop and investigate.

- [ ] **Step 3: Replace the per-team blocks with a loop**

In `template-fixtures.php`, replace the hardcoded `$cc25_res_league` / `$cc25_womens` / `$cc25_u18s` / `$cc25_vets` variable assignments and the five `teamwrap` blocks. The Men's First Team block keeps its bespoke markup (it is the only team with a live feed, results merge and league table); the other teams become one loop.

Replace the selector with:

```php
    <div class="teamsel">
      <?php $cc25_first = true; foreach (cc25_fx_teams() as $cc25_k => $cc25_label): ?>
      <button<?php echo $cc25_first ? ' class="on"' : ''; ?> data-team="<?php echo esc_attr($cc25_k); ?>"><?php echo esc_html($cc25_label); ?></button>
      <?php $cc25_first = false; endforeach; ?>
    </div>
```

Replace the four non-Men's `teamwrap` blocks with:

```php
<?php foreach (cc25_fx_teams() as $cc25_k => $cc25_label):
    if ($cc25_k === 'mens') continue;                       // bespoke block above
    if (!isset($cc25_sf[$cc25_k])) continue;                // no fixture list yet
    $cc25_meta = cc25_fx_team_meta($cc25_k);
    $cc25_squad = '';
    if ($cc25_meta['squad_label'] !== '') {
        $cc25_squad = $cc25_meta['squad_slugs']
            ? cc25_page_url($cc25_meta['squad_slugs'], home_url('/'))
            : cc25_reserves_url();
    }
?>
<div class="teamwrap" id="team-<?php echo esc_attr($cc25_k); ?>" hidden>
  <section class="band">
    <div class="wrap">
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> <?php echo esc_html($cc25_sf[$cc25_k]['league']); ?></div><h2><?php echo esc_html($cc25_label); ?> &mdash; Fixtures &amp; Results</h2></div></div>
      <?php if ($cc25_squad !== ''): ?>
      <div class="team-links reveal">
        <a class="btn btn-navy btn-sm" href="<?php echo esc_url($cc25_squad); ?>"><?php echo esc_html($cc25_meta['squad_label']); ?> &rarr;</a>
      </div>
      <?php endif; ?>
      <div class="tabs reveal">
        <button class="tab on" data-t="<?php echo esc_attr($cc25_k); ?>-fx">Fixtures</button>
        <button class="tab" data-t="<?php echo esc_attr($cc25_k); ?>-res">Results</button>
      </div>
      <div class="panel on" id="<?php echo esc_attr($cc25_k); ?>-fx"><?php cc25_render_static_fixtures($cc25_sf[$cc25_k]['list'], $cc25_k); ?></div>
      <div class="panel" id="<?php echo esc_attr($cc25_k); ?>-res"><?php cc25_render_static_results($cc25_k); ?></div>
    </div>
  </section>
</div><!-- /#team-<?php echo esc_attr($cc25_k); ?> -->
<?php endforeach; ?>
```

**Watch the panel ids.** Today Reserves and Women's use `reserves-fx` / `womens-fx`, and U18s and Vets use `u18s-fx` / `vets-fx` — the loop produces exactly these, so the tab JavaScript keeps working. Confirm no id changes in the diff.

- [ ] **Step 4: Prove the five live teams are unchanged**

```bash
php _tests/fixtures-page-test.php --dump > /tmp/fixtures-after.html
diff /tmp/fixtures-before.html /tmp/fixtures-after.html
```
Expected: **no output** — byte-for-byte identical. Whitespace differences count as failures; adjust the template until the diff is empty. Do not proceed with a non-empty diff.

- [ ] **Step 5: Run the full test set**

```bash
php _tests/fixtures-page-test.php
php _tests/fixture-record-test.php
php _tests/upcoming-test.php
php _tests/tickets-test.php
php _tests/kickoff-test.php
```
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/template-fixtures.php wordpress-theme/cwmbran-celtic-2025/inc/fixtures.php
git commit -m "refactor(theme): the fixtures page loops over the team registry

Five near-identical blocks, each a copy of the last with the names edited. That
pattern already shipped a bug — the U18s and Vets blocks inherited the Women's
league name and a link to the women's squad page — and two more teams were about
to become two more copies.

The Men's First Team keeps its bespoke block: it is the only team with a live
feed, merged results and a league table. The rest are one loop over
cc25_fx_teams(), with league name, squad link and tabs supplied as data.

The rendered page is byte-for-byte identical for all five teams already live."
```

---

### Task 4: Both new women's teams, and the crests

Women's Reserves and Women's U19s land together with the badge-coverage fix, as **one commit**. They are merged deliberately: the badge check is an equality assertion against a named list, so it cannot be green until both teams exist *and* the crest list is extended. Splitting them would mean committing a red suite twice.

**Files:**
- Modify: `wordpress-theme/cwmbran-celtic-2025/inc/fixtures.php` (`cc25_fx_teams()`, `cc25_fx_team_meta()`)
- Modify: `wordpress-theme/cwmbran-celtic-2025/functions.php` (`cc25_static_fixtures_static()`)
- Create: `wordpress-theme/cwmbran-celtic-2025/assets/img/opponents/aberystwyth-town.png` (copied, not drawn)
- Test: `wordpress-theme/cwmbran-celtic-2025/_tests/fixture-record-test.php`

**Interfaces:**
- Consumes: `cc25_fx_team_meta()` from Task 3, with keys `squad_slugs` and `squad_label` only.
- Produces: team keys `womens_res` and `womens_u19`.

- [ ] **Step 1: Write the failing tests**

Append to `_tests/fixture-record-test.php`, before the final summary/exit block:

```php
/* Women's U19s — new with the club's list of 11 Aug 2026. Adran U19s, Friday
 * nights. The club's list covers the first half of the season only; it ends on
 * 20 November and that is not a truncated sheet. */
$u19 = cc25_static_fixtures_static()['womens_u19']['list'];
check('Women\'s U19s have the club\'s eleven fixtures', count($u19) === 11);
check('Women\'s U19s open at home to Pontypridd United on 11 Sep',
    $u19[0][0] === '2026-09-11' && $u19[0][1] === 'Pontypridd United' && !empty($u19[0][2]));
check('Women\'s U19s finish away to Cardiff City on 20 Nov',
    $u19[10][0] === '2026-11-20' && $u19[10][1] === 'Cardiff City' && empty($u19[10][2]));
check('every Women\'s U19s game is a Friday', count(array_filter($u19, function ($r) {
    return date('N', strtotime($r[0])) != 5;
})) === 0);
check('Women\'s U19s are in the team registry', isset(cc25_fx_teams()['womens_u19']));

/* Women's Reserves — also new with the 11 Aug list. SWWGL Development League,
 * Sundays. These exist ONLY on the workbook's "Womens (Reserves)" sheet; the
 * master "This Year Games" tab omits the team entirely.
 *
 * The club has them down for two home games on Sunday 4 October (rounds 4 and 6).
 * That is imported as given and raised with the club — see
 * docs/2026-08-11-club-fixture-queries.md. The duplicate is asserted here so that
 * when the club corrects it, this test tells us to update the record. */
$wres = cc25_static_fixtures_static()['womens_res']['list'];
check('Women\'s Reserves have the club\'s eighteen fixtures', count($wres) === 18);
check('Women\'s Reserves open at home to Undy on 6 Sep',
    $wres[0][0] === '2026-09-06' && $wres[0][1] === 'Undy' && !empty($wres[0][2]));
check('every Women\'s Reserves game is a Sunday', count(array_filter($wres, function ($r) {
    return date('N', strtotime($r[0])) != 7;
})) === 0);
$oct4 = array_values(array_filter($wres, function ($r) { return $r[0] === '2026-10-04'; }));
check('the club\'s 4 Oct double booking is carried as-is, pending their answer', count($oct4) === 2);
check('Women\'s Reserves are in the team registry', isset(cc25_fx_teams()['womens_res']));
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php _tests/fixture-record-test.php
```
Expected: FAIL — neither `womens_u19` nor `womens_res` is a key yet. PHP warnings on the undefined indexes are expected at this point.

- [ ] **Step 3: Add both teams to the registry**

In `inc/fixtures.php`, `cc25_fx_teams()` — women's teams grouped, existing five keeping the order Task 3 established:

```php
function cc25_fx_teams() {
    return array(
        'mens'       => "Men's First Team",
        'reserves'   => "Men's Reserves",
        'womens'     => "Women's First Team",
        'womens_res' => "Women's Reserves",
        'womens_u19' => "Women's U19s",
        'u18s'       => "Under-18s",
        'vets'       => "Men's Vets",
    );
}
```

And add both to `cc25_fx_team_meta()`'s `$meta` array — neither has a squad page:

```php
        'womens_res' => array('squad_slugs' => array(), 'squad_label' => ''),
        'womens_u19' => array('squad_slugs' => array(), 'squad_label' => ''),
```

- [ ] **Step 4: Add the Women's Reserves fixture list**

In `functions.php`, in `cc25_static_fixtures_static()`, after the `womens` block:

```php
        /* Women's Reserves. New to the site with the club's list of 11 Aug 2026.
         * SWWGL Development League, Sundays, so kick-off falls to the 2pm Sunday
         * default — ASSUMED, not confirmed by the club.
         *
         * Source is the workbook's "Womens (Reserves)" sheet alone; the master tab
         * does not list the team. Rows below the league block on that sheet are last
         * season's and are excluded.
         *
         * Their round numbers run out of order and skip 3 and 10, and rounds 4 and 6
         * are BOTH given as home on 4 October. Carried as the club has it, and raised
         * with them — see docs/2026-08-11-club-fixture-queries.md.
         * Three of these opponents have no crest and show initials. */
        'womens_res' => array(
            'league' => 'SWWGL Women\'s Development League',
            'title'  => "Women's Reserves",
            'badge'  => array('WRes', 'tk-team-w'),
            'list'   => array(
                array('2026-09-06', 'Undy', true, 'League'),
                array('2026-09-13', 'Taffs Well', false, 'League'),
                array('2026-09-27', 'Goytre', false, 'League'),
                array('2026-10-04', 'Porth Harlequins BGC', true, 'League'),
                array('2026-10-04', 'North Cardiff Cosmos', true, 'League'),  // club has two home games this day
                array('2026-10-11', 'Caerphilly Dragons', false, 'League'),
                array('2026-10-18', 'Undy', false, 'League'),
                array('2026-10-25', 'Taffs Well', true, 'League'),
                array('2026-11-08', 'Porth Harlequins BGC', false, 'League'),
                array('2026-11-15', 'Goytre', true, 'League'),
                array('2026-11-22', 'North Cardiff Cosmos', false, 'League'),
                array('2026-11-29', 'Caerphilly Dragons', true, 'League'),
                array('2026-12-06', 'Goytre', false, 'League'),
                array('2026-12-13', 'North Cardiff Cosmos', true, 'League'),
                array('2026-12-20', 'Undy', true, 'League'),
                array('2027-01-10', 'Caerphilly Dragons', false, 'League'),
                array('2027-01-17', 'Taffs Well', true, 'League'),
                array('2027-01-24', 'Porth Harlequins BGC', true, 'League'),
            ),
        ),
```

- [ ] **Step 5: Add the Women's U19s fixture list**

Immediately after the `womens_res` block:

```php
        /* Women's U19s. New to the site with the club's list of 11 Aug 2026. Friday
         * nights, so kick-off falls to the midweek default of 7:30pm — that time is
         * ASSUMED, not confirmed by the club, and should become an explicit
         * cc25_kickoff_overrides() entry once real times are known.
         * The list covers the first half of the season only; it genuinely ends on
         * 20 November. Five of these opponents have no crest and show initials. */
        'womens_u19' => array(
            'league' => 'Adran U19s',
            'title'  => "Women's U19s",
            'badge'  => array('U19', 'tk-team-w'),
            'list'   => array(
                array('2026-09-11', 'Pontypridd United', true, 'League'),
                array('2026-09-18', 'Penybont', false, 'League'),
                array('2026-09-25', 'Briton Ferry Llansawel', true, 'League'),
                array('2026-10-02', 'Barry Town United', false, 'League'),
                array('2026-10-09', 'Taffs Well', true, 'League'),
                array('2026-10-16', 'Cardiff Met', false, 'League'),
                array('2026-10-23', 'Carmarthen Town', true, 'League'),
                array('2026-10-30', 'Cascade YC', true, 'League'),
                array('2026-11-06', 'Swansea City', false, 'League'),
                array('2026-11-13', 'Aberystwyth Town', true, 'League'),
                array('2026-11-20', 'Cardiff City', false, 'League'),
            ),
        ),
```

- [ ] **Step 6: Copy the crest that already exists**

Aberystwyth Town has artwork on the Next.js side but not in the theme. Run from the repo root:

```bash
cp public/images/opponents/aberystwyth-town.png \
   wordpress-theme/cwmbran-celtic-2025/assets/img/opponents/aberystwyth-town.png
file wordpress-theme/cwmbran-celtic-2025/assets/img/opponents/aberystwyth-town.png
```
Expected: `PNG image data, 139 x 181`.

- [ ] **Step 7: Check the remaining badge gap before editing the list**

```bash
php _tests/fixture-record-test.php
```
Expected: the team checks now PASS, and the badge check FAILS with `unexpected:` naming exactly eight opponents — Barry Town United, Briton Ferry Llansawel, Caerphilly Dragons, Cardiff City, Cardiff Met, North Cardiff Cosmos, Porth Harlequins BGC, Swansea City.

If the list differs, stop and report — the fixture data above is wrong somewhere.

- [ ] **Step 8: Extend the known-gaps list**

In `_tests/fixture-record-test.php`, replace the comment and array at lines 112-123:

```php
/* Every suggested name should resolve to a badge, or the editor's hint lies.
 * Nineteen do not: the Under-18s and Vets arrived with the club's list of 10 Aug
 * 2026, and the Women's Reserves and Women's U19s with the list of 11 Aug, and
 * most of their opponents have no artwork on file. Those rows show initials,
 * which is handled, and the fixture editor warns when a name has no badge.
 *
 * Listed explicitly rather than the check being relaxed, so a TWENTIETH
 * badge-less opponent fails here and gets a decision instead of quietly showing
 * initials. Connor is collecting the missing artwork from the club. */
$known_gaps = array(
    'Caerleon', 'Caldicot Town Dev', 'Coed Eva Athletic', 'Graig Villa Dino',
    'Llanyrafon', 'Monmouth Town', 'Penygraig United', 'Ponthir',
    'Riverside Rovers', 'Sifil', 'Tata Steel United',
    'Barry Town United', 'Briton Ferry Llansawel', 'Caerphilly Dragons',
    'Cardiff City', 'Cardiff Met', 'North Cardiff Cosmos',
    'Porth Harlequins BGC', 'Swansea City',
);
```

- [ ] **Step 9: Run the full test set — everything must be green**

```bash
php _tests/fixture-record-test.php
php _tests/fixtures-page-test.php
php _tests/upcoming-test.php
php _tests/tickets-test.php
php _tests/kickoff-test.php
```
Expected: **all PASS**, with no failures anywhere. The page test now covers seven teams and asserts each shows its own league name. Do not commit with any check red.

- [ ] **Step 10: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/functions.php \
        wordpress-theme/cwmbran-celtic-2025/inc/fixtures.php \
        wordpress-theme/cwmbran-celtic-2025/_tests/fixture-record-test.php \
        wordpress-theme/cwmbran-celtic-2025/assets/img/opponents/aberystwyth-town.png
git commit -m "feat(theme): Women's Reserves and Women's U19s, from the club's 11 Aug list

Two teams the site has never carried. Women's Reserves: SWWGL Development
League, eighteen fixtures, Sundays — and they exist only on the workbook's own
sheet, because the club's master tab does not list the team at all. Women's
U19s: Adran U19s, eleven fixtures, Friday nights, ending 20 November because the
list covers the first half of the season, not because the sheet is cut short.

Kick-offs fall to the 2pm Sunday and 7:30pm midweek defaults. Both are
assumptions and are commented as such — the club has not given times.

The Women's Reserves round numbers run out of order, skip 3 and 10, and put
rounds 4 and 6 both at home on 4 October. Carried exactly as the club has it and
raised with them rather than quietly corrected; a test pins the double booking so
their answer forces an update here.

Aberystwyth Town already had artwork on the Next.js side and not in the theme,
so it is a copy rather than a gap. That leaves eight new badge-less opponents on
top of the eleven from the U18s and Vets — still an equality check against a
named list, so a twentieth fails with its name printed."
```

---
### Task 5: Regenerate the tools' fixture data

`tools/graphics/fixtures.json` and `tools/programme/fixtures.json` are generated from the theme, never hand-edited.

**Files:**
- Modify (generated): `tools/graphics/fixtures.json`, `tools/programme/fixtures.json`
- Do NOT modify: `tools/graphics/export.php`

- [ ] **Step 1: Regenerate**

```bash
cd tools/graphics && php export.php && cd ../..
git diff --stat tools/
```
Expected: both JSON files change. `export.php` walks `mens`, `reserves` and `womens` only, so the only substantive change is the Reserves v Tredegar Town venue on 5 September; the two new teams will NOT appear, and that is correct and intended.

- [ ] **Step 2: Confirm the change is only what is expected**

```bash
git diff tools/graphics/fixtures.json | grep -E '^[-+].*(Tredegar|"home"|"date")' | head -20
```
Expected: the 5 September Tredegar Town entry flipping to away. If entries for `womens_res` or `womens_u19` appear, `export.php` has been modified — revert it.

- [ ] **Step 3: Commit**

```bash
git add tools/graphics/fixtures.json tools/programme/fixtures.json
git commit -m "chore(graphics): regenerate fixture data after the 11 Aug list

Generated by export.php, which still covers Men's, Reserves and Women's only.
The two new women's teams are deliberately absent — widening the graphics
pipeline to all seven teams is its own piece of work."
```

---

### Task 6: Write up the queries for the club

**Files:**
- Create: `docs/2026-08-11-club-fixture-queries.md`

- [ ] **Step 1: Write the document**

```markdown
# Queries on the fixture list of 11 August 2026

The list has been applied to the website. These five items were left exactly as
the site already had them, because the list either contradicts itself or looks
wrong. Nothing below has been guessed at.

## 1. Women's Reserves are down for two home games on the same afternoon

Sunday 4 October, both at home: **Porth Harlequins BGC** (round 4) and **North
Cardiff Cosmos** (round 6).

The sheet's round numbers also run out of order — round 5 sits above round 4 —
and rounds 3 and 10 are missing entirely, so the sheet holds 18 games where the
numbering implies 20.

Which of the two is on 4 October, and what are the dates for rounds 3 and 10?

## 2. The Under-18s list skips rounds 5 and 19

Otherwise a complete 28-game season. Two games are unaccounted for rather than
played. Are they still to be scheduled?

## 3. The Amateur Trophy round is given twice, differently

The tie away to Penygraig United on 5 September is "R1" on the master tab and
"QR2" on the note recording the Goytre postponement. The site says R1. Which is
right?

## 4. Reserves v Cwmbran Town — has the move been agreed?

The list notes you have *asked* for Saturday 19 September to move to Friday 18
September. The site still shows the 19th, since a request is not a fixture
change. Say the word once it is confirmed.

## 5. "Cardiff Corries" and "Cardiff Corinthians"

Both spellings appear on different sheets for the same club. The site uses
Cardiff Corinthians — it is the form that resolves to the club crest.

---

## Not queries, just so you know

- **Reserves v Rogerstone, 21 August.** The master tab labels it "Sat"; the date
  is a Friday, and your Reserves sheet says Friday with a 6:30pm kick-off. The
  site has it as Friday.

- **Kick-off times for the two new teams are assumed.** Women's U19s Friday games
  show 7:30pm and Women's Reserves Sunday games show 2:00pm, because those are
  the site's defaults for those days. Real times would be better.

- **Eight opponents have no club crest on file** and currently show initials:
  Barry Town United, Briton Ferry Llansawel, Caerphilly Dragons, Cardiff City,
  Cardiff Met, North Cardiff Cosmos, Porth Harlequins BGC, Swansea City. Artwork
  for any of them is welcome.
```

- [ ] **Step 2: Commit**

```bash
git add docs/2026-08-11-club-fixture-queries.md
git commit -m "docs: five queries on the club's 11 Aug fixture list

The unambiguous parts are live. These five contradict the list itself or look
wrong, so the site keeps what it had and the club gets asked."
```

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
| --- | --- |
| Two Reserves venue changes | 1 |
| Men's 24 Oct / Reserves 15 Aug + 21 Nov are non-changes | — (no action by design) |
| Women's Reserves added | 4 |
| Women's U19s added | 4 |
| Both in `cc25_fx_teams()` | 4 |
| Fixtures page loop, five teams render identically | 2, 3 |
| Kick-offs assumed and commented | 4 |
| Aberystwyth crest recovered | 4 |
| Badge test to nineteen names, comment updated | 4 |
| Tools JSON regenerated, `export.php` untouched | 5 |
| Five items raised not changed | 4 (test pin), 6 (write-up) |

**Placeholder scan:** No TBD/TODO. Every code step carries real code. Task 6's document is written out in full rather than described.

**Type consistency:** `cc25_render_fixtures_page()` is defined in Task 2 and consumed in Task 3. `cc25_fx_team_meta()` is defined in Task 3 with keys `squad_slugs` and `squad_label`, and extended with those same two keys in Task 4. Team keys `womens_res` and `womens_u19` are spelled identically in the registry, the fixture lists and the tests.

**Registry order:** Task 3 sets the five-team order to `mens, reserves, womens, u18s, vets` to match what the page renders today; Task 4 inserts `womens_res, womens_u19` after `womens`. The Global Constraints order is the end state after Task 4.
