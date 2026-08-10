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
    if (!preg_match('/^(mens|reserves|womens)\|\d{4}-\d{2}-\d{2}(\|[a-z0-9-]+)?$/', $k)) $badkey[] = $k;
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

/* 5 September carries a Goytre league tie AND an Amateur Trophy round with no opponent
 * drawn. Keyed on the date alone, the Trophy row was offered the Goytre ticket. */
check('the Goytre game resolves to its own link',
      strpos(cc25_ticket_url('mens', '2026-09-05', true, 'Goytre'), '2026-09-05-13-30') !== false);
check('...and the other game that day does NOT inherit it',
      strpos(cc25_ticket_url('mens', '2026-09-05', true, 'TBC'), '2026-09-05-13-30') === false);
check('...falling back instead',
      cc25_ticket_url('mens', '2026-09-05', true, 'TBC') === cc25_ext_url('tickets'));
/* Asking without naming an opponent must refuse rather than guess. */
check('an unnamed opponent on a shared date resolves to nothing exact',
      cc25_ticket_url_exact('mens', '2026-09-05') === '');

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

/* The conflict check must actually fire. It went silent once already, when a key with
 * an opponent segment made it read the opponent as part of the date. */
$conf = cc25_ticket_conflicts();
check('tickets on sale for a postponed game are reported', count($conf) === 1);
check('...and it is the Goytre game', $conf && $conf[0]['opponent'] === 'Goytre'
      && $conf[0]['date'] === '2026-09-05');

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
