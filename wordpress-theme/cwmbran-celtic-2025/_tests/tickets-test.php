<?php
/**
 * Assertions over per-match ticket links. Run from the theme root:
 *   php _tests/tickets-test.php
 *
 * Two things matter here and neither fails loudly. A wrong link sends a fan to the
 * wrong game's checkout, and a missing one silently falls back to the full listing —
 * which looks fine and quietly undoes the whole point of this.
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

$links = cc25_ticket_links();
check('there are ticket links', count($links) > 0);

/* -- Shape of the map -------------------------------------------------------- */

$badkey = $badurl = array();
foreach ($links as $k => $u) {
    // team|date, optionally |opponent for a day carrying two home games.
    if (!preg_match('/^(mens|reserves|womens)\|\d{4}-\d{2}-\d{2}(\|[a-z0-9 -]+)?$/', $k)) $badkey[] = $k;
    if (strpos($u, 'https://') !== 0) $badurl[] = $k;
}
check('every key is team|YYYY-MM-DD', $badkey === array());
check('every link is https', $badurl === array());
check('no duplicate URLs', count($links) === count(array_unique(array_values($links))));

/* -- The link Connor supplied, exactly as given ------------------------------ */

check('the 22 August Welsh Cup link is the one supplied',
      cc25_ticket_url_exact('mens', '2026-08-22') ===
      'https://cwmbranceltic.gigantic.com/cwmbran-celtic-tickets/cwmbran-the-motazone-arena-celtic-park/2026-08-22-13-00');

/* -- Resolution -------------------------------------------------------------- */

check('a home game with a link resolves to that link',
      cc25_ticket_url('mens', '2026-08-22', true) === cc25_ticket_url_exact('mens', '2026-08-22'));

/* An AWAY game must yield nothing at all. We sell no away tickets, and a button
 * there would send someone to the wrong club's gate. */
check('an away game yields no link', cc25_ticket_url('mens', '2026-08-22', false) === '');
check('...even for a date with no fixture', cc25_ticket_url('mens', '1999-01-01', false) === '');

/* A men's home game with no link of its own falls back, so the button is never dead.
 * 24 October is a cup round whose opponent has not been drawn, so no listing exists. */
check("a men's home game with no link falls back to the promoter page",
      cc25_ticket_url('mens', '2026-10-24', true, 'TBC') === cc25_ext_url('tickets'));

/* -- Two home games on one day ----------------------------------------------- */

/* 5 September carries two home games: the Amateur Trophy R1 tie against Penygraig
 * United that is being played, and the Goytre league game that is still postponed.
 * Keyed on the date alone, whichever came first would answer for both. */
check('the game being played resolves to the listing',
      strpos(cc25_ticket_url('mens', '2026-09-05', true, 'Penygraig United'), '2026-09-05-13-30') !== false);
check('...and the postponed game that day does NOT inherit it',
      strpos(cc25_ticket_url('mens', '2026-09-05', true, 'Goytre'), '2026-09-05-13-30') === false);
/* Asking without naming an opponent must refuse rather than guess. */
check('an unnamed opponent on a shared date resolves to nothing exact',
      cc25_ticket_url_exact('mens', '2026-09-05') === '');

/* An opponent key must be cc25_norm_team()'s exact output. It keeps spaces, so
 * "penygraigunited" silently matches nothing — which is how this first went wrong. */
$qual = array();
foreach (array_keys($links) as $k) {
    $p = explode('|', $k);
    if (count($p) === 3) $qual[] = $p[2];
}
$badnorm = array_filter($qual, function ($o) { return cc25_norm_team($o) !== $o; });
check('every opponent-qualified key is already normalised', $badnorm === array());
check('there is at least one multi-word opponent key to prove it', (bool) array_filter($qual, function ($o) { return strpos($o, ' ') !== false; }));

/* The Reserves sell nothing in advance, so they get NOTHING — not the promoter page.
 * Falling back for them put a Buy Tickets button on all thirteen of their home games
 * pointing at a listing their games are not in, where before there was no button. */
check('the Reserves get no ticket link at all', cc25_ticket_url('reserves', '2026-08-22', true) === '');
check('...and are not treated as selling in advance', !cc25_team_sells_tickets('reserves'));
check("the men's team does sell in advance", cc25_team_sells_tickets('mens'));
check("the women's team does too", cc25_team_sells_tickets('womens'));
check('the exact lookup still reports the Reserves game as having none',
      cc25_ticket_url_exact('reserves', '2026-08-22') === '');

/* -- Fixture-array resolution (what the templates actually call) -------------- */

$ms = (new DateTime('2026-08-22 12:00:00', new DateTimeZone('UTC')))->getTimestamp() * 1000;
$home_fx = array('date' => $ms, 'homeAway' => 'H', 'homeTeam' => 'Cwmbran Celtic',
                 'awayTeam' => 'Newport Corinthians', 'team' => 'mens');
$away_fx = array('date' => $ms, 'homeAway' => 'A', 'homeTeam' => 'Newport Corinthians',
                 'awayTeam' => 'Cwmbran Celtic', 'team' => 'mens');
check('a home fixture array resolves to its own link',
      cc25_fixture_ticket_url($home_fx) === cc25_ticket_url_exact('mens', '2026-08-22'));
check('an away fixture array resolves to nothing', cc25_fixture_ticket_url($away_fx) === '');
check('a fixture with no date resolves to nothing', cc25_fixture_ticket_url(array()) === '');
check('null resolves to nothing', cc25_fixture_ticket_url(null) === '');
/* The team travels on the fixture, so a women's game must not pick up a men's link
 * that happens to share the date. */
$w = $home_fx; $w['team'] = 'womens';
check("a women's fixture does not inherit the men's link for that date",
      cc25_fixture_ticket_url($w) !== cc25_ticket_url_exact('mens', '2026-08-22'));

/* -- Links point at the game they claim -------------------------------------- */

/* The Gigantic slug carries the date, so a link filed under the wrong date is
 * detectable — and that is exactly the mistake date-matching made when these were
 * lifted from the promoter page. */
$wrongdate = array();
foreach ($links as $k => $u) {
    $ymd = explode('|', $k)[1];
    if (strpos($u, '/' . $ymd . '-') === false) $wrongdate[] = $k;
}
check('every link URL contains the date it is filed under', $wrongdate === array());

/* Nothing should be on sale for a postponed game now: the club's updated list moved
 * 5 September to Penygraig United, and the link was re-filed against it. */
check('no tickets are on sale for a postponed game', cc25_ticket_conflicts() === array());

/* But silence must mean "nothing wrong", not "the check is broken" — it went quiet once
 * already, when an opponent-qualified key made it read the opponent as part of the date.
 * So prove it still detects one, by asking about a game we know is postponed. */
check('the postponed Goytre game is still hidden', cc25_fixture_hidden('Goytre', '2026-09-05'));
check('...so a link filed against it WOULD be reported',
      cc25_ticket_url_exact('mens', '2026-09-05', 'Goytre') === ''
      && cc25_ticket_url_exact('mens', '2026-09-05', 'Penygraig United') !== '');

/* -- Every home game that sells tickets has one ------------------------------ */

$gaps = cc25_ticket_gaps();
check('no upcoming home game is missing its ticket link', $gaps === array());
if ($gaps) {
    foreach ($gaps as $g) echo "        missing: {$g['date']} {$g['team']} v {$g['opponent']}\n";
}

/* The Reserves sell nothing in advance, so they must not be reported as gaps —
 * thirteen false alarms would bury a real one. */
$res = array_filter($gaps, function ($g) { return $g['team'] === 'reserves'; });
check('the Reserves are not reported as missing links', $res === array());

/* -- The season ticket is its own listing ------------------------------------ */

check('the season ticket has its own URL', strpos(cc25_season_ticket_url(), 'https://') === 0);
check('...and it is not a match link', !in_array(cc25_season_ticket_url(), array_values($links), true));

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
