<?php
/**
 * Assertions over the league table's rendering and its freshness line. Run from
 * the theme root:
 *   php _tests/feed-table-test.php
 *
 * The rows are rendered by one function used in three places — the fixtures page,
 * the home page, and the plugin's /table endpoint that a cached page hydrates
 * from. That is deliberate: if the endpoint rendered rows of its own, a hydrated
 * table could drift from a server-rendered one and nobody would notice.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function remove_action() {}
$GLOBALS['wp_filters'] = array();
function add_filter($tag, $cb, $prio = 10, $args = 1) { $GLOBALS['wp_filters'][$tag][] = $cb; return true; }
function apply_filters($tag, $value) {
    $args = array_slice(func_get_args(), 1);
    foreach ($GLOBALS['wp_filters'][$tag] ?? array() as $cb) { $args[0] = call_user_func_array($cb, $args); }
    return $args[0];
}
function get_transient() { return false; } function set_transient() {}
function esc_html($t) { return htmlspecialchars((string) $t, ENT_QUOTES, 'UTF-8'); }
function esc_attr($t) { return esc_html($t); }
function esc_url($u) { return $u; }
function get_stylesheet_directory_uri() { return 'https://example.test/theme'; }
function get_stylesheet_directory() { return dirname(__DIR__); }
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

$rows = array(
    array('position' => 1, 'club' => 'Chepstow Town',  'played' => 3, 'won' => 3, 'drawn' => 0, 'lost' => 0, 'gd' => 6,  'points' => 9),
    array('position' => 2, 'club' => 'Cwmbran Celtic', 'played' => 3, 'won' => 1, 'drawn' => 1, 'lost' => 1, 'gd' => 0,  'points' => 4),
    array('position' => 3, 'club' => 'Risca United',   'played' => 3, 'won' => 0, 'drawn' => 1, 'lost' => 2, 'gd' => -4, 'points' => 1),
);
$feed = array('tables' => array('mens' => $rows), 'crests' => array());

/* --------------------------------------------------------------- the rows */

$html = cc25_table_rows_html($feed, $rows);
check('one row per club', substr_count($html, '<tr') === 3);
check('every club is named', strpos($html, 'Chepstow Town') !== false
      && strpos($html, 'Cwmbran Celtic') !== false && strpos($html, 'Risca United') !== false);
check('our own row is marked', strpos($html, 'class="own"') !== false);
check('and only ours', substr_count($html, 'class="own"') === 1);
check('a positive goal difference gets a sign', strpos($html, '>+6<') !== false);
check('a negative one keeps its own', strpos($html, '>-4<') !== false);
check('and level shows as plain zero', strpos($html, '>0<') !== false && strpos($html, '>+0<') === false);
check('no rows renders nothing at all', cc25_table_rows_html($feed, array()) === '');

// A club name is feed data, so it must not be able to reach the page as markup.
$nasty = array(array('position' => 1, 'club' => '<script>alert(1)</script>', 'played' => 0,
                     'won' => 0, 'drawn' => 0, 'lost' => 0, 'gd' => 0, 'points' => 0));
check('a club name cannot inject markup',
      strpos(cc25_table_rows_html($feed, $nasty), '<script>') === false);

/* --------------------------------------- the endpoint reuses this same renderer */

check('the rows filter is registered', !empty($GLOBALS['wp_filters']['ccf_table_rows_html']));
check('and returns exactly what the page renders',
      apply_filters('ccf_table_rows_html', '', 'mens', $rows, $feed) === $html);

/* ------------------------------------------------------------ the freshness line */

$m = cc25_table_meta();
check('with no plugin, the meta is still an array', is_array($m));
check('and claims nothing it cannot know', $m['source'] === 'none' && $m['label'] === '');

/* ----------------------------------------------- what an empty table may claim */

// "once the season is underway" is only honest before a ball is kicked. After
// that, an empty table means something is broken, and saying so beats a fib.
check('never having had data reads as pre-season', cc25_table_empty_message('none') === cc25_table_empty_message('none'));
check('pre-season wording mentions the season',
      stripos(cc25_table_empty_message('none'), 'season') !== false);
check('a lost feed does NOT claim the season has not started',
      stripos(cc25_table_empty_message('lost'), 'once the season is underway') === false);
check('and says the table is temporarily unavailable',
      stripos(cc25_table_empty_message('lost'), 'unavailable') !== false);

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
