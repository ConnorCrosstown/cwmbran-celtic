<?php
/**
 * Assertions over the Walking Football data functions. Run from the theme root:
 *   php _tests/wf-data-test.php
 * functions.php loads standalone with these two no-op stubs; WordPress never
 * loads this file.
 */
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

// Sessions
$s = cc25_wf_sessions();
check('7 sessions', count($s) === 7);
check('every session has label, day, time', count(array_filter($s, function ($r) {
    return !empty($r['label']) && !empty($r['day']) && !empty($r['time']);
})) === 7);
$days = array_unique(array_column($s, 'day'));
sort($days);
check('days are Wed/Thu/Fri/Sun', $days === array('Friday', 'Sunday', 'Thursday', 'Wednesday'));
check('three Thursday sessions', count(array_filter($s, function ($r) {
    return $r['day'] === 'Thursday';
})) === 3);

// Venue
$v = cc25_wf_venue();
check('venue is Llantarnam school', strpos($v['name'], 'Llantarnam') !== false);
check('venue address has postcode', strpos($v['address'], 'NP44 3XB') !== false);
check('venue map link is https', strpos($v['map'], 'https://') === 0);

// Prices
$p = cc25_wf_prices();
check('3 price rows', count($p) === 3);
check('one row flagged as the Bond', count(array_filter($p, function ($r) {
    return !empty($r['bond']);
})) === 1);
check('prices are 6/10/10', array_column($p, 'price') === array('£6', '£10', '£10'));

// Timeline
$t = cc25_wf_timeline();
check('12 timeline rows', count($t) === 12);
check('starts January 2024', $t[0]['when'] === 'January 2024');
check('ends with the tri-national', strpos($t[count($t) - 1]['what'], 'Wales, Ireland and England') !== false);
check('every row has when and what', count(array_filter($t, function ($r) {
    return !empty($r['when']) && !empty($r['what']);
})) === 12);

// Links
$l = cc25_wf_links();
foreach (array('site','sessions','story','inclusion','sponsorship','gallery','contact','facebook','whatsapp','phone') as $k) {
    check("links has '$k'", isset($l[$k]) && $l[$k] !== '');
}
check('domain has no "club"', strpos($l['site'], 'walkingfootballclub') === false);
check('site is the right domain', strpos($l['site'], 'cwmbrancelticwalkingfootball.co.uk') !== false);
check('phone is the section mobile', preg_replace('/\s+/', '', $l['phone']) === '07919323520');
check('whatsapp uses the international number', $l['whatsapp'] === 'https://wa.me/447919323520');

echo "\n";
if ($failures) { echo count($failures) . " FAILED\n"; exit(1); }
echo "all passed\n";
