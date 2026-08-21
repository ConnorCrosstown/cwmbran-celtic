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

function add_action() {} function add_filter() {} function remove_action() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
function esc_url($u) { return htmlspecialchars((string) $u, ENT_QUOTES); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function add_query_arg($k, $v, $u) { return $u . (strpos($u, '?') === false ? '?' : '&') . $k . '=' . rawurlencode($v); }
function home_url($p = '') { return 'https://www.cwmbranceltic.com' . $p; }
function get_page_by_path($s) { return $s === 'match-report' ? (object) array('ID' => 1) : null; }
function get_permalink($p = 0) { return 'https://www.cwmbranceltic.com/match-report/'; }
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

// No post-based report or programme exists without WordPress.
check('no post-based report without WordPress', cc25_report_for('mens', '2026-07-28') === null);
check('no programme without WordPress', cc25_programme_for_date('2026-07-28') === null);

// But a game with a full match-centre report still offers one, in its own slot.
$has = cc25_match_links('mens', '2026-07-28');
check('a match-centre report is still offered', strpos($has['centre'], 'g=2026-07-28') !== false);

// The team must travel INSIDE g. A separate parameter was silently dropped by the
// CDN, whose cache key includes g and ignores everything else, so ?g=<date>&t=reserves
// served the men's cached report. That is the bug these next checks exist for.
$res = cc25_match_links('reserves', '2026-08-07');
$men = cc25_match_links('mens', '2026-08-07');
check('the reserves URL carries the team inside g', strpos($res['centre'], 'g=2026-08-07-reserves') !== false);
check('the reserves URL uses no second parameter', strpos($res['centre'], 't=') === false);
check('the same date gives the men a bare date', strpos($men['centre'], 'g=2026-08-07&') === false && strpos($men['centre'], 'g=2026-08-07') !== false);
check('and the two are not the same link', $men['centre'] !== $res['centre']);

/* -- The article and the match centre are two destinations ---------------------
 * They were one slot with the article winning, so publishing a news write-up hid
 * that game's line-ups, stats and officials behind it — the results row could no
 * longer reach the match centre at all. Both are offered when both exist. */
$pair = cc25_match_link_buttons(array('report' => '/news/vets-win/', 'centre' => '/match-report/?g=x'));
check('an article and the centre give two buttons', substr_count($pair, '<a ') === 2);
check('the article keeps the plain name', strpos($pair, '>Match Report</a>') !== false);
check('the centre is named for what it holds', strpos($pair, 'Line-ups &amp; Stats') !== false);
check('the article link is present', strpos($pair, '/news/vets-win/') !== false);
check('the centre link is present', strpos($pair, 'g=x') !== false);

/* On its own the match centre IS the match report, and must not be renamed — two
 * rows offering differently-named links to the same kind of page would read as
 * two different things existing. */
$only = cc25_match_link_buttons(array('centre' => '/match-report/?g=y'));
check('the centre alone gives one button', substr_count($only, '<a ') === 1);
check('and is called Match Report', strpos($only, '>Match Report</a>') !== false);
check('not Line-ups & Stats', strpos($only, 'Line-ups') === false);

/* Belt and braces: if the two ever resolve to the same URL, offer it once. */
$same = cc25_match_link_buttons(array('report' => '/same/', 'centre' => '/same/'));
check('the same URL twice gives one button', substr_count($same, '<a ') === 1);

/* -- Penalty shootouts -------------------------------------------------------
 * A cup tie settled on penalties reads as an ordinary draw everywhere unless the
 * shootout is carried separately: COMET keeps it on the match rather than in the
 * events, so the Vets' 2-2 hid a 4-3 win until someone at the game said so. */
$pen = cc25_find_match('2026-08-16', 'vets');
check('the Vets cup tie is on record', $pen !== null);
check('its shootout is 4-3 to Celtic', cc25_match_pens($pen) === array(4, 3));
check('the score after ninety is still a draw', intval($pen['cc']) === intval($pen['oc']));
check('the shootout is said in words', cc25_pens_line($pen) === 'Cwmbran Celtic won 4-3 on penalties');
check('the summary carries the shootout', strpos(cc25_match_summary($pen), 'won 4-3 on penalties') !== false);
check('the report does not call it a draw', stripos($pen['report'], 'point saved') === false);

/* The badge follows the shootout. Every surface that draws one — the front page's
 * featured card and its smaller cards, the results panels, the fixtures page —
 * used to compute W/D/L from the ninety minutes alone, so the Vets' cup win was
 * announced on the home page as a DRAW. */
check('a shootout win is a win', cc25_wdl(2, 2, array(4, 3)) === 'w');
check('a shootout loss is a loss', cc25_wdl(2, 2, array(3, 4)) === 'l');
check('a level score with no shootout is a draw', cc25_wdl(2, 2, null) === 'd');
check('a shootout never overturns a real win', cc25_wdl(3, 0, array(0, 5)) === 'w');
check('nor a real defeat', cc25_wdl(0, 3, array(5, 0)) === 'l');
check('the Vets tie now reads as a win', cc25_wdl(intval($pen['cc']), intval($pen['oc']), cc25_match_pens($pen)) === 'w');

/* The badge has to say how it was won, or a WIN beside a 2-2 reads as a typo. */
check('the long label names the shootout', cc25_wdl_label('w', true) === 'WIN (PENS)');
check('the long label is plain without one', cc25_wdl_label('w', false) === 'WIN');
check('a draw still reads DRAW', cc25_wdl_label('d', false) === 'DRAW');
check('the short label marks penalties', cc25_wdl_label('w', true, true) === 'W<sup>P</sup>');
check('the short label is bare without them', cc25_wdl_label('l', false, true) === 'L');

/* A game that never went to penalties must not grow a shootout, and a lookup for
 * a game with no record must not borrow the newest one's. */
$nopen = cc25_find_match('2026-07-28', 'mens');
check('an ordinary win has no shootout', cc25_match_pens($nopen) === null);
check('and says nothing about penalties', cc25_pens_line($nopen) === '');
check('a date with no record finds nothing', cc25_find_match('2001-01-01', 'vets') === null);
check('a real date on the wrong team finds nothing', cc25_find_match('2026-08-16', 'mens') === null);
check('an empty match is handled', cc25_pens_line(array()) === '' && cc25_match_pens(array()) === null);
check('a 0-0 shootout is not a shootout', cc25_match_pens(array('pens' => array(0, 0))) === null);

// Slug round-trip, including the backwards-compatible bare date.
check('a bare date means the men', cc25_parse_match_slug('2026-07-28') === array('2026-07-28', 'mens'));
check('a team suffix is read', cc25_parse_match_slug('2026-08-07-reserves') === array('2026-08-07', 'reserves'));
check('the women are read too', cc25_parse_match_slug('2026-10-11-womens') === array('2026-10-11', 'womens'));
// Every side in the registry must survive the round trip. This used to name the
// Vets as its example of an unknown team, so the assertion went on passing for
// the wrong reason once they had games of their own: a Vets report would have
// been served the men's match instead of a 404.
foreach (array_keys(cc25_fx_teams()) as $cc25_tk) {
    check("$cc25_tk survives the slug round trip",
        cc25_parse_match_slug(cc25_match_slug('2026-08-16', $cc25_tk)) === array('2026-08-16', $cc25_tk));
}
check('a team outside the registry falls back to the men',
    cc25_parse_match_slug('2026-08-07-basketball') === array('2026-08-07', 'mens'));
check('junk gives no date', cc25_parse_match_slug('nonsense') === array('', 'mens'));
check('an empty value gives no date', cc25_parse_match_slug('') === array('', 'mens'));
check('a half-written date is rejected', cc25_parse_match_slug('2026-08') === array('', 'mens'));
foreach (array('mens' => '2026-08-07', 'reserves' => '2026-08-07-reserves', 'womens' => '2026-08-07-womens') as $t => $expect) {
    check("slug for $t round-trips", cc25_match_slug('2026-08-07', $t) === $expect
        && cc25_parse_match_slug($expect) === array('2026-08-07', $t));
}

// A game with nothing attached must render nothing at all.
$none = cc25_match_links('womens', '2026-09-27');
check('a game with no report offers none', $none['report'] === '' && $none['centre'] === '' && $none['programme'] === '');
check('empty links render no buttons', cc25_match_link_buttons($none) === '');
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
