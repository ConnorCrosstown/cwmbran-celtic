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

/* ------------------------------------------------------- the report as a file */

/**
 * The COMET match id out of an uploaded report PDF.
 *
 * The club already downloads this file after every game and its name carries the
 * id — match_108116564_20260821_230036.pdf — so uploading it is the shortest path
 * from "we played" to a report on the site.
 *
 * The file itself is only ever read, never stored: wp-content/uploads is public,
 * and the report is a full team sheet with every player's name and number on it.
 *
 * Deliberately does NOT read the text inside. COMET's PDFs use subsetted fonts
 * with ToUnicode maps, so pulling the referee out means a real text extractor —
 * see the note at the top of this file about the parser that was written and
 * thrown away. The officials stay a typed field.
 *
 * @param array|null $file one entry from $_FILES
 * @return array ['id' => string, 'error' => string]
 */
function cc25_comet_pdf_upload_id($file) {
    $none = array('id' => '', 'error' => '');
    if (!is_array($file)) return $none;

    $err = isset($file['error']) ? (int) $file['error'] : UPLOAD_ERR_NO_FILE;
    // Nobody chose a file. That is the normal case on almost every save.
    if ($err === UPLOAD_ERR_NO_FILE) return $none;
    if ($err !== UPLOAD_ERR_OK) {
        return array('id' => '', 'error' => 'The PDF did not finish uploading — try again.');
    }
    if ((int) ($file['size'] ?? 0) > 12 * 1024 * 1024) {
        return array('id' => '', 'error' => 'That file is far larger than a COMET report — nothing was read.');
    }
    // Check what it IS, not what it is called.
    $tmp = (string) ($file['tmp_name'] ?? '');
    $head = ($tmp !== '' && is_readable($tmp)) ? (string) file_get_contents($tmp, false, null, 0, 5) : '';
    if (strncmp($head, '%PDF-', 5) !== 0) {
        return array('id' => '', 'error' => 'That does not look like a PDF, so it was ignored.');
    }
    $id = cc25_comet_id_from_filename((string) ($file['name'] ?? ''));
    if ($id === '') {
        return array('id' => '', 'error' => 'No match id in that filename. Download the report from COMET again, '
                                          . 'or type the id in yourself.');
    }
    return array('id' => $id, 'error' => '');
}

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

/**
 * The match id out of whatever was pasted, or ''.
 *
 * Accepts the full filename, the filename without its "match_" prefix, or the
 * bare id. It must take the FIRST long run of digits and stop: a filename also
 * carries a date and a time, and stripping every non-digit welds all three into
 * one 23-digit number that COMET has never heard of.
 */
function cc25_comet_id_from_filename($name) {
    $name = (string) $name;
    if (preg_match('/match[_-](\d{6,})/i', $name, $m)) return $m[1];
    return preg_match('/(\d{6,})/', $name, $m) ? $m[1] : '';
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

    // A player whose profile COMET withholds arrives as the literal "N/A" with
    // hideProfile set — on the line-up AND on every event they are part of. It is
    // a redaction, not a missing player: Croesyceiliog's 15 on 15 Aug 2026 is
    // printed by name on the PDF and came on for Kenny Hurford on 77.
    //
    // The shirt number, not a blank, because the name is what the two lists are
    // joined on: an empty one puts "came on for" against nobody, and marks that
    // player Unused on the bench — a printed falsehood rather than a gap. Two
    // redactions in the same side would also collapse into one blank; the numbers
    // stay distinct.
    if (cc25_comet_person_hidden($p)) {
        $no = (int) ($p['shirtNumber'] ?? 0);
        return $no ? 'No. ' . $no : '';
    }

    // shortName is only spelled out for the club's own players — COMET abbreviates
    // everyone else to "MANSON M.", because we have no detail access to their
    // squads. Fall back to name when it does.
    //
    // COMET puts the initial on either side: "TATTERSHALL J." but also "M. EVANS".
    // Matching only the trailing form let the leading one through unexpanded, so a
    // Vets team sheet listed a man the club has played for years as "M. Evans" —
    // a name no squad list or stats table could ever join him to.
    $abbreviated = $short !== '' && preg_match('/(^|\s)\p{Lu}\.(\s|$)/u', $short);
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

/**
 * Whether COMET is withholding this person's identity.
 *
 * hideProfile is the flag, but it is trusted only alongside a placeholder name:
 * the events payload sets hideProfile on thin player references that carry no
 * name at all, and those are resolved from the line-up rather than redacted.
 */
function cc25_comet_person_hidden($p) {
    $names = array((string) ($p['shortName'] ?? ''), (string) ($p['name'] ?? ''));
    foreach ($names as $n) {
        $n = strtolower(trim($n));
        if ($n !== '' && $n !== 'n/a' && $n !== 'n.a.') return false;
    }
    return !empty($p['hideProfile']) && trim(implode('', $names)) !== '';
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
        // Not every event has a minute. A booking after the whistle arrives with
        // minute, minuteFull and displayMinute all null and matchPhase
        // AFTER_THE_MATCH; COMET's own report prints "AM" for it. Flooring that to
        // an integer would publish a caution in the opening seconds of the game.
        $min  = $e['minuteFull'] ?? $e['minute'] ?? null;
        $stop = (int) ($e['stoppageTime'] ?? 0);
        $phase = strtoupper((string) ($e['matchPhase']['fcdName'] ?? ''));
        if ($min === null || $min === '') {
            $label = $phase === 'AFTER_THE_MATCH' ? 'AM' : '';
        } else {
            $label = $stop > 0 ? ($min . '+' . $stop) : (string) (int) $min;
        }

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

    // A shootout is on the match, not in the events: the events list ends with a
    // bare "Penalty shootout" phase carrying no kicks, so a cup tie decided this
    // way reads as a plain draw unless these are read. 'pens' is [ours, theirs],
    // and absent when the game never went to penalties.
    $usRes   = $match[$us . 'TeamResult'] ?? array();
    $themRes = $match[$them . 'TeamResult'] ?? array();
    $pens = (isset($usRes['penalties']) || isset($themRes['penalties']))
          ? array((int) ($usRes['penalties'] ?? 0), (int) ($themRes['penalties'] ?? 0))
          : array();

    return array(
        'team'         => $team,
        'date'         => $ko ? $ko->format('Y-m-d') : '',
        'time'         => $ko ? $ko->format('H:i') : '',
        'opp'          => $weAreHome ? $awayName : $homeName,
        'home'         => $weAreHome,
        'cc'           => count($ev['goals'][$us]),
        'oc'           => count($ev['goals'][$them]),
        'pens'         => $pens,
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

/* ------------------------------------------------------- storing on a fixture */

/**
 * The report section of the fixture editor.
 *
 * Everything factual is imported. What's left is the three things COMET's API
 * doesn't carry — the match officials — plus the words, which are nobody's job
 * but the club's.
 */
// Without this the browser posts the file's NAME and no file: WordPress's editor
// form is not multipart until something says so.
add_action('post_edit_form_tag', function ($post) {
    if (defined('CC25_FX_CPT') && isset($post->post_type) && $post->post_type === CC25_FX_CPT) {
        echo ' enctype="multipart/form-data"';
    }
});

add_action('add_meta_boxes', function () {
    if (!defined('CC25_FX_CPT')) return;
    add_meta_box('cc25_fx_report', 'Match report', 'cc25_fx_report_metabox', CC25_FX_CPT, 'normal', 'default');
});

function cc25_fx_report_metabox($post) {
    wp_nonce_field('cc25_fx_report_save', 'cc25_fx_report_nonce');
    $g = function ($k) use ($post) { return get_post_meta($post->ID, '_cc25_fx_' . $k, true); };
    $raw = $g('comet_data');
    $data = $raw ? json_decode($raw, true) : null;
    ?>
    <p><label for="cc25fx_comet"><strong>COMET match id</strong></label><br>
      <input type="text" id="cc25fx_comet" name="cc25_fx_comet_id" value="<?php echo esc_attr($g('comet_id')); ?>" style="max-width:260px">
      <span style="color:#666;font-size:12px">&nbsp;It&rsquo;s in the filename of the report you download &mdash; <code>match_<strong>107656065</strong>_20260808.pdf</code>. Pasting the whole filename works too.</span>
    </p>
    <p style="background:#f6f7f7;border:1px solid #dcdcde;border-radius:4px;padding:12px 14px;margin:12px 0">
      <label for="cc25fx_pdf"><strong>&hellip;or just drop the COMET report in</strong></label><br>
      <input type="file" id="cc25fx_pdf" name="cc25_fx_comet_pdf" accept="application/pdf,.pdf"><br>
      <span style="color:#666;font-size:12px">The id is read from the filename and the match imported when you save &mdash;
      you don&rsquo;t need to fill anything in above. The file is read and discarded, never stored on the site.</span>
    </p>
    <p><label><input type="checkbox" name="cc25_fx_comet_go" value="1"> <strong>Fetch the line-ups, goals, cards and substitutions from COMET when I save</strong></label>
      <span style="color:#666;font-size:12px">&nbsp;(not needed if you uploaded the PDF)</span></p>
    <?php // Offered only after a refusal, so it can't be ticked out of habit.
    if (get_transient('cc25_comet_offer_' . $post->ID)): ?>
      <p style="background:#fcf9e8;border-left:4px solid #dba617;padding:10px 14px">
        <label><input type="checkbox" name="cc25_fx_comet_force" value="1">
        <strong>Import it anyway</strong> &mdash; this will overwrite this fixture&rsquo;s date, opponent, venue, competition and score with that match&rsquo;s.</label>
      </p>
    <?php endif; ?>

    <?php if (is_array($data)): ?>
      <div style="background:#f0f6fc;border-left:4px solid #2271b1;padding:10px 14px;margin:12px 0">
        <p style="margin:0 0 6px"><strong>Imported<?php echo $g('comet_at') ? ' ' . esc_html($g('comet_at')) : ''; ?>:</strong>
          <?php printf('%s %d&ndash;%d %s',
            esc_html($data['home'] ? 'Cwmbran Celtic' : $data['opp']), (int) $data['cc'], (int) $data['oc'],
            esc_html($data['home'] ? $data['opp'] : 'Cwmbran Celtic')); ?>
          &middot; <?php echo esc_html($data['date'] . ' ' . $data['time']); ?>
        </p>
        <p style="margin:0;color:#50575e;font-size:12px">
          <?php printf('%d + %d in our squad, %d + %d in theirs &middot; %d goal(s) &middot; %d card(s) &middot; %d substitution(s)',
            count($data['starters']), count($data['subs']), count($data['opp_starters']), count($data['opp_subs']),
            count($data['goals']) + count($data['opp_goals']),
            count($data['cards']) + count($data['opp_cards']),
            count($data['subs_made']) + count($data['opp_subs_made'])); ?>
          <?php if (!empty($data['att'])): ?>&middot; attendance <?php echo intval($data['att']); ?><?php endif; ?>
        </p>
      </div>
    <?php elseif ($g('comet_id')): ?>
      <p style="color:#b32d2e"><strong>Nothing imported yet.</strong> Tick the box above and save.</p>
    <?php endif; ?>

    <p><strong>Match officials</strong><br>
      <span style="color:#666;font-size:12px">COMET&rsquo;s data doesn&rsquo;t include these, so they&rsquo;re the one part of a report that has to be typed. They&rsquo;re on the front of the PDF.</span></p>
    <p style="display:flex;gap:14px;flex-wrap:wrap;max-width:820px">
      <label style="flex:1;min-width:220px">Referee<br><input type="text" name="cc25_fx_ref" value="<?php echo esc_attr($g('ref')); ?>" style="width:100%"></label>
      <label style="flex:1;min-width:220px">1st assistant<br><input type="text" name="cc25_fx_ar1" value="<?php echo esc_attr($g('ar1')); ?>" style="width:100%"></label>
      <label style="flex:1;min-width:220px">2nd assistant<br><input type="text" name="cc25_fx_ar2" value="<?php echo esc_attr($g('ar2')); ?>" style="width:100%"></label>
    </p>
    <p><label>Attendance <em>(leave blank to use COMET&rsquo;s)</em><br>
      <input type="number" min="0" name="cc25_fx_att" value="<?php echo esc_attr($g('att')); ?>" style="max-width:140px"></label></p>

    <p><label for="cc25fx_report"><strong>The report</strong></label><br>
      <span style="color:#666;font-size:12px">Everything above is the bare facts. This is the bit only someone who was there can write.</span></p>
    <?php if (is_array($data)): ?>
      <p style="background:#f6f7f7;border:1px solid #dcdcde;border-radius:4px;padding:10px 14px">
        <label><input type="checkbox" name="cc25_fx_report_draft" value="1">
          <strong>Draft it from the record when I save</strong></label>
        <span style="color:#666;font-size:12px">&nbsp;Writes the score, the goals, the changes and the officials into the box
        &mdash; a starting point, not a report. It cannot know how the game felt.</span><br>
        <label style="margin-left:24px;color:#666;font-size:12px"><input type="checkbox" name="cc25_fx_report_draft_over" value="1">
          Replace what is already there</label>
      </p>
    <?php endif; ?>
    <?php wp_editor($g('report'), 'cc25fx_report', array('textarea_name' => 'cc25_fx_report', 'textarea_rows' => 12, 'media_buttons' => false)); ?>
    <p><label>Words by<br><input type="text" name="cc25_fx_report_by" value="<?php echo esc_attr($g('report_by')); ?>" style="max-width:320px"></label></p>
    <p style="border-top:1px solid #dcdcde;padding-top:14px;margin-top:18px">
      <?php submit_button(get_post_status($post) === 'publish' ? 'Save match report' : 'Publish fixture', 'primary', 'cc25_fx_report_submit', false); ?>
      <span style="color:#666;font-size:12px;margin-left:10px">Same as Update at the top of the page &mdash; here so you don&rsquo;t have to scroll back for it.</span>
    </p>
    <?php
}

/**
 * Pull one match from COMET onto a fixture. Returns true if it landed.
 *
 * Lifted out of the save handler so that handler can carry on afterwards — a
 * draft of the words is written from whatever this leaves behind, and an early
 * return would have skipped it.
 */
function cc25_fx_import_comet($id, $cid, $force = false) {
    $team = get_post_meta($id, '_cc25_fx_team', true) ?: 'mens';
    $ours = 'Cwmbran Celtic' . ($team === 'reserves' ? ' Reserves' : ($team === 'womens' ? ' Women' : ''));
    $fetched = cc25_comet_fetch($cid);
    if (!$fetched) {
        set_transient('cc25_comet_notice_' . $id, 'COMET did not answer for id ' . $cid . '. Check the id and try again.', 60);
        return false;
    }
    $match = cc25_comet_to_match($fetched, $team, $ours);

    // Refuse a match that isn't this fixture.
    //
    // The import fills in the fixture's date, opponent, venue, competition and
    // score. Pointed at the wrong record it would quietly turn that record into a
    // duplicate of another game, and the only clue would be a fixture that had
    // changed its own identity. So the id has to agree with the fixture it is
    // being saved onto, unless someone says otherwise on purpose.
    $mismatch = cc25_comet_mismatch($id, $match);
    if ($mismatch && !$force) {
        set_transient('cc25_comet_notice_' . $id, 'Not imported — ' . $mismatch
            . ' Check the match id, or tick "import it anyway" if this fixture really is that game.', 120);
        set_transient('cc25_comet_offer_' . $id, 1, 120);
        return false;
    }

    update_post_meta($id, '_cc25_fx_comet_data', wp_json_encode($match));
    update_post_meta($id, '_cc25_fx_comet_at', date_i18n('j M Y, H:i'));
    // Fill the fixture's own fields from the official record, so the score and
    // kick-off on the site come from the same place as the report.
    if ($match['date'])  update_post_meta($id, '_cc25_fx_date', $match['date']);
    if ($match['time'])  update_post_meta($id, '_cc25_fx_time', $match['time']);
    if ($match['time'])  update_post_meta($id, '_cc25_fx_ko', $match['time']);
    if ($match['opp'])   update_post_meta($id, '_cc25_fx_opponent', $match['opp']);
    update_post_meta($id, '_cc25_fx_home', $match['home'] ? '1' : '0');
    if ($match['comp'])  update_post_meta($id, '_cc25_fx_comp', $match['comp']);
    update_post_meta($id, '_cc25_fx_us', (string) $match['cc']);
    update_post_meta($id, '_cc25_fx_them', (string) $match['oc']);
    update_post_meta($id, '_cc25_fx_status', 'played');
    set_transient('cc25_comet_notice_' . $id, sprintf(
        'Imported from COMET: %s %d–%d %s, %d in each line-up, %d goal(s).',
        $match['home'] ? 'Cwmbran Celtic' : $match['opp'], $match['cc'], $match['oc'],
        $match['home'] ? $match['opp'] : 'Cwmbran Celtic',
        count($match['starters']), count($match['goals']) + count($match['opp_goals'])
    ), 60);
    return true;
}

add_action('save_post_' . (defined('CC25_FX_CPT') ? CC25_FX_CPT : 'cc25_fixture'), function ($id) {
    if (!isset($_POST['cc25_fx_report_nonce']) || !wp_verify_nonce($_POST['cc25_fx_report_nonce'], 'cc25_fx_report_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;

    // Accept a bare id or the whole PDF filename.
    $raw = trim((string) wp_unslash($_POST['cc25_fx_comet_id'] ?? ''));
    $cid = cc25_comet_id_from_filename($raw);

    // A dropped report names its own match, so uploading it is the whole job.
    // The file is read for its name and its first five bytes and then let go —
    // it is never written into wp-content/uploads, which is public.
    $up = cc25_comet_pdf_upload_id(isset($_FILES['cc25_fx_comet_pdf']) ? $_FILES['cc25_fx_comet_pdf'] : null);
    if ($up['error'] !== '') set_transient('cc25_comet_notice_' . $id, $up['error'], 90);
    $from_pdf = $up['id'] !== '';
    if ($from_pdf) $cid = $up['id'];

    update_post_meta($id, '_cc25_fx_comet_id', $cid);

    foreach (array('ref', 'ar1', 'ar2', 'report_by') as $k) {
        update_post_meta($id, '_cc25_fx_' . $k, sanitize_text_field(wp_unslash($_POST['cc25_fx_' . $k] ?? '')));
    }
    $att = $_POST['cc25_fx_att'] ?? '';
    update_post_meta($id, '_cc25_fx_att', $att === '' ? '' : (string) max(0, (int) $att));
    update_post_meta($id, '_cc25_fx_report', wp_kses_post(wp_unslash($_POST['cc25_fx_report'] ?? '')));

    // Uploading the PDF is itself the instruction to import; the tickbox is for
    // someone typing an id.
    if (($from_pdf || !empty($_POST['cc25_fx_comet_go'])) && $cid !== '') {
        cc25_fx_import_comet($id, $cid, !empty($_POST['cc25_fx_comet_force']));
    }

    if (!empty($_POST['cc25_fx_report_draft'])) {
        cc25_fx_write_report_draft($id, !empty($_POST['cc25_fx_report_draft_over']));
    }
}, 20);

add_action('admin_notices', function () {
    $id = isset($_GET['post']) ? (int) $_GET['post'] : 0;
    if (!$id) return;
    $msg = get_transient('cc25_comet_notice_' . $id);
    if (!$msg) return;
    delete_transient('cc25_comet_notice_' . $id);
    $err = stripos($msg, 'did not answer') !== false;
    printf('<div class="notice notice-%s is-dismissible"><p>%s</p></div>', $err ? 'error' : 'success', esc_html($msg));
});

/**
 * Why the fetched match doesn't belong to this fixture, or '' if it does.
 *
 * Compares the two things that identify a game — when it was played and who
 * against. A blank fixture (one being filled in for the first time) matches
 * anything, because there is nothing yet to contradict.
 */
function cc25_comet_mismatch($post_id, $match) {
    $have_date = trim((string) get_post_meta($post_id, '_cc25_fx_date', true));
    $have_opp  = trim((string) get_post_meta($post_id, '_cc25_fx_opponent', true));
    $reasons = array();
    if ($have_date !== '' && !empty($match['date']) && $have_date !== $match['date']) {
        $reasons[] = sprintf('this fixture is dated %s but that match was played on %s.',
            date_i18n('j M Y', strtotime($have_date)), date_i18n('j M Y', strtotime($match['date'])));
    }
    if ($have_opp !== '' && !empty($match['opp'])
        && function_exists('cc25_norm_team')
        && cc25_norm_team($have_opp) !== cc25_norm_team($match['opp'])) {
        $reasons[] = sprintf('this fixture is against %s but that match was against %s.',
            $have_opp, $match['opp']);
    }
    return implode(' ', $reasons);
}

/* --------------------------------------------------------------- the reader */

/** Match reports held on fixture records, newest first. */
function cc25_comet_match_records() {
    if (!function_exists('get_posts') || !defined('CC25_FX_CPT')) return array();
    if (!function_exists('post_type_exists') || !post_type_exists(CC25_FX_CPT)) return array();
    $out = array();
    foreach (get_posts(array('post_type' => CC25_FX_CPT, 'post_status' => 'publish', 'numberposts' => -1,
                             'meta_key' => '_cc25_fx_comet_data', 'meta_compare' => 'EXISTS')) as $p) {
        $m = json_decode((string) get_post_meta($p->ID, '_cc25_fx_comet_data', true), true);
        if (!is_array($m) || empty($m['date'])) continue;
        // What a person supplied wins over what was imported: officials aren't in
        // COMET at all, and a hand-counted gate beats a blank one.
        foreach (array('ref', 'ar1', 'ar2', 'report', 'report_by') as $k) {
            $v = trim((string) get_post_meta($p->ID, '_cc25_fx_' . $k, true));
            if ($v !== '') $m[$k] = $v;
        }
        $att = trim((string) get_post_meta($p->ID, '_cc25_fx_att', true));
        if ($att !== '') $m['att'] = (int) $att;
        $out[] = $m;
    }
    usort($out, function ($a, $b) { return strcmp($b['date'], $a['date']); });
    return $out;
}
