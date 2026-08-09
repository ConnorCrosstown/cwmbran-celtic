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

$nos = array_column($squad, 'no');
check('every player has a squad number', count(array_filter($nos)) === count($squad));
check('no two players share a squad number', count($nos) === count(array_unique($nos)));
check('squad numbers are in order', $nos === array_values($nos) && $nos === (function ($n) { sort($n); return $n; })($nos));

$names = array_column($squad, 'name');
check('no player is listed twice', count($names) === count(array_unique($names)));
check('no blank names', count(array_filter($names, 'strlen')) === count($names));
check('names are not lower-cased or shouted',
      $names === array_map(function ($n) { return ucwords(strtolower($n), " -"); }, $names));

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

/* And the other direction: at least most of the squad should resolve, or the
 * lower-casing convention has drifted. */
$resolved = 0;
foreach ($names as $n) {
    if (isset($stats[strtolower($n)])) $resolved++;
}
check('the squad resolves against the stats keys', $resolved >= count($names) - 1);

/* Daniel Madge scored at Rogerstone — the one goal on record. If the join breaks,
 * this is the check that notices. */
check('Daniel Madge is credited with his goal',
      isset($stats['daniel madge']) && $stats['daniel madge']['goals'] === 1);
check('...and an appearance', isset($stats['daniel madge']) && $stats['daniel madge']['apps'] === 1);

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

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
