<?php
/**
 * Cwmbran Celtic 2025 — child theme of Divi.
 * Round 1: foundation (premium CSS + fonts + JS) and the homepage (front-page.php).
 */
if (!defined('ABSPATH')) exit;

add_action('wp_enqueue_scripts', function () {
    // Premium design system (this child theme's style.css) + fonts are referenced from it.
    wp_enqueue_style('cc25', get_stylesheet_uri(), array(), '0.1.0');
    // Countdown + scroll-reveal.
    wp_enqueue_script('cc25-js', get_stylesheet_directory_uri() . '/assets/premium.js', array(), '0.1.0', true);

    // Bespoke templates render their own full premium design, so drop Divi's
    // stylesheet on them to stop it fighting. Regular pages (which may hold
    // Divi-built content) keep Divi's styles.
    $bespoke = is_front_page() || is_singular('post') || is_home() || is_archive()
        || is_search() || is_page_template('template-fixtures.php');
    if ($bespoke) {
        wp_dequeue_style('divi-style');
    }
}, 99);

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus(array('cc25_primary' => 'Primary Navigation (Cwmbran 2025)'));
});

/*
 * Auto-apply the premium templates to the club's real pages by slug, so
 * /fixtures/, /teams/, /sponsors/ show the new feed-driven designs instead of
 * the old Divi content — no manual template assignment needed.
 */
add_filter('template_include', function ($template) {
    // Single blog posts -> premium article (overrides Divi Theme Builder).
    if (is_singular('post')) {
        $t = locate_template('single.php');
        if ($t) return $t;
    }
    // Blog index / category / tag / search -> premium news listing.
    if (is_home() || is_category() || is_tag() || is_search()) {
        $t = locate_template('index.php');
        if ($t) return $t;
    }
    // Key pages -> the feed-driven premium templates, by slug.
    if (is_page()) {
        $slug = get_post_field('post_name', get_queried_object_id());
        $map = array(
            'fixtures'                   => 'template-fixtures.php',
            'teams'                      => 'template-teams.php',
            'mens-team'                  => 'template-player-cards.php',
            'mens-1st-team'              => 'template-player-cards.php',
            'mens-reserves'              => 'template-reserves.php',
            'ladies-team'                => 'template-squad.php',
            'sponsors-2'                 => 'template-sponsors.php',
            'sponsors'                   => 'template-sponsors.php',
            'sponsorship-opportunities'  => 'template-sponsorship.php',
            'sponsorship'                => 'template-sponsorship.php',
        );
        if (isset($map[$slug])) {
            $found = locate_template($map[$slug]);
            if ($found) return $found;
        }
    }
    return $template;
}, 9999);

/** Real slug variants (confirmed from the live site) so links resolve to the club's pages. */
function cc25_slug_candidates($key) {
    $map = array(
        'fixtures'         => array('fixtures', 'fixtures-results', 'fixtures-and-results'),
        'sponsors'         => array('sponsors-2', 'sponsors', 'our-sponsors'),
        'news'             => array('news', 'latest-news', 'club-news'),
        'contact'          => array('contact', 'contact-us'),
        'celtic-bond'      => array('the-celtic-bond', 'celtic-bond', 'bond'),
        'bond-results'     => array('the-celtic-bond-results', 'celtic-bond-results', 'bond-results'),
        'teams'            => array('teams', 'all-teams'),
        'mens'             => array('mens-team', 'mens-1st-team'),
        'ladies'           => array('ladies-team', 'ladies-1st-team'),
        'club'             => array('club-history', 'club', 'the-club', 'about'),
        'walking-football' => array('cwmbran-walking-football-2', 'walking-football', 'walking'),
        'hospitality'      => array('hospitality', 'matchday-hospitality'),
        'sponsorship'      => array('sponsorship-opportunities', 'sponsorship', 'sponsors-2'),
    );
    return isset($map[$key]) ? $map[$key] : array($key);
}

/** External destinations (ticketing / shop) — not WordPress pages. */
function cc25_ext_url($key) {
    $map = array(
        'tickets' => 'https://cwmbranceltic.gigantic.com/promoter/cwmbran-celtic-fc',
        'shop'    => 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc',
    );
    return isset($map[$key]) ? $map[$key] : '#';
}

/* -------------------------------------------------------------------------
 * Mailing-list signup. The homepage form POSTs to the club's Apps Script
 * mailing-list web app (cwmbran-celtic-mailing-list). After deploying that
 * script as a Web app, run its "Website signup info" menu item and paste the
 * two values below. Until then the form shows a friendly success without
 * sending anywhere.
 * ---------------------------------------------------------------------- */
function cc25_signup_endpoint() { return ''; }  // e.g. https://script.google.com/macros/s/AKfyc.../exec
function cc25_signup_secret()   { return ''; }  // the SIGNUP_SECRET shown by "Website signup info"

/** Sponsorship page: commercial contact + optional brochure PDF (leave blank to hide the button). */
function cc25_sponsorship_email()    { return 'cwmbrancelticcomms@gmail.com'; }
function cc25_sponsorship_brochure() { return ''; }  // paste a 2026/27 brochure PDF URL to show the download button

/** Current football season label, e.g. "2026/27" — derived from the date so it
 * never goes stale (the season rolls over in July). */
function cc25_season() {
    $y = (int) date_i18n('Y');
    $start = ((int) date_i18n('n') >= 7) ? $y : $y - 1;
    return $start . '/' . substr((string) ($start + 1), -2);
}

/* -- Squad pages: resolve the SportsPress team for the CURRENT page so
 * /mens-team/ and /ladies-team/ each show only their own players (they used to
 * share one template and list everyone merged). Returns 0 — "show all" — when a
 * team can't be matched, so it can never regress. NOTE: matches teams by name;
 * if the club's SportsPress team titles are unusual, tune the keywords below. */
function cc25_squad_team_id() {
    if (!function_exists('get_queried_object_id')) return 0;
    $slug = (string) get_post_field('post_name', get_queried_object_id());
    if (!$slug) return 0;
    // Check women first — "men" is a substring of "women".
    if (preg_match('/ladies|women|girls/i', $slug))       $want = 'women';
    elseif (preg_match('/men|mens|first|1st/i', $slug))    $want = 'men';
    else return 0; // generic /teams/ page -> show everyone
    foreach (get_posts(array('post_type' => 'sp_team', 'numberposts' => -1)) as $t) {
        $isWomen = (bool) preg_match('/ladies|women|girls/i', $t->post_title);
        if ($want === 'women' && $isWomen) return $t->ID;
        if ($want === 'men' && !$isWomen && preg_match('/men|first|1st|senior|celtic/i', $t->post_title)) return $t->ID;
    }
    return 0;
}

/** Every SportsPress team ID a player belongs to (handles single/array/current-team meta). */
function cc25_player_team_ids($pid) {
    $ids = array();
    foreach ((array) get_post_meta($pid, 'sp_team', false) as $v) {
        if (is_array($v)) { foreach ($v as $x) $ids[] = (int) $x; }
        else $ids[] = (int) $v;
    }
    $cur = get_post_meta($pid, 'sp_current_team', true);
    if ($cur) $ids[] = (int) $cur;
    return array_filter(array_unique($ids));
}

/** URL of a page — tries the real slug variants, else a fallback (never 404s). */
function cc25_page_url($key, $fallback = '') {
    $cands = is_array($key) ? $key : cc25_slug_candidates($key);
    foreach ($cands as $s) {
        $p = get_page_by_path($s);
        if ($p) return get_permalink($p);
    }
    return $fallback;
}

/**
 * Nav fallback: the club's real menu (with dropdowns) until a WP menu is
 * assigned to the "Primary Navigation (Cwmbran 2025)" location. Mirrors the
 * live site's submenus. Each item: array(label, url, external, children[]);
 * each child: array(label, url, external). Markup matches WordPress's default
 * menu classes (menu-item-has-children / sub-menu) so the same dropdown CSS
 * styles both this fallback and a real assigned menu.
 */
function cc25_nav_items() {
    $home = home_url('/');
    return array(
        array('All Teams', cc25_page_url('teams', $home), false, array(
            array("Men's First Team", cc25_page_url(array('mens-team', 'mens-1st-team'), $home), false),
            array("Men's Reserves", cc25_page_url('mens-reserves', $home), false),
            array("Women's First Team", cc25_page_url(array('ladies-team', 'ladies-1st-team'), $home), false),
        )),
        array('Fixtures &amp; Results', cc25_page_url('fixtures', $home), false, array(
            array('Current Season', cc25_page_url('fixtures', $home), false),
            array('2024-25 Archive', cc25_page_url(array('2024-25-archive'), $home), false),
            array('2023-24 Archive', cc25_page_url(array('2023-24-archive'), $home), false),
            array('2022-23 Archive', cc25_page_url(array('2022-23-archive'), $home), false),
        )),
        array('Sponsors', cc25_page_url('sponsors', $home), false, array(
            array('Our Sponsors', cc25_page_url(array('sponsors-2', 'sponsors'), $home), false),
            array('Sponsorship Opportunities', cc25_page_url(array('sponsorship-opportunities', 'sponsorship'), $home), false),
        )),
        array('Celtic Bond', cc25_page_url('celtic-bond', $home), false, array(
            array('Celtic Bond Results', cc25_page_url('bond-results', $home), false),
        )),
        array('Club', cc25_page_url(array('club-history', 'club', 'the-club', 'about'), $home), false, array(
            array('Club History', cc25_page_url(array('club-history'), $home), false),
            array('News', cc25_page_url('news', $home), false),
            array('Galleries', cc25_page_url(array('galleries'), $home), false),
            array('Club Documents', cc25_page_url(array('club-documents'), $home), false),
            array('Matchday Programme', cc25_page_url(array('cwmbran-celtic-fc-match-day-programme-digital'), $home), false),
            array('Coleg Gwent', cc25_page_url(array('coleg-gwent-4', 'coleg-gwent'), $home), false),
        )),
        array('Club Shop', cc25_ext_url('shop'), true, array()),
        array('Contact', cc25_page_url('contact', $home), false, array()),
    );
}

function cc25_nav_fallback() {
    echo '<ul class="cc25-nav">';
    foreach (cc25_nav_items() as $it) {
        $children = isset($it[3]) ? $it[3] : array();
        $has = !empty($children);
        $ext = $it[2] ? ' target="_blank" rel="noopener"' : '';
        echo '<li class="menu-item' . ($has ? ' menu-item-has-children' : '') . '">';
        echo '<a href="' . esc_url($it[1]) . '"' . $ext . '>' . $it[0] . '</a>';
        if ($has) {
            echo '<ul class="sub-menu">';
            foreach ($children as $c) {
                $cext = $c[2] ? ' target="_blank" rel="noopener"' : '';
                echo '<li class="menu-item"><a href="' . esc_url($c[1]) . '"' . $cext . '>' . $c[0] . '</a></li>';
            }
            echo '</ul>';
        }
        echo '</li>';
    }
    echo '</ul>';
}

/* -------------------------------------------------------------------------
 * Live-feed helpers. Data comes from the cwmbran-celtic-feed plugin
 * (CCF_Client::get_feed()). Every helper degrades safely to empty/null so a
 * missing plugin or empty feed can never fatal the homepage.
 * ---------------------------------------------------------------------- */

function cc25_feed() {
    if (!class_exists('CCF_Client')) return array();
    $f = CCF_Client::get_feed();
    return is_array($f) ? $f : array();
}

function cc25_club_logo() {
    return get_stylesheet_directory_uri() . '/assets/img/club-logo.webp';
}

/** The club's own crest (real badge). */
function cc25_own_crest($px) {
    return '<img class="crest" style="width:' . intval($px) . 'px;height:' . intval($px) . 'px" src="'
        . esc_url(cc25_club_logo()) . '" alt="Cwmbran Celtic">';
}

/** Any club's crest from the feed: real image, monogram fallback, or initials. */
function cc25_crest($feed, $name, $px) {
    if (strpos((string) $name, 'Cwmbran Celtic') !== false) return cc25_own_crest($px);
    $c = isset($feed['crests'][$name]) ? $feed['crests'][$name] : null;
    $style = 'width:' . intval($px) . 'px;height:' . intval($px) . 'px';
    if (is_array($c) && ($c['kind'] ?? '') === 'image' && !empty($c['src'])) {
        return '<img class="crest" style="' . esc_attr($style) . '" src="' . esc_url($c['src'])
            . '" alt="' . esc_attr($c['alt'] ?? $name) . '" loading="lazy">';
    }
    if (is_array($c) && ($c['kind'] ?? '') === 'monogram') {
        $hue = intval($c['hue'] ?? 0);
        $bg = 'radial-gradient(120% 120% at 30% 20%,hsl(' . $hue . ',45%,40%),hsl(' . $hue . ',45%,22%))';
        return '<span class="crest" style="' . esc_attr($style . ';background:' . $bg) . '">'
            . esc_html($c['initials'] ?? mb_substr($name, 0, 2)) . '</span>';
    }
    return '<span class="crest" style="' . esc_attr($style) . '">'
        . esc_html(mb_strtoupper(mb_substr((string) $name, 0, 2))) . '</span>';
}

/** Reserve-fixture opponent crest from the theme's bundled set, else a monogram.
 * (The live feed only carries crests for clubs in the Ardal SE fixtures, so the
 * Combination-league opponents need their own resolver.) To add a crest: drop
 * the image in assets/img/opponents/ and add a line to the map. */
function cc25_opp_crest_file($name) {
    $map = array(
        'Croesyceiliog' => 'croesyceiliog.png',
        'Abercarn United' => 'abercarn-united.png',
        'Tredegar Town' => 'tredegar-town.png',
        'Chepstow Town' => 'chepstow-town.png',
        'Cwmbran Town' => 'cwmbran-town.jpg',
        'New Inn' => 'new-inn.png',
        'Undy' => 'undy.png',
        'Newport Corinthians' => 'newport-corinthians.png',
        'Lliswerry' => 'lliswerry.png',
        'Blaenavon Blues' => 'blaenavon-blues.png',
        // Women's — Genero Adran South opponents.
        'Pontypridd United' => 'pontypridd-united.png',
        'Carmarthen Town' => 'carmarthen-town.png',
        'Taffs Well' => 'taffs-well.png',
        // Men's First Team opponents (also cover Reserves).
        'Abergavenny Town' => 'abergavenny-town.png',
        'Risca United' => 'risca-united.png',
        'Goytre' => 'goytre.png',
        'Caldicot Town' => 'caldicot-town.jpg',
        'Brecon Corries' => 'brecon-corries.png',
    );
    return isset($map[$name]) ? $map[$name] : '';
}
function cc25_res_crest($name, $px) {
    if (strpos((string) $name, 'Cwmbran Celtic') !== false) return cc25_own_crest($px);
    $style = 'width:' . intval($px) . 'px;height:' . intval($px) . 'px';
    $file = cc25_opp_crest_file($name);
    if ($file) {
        return '<img class="crest" style="' . esc_attr($style) . '" src="'
            . esc_url(get_stylesheet_directory_uri() . '/assets/img/opponents/' . $file)
            . '" alt="' . esc_attr($name) . '" loading="lazy">';
    }
    // Monogram badge (word initials) for opponents we don't have a crest for yet.
    $ini = '';
    foreach (preg_split('/\s+/', trim((string) $name)) as $w) {
        if ($w !== '') $ini .= mb_substr($w, 0, 1);
        if (mb_strlen($ini) >= 2) break;
    }
    if (mb_strlen($ini) < 2) $ini = mb_substr((string) $name, 0, 2);
    $bg = 'radial-gradient(120% 120% at 30% 20%,var(--blue-500),var(--navy-800))';
    return '<span class="crest" style="' . esc_attr($style . ';background:' . $bg) . '">'
        . esc_html(mb_strtoupper($ini)) . '</span>';
}

/** Render a hand-maintained fixture list (Reserves / Ladies) — rows grouped by
 * month, home-left/away-right, Cwmbran highlighted, competition + H/A tag.
 * $list rows: [date 'Y-m-d', opponent, isHome(bool), competition(optional)]. */
function cc25_render_static_fixtures($list, $tickets_url = '') {
    $lm = '';
    foreach ($list as $rf) {
        $rd = strtotime($rf[0]); $home = !empty($rf[2]); $opp = $rf[1];
        $comp = isset($rf[3]) && $rf[3] !== '' ? $rf[3] : 'League';
        $mo = date('F Y', $rd);
        if ($mo !== $lm) { $lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; }
        $oc = cc25_res_crest($opp, 34);
        // Ticket link only makes sense for HOME games (we host, we sell).
        $tix = ($home && $tickets_url)
            ? '<a class="mtix btn btn-gold" href="' . esc_url($tickets_url) . '" target="_blank" rel="noopener">Buy Tickets</a>'
            : '';
        echo '<div class="mrow mrow-res reveal">'
            . '<div class="mdate"><div class="d">' . date('d', $rd) . '</div><div class="m">' . date('M', $rd) . '</div><div class="day">' . date('D', $rd) . '</div></div>'
            . '<div class="mteams">'
            . '<span class="mt' . ($home ? ' is-own' : '') . '">' . ($home ? cc25_own_crest(34) : $oc) . '<span class="nm">' . esc_html($home ? 'Cwmbran Celtic' : $opp) . '</span></span>'
            . '<span class="mvs">vs</span>'
            . '<span class="mt right' . ($home ? '' : ' is-own') . '">' . ($home ? $oc : cc25_own_crest(34)) . '<span class="nm">' . esc_html($home ? $opp : 'Cwmbran Celtic') . '</span></span>'
            . '</div>'
            . '<div class="mmeta"><div class="comp">' . esc_html($comp) . '</div><span class="ha ' . ($home ? 'h' : 'a') . '">' . ($home ? 'Home' : 'Away') . '</span>' . $tix . '</div>'
            . '</div>';
    }
}

function cc25_team_items($list, $team) {
    if (!is_array($list)) return array();
    return array_values(array_filter($list, function ($x) use ($team) {
        return (isset($x['team']) ? $x['team'] : 'mens') === $team;
    }));
}

/** Upcoming fixtures (future first); if none are future, soonest available. */
function cc25_upcoming($feed, $team = 'mens', $n = 5) {
    $fx = cc25_team_items($feed['fixtures'] ?? array(), $team);
    $now = round(microtime(true) * 1000);
    $future = array_values(array_filter($fx, function ($f) use ($now) {
        return isset($f['date']) && $f['date'] >= $now;
    }));
    $use = $future ? $future : $fx;
    usort($use, function ($a, $b) { return ($a['date'] ?? 0) <=> ($b['date'] ?? 0); });
    return array_slice($use, 0, $n);
}

function cc25_next_fixture($feed, $team = 'mens') {
    $up = cc25_upcoming($feed, $team, 1);
    return $up ? $up[0] : null;
}

/** The next upcoming HOME fixture (homeAway 'H'), or null. Powers the homepage takeover. */
function cc25_next_home_fixture($feed, $team = 'mens') {
    foreach (cc25_upcoming($feed, $team, 20) as $f) {
        if (($f['homeAway'] ?? 'H') === 'H') return $f;
    }
    return null;
}

/* -------------------------------------------------------------------------
 * Kick-off times. allwalessport does NOT publish kick-off times, so feed dates
 * default to midday — which made the countdown wrong. Resolve a real kick-off:
 * a per-date override the club has set, else a sensible default by day of week.
 * All times are UK local (Europe/London).
 *
 * >>> To set a kick-off, add a line to the map below: 'YYYY-MM-DD' => 'HH:MM'.
 * ---------------------------------------------------------------------- */
function cc25_kickoff_overrides() {
    return array(
        '2026-07-28' => '19:00',  // Cwmbran Town derby (Tue) — 7pm KO
    );
}
/** Default kick-off by ISO day-of-week (1=Mon .. 7=Sun). */
function cc25_kickoff_default($dow) {
    if ($dow == 6) return '14:30';  // Saturday
    if ($dow == 7) return '14:00';  // Sunday
    return '19:30';                 // midweek
}
/** Resolved kick-off timestamp (ms) — keeps the match date, sets the real time. */
function cc25_kickoff_ms($f) {
    $ms = intval(is_array($f) ? ($f['date'] ?? 0) : 0);
    if (!$ms) return 0;
    $tz = function_exists('wp_timezone') ? wp_timezone() : new DateTimeZone('Europe/London');
    $day = (new DateTime('@' . intval($ms / 1000)))->setTimezone($tz);
    $ymd = $day->format('Y-m-d');
    $ov = cc25_kickoff_overrides();
    $ko = isset($ov[$ymd]) ? $ov[$ymd] : cc25_kickoff_default((int) $day->format('N'));
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
function cc25_opponent($f) {
    $home = ($f['homeAway'] ?? 'H') === 'H';
    return array(
        'opponent' => $home ? ($f['awayTeam'] ?? '') : ($f['homeTeam'] ?? ''),
        'home'     => $home,
    );
}

function cc25_date($ms, $fmt = 'D j M') {
    return date_i18n($fmt, (int) round(((int) $ms) / 1000));
}

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

/** Match-ticker items: recent results + upcoming fixtures (both teams) with M/W badges. */
function cc25_ticker_items() {
    $feed = cc25_feed();
    $out = '';
    // Recent results (both teams).
    $rs = (isset($feed['results']) && is_array($feed['results'])) ? $feed['results'] : array();
    usort($rs, function ($a, $b) { return ($b['date'] ?? 0) <=> ($a['date'] ?? 0); });
    foreach (array_slice($rs, 0, 4) as $r) {
        $badge = (($r['team'] ?? 'mens') === 'ladies') ? array('W', 'tk-team-w') : array('M', 'tk-team-m');
        $ro = cc25_opponent($r);
        $home = ($r['homeAway'] ?? 'H') === 'H';
        $cc = intval($home ? ($r['homeScore'] ?? 0) : ($r['awayScore'] ?? 0));
        $op = intval($home ? ($r['awayScore'] ?? 0) : ($r['homeScore'] ?? 0));
        $wdl = $cc > $op ? 'w' : ($cc < $op ? 'l' : 'd');
        $out .= '<span class="tk-item"><em class="tk-team ' . $badge[1] . '" title="' . ($badge[0] === 'W' ? "Women's" : "Men's") . '">' . $badge[0] . '</em><b class="tk-' . $wdl . '">FT</b> Cwmbran Celtic ' . $cc . '&ndash;' . $op . ' ' . esc_html($ro['opponent']) . '</span>';
    }
    // Upcoming fixtures (both teams).
    $fx = (isset($feed['fixtures']) && is_array($feed['fixtures'])) ? $feed['fixtures'] : array();
    $now = round(microtime(true) * 1000);
    $up = array_values(array_filter($fx, function ($f) use ($now) { return isset($f['date']) && $f['date'] >= $now; }));
    usort($up, function ($a, $b) { return ($a['date'] ?? 0) <=> ($b['date'] ?? 0); });
    foreach (array_slice($up, 0, 8) as $f) {
        $badge = (($f['team'] ?? 'mens') === 'ladies') ? array('W', 'tk-team-w') : array('M', 'tk-team-m');
        $fo = cc25_opponent($f);
        $match = $fo['home']
            ? 'Cwmbran Celtic v ' . esc_html($fo['opponent'])
            : esc_html($fo['opponent']) . ' v Cwmbran Celtic';
        $out .= '<span class="tk-item"><em class="tk-team ' . $badge[1] . '" title="' . ($badge[0] === 'W' ? "Women's" : "Men's") . '">' . $badge[0] . '</em><b class="tk-date">' . esc_html(cc25_date($f['date'] ?? 0, 'D j M')) . '</b> ' . $match . ' <em class="tk-ha">' . ($fo['home'] ? 'H' : 'A') . '</em></span>';
    }
    return $out;
}
