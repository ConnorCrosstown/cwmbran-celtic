<?php
/**
 * Assertions over opponent crest resolution. Run from the theme root:
 *   php _tests/crest-test.php
 *
 * The bug this pins: the live feed only carries crests for clubs in the Ardal
 * SE fixtures, so a CUP opponent resolved to nothing — even when the club had
 * their artwork bundled in assets/img/opponents/ all along. cc25_res_crest()
 * always consulted that bundled set; cc25_crest(), which the home page's match
 * card uses, never did. Newport Corinthians showed with no crest in the Welsh
 * Cup card while newport-corinthians.png sat in the theme.
 *
 * And the second half: .crest is white text with NO background of its own, so
 * the colourless last-resort span rendered white on the white match card and
 * read as no crest at all.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
function esc_url($u) { return htmlspecialchars((string) $u, ENT_QUOTES); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function add_query_arg($k, $v, $u) { return $u . (strpos($u, '?') === false ? '?' : '&') . $k . '=' . rawurlencode($v); }
function home_url($p = '') { return 'https://www.cwmbranceltic.com' . $p; }
function get_page_by_path($s) { return null; }
function get_permalink($p = 0) { return 'https://www.cwmbranceltic.com/'; }
function get_stylesheet_directory_uri() { return 'https://www.cwmbranceltic.com/wp-content/themes/cwmbran-celtic-2025'; }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

$feed = array('crests' => array(
    'Goytre' => array('kind' => 'image', 'src' => 'https://feed.example/goytre.png'),
    'Undy'   => array('kind' => 'monogram', 'hue' => 200, 'initials' => 'UN'),
));

// The feed still wins where it has something.
check('a crest the feed carries is used',
    strpos(cc25_crest($feed, 'Goytre', 60), 'goytre.png') !== false);
check('a monogram the feed carries is used',
    strpos(cc25_crest($feed, 'Undy', 60), 'hsl(200') !== false);
check('our own crest is untouched',
    strpos(cc25_crest($feed, 'Cwmbran Celtic', 60), 'crest') !== false);

// The bug: a cup opponent absent from the feed but present in the bundled set.
$np = cc25_crest($feed, 'Newport Corinthians', 60);
check('a cup opponent falls back to the bundled crest',
    strpos($np, 'assets/img/opponents/newport-corinthians.png') !== false);
check('and renders as a real image, not a badge', strpos($np, '<img') === 0);

// Every bundled crest must now be reachable from the home page's resolver,
// not just from the reserves one.
$reachable = true;
foreach (array('Croesyceiliog', 'Tata Steel United', 'Caldicot Town', 'Penybont') as $club) {
    if (strpos(cc25_crest($feed, $club, 60), 'assets/img/opponents/') === false) $reachable = false;
}
check('the bundled set is reachable from cc25_crest, not only cc25_res_crest', $reachable);

// The last resort must still be visible.
$unknown = cc25_crest($feed, 'Somewhere Rovers', 60);
check('an unknown club still gets a badge', strpos($unknown, '<span') === 0);
check('the badge carries its own background, or it is white on white',
    strpos($unknown, 'background:radial-gradient') !== false);
check('the badge shows word initials', strpos($unknown, '>SR<') !== false);
check('a club keeps the same colour every time',
    cc25_crest($feed, 'Somewhere Rovers', 60) === cc25_crest($feed, 'Somewhere Rovers', 60));
check('different clubs get different colours',
    cc25_crest($feed, 'Somewhere Rovers', 60) !== cc25_crest($feed, 'Anywhere Town', 60));
check('a one-word club still gets initials', strpos(cc25_crest($feed, 'Rovers', 60), '>R<') !== false);
check('an empty name does not fatal', is_string(cc25_crest($feed, '', 60)));

echo "\n" . ($failures ? count($failures) . ' FAILED' : 'All checks passed') . "\n";
exit($failures ? 1 : 0);
