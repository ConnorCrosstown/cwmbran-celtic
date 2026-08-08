<?php
/**
 * Assertions over the paste-a-table parser. Run from the theme root:
 *   php _tests/table-test.php
 *
 * This field exists because the club sends lists as pasted tables. Which means
 * the input is whatever a spreadsheet, an email or a phone produces — so the
 * parser has to be forgiving, and a bad paste must cost a re-save, never someone's
 * afternoon.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {}
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../inc/hardening.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

$COLS = array('no', 'prize', 'name', 'group');

// The real August table, as it was handed over — header row and all.
$august = "Bond No | Prize | Name | Payment Group
306 | £500 | Harri Pritchard | Youth Team
62 | £50 | Stephen Fry | Walking Football
317 | £50 | Christopher Naylor | Walking Football
180 | £50 | Philip Kruszewski | Walking Football
64 | £50 | Dean Taylor | Vets
267 | Ear Buds | Joanne Berry | Mens 1st Team";
$r = cc25_parse_table($august, $COLS);
check('the real August table gives 6 winners', count($r) === 6);
check('the header row is dropped', $r[0]['no'] === '306');
check('the £500 winner is read', $r[0]['name'] === 'Harri Pritchard' && $r[0]['prize'] === '£500');
check('a non-cash prize survives', $r[5]['prize'] === 'Ear Buds');
check('the last group is read', $r[5]['group'] === 'Mens 1st Team');

// A spreadsheet paste is tab-separated, not pipes.
$tabs = "306\t£500\tHarri Pritchard\tYouth Team\n62\t£50\tStephen Fry\tWalking Football";
$t = cc25_parse_table($tabs, $COLS);
check('a tab-separated paste works', count($t) === 2 && $t[1]['name'] === 'Stephen Fry');

// Untidy input a person would actually produce.
$messy = "  306  |  £500  | Harri Pritchard |Youth Team  \n\n\n62|£50|Stephen Fry|Walking Football\n";
$m = cc25_parse_table($messy, $COLS);
check('stray whitespace is trimmed', count($m) === 2 && $m[0]['no'] === '306' && $m[0]['group'] === 'Youth Team');
check('blank lines are skipped', count($m) === 2);

// A missing trailing column pads rather than throwing.
$short = "306 | £500 | Harri Pritchard";
$sh = cc25_parse_table($short, $COLS);
check('a short row is padded, not dropped', count($sh) === 1 && $sh[0]['group'] === '');

// Things that are not tables.
check('an empty paste gives nothing', cc25_parse_table('', $COLS) === array());
check('whitespace only gives nothing', cc25_parse_table("  \n \n", $COLS) === array());
check('prose with no separators gives nothing', cc25_parse_table("we had six winners this month", $COLS) === array());
check('separators alone give nothing', cc25_parse_table('| | |', $COLS) === array());

// A name containing a comma must not be split — the reason commas aren't a separator.
$comma = "306 | £500 | Pritchard, Harri | Youth Team";
$c = cc25_parse_table($comma, $COLS);
check('a comma in a name is left alone', $c[0]['name'] === 'Pritchard, Harri');

// Extra columns beyond what was asked for are ignored, not shifted in.
$extra = "306 | £500 | Harri Pritchard | Youth Team | paid | 12/08";
$e = cc25_parse_table($extra, $COLS);
check('extra columns are ignored', count($e) === 1 && $e[0]['group'] === 'Youth Team');

// A header using the club's own wording rather than our keys.
$worded = "No | Prize | Winner | Group\n306 | £500 | Harri Pritchard | Youth Team";
$w = cc25_parse_table($worded, $COLS);
check('a differently-worded header is still dropped', count($w) === 1 && $w[0]['no'] === '306');

// A table with no header must keep every row.
$noheader = "306 | £500 | Harri Pritchard | Youth Team\n62 | £50 | Stephen Fry | Walking Football";
check('a table with no header keeps all rows', count(cc25_parse_table($noheader, $COLS)) === 2);

// Header detection must not eat a real row. "62 | £50 | Dean Taylor | Vets" has
// nothing in common with the column names.
$firstrow = "62 | £50 | Dean Taylor | Vets\n64 | £50 | Someone Else | Vets";
check('a data row is never mistaken for a header', count(cc25_parse_table($firstrow, $COLS)) === 2);

// Different column sets reuse the same parser.
$fx = cc25_parse_table("2026-08-22 | Newport Corinthians | H | Welsh Cup QR2", array('date', 'opponent', 'venue', 'competition'));
check('the parser is not Bond-specific', $fx[0]['opponent'] === 'Newport Corinthians' && $fx[0]['venue'] === 'H');

// Cutover: with no WordPress to ask, the Bond page must fall back to the
// hand-maintained list and be identical to today. This is the guarantee that
// uploading the theme changes nothing until content is migrated.
require __DIR__ . '/../inc/bond-draws.php';
check('no WordPress means no draws from posts', cc25_bond_draws_from_posts() === array());

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
