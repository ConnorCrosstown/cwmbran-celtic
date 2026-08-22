<?php
/**
 * Assertions over the two things that turn an official record into a report:
 * reading the match id off an uploaded PDF, and drafting the words. Run from the
 * theme root:
 *   php _tests/report-build-test.php
 *
 * The draft is deterministic prose built from the imported record alone. It must
 * never assert anything the record does not hold — a report that invents a
 * half-time score or an attendance is worse than no report, because nobody
 * checks a sentence that reads plausibly.
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
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/* =================================================== A. the id off an upload */

$pdf = array('name' => 'match_108116564_20260821_230036.pdf', 'type' => 'application/pdf',
             'tmp_name' => tempnam(sys_get_temp_dir(), 'cc'), 'error' => 0, 'size' => 4096);
file_put_contents($pdf['tmp_name'], "%PDF-1.4\n% a real enough pdf\n");

$r = cc25_comet_pdf_upload_id($pdf);
check('the match id is read off the filename', $r['id'] === '108116564');
check('and no error is reported', $r['error'] === '');

check('no file at all is not an error', cc25_comet_pdf_upload_id(null)['error'] === ''
      && cc25_comet_pdf_upload_id(null)['id'] === '');
check('an empty upload slot is not an error',
      cc25_comet_pdf_upload_id(array('error' => 4, 'name' => '', 'tmp_name' => '', 'size' => 0))['error'] === '');

$bad = $pdf; $bad['error'] = 1;
check('a failed upload is reported', cc25_comet_pdf_upload_id($bad)['error'] !== '');

// Content is checked, not just the extension — an .pdf that is not one is refused.
$fake = $pdf; $fake['tmp_name'] = tempnam(sys_get_temp_dir(), 'cc');
file_put_contents($fake['tmp_name'], "<?php echo 'not a pdf';");
$r = cc25_comet_pdf_upload_id($fake);
check('a file that is not really a PDF is refused', $r['id'] === '' && stripos($r['error'], 'pdf') !== false);

$noid = $pdf; $noid['name'] = 'report-final-v2.pdf';
$r = cc25_comet_pdf_upload_id($noid);
check('a PDF with no id in its name says so', $r['id'] === '' && $r['error'] !== '');

$big = $pdf; $big['size'] = 40 * 1024 * 1024;
check('an implausibly large file is refused', cc25_comet_pdf_upload_id($big)['error'] !== '');
@unlink($pdf['tmp_name']); @unlink($fake['tmp_name']);

/* ==================================================== B. drafting the words */

$m = array(
    'team' => 'reserves', 'date' => '2026-08-21', 'time' => '18:30', 'opp' => 'Rogerstone',
    'home' => true, 'cc' => 0, 'oc' => 1, 'comp' => 'Gwent Premier Combination League',
    'round' => 'Round 2', 'venue' => 'Motazone Arena, Cwmbran', 'att' => 0,
    'ref' => 'Jamie Collins', 'captain' => 'Jamie Pring', 'opp_captain' => 'Ryan Cook',
    'goals' => array(),
    'opp_goals' => array(array('scorer' => 'Sebastian Bowen', 'assist' => 'Daniel Butler', 'min' => 71)),
    'cards' => array(), 'opp_cards' => array(),
    'subs_made' => array(
        array('min' => 61, 'off' => 'Cam Williams', 'on' => 'Rhys Jones'),
        array('min' => 71, 'off' => 'Sam Smith', 'on' => 'Daniel Madge'),
    ),
    'starters' => array(array(1, 'Jamie Pring', 'GK')), 'subs' => array(),
);
$d = cc25_match_report_draft($m);

check('the draft is prose, not markup', strip_tags($d) === $d);
check('it is more than one paragraph', substr_count($d, "\n\n") >= 1);
check('the opponent is named', strpos($d, 'Rogerstone') !== false);
check('the scorer and minute are given', strpos($d, 'Sebastian Bowen') !== false && strpos($d, '71') !== false);
check('the assist is credited', strpos($d, 'Daniel Butler') !== false);
check('the substitutes are named', strpos($d, 'Rhys Jones') !== false && strpos($d, 'Daniel Madge') !== false);
check('the captain is named', strpos($d, 'Jamie Pring') !== false);
check('the referee is named', strpos($d, 'Jamie Collins') !== false);

// The things the record does NOT hold must not appear.
check('no half-time score is invented', stripos($d, 'half-time') === false && stripos($d, 'at the break') === false);
check('a blank attendance is not printed as a crowd of zero', strpos($d, '0 ') !== 0 && stripos($d, 'attendance') === false);

/* a venue that already names itself "The ..." must not gain a second one */
$theven = $m; $theven['venue'] = 'The Motazone Arena, Cwmbran';
$tv = cc25_match_report_draft($theven);
check('a venue starting with The is not doubled', stripos($tv, 'the The') === false);
check('and is still named', strpos($tv, 'Motazone Arena') !== false);
$plain = $m; $plain['venue'] = 'Motazone Arena, Cwmbran';
check('a venue without one still gets its article',
      stripos(cc25_match_report_draft($plain), 'the Motazone Arena') !== false);
check('the county is dropped from the venue', strpos($tv, 'Cwmbran.') === false);

/* a win, a draw, and a game with no goals at all */
$win = $m; $win['cc'] = 3; $win['oc'] = 1;
$win['goals'] = array(array('scorer' => 'Daniel Madge', 'assist' => '', 'min' => 12));
check('a win does not read as a defeat', stripos(cc25_match_report_draft($win), 'beaten') === false);
check('and names our own scorer', strpos(cc25_match_report_draft($win), 'Daniel Madge') !== false);

$draw = $m; $draw['cc'] = 1; $draw['oc'] = 1;
$draw['goals'] = array(array('scorer' => 'Sam Smith', 'assist' => '', 'min' => 30));
$dd = cc25_match_report_draft($draw);
check('a draw reads as a draw', stripos($dd, 'drew') !== false || stripos($dd, 'draw') !== false);
check('and not as a win or a defeat', stripos($dd, 'beat ') === false && stripos($dd, 'lost ') === false);

$nil = $m; $nil['cc'] = 0; $nil['oc'] = 0; $nil['opp_goals'] = array();
$nnd = cc25_match_report_draft($nil);
check('a goalless draw still produces a report', strlen($nnd) > 80);
check('and does not claim a scorer', stripos($nnd, 'scored') === false);

/* cards, and the after-the-whistle case the record can carry */
$carded = $m;
$carded['opp_cards'] = array(array('min' => 'AM', 'player' => 'Oliver Smith', 'type' => 'y', 'reason' => ''));
$cd = cc25_match_report_draft($carded);
check('a card is mentioned', strpos($cd, 'Oliver Smith') !== false);
check('and an after-the-whistle card is not called a minute',
      strpos($cd, "AM'") === false && strpos($cd, 'AM minute') === false);

/* season context, when the rest of the season is offered */
$season = array(
    $m,
    array('team' => 'reserves', 'date' => '2026-08-15', 'cc' => 1, 'oc' => 2, 'opp' => 'Croesyceiliog'),
    array('team' => 'reserves', 'date' => '2026-08-07', 'cc' => 1, 'oc' => 2, 'opp' => 'Rogerstone'),
);
$withctx = cc25_match_report_draft($m, $season);
check('the season record is worked out', stripos($withctx, 'three') !== false);
check('and it is longer than the bare draft', strlen($withctx) > strlen($d));
// "a three defeat from three" is not English.
check('the count is an ordinal, not a cardinal', stripos($withctx, 'third defeat') !== false);
check('and never reads "a three defeat"', stripos($withctx, 'a three defeat') === false);

/* lists read as lists, and a repeated detail is said once */
$two = $m;
$two['opp_cards'] = array(
    array('min' => 'AM', 'player' => 'Oliver Smith', 'type' => 'y', 'reason' => ''),
    array('min' => 'AM', 'player' => 'Ryan Cook',    'type' => 'y', 'reason' => ''),
);
$tc = cc25_match_report_draft($two);
check('two names are joined with "and"', strpos($tc, 'Oliver Smith and Ryan Cook') !== false);
check('a shared timing is stated once',
      substr_count($tc, 'after the final whistle') === 1);

$mixed = $m;
$mixed['opp_cards'] = array(
    array('min' => 33, 'player' => 'Ryan Cook', 'type' => 'y', 'reason' => ''),
    array('min' => 'AM', 'player' => 'Oliver Smith', 'type' => 'y', 'reason' => ''),
);
$mc = cc25_match_report_draft($mixed);
check('differing timings are each kept', strpos($mc, 'on 33') !== false
      && strpos($mc, 'after the final whistle') !== false);

/* the draft must never silently replace something a person wrote */
check('an existing report is not overwritten', cc25_report_draft_should_write('Words already here.', false) === false);
check('unless overwriting is asked for', cc25_report_draft_should_write('Words already here.', true) === true);
check('an empty box is always filled', cc25_report_draft_should_write('   ', false) === true);

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
