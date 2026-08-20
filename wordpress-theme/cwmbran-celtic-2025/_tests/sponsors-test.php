<?php
/**
 * Assertions over the sponsor data and its rendering. Run from the theme root:
 *   php _tests/sponsors-test.php
 * functions.php loads standalone with these no-op stubs; WordPress never loads
 * this file.
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
function get_page_by_path($s) { return $s === 'match-report' ? (object) array('ID' => 1) : null; }
function get_permalink($p = 0) { return 'https://www.cwmbranceltic.com/match-report/'; }
function get_stylesheet_directory_uri() { return 'https://www.cwmbranceltic.com/wp-content/themes/cwmbran-celtic-2025'; }
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
    check('the partner section says partner, not sponsored', stripos($html, 'Charity Partner') !== false
        && stripos($html, 'Sponsored by') === false);
    check('the partner section names each partner', count(array_filter($partners, function ($p) use ($html) {
        return strpos($html, esc_attr($p['name'])) !== false;
    })) === count($partners));
}

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

/* ---- The sponsor wall tile (home page + /sponsors) -------------------- */
// Non-tautological: build rows by hand rather than counting the live roster,
// so this fails if cc25_sponsor_card_html() ever stops emitting the class —
// distinct from the band assertion above, which only counts occurrences.
$dark_row  = array('name' => 'Test Dark', 'slug' => 'test-dark', 'file' => 'x.png', 'dark' => true);
$light_row = array('name' => 'Test Light', 'slug' => 'test-light', 'file' => 'x.png', 'dark' => false);
check('a dark sponsor gets sponsor-card-dark on the wall',
    strpos(cc25_sponsor_card_html($dark_row, ''), 'sponsor-card-dark') !== false);
check('a non-dark sponsor does not get sponsor-card-dark on the wall',
    strpos(cc25_sponsor_card_html($light_row, ''), 'sponsor-card-dark') === false);

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

// The Music Shirts page keeps its own sponsor list (campaign copy the roster
// has no field for), which must not drift from the roster it duplicates —
// an unresolvable slug there would silently fail to route through /go/.
$kit_sponsors = cc25_kit_launch()['sponsors'];
check('every kit-launch sponsor slug resolves to a roster sponsor', count(array_filter($kit_sponsors, function ($sp) {
    return cc25_sponsor_by_slug($sp['slug']) !== null;
})) === count($kit_sponsors));

/* ---- Sponsor click months (the arithmetic trap) ----------------------- */
// strtotime("-$i month") overflows into the next month when the day-of-month
// doesn't exist in the target month (e.g., Jan 31 minus 1 month becomes Feb 3).
// The old code would collapse twelve distinct months into seven, silently
// dropping November and September on years anchored to the 29th–31st.
// Test at 2026-12-31 and 2026-03-31, which are the problem dates.
$months_dec31 = cc25_sponsor_click_months(strtotime('2026-12-31'));
check('2026-12-31 yields twelve months', count($months_dec31) === 12);
check('2026-12-31 yields twelve distinct months', count(array_unique($months_dec31)) === 12);
check('2026-12-31 months run newest-first (Dec→Jan)', $months_dec31[0] === '2026-12' && $months_dec31[11] === '2026-01');

$months_mar31 = cc25_sponsor_click_months(strtotime('2026-03-31'));
check('2026-03-31 yields twelve months', count($months_mar31) === 12);
check('2026-03-31 yields twelve distinct months', count(array_unique($months_mar31)) === 12);
check('2026-03-31 months run newest-first (Mar→Apr)', $months_mar31[0] === '2026-03' && $months_mar31[11] === '2025-04');

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

/* ---- Ticker ----------------------------------------------------------- */
$tk = cc25_ticker_items();
// Sponsor items are placed every fifth fixture, so out of season there may be
// none to place. Assert the placement only when there are enough fixtures —
// otherwise this test fails every June for no reason.
$tk_sponsors = substr_count($tk, 'tk-sponsor');
$tk_fixtures = substr_count($tk, 'tk-item') - $tk_sponsors;
if ($tk_fixtures >= 5) {
    check('the ticker carries a sponsor item', $tk_sponsors > 0);
    $tk_sponsor = cc25_featured_sponsor();
    check('the ticker names the rotating sponsor', strpos($tk, esc_html($tk_sponsor['name'])) !== false);
    // Five roster sponsors ship without a website and render unlinked, so asserting
    // a /go/ link unconditionally fails on the ~28% of days the rotation lands on
    // one of them — with the code behaving exactly as specified.
    if ($tk_sponsor['url'] !== '') {
        check('the ticker sponsor links through /go/', strpos($tk, '/go/' . $tk_sponsor['slug']) !== false);
    } else {
        check('a sponsor with no website is named but not linked', strpos($tk, '/go/') === false);
    }
    check('fixtures outnumber sponsors in the ticker', $tk_fixtures > $tk_sponsors * 2);
} else {
    check('too few upcoming fixtures to place a sponsor (out of season)', true);
}

/* ---- The 2026/27 additions -------------------------------------------- */
check('the paid roster is twenty-two', count(cc25_sponsors()) === 22);
foreach (array('airbond', 'gmb-union', 'pc-wannell', 'range-after-care') as $new) {
    check("$new is a paid sponsor", cc25_sponsor_by_slug($new) !== null);
}
// MVT is a partner the club supports, never a sponsor who pays it.
check('MVT is not a paid sponsor', cc25_sponsor_by_slug('mvt') === null);
$mvt = array_values(array_filter(cc25_charity_partners(), function ($p) { return $p['slug'] === 'mvt'; }));
check('MVT is a charity partner', count($mvt) === 1);
// The white-on-black banners: without the flag these render as black bricks on
// the white sponsor card, which is the whole reason the flag exists.
check('Range After Care is flagged dark', cc25_sponsor_by_slug('range-after-care')['dark'] === true);
check('MVT is flagged dark', $mvt && $mvt[0]['dark'] === true);
check('a dark sponsor gets the dark wall tile',
    strpos(cc25_sponsor_card_html(cc25_sponsor_by_slug('range-after-care'), ''), 'sponsor-card-dark') !== false);
check('the charity section gives MVT the dark tile',
    strpos(cc25_charity_partners_html(), 'sponsor-card-dark') !== false);

echo "\n";
if ($failures) { echo count($failures) . " FAILED\n"; exit(1); }
echo "all passed\n";
