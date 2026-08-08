<?php
/**
 * Assertions over the fixture record — the one that replaces four hardcoded
 * lists. Run from the theme root:
 *   php _tests/fixture-record-test.php
 *
 * Two things are being protected here. First the cutover: uploading the theme
 * must change nothing until fixtures are migrated, and a half-finished migration
 * must not show a partial season. Second the status rule, since a called-off game
 * appearing as "next home game" is the live bug this record exists to prevent.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {}
function get_transient() { return false; } function set_transient() {}
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

/* ---- Cutover: with no WordPress, nothing changes ---- */

check('no WordPress means no fixture records', cc25_fx_posts() === array());
check('and no team counts as migrated', cc25_fx_migrated_teams() === array());
check('fixtures fall back to the hand-maintained lists',
      cc25_static_fixtures() === cc25_static_fixtures_static());
check('kick-offs fall back to the hand-maintained map',
      cc25_kickoff_overrides() === cc25_kickoff_overrides_static());
check('postponements fall back to the hand-maintained list',
      cc25_hidden_fixtures() === cc25_hidden_fixtures_static());
check('no kick-offs are derived from posts', cc25_fx_kickoffs_from_posts() === array());
check('no postponements are derived from posts', cc25_fx_hidden_from_posts() === array());

// The behaviour everything else depends on must be untouched.
check('the 22 Aug kick-off is still 2:00pm', cc25_kickoff_time('2026-08-22', 'Newport Corinthians', 6) === '14:00');
check('the postponed Risca game is still hidden', cc25_fixture_hidden('Risca United', '2026-08-22') === true);

/* ---- The per-team substitution rule ---- */

$static = array(
    'mens'     => array('list' => array(array('2026-09-12', 'Chepstow Town', false, 'League'))),
    'reserves' => array('list' => array(array('2026-09-05', 'Tredegar Town', true, 'League'))),
    'womens'   => array('list' => array(array('2026-09-27', 'Llanrumney United', false, 'League'))),
);
$rows = array('mens' => array(array('2026-10-03', 'Caldicot Town', true, 'League')));
$merged = cc25_fx_merge_lists($static, $rows);
check('a migrated team uses its records', $merged['mens']['list'][0][1] === 'Caldicot Town');
check('an unmigrated team keeps its whole list', $merged['reserves']['list'][0][1] === 'Tredegar Town');
check('a second unmigrated team is untouched', $merged['womens']['list'][0][1] === 'Llanrumney United');
check('no team is dropped by the merge', count($merged) === 3);
check('an empty row set changes nothing', cc25_fx_merge_lists($static, array()) === $static);
// A team with records but an empty array must NOT blank its season.
check('an empty list for a team does not blank it',
      cc25_fx_merge_lists($static, array('mens' => array()))['mens']['list'][0][1] === 'Chepstow Town');
// A team the static lists don't know about is ignored rather than invented.
check('an unknown team is not added', !isset(cc25_fx_merge_lists($static, array('vets' => array(array('2026-09-01', 'X', true, 'League'))))['vets']));

/* ---- Record to row, including the status rule ---- */

$base = array('team' => 'mens', 'date' => '2026-09-12', 'ko' => '14:30', 'opponent' => 'Chepstow Town',
              'home' => false, 'comp' => 'League', 'us' => '', 'them' => '', 'status' => 'scheduled');

$sched = cc25_fx_to_row($base);
check('a scheduled game has no score element', count($sched) === 4);
check('it keeps its date, opponent, venue and competition',
      $sched === array('2026-09-12', 'Chepstow Town', false, 'League'));

$played = cc25_fx_to_row(array_merge($base, array('status' => 'played', 'us' => '3', 'them' => '1')));
check('a played game carries the score', cc25_row_score($played) === array(3, 1));
check('our score is first', $played[4][0] === 3);

// The trap: a score typed in before the status is switched must not become a result.
$notyet = cc25_fx_to_row(array_merge($base, array('status' => 'scheduled', 'us' => '3', 'them' => '1')));
check('a score on a scheduled game is not a result', cc25_row_score($notyet) === null);

// And "played" with the score not yet entered is still not a result.
$blank = cc25_fx_to_row(array_merge($base, array('status' => 'played')));
check('played with no score is not a result', cc25_row_score($blank) === null);

// A 0-0 draw is a real score and must survive.
$nil = cc25_fx_to_row(array_merge($base, array('status' => 'played', 'us' => '0', 'them' => '0')));
check('a 0-0 draw is a result', cc25_row_score($nil) === array(0, 0));

// A postponed game is neither fixture nor result — cc25_hidden_fixtures() hides it.
$post = cc25_fx_to_row(array_merge($base, array('status' => 'postponed')));
check('a postponed game carries no score', cc25_row_score($post) === null);

/* ---- The editor's guardrails ---- */

$teams = cc25_fx_teams();
check('all three teams are offered', count($teams) === 3 && isset($teams['mens'], $teams['womens'], $teams['reserves']));
check('the three statuses are offered', count(cc25_fx_statuses()) === 3);
$opps = cc25_fx_known_opponents();
check('known opponents are suggested', count($opps) > 20);
check('TBC is not suggested as an opponent', !in_array('TBC', $opps, true));
check('the suggestions are sorted', $opps === array_values(array_unique($opps)) && $opps[0] < $opps[count($opps) - 1]);
// Every suggested name must actually resolve to a badge, or the hint lies.
$nocrest = array_values(array_filter($opps, function ($o) { return cc25_opp_crest_file($o) === ''; }));
check('every suggested opponent has a badge', $nocrest === array(), );
if ($nocrest) echo '        without a badge: ' . implode(', ', $nocrest) . "\n";

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
