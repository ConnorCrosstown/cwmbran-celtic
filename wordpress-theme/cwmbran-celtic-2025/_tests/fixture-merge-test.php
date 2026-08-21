<?php
/**
 * Merging admin fixture records over the hardcoded lists. Run from the theme root:
 *   php _tests/fixture-merge-test.php
 *
 * This is the most dangerous code in the theme, so it gets the most tests.
 *
 * The 2026-08-21 audit found the merge replaced a team's list WHOLESALE: adding a
 * single rearranged Reserves game through the admin screen deleted the other
 * twenty-six from the website, with no error and no warning. The page simply
 * rendered one fixture and looked perfectly healthy.
 *
 * Every check below exists because that failure was invisible. A merge bug does
 * not crash — it quietly publishes less football than the club is playing.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {} function remove_action() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
function esc_url($u) { return htmlspecialchars((string) $u, ENT_QUOTES); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_html__($s) { return $s; }
function add_query_arg($k, $v, $u) { return $u . (strpos($u, '?') === false ? '?' : '&') . $k . '=' . rawurlencode($v); }
function home_url($p = '') { return 'https://www.cwmbranceltic.com' . $p; }
function get_page_by_path($s) { return null; }
function get_permalink($p = 0) { return 'https://www.cwmbranceltic.com/x/'; }
function get_stylesheet_directory_uri() { return 'https://www.cwmbranceltic.com/wp-content/themes/cwmbran-celtic-2025'; }
function get_stylesheet_directory() { return dirname(__DIR__); }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}
/** Rows as "date opponent" strings, so a failure prints something readable. */
function ids($list) {
    return array_map(function ($r) { return $r[0] . ' ' . $r[1] . ($r[2] ? ' (H)' : ' (A)'); }, $list);
}

/** Three Reserves fixtures, the shape cc25_static_fixtures_static() produces. */
function season() {
    return array('reserves' => array(
        'league' => 'Gwent County', 'title' => "Men's Reserves",
        'list' => array(
            array('2026-09-05', 'Goytre', true,  'League'),
            array('2026-09-12', 'New Inn', false, 'League'),
            array('2026-09-19', 'Undy', true,  'League'),
        ),
    ));
}

/* ---- THE BUG: one record must not delete the rest of the season ---- */

$one = array('reserves' => array(array('2026-09-12', 'New Inn', false, 'League', array(2, 1))));
$m = cc25_fx_merge_lists(season(), $one);
$list = $m['reserves']['list'];

check('the other fixtures survive one admin record', count($list) === 3);
check('  Goytre still there', in_array('2026-09-05 Goytre (H)', ids($list), true));
check('  Undy still there',   in_array('2026-09-19 Undy (A)', ids($list), true) === false
                              && in_array('2026-09-19 Undy (H)', ids($list), true));
check('the record replaced its own row, not appended', count($list) === 3);
check('and its score came through', isset($list[1][4]) && $list[1][4] === array(2, 1));
check('the team label is untouched', $m['reserves']['title'] === "Men's Reserves");

/* ---- A game the hardcoded list never had ---- */

$cup = array('reserves' => array(array('2026-10-03', 'Chepstow Town', true, 'Welsh Cup')));
$list = cc25_fx_merge_lists(season(), $cup)['reserves']['list'];
check('a brand-new game is added', count($list) === 4);
check('  and lands in date order', ids($list)[3] === '2026-10-03 Chepstow Town (H)');

/* ---- A re-dated game must move, not appear twice ---- */

$moved = array('reserves' => array(array('2026-09-16', 'New Inn', false, 'League')));
$list = cc25_fx_merge_lists(season(), $moved)['reserves']['list'];
check('a game rescheduled by 4 days moves rather than duplicating', count($list) === 3);
check('  and shows the new date', in_array('2026-09-16 New Inn (A)', ids($list), true));
check('  with the old date gone', !in_array('2026-09-12 New Inn (A)', ids($list), true));

// Beyond ten days it is a different fixture — the same rule cc25_fixture_hidden
// already applies, so a genuinely new cup tie against the same club is not
// mistaken for the league game being moved.
$far = array('reserves' => array(array('2026-11-14', 'New Inn', false, 'Welsh Cup')));
$list = cc25_fx_merge_lists(season(), $far)['reserves']['list'];
check('a game 2 months later is a separate fixture', count($list) === 4);

/* ---- Venue and double-headers: "same opponent" is not enough ---- */

$reverse = array('reserves' => array(array('2026-09-12', 'New Inn', true, 'League')));
$list = cc25_fx_merge_lists(season(), $reverse)['reserves']['list'];
check('the reverse fixture is its own game, not the away one re-dated', count($list) === 4);

$dbl = array('reserves' => array(
    array('2026-09-05', 'Goytre', true, 'League', array(1, 0)),
    array('2026-09-05', 'Risca United', false, 'Cup'),
));
$list = cc25_fx_merge_lists(season(), $dbl)['reserves']['list'];
check('two games on one date both survive', count($list) === 4);
check('  the right one got the score', $list[0][1] === 'Goytre' && isset($list[0][4]));

/* ---- Club-name drift must not create a phantom fixture ---- */

$drift = array('reserves' => array(array('2026-09-05', 'Goytre AFC (Gwent)', true, 'League', array(3, 3))));
$list = cc25_fx_merge_lists(season(), $drift)['reserves']['list'];
check('"Goytre AFC (Gwent)" matches "Goytre"', count($list) === 3);
check('  and updated it', isset($list[0][4]) && $list[0][4] === array(3, 3));

/* ---- Nothing to merge, and teams that are not there ---- */

check('no records leaves the season exactly as it was',
    cc25_fx_merge_lists(season(), array()) == season());
check('an empty record array for a team changes nothing',
    cc25_fx_merge_lists(season(), array('reserves' => array())) == season());
check('records for a team with no hardcoded list are ignored',
    cc25_fx_merge_lists(season(), array('womens' => array(array('2026-09-05', 'Undy', true, 'League'))))
        == season());

/* ---- A fully migrated team: every game came from the admin ---- */

$all = array('reserves' => array(
    array('2026-09-05', 'Goytre', true,  'League', array(2, 0)),
    array('2026-09-12', 'New Inn', false, 'League', array(1, 1)),
    array('2026-09-19', 'Undy', true,  'League'),
));
$list = cc25_fx_merge_lists(season(), $all)['reserves']['list'];
check('a fully migrated team has no duplicates', count($list) === 3);
check('  and carries all its results', isset($list[0][4]) && isset($list[1][4]));

echo "\n" . (count($failures) ? count($failures) . " FAILURE(S)\n" : "All checks passed\n");
exit(count($failures) ? 1 : 0);
