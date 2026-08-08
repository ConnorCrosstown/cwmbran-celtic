<?php
/**
 * Sponsors — mirrors cwmbran-celtic-mailing-list/lib/Sponsors.js.
 * Moved out of functions.php unchanged.
 */
if (!defined('ABSPATH')) exit;


/* ---- Sponsors (current list — mirrors cwmbran-celtic-mailing-list/lib/Sponsors.js) ----
 * Each row: array(Name, banner file, website URL). A blank URL renders the logo
 * un-linked (used where a sponsor has no confirmed website). */
function cc25_sponsor_main() { return array('name' => 'Motazone', 'file' => '_main-motazone.jpg', 'url' => 'https://motazone.net/'); }
function cc25_sponsors() {
    return array(
        array('Gigantic', 'gigantic.jpg', 'https://www.gigantic.com/'),
        array('Crosstown Concerts', 'crosstown-concerts.jpg', 'https://www.crosstownconcerts.com/'),
        array("Dudley's Aluminium", 'dudleys.jpg', 'https://www.dudleys.uk.com/'),
        array('Coaltown', 'coaltown.jpg', 'https://www.coaltowncoffee.co.uk/'),
        array('SERi', 'seri.jpg', ''),
        array('Diverse Vinyl', 'diverse-vinyl.jpg', 'https://www.diversevinyl.com/'),
        array('Country Connect', 'country-connect.jpg', 'https://www.country-connect.co.uk/'),
        array('Hornbeam', 'hornbeam.jpg', ''),
        array('Hydro Group', 'hydro-group.jpg', ''),
        array('CRE', 'cre.jpg', ''),
        array('TOR Sports', 'tor.jpg', 'https://www.tor-sports.co.uk/'),
        array('Avondale Vehicle Hire', 'avondale-vehicle-hire.png', 'https://www.avondalehire.co.uk/'),
        array('Coffiology', 'coffiology.png', 'https://coffiology.com/'),
        array('Coleg Gwent', 'coleg-gwent.png', 'https://www.coleggwent.ac.uk/'),
        array('JW Stockwell', 'jw-stockwell.png', ''),
        array('Peter Villars', 'peter-villars.png', 'https://www.facebook.com/p/Peter-Villars-Sportsground-Maintenance-100063177401237/'),
        array('Blitz Media', 'blitz-media.jpg', 'https://www.blitzmedia.co.uk/'),
        array('Le Pub', 'le-pub.jpg', 'https://www.lepublicspace.co.uk/'),
    );
}
/** A random sponsor for the rotating "Featured Sponsor" spots — picked fresh on
 * each page load so every sponsor gets extra exposure over time. */
function cc25_featured_sponsor() {
    $all = cc25_sponsors();
    if (!$all) return null;
    // Deterministic daily rotation — same sponsor all day and across every slot
    // on the page, so the logo caches and full-page caching stays stable (was
    // mt_rand, which changed per render and per slot).
    return $all[intval(date('z')) % count($all)];
}

/** Render a Featured Sponsor block. $variant: 'card' (homepage) or 'strip' (footer). */
function cc25_featured_sponsor_html($variant = 'card') {
    $s = cc25_featured_sponsor();
    if (!$s) return '';
    $logo = cc25_sponsor_logo($s[0], $s[1], isset($s[2]) ? $s[2] : '', ' loading="lazy"');
    if ($variant === 'strip') {
        return '<div class="ft-sponsor"><span class="ft-sponsor-eye kick">&#9733; Featured Sponsor</span>'
            . '<span class="ft-sponsor-logo">' . $logo . '</span></div>';
    }
    return '<div class="feat-sponsor reveal"><div class="feat-eye kick">&#9733; Featured Sponsor</div>'
        . '<div class="feat-logo">' . $logo . '</div>'
        . '<div class="feat-txt"><strong>' . esc_html($s[0]) . '</strong> is proud to support Cwmbran Celtic.'
        . '<a href="' . esc_url(cc25_page_url('sponsorship', home_url('/'))) . '">Become a sponsor &rarr;</a></div></div>';
}

function cc25_sponsor_url($file) {
    return get_stylesheet_directory_uri() . '/assets/img/sponsor-banners/' . $file;
}

/** Wrap a sponsor logo <img> in a link when the sponsor has a website. */
function cc25_sponsor_logo($name, $file, $url, $img_extra = '') {
    $img = '<img src="' . esc_url(cc25_sponsor_url($file)) . '" alt="' . esc_attr($name) . '" width="1058" height="282"' . $img_extra . '>';
    if (!$url) return $img;
    return '<a href="' . esc_url($url) . '" target="_blank" rel="noopener sponsored" aria-label="'
        . esc_attr($name) . ' (opens in a new tab)">' . $img . '</a>';
}

/** Match-ticker items: upcoming fixtures across every team, with M/W/Res badges.
 *  Fixtures only — the ticker used to lead with the last four Men's First Team
 *  results, which read as the headline news when what it is for is telling people
 *  what's coming up. Results have their own place on the fixtures page. */
function cc25_ticker_items() {
    $out = '';
    // Upcoming fixtures across ALL teams (Men's First, Reserves, Women's).
    // Take each team's next few games so EVERY team features in the banner even
    // when their season starts later (e.g. Women's kick off in late Sept), then
    // merge and sort by date.
    $now = round(microtime(true) * 1000);
    $up = array();
    foreach (cc25_static_fixtures() as $team) {
        $team_up = array();
        foreach ($team['list'] as $rf) {
            if (cc25_fixture_hidden($rf[1], $rf[0])) continue;
            // Drop games once they've finished (kick-off + 2h), matching the
            // Fixtures list + homepage — not at midnight, so the ticker doesn't
            // keep showing a just-finished match as "upcoming" all evening.
            $ms = cc25_row_kickoff_ms($rf[0], $rf[1]);
            if ($ms + 2 * 60 * 60 * 1000 < $now) continue;
            $team_up[] = array('ms' => $ms, 'opp' => $rf[1], 'home' => !empty($rf[2]),
                'badge' => $team['badge'], 'title' => $team['title']);
        }
        $up = array_merge($up, array_slice($team_up, 0, 5)); // guarantee each team appears
    }
    usort($up, function ($a, $b) { return $a['ms'] <=> $b['ms']; });
    foreach (array_slice($up, 0, 15) as $f) {
        $match = $f['home']
            ? 'Cwmbran Celtic v ' . esc_html($f['opp'])
            : esc_html($f['opp']) . ' v Cwmbran Celtic';
        $out .= '<span class="tk-item"><em class="tk-team ' . $f['badge'][1] . '" title="' . esc_attr($f['title']) . '">' . esc_html($f['badge'][0]) . '</em><b class="tk-date">' . esc_html(cc25_date($f['ms'], 'D j M')) . '</b> ' . $match . ' <em class="tk-ha">' . ($f['home'] ? 'H' : 'A') . '</em></span>';
    }
    return $out;
}
