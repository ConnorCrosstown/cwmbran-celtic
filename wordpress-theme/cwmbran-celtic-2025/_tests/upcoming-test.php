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

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
