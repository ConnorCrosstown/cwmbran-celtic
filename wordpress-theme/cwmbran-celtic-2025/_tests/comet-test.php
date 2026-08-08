<?php
/**
 * Assertions over the COMET import. Run from the theme root:
 *   php _tests/comet-test.php
 *
 * Checked against saved payloads for two real games — the men's 2-4 at home to
 * New Inn and the Reserves' cup defeat at Rogerstone — so the whole mapping is
 * exercised without touching the network. Both were also transcribed by hand from
 * the official PDFs, which is what the expected values below come from: if the
 * import and the printed report ever disagree, this fails.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
// functions.php loads inc/comet.php itself and provides cc25_norm_team, so
// requiring it here avoids declaring a second copy of either.
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

function load($slug) {
    $d = array();
    foreach (array('match', 'lineups', 'events') as $k) {
        $f = __DIR__ . "/fixtures/comet-$slug-$k.json";
        $d[$k] = file_exists($f) ? json_decode(file_get_contents($f), true) : array();
    }
    return $d;
}

/* ---- names: COMET's convention is SURNAME in capitals, forenames after ---- */

$n = function ($short, $full) { return cc25_comet_person_name(array('shortName' => $short, 'name' => $full)); };
check('a shouted shortName is title-cased', $n('LEWIS WATKINS', 'WATKINS Lewis') === 'Lewis Watkins');
check('a half-shouted shortName is fixed too', $n('Louis COCHRANE', 'COCHRANE Louis') === 'Louis Cochrane');
check('middle names are not imported', $n('CHARLIE DONOVAN', 'DONOVAN Charlie Jason Michael') === 'Charlie Donovan');
// Opposition players come through abbreviated because we have no detail access.
check('an abbreviated shortName falls back to the full name', $n('MANSON M.', 'MANSON Max Lewis') === 'Max Lewis Manson');
check('and a single forename too', $n('BERROW A.', 'BERROW Alex') === 'Alex Berrow');
// The capitals identify the surname, which is why a two-word surname survives.
check('a two-word surname is not split', $n('PRESTON WATKINS K.', 'PRESTON WATKINS Kobi') === 'Kobi Preston Watkins');
check('a missing shortName still works', $n('', 'JONES Luke Carwyn') === 'Luke Carwyn Jones');
check('an empty person gives an empty name', $n('', '') === '');

/* ---- the men's game: Cwmbran Celtic 2-4 New Inn ---- */

$m = cc25_comet_to_match(load('mens-new-inn'), 'mens', 'Cwmbran Celtic');
check('the men are at home', $m['home'] === true);
check('the opponent is New Inn', cc25_norm_team($m['opp']) === cc25_norm_team('New Inn FC'));
check('the score is 2-4', $m['cc'] === 2 && $m['oc'] === 4);
check('kick-off is 7 August, 18:30', $m['date'] === '2026-08-07' && $m['time'] === '18:30');
check('the round is read', $m['round'] === 'Round 3');
check('the venue is read', strpos($m['venue'], 'Motazone Arena') === 0);
// The API carries an attendance the PDF left blank.
check('attendance comes from COMET', $m['att'] === 220);
check('our captain is Terry Obeng', $m['captain'] === 'Terry Obeng');
check('their captain is read', $m['opp_captain'] === 'Luke Carwyn Jones');

check('eleven start for us', count($m['starters']) === 11);
check('eleven start for them', count($m['opp_starters']) === 11);
check('our subs are listed', count($m['subs']) === 4);
check('their subs are listed', count($m['opp_subs']) === 5);
check('the goalkeeper is marked', ($m['starters'][0][2] ?? '') === 'GK');
check('shirt numbers come through', $m['starters'][0][0] === 13 && $m['starters'][0][1] === 'Lewis Watkins');

check('we scored twice', count($m['goals']) === 2);
check('Griffiths scored on 7 from Wood',
      $m['goals'][0]['min'] === '7' && $m['goals'][0]['scorer'] === 'Rudi Griffiths' && $m['goals'][0]['assist'] === 'Finlay Wood');
check('Saunders scored on 71', $m['goals'][1]['min'] === '71' && $m['goals'][1]['scorer'] === 'Kian Saunders');
check('they scored four', count($m['opp_goals']) === 4);
$berrow = array_filter($m['opp_goals'], function ($g) { return $g['scorer'] === 'Alex Berrow'; });
check('Berrow got a hat-trick', count($berrow) === 3);
check('the first of them has no assist recorded', $m['opp_goals'][0]['assist'] === '');
check('goals are in minute order', array_map(function ($g) { return (int) $g['min']; }, $m['opp_goals']) === array(33, 41, 43, 87));

check('we picked up two yellows', count($m['cards']) === 2);
check('they picked up one', count($m['opp_cards']) === 1);
check('a card carries its minute and player',
      $m['cards'][0]['min'] === '35' && $m['cards'][0]['player'] === 'Tommy Challenger' && $m['cards'][0]['type'] === 'y');

check('we made three substitutions', count($m['subs_made']) === 3);
check('they made five', count($m['opp_subs_made']) === 5);
// player is the one coming on and player2 the one going off — easy to invert.
check('a substitution has off and on the right way round',
      $m['subs_made'][0]['off'] === 'Tommy Challenger' && $m['subs_made'][0]['on'] === 'Charlie Donovan');
// minuteFull, not minute: minute counts from the start of the half.
check('a second-half substitution is minute 46, not 1', $m['subs_made'][0]['min'] === '46');
check('staff are listed for both sides', count($m['staff']) === 4 && count($m['opp_staff']) === 6);

// Officials are not in the API at all — better an empty field than a wrong one.
check('officials come back empty, to be typed in', $m['ref'] === '' && $m['ar1'] === '' && $m['ar2'] === '');

/* ---- the Reserves away, in a cup, with a stoppage-time winner ---- */

$r = cc25_comet_to_match(load('reserves-rogerstone'), 'reserves', 'Cwmbran Celtic Reserves');
check('the Reserves are away', $r['home'] === false);
check('the opponent is Rogerstone', strpos($r['opp'], 'Rogerstone') === 0);
check('the score is 1-2 to them', $r['cc'] === 1 && $r['oc'] === 2);
check('the team is tagged reserves', $r['team'] === 'reserves');
check('the cup competition is read', stripos($r['comp'], 'Gwent Premier Combination Cup') !== false);
check('Madge scored on 59', $r['goals'][0]['scorer'] === 'Daniel Madge' && $r['goals'][0]['min'] === '59');
// The winner came three minutes into stoppage time.
check('stoppage time is kept as 90+3', $r['opp_goals'][1]['min'] === '90+3');
check('the winner is credited to Payne', $r['opp_goals'][1]['scorer'] === 'Luc Payne');
check('no cards were shown', $r['cards'] === array() && $r['opp_cards'] === array());
check('attendance was left blank', $r['att'] === 0);

/* ---- degenerate input must not throw ---- */

$empty = cc25_comet_to_match(array(), 'mens', 'Cwmbran Celtic');
check('an empty payload gives an empty match', $empty['date'] === '' && $empty['cc'] === 0 && $empty['starters'] === array());
check('a payload with no events gives no goals',
      cc25_comet_to_match(array('match' => array(), 'lineups' => array(), 'events' => array()), 'mens')['goals'] === array());
// Whatever gets pasted into the field. The first long run of digits is the id and
// everything after it is the date and time — welding all three together produced a
// 23-digit number, which is the bug these cover.
foreach (array(
    'match_107656065_20260808_140918.pdf' => '107656065',
    '107656065_20260808_140918.pdf'       => '107656065',   // prefix trimmed off
    '107656065_20260808_140918'           => '107656065',   // no extension either
    '107656065'                           => '107656065',
    '  107656065  '                       => '107656065',
    'match_108166143_20260808_140817.pdf' => '108166143',
    'report.pdf'                          => '',
    ''                                    => '',
    'match_123_x.pdf'                     => '',            // too short to be an id
) as $in => $want) {
    check("id from " . ($in === '' ? '(empty)' : trim($in)) . " is " . ($want ?: 'none'),
          cc25_comet_id_from_filename($in) === $want);
}

/* ---- the merge: what an import replaces, and what it must not ---- */

// With nothing imported, the site is exactly as it is today.
check('no imports leaves the hand-written reports alone',
      cc25_merge_match_records(array(), cc25_season_matches_static()) === cc25_season_matches_static());

$hand = array(array('team' => 'mens', 'date' => '2026-08-07', 'opp' => 'New Inn', 'cc' => 2, 'oc' => 4,
                    'report' => 'The words someone wrote.', 'report_by' => 'A Reporter',
                    'ref' => 'Michal Baniak', 'ar1' => 'Lucas Hoare', 'ar2' => '', 'att' => 210,
                    'starters' => array(array(1, 'Typed By Hand'))));
$imported = cc25_comet_to_match(load('mens-new-inn'), 'mens', 'Cwmbran Celtic');
$merged = cc25_merge_match_records(array($imported), $hand);
check('the same game appears once, not twice', count($merged) === 1);
$m = $merged[0];
// The FAW's version of the facts wins.
check('the imported line-up replaces the typed one', count($m['starters']) === 11);
// But never at the cost of the things the import cannot supply.
check('the written report survives the import', $m['report'] === 'The words someone wrote.');
check('so does its byline', $m['report_by'] === 'A Reporter');
check('and the officials, which COMET has none of', $m['ref'] === 'Michal Baniak' && $m['ar1'] === 'Lucas Hoare');
// COMET had 220 here, so the import's figure stands rather than being overwritten.
check("an imported attendance is not replaced by the older one", $m['att'] === 220);

// A hand-written report for a game with no import is untouched.
$other = array(array('team' => 'mens', 'date' => '2026-07-28', 'opp' => 'Cwmbran Town', 'cc' => 3, 'oc' => 0, 'report' => 'Derby day.'));
$both = cc25_merge_match_records(array($imported), $other);
check('an un-imported game is kept whole', count($both) === 2);
check('and keeps its report', $both[1]['report'] === 'Derby day.');
check('the merged list is newest first', $both[0]['date'] > $both[1]['date']);

// The two teams playing the same date are two different games.
$res = cc25_comet_to_match(load('reserves-rogerstone'), 'reserves', 'Cwmbran Celtic Reserves');
check('same date, different teams stay separate', count(cc25_merge_match_records(array($imported, $res), array())) === 2);

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
