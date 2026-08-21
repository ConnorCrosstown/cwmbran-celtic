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

function add_action() {} function add_filter() {} function remove_action() {}
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
// Picked by date rather than position: the list is newest-first, so every new
// result recorded would otherwise move the game these assertions describe.
$by_date = function ($rows, $ymd) {
    foreach ($rows as $row) if (cc25_date($row['date'], 'Y-m-d') === $ymd) return $row;
    return null;
};
$r = $by_date($res, '2026-08-07');
check('the Rogerstone cup tie is there', $r && cc25_norm_team(cc25_opponent($r)['opponent']) === cc25_norm_team('Rogerstone'));
check('away, so our score is the away one', cc25_is_home($r) === false);
check('recorded as a 1-2 defeat', intval($r['awayScore']) === 1 && intval($r['homeScore']) === 2);
// Renamed from "League Cup R1" once the official record showed this is the Gwent
// Premier Combination CUP — a different competition from the men's league cup,
// which carried the same label.
check('it carries the cup competition', ($r['competition'] ?? '') === 'Gwent Premier Cup R1');

// The home league defeat to Croesyceiliog — the other orientation, because a
// score read off the wrong end looks perfectly plausible on an away row alone.
$h = $by_date($res, '2026-08-15');
check('the Croesyceiliog league game is there', $h && cc25_norm_team(cc25_opponent($h)['opponent']) === cc25_norm_team('Croesyceiliog'));
check('home, so our score is the home one', cc25_is_home($h) === true);
check('recorded as a 1-2 defeat at home', intval($h['homeScore']) === 1 && intval($h['awayScore']) === 2);

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
$rogerstone = array_filter($merged, function ($f) {
    return cc25_norm_team(cc25_opponent($f)['opponent']) === cc25_norm_team('Rogerstone');
});
check('a result the feed already has is not duplicated', count($rogerstone) === 1);

/* -- The hero countdown: next game AT OUR GROUND, either first team -----------
 * The homepage heading promises "Matchday at the Motazone Arena" and then counts
 * down. It used to count down to the next men's fixture home OR away, so on
 * 8 Aug 2026 it was timing an away trip to Abergavenny under that heading.
 *
 * The choosing is tested through cc25_pick_earliest_home() rather than the feed:
 * cc25_upcoming() merges the real hand-maintained fixtures into any feed it is
 * given, so a synthetic one cannot be isolated — real static rows outrank it. */
function hero_fx($ymd, $opp, $home, $team, $comp = 'League') {
    $ms = (new DateTime($ymd . ' 12:00:00', new DateTimeZone('UTC')))->getTimestamp() * 1000;
    return array(
        'date' => $ms, 'homeAway' => $home ? 'H' : 'A',
        'homeTeam' => $home ? 'Cwmbran Celtic' : $opp,
        'awayTeam' => $home ? $opp : 'Cwmbran Celtic',
        'competition' => $comp, 'team' => $team,
    );
}

$pick = cc25_pick_earliest_home(array(
    'mens'   => hero_fx('2026-09-26', 'Caldicot Town', true, 'mens'),
    'womens' => hero_fx('2026-09-13', 'Pontypridd United', true, 'womens'),
));
check("the women's home game wins when it is next at our ground",
      $pick && cc25_opponent($pick)['opponent'] === 'Pontypridd United' && $pick['team'] === 'womens');

$pick = cc25_pick_earliest_home(array(
    'mens'   => hero_fx('2026-09-13', 'Caldicot Town', true, 'mens'),
    'womens' => hero_fx('2026-09-26', 'Pontypridd United', true, 'womens'),
));
check("the men's home game wins when theirs is the sooner one",
      $pick && $pick['team'] === 'mens');

/* An away game must be refused outright, not ranked. This is the actual live bug:
 * the sooner fixture was away, and the hero showed it under "at the Motazone
 * Arena". Sooner must not win if it is not at our ground. */
$pick = cc25_pick_earliest_home(array(
    'mens'   => hero_fx('2026-08-14', 'Abergavenny Town', false, 'mens'),
    'womens' => hero_fx('2026-09-13', 'Pontypridd United', true, 'womens'),
));
check('a sooner AWAY game never wins the hero countdown',
      $pick && cc25_is_home($pick) && cc25_opponent($pick)['opponent'] === 'Pontypridd United');

check('nothing at home yields null, not an away fixture',
      cc25_pick_earliest_home(array('mens' => hero_fx('2026-08-14', 'Abergavenny Town', false, 'mens'))) === null);
check('no candidates at all yields null', cc25_pick_earliest_home(array()) === null);

/* Whatever the data says on any given day, the live answer is always a home game. */
$live = cc25_next_home_fixture_any(cc25_feed());
check('the live hero fixture is always a home game', $live === null || cc25_is_home($live));

/* -- The eyebrow label ------------------------------------------------------- */
check("a men's league game names the Ardal division",
      cc25_fixture_comp_label(array('team' => 'mens', 'competition' => 'League')) === 'Ardal League South East');
check("a women's league game names Genero Adran South",
      cc25_fixture_comp_label(array('team' => 'womens', 'competition' => 'League')) === 'Genero Adran South');
check('a cup tie keeps its own name rather than a league',
      cc25_fixture_comp_label(array('team' => 'mens', 'competition' => 'Welsh Cup QR2')) === 'Welsh Cup QR2');
check("a women's cup tie names the side, since the cup alone does not",
      cc25_fixture_comp_label(array('team' => 'womens', 'competition' => 'Welsh Cup R2')) === "Women's First Team · Welsh Cup R2");
check('a missing competition still yields a league, never an empty label',
      cc25_fixture_comp_label(array('team' => 'womens')) === 'Genero Adran South');
/* Escaped by the caller, so it must not carry entities of its own. */
check('the label is plain text, not markup',
      strpos(cc25_fixture_comp_label(array('team' => 'womens', 'competition' => 'Welsh Cup R2')), '&') === false);


echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
