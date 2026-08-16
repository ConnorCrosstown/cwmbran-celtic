<?php
/**
 * Assertions over the Reserves squad. Run from the theme root:
 *   php _tests/squad-test.php
 *
 * The reason this exists: the squad cards look up appearances with
 * strtolower($name) against cc25_player_stats('reserves'). If a name in the squad
 * list stops matching the name on the team sheet, every card silently loses its
 * appearances and the page still looks finished. Nothing would go wrong loudly.
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

$squad = cc25_reserves_squad();
check('the Reserves squad is not empty', count($squad) > 0);

/* -- Data integrity ---------------------------------------------------------- */

/* No squad numbers, on purpose. The Reserves reassign shirts match to match —
 * only Hooper and Cook wore the same number in the season's first two games — so
 * a number on a card would be wrong more often than right. The card template
 * prints one whenever it finds it, so this is the check that stops one creeping
 * back in from a single team sheet. */
check('no player carries a squad number', array_column($squad, 'no') === array());

$names = array_column($squad, 'name');
check('no player is listed twice', count($names) === count(array_unique($names)));
check('no blank names', count(array_filter($names, 'strlen')) === count($names));
check('names are not lower-cased or shouted',
      $names === array_map(function ($n) { return ucwords(strtolower($n), " -"); }, $names));

/* Alphabetical by surname, which is the order the page prints. Without numbers to
 * sort on, a player appended to the end of the list is the easy mistake. */
$surname_first = array_map(function ($n) {
    $parts = explode(' ', $n);
    return array_pop($parts) . ' ' . implode(' ', $parts);
}, $names);
$sorted = $surname_first;
sort($sorted, SORT_STRING);
check('the squad is ordered by surname', $surname_first === $sorted);

/* Only positions the record actually gives us. An invented position would look
 * exactly as authoritative as a real one. */
$positions = array_unique(array_column($squad, 'pos'));
sort($positions);
check('the only position claimed is the one on the team sheet', $positions === array('', 'GK'));

/* -- The captain ------------------------------------------------------------- */

$cap = cc25_reserves_captain();
check('the captain is named', $cap !== '');
check('the captain is in the squad', in_array($cap, $names, true));

/* -- The stats join, which is the part that can fail silently ---------------- */

$stats = cc25_player_stats('reserves');
check('there are Reserves stats to join to', count($stats) > 0);

/* Every player who appeared on a team sheet must be findable by the key the
 * template uses. A miss here blanks a card's appearances with no error. */
$unmatched = array();
foreach ($stats as $key => $s) {
    $found = false;
    foreach ($names as $n) {
        if (strtolower($n) === $key) { $found = true; break; }
    }
    if (!$found) $unmatched[] = $key;
}
check('every player with stats is in the squad list', $unmatched === array());
if ($unmatched) echo '        unmatched: ' . implode(', ', $unmatched) . "\n";

/* And the other direction: everyone who has actually played resolves, and only
 * those who haven't don't. Read from the match records rather than allowing a
 * fixed number of misses — the squad now carries several named substitutes who
 * never got on, and that count changes with every team sheet. */
$played = array();
foreach (cc25_season_matches() as $m) {
    if (($m['team'] ?? 'mens') !== 'reserves') continue;
    $on = array();
    foreach (($m['subs_made'] ?? array()) as $sm) $on[strtolower(trim($sm['on']))] = true;
    foreach (($m['starters'] ?? array()) as $p) $played[strtolower(trim($p[1]))] = true;
    foreach (($m['subs'] ?? array()) as $p) {
        if (isset($on[strtolower(trim($p[1]))])) $played[strtolower(trim($p[1]))] = true;
    }
}
$drift = array();
foreach ($names as $n) {
    if (isset($played[strtolower($n)]) !== isset($stats[strtolower($n)])) $drift[] = $n;
}
check('the squad resolves against the stats keys', $played && $drift === array());
if ($drift) echo '        drifted: ' . implode(', ', $drift) . "\n";

/* Daniel Madge scored at Rogerstone — the one goal on record. If the join breaks,
 * this is the check that notices. */
check('Daniel Madge is credited with his goal',
      isset($stats['daniel madge']) && $stats['daniel madge']['goals'] === 1);
// Two appearances: off the bench at Rogerstone, then starting v Croesyceiliog.
check('...and both his appearances', isset($stats['daniel madge']) && $stats['daniel madge']['apps'] === 2);

/* An unused substitute should have no appearance rather than a phantom one. */
check('a named but unused substitute has no appearance',
      !isset($stats['jack shepard']) || $stats['jack shepard']['apps'] === 0);

/* -- Not mixed up with the first team ---------------------------------------- */

/* Reserves stats must not carry first-team appearances, and vice versa. Earlier in
 * the season the Reserves' players were polluting the first-team totals, which is
 * why cc25_player_stats() takes a team at all. */
$mens = cc25_player_stats('mens');
check('the two teams keep separate stats', $stats !== $mens);

/* Rudi Griffiths has scored twice for the first team and never played for the
 * Reserves. If he shows up in the Reserves stats, the scoping has broken. */
check('a first-team scorer does not appear in the Reserves stats', !isset($stats['rudi griffiths']));
check('...but is in the first-team stats', isset($mens['rudi griffiths']) && $mens['rudi griffiths']['goals'] === 2);

/* And the reverse: the Reserves' only scorer must not be credited to the first team. */
check('the Reserves scorer is not in the first-team stats', !isset($mens['daniel madge']));

/* -- The Vets squad ---------------------------------------------------------- */

/* Holding cards only, so there is no stats join to break here. What can break is
 * the registration data itself: a duplicated player, a typo'd registration number,
 * or the alphabetical order drifting as players are added — none of which the
 * page would show as wrong. */

$vets = cc25_vets_squad();
check('the Vets squad is not empty', count($vets) > 0);

$vnames = array_column($vets, 'name');
check('no Vet is listed twice', count($vnames) === count(array_unique($vnames)));
check('no blank Vets names', count(array_filter($vnames, 'strlen')) === count($vnames));
check('Vets names are not lower-cased or shouted',
      $vnames === array_map(function ($n) { return ucwords(strtolower($n), " -"); }, $vnames));

/* The registration list reads alphabetically by surname, and stays that way as
 * players are added. Two Scarfis and two Taylors make this worth asserting. */
$surnames = array_map(function ($n) { $b = explode(' ', $n); return strtolower(end($b)); }, $vnames);
$sorted = $surnames; sort($sorted);
check('the Vets are in surname order', $surnames === $sorted);

$vids = array_column($vets, 'id');
check('every Vet has a registration number', count(array_filter($vids)) === count($vets));
check('no two Vets share a registration number', count($vids) === count(array_unique($vids)));
check('registration numbers are integers', $vids === array_map('intval', $vids));

/* The Vets are not in the match record, so they must not be picking up another
 * team's stats through a shared name. */
$vstats = cc25_player_stats('vets');
check('the Vets have no stats to accidentally show', $vstats === array());

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
