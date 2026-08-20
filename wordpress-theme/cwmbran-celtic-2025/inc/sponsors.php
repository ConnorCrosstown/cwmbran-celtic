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
        // 2026/27 additions. A fifth element marks a white-on-black banner, which
        // gets the navy tile rather than the default white one.
        array('Airbond', 'airbond', 'airbond.jpg', ''),
        array('GMB Union', 'gmb-union', 'gmb-union.jpg', 'https://www.gmb.org.uk/'),
        array('PC Wannell', 'pc-wannell', 'pc-wannell.jpg', ''),
        array('Range After Care', 'range-after-care', 'range-after-care.jpg', '', true),
    );
    $out = array();
    foreach ($rows as $r) {
        $out[] = array('name' => $r[0], 'slug' => $r[1], 'file' => $r[2], 'url' => $r[3],
                       'dark' => !empty($r[4]));
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
/** The sponsor for the rotating "Featured Sponsor" spots and the ticker's
 *  single-sponsor slot. Deterministic daily rotation — same sponsor all day,
 *  and across every slot on the page — not a fresh random pick per load.
 *  That matters because those slots render inside pages that get full-page
 *  cached: a per-load random pick (mt_rand, what this used to be) gets
 *  baked into the cached HTML by whichever visitor triggers the render and
 *  is then served to everyone else until the cache expires, so it looks
 *  random in development and is frozen in production. A pick keyed off the
 *  day of the year avoids that trap and still cycles the whole roster over
 *  the season. (The site-wide band is a different case — see
 *  assets/sponsor-band.js — because it needs genuine per-visitor variety and
 *  runs client-side precisely so caching can't freeze it.) */
function cc25_featured_sponsor($seed = 0) {
    $all = cc25_sponsors();
    if (!$all) return null;
    // The seed varies the pick per caller — a post id, a match, a ticker slot —
    // so two stories on the same day do not both name the same sponsor. Adding
    // it to the day of the year rather than replacing it keeps the whole roster
    // cycling over the season, and keeps every pick deterministic, which is what
    // makes it safe to render into a full-page-cached page.
    return $all[(intval(date('z')) + abs(intval($seed))) % count($all)];
}

/** Render the homepage "Featured Sponsor" card. */
function cc25_featured_sponsor_html() {
    $s = cc25_featured_sponsor();
    if (!$s) return '';
    $logo = cc25_sponsor_logo($s['name'], $s['file'], cc25_sponsor_link($s), ' loading="lazy"');
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

/** Where a sponsor's logo links to — through /go/ so the click is counted.
 *  Blank when they have no website, which renders the logo un-linked. */
function cc25_sponsor_link($row) {
    if (empty($row['url']) || empty($row['slug'])) return '';
    return function_exists('cc25_sponsor_click_url') ? cc25_sponsor_click_url($row['slug']) : $row['url'];
}

/** One tile in the sponsor wall (home page + /sponsors, and the charity-partner
 *  list below it). $url is the link to render — /go/<slug> for paid sponsors via
 *  cc25_sponsor_link(), or the partner's own URL raw for charity partners, who
 *  are never click-tracked and have no slug cc25_sponsor_by_slug() can resolve.
 *  .sponsor-card is background:#fff like the footer tile, so a white-on-black
 *  banner (dark => true) gets the navy tile instead of reading as a black brick. */
function cc25_sponsor_card_html($row, $url) {
    return '<div class="sponsor-card' . (!empty($row['dark']) ? ' sponsor-card-dark' : '') . '">'
         . cc25_sponsor_logo($row['name'], $row['file'], $url, ' loading="lazy"') . '</div>';
}

/* ---- The site-wide sponsor band --------------------------------------
 * Every sponsor is rendered into the page as a real anchor and CSS shows a
 * window of them; assets/sponsor-band.js picks a random window per page load
 * and cycles it. Rendering the lot rather than the visible few is deliberate:
 * it is what makes the rotation immune to full-page caching, and it leaves
 * every sponsor a crawlable link on every page of the site.
 * Only the visible window carries a real src — the rest wait on data-src. */
function cc25_sponsor_band_html($window = 6) {
    $rows = cc25_sponsors();
    if (!$rows) return '';
    $window = max(1, min((int) $window, count($rows)));

    $items = '';
    foreach ($rows as $i => $r) {
        $on   = $i < $window;
        $src  = esc_url(cc25_sponsor_url($r['file']));
        $img  = '<img ' . ($on ? 'src="' . $src . '"' : 'data-src="' . $src . '"')
              . ' alt="' . esc_attr($r['name']) . '" width="1058" height="282" loading="lazy">';
        $link = cc25_sponsor_link($r);
        $body = $link
            ? '<a href="' . esc_url($link) . '" target="_blank" rel="noopener sponsored" aria-label="'
              . esc_attr($r['name']) . ' (opens in a new tab)">' . $img . '</a>'
            : $img;
        $items .= '<div class="cc-band-item' . ($on ? ' is-on' : '')
                . (!empty($r['dark']) ? ' cc-band-dark' : '') . '">' . $body . '</div>';
    }

    return '<div class="cc-band" data-window="' . (int) $window . '">'
         . '<div class="cc-band-head"><span class="kick">Proudly supported by</span>'
         . '<a class="cc-band-all" href="' . esc_url(cc25_page_url('sponsors', home_url('/'))) . '">All sponsors &rarr;</a>'
         . '</div><div class="cc-band-strip">' . $items . '</div></div>';
}

/** True where the band should render. The home page and the sponsors page
 *  already show the full wall; a band there is the same logos twice within a
 *  screen of each other. */
function cc25_show_sponsor_band() {
    if (!function_exists('is_front_page')) return true; // CLI tests
    return !is_front_page() && !is_page_template('template-sponsors.php');
}

/* ---- Charity partners ------------------------------------------------
 * Organisations the club supports, rather than sponsors who pay the club.
 * They are listed on the sponsors page in their own right and are deliberately
 * kept out of the rotating band, the ticker and the named slots — paid
 * sponsors are not diluted by a partner the club supports. */
function cc25_charity_partners() {
    return array(
        // The club gave 10% of the Music Shirts kit launch to MVT. A partner the
        // club supports, not a sponsor who pays it — so deliberately not in the
        // paid roster, the band, the ticker or the sellable slots.
        array('name' => 'Music Venue Trust', 'slug' => 'mvt', 'file' => 'mvt.jpg',
              'url' => 'https://musicvenuetrust.com/', 'dark' => true),
    );
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
        // Partners link to their own URL, never through /go/ — they are not
        // click-tracked, and cc25_sponsor_by_slug() cannot resolve a partner
        // slug, so a /go/ link for one would 404.
        $out .= cc25_sponsor_card_html($p, $p['url']);
    }
    return $out . '</div>';
}

/* ---- Named slots ------------------------------------------------------
 * A slot can be sold to one sponsor for one story or one match; when it isn't
 * sold it carries the daily rotation instead, so it never renders empty and
 * the club never has to fill it. */

/** The sponsor for a named slot: the explicit one if it still resolves, the
 *  rotation otherwise. Sponsors leave, and an old report naming one that has
 *  gone falls back rather than rendering a broken block. */
function cc25_slot_sponsor($explicit = '', $seed = 0) {
    $named = cc25_sponsor_by_slug($explicit);
    if ($named) return $named;   // no website is fine — the logo just isn't a link
    $rot = cc25_featured_sponsor($seed);
    return $rot ?: null;
}

/** A named sponsor block. $context is 'story' or 'report' — wording only. */
function cc25_sponsor_slot_html($explicit = '', $context = 'story', $seed = 0) {
    $s = cc25_slot_sponsor($explicit, $seed);
    if (!$s) return '';
    $sold  = cc25_sponsor_by_slug($explicit) !== null;
    $thing = $context === 'report' ? 'match report' : 'story';
    $lead  = $sold ? 'Sponsored by' : 'Brought to you by';
    $logo  = cc25_sponsor_logo($s['name'], $s['file'], cc25_sponsor_link($s), ' loading="lazy"');

    return '<aside class="cc-slot' . (!empty($s['dark']) ? ' cc-slot-dark' : '') . '">'
         . '<div class="cc-slot-eye kick">' . esc_html($lead) . '</div>'
         . '<div class="cc-slot-logo">' . $logo . '</div>'
         . '<div class="cc-slot-txt">This ' . esc_html($thing) . ' is '
         . ($sold ? 'sponsored by' : 'brought to you by') . ' <strong>'
         . esc_html($s['name']) . '</strong>. <a href="'
         . esc_url(cc25_page_url('sponsorship', home_url('/'))) . '">Sponsor the Celts &rarr;</a></div>'
         . '</aside>';
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
    $n = 0;
    foreach ($up as $f) {
        $match = $f['home']
            ? 'Cwmbran Celtic v ' . esc_html($f['opp'])
            : esc_html($f['opp']) . ' v Cwmbran Celtic';
        $out .= '<span class="tk-item"><em class="tk-team ' . $f['badge'][1] . '" title="' . esc_attr($f['title']) . '">' . esc_html($f['badge'][0]) . '</em><b class="tk-date">' . esc_html(cc25_date($f['ms'], 'D j M')) . '</b> ' . $match . ' <em class="tk-ha">' . ($f['home'] ? 'H' : 'A') . '</em></span>';

        // One sponsor every fifth fixture. The ticker is for telling people what
        // is coming up; the sponsor rides along rather than taking it over.
        if (++$n % 5 === 0 && ($sponsor = cc25_featured_sponsor(intdiv($n, 5)))) {
            $link = cc25_sponsor_link($sponsor);
            $name = '&#9733; Brought to you by ' . esc_html($sponsor['name']);
            $out .= '<span class="tk-item tk-sponsor">' . ($link
                ? '<a href="' . esc_url($link) . '" target="_blank" rel="noopener sponsored">' . $name . '</a>'
                : $name) . '</span>';
        }
    }
    return $out;
}
