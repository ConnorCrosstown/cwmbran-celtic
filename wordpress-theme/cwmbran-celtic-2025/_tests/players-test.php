<?php
/**
 * Assertions over squads coming from wp-admin rather than from this file. Run from
 * the theme root:
 *   php _tests/players-test.php
 *
 * Four squads live here in three different shapes — the men's grouped by position
 * with a card-image slug, the Reserves name-and-position, the Vets carrying FAW
 * registration numbers. They now come from posts when any exist, and the shapes the
 * templates read must not change, because the templates were not touched.
 *
 * The rule that matters most: a team's posts REPLACE that team's list rather than
 * merging into it. Merging cannot delete anybody, and being able to take a player
 * off the site is most of the point.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function remove_action() {}
$GLOBALS['wp_filters'] = array();
function add_filter($t, $c, $p = 10, $a = 1) { $GLOBALS['wp_filters'][$t][] = $c; return true; }
function apply_filters($t, $v) { $args = array_slice(func_get_args(), 1);
    foreach ($GLOBALS['wp_filters'][$t] ?? array() as $c) { $args[0] = call_user_func_array($c, $args); } return $args[0]; }
function get_transient() { return false; } function set_transient() {}
function date_i18n($f, $ts = null) { return date($f, $ts === null ? time() : $ts); }
function esc_html($t) { return htmlspecialchars((string) $t, ENT_QUOTES, 'UTF-8'); }
function esc_attr($t) { return esc_html($t); } function esc_url($u) { return $u; }
function get_stylesheet_directory_uri() { return 'https://example.test/theme'; }
function get_stylesheet_directory() { return dirname(__DIR__); }

/* A tiny post store, so the wp-admin path can be exercised without WordPress. */
$GLOBALS['posts'] = array();          // id => ['title' => ..., 'meta' => [...]]
function cc25_test_add_player($id, $title, $meta) { $GLOBALS['posts'][$id] = array('title' => $title, 'meta' => $meta); }
function cc25_test_clear_players() { $GLOBALS['posts'] = array(); }
function post_type_exists($t) { return $t === 'cc25_player'; }
function get_posts($args = array()) {
    $out = array();
    foreach ($GLOBALS['posts'] as $id => $p) $out[] = (object) array('ID' => $id);
    return $out;
}
function get_the_title($p) { $id = is_object($p) ? $p->ID : $p; return $GLOBALS['posts'][$id]['title'] ?? ''; }
function get_post_meta($id, $k, $single = true) { return $GLOBALS['posts'][$id]['meta'][$k] ?? ''; }

if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/* ------------------------------------ with nothing entered, nothing changes */

cc25_test_clear_players();
$res = cc25_reserves_squad();
check('the Reserves fall back to the list in the theme', count($res) > 15);
check('and keep the shape the template reads',
      isset($res[0]['name']) && array_key_exists('pos', $res[0]));
$vets = cc25_vets_squad();
check('the Vets fall back too', count($vets) > 15);
check('keeping their FAW registration numbers', !empty($vets[0]['id']));
$mens = cc25_squad_players();
check('the men come back grouped', isset($mens['Goalkeeper']) && isset($mens['Defenders']));
check('with name and card slug per player',
      is_array($mens['Goalkeeper'][0]) && count($mens['Goalkeeper'][0]) === 2);
check('the U18s are still empty and say so', cc25_u18s_squad() === array());

/* ------------------------------------- a team with posts uses ONLY its posts */

cc25_test_clear_players();
cc25_test_add_player(1, 'Owain Test', array('_cc25_player_team' => 'reserves', '_cc25_player_no' => '7', '_cc25_player_pos' => 'GK'));
cc25_test_add_player(2, 'Gareth Test', array('_cc25_player_team' => 'reserves', '_cc25_player_no' => '', '_cc25_player_pos' => ''));

$res = cc25_reserves_squad();
check('the Reserves now come from wp-admin', count($res) === 2);
check('the hardcoded squad is gone, not merged into',
      !in_array('Jamie Pring', array_column($res, 'name'), true));
check('the entered names come through', array_column($res, 'name') === array('Gareth Test', 'Owain Test')
      || array_column($res, 'name') === array('Owain Test', 'Gareth Test'));
check('a shirt number is kept', in_array(7, array_column($res, 'no'), true));

// One team's entries must not touch another's.
check('the Vets are untouched by Reserves posts', count(cc25_vets_squad()) > 15);
check('and so are the men', isset(cc25_squad_players()['Defenders']));

/* ------------------------------- the men keep their groups and their artwork */

cc25_test_clear_players();
cc25_test_add_player(1, 'Alun Keeper', array('_cc25_player_team' => 'mens', '_cc25_player_group' => 'Goalkeeper', '_cc25_player_slug' => 'alun-keeper'));
cc25_test_add_player(2, 'Dai Defender', array('_cc25_player_team' => 'mens', '_cc25_player_group' => 'Defenders'));
$m = cc25_squad_players();
check('the men come from wp-admin too', isset($m['Goalkeeper']) && count($m['Goalkeeper']) === 1);
check('the card slug survives', $m['Goalkeeper'][0][1] === 'alun-keeper');
check('a player with no slug gets an empty one, not a missing index',
      isset($m['Defenders'][0][1]) && $m['Defenders'][0][1] === '');
check('groups keep the order the page prints them in',
      array_slice(array_keys($m), 0, 2) === array('Management', 'Goalkeeper')
      || array_keys($m) === array('Goalkeeper', 'Defenders'));

/* --------------------------------------------- names are the join key: guard */

cc25_test_clear_players();
// Every name that appears in a team sheet for this team.
$known = cc25_squad_known_names('mens');
check('the team sheets are readable', count($known) > 10);
check('a name from a team sheet is recognised', cc25_squad_name_known('mens', 'Arthur Furness'));
check('and the check is not case-sensitive', cc25_squad_name_known('mens', 'arthur furness'));
check('a name nobody has played under is not', !cc25_squad_name_known('mens', 'Nobody Atall'));

// The live problem this is for: appearances recorded under a spelling the squad
// list does not use, so the player is detached from his own stats.
$orphans = cc25_squad_unlisted('mens');
check('players with appearances but no squad entry are found', count($orphans) > 0);
check('Louis Cochrane is one of them', in_array('louis cochrane', array_map('strtolower', $orphans), true));
check('a listed player is not flagged', !in_array('arthur furness', array_map('strtolower', $orphans), true));

/* ------------------------- a suggestion has to survive a shortened forename */

// "Jonny" for "Jonathan" is five edits — past any sane edit-distance threshold, and
// exactly the case the warning exists for. Footballers share a surname with their
// own team sheet far more reliably than they share a spelling.
check('a shortened forename still suggests the sheet spelling',
      in_array('Jonathan Invernizzi', cc25_squad_nearest_names('mens', 'Jonny Invernizzi'), true));
check('and so does a swapped vowel',
      in_array('Louis Cochrane', cc25_squad_nearest_names('mens', 'Lewis Cochrane'), true));
check('an unrelated name suggests nothing',
      cc25_squad_nearest_names('mens', 'Zebedee Nonesuch') === array());

/* ------------------- the sheets themselves disagreeing is the worse problem */

// COMET has spelled the same player both ways across two matches, so his
// appearances are split between two keys and he loses games whichever the squad
// list picks. Nothing else on the site would ever say so.
$v = cc25_squad_name_variants('mens');
check('two spellings of one surname are spotted', !empty($v));
check('Cochrane is the pair', isset($v['cochrane']) && count($v['cochrane']) === 2);
check('both spellings are named',
      in_array('Lewis Cochrane', $v['cochrane'], true) && in_array('Louis Cochrane', $v['cochrane'], true));
check('a surname used once is not flagged', !isset($v['furness']));

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
