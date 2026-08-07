<?php
/**
 * Assertions over kick-off resolution. Run from the theme root:
 *   php _tests/kickoff-test.php
 * functions.php loads standalone with these two no-op stubs; WordPress never
 * loads this file.
 */

// This file ships inside the theme zip and must never execute over HTTP.
// It defines ABSPATH and requires functions.php, bypassing its exit guard.
if (PHP_SAPI !== 'cli') exit;

function add_action() {}
function add_filter() {}
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/** A feed fixture as the theme sees it — allwalessport dates land at 12:00 UTC. */
function ko_fx($ymd, $opponent, $home = true) {
    $ms = (new DateTime($ymd . ' 12:00:00', new DateTimeZone('UTC')))->getTimestamp() * 1000;
    return array(
        'date'     => $ms,
        'homeAway' => $home ? 'H' : 'A',
        'homeTeam' => $home ? 'Cwmbran Celtic' : $opponent,
        'awayTeam' => $home ? $opponent : 'Cwmbran Celtic',
    );
}
/** Kick-off label for a hand-maintained row. Formats here rather than via
 *  cc25_date(), which needs WordPress's date_i18n(). */
function ko_row($ymd, $opponent) {
    $ms = cc25_row_kickoff_ms($ymd, $opponent);
    $tz = new DateTimeZone('Europe/London');
    return (new DateTime('@' . intval($ms / 1000)))->setTimezone($tz)->format('g:ia');
}

// Day-of-week defaults, used whenever the club hasn't set a time.
check('Saturday defaults to 2:30pm', cc25_kickoff_label(ko_fx('2026-08-15', 'Risca United')) === '2:30pm');
check('Sunday defaults to 2:00pm', cc25_kickoff_label(ko_fx('2026-08-16', 'Risca United')) === '2:00pm');
check('midweek defaults to 7:30pm', cc25_kickoff_label(ko_fx('2026-08-19', 'Risca United')) === '7:30pm');

// A bare 'YYYY-MM-DD' key moves every game that day. No live override uses that
// form any more — every one harvested from faw.cymru is scoped to an opponent,
// because the three teams often play on the same date — so the mechanism is
// exercised against an injected map rather than whatever the season happens to
// hold. The scoped form still wins over the whole-day one.
$ov_probe = array('2026-10-10' => '13:00', '2026-10-10|Brecon Corries' => '16:45');
check('whole-day override applies to any opponent that day', cc25_kickoff_time('2026-10-10', 'Anyone', 6, $ov_probe) === '13:00');
check('a scoped override beats the whole-day one', cc25_kickoff_time('2026-10-10', 'Brecon Corries', 6, $ov_probe) === '16:45');
check('an unlisted date still falls to the default', cc25_kickoff_time('2026-10-17', 'Anyone', 6, $ov_probe) === '14:30');
check('live overrides are used when none are injected', cc25_kickoff_time('2026-07-28', 'Cwmbran Town', 2) === '19:00');

// A 'YYYY-MM-DD|Opponent' key moves ONLY that game — the point of the scoping:
// the 1st team host New Inn at 6:30pm while the Reserves play Rogerstone away
// the same evening, and the Reserves must keep the midweek default.
check('New Inn (feed fixture) kicks off at 6:30pm', cc25_kickoff_label(ko_fx('2026-08-07', 'New Inn')) === '6:30pm');
check('New Inn (static row) kicks off at 6:30pm', ko_row('2026-08-07', 'New Inn') === '6:30pm');
check('New Inn away-leg resolves opponent from homeTeam', cc25_kickoff_label(ko_fx('2026-08-07', 'New Inn', false)) === '6:30pm');
check('Rogerstone same night keeps the 7:30pm default', ko_row('2026-08-07', 'Rogerstone') === '7:30pm');
check('an unscoped game that day keeps the default', ko_row('2026-08-07', 'Anyone Else') === '7:30pm');

// Opponent matching goes through cc25_norm_team, so case and "AFC" don't matter.
check('opponent match ignores case and AFC', ko_row('2026-08-07', 'new inn afc') === '6:30pm');

// Degenerate input must not blow up. An unparseable row date yields 0, which
// reads as "long finished" to every caller, so the row is quietly dropped —
// a typo'd date in the fixture lists hides that game rather than breaking the page.
check('missing date gives TBC', cc25_kickoff_label(array()) === 'TBC');
check('unparseable row date yields 0', cc25_row_kickoff_ms('not-a-date', 'New Inn') === 0);

// Kick-off times are keyed by opponent, so name normalisation decides whether an
// override lands at all. A miss is silent — it just reverts to the default time.
check('AFC and FC are ignored', cc25_norm_team('Undy AFC') === cc25_norm_team('Undy FC'));
check('a region qualifier is ignored', cc25_norm_team('Goytre AFC (Gwent)') === cc25_norm_team('Goytre'));
check('case is ignored', cc25_norm_team('NEW INN fc') === cc25_norm_team('New Inn'));
check('distinct clubs stay distinct', cc25_norm_team('Goytre') !== cc25_norm_team('Goytre United'));
check('Cwmbran clubs stay distinct', cc25_norm_team('Cwmbran Celtic') !== cc25_norm_team('Cwmbran Town'));

// The FAW's published times, harvested into cc25_kickoff_overrides(). Winter
// Saturdays are 2:00pm, not the 2:30pm default — the case that was wrong before.
check('winter Saturday is 2:00pm not the default', cc25_kickoff_label(ko_fx('2026-11-14', 'Undy FC')) === '2:00pm');
check('autumn Saturday keeps 2:30pm', cc25_kickoff_label(ko_fx('2026-10-03', 'Caldicot Town')) === '2:30pm');
check('Abergavenny away is 7:45pm, not the 7:30pm default', cc25_kickoff_label(ko_fx('2026-08-14', 'Abergavenny Town')) === '7:45pm');
check('Goytre resolves through the region qualifier', cc25_kickoff_label(ko_fx('2027-01-02', 'Goytre AFC (Gwent)')) === '2:00pm');
check("women's Sunday game is 2:00pm", cc25_kickoff_label(ko_fx('2026-10-11', 'Pontypridd United')) === '2:00pm');

// Matchday decides whether the homepage takeover shows the game or the Music
// Shirts launch, so it has to be right on the boundary days as well as today.
$uk = new DateTimeZone('Europe/London');
function ko_ymd($offset_days, $uk) {
    return (new DateTime('now', $uk))->modify($offset_days . ' day')->format('Y-m-d');
}
check('a home game today is matchday', cc25_is_matchday(ko_fx(ko_ymd(0, $uk), 'Risca United')) === true);
check('tomorrow is not matchday', cc25_is_matchday(ko_fx(ko_ymd(1, $uk), 'Risca United')) === false);
check('yesterday is not matchday', cc25_is_matchday(ko_fx(ko_ymd(-1, $uk), 'Risca United')) === false);
check('no fixture is not matchday', cc25_is_matchday(null) === false);
check('a fixture with no date is not matchday', cc25_is_matchday(array()) === false);

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
