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

function add_action() {} function add_filter() {} function remove_action() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
function esc_url($u) { return htmlspecialchars((string) $u, ENT_QUOTES); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function add_query_arg($k, $v, $u) { return $u . (strpos($u, '?') === false ? '?' : '&') . $k . '=' . rawurlencode($v); }
function home_url($p = '') { return 'https://www.cwmbranceltic.com' . $p; }
function get_page_by_path($s) {
    // Stub that returns mock page objects for squad page slugs so cc25_page_url()
    // can build the correct URLs for squad links.
    $squad_pages = array(
        'mens-team', 'mens-1st-team', 'ladies-team', 'ladies-1st-team', 'mens-reserves',
        'mens-vets',
    );
    if (in_array($s, $squad_pages, true)) {
        return (object) array('ID' => 1, 'post_name' => $s);
    }
    return null;
}
function get_permalink($p = 0) {
    // Return a URL containing the page name/slug for the mock page objects.
    return is_object($p) && isset($p->post_name)
        ? 'https://www.cwmbranceltic.com/' . $p->post_name . '/'
        : 'https://www.cwmbranceltic.com/';
}
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
        if ($other === $key || !isset($data['league'])) continue;
        // If two teams share a league string, this pairwise check silently stops doing work.
        if ($data['league'] === $sf[$key]['league']) continue;
        check("$key does not show $other's league name", strpos($block, esc_html($data['league'])) === false);
    }
}

/* Teams must link to their own squad page, not another team's.
 * This was also copied along with league names in the historical bug.
 * u18s and vets were the victims — they were copied from womens and inherited
 * its squad link. So the assertion for them is critical: they must contain
 * NONE of the other teams' squad URLs.
 *
 * The Vets have their own squad page now, which makes them the live case for
 * the second half of that rule: they must reach their own page and only their
 * own. Their link resolves through cc25_vets_url(), not the generic slug
 * lookup, so it cannot land on the Reserves the way the old template's
 * label-with-no-slugs fallback would have sent it. */
$squad_urls = array(
    'mens'     => array('mens-team', 'mens-1st-team'),
    'reserves' => array('mens-reserves'),
    'womens'   => array('ladies-team', 'ladies-1st-team'),
    'vets'     => array('mens-vets'),
    // u18s has no squad link in the template.
);
foreach ($teams as $key => $label) {
    $start = strpos($html, 'id="team-' . $key . '"');
    check("$key wrapper exists for the squad link check", $start !== false);
    if ($start === false) continue;
    $end = strpos($html, '<!-- /#team-', $start);
    $block = substr($html, $start, ($end === false ? strlen($html) : $end) - $start);

    // If this team has its own squad link, check that it's there.
    if (isset($squad_urls[$key])) {
        $has_own_link = false;
        foreach ($squad_urls[$key] as $url_part) {
            if (strpos($block, $url_part) !== false) {
                $has_own_link = true;
                break;
            }
        }
        check("$key contains link to its squad page", $has_own_link);
    }

    // For ALL teams (including u18s and vets), check they don't contain other teams' squad URLs.
    foreach ($squad_urls as $other => $other_urls) {
        if ($other === $key) continue;
        foreach ($other_urls as $url_part) {
            check("$key does not contain link to $other's squad page", strpos($block, $url_part) === false);
        }
    }
}

/* Teams must appear in the page in the same order as cc25_fx_teams() returns them.
 * The page now loops over the registry, so a silent DOM reorder would mean the
 * loop stopped reading cc25_fx_teams() — every other check above would still pass. */
$team_order = array_keys($teams);
$prev_pos_selector = -1;
$team_order_ok = true;
$order_error = '';
foreach ($team_order as $key) {
    $pos_selector = strpos($html, 'data-team="' . $key . '"');
    if ($pos_selector === false) {
        $team_order_ok = false;
        $order_error = "selector button for $key not found";
        break;
    }
    if ($pos_selector < $prev_pos_selector) {
        $team_order_ok = false;
        $order_error = "team order broken: $key appears after earlier teams";
        break;
    }
    $prev_pos_selector = $pos_selector;
}
if ($team_order_ok) {
    $prev_pos_wrapper = -1;
    foreach ($team_order as $key) {
        $pos_wrapper = strpos($html, 'id="team-' . $key . '"');
        if ($pos_wrapper === false) {
            $team_order_ok = false;
            $order_error = "wrapper for $key not found";
            break;
        }
        if ($pos_wrapper < $prev_pos_wrapper) {
            $team_order_ok = false;
            $order_error = "wrapper order broken: $key appears before earlier wrappers";
            break;
        }
        $prev_pos_wrapper = $pos_wrapper;
    }
}
check('teams render in registry order' . ($order_error ? " ($order_error)" : ''), $team_order_ok);

echo $failures ? "\n" . count($failures) . " FAILED\n" : "\nall passed\n";
exit($failures ? 1 : 0);
