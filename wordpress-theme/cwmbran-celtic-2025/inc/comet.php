<?php
/**
 * Building a match report from the FAW's own data.
 *
 * The club downloads the official COMET report after every game. Transcribing it
 * by hand is half an hour a week and the source of every wrong squad number, so
 * this reads it instead.
 *
 * It reads the API, not the PDF. A PDF-text parser was written first and thrown
 * away: pdftotext interleaves the two team columns so a scorer's name lands on a
 * different line from their minute, and a paste from a different viewer would
 * differ again. The API returns the same match as structured JSON — line-ups with
 * shirt numbers and captains, goals with assists, cards, substitutions with who
 * came on and off — so there is nothing to guess at.
 *
 * The match id is in the filename of the PDF the club already downloads:
 * match_107656065_20260808_140918.pdf.
 *
 * Transform and fetch are kept apart so the whole mapping is testable against
 * saved payloads without touching the network.
 */
if (!defined('ABSPATH')) exit;

const CC25_COMET_BASE = 'https://api-faw.analyticom.de/api/live';
// Published in faw.cymru's own front-end JavaScript; these are the endpoints its
// public match pages read.
const CC25_COMET_KEY = 'ME8w7FdYVJQQJZJp7QwaDy8MRdrspAVqDcrxBeJ3';

/* ------------------------------------------------------------------- fetching */

/** One COMET endpoint as an array, or null. Cached for a day — a played match
 *  does not change. */
function cc25_comet_get($path, $ttl = 86400) {
    if (!function_exists('wp_remote_get')) return null;
    $key = 'cc25_comet_' . md5($path);
    $hit = function_exists('get_transient') ? get_transient($key) : false;
    if (is_array($hit)) return $hit;
    $res = wp_remote_get(CC25_COMET_BASE . '/' . ltrim($path, '/'), array(
        'timeout' => 20,
        'headers' => array(
            'API_KEY' => CC25_COMET_KEY,
            // Cloudflare fronts this and refuses a bare server user-agent.
            'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        ),
    ));
    if (is_wp_error($res) || (int) wp_remote_retrieve_response_code($res) !== 200) return null;
    $data = json_decode(wp_remote_retrieve_body($res), true);
    if (!is_array($data)) return null;
    if (function_exists('set_transient')) set_transient($key, $data, $ttl);
    return $data;
}

/** Everything COMET holds for one match id. */
function cc25_comet_fetch($id) {
    $id = preg_replace('/\D/', '', (string) $id);
    if ($id === '') return null;
    $match = cc25_comet_get("match/$id");
    if (!$match) return null;
    return array(
        'match'   => $match,
        'lineups' => cc25_comet_get("match/$id/lineups") ?: array(),
        'events'  => cc25_comet_get("match/$id/events") ?: array(),
    );
}

/** The match id out of a COMET PDF filename, or '' — saves reading it off by eye. */
function cc25_comet_id_from_filename($name) {
    return preg_match('/match[_-](\d{6,})/i', (string) $name, $m) ? $m[1] : '';
}

/* --------------------------------------------------------------- transforming */

/**
 * "GRIFFITHS Rudi" / "RUDI GRIFFITHS" -> "Rudi Griffiths".
 *
 * shortName is the one to use: COMET's full name field carries every middle name
 * a player is registered with ("DONOVAN Charlie Jason Michael"), and the site
 * calls him Charlie Donovan.
 */
function cc25_comet_person_name($p) {
    $short = trim(preg_replace('/\s+/', ' ', (string) ($p['shortName'] ?? '')));
    $full  = trim(preg_replace('/\s+/', ' ', (string) ($p['name'] ?? '')));

    // shortName is only spelled out for the club's own players — COMET abbreviates
    // everyone else to "MANSON M.", because we have no detail access to their
    // squads. Fall back to name when it does.
    $abbreviated = $short !== '' && preg_match('/(^|\s)\p{Lu}\.$/u', $short);
    $source = ($short !== '' && !$abbreviated) ? $short : $full;
    if ($source === '') return '';

    // COMET's convention in `name` is SURNAME first in capitals, forenames after
    // in title case — and a surname can be two words: "PRESTON WATKINS Kobi".
    // So the capitals identify the surname rather than the word order.
    if ($source === $full && $short !== $full) {
        $caps = $rest = array();
        foreach (explode(' ', $source) as $w) {
            if ($w !== '' && $w === mb_strtoupper($w, 'UTF-8') && preg_match('/\p{L}/u', $w)) $caps[] = $w;
            else $rest[] = $w;
        }
        // Only reorder when the split is unambiguous; otherwise leave it be.
        if ($caps && $rest) $source = implode(' ', array_merge($rest, $caps));
    }

    // Title-case any word COMET has shouted, leaving mixed-case words alone —
    // this catches both "LEWIS WATKINS" and the "Louis COCHRANE" half-and-half.
    $out = array();
    foreach (explode(' ', $source) as $w) {
        if ($w !== '' && $w === mb_strtoupper($w, 'UTF-8')) {
            $w = mb_strtolower($w, 'UTF-8');
            // Capitalise after an apostrophe or hyphen too: O'Donnell, Preston-Watkins.
            $w = preg_replace_callback('/(^|[\'’\-])(\p{L})/u', function ($m) {
                return $m[1] . mb_strtoupper($m[2], 'UTF-8');
            }, $w);
        }
        $out[] = $w;
    }
    return trim(implode(' ', $out));
}

/** roleId => 'home'|'away', so an event can be attributed to a team. Events carry
 *  no team of their own; only the line-ups know who plays for whom. */
function cc25_comet_side_map($lineups) {
    $map = array();
    foreach (array('home', 'away') as $side) {
        foreach ($lineups[$side]['players'] ?? array() as $p) {
            if (!empty($p['roleId'])) $map[(int) $p['roleId']] = $side;
        }
    }
    return $map;
}

/** [shirt, name] pairs for one side, starters or subs, in COMET's order. */
function cc25_comet_players($lineups, $side, $starting) {
    $out = array();
    foreach ($lineups[$side]['players'] ?? array() as $p) {
        if ((bool) ($p['starting'] ?? false) !== $starting) continue;
        $row = array((int) ($p['shirtNumber'] ?? 0), cc25_comet_person_name($p));
        // Only the goalkeeper's position is worth carrying; the rest is formation
        // detail the report doesn't show.
        if (($p['position'] ?? '') === 'G') $row[] = 'GK';
        $out[] = $row;
    }
    return $out;
}

/** The captain's name for one side, or ''. */
function cc25_comet_captain($lineups, $side) {
    foreach ($lineups[$side]['players'] ?? array() as $p) {
        if (!empty($p['captain'])) return cc25_comet_person_name($p);
    }
    return '';
}

/** Staff for one side as [role, name] pairs. */
function cc25_comet_staff($lineups, $side) {
    $out = array();
    foreach ($lineups[$side]['officials'] ?? array() as $o) {
        $name = cc25_comet_person_name($o);
        $role = trim((string) ($o['role'] ?? ''));
        if ($name === '' || $role === '') continue;
        $out[] = array('role' => $role, 'name' => $name);
    }
    return $out;
}

/**
 * Match officials from the match payload — referee and assistants.
 *
 * COMET's public API does NOT carry them: there is no referee anywhere in the
 * match or line-up payloads. They appear only in the PDF. So this returns empty
 * in practice and the three names are typed on the fixture instead, which is the
 * only part of a report the import cannot supply.
 */
function cc25_comet_officials($match) {
    $out = array('ref' => '', 'ar1' => '', 'ar2' => '');
    foreach ($match['officials'] ?? array() as $o) {
        $name = cc25_comet_person_name($o);
        $role = strtolower((string) ($o['role'] ?? $o['officialRole']['name'] ?? ''));
        if ($name === '') continue;
        if (strpos($role, 'referee') !== false && strpos($role, 'assistant') === false) $out['ref'] = $name;
        elseif (strpos($role, '1st assistant') !== false) $out['ar1'] = $name;
        elseif (strpos($role, '2nd assistant') !== false) $out['ar2'] = $name;
    }
    return $out;
}

/**
 * Goals, cards and substitutions, split by side.
 *
 * minuteFull, not minute: minute counts from the start of the half, so a
 * 46th-minute substitution arrives as minute 1 of the second half.
 */
function cc25_comet_events($events, $sides) {
    $out = array('goals' => array('home' => array(), 'away' => array()),
                 'cards' => array('home' => array(), 'away' => array()),
                 'subs'  => array('home' => array(), 'away' => array()));
    foreach ($events as $e) {
        $type = strtoupper((string) ($e['eventType']['fcdName'] ?? ''));
        $p1   = $e['player'] ?? array();
        $p2   = $e['player2'] ?? array();
        $side = $sides[(int) ($p1['roleId'] ?? 0)] ?? null;
        if (!$side) continue;
        $min = $e['minuteFull'] ?? $e['minute'] ?? 0;
        $stop = (int) ($e['stoppageTime'] ?? 0);
        $label = $stop > 0 ? ($min . '+' . $stop) : (string) (int) $min;

        if ($type === 'GOAL' || $type === 'PENALTY_GOAL') {
            $out['goals'][$side][] = array(
                'min'    => $label,
                'scorer' => cc25_comet_person_name($p1),
                'assist' => cc25_comet_person_name($p2),
                'pen'    => $type === 'PENALTY_GOAL',
            );
        } elseif ($type === 'YELLOW' || $type === 'RED' || $type === 'SECOND_YELLOW') {
            $out['cards'][$side][] = array(
                'min'    => $label,
                'player' => cc25_comet_person_name($p1),
                'type'   => $type === 'YELLOW' ? 'y' : 'r',
                'reason' => trim((string) ($e['reason']['name'] ?? $e['reason'] ?? '')),
            );
        } elseif ($type === 'SUBSTITUTION') {
            // player is the one coming ON, player2 the one going off.
            $out['subs'][$side][] = array(
                'min' => $label,
                'off' => cc25_comet_person_name($p2),
                'on'  => cc25_comet_person_name($p1),
            );
        }
    }
    return $out;
}

/**
 * Turn a fetched COMET match into a cc25_season_matches() entry.
 *
 * @param array  $data  as returned by cc25_comet_fetch()
 * @param string $team  which of our sides played — mens/reserves/womens
 * @param string $ours  the club name as COMET spells it, to work out home/away
 */
function cc25_comet_to_match($data, $team = 'mens', $ours = 'Cwmbran Celtic') {
    $match   = $data['match'] ?? array();
    $lineups = $data['lineups'] ?? array();
    $events  = $data['events'] ?? array();

    $homeName = (string) ($match['homeTeam']['name'] ?? '');
    $awayName = (string) ($match['awayTeam']['name'] ?? '');
    $norm = function ($s) { return function_exists('cc25_norm_team') ? cc25_norm_team($s) : strtolower(trim($s)); };
    $weAreHome = $norm($homeName) === $norm($ours) || strpos($norm($homeName), $norm($ours)) === 0;

    $us   = $weAreHome ? 'home' : 'away';
    $them = $weAreHome ? 'away' : 'home';
    $ev   = cc25_comet_events($events, cc25_comet_side_map($lineups));
    $offs = cc25_comet_officials($match);

    $ts = (int) round(((int) ($match['dateTimeUTC'] ?? 0)) / 1000);
    $tz = function_exists('wp_timezone') ? wp_timezone() : new DateTimeZone('Europe/London');
    $ko = $ts ? (new DateTime('@' . $ts))->setTimezone($tz) : null;

    $facility = $match['facility'] ?? array();
    $venue = trim((string) ($facility['name'] ?? ''));
    if ($venue !== '' && !empty($facility['place'])) $venue .= ', ' . $facility['place'];

    return array(
        'team'         => $team,
        'date'         => $ko ? $ko->format('Y-m-d') : '',
        'time'         => $ko ? $ko->format('H:i') : '',
        'opp'          => $weAreHome ? $awayName : $homeName,
        'home'         => $weAreHome,
        'cc'           => count($ev['goals'][$us]),
        'oc'           => count($ev['goals'][$them]),
        'comp'         => (string) ($match['competition']['name'] ?? ''),
        'round'        => ($match['round'] ?? '') !== '' ? 'Round ' . $match['round'] : '',
        'venue'        => $venue,
        // COMET leaves attendance blank more often than not, and a printed 0 is
        // worse than nothing — the report only shows it when it is set.
        'att'          => (int) ($match['attendance'] ?? 0),
        'ref'          => $offs['ref'],
        'ar1'          => $offs['ar1'],
        'ar2'          => $offs['ar2'],
        'captain'      => cc25_comet_captain($lineups, $us),
        'opp_captain'  => cc25_comet_captain($lineups, $them),
        'starters'     => cc25_comet_players($lineups, $us, true),
        'subs'         => cc25_comet_players($lineups, $us, false),
        'opp_starters' => cc25_comet_players($lineups, $them, true),
        'opp_subs'     => cc25_comet_players($lineups, $them, false),
        'subs_made'    => $ev['subs'][$us],
        'opp_subs_made' => $ev['subs'][$them],
        'goals'        => $ev['goals'][$us],
        'opp_goals'    => $ev['goals'][$them],
        'cards'        => $ev['cards'][$us],
        'opp_cards'    => $ev['cards'][$them],
        'staff'        => cc25_comet_staff($lineups, $us),
        'opp_staff'    => cc25_comet_staff($lineups, $them),
        'report'       => '',
        'report_by'    => '',
    );
}
