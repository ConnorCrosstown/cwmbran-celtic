<?php
/**
 * Cwmbran Celtic 2025 — child theme of Divi.
 * Round 1: foundation (premium CSS + fonts + JS) and the homepage (front-page.php).
 */
if (!defined('ABSPATH')) exit;

/* Self-service admin: hardening, and the content the club maintains itself.
   Split out of this file, which is long enough already. */
// __DIR__, not get_stylesheet_directory(): this file knows where it lives, and
// the CLI tests load it without WordPress present.
foreach (array('hardening', 'bond-draws', 'fixtures', 'match-reports', 'comet') as $cc25_mod) {
    $cc25_f = __DIR__ . '/inc/' . $cc25_mod . '.php';
    if (file_exists($cc25_f)) require_once $cc25_f;
}

add_action('wp_enqueue_scripts', function () {
    // Version by file mtime so edits auto-bust the browser/CDN cache (was pinned
    // to a hardcoded version, so changes never reached returning visitors).
    $dir  = get_stylesheet_directory();
    $cssv = @filemtime($dir . '/style.css') ?: '0.1.0';
    $jsv  = @filemtime($dir . '/assets/premium.js') ?: '0.1.0';
    wp_enqueue_style('cc25', get_stylesheet_uri(), array(), $cssv);
    wp_enqueue_script('cc25-js', get_stylesheet_directory_uri() . '/assets/premium.js', array(), $jsv, true);

    // Bespoke templates render their own full premium design, so drop Divi's
    // assets on them to stop it fighting + shed unused render-blocking weight.
    // Regular pages (which may hold Divi-built content) keep Divi's styles.
    $bespoke = is_front_page() || is_singular('post') || is_home() || is_archive()
        || is_search() || is_page_template('template-fixtures.php')
        || is_page_template('template-kit-launch.php') || is_page_template('template-match-report.php');
    if ($bespoke) {
        foreach (array('divi-style', 'et-builder-modules-style', 'et-builder-modules-global-animations',
                       'et-shortcodes-css', 'et-shortcodes-responsive-css', 'magnific-popup',
                       'et-gb-fonts', 'divi-fonts') as $h) {
            wp_dequeue_style($h);   // no-op if the handle isn't present
        }
        foreach (array('divi-custom-script', 'et-builder-modules-script', 'et-jquery-fitvids',
                       'magnific-popup', 'fitvids') as $h) {
            wp_dequeue_script($h);
        }
    }

    // The programme reader pulls in PDF.js, which is far too heavy to ship
    // site-wide — so it loads only on a programme that actually has a PDF.
    if (is_singular('post') && cc25_is_programme_post(get_queried_object())) {
        $rv = @filemtime($dir . '/assets/programme-reader.mjs') ?: '0.1.0';
        wp_enqueue_script('cc25-programme-reader', get_stylesheet_directory_uri() . '/assets/programme-reader.mjs', array(), $rv, true);
    }
}, 99);

/** PDF.js 6 ships ESM only, so the reader has to load as a module. */
add_filter('script_loader_tag', function ($tag, $handle) {
    if ($handle !== 'cc25-programme-reader') return $tag;
    return str_replace('<script ', '<script type="module" ', $tag);
}, 10, 2);

/** Preload the fonts + (on the homepage) the hero LCP image, so they aren't
 * discovered late after CSS parses. */
add_action('wp_head', function () {
    $u = get_stylesheet_directory_uri();
    echo "\n<link rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin href=\"" . esc_url($u . '/assets/fonts/oswald.woff2') . "\">";
    echo "\n<link rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin href=\"" . esc_url($u . '/assets/fonts/inter.woff2') . "\">";
    if (is_front_page()) {
        echo "\n<link rel=\"preload\" as=\"image\" fetchpriority=\"high\" href=\"" . esc_url($u . '/assets/img/hero.jpg') . "\">";
    }
    echo "\n";
}, 1);

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
            'mens-vets'                  => 'template-vets.php',
            'vets'                       => 'template-vets.php',
            'juniors'                    => 'template-juniors.php',
            'juniors-and-minis'          => 'template-juniors.php',
            'minis'                      => 'template-juniors.php',
            'walking-football'           => 'template-walking-football.php',
            'cwmbran-walking-football-2' => 'template-walking-football.php',
            'walking'                    => 'template-walking-football.php',
            'ladies-team'                => 'template-women-cards.php',
            'ladies-1st-team'            => 'template-women-cards.php',
            'sponsors-2'                 => 'template-sponsors.php',
            'sponsors'                   => 'template-sponsors.php',
            'sponsorship-opportunities'  => 'template-sponsorship.php',
            'sponsorship'                => 'template-sponsorship.php',
            'travel-and-ground'          => 'template-travel.php',
            'travel-ground'              => 'template-travel.php',
            'getting-here'               => 'template-travel.php',
            'away-days'                  => 'template-away-days.php',
            '2025-26-archive'            => 'template-results-archive.php',
            '2025-26-results'            => 'template-results-archive.php',
            'match-report'               => 'template-match-report.php',
            'music-shirts'               => 'template-kit-launch.php',
            'kit'                        => 'template-kit-launch.php',
            'shop'                       => 'template-shop.php',
            'club-shop'                  => 'template-shop.php',
            'kit'                        => 'template-shop.php',
            'the-celtic-bond'            => 'template-bond.php',
            'celtic-bond'                => 'template-bond.php',
            'bond'                       => 'template-bond.php',
            'cwmbran-celtic-fc-match-day-programme-digital' => 'template-programmes.php',
            'match-day-programme'        => 'template-programmes.php',
            'programmes'                 => 'template-programmes.php',
        );
        if (isset($map[$slug])) {
            $found = locate_template($map[$slug]);
            if ($found) return $found;
        }
    }
    return $template;
}, 9999);

/**
 * Auto-create the WordPress pages our custom templates need, so Connor never has
 * to add them by hand in wp-admin. The template_include map (above) applies the
 * right template by slug automatically, so an empty published page is enough.
 * Runs on theme activation and once after each theme upload (version-guarded).
 */
function cc25_ensure_pages() {
    $pages = array(
        'travel-and-ground' => 'Travel & Ground',
        'mens-reserves'     => "Men's Reserves",
        'mens-vets'         => "Men's Vets",
        'juniors'           => 'Juniors & Minis',
        'away-days'         => 'Away Days',
        '2025-26-archive'   => '2025-26 Season',
        'match-report'      => 'Match Report',
        'music-shirts'      => 'Music Shirts',
    );
    // Walking Football: the live site may already have this page under the
    // legacy slug, so only provision when none of the known variants exist.
    $wf_exists = false;
    foreach (cc25_slug_candidates('walking-football') as $wf_slug) {
        if (get_page_by_path($wf_slug)) { $wf_exists = true; break; }
    }
    if (!$wf_exists) $pages['walking-football'] = 'Walking Football';
    foreach ($pages as $slug => $title) {
        if (get_page_by_path($slug)) continue;
        wp_insert_post(array(
            'post_title'  => $title,
            'post_name'   => $slug,
            'post_status' => 'publish',
            'post_type'   => 'page',
            'post_content' => '',
        ));
    }
}
add_action('after_switch_theme', 'cc25_ensure_pages');
add_action('admin_init', function () {
    // Version-stamped so a new page in cc25_ensure_pages() gets created on the
    // next admin load of an already-installed theme. Bump when adding a page.
    $ver = '2026-08-03-walking-football';
    if (get_option('cc25_pages_provisioned') === $ver) return;
    cc25_ensure_pages();
    update_option('cc25_pages_provisioned', $ver);
});

/** Reserves destination: the dedicated /mens-reserves/ page if it exists, else
 * straight to the Reserves fixtures tab (works with no WP page needed). */
function cc25_reserves_url() {
    $p = cc25_page_url('mens-reserves', '');
    return $p ? $p : (cc25_page_url('fixtures', home_url('/')) . '#reserves');
}

/** Men's Vets destination: the dedicated /mens-vets/ page if it exists, else
 * the teams hub (the page is auto-provisioned, so it normally resolves). */
function cc25_vets_url() {
    $p = cc25_page_url(array('mens-vets', 'vets'), '');
    return $p ? $p : cc25_page_url('teams', home_url('/'));
}

/** Juniors & Minis destination: the dedicated /juniors/ page if it exists. */
function cc25_juniors_url() {
    $p = cc25_page_url(array('juniors', 'juniors-and-minis', 'minis'), '');
    return $p ? $p : cc25_page_url('teams', home_url('/'));
}

/** Walking Football destination: the dedicated page if it exists (under any of
 * the known slugs), else the teams hub, so the hub card never dead-links. */
function cc25_walking_football_url() {
    $p = cc25_page_url('walking-football', '');
    return $p ? $p : cc25_page_url('teams', home_url('/'));
}

/** Junior & Mini section age groups with their coach contact(s), in order.
 * Each row: ['label' => age group, 'contacts' => [[name, phone], ...]]. */
function cc25_junior_teams() {
    return array(
        array('label' => "Under 16s",       'contacts' => array(array('Nathan Thomas', '07599 291579'), array('Sarah Gooding', '07749 968287'))),
        array('label' => "Under 15 Girls",  'contacts' => array(array('Mark Millar', '07584 299671'))),
        array('label' => "Under 14",        'contacts' => array(array('Derrie Ormond', '07399 282840'))),
        array('label' => "Under 12 Yellow", 'contacts' => array(array('Jason Austin', '07969 215204'))),
        array('label' => "Under 12 Blue",   'contacts' => array(array('Matt Summers', '07899 113972'))),
        array('label' => "Under 11 Girls",  'contacts' => array(array('Lee Gwilliam', '07817 238884'))),
        array('label' => "Under 10",        'contacts' => array(array('Derrie Ormond', '07399 282840'))),
        array('label' => "Under 9",         'contacts' => array(array('Cleyon Decourte', '07939 431473'))),
    );
}

/**
 * WALKING FOOTBALL — the section runs its own site and keeps it updated, so
 * only slow-changing content lives here. Fixtures, the photo gallery and
 * sponsorship tiers link out (see cc25_wf_links()) rather than being copied.
 *
 * Weekly sessions, in running order.
 * Each row: ['label' => session, 'day' => weekday, 'time' => start].
 * All sessions run at cc25_wf_venue().
 */
function cc25_wf_sessions() {
    return array(
        array('label' => "Men's Under 50s",                'day' => 'Thursday',  'time' => '7:00pm'),
        array('label' => "Men's Over 50s",                 'day' => 'Thursday',  'time' => '7:00pm'),
        array('label' => "Men's Over 60s",                 'day' => 'Thursday',  'time' => '7:00pm'),
        array('label' => "Men's Social",                   'day' => 'Wednesday', 'time' => '4:00pm'),
        array('label' => "Women's Competitive (Over 35s)", 'day' => 'Friday',    'time' => '6:00pm'),
        array('label' => "Women's Social (all ages)",      'day' => 'Friday',    'time' => '6:00pm'),
        array('label' => "Mixed (all ages)",               'day' => 'Sunday',    'time' => '9:00am'),
    );
}

/** Where every Walking Football session is played. */
function cc25_wf_venue() {
    return array(
        'name'    => 'Llantarnam Community Primary School',
        'address' => 'James Prosser Way, Llantarnam, Cwmbran, NP44 3XB',
        'map'     => 'https://www.google.com/maps/search/?api=1&query=Llantarnam+Community+Primary+School+NP44+3XB',
    );
}

/** Monthly subscriptions. 'bond' marks the row that links to the Celtic Bond. */
function cc25_wf_prices() {
    return array(
        array('label' => 'Social',      'price' => '£6',  'note' => 'Social sessions.',                  'bond' => false),
        array('label' => 'Competitive', 'price' => '£10', 'note' => 'Competitive squads.',               'bond' => false),
        array('label' => 'Celtic Bond', 'price' => '£10', 'note' => 'All players — the club\'s draw.',   'bond' => true),
    );
}

/** The section's story so far. Each row: ['when' => date, 'what' => milestone]. */
function cc25_wf_timeline() {
    return array(
        array('when' => 'January 2024',   'what' => 'A small group of men decide it is time to bring football back into their lives.'),
        array('when' => 'April 2024',     'what' => "A women's group launches and the community grows."),
        array('when' => 'June 2024',      'what' => "The women's team play their first friendly, against Caldicot."),
        array('when' => 'September 2024', 'what' => 'A first Fun Day celebrates walking football, friendship and community.'),
        array('when' => 'September 2024', 'what' => "The women's team join their first competitive league."),
        array('when' => 'November 2024',  'what' => 'Sponsorship and grants bring tracksuits and training kit.'),
        array('when' => 'March 2025',     'what' => "A men's 50s walking football team is formed."),
        array('when' => 'April 2025',     'what' => 'First anniversary — 100 members.'),
        array('when' => 'May 2025',       'what' => "The women's team win their first league campaign."),
        array('when' => 'August 2025',    'what' => 'The section hosts its first tournament — 300 players.'),
        array('when' => 'September 2025', 'what' => 'A first social mixed tournament, for players outside the leagues.'),
        array('when' => 'Nov–Dec 2025',   'what' => 'A tri-national tournament brings together Wales, Ireland and England.'),
    );
}

/**
 * Every outbound Walking Football destination in one place, so a domain move is
 * a single edit. NOTE: their pages print the address with "club" in it, but the
 * site only resolves without it.
 */
function cc25_wf_links() {
    $site = 'https://cwmbrancelticwalkingfootball.co.uk';
    return array(
        'site'        => $site . '/',
        'sessions'    => $site . '/session-times',
        'story'       => $site . '/community-%26-club-story',
        'inclusion'   => $site . '/social-inclusion',
        'sponsorship' => $site . '/sponsorship',
        'gallery'     => $site . '/photo-gallery',
        'contact'     => $site . '/contact-us',
        'facebook'    => 'https://www.facebook.com/p/Cwmbran-Celtic-Walking-Football-Club-61573941128119/',
        // 07919 323520 in international form, as wa.me requires.
        'whatsapp'    => 'https://wa.me/447919323520',
        'phone'       => '07919 323520',
    );
}

/** Real slug variants (confirmed from the live site) so links resolve to the club's pages. */
function cc25_slug_candidates($key) {
    $map = array(
        'fixtures'         => array('fixtures', 'fixtures-results', 'fixtures-and-results'),
        'sponsors'         => array('sponsors-2', 'sponsors', 'our-sponsors'),
        'news'             => array('news', 'latest-news', 'club-news'),
        'contact'          => array('contact', 'contact-us'),
        'shop'             => array('shop', 'club-shop', 'kit'),
        'celtic-bond'      => array('the-celtic-bond', 'celtic-bond', 'bond'),
        'bond-results'     => array('the-celtic-bond-results', 'celtic-bond-results', 'bond-results'),
        'teams'            => array('teams', 'all-teams'),
        'mens'             => array('mens-team', 'mens-1st-team'),
        'ladies'           => array('ladies-team', 'ladies-1st-team'),
        'club'             => array('club-history', 'club', 'the-club', 'about'),
        'walking-football' => array('cwmbran-walking-football-2', 'walking-football', 'walking'),
        'hospitality'      => array('hospitality', 'matchday-hospitality'),
        'sponsorship'      => array('sponsorship-opportunities', 'sponsorship', 'sponsors-2'),
        'travel'           => array('travel-and-ground', 'travel-ground', 'getting-here', 'travel', 'matchday'),
    );
    return isset($map[$key]) ? $map[$key] : array($key);
}

/* -------------------------------------------------------------------------
 * Club shop.
 *
 * Tor Sports takes the orders — stock, sizes and payment are theirs. This is a
 * shop FRONT: it does the selling Tor's category pages can't, then hands over.
 *
 * Deliberately NOT a full product listing. The two ranges carry 36 items
 * between them, and every price hardcoded here is a price going stale — a wrong
 * one on the club's own site is a complaint waiting to happen. So: three range
 * panels, plus a short curated strip of things worth pushing. Keep the strip
 * small enough to actually maintain.
 *
 * >>> Prices last checked against tor-sports.co.uk on 8 August 2026.
 * ---------------------------------------------------------------------- */

/** The three ranges, in the order they should sell. */
function cc25_shop_ranges() {
    $base = 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc/';
    return array(
        array(
            'key'   => 'shirts',
            'eye'   => 'Four bands. One club.',
            'name'  => 'Music Shirts',
            'blurb' => 'Super Furry Animals, Mogwai, Panic Shack and Loose Articles on the front of a Cwmbran Celtic shirt — with 10% of every one going to Music Venue Trust.',
            'meta'  => 'Match shirts · 2026/27',
            'url'   => cc25_page_url('music-shirts', home_url('/')),
            'cta'   => 'Read the story',
            'shop'  => $base . 'cwmbran-celtic-fc-match-shirts',
            'img'   => 'kit/kit-sfa.jpg',
            'tone'  => 'gold',
        ),
        array(
            'key'   => 'seniors',
            'eye'   => 'Wear it anywhere',
            'name'  => 'Seniors Range',
            'blurb' => 'Training and leisurewear in club blue and navy — quarter-zips, hoodies, mid-layers, polos and tees, plus bags and caps.',
            'meta'  => '18 items · from £12',
            'url'   => $base . 'cwmbran-celtic-fc-seniors',
            'cta'   => 'Shop seniors',
            'shop'  => '',
            'img'   => 'shop/blue-hoodie.jpg',
            'tone'  => 'blue',
        ),
        array(
            'key'   => 'juniors',
            'eye'   => 'Under 9 to Under 16',
            'name'  => 'Juniors Range',
            'blurb' => 'The same kit sized for the minis and juniors — quarter-zips, hoodies, polos, training shorts, tracksuit bottoms and windbreakers.',
            'meta'  => '18 items · from £15',
            'url'   => $base . 'cwmbran-celtic-fc-juniors',
            'cta'   => 'Shop juniors',
            'shop'  => '',
            'img'   => 'shop/junior-navy-hoodie.jpg',
            'tone'  => 'navy',
        ),
    );
}

/** A short curated strip — the things worth pushing, not the whole catalogue. */
function cc25_shop_featured() {
    $s = 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc/cwmbran-celtic-fc-seniors/';
    $j = 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc/cwmbran-celtic-fc-juniors/';
    return array(
        array('name' => 'Gilet',                  'range' => 'Seniors', 'price' => '£50', 'was' => '', 'img' => 'gilet.jpg',              'url' => $s . 'cwmbran-celtic-fc-gilet'),
        array('name' => 'Blue Full-Zip Hoodie',   'range' => 'Seniors', 'price' => '£38', 'was' => '', 'img' => 'blue-hoodie.jpg',        'url' => $s . 'cwmbran-celtic-fc-blue-full-zip-hoodie'),
        array('name' => 'Navy 1/4 Zip',           'range' => 'Seniors', 'price' => '£31', 'was' => '', 'img' => 'navy-quarter-zip.jpg',   'url' => $s . 'cwmbran-celtic-fc-navy-14-zip'),
        array('name' => 'Backpack',               'range' => 'Seniors', 'price' => '£28', 'was' => '', 'img' => 'backpack.jpg',           'url' => $s . 'cwmbran-celtic-fc-backpack'),
        array('name' => 'Junior Navy Hoodie',     'range' => 'Juniors', 'price' => '£22.40', 'was' => '£32', 'img' => 'junior-navy-hoodie.jpg', 'url' => $j . 'cwmbran-celtic-fc-junior-navy-full-zip-hoodie'),
        array('name' => 'Essential Yellow Tee',   'range' => 'Seniors', 'price' => '£20', 'was' => '', 'img' => 'yellow-tee.jpg',         'url' => $s . 'cwmbran-celtic-fc-essential-yellow-tee'),
        array('name' => 'Junior Blue Polo',       'range' => 'Juniors', 'price' => '£16', 'was' => '', 'img' => 'junior-blue-polo.jpg',   'url' => $j . 'cwmbran-celtic-fc-junior-blue-polo-shirt'),
        array('name' => 'Cap',                    'range' => 'Seniors', 'price' => '£12', 'was' => '', 'img' => 'cap.jpg',                'url' => $s . 'cwmbran-celtic-fc-cap'),
    );
}

/** External destinations (ticketing / shop) — not WordPress pages. */
function cc25_ext_url($key) {
    $map = array(
        'tickets' => 'https://cwmbranceltic.gigantic.com/promoter/cwmbran-celtic-fc',
        'shop'    => 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc',
    );
    return isset($map[$key]) ? $map[$key] : '#';
}

/**
 * Celebrate a recent result with a fireworks takeover on the home page. OFF by
 * default, and it should stay that way unless a result is worth shouting about:
 * it outranks the next-home-game takeover and fires on EVERY visit until it is
 * cleared again, so a result left in here goes stale in public and buries the
 * fixture. Nothing clears it automatically — the club does, by hand.
 *
 * >>> To celebrate a result, return it — 'us' = Cwmbran Celtic's goals:
 *       return array('opponent' => 'Cwmbran Town', 'us' => 3, 'them' => 0);
 * >>> To clear it (within a few days of the game), restore `return null;`.
 */
function cc25_result_celebration() {
    return null;
}

/** Season-ticket sales window. false once the season is under way (hides all
 * "Season Ticket" buttons); flip to true pre-season to bring them back. */
function cc25_season_tickets_on() { return false; }

/**
 * MUSIC SHIRTS launch (2026/27 kit reveal). Drives the launch splash, the
 * news article at /music-shirts/, and the home-page feature banner.
 *   'enabled'   — master on/off. Set false to retire the whole campaign.
 *   'live_from' — embargo: the splash + home banner appear only from this UK
 *                 time (article page can exist unlinked before then). Blank =
 *                 show immediately.
 */
function cc25_kit_launch() {
    return array(
        'enabled'     => true,                // LIVE — splash/banner/nav appear at live_from (UK time).
        'live_from'   => '2026-07-31 12:00',  // Friday 31 July 2026, 12:00 noon UK.
        'slug'        => 'music-shirts',
        'eyebrow'     => 'Music Shirts · 2026/27',
        'headline'    => 'Four bands. One club. Grassroots music and sport together.',
        'dek'         => "Super Furry Animals, Mogwai, Panic Shack and Loose Articles become shirt sponsors for the Celts — with 10% of every shirt going to Music Venue Trust.",
        'date'        => '2026-07-30',
        'shop_url'    => 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc/cwmbran-celtic-fc-match-shirts',
        'tickets_url' => cc25_ext_url('tickets'),
        'mvt_url'     => 'https://www.musicvenuetrust.com',
        // The four shirts, SFA first (the focus). img = file in assets/img/kit/.
        // img = the card render (full kit). front/back = high-res product shots shown in the click-to-enlarge lightbox.
        'shirts'      => array(
            array('band' => 'Super Furry Animals', 'img' => 'kit-sfa.jpg',   'front' => 'hr-sfa-front.png',    'back' => 'hr-sfa-back.png',    'label' => "Men's Home",   'origin' => 'Cardiff · Welsh legends',
                  'blurb' => "One of Wales' most celebrated and inventive bands lead the line on our men's home shirt — no strangers to a football kit, having graced an iconic Cardiff City shirt back in 1999."),
            array('band' => 'Mogwai',              'img' => 'kit-away.jpg',   'front' => 'hr-mogwai-front.png', 'back' => 'hr-mogwai-back.png', 'label' => "Men's Away",   'origin' => 'Glasgow post-rock',
                  'blurb' => "Glasgow post-rock institution and lifelong Celtic fans, Mogwai take pride of place on our men's away shirt — the green-and-white hoops they grew up with."),
            array('band' => 'Panic Shack',         'img' => 'kit-home.jpg',   'front' => 'hr-panic-front.png',  'back' => 'hr-panic-back.png',  'label' => "Women's Home", 'origin' => 'Cardiff punk',
                  'blurb' => "Cardiff punk favourites Panic Shack front our women's home shirt — one of the sharpest, funniest new voices in Welsh guitar music."),
            array('band' => 'Loose Articles',      'img' => 'kit-third.jpg',  'front' => 'hr-loose-front.png',  'back' => 'hr-loose-back.png',  'label' => "Women's Away", 'origin' => 'Manchester punk',
                  'blurb' => "Manchester punks Loose Articles lead our women's away shirt — all wit, attitude and energy, and proper football fans (their drummer's mum lives in Cwmbran!)."),
        ),
        // Goalkeeper kits — one per band. img = file in assets/img/kit/.
        // Set keepers_soon => false once the GK kits are ready to pre-order.
        'keepers_soon' => true,
        'keepers'     => array(
            array('band' => 'Super Furry Animals', 'img' => 'gk-sfa.jpg',    'label' => 'Goalkeeper', 'origin' => 'Pink · Cardiff'),
            array('band' => 'Loose Articles',      'img' => 'gk-loose.jpg',  'label' => 'Goalkeeper', 'origin' => 'Grey · Manchester'),
            array('band' => 'Panic Shack',         'img' => 'gk-panic.jpg',  'label' => 'Goalkeeper', 'origin' => 'Pink & purple · Cardiff'),
            array('band' => 'Mogwai',              'img' => 'gk-mogwai.jpg', 'label' => 'Goalkeeper', 'origin' => 'Grey · Glasgow'),
        ),
        // Matchday photos of the Music Shirts in action (files in assets/img/kit/):
        // men's SFA celebration, the women's team in Panic Shack, and fans in SFA.
        'action'      => array('sfa-hero.jpg', 'women-panic.jpg', 'fans-sfa.jpg'),
        // Featured sponsors — using the club's standard banners (assets/img/sponsor-banners/).
        'sponsors'    => array(
            array('name' => 'Diverse Vinyl',      'img' => 'diverse-vinyl.jpg',      'url' => 'https://www.diversevinyl.com',      'desc' => 'Independent record shop · Newport'),
            array('name' => 'Crosstown Concerts', 'img' => 'crosstown-concerts.jpg', 'url' => 'https://www.crosstownconcerts.com',  'desc' => 'Live music promoter'),
            array('name' => 'Le Pub',             'img' => 'le-pub.jpg',             'url' => 'https://www.lepublicspace.co.uk',   'desc' => 'Grassroots music venue · Newport'),
            array('name' => 'Gigantic',           'img' => 'gigantic.jpg',           'url' => 'https://www.gigantic.com',          'desc' => 'Independent ticketing'),
        ),
        'bands' => array(
            array('n' => 'Super Furry Animals', 'meta' => 'Cardiff · formed 1993',
                  'spotify' => 'https://open.spotify.com/artist/0FOcXqJgJ1oq9XfzYTDZmZ', 'insta' => 'https://www.instagram.com/superfurryanimals/',
                  'd' => "Genre-hopping Welsh icons and one of the most inventive bands Britain has ever produced. Across landmark records like Fuzzy Logic, Radiator and Guerrilla — and the all-Welsh Mwng — they fused psychedelia, pop and electronica with fearless imagination. No strangers to football, either, having famously appeared on a Cardiff City shirt back in 1999."),
            array('n' => 'Mogwai', 'meta' => 'Glasgow · formed 1995',
                  'spotify' => 'https://open.spotify.com/artist/34UhPkLbtFKRq3nmfFgejG', 'insta' => 'https://www.instagram.com/mogwaiband/',
                  'd' => "Scotland's post-rock giants have spent three decades turning quiet-loud dynamics into something monumental — sweeping, largely instrumental music that scores films and fills halls. In 2021 they landed their first UK #1 album with As the Love Continues. Lifelong Celtic supporters, they leapt at the chance to wear our green-and-white hoops."),
            array('n' => 'Panic Shack', 'meta' => 'Cardiff · formed 2018',
                  'spotify' => 'https://open.spotify.com/artist/26HCuM5PamldoaHII5Ifxc', 'insta' => 'https://www.instagram.com/panicshack/',
                  'd' => "One of the sharpest and funniest new voices in Welsh guitar music. Panic Shack's whip-smart, riotous live shows have made them festival favourites and a driving force in the new wave of bands flying the flag for the Welsh scene."),
            array('n' => 'Loose Articles', 'meta' => 'Manchester · formed 2019',
                  'spotify' => 'https://open.spotify.com/artist/07NWIkIKcZnWWmebfHcOxT', 'insta' => 'https://www.instagram.com/loosearticles/',
                  'd' => "Wit, attitude and pure energy — Loose Articles make punk with a grin and choruses you'll be chanting for days. Proper football fans too: their drummer's mum lives in Cwmbran, making them an unlikely but perfect fit for the Celts."),
        ),
        'quotes' => array(
            array(
                'by'   => 'Matt Jarrett',
                'role' => 'Joint Commercial Manager, Cwmbran Celtic FC',
                'text' => "Myself and fellow Commercial Manager Connor Cupples both come from music backgrounds. I co-own a record shop in Newport and Connor promotes shows across the country. Both of us have put on numerous gigs in grassroots venues, and it was obvious there were massive similarities across the two worlds. It seemed a no-brainer to link the two — and luckily, the bands all embraced the idea and gave it their blessing!",
            ),
            array(
                'by'   => 'Connor Cupples',
                'role' => 'Joint Commercial Manager, Cwmbran Celtic FC',
                'text' => "Grassroots football and grassroots music venues are fighting the same fight. They're where it all starts, they run on passion and tight budgets, and when one disappears a community loses something it can't easily get back. To have four bands of this calibre on our shirts — and to send a share of every sale to Music Venue Trust — means this kit stands for far more than a season of football. It's two grassroots worlds looking out for each other.",
            ),
        ),
    );
}

/** Launch epoch (Unix seconds, UK time) or 0 if no embargo set. */
function cc25_kit_launch_ts() {
    $k = cc25_kit_launch();
    return empty($k['live_from']) ? 0 : strtotime($k['live_from'] . ' Europe/London');
}

/** True when the Music Shirts splash + home banner should be shown (enabled
 * and past the embargo time, in UK time). */
function cc25_kit_launch_live() {
    $k = cc25_kit_launch();
    if (empty($k['enabled'])) return false;
    if (empty($k['live_from'])) return true;
    return time() >= cc25_kit_launch_ts();
}

/** True during the pre-launch window: enabled, an embargo is set, and we're
 * still before it — so the homepage shows the countdown teaser splash. */
function cc25_kit_launch_countdown() {
    $k = cc25_kit_launch();
    if (empty($k['enabled'])) return false;
    $ts = cc25_kit_launch_ts();
    return $ts > 0 && time() < $ts;
}

/* ============================================================
 * Live view counter (per page). Counts client-side via a beacon so it works
 * even when pages are served from cache. Combined live dashboard at:
 *   /?stats=<key>   or   /music-shirts/?stats=<key>
 * ============================================================ */

/** Secret key guarding the stats dashboard + data endpoints. */
function cc25_ms_stats_key() { return 'ms-live-7q2xk9'; }

/** Pages we track: tracking-slug => label. */
function cc25_view_pages() {
    return array(
        'home'         => 'Home page',
        'music-shirts' => 'Music Shirts',
    );
}

/** Tracking slug for the page being viewed, or '' if it isn't tracked. */
function cc25_view_slug() {
    if (is_front_page() || is_home()) return 'home';
    if (is_page() && get_post_field('post_name', get_queried_object_id()) === 'music-shirts') return 'music-shirts';
    return '';
}

/** Record one view for a page (all-time total + a 24h rolling log). */
function cc25_view_log($page) {
    $pages = cc25_view_pages();
    if (!isset($pages[$page])) return;
    update_option("cc25_views_{$page}_total", ((int) get_option("cc25_views_{$page}_total", 0)) + 1, false);
    $recent = get_option("cc25_views_{$page}_recent", array());
    if (!is_array($recent)) $recent = array();
    $recent[] = time();
    $cut = time() - 86400;
    $recent = array_values(array_filter($recent, function ($t) use ($cut) { return (int) $t >= $cut; }));
    if (count($recent) > 6000) $recent = array_slice($recent, -6000);
    update_option("cc25_views_{$page}_recent", $recent, false);
}

/** Baseline views added to a page's all-time TOTAL — e.g. views that happened
 * before this tracker was installed (pull from Cloudflare / host stats). Only
 * the TOTAL is affected; the live 24h/hour/5min figures stay real. */
function cc25_view_seed($page) {
    $seed = array(
        'home'         => 0,
        'music-shirts' => 75, // pre-tracker views (from host/Cloudflare stats)
    );
    return isset($seed[$page]) ? (int) $seed[$page] : 0;
}

/** Live stats for one page. */
function cc25_view_stats($page) {
    $now = time();
    $recent = get_option("cc25_views_{$page}_recent", array());
    if (!is_array($recent)) $recent = array();
    $since = function ($sec) use ($recent, $now) { $c = 0; foreach ($recent as $t) { if ((int) $t >= $now - $sec) $c++; } return $c; };
    return array(
        'total' => cc25_view_seed($page) + (int) get_option("cc25_views_{$page}_total", 0),
        'day'   => $since(86400),
        'hour'  => $since(3600),
        'five'  => $since(300),
        'one'   => $since(60),
    );
}

/** All tracked pages' stats keyed by slug (each includes its label). */
function cc25_view_stats_all() {
    $out = array();
    foreach (cc25_view_pages() as $slug => $label) {
        $out[$slug] = array('label' => $label) + cc25_view_stats($slug);
    }
    return $out;
}

/** Beacon: on any tracked page (and not a logged-in admin), ping the hit
 * endpoint on load. It's baked into the cached HTML, so cached views count. */
add_action('wp_footer', function () {
    $slug = cc25_view_slug();
    if (!$slug) return;
    if (is_user_logged_in() && current_user_can('manage_options')) return;
    echo '<script>(function(){try{fetch(' . wp_json_encode(admin_url('admin-ajax.php')) . '+"?action=cc25_ms_hit&p=' . rawurlencode($slug) . '",{method:"POST",keepalive:true,credentials:"omit"});}catch(e){}})();</script>';
}, 99);

/** admin-ajax: log a view (skips obvious bots). Not page-cached. */
add_action('wp_ajax_cc25_ms_hit', 'cc25_ms_hit');
add_action('wp_ajax_nopriv_cc25_ms_hit', 'cc25_ms_hit');
function cc25_ms_hit() {
    $p = isset($_GET['p']) ? preg_replace('/[^a-z0-9\-]/', '', (string) $_GET['p']) : '';
    $ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
    if ($p && !preg_match('/bot|crawl|spider|slurp|facebookexternalhit|headless|preview|monitor|pingdom|uptime/i', $ua)) {
        cc25_view_log($p);
    }
    wp_send_json_success();
}

/** admin-ajax: return live stats for all tracked pages (key-guarded). */
add_action('wp_ajax_cc25_ms_stats', 'cc25_ms_stats_json');
add_action('wp_ajax_nopriv_cc25_ms_stats', 'cc25_ms_stats_json');
function cc25_ms_stats_json() {
    $k = isset($_GET['k']) ? (string) $_GET['k'] : '';
    if (!hash_equals(cc25_ms_stats_key(), $k)) wp_send_json_error(array('e' => 'auth'), 403);
    wp_send_json(cc25_view_stats_all());
}

/** Combined live dashboard, served at /?stats=KEY on any tracked page. */
add_action('template_redirect', function () {
    if (!isset($_GET['stats']) || !hash_equals(cc25_ms_stats_key(), (string) $_GET['stats'])) return;
    if (!cc25_view_slug()) return;
    nocache_headers();
    $all = cc25_view_stats_all();
    header('Content-Type: text/html; charset=utf-8');
    ?><!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Cwmbran Celtic &mdash; Live views</title>
<style>
*{box-sizing:border-box;margin:0}body{background:#0a1424;color:#eaf0fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;min-height:100vh;padding:32px 18px}
.wrap{width:100%;max-width:760px;margin:0 auto;text-align:center}
.eye{color:#f5c518;text-transform:uppercase;letter-spacing:.18em;font-size:.72rem;font-weight:700;margin-bottom:8px}
h1{font-size:clamp(1.7rem,6vw,2.4rem);font-weight:800;margin-bottom:30px;letter-spacing:-.01em}
.pg{margin-bottom:26px}.pg h2{font-size:1.05rem;color:#9fb0d6;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;text-align:left}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.stat{background:#0e1a33;border:1px solid #1e2c4a;border-radius:12px;padding:18px 8px}
.stat.big{background:linear-gradient(150deg,#12203c,#0a1f3c);border-color:#2b3d63}
.stat b{display:block;font-size:clamp(1.4rem,5vw,2.1rem);font-weight:800;line-height:1;font-variant-numeric:tabular-nums;color:#fff}
.stat.big b{color:#f5c518}
.stat span{display:block;margin-top:8px;font-size:.6rem;text-transform:uppercase;letter-spacing:.06em;color:#9fb0d6}
.foot{margin-top:14px;color:#9fb0d6;font-size:.8rem}.pulse{color:#16a34a;animation:p 1.4s infinite}@keyframes p{50%{opacity:.25}}
@media(max-width:540px){.grid{grid-template-columns:repeat(3,1fr)}}
</style></head><body><div class="wrap">
<div class="eye">Cwmbran Celtic &middot; 2026/27</div>
<h1>Live page views</h1>
<?php foreach ($all as $slug => $s): ?>
<section class="pg">
  <h2><?php echo esc_html($s['label']); ?></h2>
  <div class="grid">
    <div class="stat big"><b id="s-<?php echo esc_attr($slug); ?>-total"><?php echo number_format($s['total']); ?></b><span>Total</span></div>
    <div class="stat"><b id="s-<?php echo esc_attr($slug); ?>-day"><?php echo number_format($s['day']); ?></b><span>24 h</span></div>
    <div class="stat"><b id="s-<?php echo esc_attr($slug); ?>-hour"><?php echo number_format($s['hour']); ?></b><span>Hour</span></div>
    <div class="stat"><b id="s-<?php echo esc_attr($slug); ?>-five"><?php echo number_format($s['five']); ?></b><span>5 min</span></div>
    <div class="stat"><b id="s-<?php echo esc_attr($slug); ?>-one"><?php echo number_format($s['one']); ?></b><span>1 min</span></div>
  </div>
</section>
<?php endforeach; ?>
<div class="foot"><span class="pulse">&#9679;</span> live &middot; updates every 5 seconds</div>
</div>
<script>
var AJAX=<?php echo wp_json_encode(admin_url('admin-ajax.php')); ?>,K=<?php echo wp_json_encode(cc25_ms_stats_key()); ?>;
function f(n){return (n||0).toLocaleString();}
function set(slug,d){['total','day','hour','five','one'].forEach(function(k){var el=document.getElementById('s-'+slug+'-'+k);if(el&&d[k]!==undefined)el.textContent=f(d[k]);});}
function poll(){fetch(AJAX+'?action=cc25_ms_stats&k='+encodeURIComponent(K),{credentials:'omit'}).then(function(r){return r.json();}).then(function(all){if(all)for(var slug in all){set(slug,all[slug]);}}).catch(function(){});}
poll();setInterval(poll,5000);
</script></body></html><?php
    exit;
});

/**
 * Opponent grounds in the Ardal League South East (for away-game travel info).
 * Keyed by the opponent name as it appears in the fixture lists.
 * Each: ['ground' => name, 'addr' => full address, 'pc' => postcode].
 */
function cc25_away_grounds() {
    return array(
        'Abercarn United'     => array('ground' => 'Abercarn Welfare',       'addr' => 'Abercarn Welfare, Abercarn, NP11 5AR', 'pc' => 'NP11 5AR'),
        'Abergavenny Town'    => array('ground' => 'Penypound Stadium',      'addr' => 'Penypound Stadium, Penypound, Abergavenny, NP7 7RN', 'pc' => 'NP7 7RN'),
        'Blaenavon Blues'     => array('ground' => 'The Memorial Ground',    'addr' => 'The Memorial Ground, Stable Row, Abergavenny Road, Blaenavon, NP4 9RQ', 'pc' => 'NP4 9RQ'),
        'Brecon Corries'      => array('ground' => 'The Rich Field',         'addr' => 'The Rich Field, Canal Road, Brecon, LD3 7HL', 'pc' => 'LD3 7HL'),
        'Caldicot Town'       => array('ground' => 'Jubilee Way',            'addr' => 'Jubilee Way, Caldicot, NP26 4NA', 'pc' => 'NP26 4NA'),
        'Chepstow Town'       => array('ground' => 'Larkfield Park',         'addr' => 'Larkfield Park, Chepstow, NP16 5PR', 'pc' => 'NP16 5PR'),
        'Croesyceiliog'       => array('ground' => 'Woodland Road',          'addr' => 'Woodland Road, Croesyceiliog, Cwmbran, NP44 2DZ', 'pc' => 'NP44 2DZ'),
        'Cwmbran Town'        => array('ground' => 'Cwmbran Stadium',        'addr' => 'Cwmbran Stadium, Henllys Way, Cwmbran, NP44 3YS', 'pc' => 'NP44 3YS'),
        'Goytre'              => array('ground' => 'Plough Road',            'addr' => 'Plough Road, Penperlleni, Pontypool, NP4 0AL', 'pc' => 'NP4 0AL'),
        'Lliswerry'           => array('ground' => 'Velodrome Way',          'addr' => 'Velodrome Way, Spytty, Newport, NP19 4RB', 'pc' => 'NP19 4RB'),
        'New Inn'             => array('ground' => 'Plough Road',            'addr' => 'Plough Road, Penperlleni, Pontypool, NP4 0AL', 'pc' => 'NP4 0AL'),
        'Newport Corinthians' => array('ground' => 'Coronation Park',        'addr' => 'Coronation Park, Stephenson Street, Newport, NP19 0RB', 'pc' => 'NP19 0RB'),
        'Risca United'        => array('ground' => 'Isaf Road',              'addr' => 'Isaf Road, Risca, NP11 6EG', 'pc' => 'NP11 6EG'),
        'Tredegar Town'       => array('ground' => 'Tredegar Sports Complex', 'addr' => 'Tredegar Sports Complex, Stable Lane, Tredegar, NP22 4BH', 'pc' => 'NP22 4BH'),
        'Undy FC'             => array('ground' => 'The Causeway Stadium',   'addr' => 'The Causeway Stadium, The Causeway, Undy, Caldicot, NP26 3EW', 'pc' => 'NP26 3EW'),
        'Undy'                => array('ground' => 'The Causeway Stadium',   'addr' => 'The Causeway Stadium, The Causeway, Undy, Caldicot, NP26 3EW', 'pc' => 'NP26 3EW'),
    );
}
/** Ground info for an opponent, or null if we don't have it. */
function cc25_ground_of($opponent) {
    $g = cc25_away_grounds();
    if (isset($g[$opponent])) return $g[$opponent];
    foreach ($g as $name => $info) { if (cc25_norm_team($name) === cc25_norm_team($opponent)) return $info; }
    return null;
}
/** Google Maps directions URL to an address string. */
function cc25_dir_url($query) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' . rawurlencode($query);
}
/**
 * Where the "Travel & Ground" link should go for a fixture: our own Travel page
 * for home games; directions to the opponent's ground for away games (falls back
 * to our Travel page if we don't have that ground on file).
 */
function cc25_travel_url($opponent, $home) {
    // Home games -> our Travel & Ground page; away games -> the Away Days hub
    // (grounds, addresses + directions for every away trip).
    return $home ? cc25_page_url('travel', home_url('/')) : cc25_page_url('away-days', home_url('/'));
}
/** Upcoming AWAY fixtures for a team key (mens/reserves/womens). */
function cc25_away_fixtures($team_key) {
    $sf = cc25_static_fixtures();
    if (!isset($sf[$team_key])) return array();
    $now = round(microtime(true) * 1000);
    $out = array();
    foreach ($sf[$team_key]['list'] as $rf) {
        if (!empty($rf[2])) continue;                                    // home — skip
        if (cc25_row_kickoff_ms($rf[0], $rf[1]) + 2 * 3600 * 1000 < $now) continue; // finished — skip
        $out[] = $rf;
    }
    return $out;
}
/** Ground + directions for an away opponent. Uses the Ardal SE address list
 * where we have it; otherwise a Google Maps search for the club (still useful
 * for Reserves/Women's opponents we don't have on file). */
function cc25_away_ground_link($opponent) {
    $g = cc25_ground_of($opponent);
    if ($g) return array('ground' => $g['ground'], 'addr' => $g['addr'], 'url' => cc25_dir_url($g['addr']), 'known' => true);
    return array('ground' => '', 'addr' => '',
        'url' => 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($opponent . ' football club'), 'known' => false);
}

/* -------------------------------------------------------------------------
 * Mailing-list signup. The homepage form POSTs to the club's Apps Script
 * mailing-list web app (cwmbran-celtic-mailing-list). After deploying that
 * script as a Web app, run its "Website signup info" menu item and paste the
 * two values below. Until then the form shows a friendly success without
 * sending anywhere.
 * ---------------------------------------------------------------------- */
function cc25_signup_endpoint() { return 'https://script.google.com/macros/s/AKfycbzCXBX3nijB8_FGzIrLxrDOduPR1qStOtCSpXeP8itFIrjSxExbPfgqjXy9I8mBkm3Z/exec'; } // @1 "Cwmbran Mailer" web-app deployment
function cc25_signup_secret()   { return 'a427c2b0e39e4de2bc3bd4b8cfc990a1f42f5139f51240079023a92b39e4eb48'; } // SIGNUP_SECRET from "Website signup info"

/** Sponsorship page: commercial contact + optional brochure PDF (leave blank to hide the button). */
function cc25_sponsorship_email()    { return 'cwmbrancelticcomms@gmail.com'; }
function cc25_bond_amount()  { return '£10'; }           // monthly Celtic Bond subscription
function cc25_bond_join_url() { return 'https://pay.gocardless.com/AL0005M1YZB71S'; } // Celtic Bond direct-debit sign-up (GoCardless); blank => thank-you only
function cc25_bond_email()   { return 'cwmbrancelticcomms@gmail.com'; }

/**
 * Celtic Bond monthly draw results, most recent first.
 *
 * Draws are now entered in wp-admin (Bond Draws). This array is the fallback:
 * it is used only while no draw has been entered there, so uploading the theme
 * changes nothing until the club migrates, and a half-finished migration shows
 * last month rather than an empty page.
 */
function cc25_bond_draws() {
    $posts = function_exists('cc25_bond_draws_from_posts') ? cc25_bond_draws_from_posts() : array();
    return $posts ? $posts : cc25_bond_draws_static();
}

/** The hand-maintained list, kept as the fallback described above. */
function cc25_bond_draws_static() {
    return array(
        array(
            'date'  => '2026-08-07',
            'label' => 'August 2026 Draw',
            'winners' => array(
                array('no' => 306, 'prize' => '£500',     'name' => 'Harri Pritchard',    'group' => 'Youth Team'),
                array('no' => 62,  'prize' => '£50',      'name' => 'Stephen Fry',        'group' => 'Walking Football'),
                array('no' => 317, 'prize' => '£50',      'name' => 'Christopher Naylor', 'group' => 'Walking Football'),
                array('no' => 180, 'prize' => '£50',      'name' => 'Philip Kruszewski',  'group' => 'Walking Football'),
                array('no' => 64,  'prize' => '£50',      'name' => 'Dean Taylor',        'group' => 'Vets'),
                array('no' => 267, 'prize' => 'Ear Buds', 'name' => 'Joanne Berry',       'group' => 'Mens 1st Team'),
            ),
        ),
        array(
            'date'  => '2026-07-31',
            'label' => 'July 2026 Draw',
            'winners' => array(
                array('no' => 181, 'prize' => '£500',     'name' => 'Mia Peacock',     'group' => 'Ladies 1st Team'),
                array('no' => 20,  'prize' => '£50',       'name' => 'Sharon Williams', 'group' => 'Walking Football'),
                array('no' => 289, 'prize' => '£50',       'name' => 'Paul Jury',       'group' => 'Walking Football'),
                array('no' => 235, 'prize' => '£50',       'name' => 'Susan Perrett',   'group' => 'General Club Member / Supporter'),
                array('no' => 50,  'prize' => 'Ear Pods',  'name' => 'Conor James',     'group' => 'General Club Member / Supporter'),
            ),
        ),
    );
}

/** Celtic Bond sign-up form handler — emails the club the applicant's details,
 * then redirects back to the Bond page with a thank-you (or error) state. */
add_action('admin_post_nopriv_cc25_bond_join', 'cc25_handle_bond_join');
add_action('admin_post_cc25_bond_join', 'cc25_handle_bond_join');
function cc25_handle_bond_join() {
    $back = wp_get_referer();
    if (!$back) $back = cc25_page_url('celtic-bond', home_url('/'));
    // Honeypot: silently accept (looks successful to bots) without emailing.
    if (!empty($_POST['website'])) { wp_safe_redirect(add_query_arg('bond', 'sent', $back) . '#join'); exit; }
    // Rate limit: max 3 submissions per IP per 5 minutes (stops inbox floods).
    $ip = isset($_SERVER['REMOTE_ADDR']) ? md5(preg_replace('/[^0-9a-f:.]/i', '', $_SERVER['REMOTE_ADDR'])) : '0';
    $rk = 'cc25_bond_rl_' . $ip;
    $hits = (int) get_transient($rk);
    if ($hits >= 3) { wp_safe_redirect(add_query_arg('bond', 'slow', $back) . '#join'); exit; }
    set_transient($rk, $hits + 1, 5 * MINUTE_IN_SECONDS);

    $name  = sanitize_text_field(wp_unslash($_POST['cc_name'] ?? ''));
    $email = sanitize_email(wp_unslash($_POST['cc_email'] ?? ''));
    $phone = sanitize_text_field(wp_unslash($_POST['cc_phone'] ?? ''));
    $conn  = sanitize_text_field(wp_unslash($_POST['cc_conn'] ?? ''));
    if ($name === '' || !is_email($email)) {
        // Keep what they typed so the form can repopulate on the error render.
        set_transient('cc25_bond_vals_' . $ip, compact('name', 'email', 'phone', 'conn'), 5 * MINUTE_IN_SECONDS);
        wp_safe_redirect(add_query_arg('bond', 'err', $back) . '#join'); exit;
    }
    delete_transient('cc25_bond_vals_' . $ip);
    $body = "New Celtic Bond sign-up:\n\n"
        . "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nConnection to the club: {$conn}\n\n"
        . "Next step: follow up to set up their " . cc25_bond_amount() . "/month direct debit and allocate a Bond number.";
    $headers = array('Reply-To: ' . $name . ' <' . $email . '>');
    wp_mail(cc25_bond_email(), 'Celtic Bond sign-up: ' . $name, $body, $headers);
    // Send them straight to the direct-debit sign-up (GoCardless) so they can
    // finish setting up their subscription; fall back to the on-page thank-you
    // if no join link is configured. wp_redirect (not _safe_) because this is a
    // known, hard-coded external URL, not user input.
    $join = cc25_bond_join_url();
    if ($join) { wp_redirect($join); exit; }
    wp_safe_redirect(add_query_arg('bond', 'sent', $back) . '#join'); exit;
}

/** IDs of the categories whose posts should stay out of general listings. */
function cc25_hidden_cat_ids() {
    $ex = array();
    foreach (array('programme', 'gallery') as $slug) {
        $t = get_category_by_slug($slug);
        if ($t) $ex[] = (int) $t->term_id;
    }
    return $ex;
}
/** Keep programme + gallery posts out of the home page, News/blog, archives,
 * search, feeds and Recent-Posts widgets — they each have their own page. The
 * dedicated archive templates use their own get_posts()/WP_Query, so they're
 * unaffected. */
add_action('pre_get_posts', function ($q) {
    if (is_admin() || !$q->is_main_query()) return;
    if ($q->is_home() || $q->is_front_page() || $q->is_feed() || $q->is_search() || ($q->is_archive() && !$q->is_post_type_archive())) {
        $ex = cc25_hidden_cat_ids();
        if ($ex) $q->set('category__not_in', array_values(array_unique(array_merge((array) $q->get('category__not_in'), $ex))));
    }
});
add_filter('widget_posts_args', function ($args) {
    $ex = cc25_hidden_cat_ids();
    if ($ex) $args['category__not_in'] = array_values(array_unique(array_merge((array) (isset($args['category__not_in']) ? $args['category__not_in'] : array()), $ex)));
    return $args;
});

/* ---- Match Day Programmes ---------------------------------------------------
 * Post each programme as a normal Post in the "programme" category, set a
 * Featured Image (the cover), set the post date to the match date, and paste the
 * PDF / Issuu link in the "Match Day Programme" box. The archive page groups them
 * by season automatically and the newest shows on the home page. */
function cc25_programme_category() { return 'programme'; }

/** UK football season label (Aug–May) from a timestamp, e.g. "2026/27". */
function cc25_season_label_from_ts($ts) {
    $y = (int) date('Y', $ts); $m = (int) date('n', $ts);
    $start = ($m >= 7) ? $y : $y - 1;
    return $start . '/' . substr((string) ($start + 1), -2);
}
function cc25_programme_season($id) {
    $s = trim((string) get_post_meta($id, '_cc25_prog_season', true));
    return $s !== '' ? $s : cc25_season_label_from_ts((int) get_post_time('U', true, $id));
}
function cc25_programme_url($id) {
    $u = trim((string) get_post_meta($id, '_cc25_prog_url', true));
    return $u !== '' ? $u : get_permalink($id);
}

/* -------------------------------------------------------------------------
 * Programme reader. Programmes used to be Heyzine flipbooks, whose links
 * expire — so a PDF link is now read on the club's own site instead, at the
 * programme post's permalink. Non-PDF links (the remaining Heyzine ones) still
 * pass straight through, so the two can coexist while they are swapped over.
 * ---------------------------------------------------------------------- */

/** True when $url points at a PDF, ignoring any query string or fragment. */
function cc25_is_pdf_url($url) {
    $url = trim((string) $url);
    if ($url === '') return false;
    $path = (string) parse_url($url, PHP_URL_PATH);
    return strtolower(substr($path, -4)) === '.pdf';
}

/** The programme's PDF, or '' when it has none (an external flipbook, or nothing). */
function cc25_programme_pdf($id) {
    $u = trim((string) get_post_meta($id, '_cc25_prog_url', true));
    return cc25_is_pdf_url($u) ? $u : '';
}

/** Where a programme card should point: our own reader when there's a PDF to
 *  read, otherwise the external link exactly as before. */
function cc25_programme_read_url($id) {
    return cc25_programme_pdf($id) !== '' ? get_permalink($id) : cc25_programme_url($id);
}

/** True when this post is a programme the reader can render. */
function cc25_is_programme_post($post = null) {
    $post = get_post($post);
    if (!$post) return false;
    return in_category(cc25_programme_category(), $post) && cc25_programme_pdf($post->ID) !== '';
}

/** Sheet 1 of a landscape programme is the outer wrap (back cover | front cover)
 *  unless the club has said otherwise for this one. */
function cc25_programme_cover_wrap($id) {
    return get_post_meta($id, '_cc25_prog_nowrap', true) ? false : true;
}
/** All programme posts grouped by season, newest season first. */
function cc25_programmes_by_season() {
    $posts = get_posts(array(
        'post_type'   => 'post',
        'post_status' => 'publish',
        'numberposts' => -1,
        'category_name' => cc25_programme_category(),
        'orderby'     => 'date',
        'order'       => 'DESC',
    ));
    $by = array();
    foreach ($posts as $p) { $by[cc25_programme_season($p->ID)][] = $p; }
    uksort($by, function ($a, $b) { return intval($b) <=> intval($a); });
    return $by;
}
function cc25_latest_programme() {
    $p = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 1,
        'category_name' => cc25_programme_category(), 'orderby' => 'date', 'order' => 'DESC'));
    return $p ? $p[0] : null;
}

/**
 * "Written by" byline override — lets one publisher credit the real author of a
 * post without that person needing a WordPress login. Shown on Posts.
 */
add_action('add_meta_boxes', function () {
    add_meta_box('cc25_byline', 'Written by', 'cc25_byline_metabox', 'post', 'side');
});
function cc25_byline_metabox($post) {
    wp_nonce_field('cc25_byline_save', 'cc25_byline_nonce');
    $name = get_post_meta($post->ID, '_cc25_byline', true);
    echo '<p><label><strong>Author name (byline)</strong><br>'
        . '<input type="text" name="cc25_byline" value="' . esc_attr($name) . '" style="width:100%" placeholder="e.g. Tony Strange"></label></p>';
    echo '<p style="color:#666;font-size:11px;margin:0">Leave blank to use the logged-in publisher. Fill it in to credit whoever wrote the piece &mdash; they don\'t need a login.</p>';
}
add_action('save_post', function ($id) {
    if (!isset($_POST['cc25_byline_nonce']) || !wp_verify_nonce($_POST['cc25_byline_nonce'], 'cc25_byline_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    update_post_meta($id, '_cc25_byline', sanitize_text_field(wp_unslash($_POST['cc25_byline'] ?? '')));
});
/** Display byline for a post: the "Written by" override if set, else the author. */
function cc25_byline($id = null) {
    $id = $id ?: get_the_ID();
    $o = trim((string) get_post_meta($id, '_cc25_byline', true));
    return $o !== '' ? $o : get_the_author();
}

/** Editor box for the programme link + optional season override (shown on Posts). */
add_action('add_meta_boxes', function () {
    add_meta_box('cc25_prog', 'Match Day Programme', 'cc25_prog_metabox', 'post', 'side', 'high');
});
function cc25_prog_metabox($post) {
    wp_nonce_field('cc25_prog_save', 'cc25_prog_nonce');
    $url = get_post_meta($post->ID, '_cc25_prog_url', true);
    $season = get_post_meta($post->ID, '_cc25_prog_season', true);
    $nowrap = get_post_meta($post->ID, '_cc25_prog_nowrap', true);
    echo '<p><label><strong>Programme link</strong><br>'
        . '<input type="url" name="cc25_prog_url" value="' . esc_attr($url) . '" style="width:100%" placeholder="https://…/programme.pdf"></label></p>';
    echo '<p style="color:#666;font-size:11px;margin:0 0 12px">Upload the <b>PDF</b> to the Media Library and paste its link here — it is then read on this site, at this post\'s own address. Any other link (a Heyzine or Issuu flipbook) still opens away from the site, and will expire.</p>';
    echo '<p><label><strong>Season</strong> (optional)<br>'
        . '<input type="text" name="cc25_prog_season" value="' . esc_attr($season) . '" style="width:100%" placeholder="auto from post date, e.g. 2026/27"></label></p>';
    echo '<p><label><input type="checkbox" name="cc25_prog_nowrap" value="1"' . ($nowrap ? ' checked' : '') . '> '
        . '<strong>Pages run straight through</strong></label></p>';
    echo '<p style="color:#666;font-size:11px;margin:0 0 12px">Only for landscape PDFs, and only on phones, where each sheet is split into its two pages. Leave this unticked for a programme laid out as a booklet — the first sheet being back cover alongside front cover — so it opens on the front cover. Tick it if the PDF simply starts at page 1 on the left.</p>';
    echo '<p style="color:#666;font-size:11px;margin:0">To publish a programme: set the category to <b>Programme</b>, add a <b>Featured Image</b> (the cover), and set the <b>post date</b> to the match date.</p>';
}
add_action('save_post', function ($id) {
    if (!isset($_POST['cc25_prog_nonce']) || !wp_verify_nonce($_POST['cc25_prog_nonce'], 'cc25_prog_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    update_post_meta($id, '_cc25_prog_url', esc_url_raw(wp_unslash($_POST['cc25_prog_url'] ?? '')));
    update_post_meta($id, '_cc25_prog_season', sanitize_text_field(wp_unslash($_POST['cc25_prog_season'] ?? '')));
    if (empty($_POST['cc25_prog_nowrap'])) {
        delete_post_meta($id, '_cc25_prog_nowrap');
    } else {
        update_post_meta($id, '_cc25_prog_nowrap', '1');
    }
});

/** Homepage "Latest Gallery" feature. Post a gallery as a normal Post in the
 * "gallery" category with a Featured Image, and the newest one shows on the
 * home page automatically. Returns the WP_Post or null. */
function cc25_gallery_category() { return 'gallery'; }
function cc25_latest_gallery() {
    if (!class_exists('WP_Query')) return null;
    $q = new WP_Query(array(
        'post_type'           => 'post',
        'post_status'         => 'publish',
        'posts_per_page'      => 1,
        'category_name'       => cc25_gallery_category(),
        'meta_query'          => array(array('key' => '_thumbnail_id', 'compare' => 'EXISTS')),
        'no_found_rows'       => true,
        'ignore_sticky_posts' => true,
    ));
    $post = $q->have_posts() ? $q->posts[0] : null;
    wp_reset_postdata();
    return $post;
}
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
    $items = array(
        array('All Teams', cc25_page_url('teams', $home), false, array(
            array("Men's First Team", cc25_page_url(array('mens-team', 'mens-1st-team'), $home), false),
            array("Men's Reserves", cc25_reserves_url(), false),
            array("Men's Vets", cc25_vets_url(), false),
            array("Women's First Team", cc25_page_url(array('ladies-team', 'ladies-1st-team'), $home), false),
            array("Juniors &amp; Minis", cc25_juniors_url(), false),
            array('Walking Football', cc25_walking_football_url(), false),
        )),
        array('Fixtures &amp; Results', cc25_page_url('fixtures', $home), false, array(
            array('Current Season', cc25_page_url('fixtures', $home), false),
            array('Away Days', cc25_page_url('away-days', $home), false),
            array('2025-26 Season', cc25_page_url('2025-26-archive', $home), false),
            array('2024-25 Archive', cc25_page_url(array('2024-25-archive'), $home), false),
            array('2023-24 Archive', cc25_page_url(array('2023-24-archive'), $home), false),
            array('2022-23 Archive', cc25_page_url(array('2022-23-archive'), $home), false),
        )),
        array('Club', cc25_page_url(array('club-history', 'club', 'the-club', 'about'), $home), false, array(
            array('Club History', cc25_page_url(array('club-history'), $home), false),
            array('News', cc25_page_url('news', $home), false),
            array('Galleries', cc25_page_url(array('galleries'), $home), false),
            array('Club Documents', cc25_page_url(array('club-documents'), $home), false),
            array('Matchday Programme', cc25_page_url(array('cwmbran-celtic-fc-match-day-programme-digital'), $home), false),
            array('Coleg Gwent', cc25_page_url(array('coleg-gwent-4', 'coleg-gwent'), $home), false),
            array('Contact', cc25_page_url('contact', $home), false),
        )),
        array('Sponsors', cc25_page_url('sponsors', $home), false, array(
            array('Our Sponsors', cc25_page_url(array('sponsors-2', 'sponsors'), $home), false),
            array('Sponsorship Opportunities', cc25_page_url(array('sponsorship-opportunities', 'sponsorship'), $home), false),
        )),
        array('Celtic Bond', cc25_page_url('celtic-bond', $home), false, array(
            array('Celtic Bond Results', cc25_page_url('bond-results', $home), false),
        )),
        array('Club Shop', cc25_page_url(array('shop', 'club-shop', 'kit'), $home), false, array(
            array('Music Shirts', cc25_page_url('music-shirts', $home), false),
            array('Seniors Range', 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc/cwmbran-celtic-fc-seniors', true),
            array('Juniors Range', 'https://www.tor-sports.co.uk/club-shops/cwmbran-celtic-fc/cwmbran-celtic-fc-juniors', true),
        )),
    );
    // Music Shirts / Buy Tickets are buttons in the header on desktop. On mobile
    // those buttons are hidden (they crowded the hamburger toggle), so surface
    // them at the TOP of the hamburger menu as mobile-only links (5th element).
    // Contact lives in the Club dropdown + footer to keep the top bar to one row.
    $mob = array();
    if (cc25_kit_launch_live()) {
        $mob[] = array('Music Shirts', cc25_page_url('music-shirts', $home), false, array(), true);
    }
    $mob[] = array('Buy Tickets', cc25_ext_url('tickets'), true, array(), true);
    return array_merge($mob, $items);
}

function cc25_nav_fallback() {
    echo '<ul class="cc25-nav">';
    foreach (cc25_nav_items() as $it) {
        $children = isset($it[3]) ? $it[3] : array();
        $has = !empty($children);
        $mob = !empty($it[4]);
        $ext = $it[2] ? ' target="_blank" rel="noopener"' : '';
        echo '<li class="menu-item' . ($has ? ' menu-item-has-children' : '') . ($mob ? ' mob-only' : '') . '">';
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

/** Mobile-only header CTA links (Music Shirts + Buy Tickets) as <li>s. The header
 * buttons are hidden on phones, so these surface at the top of the hamburger.
 * Injected for a REAL assigned menu too (below), not just the nav fallback. */
function cc25_mobile_cta_items_html() {
    $home = home_url('/');
    $out = '';
    if (cc25_kit_launch_live()) {
        $out .= '<li class="menu-item mob-only"><a href="' . esc_url(cc25_page_url('music-shirts', $home)) . '">Music Shirts</a></li>';
    }
    $out .= '<li class="menu-item mob-only"><a href="' . esc_url(cc25_ext_url('tickets')) . '" target="_blank" rel="noopener">Buy Tickets</a></li>';
    return $out;
}
add_filter('wp_nav_menu_items', function ($items, $args) {
    if (isset($args->theme_location) && $args->theme_location === 'cc25_primary') {
        return cc25_mobile_cta_items_html() . $items;
    }
    return $items;
}, 10, 2);

/* -------------------------------------------------------------------------
 * Live-feed helpers. Data comes from the cwmbran-celtic-feed plugin
 * (CCF_Client::get_feed()). Every helper degrades safely to empty/null so a
 * missing plugin or empty feed can never fatal the homepage.
 * ---------------------------------------------------------------------- */

function cc25_feed() {
    static $cache = null;
    if ($cache !== null) return $cache;
    if (!class_exists('CCF_Client')) return $cache = array();
    $f = CCF_Client::get_feed();
    return $cache = (is_array($f) ? $f : array());
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
        'Cwmbran Town' => 'cwmbran-town.png',
        'New Inn' => 'new-inn.png',
        'Undy' => 'undy.png',
        'Newport Corinthians' => 'newport-corinthians.png',
        'Lliswerry' => 'lliswerry.png',
        'Blaenavon Blues' => 'blaenavon-blues.png',
        'Rogerstone' => 'rogerstone.png',
        'Abertillery Excelsiors' => 'abertillery-excelsiors.png',
        'Abertillery Bluebirds' => 'abertillery-bluebirds.png',
        // Women's — Genero Adran South opponents.
        'Pontypridd United' => 'pontypridd-united.png',
        'Carmarthen Town' => 'carmarthen-town.png',
        'Taffs Well' => 'taffs-well.png',
        'Llanrumney United' => 'llanrumney-united.png',
        'Cascade YC' => 'cascade-yc.png',
        'Penybont' => 'penybont.png',
        'Pure Swansea' => 'pure-swansea.png',
        // Men's First Team opponents (also cover Reserves).
        'Abergavenny Town' => 'abergavenny-town.png',
        'Risca United' => 'risca-united.png',
        'Goytre' => 'goytre.png',
        'Caldicot Town' => 'caldicot-town.jpg',
        'Brecon Corries' => 'brecon-corries.png',
        'Cardiff Corinthians' => 'cardiff-corries.png',
    );
    if (isset($map[$name])) return $map[$name];
    // Tolerate "FC"/"AFC" and spacing drift (e.g. "Undy FC" -> undy.png) so the
    // Men's list ("Undy FC") and Reserves list ("Undy") share one crest.
    $norm = cc25_norm_team($name);
    foreach ($map as $k => $v) {
        if (cc25_norm_team($k) === $norm) return $v;
    }
    return '';
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
/** Normalise a team name for matching feed <-> static (drops FC/AFC, case, spacing). */
function cc25_norm_team($n) {
    $n = strtolower(trim((string) $n));
    $n = preg_replace('/\b(a?fc)\b/', '', $n);
    // Sources qualify a club by region when the name is ambiguous elsewhere in
    // Wales — faw.cymru lists Goytre as "Goytre AFC (Gwent)" where the site and
    // the feed just say "Goytre". Without this the two never match and a
    // kick-off override silently falls back to the day-of-week default.
    $n = preg_replace('/\([^)]*\)/', '', $n);
    return trim(preg_replace('/\s+/', ' ', $n));
}

/**
 * Overlay live allwalessport dates + home/away onto a hand-maintained fixture
 * list (used for the Men's First Team). The feed only carries a short rolling
 * window but is authoritative, so where it has a fixture we correct the static
 * row (matched by opponent, nearest date) to the feed's date/venue.
 */
function cc25_overlay_feed_dates($list) {
    $feed = cc25_feed();
    $fx = (isset($feed['fixtures']) && is_array($feed['fixtures'])) ? $feed['fixtures'] : array();
    foreach ($fx as $f) {
        if (($f['team'] ?? 'mens') !== 'mens') continue;
        $home = strpos((string) ($f['homeTeam'] ?? ''), 'Cwmbran Celtic') !== false;
        $opp  = cc25_norm_team($home ? ($f['awayTeam'] ?? '') : ($f['homeTeam'] ?? ''));
        $fms  = intval($f['date'] ?? 0);
        if ($opp === '' || !$fms) continue;
        $fdate = date('Y-m-d', intval($fms / 1000));
        $bi = -1; $best = null;
        foreach ($list as $i => $rf) {
            if (cc25_norm_team($rf[1]) !== $opp) continue;
            // Only correct plain LEAGUE rows from the feed. Cup ties (e.g. Welsh
            // Cup, League Cup) are hand-set, so never let a same-opponent league
            // fixture overwrite a cup row's date/venue.
            $comp = isset($rf[3]) ? $rf[3] : 'League';
            if (stripos($comp, 'cup') !== false) continue;
            $diff = abs(strtotime($rf[0]) - strtotime($fdate));
            if ($best === null || $diff < $best) { $best = $diff; $bi = $i; }
        }
        if ($bi >= 0 && $best !== null && $best <= 14 * 86400) {
            $list[$bi][0] = $fdate;   // correct date from allwalessport
            $list[$bi][2] = $home;    // correct home/away
        }
    }
    usort($list, function ($a, $b) { return strtotime($a[0]) <=> strtotime($b[0]); });
    return $list;
}

/**
 * Hand-maintained fixture lists for every team, shared by the Fixtures & Results
 * page and the home-page match ticker. The allwalessport feed only carries the
 * Men's First Team, so Reserves and Women's are kept here. Each row is
 * [date Y-m-d, opponent, isHome(bool), competition]. 'badge' => [short label,
 * css class] is shown in the ticker so you can see which team a fixture is for.
 */
function cc25_static_fixtures() {
    $rows = array();
    if (function_exists('cc25_fx_posts')) {
        foreach (cc25_fx_posts() as $f) $rows[$f['team']][] = cc25_fx_to_row($f);
    }
    return cc25_fx_merge_lists(cc25_static_fixtures_static(), $rows);
}

/** The hand-maintained lists, kept as the fallback described above. */
function cc25_static_fixtures_static() {
    static $cache = null;
    if ($cache !== null) return $cache;
    $data = array(
        'mens' => array(
            'league' => 'Ardal League South East',
            'title'  => "Men's First Team",
            'badge'  => array('1st', 'tk-team-m'),
            'list'   => array(
                array('2026-07-28', 'Cwmbran Town', true, 'League'),
                array('2026-08-01', 'Tredegar Town', false, 'League'),
                array('2026-08-07', 'New Inn', true, 'League', array(2, 4)),
                array('2026-08-14', 'Abergavenny Town', false, 'League'),
                // 22 Aug league game v Risca United postponed — Welsh Cup QR2 (v
                // Newport Corinthians) takes the slot. Risca to be rearranged.
                array('2026-08-22', 'Newport Corinthians', true, 'Welsh Cup QR2'),
                array('2026-08-29', 'Cardiff Corinthians', true, 'League Cup R1'),
                array('2026-09-05', 'TBC', true, 'Amateur Trophy QR2'),  // opponent + venue not yet drawn
                array('2026-09-05', 'Goytre', true, 'League'),           // POSTPONED — hidden below, needs a new date
                array('2026-09-12', 'Chepstow Town', false, 'League'),
                array('2026-09-19', 'Newport Corinthians', true, 'League'),
                array('2026-09-26', 'Abercarn United', false, 'League'),
                array('2026-10-03', 'Caldicot Town', true, 'League'),
                array('2026-10-10', 'Brecon Corries', false, 'League'),
                array('2026-10-17', 'Lliswerry', true, 'League'),
                array('2026-10-24', 'TBC', true, 'League Cup R2'),
                array('2026-10-31', 'Croesyceiliog', false, 'League'),
                array('2026-11-06', 'Blaenavon Blues', true, 'League'),
                array('2026-11-14', 'Undy FC', false, 'League'),
                array('2026-11-21', 'Cwmbran Town', false, 'League'),
                array('2026-11-27', 'Tredegar Town', true, 'League'),
                array('2026-12-04', 'New Inn', false, 'League'),
                array('2026-12-11', 'Abergavenny Town', true, 'League'),
                array('2026-12-19', 'Risca United', false, 'League'),
                array('2027-01-02', 'Goytre', false, 'League'),
                array('2027-01-08', 'Chepstow Town', true, 'League'),
                array('2027-01-16', 'Newport Corinthians', false, 'League'),
                array('2027-01-22', 'Abercarn United', true, 'League'),
                array('2027-01-30', 'Caldicot Town', false, 'League'),
                array('2027-02-05', 'Brecon Corries', true, 'League'),
                array('2027-02-13', 'Lliswerry', false, 'League'),
                array('2027-02-19', 'Croesyceiliog', true, 'League'),
                array('2027-02-27', 'Blaenavon Blues', false, 'League'),
                array('2027-03-05', 'Undy FC', true, 'League'),
            ),
        ),
        'reserves' => array(
            'league' => 'Autocentre Gwent Premier Combination League',
            'title'  => "Men's Reserves",
            'badge'  => array('Res', 'tk-team-r'),
            'list'   => array(
                array('2026-08-07', 'Rogerstone', false, 'Gwent Premier Cup R1', array(1, 2)),
                array('2026-08-15', 'Croesyceiliog', false, 'League'),
                array('2026-08-22', 'Rogerstone', true, 'League'),
                array('2026-08-29', 'Abercarn United', false, 'League'),
                array('2026-09-05', 'Tredegar Town', true, 'League'),
                array('2026-09-12', 'Chepstow Town', false, 'League'),
                array('2026-09-19', 'Cwmbran Town', true, 'League'),
                array('2026-09-26', 'Abertillery Excelsiors', true, 'League'),
                array('2026-10-03', 'New Inn', false, 'League'),
                array('2026-10-10', 'Undy', true, 'League'),
                array('2026-10-17', 'Newport Corinthians', false, 'League'),
                array('2026-10-24', 'Lliswerry', true, 'League'),
                array('2026-10-31', 'Abertillery Bluebirds', false, 'League'),
                array('2026-11-07', 'Blaenavon Blues', true, 'League'),
                array('2026-11-14', 'Blaenavon Blues', false, 'League'),
                array('2026-11-21', 'Croesyceiliog', true, 'League'),
                array('2026-11-28', 'Rogerstone', false, 'League'),
                array('2026-12-05', 'Abercarn United', true, 'League'),
                array('2026-12-12', 'Tredegar Town', false, 'League'),
                array('2026-12-19', 'Chepstow Town', true, 'League'),
                array('2027-01-09', 'New Inn', true, 'League'),
                array('2027-01-16', 'Undy', false, 'League'),
                array('2027-01-23', 'Newport Corinthians', true, 'League'),
                array('2027-01-30', 'Lliswerry', false, 'League'),
                array('2027-02-06', 'Abertillery Bluebirds', true, 'League'),
                array('2027-02-13', 'Cwmbran Town', false, 'League'),
                array('2027-02-20', 'Abertillery Excelsiors', false, 'League'),
            ),
        ),
        'womens' => array(
            'league' => 'Genero Adran South',
            'title'  => "Women's First Team",
            'badge'  => array('W', 'tk-team-w'),
            'list'   => array(
                array('2026-09-27', 'Llanrumney United', false, 'League'),
                array('2026-10-11', 'Pontypridd United', true, 'League'),
                array('2026-11-01', 'Carmarthen Town', true, 'League'),
                array('2026-11-22', 'Cascade YC', false, 'League'),
                array('2026-11-29', 'Penybont', false, 'League'),
                array('2026-12-06', 'Pure Swansea', true, 'League'),
                array('2027-01-17', 'Taffs Well', false, 'League'),  // FAW says Thu 17 Dec 2026 — see cc25_kickoff_overrides()
                array('2027-01-31', 'Llanrumney United', true, 'League'),
                array('2027-02-07', 'Cascade YC', true, 'League'),
                array('2027-02-14', 'Carmarthen Town', false, 'League'),
                array('2027-02-21', 'Pontypridd United', false, 'League'),
                array('2027-03-14', 'Taffs Well', true, 'League'),
                array('2027-03-21', 'Pure Swansea', false, 'League'),
                array('2027-04-04', 'Penybont', true, 'League'),
            ),
        ),
    );
    // Men's First Team dates/venues are corrected live from allwalessport.
    $data['mens']['list'] = cc25_overlay_feed_dates($data['mens']['list']);
    return $cache = $data;
}

/** Kick-off timestamp (ms) for a hand-maintained fixture row's 'Y-m-d' date.
 * Pass the row's opponent so a game-specific override can be matched. */
function cc25_row_kickoff_ms($ymd, $opponent = '') {
    $tz = function_exists('wp_timezone') ? wp_timezone() : new DateTimeZone('Europe/London');
    $d = DateTime::createFromFormat('Y-m-d', $ymd, $tz);
    if (!$d) return strtotime($ymd . ' 23:59:59') * 1000;
    $ko = cc25_kickoff_time($ymd, $opponent, (int) $d->format('N'));
    $dt = DateTime::createFromFormat('Y-m-d H:i', $ymd . ' ' . $ko, $tz);
    return ($dt ? $dt->getTimestamp() : $d->getTimestamp()) * 1000;
}

/** Fixtures to hide site-wide (postponed / called off, no new date yet) so the
 * site shows the NEXT game instead. Matched by opponent (normalised) + date
 * 'Y-m-d'. Delete a row once the game is rearranged — or just leave it, it ages
 * out on its own. Applies to the homepage next-game, fixtures page + ticker. */
function cc25_hidden_fixtures() {
    $base = cc25_hidden_fixtures_static();
    if (function_exists('cc25_fx_hidden_from_posts')) {
        $base = array_merge($base, cc25_fx_hidden_from_posts());
    }
    return $base;
}

/** The hand-maintained list, kept as the fallback described above. */
function cc25_hidden_fixtures_static() {
    return array(
        array('Tredegar Town', '2026-08-01'), // called off — heatwave left the pitch unplayable
        array('Risca United', '2026-08-22'),  // postponed — the Welsh Cup QR2 tie took the date
        array('Goytre', '2026-09-05'),        // postponed — the Amateur Trophy QR2 tie took the date
    );
}
function cc25_fixture_hidden($opp, $ymd) {
    $opp = cc25_norm_team($opp);
    $t = strtotime((string) $ymd);
    foreach (cc25_hidden_fixtures() as $h) {
        if (cc25_norm_team($h[0]) !== $opp) continue;
        if ($h[1] === $ymd) return true;
        // Tolerate the feed re-dating a postponed game by a few days (otherwise
        // an overlaid date could silently un-hide it). A far reschedule (>10d) is
        // a genuinely new fixture and should reappear.
        if ($t && abs($t - strtotime($h[1])) <= 10 * 86400) return true;
    }
    return false;
}

function cc25_render_static_fixtures($list, $tickets_url = '') {
    // Drop games that have finished (kick-off + 2h in the past) so the fixtures
    // list only ever shows what's still to come.
    $now = round(microtime(true) * 1000);
    $list = array_values(array_filter($list, function ($rf) use ($now) {
        if (cc25_fixture_hidden($rf[1], $rf[0])) return false;
        return cc25_row_kickoff_ms($rf[0], $rf[1]) + 2 * 60 * 60 * 1000 >= $now;
    }));
    if (!$list) {
        echo '<p style="color:var(--muted);padding:24px 2px;margin:0">No upcoming fixtures right now &mdash; check back soon.</p>';
        return;
    }
    $lm = '';
    foreach ($list as $rf) {
        $rd = strtotime($rf[0]); $home = !empty($rf[2]); $opp = $rf[1];
        $comp = isset($rf[3]) && $rf[3] !== '' ? $rf[3] : 'League';
        $mo = date('F Y', $rd);
        if ($mo !== $lm) { $lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; }
        $oc = cc25_res_crest($opp, 34);
        // Home games: a ticket link (we host, we sell). Away games: Travel &
        // Ground -> the Away Days hub (ground + directions for the trip).
        if ($home && $tickets_url) {
            $tix = '<a class="mtix btn btn-gold" href="' . esc_url($tickets_url) . '" target="_blank" rel="noopener">Buy Tickets</a>';
        } elseif (!$home) {
            $tix = '<a class="mtix btn btn-navy" href="' . esc_url(cc25_page_url('away-days', home_url('/'))) . '">Travel &amp; Ground</a>';
        } else {
            $tix = '';
        }
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

/** Results for a team the feed doesn't cover — the same row markup as the men's
 *  results panel, so the two read identically. */
function cc25_render_static_results($team) {
    $rs = cc25_static_results($team);
    if (!$rs) {
        echo '<p style="color:var(--muted);padding:24px 2px;margin:0">No results yet this season.</p>';
        return;
    }
    $lm = '';
    foreach ($rs as $r) {
        $home = cc25_is_home($r);
        $opp  = cc25_opponent($r)['opponent'];
        $us   = intval($home ? $r['homeScore'] : $r['awayScore']);
        $them = intval($home ? $r['awayScore'] : $r['homeScore']);
        $wdl  = $us > $them ? 'w' : ($us < $them ? 'l' : 'd');
        $mo = cc25_date($r['date'], 'F Y');
        if ($mo !== $lm) { $lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; }
        $oc = cc25_res_crest($opp, 34);
        echo '<div class="mrow reveal">'
            . '<div class="mdate"><div class="d">' . esc_html(cc25_date($r['date'], 'd')) . '</div><div class="m">' . esc_html(cc25_date($r['date'], 'M')) . '</div><div class="day">' . esc_html(cc25_date($r['date'], 'D')) . '</div></div>'
            . '<div class="mteams">'
            . '<span class="mt' . ($home ? ' is-own' : '') . '">' . ($home ? cc25_own_crest(34) : $oc) . '<span class="nm">' . esc_html($home ? 'Cwmbran Celtic' : $opp) . '</span></span>'
            . '<span class="mscore">' . intval($r['homeScore']) . ' &ndash; ' . intval($r['awayScore']) . '</span>'
            . '<span class="mt right' . ($home ? '' : ' is-own') . '">' . ($home ? $oc : cc25_own_crest(34)) . '<span class="nm">' . esc_html($home ? $opp : 'Cwmbran Celtic') . '</span></span>'
            . '</div>'
            . '<div><span class="res-badge ' . $wdl . '">' . strtoupper($wdl) . '</span></div>'
            . '<div class="mmeta"><div class="comp">' . esc_html($r['competition'] ?? '') . '</div><span class="ha ' . ($home ? 'h' : 'a') . '">' . ($home ? 'Home' : 'Away') . '</span>'
            . cc25_match_link_buttons(function_exists('cc25_match_links') ? cc25_match_links($team, cc25_date($r['date'], 'Y-m-d')) : array())
            . '</div>'
            . '</div>';
    }
}

/**
 * Next-fixture card for one team, for the homepage rotator.
 *
 * Was a single hardcoded card for the men's first team. All three now play at
 * around the same time, so no one side should be the only thing the homepage
 * says — and cc25_upcoming() returns nothing for the other two until the static
 * merge covers every team, which is what made this possible.
 */
function cc25_next_up_card($feed, $team, $label) {
    $next = cc25_upcoming($feed, $team, 1);
    if (!$next) return '';
    $f = $next[0];
    $o = cc25_opponent($f);
    $venue = $o['home'] ? '⚑ Motazone Arena' : '⚑ Away · ' . ($f['homeTeam'] ?? '');
    $ours = 'Cwmbran Celtic' . ($team === 'reserves' ? ' Reserves' : ($team === 'womens' ? ' Women' : ''));

    $out  = '<div class="mcard" role="group" aria-label="' . esc_attr($label . ' next fixture') . '">';
    $out .= '<div class="mcard-top">'
          . '<span class="mc-tag"><span class="pulse"></span> ' . esc_html($label) . '</span>'
          . '<span class="mc-comp">' . esc_html($f['competition'] ?? 'Fixture') . '</span>'
          . '<span class="mc-venue">' . esc_html($venue) . '</span>'
          . '</div>';
    $out .= '<div class="mcard-body">'
          . '<div class="mteam">' . cc25_own_crest(60)
          . '<div><div class="nm">' . esc_html($ours) . '</div><div class="rec">' . ($o['home'] ? 'At home' : 'On the road') . '</div></div></div>'
          . '<div class="mko"><div class="t">' . esc_html(cc25_kickoff_label($f)) . '</div>'
          . '<div class="d">' . esc_html(cc25_date($f['date'] ?? 0, 'D j M')) . '</div></div>'
          . '<div class="mteam away">' . cc25_crest($feed, $o['opponent'], 60)
          . '<div><div class="nm">' . esc_html($o['opponent']) . '</div><div class="rec">' . ($o['home'] ? 'Visitors' : 'Hosts') . '</div></div></div>'
          . '</div>';
    $out .= '<div class="mcard-foot">'
          . '<a class="btn btn-navy btn-sm" href="' . esc_url(cc25_page_url('fixtures', home_url('/'))) . '">Fixtures</a>';
    // Tickets only for home games — we sell none for away.
    if ($o['home']) {
        $out .= '<a class="btn btn-gold btn-sm" href="' . esc_url(cc25_ext_url('tickets')) . '" target="_blank" rel="noopener">Buy Tickets</a>';
    }
    $out .= '<a class="btn btn-navy btn-sm" href="' . esc_url(cc25_travel_url($o['opponent'], $o['home'])) . '">Travel &amp; Ground</a>'
          . '</div></div>';
    return $out;
}

/** Every team that has a next fixture, in billing order. */
function cc25_next_up_cards($feed) {
    $order = array('mens' => "Men's First Team", 'womens' => "Women's First Team", 'reserves' => "Men's Reserves");
    $out = array();
    foreach ($order as $team => $label) {
        $card = cc25_next_up_card($feed, $team, $label);
        if ($card !== '') $out[$team] = $card;
    }
    return $out;
}

/**
 * The score strip above a match report's prose.
 *
 * Everything here is read from the fixture, never typed into the report — which
 * is the whole point of attaching a report to a game rather than asking someone
 * to retype the score into the article.
 */
function cc25_report_header($post = null) {
    if (!function_exists('cc25_report_game')) return '';
    $g = cc25_report_game($post);
    if (!$g) return '';
    list($team, $ymd) = $g;
    $lists = cc25_static_fixtures();
    $row = null;
    foreach ($lists[$team]['list'] ?? array() as $r) {
        if ($r[0] === $ymd) { $row = $r; break; }
    }
    if (!$row) return '';

    $home = !empty($row[2]);
    $opp  = $row[1];
    $comp = (isset($row[3]) && $row[3] !== '') ? $row[3] : 'League';
    $score = function_exists('cc25_row_score') ? cc25_row_score($row) : null;
    $titles = function_exists('cc25_fx_teams') ? cc25_fx_teams() : array();
    $ours = 'Cwmbran Celtic' . ($team === 'reserves' ? ' Reserves' : ($team === 'womens' ? ' Women' : ''));

    $oc = cc25_res_crest($opp, 44);
    $mid = $score
        ? '<span class="mrh-score">' . ($home ? $score[0] : $score[1]) . '<i>&ndash;</i>' . ($home ? $score[1] : $score[0]) . '</span>'
        : '<span class="mrh-vs">v</span>';

    $meta = array(cc25_date(strtotime($ymd) * 1000, 'l j F Y'), $comp, $home ? 'Motazone Arena' : 'Away');
    $sc  = trim((string) get_post_meta(get_post($post)->ID, '_cc25_mr_scorers', true));
    $att = trim((string) get_post_meta(get_post($post)->ID, '_cc25_mr_attendance', true));

    $out  = '<div class="mrh">';
    $out .= '<div class="mrh-eye kick">' . esc_html($titles[$team] ?? $ours) . ' &middot; Match Report</div>';
    $out .= '<div class="mrh-match">'
          . '<span class="mrh-team' . ($home ? ' is-own' : '') . '">' . ($home ? cc25_own_crest(44) : $oc) . '<span class="nm">' . esc_html($home ? $ours : $opp) . '</span></span>'
          . $mid
          . '<span class="mrh-team right' . ($home ? '' : ' is-own') . '">' . ($home ? $oc : cc25_own_crest(44)) . '<span class="nm">' . esc_html($home ? $opp : $ours) . '</span></span>'
          . '</div>';
    $out .= '<div class="mrh-meta">' . esc_html(implode(' · ', $meta)) . '</div>';
    if ($sc !== '' || $att !== '') {
        $bits = array();
        if ($sc !== '')  $bits[] = '<b>Scorers</b> ' . esc_html($sc);
        if ($att !== '') $bits[] = '<b>Attendance</b> ' . esc_html(number_format((int) $att));
        $out .= '<div class="mrh-facts">' . implode(' &nbsp;&middot;&nbsp; ', $bits) . '</div>';
    }
    $out .= '</div>';
    return $out;
}

/** "Match Report" / "Programme" buttons for a match row. Renders nothing when the
 *  game has neither, so a row never grows an empty gap. */
function cc25_match_link_buttons($links) {
    $out = '';
    if (!empty($links['report'])) {
        $out .= '<a class="mtix btn btn-navy" href="' . esc_url($links['report']) . '">Match Report</a>';
    }
    if (!empty($links['programme'])) {
        $out .= '<a class="mtix btn btn-outline" href="' . esc_url($links['programme']) . '">Programme</a>';
    }
    return $out;
}

function cc25_team_items($list, $team) {
    if (!is_array($list)) return array();
    return array_values(array_filter($list, function ($x) use ($team) {
        return (isset($x['team']) ? $x['team'] : 'mens') === $team;
    }));
}

/** Convert a hand-maintained men's fixture row [date,opp,home,comp] into the
 * same shape as a feed fixture, so it can stand in when the feed is unavailable. */
function cc25_static_row_to_fixture($rf, $team = 'mens') {
    $home = !empty($rf[2]);
    $f = array(
        'date'        => cc25_row_kickoff_ms($rf[0], $rf[1]),
        'homeTeam'    => $home ? 'Cwmbran Celtic' : ($rf[1] ?? ''),
        'awayTeam'    => $home ? ($rf[1] ?? '') : 'Cwmbran Celtic',
        'homeAway'    => $home ? 'H' : 'A',
        'competition' => (isset($rf[3]) && $rf[3] !== '') ? $rf[3] : 'League',
        'team'        => $team,
    );
    $sc = cc25_row_score($rf);
    if ($sc) {
        $f['homeScore'] = $home ? $sc[0] : $sc[1];
        $f['awayScore'] = $home ? $sc[1] : $sc[0];
    }
    return $f;
}

/* -------------------------------------------------------------------------
 * Results for the teams the feed doesn't cover.
 *
 * allwalessport carries the Men's First Team only, so the Reserves' and Women's
 * results sections read "No results yet" for the whole season. A played game is
 * recorded by adding a score to its existing fixture row rather than keeping a
 * second list, so a fixture and its result can never disagree about the date,
 * opponent or competition.
 *
 * >>> To record a result, append OUR score then THEIRS to the row:
 *       array('2026-08-07', 'Rogerstone', false, 'Gwent Premier Cup R1', array(1, 2)),
 *     Home or away makes no difference — the first number is always ours.
 * ---------------------------------------------------------------------- */

/** [ours, theirs] for a played row, or null while it's still a fixture. */
function cc25_row_score($rf) {
    if (!isset($rf[4]) || !is_array($rf[4]) || count($rf[4]) < 2) return null;
    if (!is_numeric($rf[4][0]) || !is_numeric($rf[4][1])) return null;
    return array((int) $rf[4][0], (int) $rf[4][1]);
}

/** Hand-recorded results for a team, newest first, shaped like feed results. */
function cc25_static_results($team) {
    $static = cc25_static_fixtures();
    $out = array();
    foreach ($static[$team]['list'] ?? array() as $rf) {
        if (!cc25_row_score($rf)) continue;
        if (cc25_fixture_hidden($rf[1], $rf[0])) continue;
        $out[] = cc25_static_row_to_fixture($rf, $team);
    }
    usort($out, function ($a, $b) { return ($b['date'] ?? 0) <=> ($a['date'] ?? 0); });
    return $out;
}

/** Every result for a team, newest first: the feed's plus any hand-recorded ones
 *  it doesn't already hold. The feed wins where both have a game. */
function cc25_results($feed, $team = 'mens') {
    $out = cc25_team_items($feed['results'] ?? array(), $team);
    foreach (cc25_static_results($team) as $r) {
        $seen = false;
        foreach ($out as $f) {
            if (cc25_norm_team(cc25_opponent($f)['opponent']) !== cc25_norm_team(cc25_opponent($r)['opponent'])) continue;
            if (abs(intval($f['date'] ?? 0) - intval($r['date'])) <= 10 * 86400 * 1000) { $seen = true; break; }
        }
        if (!$seen) $out[] = $r;
    }
    usort($out, function ($a, $b) { return ($b['date'] ?? 0) <=> ($a['date'] ?? 0); });
    return $out;
}

/** Upcoming fixtures (future first); if none are future, soonest available. */
function cc25_upcoming($feed, $team = 'mens', $n = 5) {
    $fx = cc25_team_items($feed['fixtures'] ?? array(), $team);
    // Drop any postponed/called-off fixtures so the "next game" is the real one.
    $fx = array_values(array_filter($fx, function ($f) {
        $dms = intval($f['date'] ?? 0);
        $ymd = $dms ? date('Y-m-d', intval($dms / 1000)) : '';
        $home = strpos((string) ($f['homeTeam'] ?? ''), 'Cwmbran Celtic') !== false;
        $opp = $home ? ($f['awayTeam'] ?? '') : ($f['homeTeam'] ?? '');
        return !cc25_fixture_hidden($opp, $ymd);
    }));
    $now = round(microtime(true) * 1000);
    // A fixture stays "upcoming" until ~2h after its real KICK-OFF (i.e. through
    // the match), not its stored noon date — so today's game remains the "next
    // game" right up to and during kick-off instead of flipping at midday.
    $future = array_values(array_filter($fx, function ($f) use ($now) {
        $ko = cc25_kickoff_ms($f);
        return $ko && ($ko + 2 * 60 * 60 * 1000) >= $now;
    }));
    // The feed is allwalessport, which only carries LEAGUE games — cup ties exist
    // only in the hand-maintained list. Merging them in rather than treating the
    // static list as a fallback is what stops a cup tie being invisible to "next
    // game": with Risca postponed on 22 August, the feed's next home fixture was
    // the postponed game and, once hidden, would have skipped the Welsh Cup tie
    // that replaced it and jumped to September.
    // Every team, not just the men's first team: the feed carries only their
    // league games, so gating this on 'mens' left cc25_upcoming() returning
    // nothing at all for the Reserves and the Women — which is why the homepage
    // could only ever feature one side.
    $cc25_static = cc25_static_fixtures();
    if (isset($cc25_static[$team]['list'])) {
        foreach ($cc25_static[$team]['list'] as $rf) {
            if (($rf[1] ?? '') === '' || $rf[1] === 'TBC') continue;
            if (cc25_fixture_hidden($rf[1], $rf[0])) continue;
            if (cc25_row_score($rf)) continue;   // played — it's a result now
            $ms = cc25_row_kickoff_ms($rf[0], $rf[1]);
            if ($ms + 2 * 60 * 60 * 1000 < $now) continue;
            // Already in the feed? Static dates are feed-corrected by
            // cc25_overlay_feed_dates(), so the same game matches on opponent and
            // a close date; anything further apart is a genuinely different tie.
            $seen = false;
            foreach ($future as $f) {
                if (cc25_norm_team(cc25_opponent($f)['opponent']) !== cc25_norm_team($rf[1])) continue;
                if (abs(intval($f['date'] ?? 0) - $ms) <= 10 * 86400 * 1000) { $seen = true; break; }
            }
            if (!$seen) $future[] = cc25_static_row_to_fixture($rf, $team);
        }
    }
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
        if (cc25_is_home($f)) return $f;
    }
    return null;
}

/** True when $fx falls on today's date. The homepage takeover asks this to decide
 *  whether the game outranks the Music Shirts launch splash. Resolves "today" in
 *  Europe/London — the timezone the rest of the kick-off code works in — rather
 *  than via date_i18n(), so it also runs under the CLI tests. */
function cc25_is_matchday($fx) {
    if (empty($fx['date'])) return false;
    $uk = new DateTimeZone('Europe/London');
    $ko = (new DateTime('@' . (int) round(((int) $fx['date']) / 1000)))->setTimezone($uk);
    return $ko->format('Y-m-d') === (new DateTime('now', $uk))->format('Y-m-d');
}

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

/* ============================ SEO / AEO ===================================== */

/** Context-aware meta description. */
function cc25_seo_desc() {
    if (is_front_page()) {
        return 'Official website of Cwmbran Celtic AFC — fixtures, results, the live league table, news, tickets and away-day info for the Celts in the Ardal League South East.';
    }
    $ov = cc25_share_meta();
    if ($ov && !empty($ov['desc'])) return $ov['desc'];
    if (is_singular('post') || is_page()) {
        $e = get_the_excerpt();
        if ($e) return wp_strip_all_tags($e);
    }
    if (is_page()) {
        $tt = wp_strip_all_tags(get_the_title());
        if ($tt) return $tt . ' — Cwmbran Celtic AFC, Ardal League South East. Fixtures, results, news and tickets for the Celts.';
    }
    $t = get_bloginfo('description');
    return $t ? $t : 'Cwmbran Celtic AFC — blue and yellow, since 1924.';
}

/** Current canonical URL. */
function cc25_seo_url() {
    if (is_singular() || is_page()) {
        $u = get_permalink();
        if ($u) {
            // Match reports are distinct content at /match-report/?g=<date> — keep
            // the ?g so each report has its own canonical/og:url (not all collapsed
            // onto the bare page).
            if (is_page() && get_post_field('post_name', get_queried_object_id()) === 'match-report' && !empty($_GET['g'])) {
                $u = add_query_arg('g', preg_replace('/[^0-9-]/', '', $_GET['g']), $u);
            }
            return $u;
        }
    }
    if (is_front_page() || is_home()) return home_url('/');
    global $wp; return home_url(isset($wp->request) ? $wp->request : '');
}

/** Give custom-template pages (match reports, Music Shirts) a real <title> — the
 * document title, not just the OG title — so browser tabs and Google SERPs show
 * the scoreline instead of one shared "Match Report" for every game. */
add_filter('pre_get_document_title', function ($title) {
    if (is_admin()) return $title;
    $ov = cc25_share_meta();
    return ($ov && !empty($ov['title'])) ? $ov['title'] : $title;
});

/** The club as a schema.org SportsTeam (reused across the JSON-LD). */
function cc25_seo_org() {
    return array(
        '@type' => 'SportsTeam',
        '@id'   => home_url('/#club'),
        'name'  => 'Cwmbran Celtic AFC',
        'alternateName' => 'The Celts',
        'sport' => 'Association Football',
        'url'   => home_url('/'),
        'logo'  => cc25_club_logo(),
        'foundingDate' => '1924',
        'memberOf' => array('@type' => 'SportsOrganization', 'name' => 'Ardal League South East'),
        'location' => array(
            '@type' => 'Place',
            'name'  => 'The Motazone Arena (Celtic Park)',
            'address' => array('@type' => 'PostalAddress', 'streetAddress' => 'Henllys Way', 'addressLocality' => 'Cwmbran', 'addressRegion' => 'Torfaen', 'postalCode' => 'NP44 3FS', 'addressCountry' => 'GB'),
            'geo' => array('@type' => 'GeoCoordinates', 'latitude' => 51.643722, 'longitude' => -3.018111),
        ),
        'sameAs' => array('https://www.facebook.com/CwmbranCelticFC', 'https://twitter.com/CwmbranCelticFC'),
    );
}

function cc25_jsonld($data) {
    echo '<script type="application/ld+json">' . wp_json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "</script>\n";
}

/** Upcoming fixtures (all three teams) as SportsEvent schema. */
function cc25_seo_events() {
    $sf = cc25_static_fixtures();
    $now = round(microtime(true) * 1000); $n = 0;
    $suffix = array('mens' => '', 'reserves' => ' Reserves', 'womens' => ' Women');
    foreach (array('mens', 'reserves', 'womens') as $team) {
        if (empty($sf[$team]['list'])) continue;
        $league = isset($sf[$team]['league']) ? $sf[$team]['league'] : 'Ardal League South East';
        $us = 'Cwmbran Celtic' . $suffix[$team];
        foreach ($sf[$team]['list'] as $rf) {
            if ($n >= 16) return;
            if (cc25_fixture_hidden($rf[1], $rf[0])) continue;
            $ms = cc25_row_kickoff_ms($rf[0], $rf[1]);
            if ($ms + 2 * 3600 * 1000 < $now) continue;
            $home = !empty($rf[2]); $opp = $rf[1];
            if ($home) {
                $loc = array('@type' => 'Place', 'name' => 'The Motazone Arena', 'address' => 'Henllys Way, Cwmbran, NP44 3FS');
            } else {
                $g = cc25_ground_of($opp);
                $loc = $g ? array('@type' => 'Place', 'name' => $g['ground'], 'address' => $g['addr']) : array('@type' => 'Place', 'name' => $opp);
            }
            cc25_jsonld(array(
                '@context' => 'https://schema.org', '@type' => 'SportsEvent',
                'name' => $home ? ($us . ' v ' . $opp) : ($opp . ' v ' . $us),
                'sport' => 'Association Football',
                'startDate' => wp_date('c', intval($ms / 1000)),
                'eventStatus' => 'https://schema.org/EventScheduled',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'location' => $loc,
                'homeTeam' => array('@type' => 'SportsTeam', 'name' => $home ? $us : $opp),
                'awayTeam' => array('@type' => 'SportsTeam', 'name' => $home ? $opp : $us),
                'organizer' => array('@type' => 'SportsOrganization', 'name' => $league),
            ));
            $n++;
        }
    }
}

/** Output SEO meta + Open Graph + Twitter + JSON-LD into <head>. */
add_action('wp_head', 'cc25_seo_head', 4);
function cc25_seo_head() {
    if (is_admin() || is_feed()) return;
    $desc = trim(wp_trim_words(cc25_seo_desc(), 26, '…'));   // ~155 chars for SERPs
    $url  = cc25_seo_url();
    $title = wp_get_document_title();
    $img  = get_stylesheet_directory_uri() . '/assets/img/hero.jpg';
    $type = 'website';
    // Page-specific share title (e.g. the match scoreline) where we have one.
    $ov = cc25_share_meta();
    if ($ov && !empty($ov['title'])) $title = $ov['title'];
    if ($ov && !empty($ov['img']))   $img  = $ov['img'];
    if ($ov && !empty($ov['type']))  $type = $ov['type'];
    if (is_singular('post')) {
        $type = 'article';
        if (has_post_thumbnail()) { $t = get_the_post_thumbnail_url(null, 'large'); if ($t) $img = $t; }
    }
    echo "\n<!-- Cwmbran Celtic SEO -->\n";
    echo '<meta name="description" content="' . esc_attr($desc) . "\">\n";
    echo '<link rel="canonical" href="' . esc_url($url) . "\">\n";
    echo '<meta property="og:site_name" content="Cwmbran Celtic AFC">' . "\n";
    echo '<meta property="og:type" content="' . esc_attr($type) . "\">\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . "\">\n";
    echo '<meta property="og:description" content="' . esc_attr($desc) . "\">\n";
    echo '<meta property="og:url" content="' . esc_url($url) . "\">\n";
    echo '<meta property="og:image" content="' . esc_url($img) . "\">\n";
    echo '<meta property="og:locale" content="en_GB">' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:site" content="@CwmbranCelticFC">' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($title) . "\">\n";
    echo '<meta name="twitter:description" content="' . esc_attr($desc) . "\">\n";
    echo '<meta name="twitter:image" content="' . esc_url($img) . "\">\n";

    cc25_jsonld(array_merge(array('@context' => 'https://schema.org'), cc25_seo_org()));

    if (is_singular('post')) {
        $art = array(
            '@context' => 'https://schema.org', '@type' => 'NewsArticle',
            'headline' => wp_strip_all_tags(get_the_title()),
            'datePublished' => get_the_date('c'),
            'dateModified' => get_the_modified_date('c'),
            'author' => array('@type' => 'Person', 'name' => cc25_byline()),
            'publisher' => array('@type' => 'Organization', 'name' => 'Cwmbran Celtic AFC', 'logo' => array('@type' => 'ImageObject', 'url' => cc25_club_logo())),
            'mainEntityOfPage' => $url,
            'description' => $desc,
        );
        if (has_post_thumbnail()) $art['image'] = array(get_the_post_thumbnail_url(null, 'large'));
        cc25_jsonld($art);
    }

    // Match-report page: a SportsEvent with the final score + line-up context.
    if (is_page() && get_post_field('post_name', get_queried_object_id()) === 'match-report') {
        $g = isset($_GET['g']) ? preg_replace('/[^0-9-]/', '', $_GET['g']) : '';
        $m = cc25_get_match($g);
        if ($m) {
            $home = !empty($m['home']); $opp = $m['opp'];
            $ct = array(
                array('@type' => 'SportsTeam', 'name' => 'Cwmbran Celtic AFC'),
                array('@type' => 'SportsTeam', 'name' => $opp),
            );
            cc25_jsonld(array(
                '@context' => 'https://schema.org', '@type' => 'SportsEvent', 'sport' => 'Football',
                'name' => $home ? ('Cwmbran Celtic v ' . $opp) : ($opp . ' v Cwmbran Celtic'),
                'startDate' => $m['date'] . (!empty($m['time']) ? 'T' . $m['time'] : ''),
                'eventStatus' => 'https://schema.org/EventScheduled',
                'homeTeam' => $ct[$home ? 0 : 1],
                'awayTeam' => $ct[$home ? 1 : 0],
                'location' => array('@type' => 'Place', 'name' => !empty($m['venue']) ? $m['venue'] : 'The Motazone Arena'),
                'description' => cc25_match_summary($m),
                'url' => $url,
            ));
        }
    }

    if (is_front_page() || (is_page() && in_array(get_post_field('post_name', get_queried_object_id()), array('fixtures', 'fixtures-results', 'fixtures-and-results'), true))) {
        cc25_seo_events();
    }
}

/** 2025-26 season results (Cymru South) — scraped from the club's match pages.
 * Each row: [date Y-m-d, isHome, opponent, Cwmbran goals, opponent goals].
 * NB the site was missing results for a few late-season home games (Trefelin,
 * Caerau, Ammanford); add them here when confirmed. */
function cc25_results_2526() {
    return array(
        array('2025-08-08', false, 'Cambrian United', 0, 4, 'https://www.cwmbranceltic.com/match/cambrian-united-vs-cwmbran-celtic-2/'),
        array('2025-08-15', true, 'Afan Lido', 1, 4, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-afan-lido-4/'),
        array('2025-08-22', false, 'Trefelin', 0, 4, 'https://www.cwmbranceltic.com/match/trefelin-vs-cwmbran-celtic-3/'),
        array('2025-08-25', true, 'Newport City', 1, 1, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-newport-city-3/'),
        array('2025-08-30', true, 'Carmarthen Town', 0, 0, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-carmarthen-town-7/'),
        array('2025-09-06', false, 'Treowen Stars', 2, 2, 'https://www.cwmbranceltic.com/match/treowen-stars-vs-cwmbran-celtic/'),
        array('2025-09-13', false, 'Aberystwyth Town', 0, 2, 'https://www.cwmbranceltic.com/match/aberystwyth-town-vs-cwmbran-celtic/'),
        array('2025-09-20', false, 'Cardiff Draconians', 2, 4, 'https://www.cwmbranceltic.com/match/cardiff-draconians-vs-cwmbran-celtic-2/'),
        array('2025-09-26', true, 'Trethomas Bluebirds', 2, 2, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-trethomas-bluebirds-3/'),
        array('2025-10-04', false, 'Cardiff Draconians', 1, 2, 'https://www.cwmbranceltic.com/match/cardiff-draconians-vs-cwmbran-celtic/'),
        array('2025-10-24', false, 'Ammanford', 1, 2, 'https://www.cwmbranceltic.com/match/ammanford-vs-cwmbran-celtic-4/'),
        array('2025-10-31', true, 'Baglan Dragons', 0, 1, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-baglan-dragons-fc-3/'),
        array('2025-11-07', false, 'Pontypridd United', 0, 7, 'https://www.cwmbranceltic.com/match/pontypridd-united-vs-cwmbran-celtic-3/'),
        array('2025-11-29', false, 'Ynyshir Albions', 0, 1, 'https://www.cwmbranceltic.com/match/ynyshir-albions-vs-cwmbran-celtic-2/'),
        array('2025-12-27', false, 'Newport City', 2, 2, 'https://www.cwmbranceltic.com/match/newport-city-vs-cwmbran-celtic-2/'),
        array('2026-01-02', true, 'Treowen Stars', 1, 2, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-treowen-stars/'),
        array('2026-01-10', false, 'Carmarthen Town', 2, 2, 'https://www.cwmbranceltic.com/match/carmarthen-town-vs-cwmbran-celtic-3/'),
        array('2026-01-16', true, 'Cardiff Draconians', 0, 1, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-cardiff-draconians/'),
        array('2026-01-30', false, 'Trethomas Bluebirds', 0, 2, 'https://www.cwmbranceltic.com/match/trethomas-bluebirds-vs-cwmbran-celtic-2/'),
        array('2026-02-14', false, 'Llantwit Major', 1, 3, 'https://www.cwmbranceltic.com/match/llantwit-major-vs-cwmbran-celtic-4/'),
        array('2026-03-06', true, 'Ynyshir Albions', 1, 3, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-ynyshir-albions-2/'),
        array('2026-03-10', true, 'Llantwit Major', 1, 3, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-llantwit-major-5/'),
        array('2026-03-17', true, 'Pontypridd United', 2, 5, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-pontypridd-united-2/'),
        array('2026-03-21', false, 'Caerau (Ely)', 0, 0, 'https://www.cwmbranceltic.com/match/caerau-ely-fc-vs-cwmbran-celtic-3/'),
        array('2026-03-24', false, 'Baglan Dragons', 0, 0, 'https://www.cwmbranceltic.com/match/baglan-dragons-fc-vs-cwmbran-celtic-3/'),
        array('2026-03-27', true, 'Cambrian United', 1, 2, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-cambrian-united-2/'),
        array('2026-04-03', false, 'Afan Lido', 1, 4, 'https://www.cwmbranceltic.com/match/afan-lido-vs-cwmbran-celtic-5/'),
        array('2026-04-11', true, 'Aberystwyth Town', 3, 1, 'https://www.cwmbranceltic.com/match/cwmbran-celtic-vs-aberystwyth-town/'),
    );
}

/* ===================== Player stats (from Comet match reports) ==============
 * Add one entry per game from the FAW Comet report. Names must match the player
 * card names. Stats (appearances, goals, assists, cards) are computed from this. */
function cc25_season_matches() {
    $records = function_exists('cc25_comet_match_records') ? cc25_comet_match_records() : array();
    $static  = cc25_season_matches_static();
    return cc25_merge_match_records($records, $static);
}

/**
 * Imported reports plus the hand-written ones they don't cover.
 *
 * A record wins where both describe the same game — it came from the FAW — but a
 * hand-written report is kept if the import has no prose of its own, because the
 * words are the part COMET cannot supply.
 *
 * Pure, so the precedence rule is testable without a database.
 */
function cc25_merge_match_records($records, $static) {
    $key = function ($m) { return ($m['team'] ?? 'mens') . '|' . ($m['date'] ?? ''); };
    $out = array();
    foreach ($records as $m) $out[$key($m)] = $m;
    foreach ($static as $m) {
        $k = $key($m);
        if (!isset($out[$k])) { $out[$k] = $m; continue; }
        // Same game from both: keep the import, but not at the cost of the words.
        if (trim((string) ($out[$k]['report'] ?? '')) === '' && trim((string) ($m['report'] ?? '')) !== '') {
            $out[$k]['report'] = $m['report'];
            if (empty($out[$k]['report_by']) && !empty($m['report_by'])) $out[$k]['report_by'] = $m['report_by'];
        }
        // Likewise the officials, which the import never has.
        foreach (array('ref', 'ar1', 'ar2') as $f) {
            if (trim((string) ($out[$k][$f] ?? '')) === '' && trim((string) ($m[$f] ?? '')) !== '') $out[$k][$f] = $m[$f];
        }
        if (empty($out[$k]['att']) && !empty($m['att'])) $out[$k]['att'] = $m['att'];
    }
    usort($out, function ($a, $b) { return strcmp($b['date'] ?? '', $a['date'] ?? ''); });
    return array_values($out);
}

/** The hand-written reports, kept as the fallback described above. */
function cc25_season_matches_static() {
    return array(
        array(
            'team' => 'reserves',
            'date' => '2026-08-07', 'time' => '19:30', 'opp' => 'Rogerstone', 'home' => false, 'cc' => 1, 'oc' => 2,
            'comp' => 'Gwent Premier Combination Cup', 'round' => 'Round 1',
            'venue' => 'Rogerstone Fugitives Stadium, Rogerstone', 'att' => 0,
            'ref' => 'Stephen Richards', 'ar1' => '', 'ar2' => '',
            'captain' => 'Ethan Hooper', 'opp_captain' => 'Ryan Cook',
            'starters' => array(
                array(1, 'Samuel Walsh', 'GK'), array(2, 'Gethin Phillips'), array(4, 'Zachary Benjamin Fry'),
                array(5, 'Rhys Jones'), array(6, 'Harri Pritchard'), array(7, 'Joe Barber'),
                array(8, 'Ethan Hooper'), array(9, 'Sam Smith'), array(10, 'Luke Betts'),
                array(11, 'Charlie Waters'), array(16, 'Jacob Cook'),
            ),
            'subs' => array(
                array(3, 'Tobias Williams-Dunne'), array(14, 'Evan Harvey'), array(15, 'Jack Shepard'),
                array(17, 'Noah Willis'), array(18, 'Daniel Madge'),
            ),
            'opp_starters' => array(
                array(19, 'Stephen Meaker', 'GK'), array(5, 'Oliver Lawson'), array(22, 'Robert Davies'),
                array(29, 'Alexander Pritchard'), array(31, 'Ryan Cook'), array(49, 'Sebastian Bowen'),
                array(63, 'Lloyd Saunders'), array(67, 'Connor Morgan'), array(68, 'Oliver Smith'),
                array(76, 'Owen Thomas'), array(95, 'Alfie Campbell'),
            ),
            'opp_subs' => array(
                array(15, 'Daniel Fraser Lewis Butler'), array(42, 'Benjamin Allcock'),
                array(53, 'Samuel Julian Ethan Cody'), array(89, 'Adam Crocker'), array(91, 'Luc Payne'),
            ),
            'subs_made' => array(
                array('min' => 52, 'off' => 'Joe Barber',           'on' => 'Evan Harvey'),
                array('min' => 57, 'off' => 'Zachary Benjamin Fry', 'on' => 'Tobias Williams-Dunne'),
                array('min' => 57, 'off' => 'Sam Smith',            'on' => 'Noah Willis'),
                array('min' => 57, 'off' => 'Charlie Waters',       'on' => 'Daniel Madge'),
            ),
            'opp_subs_made' => array(
                array('min' => 61, 'off' => 'Connor Morgan',       'on' => 'Adam Crocker'),
                array('min' => 70, 'off' => 'Robert Davies',       'on' => 'Luc Payne'),
                array('min' => 70, 'off' => 'Oliver Lawson',       'on' => 'Daniel Fraser Lewis Butler'),
                array('min' => 73, 'off' => 'Alfie Campbell',      'on' => 'Samuel Julian Ethan Cody'),
                array('min' => 78, 'off' => 'Alexander Pritchard', 'on' => 'Benjamin Allcock'),
            ),
            'goals' => array(
                array('scorer' => 'Daniel Madge', 'assist' => 'Tobias Williams-Dunne', 'min' => 59),
            ),
            'opp_goals' => array(
                array('scorer' => 'Alexander Pritchard', 'assist' => 'Robert Davies', 'min' => 7),
                array('scorer' => 'Luc Payne', 'assist' => 'Lloyd Saunders', 'min' => '90+3'),
            ),
            'cards'     => array(),
            'opp_cards' => array(),
            'staff' => array(
                array('role' => 'Coach', 'name' => 'Jacob Pritchard'),
                array('role' => 'Coach', 'name' => 'Jack Shepard'),
            ),
            'opp_staff' => array(array('role' => 'Coach', 'name' => 'Jakob Jones')),
            // From the official COMET record. No eyewitness detail — that is for
            // whoever was at Rogerstone to add.
            'report' => "The Reserves went out of the Gwent Premier Combination Cup at the first round, beaten by a goal three minutes into stoppage time at Rogerstone Fugitives Stadium.\n\nRogerstone led inside seven minutes through Alexander Pritchard, set up by Robert Davies, and Celtic spent the next hour chasing the tie. Jacob Pritchard reshuffled at the break and after — Evan Harvey on for Joe Barber on 52, then a triple change on 57 that brought on Tobias Williams-Dunne, Noah Willis and Daniel Madge.\n\nIt worked. Two minutes later Madge levelled, finishing a Williams-Dunne pass to make it 1-1 with half an hour to play, and a replay looked the likeliest outcome. Instead, in the 93rd minute, Luc Payne turned in Lloyd Saunders's ball to send Rogerstone through.\n\nHard on a side that had changed the game with its substitutions and got itself level. Ethan Hooper captained, Samuel Walsh started in goal, and referee Stephen Richards had no cards to give all evening.",
            'report_by' => '',
        ),
        array(
            'team' => 'mens',
            'date' => '2026-08-07', 'time' => '18:30', 'opp' => 'New Inn', 'home' => true, 'cc' => 2, 'oc' => 4,
            'comp' => 'Ardal League South East', 'round' => 'Round 3', 'venue' => 'The Motazone Arena, Cwmbran', 'att' => 210,
            'ref' => 'Michal Baniak', 'ar1' => 'Lucas Hoare', 'ar2' => 'Paul Albert Lewis',
            'captain' => 'Terry Obeng', 'opp_captain' => 'Luke Carwyn Jones',
            'starters' => array(
                array(13, 'Lewis Watkins', 'GK'), array(2, 'Arthur Furness'), array(3, 'Kian Saunders'),
                array(4, 'Tommy Challenger'), array(5, 'Terry Obeng'), array(6, 'Louis Cochrane'),
                array(7, 'Gabriel Howells'), array(8, 'Cameron Jenkins'), array(9, 'Rudi Griffiths'),
                array(10, 'Finlay Wood'), array(11, 'Cameron Dean'),
            ),
            'subs' => array(
                array(12, 'Charlie Donovan'), array(14, 'Elliott Hewings'), array(15, 'Daniel Camaj'), array(16, 'Ollie Walters'),
            ),
            'opp_starters' => array(
                array(1, 'Max Lewis Manson', 'GK'), array(2, 'Joel Richards'), array(3, 'Luke Carwyn Jones'),
                array(4, 'Rico David Richards'), array(5, 'Anthony Richards'), array(6, 'Jordan Taylor'),
                array(7, 'Connor Tutton-Coff'), array(8, 'Brad Baker'), array(9, 'Kobi Preston Watkins'),
                array(10, 'Alex Berrow'), array(11, 'Ethan Preston-Watkins'),
            ),
            'opp_subs' => array(
                array(12, 'C-jay Jones'), array(14, 'Joshua Loder'), array(15, 'Bayley Zac Loder'),
                array(16, 'Daniel James Clouth'), array(17, 'Benjamin Williams'),
            ),
            'subs_made' => array(
                array('min' => 46, 'off' => 'Tommy Challenger', 'on' => 'Charlie Donovan'),
                array('min' => 70, 'off' => 'Cameron Dean',     'on' => 'Daniel Camaj'),
                array('min' => 84, 'off' => 'Arthur Furness',   'on' => 'Ollie Walters'),
            ),
            'opp_subs_made' => array(
                array('min' => 64, 'off' => 'Ethan Preston-Watkins', 'on' => 'Benjamin Williams'),
                array('min' => 79, 'off' => 'Rico David Richards',   'on' => 'C-jay Jones'),
                array('min' => 79, 'off' => 'Kobi Preston Watkins',  'on' => 'Daniel James Clouth'),
                array('min' => 88, 'off' => 'Alex Berrow',           'on' => 'Bayley Zac Loder'),
                array('min' => 88, 'off' => 'Joel Richards',         'on' => 'Joshua Loder'),
            ),
            'goals' => array(
                array('scorer' => 'Rudi Griffiths', 'assist' => 'Finlay Wood', 'min' => 7),
                array('scorer' => 'Kian Saunders',  'assist' => 'Finlay Wood', 'min' => 71),
            ),
            'opp_goals' => array(
                array('scorer' => 'Alex Berrow', 'assist' => '', 'min' => 33),
                array('scorer' => 'Alex Berrow', 'assist' => 'Kobi Preston Watkins', 'min' => 41),
                array('scorer' => 'Alex Berrow', 'assist' => 'Joel Richards', 'min' => 43),
                array('scorer' => 'Brad Baker',  'assist' => 'Benjamin Williams', 'min' => 87),
            ),
            'cards' => array(
                array('player' => 'Tommy Challenger', 'type' => 'y', 'min' => 35, 'reason' => 'Persistent infringements of the Laws of the Game'),
                array('player' => 'Gabriel Howells',  'type' => 'y', 'min' => 56, 'reason' => 'Persistent infringements of the Laws of the Game'),
            ),
            'opp_cards' => array(
                array('player' => 'Rico David Richards', 'type' => 'y', 'min' => 76, 'reason' => 'Unsporting behaviour'),
            ),
            'staff' => array(
                array('role' => 'First Team Manager', 'name' => 'Samuel Lewis'),
                array('role' => 'First Team Manager', 'name' => 'Stephen Muir'),
                array('role' => 'Assistant Manager', 'name' => 'Conor James'),
                array('role' => 'First Aider', 'name' => 'Martin Ingram'),
            ),
            'opp_staff' => array(
                array('role' => 'Team Manager', 'name' => 'Gareth Richards'),
                array('role' => 'Assistant Manager', 'name' => 'Chris Perry'),
                array('role' => 'Coach', 'name' => 'Stefan Edward Allcock'),
            ),
            // Written from the official COMET record — the facts are the FAW's, the
            // eyewitness detail is not ours to invent. Expand with what was actually
            // seen from the touchline.
            'report' => "Celtic's second game of the season ended in a 4-2 home defeat to New Inn, undone by a ten-minute spell either side of the half hour in which Alex Berrow scored three times.\n\nIt had started well. Rudi Griffiths put Celtic ahead inside seven minutes, turning in a Finlay Wood delivery, and the lead held until the 33rd minute. What followed was as quick as it was costly: Berrow levelled on 33, put New Inn ahead on 41 from Kobi Preston Watkins, and completed his hat-trick two minutes later from Joel Richards. Three goals in ten minutes, and a game that had been going Celtic's way was gone.\n\nCeltic did not fold. Wood turned provider again on 71 minutes, Kian Saunders finishing to make it 3-2 with the better part of twenty minutes left. But Brad Baker settled it three minutes from time, converting Benjamin Williams's pass to restore the two-goal margin.\n\nThere is something to build on in a first half hour that produced the opening goal and in a response that got Celtic back within one. There is also a plain lesson in conceding three times in ten minutes. Sam Lewis and Stephen Muir made three changes across the evening, Charlie Donovan on at the break for Tommy Challenger, Daniel Camaj for Cameron Dean on 70 and Ollie Walters for Arthur Furness on 84.\n\nReferee Michal Baniak booked Challenger and Gabriel Howells, both for persistent infringement, with New Inn's Rico Richards cautioned late on.",
            'report_by' => '',
        ),
        array(
            'team' => 'mens',
            'date' => '2026-07-28', 'time' => '19:00', 'opp' => 'Cwmbran Town', 'home' => true, 'cc' => 3, 'oc' => 0,
            'comp' => 'Ardal League South East', 'round' => 'Round 1', 'venue' => 'The Motazone Arena, Cwmbran', 'att' => 410,
            'ref' => 'Joshua Lewis Howells', 'ar1' => 'Gavin Harris', 'ar2' => 'Joseph Williams',
            'captain' => 'Terry Obeng', 'opp_captain' => 'Aysa Al-Doori',
            // Starting XI as [shirt no, name, position?]. Events (goals/cards/subs) are
            // cross-referenced by name in the template, so names must match exactly.
            'starters' => array(
                array(1, 'Lewis Watkins', 'GK'), array(2, 'Arthur Furness'), array(3, 'Kian Saunders'),
                array(4, 'Oliver Berry'), array(5, 'Terry Obeng'), array(6, 'Lewis Cochrane'),
                array(7, 'Evan Maidment'), array(8, 'Cameron Jenkins'), array(9, 'Rudi Griffiths'),
                array(10, 'Finlay Wood'), array(11, 'Munya Mabwe'),
            ),
            'subs' => array(
                array(12, 'Elliott Hewings'), array(14, 'Charlie Donovan'), array(15, 'Tommy Challenger'),
                array(16, 'Joe Barber'), array(17, 'Jack Prosser'), array(18, 'Cameron Dean'), array(19, 'Gabriel Howells'),
            ),
            'opp_starters' => array(
                array(1, 'Adam Cueto', 'GK'), array(2, 'Kai Wint'), array(3, 'Harry Grinham'),
                array(4, 'Joseph Cashman'), array(5, 'Luke Upham'), array(6, 'Clement Junior Ebongole'),
                array(7, 'Jason Gardiner'), array(8, 'Daniel Prichard'), array(9, "Christian O'Donnell"),
                array(10, 'Lee Trundle'), array(11, 'Aysa Al-Doori'),
            ),
            'opp_subs' => array(
                array(12, 'Kristian Sean Wharton'), array(14, 'Kyle Jones'), array(15, 'Rio Evelyn'),
                array(16, 'Alex Long'), array(17, 'Lyes Mihoubi'), array(18, 'Harvey Redding'), array(19, 'Callum David Nowell'),
            ),
            'subs_made' => array(
                array('min' => 70, 'off' => 'Evan Maidment', 'on' => 'Gabriel Howells'),
                array('min' => 77, 'off' => 'Rudi Griffiths', 'on' => 'Cameron Dean'),
                array('min' => 89, 'off' => 'Kian Saunders', 'on' => 'Elliott Hewings'),
                array('min' => 89, 'off' => 'Munya Mabwe', 'on' => 'Jack Prosser'),
            ),
            'opp_subs_made' => array(
                array('min' => 46, 'off' => 'Kai Wint', 'on' => 'Callum David Nowell'),
                array('min' => 60, 'off' => 'Daniel Prichard', 'on' => 'Rio Evelyn'),
                array('min' => 60, 'off' => "Christian O'Donnell", 'on' => 'Harvey Redding'),
                array('min' => 60, 'off' => 'Harry Grinham', 'on' => 'Kristian Sean Wharton'),
                array('min' => 66, 'off' => 'Jason Gardiner', 'on' => 'Lyes Mihoubi'),
            ),
            'goals' => array(
                array('scorer' => 'Finlay Wood', 'assist' => 'Rudi Griffiths', 'min' => 50),
                array('scorer' => 'Oliver Berry', 'assist' => '', 'min' => 55, 'pen' => true),
                array('scorer' => 'Rudi Griffiths', 'assist' => 'Oliver Berry', 'min' => 61),
            ),
            'cards'     => array(),
            'opp_cards' => array(array('player' => 'Kai Wint', 'type' => 'y', 'min' => 20, 'reason' => 'Unsporting behaviour')),
            'staff' => array(
                array('role' => 'First Team Manager', 'name' => 'Samuel Lewis'),
                array('role' => 'First Team Manager', 'name' => 'Stephen Muir'),
                array('role' => 'Assistant Manager', 'name' => 'Conor James'),
                array('role' => 'First Aider', 'name' => 'Martin Ingram'),
            ),
            'opp_staff' => array(
                array('role' => 'First Team Manager', 'name' => 'Brandon Simpson'),
                array('role' => 'Assistant Manager', 'name' => 'Kristian Lee Hanbury'),
                array('role' => 'Coach', 'name' => 'Wayne Jepson'),
            ),
            'report_by' => 'John Stockwell',
            'report'    => "This local derby match at the newly sponsored Motazone Arena at Celtic Park attracted unprecedented pre-match publicity. Leading the way was the website Cwmbran Life who featured a number of articles and were first on the mark with the post-match analysis. They remarked that this was most likely the closest derby match in the world, the grounds being 40 metres apart. Two other websites, Focus On: Ardal South East and Y Clwb Pel-droed also devoted many column inches to this reunion of two clubs who last played each other in the same FAW tier 3 in 2010, then named Welsh League Division 2.\n\nBoth clubs were under new management, Celtic under Sam Lewis and Stephen Muir. Town managed by Brandon Simpson. The attendance of 410 smashed Celtic's ground record. The pitch was completely devoid of grass as a consequence of weeks and weeks of tropical weather. Town fielded ex-Swansea City striker Lee Trundle, who is two months shy of his 50th birthday. Celtic had lost 24 of last season's squad and their starting line-up contained only 3 players who played in the final game of last season. They had 9 new signings in their 18-man squad. Town started with only 2 of last season's side that lost the play-off for the final Cymru South place. For the record, no less than 12 ex-Celtic and Town players featured in Goytre FC's squad this past week.\n\nTown dominated the first half. Trundle ran down the centre channel and clipped the ball just over the intersection of the bar and post. Al-Doori brought a save from Watkins. O'Donnell's shot was cleared by Obeng for a corner and Town hit 4 shots over the bar.\n\nIn the 2nd half, on 50 minutes, Rudi Griffiths latched onto a mistake by Ebongole, sprinted down the right flank and put in a superb cross to the far post which Finlay Wood stroked home against his former club. Al-Doori cut in and shot straight at Watkins. In the 55th minute Munya Mabwe strode forward on the left, was tripped in the box and Oliver Berry made no mistake with the spot kick. Trundle shot over the bar from Gardiner's cross. In the 61st minute Berry pumped a free kick into the Town penalty area. Keeper Cueto made a terrible mess of the catch, the ball fell to Griffiths who gleefully hit the net. Trundle brought a brilliant save from Watkins who pushed the ball away for a corner. A Cameron Jenkins lob was plucked out at the far post by Cueto. Mabwe shot just over the bar. Celtic's final chance fell to Jenkins who ran through the middle but hit his shot wide of the goal.\n\nThis win was a tremendous fillip for the Celtic boys. After the trials and tribulations of last season's relegation from the Cymru South and the resultant wholesale exodus of players, Celtic have had to spread the net far and wide to recruit experienced replacements who, on this showing, have shown their calibre. Of equal importance is the development of the young talent on Celtic's books. Fourteen players in the new squad are aged 22 years or younger. They have everything to play for.",
        ),
    );
}
/** The Men's 1st Team squad, grouped by role, as [name, card-image slug].
 * Single source for the squad page and match-report player links. */
function cc25_squad_players() {
    return array(
        'Management' => array(
            array('Stephen Muir', 'stephen-muir'), array('Sam Lewis', 'sam-lewis'),
            array('Martin Ingram', 'martin-ingram'), array('Ryan Thomas', 'ryan-thomas'), array('Conor James', 'conor-james'),
        ),
        'Goalkeeper' => array(
            array('Lewis Watkins', 'lewis-watkins'),
        ),
        'Defenders' => array(
            array('Zac Fry', 'zac-fry'), array('Arthur Furness', 'arthur-furness'), array('Oliver Berry', 'oliver-berry'),
            array('Charlie Donovan', 'charlie-donovan'), array('Kian Saunders', 'kian-saunders'),
            array('Elliott Hewings', 'elliott-hewings'), array('Terry Obeng', 'terry-obeng'),
        ),
        'Midfielders' => array(
            array('Lewis Cochrane', 'lewis-cochrane'), array('Tommy Challenger', 'tommy-challenger'), array('Jack Prosser', 'jack-prosser'),
            array('Cameron Jenkins', 'cameron-jenkins'), array('Efan Fletcher', 'efan-fletcher'), array('Finlay Wood', 'finlay-wood'),
            array('Joe Barber', 'joe-barber'), array('Jonny Invernizzi', 'jonny-invernizzi'),
        ),
        'Forwards' => array(
            array('Gabriel Howells', 'gabriel-howells'), array('Evan Maidment', 'evan-maidment'), array('Rudi Griffiths', 'rudi-griffiths'),
            array('Daniel Camaj', 'daniel-camaj'), array('Munya Mabwe', 'munya-mabwe'), array('Cameron Dean', 'cameron-dean'),
        ),
    );
}
/** Card-image slug for a player name, or '' if they have no squad card. */
function cc25_player_card_slug($name) {
    $k = strtolower(trim($name));
    foreach (cc25_squad_players() as $group) {
        foreach ($group as $p) { if (strtolower($p[0]) === $k) return $p[1]; }
    }
    return '';
}

/** Aggregate player stats for the season, keyed by lower-cased name. */
function cc25_player_stats($team = 'mens') {
    $s = array();
    $touch = function (&$s, $n) {
        $k = strtolower(trim($n));
        if ($k === '') return '';
        if (!isset($s[$k])) $s[$k] = array('name' => trim($n), 'apps' => 0, 'goals' => 0, 'assists' => 0, 'yellows' => 0, 'reds' => 0);
        return $k;
    };
    foreach (cc25_season_matches() as $m) {
        // One team's stats at a time. Reserves games live in the same list, and
        // without this filter their players appear in the first team's table and
        // anyone who played for both has their appearances added together.
        if (($m['team'] ?? 'mens') !== $team) continue;
        // A player counts an appearance if they started or actually came on (not an unused sub).
        $cc25_on = array();
        foreach (($m['subs_made'] ?? array()) as $sm) { $cc25_on[strtolower(trim($sm['on']))] = true; }
        foreach (($m['starters'] ?? array()) as $p) { $k = $touch($s, $p[1]); if ($k) $s[$k]['apps']++; }
        foreach (($m['subs'] ?? array()) as $p) { if (isset($cc25_on[strtolower(trim($p[1]))])) { $k = $touch($s, $p[1]); if ($k) $s[$k]['apps']++; } }
        foreach (($m['goals'] ?? array()) as $g) {
            $k = $touch($s, $g['scorer']); if ($k) $s[$k]['goals']++;
            if (!empty($g['assist'])) { $k = $touch($s, $g['assist']); if ($k) $s[$k]['assists']++; }
        }
        foreach (($m['cards'] ?? array()) as $c) {
            $k = $touch($s, $c['player']); if (!$k) continue;
            if (($c['type'] ?? 'y') === 'r') $s[$k]['reds']++; else $s[$k]['yellows']++;
        }
    }
    return $s;
}
/** Stats for one player by name, or null. */
function cc25_player_stat($name, $team = 'mens') {
    $s = cc25_player_stats($team);
    $k = strtolower(trim($name));
    return isset($s[$k]) ? $s[$k] : null;
}
/** Season stats sorted: goals, then assists, then apps, then name. */
function cc25_player_stats_sorted($team = 'mens') {
    $s = array_values(cc25_player_stats($team));
    usort($s, function ($a, $b) {
        if ($a['goals'] !== $b['goals']) return $b['goals'] - $a['goals'];
        if ($a['assists'] !== $b['assists']) return $b['assists'] - $a['assists'];
        if ($a['apps'] !== $b['apps']) return $b['apps'] - $a['apps'];
        return strcmp($a['name'], $b['name']);
    });
    return $s;
}

/** Season matches that have a written report, most recent first. */
function cc25_match_reports($limit = 3) {
    $out = array();
    foreach (cc25_season_matches() as $m) { if (!empty($m['report'])) $out[] = $m; }
    usort($out, function ($a, $b) { return strcmp($b['date'], $a['date']); });
    return $limit ? array_slice($out, 0, $limit) : $out;
}

/** A match by date (Y-m-d), or the most recent match if the date is empty/not found. */
function cc25_get_match($date = '', $team = 'mens') {
    $ms = cc25_season_matches();
    if (!$ms) return null;
    // Date alone stopped identifying a game once more than one side played the same
    // evening — 7 August had the men home to New Inn and the Reserves away in the cup.
    foreach ($ms as $m) {
        if ($m['date'] === $date && ($m['team'] ?? 'mens') === $team) return $m;
    }
    // A bare ?g= from an older link means the men's game, which is what it always meant.
    foreach ($ms as $m) { if ($m['date'] === $date) return $m; }
    usort($ms, function ($a, $b) { return strcmp($b['date'], $a['date']); });
    return $ms[0];
}

/** Match-report URL for a game, or '' if no report exists. The team is added to
 *  the URL only when it isn't the men's first team, so every existing ?g=<date>
 *  link keeps working and keeps meaning what it meant. */
function cc25_match_report_url($date, $team = 'mens') {
    foreach (cc25_season_matches() as $m) {
        if ($m['date'] !== $date || ($m['team'] ?? 'mens') !== $team) continue;
        return add_query_arg('g', cc25_match_slug($date, $team), cc25_page_url('match-report', home_url('/')));
    }
    return '';
}

/**
 * The ?g= value identifying one game: the date, plus the team when it isn't the
 * men's first team.
 *
 * The team rides inside g rather than in its own parameter because the site sits
 * behind a CDN whose cache key includes g and ignores everything else — a second
 * parameter was silently dropped, so ?g=<date>&t=reserves served the cached men's
 * report instead. A bare date still means the men's game, so existing links keep
 * working.
 */
function cc25_match_slug($date, $team = 'mens') {
    return $team === 'mens' || $team === '' ? $date : $date . '-' . $team;
}

/** Split a ?g= value back into [date, team]. */
function cc25_parse_match_slug($g) {
    $g = strtolower(trim((string) $g));
    if (!preg_match('/^(\d{4}-\d{2}-\d{2})(?:-([a-z]+))?$/', $g, $mm)) return array('', 'mens');
    $team = $mm[2] ?? 'mens';
    if (!in_array($team, array('mens', 'reserves', 'womens'), true)) $team = 'mens';
    return array($mm[1], $team);
}
/** One-line, factual summary of a match — used for share/meta descriptions. */
function cc25_match_summary($m) {
    $home = !empty($m['home']); $opp = $m['opp'];
    $line = $home
        ? 'Cwmbran Celtic ' . intval($m['cc']) . '-' . intval($m['oc']) . ' ' . $opp
        : $opp . ' ' . intval($m['oc']) . '-' . intval($m['cc']) . ' Cwmbran Celtic';
    $s = $line . ' — ' . $m['comp'] . (!empty($m['venue']) && $home ? ' at ' . $m['venue'] : '') . '.';
    $scorers = array();
    foreach (($m['goals'] ?? array()) as $g) {
        $scorers[] = $g['scorer'] . (!empty($g['pen']) ? ' (pen)' : '') . ' ' . intval($g['min']) . "'";
    }
    if ($scorers) {
        if (count($scorers) > 1) { $last = array_pop($scorers); $join = implode(', ', $scorers) . ' and ' . $last; }
        else { $join = $scorers[0]; }
        $s .= ' Cwmbran Celtic: ' . $join . '.';
    }
    if (!empty($m['att'])) $s .= ' Att ' . intval($m['att']) . '.';
    return $s;
}
/**
 * Per-page share/meta overrides for our custom-template pages (keyed by slug),
 * so link previews describe the actual page instead of the generic site tagline.
 * Returns array('title'?=>..., 'desc'=>...) or null when there's no override.
 */
function cc25_share_meta() {
    if (!is_page()) return null;
    $slug = get_post_field('post_name', get_queried_object_id());
    switch ($slug) {
        case 'match-report':
            $g = isset($_GET['g']) ? preg_replace('/[^0-9-]/', '', $_GET['g']) : '';
            $m = cc25_get_match($g);
            if ($m) {
                $home = !empty($m['home']); $opp = $m['opp'];
                $line = $home
                    ? 'Cwmbran Celtic ' . intval($m['cc']) . '-' . intval($m['oc']) . ' ' . $opp
                    : $opp . ' ' . intval($m['oc']) . '-' . intval($m['cc']) . ' Cwmbran Celtic';
                return array('title' => $line . ' | Match Report', 'desc' => cc25_match_summary($m), 'type' => 'article');
            }
            return array('title' => 'Match Report | Cwmbran Celtic', 'desc' => 'Full match report, goals, stats and line-ups from the latest Cwmbran Celtic game.', 'type' => 'article');
        case 'fixtures': case 'fixtures-results': case 'fixtures-and-results':
            return array('desc' => "Every Cwmbran Celtic fixture and result, plus the live Ardal League South East table — First Team, Reserves and Women's, with tickets for home games.");
        case 'travel-and-ground':
            return array('desc' => 'Getting to the Motazone Arena (Celtic Park), Cwmbran — directions, free parking and matchday info for home and visiting supporters.');
        case 'away-days':
            return array('desc' => 'Travel guides to every Ardal League South East away ground — addresses, postcodes and directions for following the Celts on the road.');
        case '2025-26-archive':
            return array('desc' => "Cwmbran Celtic's 2025-26 season results in full — every scoreline, with clickable match breakdowns.");
        case 'the-celtic-bond': case 'celtic-bond': case 'bond':
            return array('desc' => 'Join the Celtic Bond and help fund Cwmbran Celtic AFC — the club lottery with cash prizes every draw. Sign up and back the Celts.');
        case 'music-shirts': case 'kit':
            return array(
                'title' => 'Music Shirts 2026/27 | Cwmbran Celtic',
                'desc'  => 'Super Furry Animals, Mogwai, Panic Shack and Loose Articles become shirt sponsors for Cwmbran Celtic — with 10% of every shirt going to Music Venue Trust. Pre-order the 2026/27 kit now.',
                'img'   => get_stylesheet_directory_uri() . '/assets/img/kit/kit-sfa.jpg',
                'type'  => 'article',
            );
    }
    return null;
}
