<?php
/**
 * Telling someone when the site has quietly stopped being right.
 *
 * Everything here degrades softly on purpose: a dead feed falls back to the
 * hand-maintained list, a failed COMET fetch keeps the last import, a missing
 * crest shows initials. That is correct for a visitor and wrong for the club —
 * the site keeps looking fine while the data behind it goes stale, and nobody
 * finds out until someone turns up at the wrong time.
 *
 * So this checks the things that rot, and says so on the dashboard.
 */
if (!defined('ABSPATH')) exit;

/**
 * What's wrong, as a list of ['level' => 'warn'|'info', 'text' => ...].
 *
 * Only facts that can be established cheaply. Nothing here fetches anything —
 * a health check that hangs on a dead API is its own outage.
 */
function cc25_health_checks() {
    $out = array();
    $today = (new DateTime('now', new DateTimeZone('Europe/London')))->format('Y-m-d');

    // 1. Is the live feed answering? Everything men's-first-team leans on it.
    $feed = function_exists('cc25_feed') ? cc25_feed() : array();
    if (empty($feed['fixtures']) && empty($feed['results'])) {
        $out[] = array('level' => 'warn', 'text' =>
            'The allwalessport feed is returning nothing. The site is running on the '
            . 'hand-maintained fixture lists, which still work — but live dates, results '
            . 'and the league table will be stale until it comes back.');
    }

    // 2. A played game with no score is the commonest gap, and the most visible.
    $missing = array();
    foreach (cc25_static_fixtures() as $team => $data) {
        foreach ($data['list'] as $r) {
            if (($r[1] ?? '') === '' || $r[1] === 'TBC') continue;
            if ($r[0] >= $today) continue;
            if (function_exists('cc25_fixture_hidden') && cc25_fixture_hidden($r[1], $r[0])) continue;
            if (function_exists('cc25_row_score') && cc25_row_score($r)) continue;
            // The men's results come from the feed, so only flag them if it is empty.
            if ($team === 'mens' && !empty($feed['results'])) continue;
            $missing[] = cc25_date(strtotime($r[0]) * 1000, 'j M') . ' v ' . $r[1];
        }
    }
    if ($missing) {
        $out[] = array('level' => 'warn', 'text' => sprintf(
            '%d played game%s with no score recorded: %s. Until a score is entered they '
            . 'sit under Fixtures rather than Results.',
            count($missing), count($missing) === 1 ? '' : 's', implode(', ', array_slice($missing, 0, 6))
            . (count($missing) > 6 ? ' and others' : '')));
    }

    // 3. Kick-off times still on the day-of-week guess. Being an hour out is worse
    //    than saying nothing, and it is invisible on the page.
    $assumed = 0;
    $ov = function_exists('cc25_kickoff_overrides') ? cc25_kickoff_overrides() : array();
    foreach (cc25_static_fixtures() as $data) {
        foreach ($data['list'] as $r) {
            if (($r[1] ?? '') === '' || $r[1] === 'TBC' || $r[0] < $today) continue;
            $known = isset($ov[$r[0]]);
            foreach ($ov as $k => $v) {
                $p = explode('|', $k, 2);
                if (count($p) === 2 && $p[0] === $r[0] && cc25_norm_team($p[1]) === cc25_norm_team($r[1])) { $known = true; break; }
            }
            if (!$known) $assumed++;
        }
    }
    if ($assumed) {
        $out[] = array('level' => 'info', 'text' => sprintf(
            '%d upcoming fixture%s using the usual time for the day rather than a confirmed '
            . 'kick-off. They show a time either way, so a wrong one looks just as certain '
            . 'as a right one.', $assumed, $assumed === 1 ? '' : 's'));
    }

    // 4. An opponent with no badge falls back to initials — easy to miss.
    $nocrest = array();
    foreach (cc25_static_fixtures() as $data) {
        foreach ($data['list'] as $r) {
            $opp = $r[1] ?? '';
            if ($opp === '' || $opp === 'TBC' || $r[0] < $today) continue;
            if (function_exists('cc25_opp_crest_file') && cc25_opp_crest_file($opp) === '') $nocrest[$opp] = 1;
        }
    }
    if ($nocrest) {
        $out[] = array('level' => 'info', 'text' => 'No badge for ' . implode(', ', array_keys($nocrest))
            . ' — their initials show instead.');
    }

    // 5. The Bond page shows the newest draw and nothing else, so a missed month
    //    is a page that silently claims last month is current.
    if (function_exists('cc25_bond_draws')) {
        $draws = cc25_bond_draws();
        if ($draws && !empty($draws[0]['date'])) {
            $age = (int) ((time() - strtotime($draws[0]['date'])) / 86400);
            if ($age > 45) {
                $out[] = array('level' => 'warn', 'text' => sprintf(
                    'The newest Celtic Bond draw is %d days old (%s). The Bond page shows only '
                    . 'the latest, so it is presenting that as current.',
                    $age, esc_html($draws[0]['label'] ?? '')));
            }
        }
    }
    // 6. A phone number a digit short is worse than none: it dials, it fails, and
    //    it looks just as confident as a right one. The list the club first supplied
    //    had a ten-digit mobile in it, which is what prompted this.
    if (function_exists('cc25_people')) {
        $bad = array();
        foreach (cc25_people() as $p) {
            $ph = trim((string) ($p['phone'] ?? ''));
            if ($ph !== '' && !cc25_phone_looks_complete($ph)) {
                $bad[] = ($p['name'] ?? 'Someone') . ' (' . $ph . ')';
            }
        }
        if ($bad) {
            $out[] = array('level' => 'warn', 'text' => sprintf(
                'Contact number%s that will not dial: %s. Check the digits on the Contact page.',
                count($bad) === 1 ? '' : 's', implode(', ', $bad)));
        }
    }

    // 7. A home game that sells tickets but has no link of its own. The button still
    //    works — it falls back to the promoter listing — so nothing looks broken, which
    //    is exactly why this needs saying out loud.
    if (function_exists('cc25_ticket_gaps')) {
        $gaps = cc25_ticket_gaps();
        if ($gaps) {
            $bits = array();
            foreach (array_slice($gaps, 0, 5) as $g) {
                $bits[] = cc25_date(strtotime($g['date']) * 1000, 'j M') . ' v ' . $g['opponent'];
            }
            $out[] = array('level' => 'info', 'text' => sprintf(
                '%d home game%s with no ticket link of its own: %s%s. Buy Tickets still works '
                . 'for them, but it lands on the full listing rather than that game.',
                count($gaps), count($gaps) === 1 ? '' : 's', implode(', ', $bits),
                count($gaps) > 5 ? ' and others' : ''));
        }
    }

    // 8. Tickets on sale for a game the site says is postponed. Worse than a missing
    //    link, because one of the two is telling supporters something untrue.
    if (function_exists('cc25_ticket_conflicts')) {
        foreach (cc25_ticket_conflicts() as $c) {
            $out[] = array('level' => 'warn', 'text' => sprintf(
                'Tickets are on sale for %s v %s (%s), but the site has that game marked '
                . 'postponed so it is not shown anywhere. Either the game is back on and the '
                . 'postponement should be lifted, or the Gigantic listing should come down.',
                esc_html($c['label'] ?? "Cwmbran Celtic"), esc_html($c['opponent']),
                cc25_date(strtotime($c['date']) * 1000, 'j M Y')));
        }
    }

    return $out;
}

/** The dashboard panel. Administrators and editors both — they're the people who
 *  can fix any of it. */
add_action('wp_dashboard_setup', function () {
    if (!current_user_can('edit_posts')) return;
    wp_add_dashboard_widget('cc25_health', 'Cwmbran Celtic — anything needing attention?', function () {
        $checks = cc25_health_checks();
        if (!$checks) {
            echo '<p style="margin:0"><strong>Nothing outstanding.</strong> Scores are up to date, '
               . 'the feed is answering, and every upcoming opponent has a badge.</p>';
            return;
        }
        echo '<ul style="margin:0">';
        foreach ($checks as $c) {
            $colour = $c['level'] === 'warn' ? '#b32d2e' : '#996800';
            printf('<li style="margin:0 0 10px;padding-left:10px;border-left:3px solid %s">%s</li>',
                   esc_attr($colour), esc_html($c['text']));
        }
        echo '</ul>';
        echo '<p style="margin:10px 0 0;color:#666;font-size:12px">The site never shows an error for any of '
           . 'these &mdash; it falls back quietly, which is why they need saying here.</p>';
    });
});

/**
 * The other thing nobody can see: a CDN holding pages for 30 days.
 *
 * cache-control on this site carries s-maxage=2592000 with an edge rule for
 * anonymous HTML. Uploading a change and seeing nothing happen is the expected
 * outcome, not a bug, and it has already cost an afternoon of looking in the wrong
 * place. Said once, on the dashboard, to whoever is about to be confused by it.
 */
add_action('admin_notices', function () {
    if (!current_user_can('manage_options')) return;
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'dashboard') return;
    if (get_option('cc25_cdn_notice_seen')) return;
    echo '<div class="notice notice-info is-dismissible"><p><strong>Changes not showing?</strong> '
       . 'This site sits behind a CDN that holds pages for up to 30 days. After uploading a theme '
       . 'or editing content, purge the cache &mdash; otherwise the old version is served and it '
       . 'looks as though nothing worked. '
       . '<a href="' . esc_url(add_query_arg('cc25_cdn_ack', '1')) . '">Understood, don\'t show this again</a>.</p></div>';
});

add_action('admin_init', function () {
    if (!empty($_GET['cc25_cdn_ack']) && current_user_can('manage_options')) {
        update_option('cc25_cdn_notice_seen', 1);
    }
});
