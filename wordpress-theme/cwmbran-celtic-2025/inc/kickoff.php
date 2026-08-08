<?php
/**
 * Kick-off times. A confirmed time from the FAW beats the usual time for that day
 * of the week, and being an hour out looks just as certain as being right — which is
 * why this has its own test suite. Moved out of functions.php unchanged.
 */
if (!defined('ABSPATH')) exit;


/* -------------------------------------------------------------------------
 * Kick-off times. allwalessport does NOT publish kick-off times, so feed dates
 * default to midday — which made the countdown wrong. Resolve a real kick-off:
 * a per-date override the club has set, else a sensible default by day of week.
 * All times are UK local (Europe/London).
 *
 * >>> To set a kick-off, add a line to the map below:
 *       'YYYY-MM-DD'            => 'HH:MM'   every game that day
 *       'YYYY-MM-DD|Opponent'   => 'HH:MM'   just that one game
 *     Use the opponent form when two sides play on the same date at different
 *     times — a bare date key would drag the other game's time with it.
 * ---------------------------------------------------------------------- */
function cc25_kickoff_overrides() {
    // Admin-entered times win; the hardcoded map still covers unmigrated teams.
    $base = cc25_kickoff_overrides_static();
    if (function_exists('cc25_fx_kickoffs_from_posts')) {
        $base = array_merge($base, cc25_fx_kickoffs_from_posts());
    }
    return $base;
}

/** The hand-maintained map, kept as the fallback described above. */
function cc25_kickoff_overrides_static() {
    // Harvested from faw.cymru on 7 August 2026 — the FAW's own published times
    // for every Ardal Southern League East (men) and Adran South (women) game
    // this season. These are real kick-offs, not the day-of-week guess below:
    // winter Saturdays in particular run at 2:00pm, not the 2:30pm default.
    //
    // NOT covered: the Reserves. The Gwent Premier Combination is a county
    // league outside the FAW's system, so all 27 of their games still fall back
    // to the default. Cup ties aren't here either — they're drawn later.
    //
    // Keyed by opponent as the SITE spells it (cc25_norm_team decides the match),
    // which is not always how faw.cymru spells it.
    //
    // UNRESOLVED — Taffs Well away (women). faw.cymru has it Thu 17 Dec 2026 at
    // 2:00pm; our list has Sun 17 Jan 2027. Every other Adran South game all
    // season is a Sunday, so the FAW record looks like a data-entry slip and we
    // have kept our date. Confirm with the league before trusting either.
    return array(
        '2026-07-28|Cwmbran Town'         => '19:00',  // M Tue
        '2026-08-01|Tredegar Town'        => '14:30',  // M Sat POSTPONED
        '2026-08-07|New Inn'              => '18:30',  // M Fri — confirmed, COMET
        '2026-08-07|Rogerstone'           => '19:30',  // Res Fri — confirmed, COMET  // M Fri
        '2026-08-14|Abergavenny Town'     => '19:45',  // M Fri
        '2026-08-22|Newport Corinthians'  => '14:00',  // M Sat Welsh Cup QR2 — confirmed by the club
        '2026-08-22|Risca United'         => '14:30',  // M Sat POSTPONED
        '2026-09-05|Goytre'               => '14:30',  // M Sat POSTPONED
        '2026-09-12|Chepstow Town'        => '14:30',  // M Sat
        '2026-09-19|Newport Corinthians'  => '14:30',  // M Sat
        '2026-09-26|Abercarn United'      => '14:30',  // M Sat
        '2026-09-27|Llanrumney United'    => '14:00',  // W Sun
        '2026-10-03|Caldicot Town'        => '14:30',  // M Sat
        '2026-10-10|Brecon Corries'       => '14:30',  // M Sat
        '2026-10-11|Pontypridd United'    => '14:00',  // W Sun
        '2026-10-17|Lliswerry'            => '14:30',  // M Sat
        '2026-10-31|Croesyceiliog'        => '14:30',  // M Sat
        '2026-11-01|Carmarthen Town'      => '14:00',  // W Sun
        '2026-11-06|Blaenavon Blues'      => '19:30',  // M Fri
        '2026-11-14|Undy FC'              => '14:00',  // M Sat
        '2026-11-21|Cwmbran Town'         => '14:00',  // M Sat
        '2026-11-22|Cascade YC'           => '14:00',  // W Sun
        '2026-11-27|Tredegar Town'        => '19:30',  // M Fri
        '2026-11-29|Penybont'             => '14:00',  // W Sun
        '2026-12-04|New Inn'              => '19:30',  // M Fri
        '2026-12-06|Pure Swansea'         => '14:00',  // W Sun
        '2026-12-11|Abergavenny Town'     => '19:30',  // M Fri
        '2026-12-19|Risca United'         => '14:00',  // M Sat
        '2027-01-02|Goytre'               => '14:00',  // M Sat
        '2027-01-08|Chepstow Town'        => '19:30',  // M Fri
        '2027-01-16|Newport Corinthians'  => '14:00',  // M Sat
        '2027-01-22|Abercarn United'      => '19:30',  // M Fri
        '2027-01-30|Caldicot Town'        => '14:00',  // M Sat
        '2027-01-31|Llanrumney United'    => '14:00',  // W Sun
        '2027-02-05|Brecon Corries'       => '19:30',  // M Fri
        '2027-02-07|Cascade YC'           => '14:00',  // W Sun
        '2027-02-13|Lliswerry'            => '14:30',  // M Sat
        '2027-02-14|Carmarthen Town'      => '14:00',  // W Sun
        '2027-02-19|Croesyceiliog'        => '19:30',  // M Fri
        '2027-02-21|Pontypridd United'    => '14:00',  // W Sun
        '2027-02-27|Blaenavon Blues'      => '14:00',  // M Sat
        '2027-03-05|Undy FC'              => '19:30',  // M Fri
        '2027-03-14|Taffs Well'           => '14:00',  // W Sun
        '2027-03-21|Pure Swansea'         => '14:00',  // W Sun
        '2027-04-04|Penybont'             => '14:00',  // W Sun
    );
}
/** Default kick-off by ISO day-of-week (1=Mon .. 7=Sun). */
function cc25_kickoff_default($dow) {
    if ($dow == 6) return '14:30';  // Saturday
    if ($dow == 7) return '14:00';  // Sunday
    return '19:30';                 // midweek
}
/** Kick-off 'HH:MM' for a date + opponent: the game-specific override wins over
 * the whole-day one, which wins over the day-of-week default. */
function cc25_kickoff_time($ymd, $opponent, $dow, $ov = null) {
    $ov = $ov === null ? cc25_kickoff_overrides() : $ov;
    $opp = cc25_norm_team((string) $opponent);
    if ($opp !== '') {
        foreach ($ov as $key => $time) {
            $parts = explode('|', $key, 2);
            if (count($parts) === 2 && $parts[0] === $ymd && cc25_norm_team($parts[1]) === $opp) return $time;
        }
    }
    return isset($ov[$ymd]) ? $ov[$ymd] : cc25_kickoff_default($dow);
}
/** Resolved kick-off timestamp (ms) — keeps the match date, sets the real time. */
function cc25_kickoff_ms($f) {
    $ms = intval(is_array($f) ? ($f['date'] ?? 0) : 0);
    if (!$ms) return 0;
    $tz = function_exists('wp_timezone') ? wp_timezone() : new DateTimeZone('Europe/London');
    $day = (new DateTime('@' . intval($ms / 1000)))->setTimezone($tz);
    $ymd = $day->format('Y-m-d');
    $opp = cc25_opponent($f);
    $ko = cc25_kickoff_time($ymd, $opp['opponent'], (int) $day->format('N'));
    $dt = DateTime::createFromFormat('Y-m-d H:i', $ymd . ' ' . $ko, $tz);
    return $dt ? $dt->getTimestamp() * 1000 : $ms;
}
/** Kick-off label in UK time, e.g. "7:00pm". */
function cc25_kickoff_label($f) {
    $ms = cc25_kickoff_ms($f);
    if (!$ms) return 'TBC';
    $tz = function_exists('wp_timezone') ? wp_timezone() : new DateTimeZone('Europe/London');
    return (new DateTime('@' . intval($ms / 1000)))->setTimezone($tz)->format('g:ia');
}

function cc25_latest_result($feed, $team = 'mens') {
    $rs = cc25_team_items($feed['results'] ?? array(), $team);
    if (!$rs) return null;
    usort($rs, function ($a, $b) { return ($b['date'] ?? 0) <=> ($a['date'] ?? 0); });
    return $rs[0];
}

function cc25_table($feed, $team = 'mens') {
    return (isset($feed['tables'][$team]) && is_array($feed['tables'][$team])) ? $feed['tables'][$team] : array();
}

/** Opponent + home/away view of a fixture, from Cwmbran's perspective. */
/** True if Cwmbran are at home. Fixtures carry an explicit 'homeAway'; feed
 * RESULTS do not, so fall back to the team names (otherwise every away result
 * mis-renders as a home game). */
function cc25_is_home($f) {
    if (isset($f['homeAway']) && $f['homeAway'] !== '') return $f['homeAway'] === 'H';
    return strpos((string) ($f['homeTeam'] ?? ''), 'Cwmbran Celtic') !== false;
}
function cc25_opponent($f) {
    $home = cc25_is_home($f);
    return array(
        'opponent' => $home ? ($f['awayTeam'] ?? '') : ($f['homeTeam'] ?? ''),
        'home'     => $home,
    );
}

function cc25_date($ms, $fmt = 'D j M') {
    return date_i18n($fmt, (int) round(((int) $ms) / 1000));
}
