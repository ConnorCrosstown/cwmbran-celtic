<?php
/**
 * Assertions over match reports. Run from the theme root:
 *   php _tests/report-test.php
 *
 * Two risks. A report that contradicts the results page, which is why the score
 * is read from the fixture and never typed into the article. And a report pasted
 * out of Word bringing its own fonts and colours, which is the one way a
 * volunteer really can break the styling.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
function esc_url($u) { return htmlspecialchars((string) $u, ENT_QUOTES); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/* ---- Prose hardening: what a paste out of Word must not bring with it ---- */

// Calls the production function, not a copy of its patterns — a test that
// reimplements what it is testing passes even when the real thing is broken.
function strip_prose($html) { return cc25_strip_pasted_formatting($html); }

$word = '<p class="MsoNormal" style="font-family:Calibri;color:#ff0000">'
      . '<font face="Arial" size="4">Cwmbran Celtic ran out comfortable winners.</font></p>';
$clean = strip_prose($word);
check('an inline style attribute is stripped', strpos($clean, 'style=') === false);
check('a font tag is stripped', stripos($clean, '<font') === false);
check('a colour attribute is stripped', strpos($clean, 'color=') === false);
check("Word's MsoNormal class is stripped", strpos($clean, 'Mso') === false);
check('the words themselves survive', strpos($clean, 'ran out comfortable winners') !== false);
check('the paragraph tag survives', strpos($clean, '<p') !== false);

// Legitimate markup must be left alone — this is prose, not a whitelist.
$ok = '<p>A <strong>fine</strong> win, with a <a href="/fixtures/">tough trip</a> next.</p><ul><li>Wood 12&rsquo;</li></ul>';
check('ordinary markup is untouched', strip_prose($ok) === $ok);
check('a link href is not stripped', strpos(strip_prose($ok), 'href="/fixtures/"') !== false);
// A single-quoted style attribute is just as dangerous as a double-quoted one.
check("a single-quoted style is stripped", strpos(strip_prose("<p style='color:red'>x</p>"), 'style') === false);
// Empty and non-string input must not blow up.
check('empty content is safe', strip_prose('') === '');

/* ---- Attaching a report to a game ---- */

$games = cc25_mr_recent_games();
check('games are offered to attach a report to', count($games) > 0);
check('the keys are team|date', (bool) preg_match('/^(mens|reserves|womens)\|\d{4}-\d{2}-\d{2}$/', array_key_first($games)));
check('the newest game is first', strcmp(
    substr(array_key_first($games), strpos(array_key_first($games), '|') + 1),
    substr(array_keys($games)[count($games) - 1], strpos(array_keys($games)[count($games) - 1], '|') + 1)
) > 0);
// A game months away has nothing to report on yet.
$far = array_filter(array_keys($games), function ($k) {
    return strtotime(substr($k, strpos($k, '|') + 1)) > time() + 30 * 86400;
});
check('games far in the future are not offered', $far === array());
// The Reserves' played cup tie is exactly what someone would report on.
check('a played game is offered', isset($games['reserves|2026-08-07']));
check('a TBC opponent is never offered', !array_filter($games, function ($l) { return strpos($l, 'TBC') !== false; }));

/* ---- Links on a match row ---- */

// Without WordPress there is nothing attached, and nothing must be rendered —
// a row must not grow an empty button.
check('no report without WordPress', cc25_report_for('mens', '2026-07-28') === null);
check('no programme without WordPress', cc25_programme_for_date('2026-07-28') === null);
$links = cc25_match_links('mens', '2026-07-28');
check('links come back empty, not missing', $links === array('report' => '', 'programme' => ''));
check('empty links render no buttons', cc25_match_link_buttons($links) === '');
check('a missing key renders no buttons', cc25_match_link_buttons(array()) === '');

// With links present, both buttons render and are labelled for what they are.
$both = cc25_match_link_buttons(array('report' => '/news/report/', 'programme' => '/programme/x/'));
check('a report button renders', strpos($both, 'Match Report') !== false);
check('a programme button renders', strpos($both, 'Programme</a>') !== false);
check('the buttons are links', substr_count($both, '<a ') === 2);
// One without the other must not drag the other along.
check('report only gives one button', substr_count(cc25_match_link_buttons(array('report' => '/a/')), '<a ') === 1);
check('programme only gives one button', substr_count(cc25_match_link_buttons(array('programme' => '/b/')), '<a ') === 1);

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
