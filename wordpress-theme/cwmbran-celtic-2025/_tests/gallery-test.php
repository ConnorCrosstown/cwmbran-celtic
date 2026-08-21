<?php
/**
 * Assertions over match photography. Run from the theme root:
 *   php _tests/gallery-test.php
 *
 * The important property is that this is INVISIBLE until there are photos: it
 * shipped before the club's photographer had taken any, so every report had to go
 * on rendering exactly as it did. The rest is the ID parser, which decides whether
 * a gallery renders at all — a stray 0 or empty string there is a broken image on
 * a public page.
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

/* -- Degrading to nothing ----------------------------------------------------- */

/* No WordPress here, so there is no post type to ask. Every one of these must be
 * the empty answer rather than a warning or a fatal — this is exactly the state
 * the live site is in for every game until a gallery is created. */
check('no gallery outside WordPress', cc25_match_gallery('mens', '2026-08-22') === null);
check('no credit default outside WordPress', cc25_photo_credit_default() === '');
check('the report surfaces render nothing', cc25_match_gallery_html('mens', '2026-08-22') === '');
check('an unknown game renders nothing', cc25_match_gallery_html('womens', '1999-01-01') === '');

/* -- The ID parser ------------------------------------------------------------ */

check('a plain list parses', cc25_gallery_parse_ids('4,8,15') === array(4, 8, 15));
check('order is preserved, not sorted', cc25_gallery_parse_ids('15,4,8') === array(15, 4, 8));
check('spaces are tolerated', cc25_gallery_parse_ids(' 4 , 8 ,15 ') === array(4, 8, 15));
check('an empty string gives no photos', cc25_gallery_parse_ids('') === array());
check('trailing commas do not become photos', cc25_gallery_parse_ids('4,8,') === array(4, 8));
check('a lone comma gives no photos', cc25_gallery_parse_ids(',') === array());

/* A 0 or a negative would render a broken image; both must be dropped. */
check('zero is not an attachment', cc25_gallery_parse_ids('4,0,8') === array(4, 8));
check('negatives are dropped', cc25_gallery_parse_ids('4,-3,8') === array(4, 8));
check('non-numeric junk is dropped', cc25_gallery_parse_ids('4,banana,8') === array(4, 8));

/* The same photo twice in one gallery is a mistake, not a choice. */
check('duplicates are collapsed', cc25_gallery_parse_ids('4,8,4,8,4') === array(4, 8));

/* Whatever the browser posts is re-serialised through this on save, so round
 * tripping has to be stable or the stored value drifts on every edit. */
$once  = cc25_gallery_parse_ids('9, 0, 3,3, banana, 7');
$twice = cc25_gallery_parse_ids(implode(',', $once));
check('parsing is idempotent', $once === $twice && $once === array(9, 3, 7));

/* Types matter: these go into intval()/esc_url() paths and get compared with
 * in_array(..., true). */
check('IDs come back as integers', $once === array_map('intval', $once));

/* -- Defensive input --------------------------------------------------------- */

check('null parses to nothing', cc25_gallery_parse_ids(null) === array());
check('an integer parses to itself', cc25_gallery_parse_ids(42) === array(42));
check('a huge id is kept as an int', cc25_gallery_parse_ids('999999999') === array(999999999));

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
