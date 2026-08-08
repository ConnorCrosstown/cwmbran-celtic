<?php
/**
 * Assertions over the club contact directory. Run from the theme root:
 *   php _tests/people-test.php
 *
 * The data is people's names and phone numbers on a public page, so the things
 * worth pinning are: nobody gets duplicated because they hold three jobs, a
 * missing number degrades instead of breaking the card, and a number that would
 * not dial is caught rather than published.
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

/* -- The list itself --------------------------------------------------------- */

$people = cc25_people_static();
check('the club list is not empty', count($people) > 0);

/* One card per person. Karen Robinson holds three roles; three cards with the same
 * face and number would read as a padded committee. */
$names = array_map(function ($p) { return $p['name']; }, $people);
check('nobody appears twice', count($names) === count(array_unique($names)));

$karen = null;
foreach ($people as $p) { if ($p['name'] === 'Karen Robinson') { $karen = $p; break; } }
check('Karen Robinson is one person', $karen !== null);
check('...carrying all three of her roles', $karen && count($karen['roles']) === 3);
check('...including Safeguarding Officer', $karen && cc25_person_is_safeguarding($karen));

/* The ten-digit number the club first supplied must not have been kept. */
check('her number is the complete 11-digit one',
      $karen && preg_replace('/\D/', '', $karen['phone']) === '07961974920');

/* Everyone must land in a real group, or they silently vanish from the page. */
$groups = cc25_people_groups();
$orphans = array();
foreach ($people as $p) { if (!isset($groups[$p['group']])) $orphans[] = $p['name']; }
check('everyone is in a group that exists', $orphans === array());

/* Every listed number must be dialable — this is the check that would have caught
 * the short one, and it runs over the real data, not a fixture. */
$undialable = array();
foreach ($people as $p) {
    if (($p['phone'] ?? '') !== '' && !cc25_phone_looks_complete($p['phone'])) $undialable[] = $p['name'];
}
check('every published number is a complete UK number', $undialable === array());

/* Jack Shepherd was supplied without one. He should still be listed. */
$jack = null;
foreach ($people as $p) { if ($p['name'] === 'Jack Shepherd') { $jack = $p; break; } }
check('somebody with no number is still listed', $jack !== null);
check('...and yields no tel: link rather than a broken one',
      $jack && cc25_phone_href($jack['phone']) === '');

/* -- Grouping ---------------------------------------------------------------- */

$by = cc25_people_by_group($people);
check('groups come back in the declared order',
      array_keys($by) === array_values(array_intersect(array_keys($groups), array_keys($by))));
$total = 0;
foreach ($by as $g) { $total += count($g['people']); }
check('grouping loses nobody', $total === count($people));
check('an empty group is dropped rather than printing a bare heading',
      !isset(cc25_people_by_group(array(
          array('name' => 'A Person', 'group' => 'officials', 'roles' => array('Chair'), 'phone' => ''),
      ))['social']));

/* -- Phone helpers ----------------------------------------------------------- */

check('a mobile becomes a tel: link', cc25_phone_href('07961 974920') === 'tel:07961974920');
check('a landline becomes a tel: link', cc25_phone_href('01633 774019') === 'tel:01633774019');
check('punctuation is stripped', cc25_phone_href('(01633) 774-019') === 'tel:01633774019');
check('an international number keeps its plus', cc25_phone_href('+44 7961 974920') === 'tel:+447961974920');
check('an empty number yields no link', cc25_phone_href('') === '');
check('junk yields no link rather than a dead tel:', cc25_phone_href('ask at the bar') === '');
check('a too-short number yields no link', cc25_phone_href('12345') === '');

check('a 10-digit mobile is flagged incomplete', !cc25_phone_looks_complete('07961 97492'));
check('an 11-digit mobile passes', cc25_phone_looks_complete('07961 974920'));
check('an 11-digit landline passes', cc25_phone_looks_complete('01633 774019'));
check('a blank number is not "incomplete"', cc25_phone_looks_complete(''));

/* -- Initials fallback ------------------------------------------------------- */

check('two names give two initials', cc25_person_initials('Barrie Desmond') === 'BD');
check('a single name gives one', cc25_person_initials('Madonna') === 'M');
check('three names still give two', cc25_person_initials('Mary Jane Watson') === 'MJ');
check('extra spaces do not produce spaces', cc25_person_initials('  Sue   Perrett ') === 'SP');
check('an empty name falls back to the club', cc25_person_initials('') === 'CC');

/* -- Roles parsing (what the wp-admin textarea produces) --------------------- */

check('one role per line', cc25_person_roles_parse("General Manager\nTreasurer") === array('General Manager', 'Treasurer'));
check('blank lines are dropped', cc25_person_roles_parse("Chair\n\n\nSecretary") === array('Chair', 'Secretary'));
check('windows line endings work', cc25_person_roles_parse("Chair\r\nSecretary") === array('Chair', 'Secretary'));
check('whitespace is trimmed', cc25_person_roles_parse("  Chair  \n Secretary ") === array('Chair', 'Secretary'));
check('an empty textarea gives no roles', cc25_person_roles_parse('') === array());

/* -- Safeguarding detection -------------------------------------------------- */

check('safeguarding is found whatever the case',
      cc25_person_is_safeguarding(array('roles' => array('SAFEGUARDING officer'))));
check('a treasurer is not a safeguarding contact',
      !cc25_person_is_safeguarding(array('roles' => array('Treasurer'))));
check('no roles is not a safeguarding contact', !cc25_person_is_safeguarding(array()));
/* Exactly one, or the page's callout picks an arbitrary person. */
$safe = 0;
foreach ($people as $p) { if (cc25_person_is_safeguarding($p)) $safe++; }
check('there is exactly one safeguarding contact', $safe === 1);

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
