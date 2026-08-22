<?php
/**
 * A first draft of a match report, from the official record alone.
 *
 * COMET gives facts and no words, so the prose has always been typed from
 * scratch while the same six sentences got written again every week. This writes
 * those six, into the editable box, for someone to keep, cut or ignore.
 *
 * The rule it works to: SAY ONLY WHAT THE RECORD HOLDS. No half-time score, no
 * crowd figure, no "deserved more" — a draft that reads plausibly is one nobody
 * checks, so an invented detail would go straight to the site with the club's
 * name on it. Everything below traces to a field of the imported match.
 */
if (!defined('ABSPATH')) exit;

/** Should a generated draft be written into this box? */
function cc25_report_draft_should_write($existing, $overwrite = false) {
    return $overwrite || trim(strip_tags((string) $existing)) === '';
}

/** "on 71", or "after the final whistle" for a card COMET timed that way. */
function cc25_draft_minute($min) {
    $min = trim((string) $min);
    if ($min === '' || $min === '0') return '';
    if (!preg_match('/^\d/', $min)) return 'after the final whistle';   // AM and friends
    return 'on ' . $min;
}

/** Small numbers as words, the way a report would write them. */
function cc25_draft_count($n) {
    $words = array(1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four', 5 => 'five',
                   6 => 'six', 7 => 'seven', 8 => 'eight', 9 => 'nine', 10 => 'ten');
    return $words[(int) $n] ?? (string) (int) $n;
}

/** Ordinals, for "a third defeat from three". */
function cc25_draft_ordinal($n) {
    $words = array(1 => 'first', 2 => 'second', 3 => 'third', 4 => 'fourth', 5 => 'fifth',
                   6 => 'sixth', 7 => 'seventh', 8 => 'eighth', 9 => 'ninth', 10 => 'tenth');
    $n = (int) $n;
    if (isset($words[$n])) return $words[$n];
    $suffix = ($n % 100 >= 11 && $n % 100 <= 13) ? 'th'
            : array(1 => 'st', 2 => 'nd', 3 => 'rd')[$n % 10] ?? 'th';
    return $n . $suffix;
}

/** "A", "A and B", "A, B and C" — a list the way it would be spoken. */
function cc25_draft_list($items) {
    $items = array_values(array_filter(array_map('trim', (array) $items), 'strlen'));
    if (!$items) return '';
    if (count($items) === 1) return $items[0];
    $last = array_pop($items);
    return implode(', ', $items) . ' and ' . $last;
}

/** Our goals and theirs, in the order they were scored. */
function cc25_draft_timeline($m) {
    $out = array();
    foreach (array('goals' => true, 'opp_goals' => false) as $k => $ours) {
        foreach ((array) ($m[$k] ?? array()) as $g) {
            $g['ours'] = $ours;
            $out[] = $g;
        }
    }
    usort($out, function ($a, $b) {
        return intval(preg_replace('/\D/', '', (string) ($a['min'] ?? 0)))
             <=> intval(preg_replace('/\D/', '', (string) ($b['min'] ?? 0)));
    });
    return $out;
}

/**
 * The draft, as plain paragraphs separated by blank lines.
 *
 * @param array $m      an entry from cc25_season_matches()
 * @param array $season the rest of that season, for context. Optional.
 */
function cc25_match_report_draft($m, $season = array()) {
    $us   = 'Celtic';
    $opp  = trim((string) ($m['opp'] ?? 'the visitors'));
    $cc   = (int) ($m['cc'] ?? 0);
    $oc   = (int) ($m['oc'] ?? 0);
    $home = !empty($m['home']);
    $venue = trim((string) ($m['venue'] ?? ''));
    $comp  = trim((string) ($m['comp'] ?? ''));
    // Venues are stored as "The Motazone Arena, Cwmbran" or "Rogerstone Fugitives
    // Stadium, Rogerstone" — drop the town, and don't hand "The Motazone" a second
    // definite article.
    $ground = trim(preg_replace('/,.*$/', '', $venue));
    $where = '';
    if ($ground !== '') {
        $has_the = stripos($ground, 'the ') === 0;
        $where = 'at ' . (($home && !$has_the) ? 'the ' : '') . $ground;
    }
    $paras = array();

    /* ---- what happened ---- */
    if ($cc > $oc)      $verb = sprintf('beat %s %d–%d', $opp, $cc, $oc);
    elseif ($cc < $oc)  $verb = sprintf('lost %d–%d to %s', $cc, $oc, $opp);
    else                $verb = sprintf('drew %d–%d with %s', $cc, $oc, $opp);
    $open = sprintf('Cwmbran Celtic %s%s%s.', $verb,
        $where !== '' ? ' ' . $where : '',
        $comp !== '' ? ' in the ' . $comp : '');
    $paras[] = $open;

    /* ---- the goals ---- */
    $tl = cc25_draft_timeline($m);
    if ($tl) {
        $bits = array();
        foreach ($tl as $g) {
            $who  = trim((string) ($g['scorer'] ?? ''));
            if ($who === '') continue;
            $when = cc25_draft_minute($g['min'] ?? '');
            $side = !empty($g['ours']) ? '' : ' for ' . $opp;
            $line = $who . $side . ($when !== '' ? ' ' . $when : '');
            if (!empty($g['pen'])) $line .= ' from the spot';
            $assist = trim((string) ($g['assist'] ?? ''));
            if ($assist !== '') $line .= ', set up by ' . $assist;
            $bits[] = $line;
        }
        if ($bits) $paras[] = 'Scored: ' . implode('; ', $bits) . '.';
    } else {
        $paras[] = 'Neither side found a way through.';
    }

    /* ---- the changes ---- */
    $subs = (array) ($m['subs_made'] ?? array());
    if ($subs) {
        $bits = array();
        foreach ($subs as $s) {
            $when = cc25_draft_minute($s['min'] ?? '');
            $bits[] = trim((string) ($s['on'] ?? '')) . ' for ' . trim((string) ($s['off'] ?? ''))
                    . ($when !== '' ? ' ' . $when : '');
        }
        $paras[] = 'From the bench: ' . implode(', ', $bits) . '.';
    }

    /* ---- who led, who refereed, who was booked ---- */
    $tail = array();
    $cap = trim((string) ($m['captain'] ?? ''));
    if ($cap !== '') $tail[] = $cap . ' captained the side';
    $cards = array_merge((array) ($m['cards'] ?? array()), (array) ($m['opp_cards'] ?? array()));
    if ($cards) {
        // Group by when, so two cards shown at the same moment say so once rather
        // than repeating the phrase after each name.
        $by_when = array();
        foreach ($cards as $c) {
            $name = trim((string) ($c['player'] ?? ''));
            if ($name === '') continue;
            $by_when[cc25_draft_minute($c['min'] ?? '')][] = $name;
        }
        $bits = array();
        foreach ($by_when as $when => $names) {
            $bits[] = cc25_draft_list($names) . ($when !== '' ? ' ' . $when : '');
        }
        $tail[] = sprintf('%s booking%s went to %s',
            ucfirst(cc25_draft_count(count($cards))), count($cards) === 1 ? '' : 's',
            cc25_draft_list($bits));
    }
    $ref = trim((string) ($m['ref'] ?? ''));
    if ($ref !== '') $tail[] = $ref . ' refereed';
    if ((int) ($m['att'] ?? 0) > 0) $tail[] = sprintf('%d were there', (int) $m['att']);
    if ($tail) $paras[] = ucfirst(implode('. ', $tail)) . '.';

    /* ---- where it leaves the season ---- */
    $ctx = cc25_draft_season_line($m, $season);
    if ($ctx !== '') $paras[] = $ctx;

    return implode("\n\n", $paras);
}

/** "A third defeat from three." — only from games actually in the record. */
function cc25_draft_season_line($m, $season) {
    if (!is_array($season) || !$season) return '';
    $team = $m['team'] ?? 'mens';
    $date = (string) ($m['date'] ?? '');
    $w = $d = $l = 0;
    foreach ($season as $g) {
        if (($g['team'] ?? 'mens') !== $team) continue;
        if ((string) ($g['date'] ?? '') > $date) continue;
        $a = (int) ($g['cc'] ?? 0); $b = (int) ($g['oc'] ?? 0);
        if ($a > $b) $w++; elseif ($a < $b) $l++; else $d++;
    }
    $played = $w + $d + $l;
    if ($played < 2) return '';
    $cc = (int) ($m['cc'] ?? 0); $oc = (int) ($m['oc'] ?? 0);
    $word = $cc > $oc ? 'win' : ($cc < $oc ? 'defeat' : 'draw');
    $nth = $cc > $oc ? $w : ($cc < $oc ? $l : $d);
    return sprintf('It is a %s %s from %s.', cc25_draft_ordinal($nth), $word, cc25_draft_count($played));
}

/* ------------------------------------------------------- the admin side of it */

/**
 * Write a generated draft onto a fixture, unless words are already there.
 *
 * Never silently replaces someone's writing: the draft only lands in an empty
 * box, or when the person asking has ticked the overwrite box beside the button.
 */
function cc25_fx_write_report_draft($id, $overwrite = false) {
    if (!function_exists('get_post_meta')) return false;
    $raw = (string) get_post_meta($id, '_cc25_fx_comet_data', true);
    $m = $raw ? json_decode($raw, true) : null;
    if (!is_array($m) || empty($m['date'])) {
        set_transient('cc25_comet_notice_' . $id,
            'Nothing to draft from yet — import the match from COMET first.', 90);
        return false;
    }
    $existing = (string) get_post_meta($id, '_cc25_fx_report', true);
    if (!cc25_report_draft_should_write($existing, $overwrite)) {
        set_transient('cc25_comet_notice_' . $id,
            'There is already a report here, so nothing was drafted. Tick "replace what is there" '
            . 'beside the button if you want it rewritten.', 120);
        return false;
    }
    $season = function_exists('cc25_season_matches') ? cc25_season_matches() : array();
    $draft = cc25_match_report_draft($m, $season);
    update_post_meta($id, '_cc25_fx_report', $draft);
    set_transient('cc25_comet_notice_' . $id,
        'Drafted from the official record — read it before you publish, and put it in your own words.', 120);
    return true;
}
