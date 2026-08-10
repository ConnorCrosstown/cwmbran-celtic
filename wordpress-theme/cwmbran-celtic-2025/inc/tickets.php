<?php
/**
 * Per-match ticket links.
 *
 * Every "Buy Tickets" button on the site pointed at one address — the club's Gigantic
 * promoter page, which lists everything. So a fan looking at a specific game landed
 * on a list and had to find it again, and there was nowhere to put the link for an
 * individual match even when one existed.
 *
 * A link is stored against a fixture, keyed "team|YYYY-MM-DD", and every place that
 * offers tickets for a KNOWN match resolves through cc25_ticket_url(). The generic
 * buttons — the header, the footer, the nav, season tickets — deliberately still go
 * to the promoter page, because they are not about one game.
 *
 * Away games get nothing: we do not sell tickets for them.
 *
 * Falls back to the promoter page rather than hiding the button, so a game without
 * its own link is still buyable; cc25_health_checks() then says which games are
 * missing one, so the fallback does not quietly become permanent.
 */
if (!defined('ABSPATH')) exit;

/** Links the club has given us, keyed "team|YYYY-MM-DD". */
function cc25_ticket_links_static() {
    /* Lifted from the club's own Gigantic promoter page on 10 Aug 2026, matched to
     * fixtures by the EVENT TITLE rather than by date. Matching on date alone got one
     * wrong: 5 September is "Cwmbran Celtic v Goytre", a men's home league game the
     * website does not list at all, and a date-match had assigned it to the Reserves
     * fixture that shares the day.
     *
     * The time in a Gigantic slug is DOORS, one hour before kick-off — 2026-08-22-13-00
     * is a 2:00pm kick-off. It is consistent summer and winter, so a slug that looks an
     * hour early is not a mistake and needs no correcting.
     *
     * There are no Reserves listings: their 13 home games are not sold in advance.
     */
    $b = 'https://cwmbranceltic.gigantic.com/cwmbran-celtic-tickets/cwmbran-the-motazone-arena-celtic-park/';
    return array(
        /* ---- Men's First Team ---- */
        'mens|2026-08-22' => $b . '2026-08-22-13-00',   /* v Newport Corinthians */
        'mens|2026-08-29' => $b . '2026-08-29-13-30',   /* v Cardiff Corinthians */
        /* 5 September. The listing is TITLED "Cwmbran Celtic v Goytre", but the club's
         * updated fixture list of 10 Aug 2026 has that date as the Amateur Trophy R1 tie
         * against Penygraig United, with the Goytre league game still postponed. Same
         * date, same event — the Gigantic title is out of date and needs correcting on
         * their side. Filed against the game that is actually being played, so the site's
         * Buy Tickets works; keyed with the opponent because the postponed Goytre row
         * shares the date. */
        'mens|2026-09-05|penygraig united' => $b . '2026-09-05-13-30',
        'mens|2026-09-19' => $b . '2026-09-19-13-30',   /* v Newport Corinthians */
        'mens|2026-10-03' => $b . '2026-10-03-13-30',   /* v Caldicot Town */
        'mens|2026-10-17' => $b . '2026-10-17-13-30',   /* v Lliswerry */
        'mens|2026-11-06' => $b . '2026-11-06-18-30',   /* v Blaenavon Blues */
        'mens|2026-11-27' => $b . '2026-11-27-18-30',   /* v Tredegar Town */
        'mens|2026-12-11' => $b . '2026-12-11-18-30',   /* v Abergavenny Town */
        'mens|2027-01-08' => $b . '2027-01-08-18-30',   /* v Chepstow Town */
        'mens|2027-01-22' => $b . '2027-01-22-18-30',   /* v Abercarn United */
        'mens|2027-02-05' => $b . '2027-02-05-18-30',   /* v Brecon Corries */
        'mens|2027-02-19' => $b . '2027-02-19-18-30',   /* v Croesyceiliog */
        'mens|2027-03-05' => $b . '2027-03-05-18-30',   /* v Undy AFC */

        /* ---- Women's First Team ---- */
        'womens|2026-10-11' => $b . '2026-10-11-13-00',   /* v Pontypridd United */
        'womens|2026-11-01' => $b . '2026-11-01-13-00',   /* v Carmarthen Town */
        'womens|2026-12-06' => $b . '2026-12-06-13-00',   /* v Pure Swansea */
        'womens|2027-01-31' => $b . '2027-01-31-13-00',   /* v Llanrumney United */
        'womens|2027-02-07' => $b . '2027-02-07-13-00',   /* v Cascade YC */
        'womens|2027-03-14' => $b . '2027-03-14-13-00',   /* v Taffs Well */
        'womens|2027-04-04' => $b . '2027-04-04-13-00',   /* v Ponybont */
    );
}

/** The season ticket, which is a listing of its own rather than a match. */
function cc25_season_ticket_url() {
    return 'https://cwmbranceltic.gigantic.com/cwmbran-celtic-tickets/cwmbran-the-motazone-arena-celtic-park/2026-07-28-00-00';
}


/** Links entered against a fixture in wp-admin. Empty when there is no WordPress to
 *  ask, which is what the CLI tests are and what makes the fallback work. */
function cc25_ticket_links_from_posts() {
    if (!function_exists('cc25_fx_posts')) return array();
    $out = array();
    foreach (cc25_fx_posts() as $f) {
        $url = trim((string) ($f['tickets'] ?? ''));
        if ($url === '') continue;
        $out[$f['team'] . '|' . $f['date']] = $url;
    }
    return $out;
}

/** Everything, wp-admin winning over the hand-maintained list. */
function cc25_ticket_links() {
    return array_merge(cc25_ticket_links_static(), cc25_ticket_links_from_posts());
}

/**
 * The link for one match, or '' when tickets do not apply.
 *
 * @param string $team  mens|reserves|womens
 * @param string $ymd   Y-m-d
 * @param bool   $home  away games return '' — we sell none
 */
function cc25_ticket_url($team, $ymd, $home = true, $opponent = '') {
    if (!$home) return '';
    $exact = cc25_ticket_url_exact($team, $ymd, $opponent);
    if ($exact !== '') return $exact;
    /* No link for THIS game. Fall back to the promoter listing only for a team that
     * sells in advance at all — otherwise the Reserves, who sell none, would gain a
     * Buy Tickets button pointing at a listing their games are not in. They had no
     * button before this change and should still have none. */
    if (!cc25_team_sells_tickets($team)) return '';
    return function_exists('cc25_ext_url') ? cc25_ext_url('tickets') : '';
}

/** Does this team sell tickets in advance? Inferred from whether it has any listing
 *  at all, so there is no separate list to keep in step. */
function cc25_team_sells_tickets($team) {
    foreach (array_keys(cc25_ticket_links()) as $k) {
        if (strpos($k, $team . '|') === 0) return true;
    }
    return false;
}

/**
 * The link SET for this match, with no fallback. What the health check asks.
 *
 * A key may be "team|date" or "team|date|opponent", where the opponent segment must be
 * exactly cc25_norm_team()'s output — which lower-cases and drops suffixes but KEEPS
 * spaces, so it is "penygraig united", not "penygraigunited". A key that does not match
 * simply never fires, which is silent. The qualified form exists because
 * two home games can fall on one day — 5 September 2026 has both a Goytre league tie
 * and an Amateur Trophy round with no opponent drawn. Matching on the date alone would
 * have sold a Goytre ticket for the Trophy game.
 */
function cc25_ticket_url_exact($team, $ymd, $opponent = '') {
    $map = cc25_ticket_links();
    if ($opponent !== '' && function_exists('cc25_norm_team')) {
        $q = $team . '|' . $ymd . '|' . cc25_norm_team($opponent);
        if (isset($map[$q])) return trim((string) $map[$q]);
    }
    /* An unqualified key must not answer for a date that has a qualified one, or the
     * ambiguity it was added to remove comes straight back. */
    foreach (array_keys($map) as $k) {
        if (strpos($k, $team . '|' . $ymd . '|') === 0) return '';
    }
    $key = $team . '|' . $ymd;
    return isset($map[$key]) ? trim((string) $map[$key]) : '';
}

/**
 * The link for a fixture array — the shape the feed and the static rows both become.
 *
 * Saves every caller repeating the date-and-home extraction, and means one place
 * decides what "this fixture's tickets" resolves to.
 */
function cc25_fixture_ticket_url($fx, $team = 'mens') {
    if (!$fx) return '';
    $ms = intval($fx['date'] ?? 0);
    if (!$ms) return '';
    $ymd = date('Y-m-d', intval($ms / 1000));
    $home = function_exists('cc25_is_home') ? cc25_is_home($fx) : true;
    $t = $fx['team'] ?? $team;
    $opp = function_exists('cc25_opponent') ? (cc25_opponent($fx)['opponent'] ?? '') : '';
    return cc25_ticket_url($t, $ymd, $home, $opp);
}

/** Home games, still to come, with no link of their own. Drives the dashboard check
 *  and answers "which ones am I missing?" — the question that started this. */
function cc25_ticket_gaps() {
    if (!function_exists('cc25_static_fixtures')) return array();
    /* Only teams that sell in advance. The Reserves have thirteen home games and no
     * listings at all, so counting them as gaps would bury the real ones in noise. */
    $selling = array();
    foreach (array_keys(cc25_ticket_links()) as $k) {
        $selling[explode('|', $k)[0]] = true;
    }
    $today = (new DateTime('now', new DateTimeZone('Europe/London')))->format('Y-m-d');
    $teams = function_exists('cc25_fx_teams') ? cc25_fx_teams() : array('mens' => "Men's First Team");
    $out = array();
    foreach (cc25_static_fixtures() as $team => $data) {
        if (!isset($selling[$team])) continue;
        foreach ($data['list'] as $r) {
            if (empty($r[1]) || $r[1] === 'TBC') continue;   // no opponent drawn yet
            if (empty($r[2])) continue;                      // away
            if ($r[0] < $today) continue;                    // played
            if (function_exists('cc25_fixture_hidden') && cc25_fixture_hidden($r[1], $r[0])) continue;
            if (cc25_ticket_url_exact($team, $r[0], $r[1]) !== '') continue;
            $out[] = array('team' => $team, 'label' => $teams[$team] ?? $team,
                           'date' => $r[0], 'opponent' => $r[1]);
        }
    }
    usort($out, function ($a, $b) { return strcmp($a['date'], $b['date']); });
    return $out;
}

/**
 * Ticket links for games the site is NOT showing.
 *
 * The opposite gap, and the more serious one. On 10 Aug 2026 Gigantic was selling
 * tickets for "Cwmbran Celtic v Goytre" on 5 September, while the site had that game
 * marked postponed — the Amateur Trophy QR2 tie was given the date, with its opponent
 * still undrawn. One of the two is wrong, and both readings cost something: either the
 * site is hiding a home game the club is selling for, or Gigantic is selling a game
 * that will not be played.
 *
 * Nothing here can tell which. It can only refuse to let the two disagree quietly.
 */
function cc25_ticket_conflicts() {
    if (!function_exists('cc25_static_fixtures') || !function_exists('cc25_fixture_hidden')) return array();
    $today = (new DateTime('now', new DateTimeZone('Europe/London')))->format('Y-m-d');
    $out = array();
    foreach (cc25_ticket_links() as $key => $url) {
        /* Keys are "team|date" or "team|date|opponent". Parsing only two parts read
         * "2026-09-05|goytre" as the date, matched no fixture, and the check went
         * silent — which is the one thing it must never do. */
        $parts = explode('|', $key);
        $team = $parts[0] ?? '';
        $ymd  = $parts[1] ?? '';
        $konly = $parts[2] ?? '';
        if ($ymd === '' || $ymd < $today) continue;
        $static = cc25_static_fixtures();
        if (!isset($static[$team]['list'])) continue;
        foreach ($static[$team]['list'] as $r) {
            if (($r[0] ?? '') !== $ymd || empty($r[2])) continue;   // that date, home only
            $opp = $r[1] ?? '';
            if ($opp === '' || $opp === 'TBC') continue;
            /* A key naming an opponent only concerns that opponent's game. */
            if ($konly !== '' && cc25_norm_team($opp) !== $konly) continue;
            if (!cc25_fixture_hidden($opp, $ymd)) continue;         // showing: no conflict
            $out[] = array('team' => $team, 'date' => $ymd, 'opponent' => $opp, 'url' => $url);
        }
    }
    return $out;
}
