<?php
/**
 * The programme button on a FIXTURE row. Run from the theme root:
 *   php _tests/fixture-programme-test.php
 *
 * A programme goes up before the game, so the link has to be reachable from the
 * fixture and not only from the result it later becomes. Two things can go wrong
 * and both are silent: the button never appears (the programme is uploaded and
 * nobody can find it), or the fixture row borrows the result's buttons and
 * offers a "Match Report" for a game nobody has played.
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
function get_page_by_path($s) { return $s === 'match-report' ? (object) array('ID' => 1) : null; }
function get_stylesheet_directory_uri() { return 'https://www.cwmbranceltic.com/wp-content/themes/cwmbran-celtic-2025'; }
function get_stylesheet_directory() { return dirname(__DIR__); }

/* The match this test is about: far enough ahead that the renderer's kick-off
 * filter keeps it in the fixtures list. */
$GLOBALS['cc25_t_match'] = date('Y-m-d', strtotime('+30 days'));

/* One programme post, dated to that game. These stubs are the whole of WordPress
 * the lookup needs: it reads post dates, and the link reads post meta.
 * cc25_programme_for_date caches on its first call, so every date below is fixed
 * before anything under test runs. */
$GLOBALS['cc25_t_posts'] = array((object) array('ID' => 77));
$GLOBALS['cc25_t_dates'] = array(77 => $GLOBALS['cc25_t_match']);
$GLOBALS['cc25_t_meta']  = array(77 => array('_cc25_prog_url' => 'https://www.cwmbranceltic.com/wp-content/uploads/prog.pdf'));

function get_posts($args = array()) {
    // cc25_report_for asks for posts carrying a match-report key; there are none.
    if (isset($args['meta_key'])) return array();
    return $GLOBALS['cc25_t_posts'];
}
function get_the_date($fmt, $p) { return $GLOBALS['cc25_t_dates'][$p->ID] ?? ''; }
function get_post_meta($id, $key, $single = false) { return $GLOBALS['cc25_t_meta'][$id][$key] ?? ''; }
function get_permalink($p = 0) { return 'https://www.cwmbranceltic.com/programme-' . (is_object($p) ? $p->ID : $p) . '/'; }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

$ymd = $GLOBALS['cc25_t_match'];

/* ---- The button itself ---- */

$on = cc25_fixture_programme_button('mens', $ymd);
check('a fixture with a programme gets a button', strpos($on, '>Programme</a>') !== false);
check('the button reads the PDF on our own site, not the raw file',
    strpos($on, 'href="https://www.cwmbranceltic.com/programme-77/"') !== false);
check('one programme gives exactly one button', substr_count($on, '<a ') === 1);
check('a date with no programme gets nothing at all',
    cc25_fixture_programme_button('mens', '2020-01-01') === '');

/* A fixture must never borrow the result's buttons. cc25_match_links resolves a
 * report and a match-centre link too; letting those through would tell supporters
 * a game already has a report before it has been played. */
check('no Match Report button on a fixture', strpos($on, 'Match Report') === false);
check('no Line-ups & Stats button on a fixture', strpos($on, 'Line-ups') === false);

/* ---- The row it goes in ---- */

// [date, opponent, isHome, competition]
ob_start();
cc25_render_static_fixtures(array(array($ymd, 'Newport Corinthians', true, 'Ardal SE')), 'mens');
$row = ob_get_clean();
check('the fixture row carries the programme button', strpos($row, '>Programme</a>') !== false);
check('the button sits in the row meta beside the badges',
    strpos($row, 'class="mmeta"') !== false && strpos($row, '>Programme</a>') > strpos($row, 'class="mmeta"'));

ob_start();
cc25_render_static_fixtures(array(array(date('Y-m-d', strtotime('+31 days')), 'Risca United', true, 'Ardal SE')), 'mens');
$bare = ob_get_clean();
check('a fixture with no programme renders no button', strpos($bare, 'Programme') === false);
check('and still renders as a fixture row', strpos($bare, 'class="mrow') !== false);

/* ---- The men's results panel (audit FIX-5) ---- */

// It was the only results panel that could not carry a Programme button: the
// whole row was an <a> to the match report, and a link inside a link is invalid
// HTML. The template now renders a div and uses the shared button helper, so the
// guard is that the markup never goes back to being a row-wide anchor.
$tpl = file_get_contents(__DIR__ . '/../template-fixtures.php');
check('the men\'s results row is not a whole-row link',
    strpos($tpl, '$rtag') === false);
check('and it renders the shared match-link buttons',
    strpos($tpl, "cc25_match_link_buttons(function_exists('cc25_match_links') ? cc25_match_links('mens'") !== false);

echo "\n" . (count($failures) ? count($failures) . " FAILURE(S)\n" : "All checks passed\n");
exit(count($failures) ? 1 : 0);
