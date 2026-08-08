<?php
/**
 * Assertions over which fixture the site calls "next". Run from the theme root:
 *   php _tests/upcoming-test.php
 *
 * This exists because of a live bug: the homepage advertised a postponed game as
 * the next home fixture. Two sources disagreed — the allwalessport feed carries
 * only league games and still listed the postponed one, while the cup tie that
 * replaced it existed solely in the hand-maintained list. Hiding the postponed
 * game alone would have skipped the cup tie and jumped a month ahead.
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

/** A fixture shaped like the feed's: league only, dated at noon UTC. */
function up_fx($ymd, $opp, $home) {
    $ms = (new DateTime($ymd . ' 12:00:00', new DateTimeZone('UTC')))->getTimestamp() * 1000;
    return array(
        'date' => $ms, 'homeAway' => $home ? 'H' : 'A',
        'homeTeam' => $home ? 'Cwmbran Celtic' : $opp,
        'awayTeam' => $home ? $opp : 'Cwmbran Celtic',
        'competition' => 'Ardal League South East', 'team' => 'mens',
    );
}

// The real situation on 8 August 2026: the feed still lists Risca at home on
// 22 August, which the FAW has postponed, and the Welsh Cup tie that took the
// date is only in our own list.
$feed = array('fixtures' => array(
    up_fx('2026-08-14', 'Abergavenny Town', false),
    up_fx('2026-08-22', 'Risca United', true),
    up_fx('2026-09-12', 'Chepstow Town', false),
    up_fx('2026-09-19', 'Newport Corinthians', true),
));

$nh = cc25_next_home_fixture($feed, 'mens');
$opp = $nh ? cc25_opponent($nh)['opponent'] : null;
check('a postponed game is not the next home game', cc25_norm_team((string) $opp) !== cc25_norm_team('Risca United'));
check('the cup tie that replaced it is', cc25_norm_team((string) $opp) === cc25_norm_team('Newport Corinthians'));
check('and it carries its own competition', $nh && ($nh['competition'] ?? '') === 'Welsh Cup QR2');
check('and its confirmed 2:00pm kick-off', $nh && cc25_kickoff_label($nh) === '2:00pm');

// Cup ties must reach the upcoming list at all — they exist in no feed.
$up = cc25_upcoming($feed, 'mens', 8);
$comps = array_map(function ($f) { return $f['competition'] ?? ''; }, $up);
check('cup ties appear among upcoming fixtures', in_array('Welsh Cup QR2', $comps, true));

// Merging two sources must not double up the games both hold.
$pairs = array();
foreach ($up as $f) {
    $pairs[] = cc25_date($f['date'], 'Y-m-d') . '|' . cc25_norm_team(cc25_opponent($f)['opponent']);
}
check('no fixture is listed twice', count($pairs) === count(array_unique($pairs)));

// Two separate ties against the same club must both survive the dedupe.
$newport = array_filter($up, function ($f) {
    return cc25_norm_team(cc25_opponent($f)['opponent']) === cc25_norm_team('Newport Corinthians');
});
check('both Newport Corinthians ties survive (cup + league)', count($newport) === 2);

// Ordering: whatever else happens, the list is chronological.
$dates = array_map(function ($f) { return intval($f['date']); }, $up);
$sorted = $dates; sort($sorted);
check('upcoming fixtures are in date order', $dates === $sorted);

// An empty feed must still yield fixtures from the hand-maintained list, or the
// homepage loses its next-match section entirely.
$bare = cc25_upcoming(array(), 'mens', 3);
check('an empty feed still gives upcoming fixtures', count($bare) === 3);
check('and none of them is a postponed game', !array_filter($bare, function ($f) {
    return cc25_fixture_hidden(cc25_opponent($f)['opponent'], cc25_date($f['date'], 'Y-m-d'));
}));

// An undrawn opponent has nothing to advertise and must not become "next".
check('a TBC opponent is never surfaced', !array_filter(cc25_upcoming($feed, 'mens', 20), function ($f) {
    return cc25_opponent($f)['opponent'] === 'TBC';
}));


// Hand-recorded results: the feed covers only the men's first team, so a
// Reserves or Women's result exists solely as a score on its fixture row.
$res = cc25_static_results('reserves');
check('the reserves result is recorded', count($res) >= 1);
$r = $res[0];
check('it is the Rogerstone cup tie', cc25_norm_team(cc25_opponent($r)['opponent']) === cc25_norm_team('Rogerstone'));
check('away, so our score is the away one', cc25_is_home($r) === false);
check('recorded as a 1-2 defeat', intval($r['awayScore']) === 1 && intval($r['homeScore']) === 2);
check('it carries the cup competition', ($r['competition'] ?? '') === 'League Cup R1');

// A played row is a result, not a fixture — it must not appear in both.
$ups = cc25_upcoming(array(), 'reserves', 30);
check('a played game is no longer upcoming', !array_filter($ups, function ($f) {
    return cc25_norm_team(cc25_opponent($f)['opponent']) === cc25_norm_team('Rogerstone')
        && cc25_date($f['date'], 'Y-m-d') === '2026-08-07';
}));

// A row with no score, a malformed one, or a non-numeric score is still a fixture.
check('a row with no score has none', cc25_row_score(array('2026-08-15', 'X', false, 'League')) === null);
check('a one-number score is rejected', cc25_row_score(array('2026-08-15', 'X', false, 'League', array(1))) === null);
check('a non-numeric score is rejected', cc25_row_score(array('2026-08-15', 'X', false, 'League', array('a', 'b'))) === null);
check('a 0-0 draw is a valid score', cc25_row_score(array('2026-08-15', 'X', false, 'League', array(0, 0))) === array(0, 0));

// cc25_results() merges without duplicating what the feed already holds.
$merged = cc25_results(array('results' => array(array(
    'date' => (new DateTime('2026-08-07 12:00:00', new DateTimeZone('UTC')))->getTimestamp() * 1000,
    'homeAway' => 'A', 'homeTeam' => 'Rogerstone', 'awayTeam' => 'Cwmbran Celtic',
    'homeScore' => 2, 'awayScore' => 1, 'team' => 'reserves',
))), 'reserves');
check('a result the feed already has is not duplicated', count($merged) === 1);

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
