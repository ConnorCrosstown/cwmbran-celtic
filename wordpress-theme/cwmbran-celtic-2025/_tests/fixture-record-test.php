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
check('every team the site carries is offered in the editor',
      count($teams) === 7 && isset($teams['mens'], $teams['womens'], $teams['reserves'],
      $teams['womens_res'], $teams['womens_u19'], $teams['u18s'], $teams['vets']));
/* The editor's team list and the fixture data must not drift apart, or a team gets
 * fixtures nobody can edit. */
check('the editor offers exactly the teams that have fixtures',
      array_keys($teams) == array_keys(cc25_static_fixtures())
      || count(array_diff(array_keys(cc25_static_fixtures()), array_keys($teams))) === 0);
check('the three statuses are offered', count(cc25_fx_statuses()) === 3);
$opps = cc25_fx_known_opponents();
check('known opponents are suggested', count($opps) > 20);
check('TBC is not suggested as an opponent', !in_array('TBC', $opps, true));
check('the suggestions are sorted', $opps === array_values(array_unique($opps)) && $opps[0] < $opps[count($opps) - 1]);
/* Every suggested name should resolve to a badge, or the editor's hint lies.
 * Eighteen do not: the Under-18s and Vets arrived with the club's list of 10 Aug
 * 2026, and the Women's Reserves and Women's U19s with the list of 11 Aug, and
 * most of their opponents have no artwork on file. Those rows show initials,
 * which is handled, and the fixture editor warns when a name has no badge.
 *
 * Listed explicitly rather than the check being relaxed, so a NINETEENTH
 * badge-less opponent fails here and gets a decision instead of quietly showing
 * initials. Connor is collecting the missing artwork from the club.
 *
 * Tata Steel United came off this list on 16 Aug 2026: the crest is on the FAW's
 * own record for the game, which is where the rest of these can come from too. */
$known_gaps = array(
    'Caerleon', 'Caldicot Town Dev', 'Coed Eva Athletic', 'Graig Villa Dino',
    'Llanyrafon', 'Monmouth Town', 'Ponthir',
    'Riverside Rovers', 'Sifil',
    'Barry Town United', 'Briton Ferry Llansawel', 'Caerphilly Dragons',
    'Cardiff City', 'Cardiff Met', 'North Cardiff Cosmos',
    'Porth Harlequins BGC', 'Swansea City',
);
$nocrest = array_values(array_filter($opps, function ($o) { return cc25_opp_crest_file($o) === ''; }));
sort($nocrest);
$expected = $known_gaps;
sort($expected);
check('the opponents without a badge are exactly the ones we know about', $nocrest === $expected);
if ($nocrest !== $expected) {
    echo '        unexpected: ' . implode(', ', array_diff($nocrest, $expected)) . "\n";
    echo '        now has one: ' . implode(', ', array_diff($expected, $nocrest)) . "\n";
}

/* The club's list of 11 Aug 2026 swapped the venue on both Reserves v Tredegar
 * Town games — 5 September was ours, 12 December was theirs. Their sheet tags
 * these "Was Home" and "Was Away" respectively. */
$res = cc25_static_fixtures_static()['reserves']['list'];
function cc25_t_row($list, $ymd, $opp) {
    foreach ($list as $r) if ($r[0] === $ymd && $r[1] === $opp) return $r;
    return null;
}
$sep = cc25_t_row($res, '2026-09-05', 'Tredegar Town');
$dec = cc25_t_row($res, '2026-12-12', 'Tredegar Town');
check('Reserves v Tredegar Town, 5 Sep, is AWAY', $sep !== null && empty($sep[2]));
check('Reserves v Tredegar Town, 12 Dec, is HOME', $dec !== null && !empty($dec[2]));

/* Women's U19s — new with the club's list of 11 Aug 2026. Adran U19s, Friday
 * nights. The club's list covers the first half of the season only; it ends on
 * 20 November and that is not a truncated sheet. */
$u19 = cc25_static_fixtures_static()['womens_u19']['list'];
check('Women\'s U19s have the club\'s eleven fixtures', count($u19) === 11);
check('Women\'s U19s open at home to Pontypridd United on 11 Sep',
    $u19[0][0] === '2026-09-11' && $u19[0][1] === 'Pontypridd United' && !empty($u19[0][2]));
check('Women\'s U19s finish away to Cardiff City on 20 Nov',
    $u19[10][0] === '2026-11-20' && $u19[10][1] === 'Cardiff City' && empty($u19[10][2]));
check('every Women\'s U19s game is a Friday', count(array_filter($u19, function ($r) {
    return date('N', strtotime($r[0])) != 5;
})) === 0);
check('Women\'s U19s are in the team registry', isset(cc25_fx_teams()['womens_u19']));

/* Women's Reserves — also new with the 11 Aug list. SWWGL Development League,
 * Sundays. These exist ONLY on the workbook's "Womens (Reserves)" sheet; the
 * master "This Year Games" tab omits the team entirely.
 *
 * The club has them down for two home games on Sunday 4 October (rounds 4 and 6).
 * That is imported as given and raised with the club — see
 * docs/2026-08-11-club-fixture-queries.md. The duplicate is asserted here so that
 * when the club corrects it, this test tells us to update the record. */
$wres = cc25_static_fixtures_static()['womens_res']['list'];
check('Women\'s Reserves have the club\'s eighteen fixtures', count($wres) === 18);
check('Women\'s Reserves open at home to Undy on 6 Sep',
    $wres[0][0] === '2026-09-06' && $wres[0][1] === 'Undy' && !empty($wres[0][2]));
check('every Women\'s Reserves game is a Sunday', count(array_filter($wres, function ($r) {
    return date('N', strtotime($r[0])) != 7;
})) === 0);
$oct4 = array_values(array_filter($wres, function ($r) { return $r[0] === '2026-10-04'; }));
check('the club\'s 4 Oct double booking is carried as-is, pending their answer', count($oct4) === 2);
check('Women\'s Reserves are in the team registry', isset(cc25_fx_teams()['womens_res']));

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
