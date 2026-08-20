<?php
/**
 * Sponsors — mirrors cwmbran-celtic-mailing-list/lib/Sponsors.js.
 * Moved out of functions.php unchanged.
 */
if (!defined('ABSPATH')) exit;


/* ---- Sponsors (current list — mirrors cwmbran-celtic-mailing-list/lib/Sponsors.js) --- */
function cc25_sponsor_main() {
    return array('name' => 'Motazone', 'slug' => 'motazone', 'file' => '_main-motazone.jpg',
                 'url' => 'https://motazone.net/', 'dark' => false);
}

/* Each row: name, slug, banner file, website URL, and whether the banner is
 * white-on-black. A blank URL renders the logo un-linked (used where a sponsor
 * has no confirmed website). A dark banner gets a navy tile instead of the
 * default white one, so it doesn't read as a black brick in the wall.
 * SLUGS ARE PERMANENT — they key the click counts in inc/sponsor-clicks.php. */
function cc25_sponsors() {
    $rows = array(
        array('Gigantic', 'gigantic', 'gigantic.jpg', 'https://www.gigantic.com/'),
        array('Crosstown Concerts', 'crosstown-concerts', 'crosstown-concerts.jpg', 'https://www.crosstownconcerts.com/'),
        array("Dudley's Aluminium", 'dudleys', 'dudleys.jpg', 'https://www.dudleys.uk.com/'),
        array('Coaltown', 'coaltown', 'coaltown.jpg', 'https://www.coaltowncoffee.co.uk/'),
        array('SERi', 'seri', 'seri.jpg', ''),
        array('Diverse Vinyl', 'diverse-vinyl', 'diverse-vinyl.jpg', 'https://www.diversevinyl.com/'),
        array('Country Connect', 'country-connect', 'country-connect.jpg', 'https://www.country-connect.co.uk/'),
        array('Hornbeam', 'hornbeam', 'hornbeam.jpg', ''),
        array('Hydro Group', 'hydro-group', 'hydro-group.jpg', ''),
        array('CRE', 'cre', 'cre.jpg', ''),
        array('TOR Sports', 'tor-sports', 'tor.jpg', 'https://www.tor-sports.co.uk/'),
        array('Avondale Vehicle Hire', 'avondale-vehicle-hire', 'avondale-vehicle-hire.png', 'https://www.avondalehire.co.uk/'),
        array('Coffiology', 'coffiology', 'coffiology.png', 'https://coffiology.com/'),
        array('Coleg Gwent', 'coleg-gwent', 'coleg-gwent.png', 'https://www.coleggwent.ac.uk/'),
        array('JW Stockwell', 'jw-stockwell', 'jw-stockwell.png', ''),
        array('Peter Villars', 'peter-villars', 'peter-villars.png', 'https://www.facebook.com/p/Peter-Villars-Sportsground-Maintenance-100063177401237/'),
        array('Blitz Media', 'blitz-media', 'blitz-media.jpg', 'https://www.blitzmedia.co.uk/'),
        array('Le Pub', 'le-pub', 'le-pub.jpg', 'https://www.lepublicspace.co.uk/'),
    );
    $out = array();
    foreach ($rows as $r) {
        $out[] = array('name' => $r[0], 'slug' => $r[1], 'file' => $r[2], 'url' => $r[3], 'dark' => false);
    }
    return $out;
}

/** The sponsor with this slug, or null. Searches the paid roster and the main
 *  sponsor — not charity partners, who are never click-tracked. */
function cc25_sponsor_by_slug($slug) {
    if ($slug === '' || $slug === null) return null;
    foreach (array_merge(array(cc25_sponsor_main()), cc25_sponsors()) as $r) {
        if ($r['slug'] === $slug) return $r;
    }
    return null;
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
    $logo = cc25_sponsor_logo($s['name'], $s['file'], $s['url'], ' loading="lazy"');
    if ($variant === 'strip') {
        return '<div class="ft-sponsor"><span class="ft-sponsor-eye kick">&#9733; Featured Sponsor</span>'
            . '<span class="ft-sponsor-logo">' . $logo . '</span></div>';
    }
    return '<div class="feat-sponsor reveal"><div class="feat-eye kick">&#9733; Featured Sponsor</div>'
        . '<div class="feat-logo">' . $logo . '</div>'
        . '<div class="feat-txt"><strong>' . esc_html($s['name']) . '</strong> is proud to support Cwmbran Celtic.'
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

/* ---- Charity partners ------------------------------------------------
 * Organisations the club supports, rather than sponsors who pay the club.
 * They are listed on the sponsors page in their own right and are deliberately
 * kept out of the rotating band, the ticker and the named slots — paid
 * sponsors are not diluted by a partner the club supports. */
function cc25_charity_partners() {
    return array();
}

/** The charity-partner section for the sponsors page. Empty when there are none. */
function cc25_charity_partners_html() {
    $partners = cc25_charity_partners();
    if (!$partners) return '';
    $out = '<div class="sec-head reveal" style="margin-top:56px"><div>'
         . '<div class="sec-eye kick"><span class="ix">03</span><span class="ln"></span> Giving something back</div>'
         . '<h2>Charity Partners</h2></div></div>'
         . '<p class="spx-lead reveal">Causes the club is proud to support.</p>'
         . '<div class="sponsor-wall reveal d1">';
    foreach ($partners as $p) {
        $cls = !empty($p['dark']) ? ' sponsor-card-dark' : '';
        $out .= '<div class="sponsor-card' . $cls . '">'
              . cc25_sponsor_logo($p['name'], $p['file'], $p['url'], ' loading="lazy"') . '</div>';
    }
    return $out . '</div>';
}

/** Match-ticker items: upcoming fixtures across every team, with M/W/Res badges.
 *  Fixtures only — the ticker used to lead with the last four Men's First Team
 *  results, which read as the headline news when what it is for is telling people
 *  what's coming up. Results have their own place on the fixtures page. */
function cc25_ticker_items() {
    $out = '';
    // Upcoming fixtures across ALL teams (Men's First, Reserves, Women's, ...).
    // A flat date-sort-then-truncate would silently drop whichever teams' seasons
    // start latest once there are enough teams to fill the cap before their first
    // game comes round (this happened to the Women's First Team once the roster
    // grew to seven teams). So instead: seed the list with each team's very next
    // upcoming game first — guaranteeing every team features regardless of team
    // count or season start — then fill the remaining slots with whatever's
    // soonest across all teams, and only then sort the whole thing by date.
    $now = round(microtime(true) * 1000);
    $cap = 15; // sensible overall length for a header ticker
    $teams_up = array();
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
        usort($team_up, function ($a, $b) { return $a['ms'] <=> $b['ms']; });
        $teams_up[] = array_slice($team_up, 0, 5); // cap any one team's contribution
    }
    $seeded = array();
    $rest = array();
    foreach ($teams_up as $team_up) {
        if ($team_up) $seeded[] = array_shift($team_up);
        $rest = array_merge($rest, $team_up);
    }
    usort($rest, function ($a, $b) { return $a['ms'] <=> $b['ms']; });
    $up = array_merge($seeded, array_slice($rest, 0, max(0, $cap - count($seeded))));
    usort($up, function ($a, $b) { return $a['ms'] <=> $b['ms']; });
    foreach ($up as $f) {
        $match = $f['home']
            ? 'Cwmbran Celtic v ' . esc_html($f['opp'])
            : esc_html($f['opp']) . ' v Cwmbran Celtic';
        $out .= '<span class="tk-item"><em class="tk-team ' . $f['badge'][1] . '" title="' . esc_attr($f['title']) . '">' . esc_html($f['badge'][0]) . '</em><b class="tk-date">' . esc_html(cc25_date($f['ms'], 'D j M')) . '</b> ' . $match . ' <em class="tk-ha">' . ($f['home'] ? 'H' : 'A') . '</em></span>';
    }
    return $out;
}
