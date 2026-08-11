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
