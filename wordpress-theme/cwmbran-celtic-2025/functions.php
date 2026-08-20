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
foreach (array('hardening', 'bond-draws', 'fixtures', 'match-reports', 'comet', 'health', 'seo', 'programmes', 'kickoff', 'sponsors', 'people', 'gallery', 'tickets') as $cc25_mod) {
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

    $bv = @filemtime($dir . '/assets/sponsor-band.js') ?: '0.1.0';
    wp_enqueue_script('cc25-sponsor-band', get_stylesheet_directory_uri() . '/assets/sponsor-band.js', array(), $bv, true);

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
        $rv = @filemtime($dir . '/assets/programme-reader.js') ?: '0.1.0';
        wp_enqueue_script('cc25-programme-reader', get_stylesheet_directory_uri() . '/assets/programme-reader.js', array(), $rv, true);
    }
}, 99);

/** PDF.js 6 ships ESM only, so the reader has to load as a module; the sponsor
 *  band imports its rotation maths, so it does too. */
add_filter('script_loader_tag', function ($tag, $handle) {
    if ($handle !== 'cc25-programme-reader' && $handle !== 'cc25-sponsor-band') return $tag;
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
            'under-18s'                  => 'template-u18s.php',
            'u18s'                       => 'template-u18s.php',
            'under-18'                   => 'template-u18s.php',
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
            'shop'                       => 'template-shop.php',
            'club-shop'                  => 'template-shop.php',
            'club-shop-2'                => 'template-shop.php',
            /* 'kit' was listed twice — once for the launch page and again for the
             * shop. The later key wins in a PHP array literal, so it silently went
             * to the shop. It stays on the shop, which is what it has been doing;
             * the launch page keeps 'music-shirts'. */
            'kit'                        => 'template-shop.php',
            'contact'                    => 'template-contact.php',
            'contact-us'                 => 'template-contact.php',
            'contacts'                   => 'template-contact.php',
            'club-contacts'              => 'template-contact.php',
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
        'under-18s'         => 'Under-18s',
        'juniors'           => 'Juniors & Minis',
        'away-days'         => 'Away Days',
        '2025-26-archive'   => '2025-26 Season',
        'match-report'      => 'Match Report',
        'music-shirts'      => 'Music Shirts',
    );
    /* Contact: the live site may already have one under any of the usual slugs, so
     * only provision when none of them exists — otherwise we'd add a second,
     * empty Contact page alongside the real one. */
    $contact_exists = false;
    foreach (array('contact', 'contact-us', 'contacts', 'club-contacts') as $c_slug) {
        if (get_page_by_path($c_slug)) { $contact_exists = true; break; }
    }
    if (!$contact_exists) $pages['contact'] = 'Contact';
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

/** Under-18s destination: the dedicated page if it exists, else straight to their
 * fixtures tab, which works with no WP page at all. */
function cc25_u18s_url() {
    $p = cc25_page_url(array('under-18s', 'u18s', 'under-18'), '');
    return $p ? $p : (cc25_page_url('fixtures', home_url('/')) . '#u18s');
}

/** Men's Vets destination: the dedicated /mens-vets/ page if it exists, else
 * the teams hub (the page is auto-provisioned, so it normally resolves). */
function cc25_vets_url() {
    $p = cc25_page_url(array('mens-vets', 'vets'), '');
    return $p ? $p : cc25_page_url('teams', home_url('/'));
}

/** Women's Reserves destination: the dedicated page if it exists, else straight
 * to their fixtures tab, which works with no WP page at all. */
function cc25_womens_res_url() {
    $p = cc25_page_url(array('womens-reserves', 'ladies-reserves'), '');
    return $p ? $p : (cc25_page_url('fixtures', home_url('/')) . '#womens_res');
}

/** Women's Under-19s destination: the dedicated page if it exists, else straight
 * to their fixtures tab, which works with no WP page at all. */
function cc25_womens_u19_url() {
    $p = cc25_page_url(array('womens-under-19s', 'womens-u19s', 'ladies-under-19s', 'ladies-u19s'), '');
    return $p ? $p : (cc25_page_url('fixtures', home_url('/')) . '#womens_u19');
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
            array("Men's Under-18s", cc25_u18s_url(), false),
            array("Men's Vets", cc25_vets_url(), false),
            array("Women's First Team", cc25_page_url(array('ladies-team', 'ladies-1st-team'), $home), false),
            array("Women's Reserves", cc25_womens_res_url(), false),
            array("Women's Under-19s", cc25_womens_u19_url(), false),
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
        'Tata Steel United' => 'tata-steel-united.png',
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
        'Penygraig United' => 'penygraig-united.png',
        // Women's U19s — Adran U19s. Already had artwork on the Next.js side.
        'Aberystwyth Town' => 'aberystwyth-town.png',
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
                array('2026-07-28', 'Cwmbran Town', true, 'League', array(3, 0)),
                array('2026-08-01', 'Tredegar Town', false, 'League'),
                array('2026-08-07', 'New Inn', true, 'League', array(2, 4)),
                array('2026-08-14', 'Abergavenny Town', false, 'League'),
                // 22 Aug league game v Risca United postponed — Welsh Cup QR2 (v
                // Newport Corinthians) takes the slot. Risca to be rearranged.
                array('2026-08-22', 'Newport Corinthians', true, 'Welsh Cup QR2'),
                array('2026-08-29', 'Cardiff Corinthians', true, 'League Cup R1'),
                array('2026-09-05', 'Penygraig United', true, 'Amateur Trophy R1'),
                array('2026-09-05', 'Goytre', true, 'League'),           // POSTPONED — the Amateur Trophy R1 tie has the date. Still hidden; needs rearranging.
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
                array('2026-08-15', 'Croesyceiliog', true, 'League', array(1, 2)),
                array('2026-08-21', 'Rogerstone', true, 'League'),
                array('2026-08-29', 'Abercarn United', false, 'League'),
                array('2026-09-05', 'Tredegar Town', false, 'League'),
                // Chepstow swapped round by the club's list of 12 Aug 2026:
                // September is the home leg now, 19 December the away one.
                array('2026-09-12', 'Chepstow Town', true, 'League'),
                array('2026-09-19', 'Cwmbran Town', true, 'League'),
                array('2026-09-26', 'Abertillery Excelsiors', true, 'League'),
                array('2026-10-03', 'New Inn', false, 'League'),
                array('2026-10-10', 'Undy', true, 'League'),
                array('2026-10-17', 'Newport Corinthians', false, 'League'),
                array('2026-10-24', 'Lliswerry', true, 'League'),
                array('2026-10-31', 'Abertillery Bluebirds', false, 'League'),
                array('2026-11-07', 'Blaenavon Blues', true, 'League'),
                array('2026-11-14', 'Blaenavon Blues', false, 'League'),
                array('2026-11-21', 'Croesyceiliog', false, 'League'),
                array('2026-11-28', 'Rogerstone', false, 'League'),
                array('2026-12-05', 'Abercarn United', true, 'League'),
                array('2026-12-12', 'Tredegar Town', true, 'League'),
                array('2026-12-19', 'Chepstow Town', false, 'League'),
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
        /* Women's Reserves. New to the site with the club's list of 11 Aug 2026.
         * SWWGL Development League, Sundays, so kick-off falls to the 2pm Sunday
         * default — ASSUMED, not confirmed by the club.
         *
         * Source is the workbook's "Womens (Reserves)" sheet alone; the master tab
         * does not list the team. Rows below the league block on that sheet are last
         * season's and are excluded.
         *
         * Their round numbers run out of order and skip 3 and 10, and rounds 4 and 6
         * are BOTH given as home on 4 October. Carried as the club has it, and raised
         * with them — see docs/2026-08-11-club-fixture-queries.md.
         * Three of these opponents have no crest and show initials. */
        'womens_res' => array(
            'league' => 'SWWGL Women\'s Development League',
            'title'  => "Women's Reserves",
            'badge'  => array('WRes', 'tk-team-w'),
            'list'   => array(
                array('2026-09-06', 'Undy', true, 'League'),
                array('2026-09-13', 'Taffs Well', false, 'League'),
                array('2026-09-27', 'Goytre', false, 'League'),
                array('2026-10-04', 'Porth Harlequins BGC', true, 'League'),
                array('2026-10-04', 'North Cardiff Cosmos', true, 'League'),  // club has two home games this day
                array('2026-10-11', 'Caerphilly Dragons', false, 'League'),
                array('2026-10-18', 'Undy', false, 'League'),
                array('2026-10-25', 'Taffs Well', true, 'League'),
                array('2026-11-08', 'Porth Harlequins BGC', false, 'League'),
                array('2026-11-15', 'Goytre', true, 'League'),
                array('2026-11-22', 'North Cardiff Cosmos', false, 'League'),
                array('2026-11-29', 'Caerphilly Dragons', true, 'League'),
                array('2026-12-06', 'Goytre', false, 'League'),
                array('2026-12-13', 'North Cardiff Cosmos', true, 'League'),
                array('2026-12-20', 'Undy', true, 'League'),
                array('2027-01-10', 'Caerphilly Dragons', false, 'League'),
                array('2027-01-17', 'Taffs Well', true, 'League'),
                array('2027-01-24', 'Porth Harlequins BGC', true, 'League'),
            ),
        ),
        /* Women's U19s. New to the site with the club's list of 11 Aug 2026, and
         * checked against the league's finalised Adran U19 schedule on 17 Aug —
         * every date and venue here matches it. Kick-offs are no longer assumed:
         * all eleven are now explicit cc25_kickoff_overrides_static() entries,
         * which is where the one exception lives (Cardiff City away is 8:00pm).
         * The list is the whole competition, not half of it — twelve clubs, a
         * single round-robin, so it genuinely ends on 20 November.
         * Five of these opponents have no crest and show initials. */
        'womens_u19' => array(
            'league' => 'Adran U19s',
            'title'  => "Women's Under-19s",
            'badge'  => array('U19', 'tk-team-w'),
            'list'   => array(
                array('2026-09-11', 'Pontypridd United', true, 'League'),
                array('2026-09-18', 'Penybont', false, 'League'),
                array('2026-09-25', 'Briton Ferry Llansawel', true, 'League'),
                array('2026-10-02', 'Barry Town United', false, 'League'),
                array('2026-10-09', 'Taffs Well', true, 'League'),
                array('2026-10-16', 'Cardiff Met', false, 'League'),
                array('2026-10-23', 'Carmarthen Town', true, 'League'),
                array('2026-10-30', 'Cascade YC', true, 'League'),
                array('2026-11-06', 'Swansea City', false, 'League'),
                array('2026-11-13', 'Aberystwyth Town', true, 'League'),
                array('2026-11-20', 'Cardiff City', false, 'League'),
            ),
        ),
        /* Under-18s. New to the site with the club's fixture list of 10 Aug 2026 — the
         * age group plays Sundays. Most of their opponents have no badge on file yet, so
         * those rows show initials until one is added. */
        'u18s' => array(
            'league' => 'Autocentre Gwent Premier Youth League – Div 1 South',
            'title'  => "Men's Under-18s",
            'badge'  => array('U18', 'tk-team-u'),
            'list'   => array(
                array('2026-09-06', 'Caldicot Town Dev', true, 'League'),
                array('2026-09-13', 'Newport Corinthians', false, 'League'),
                array('2026-09-20', 'Sifil', true, 'League'),
                array('2026-09-27', 'Monmouth Town', false, 'League'),
                array('2026-10-11', 'Chepstow Town', true, 'League'),
                array('2026-10-18', 'Abergavenny Town', false, 'League'),
                array('2026-10-25', 'Coed Eva Athletic', true, 'League'),
                array('2026-11-01', 'Croesyceiliog', false, 'League'),
                array('2026-11-08', 'Graig Villa Dino', true, 'League'),
                array('2026-11-15', 'Ponthir', false, 'League'),
                array('2026-11-22', 'Caerleon', true, 'League'),
                array('2026-11-29', 'Caldicot Town', true, 'League'),
                array('2026-12-06', 'Llanyrafon', true, 'League'),
                array('2026-12-13', 'Riverside Rovers', false, 'League'),
                array('2027-01-10', 'Riverside Rovers', true, 'League'),
                array('2027-01-17', 'Sifil', false, 'League'),
                array('2027-01-24', 'Monmouth Town', true, 'League'),
                array('2027-01-31', 'Chepstow Town', false, 'League'),
                array('2027-02-07', 'Abergavenny Town', true, 'League'),
                array('2027-02-14', 'Coed Eva Athletic', false, 'League'),
                array('2027-02-21', 'Croesyceiliog', true, 'League'),
                array('2027-02-28', 'Graig Villa Dino', false, 'League'),
                array('2027-03-07', 'Ponthir', true, 'League'),
                array('2027-03-14', 'Caerleon', false, 'League'),
                array('2027-03-21', 'Caldicot Town', false, 'League'),
                array('2027-03-28', 'Llanyrafon', false, 'League'),
                array('2027-04-04', 'Caldicot Town Dev', false, 'League'),
                array('2027-04-11', 'Newport Corinthians', true, 'League'),
            ),
        ),
        /* Men's Vets, O40s. One cup tie on the list so far. */
        'vets' => array(
            'league' => 'WVFA Over-40s',
            'title'  => "Men's Vets",
            'badge'  => array('O40', 'tk-team-v'),
            'list'   => array(
                array('2026-08-16', 'Tata Steel United', true, 'Workwear Supermarket O40s Cup (R1)', array(2, 2)),
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

function cc25_render_static_fixtures($list, $team = 'mens') {
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
        // Each row resolves its own link, so a game with its own Gigantic page goes
        // straight there. cc25_ticket_url() falls back to the promoter listing.
        $turl = function_exists('cc25_ticket_url') ? cc25_ticket_url($team, $rf[0], $home, $opp) : '';
        if ($home && $turl) {
            $tix = '<a class="mtix btn btn-gold" href="' . esc_url($turl) . '" target="_blank" rel="noopener">Buy Tickets</a>';
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
        // The shootout, when there was one, decides the badge as well as being
        // spelled out beside the competition further down this row.
        $rec  = cc25_find_match(cc25_date($r['date'], 'Y-m-d'), $team);
        $pens = $rec ? cc25_match_pens($rec) : null;
        $wdl  = cc25_wdl($us, $them, $pens);
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
            . '<div><span class="res-badge ' . $wdl . '">' . cc25_wdl_label($wdl, (bool) $pens, true) . '</span></div>'
            // The shootout is read off the match record rather than the fixture row,
            // so recording a result never has to know about it.
            . '<div class="mmeta"><div class="comp">' . esc_html($r['competition'] ?? '')
            . (($cc25_pl = cc25_pens_line($rec ?: array())) !== ''
                ? ' <span class="pens">&middot; ' . esc_html($cc25_pl) . '</span>' : '')
            . '</div><span class="ha ' . ($home ? 'h' : 'a') . '">' . ($home ? 'Home' : 'Away') . '</span>'
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
    // Named per team rather than three-way, so the Under-18s and Vets read correctly
    // on their own cards instead of both showing a bare "Cwmbran Celtic".
    $suffix = array('reserves' => ' Reserves', 'womens' => ' Women',
                    'womens_res' => " Women's Reserves", 'womens_u19' => " Women's U19s",
                    'u18s' => ' U18s', 'vets' => ' Vets');
    $ours = 'Cwmbran Celtic' . ($suffix[$team] ?? '');

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
        // This card is one specific game, so it links to that game's tickets — and only
        // if there are any. cc25_ticket_url() returns '' for a team that does not sell in
        // advance, and rendering the button regardless gave the Under-18s a Buy Tickets
        // button with an empty href.
        $turl = function_exists('cc25_fixture_ticket_url') ? cc25_fixture_ticket_url($f, $team) : cc25_ext_url('tickets');
        if ($turl !== '') {
            $out .= '<a class="btn btn-gold btn-sm" href="' . esc_url($turl) . '" target="_blank" rel="noopener">Buy Tickets</a>';
        }
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
    // Named per team rather than three-way, so the Under-18s and Vets read correctly
    // on their own cards instead of both showing a bare "Cwmbran Celtic".
    $suffix = array('reserves' => ' Reserves', 'womens' => ' Women',
                    'womens_res' => " Women's Reserves", 'womens_u19' => " Women's U19s",
                    'u18s' => ' U18s', 'vets' => ' Vets');
    $ours = 'Cwmbran Celtic' . ($suffix[$team] ?? '');

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
    // The way on to the numbers. Someone arriving on this article from Facebook
    // used to reach the end of the words and stop; the line-ups, goal timeline,
    // officials and season stats existed the whole time with nothing pointing at
    // them. Only shown when that game actually has a match-centre record, so the
    // link never leads somewhere that quietly serves a different game.
    $centre = function_exists('cc25_match_report_url') ? cc25_match_report_url($ymd, $team) : '';
    if ($centre !== '') {
        $out .= '<a class="mrh-centre" href="' . esc_url($centre) . '">'
              . 'Line-ups, goals and season stats <span aria-hidden="true">&rarr;</span></a>';
    }
    $out .= '</div>';
    return $out;
}

/**
 * "Match Report" / "Line-ups & Stats" / "Programme" buttons for a match row.
 * Renders nothing when the game has none of them, so a row never grows an empty gap.
 *
 * The match centre is only called "Line-ups & Stats" when there is also a written
 * report to tell it apart from. On its own it IS the match report, and two rows
 * offering differently-named links to the same kind of page would read as two
 * different things existing.
 */
function cc25_match_link_buttons($links) {
    $out = '';
    $report = !empty($links['report']) ? $links['report'] : '';
    $centre = !empty($links['centre']) ? $links['centre'] : '';
    if ($report !== '') {
        $out .= '<a class="mtix btn btn-navy" href="' . esc_url($report) . '">Match Report</a>';
    }
    if ($centre !== '' && $centre !== $report) {
        $out .= $report === ''
            ? '<a class="mtix btn btn-navy" href="' . esc_url($centre) . '">Match Report</a>'
            : '<a class="mtix btn btn-outline" href="' . esc_url($centre) . '">Line-ups &amp; Stats</a>';
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

/**
 * The next game AT the Motazone Arena, whoever is playing it.
 *
 * The homepage hero says "Matchday at the Motazone Arena" and counts down. It used
 * to count down to cc25_next_fixture($feed, 'mens') — the next men's game home OR
 * away — so it could promise a home matchday and be timing an away trip. It also
 * ignored the Women's first team entirely, whose home games are at the same ground.
 *
 * Both first teams, earliest home kick-off wins. Ordered by real kick-off rather
 * than the stored date, because two sides can play the same day at different times.
 */
function cc25_next_home_fixture_any($feed, $teams = array('mens', 'womens')) {
    $candidates = array();
    foreach ($teams as $t) {
        $f = cc25_next_home_fixture($feed, $t);
        if ($f) $candidates[$t] = $f;
    }
    return cc25_pick_earliest_home($candidates);
}

/**
 * Of one candidate fixture per team, the one kicking off soonest at our ground.
 *
 * Split out from cc25_next_home_fixture_any() so it can be tested: everything that
 * reaches a fixture goes through cc25_upcoming(), which deliberately merges the
 * hand-maintained fixture list into whatever the feed says. That is right for the
 * site and means a synthetic feed can't be isolated in a test — real static rows
 * outrank it. The choosing is the part worth pinning, so the choosing is pure.
 *
 * $candidates is keyed by team; the winner carries its key as 'team' so the eyebrow
 * can name the side. Away fixtures are refused rather than ranked — the hero says
 * "at the Motazone Arena", and a caller passing an away game means it has a bug.
 */
function cc25_pick_earliest_home($candidates) {
    $best = null;
    $best_ko = 0;
    foreach ($candidates as $team => $f) {
        if (!$f || !cc25_is_home($f)) continue;
        $ko = cc25_kickoff_ms($f);
        if (!$ko) continue;
        if ($best === null || $ko < $best_ko) {
            $f['team'] = is_string($team) ? $team : (isset($f['team']) ? $f['team'] : 'mens');
            $best = $f;
            $best_ko = $ko;
        }
    }
    return $best;
}

/**
 * What to call the competition in the hero eyebrow.
 *
 * Fixtures store a generic 'League' plus the team, not a league name — right for
 * the data, useless as a label. So a league game resolves to that team's actual
 * division and a cup tie keeps its own name.
 *
 * A cup tie also gets the side named: "Welsh Cup R2" alone doesn't say who is
 * playing, and with two teams feeding this line that ambiguity is new. League
 * games don't need it — the division already identifies the side.
 *
 * Returns plain text, not markup: callers escape it, and an &middot; entity in
 * here would come out of esc_html as a literal "&middot;".
 */
function cc25_fixture_comp_label($fx) {
    if (!$fx) return '';
    $team = isset($fx['team']) ? $fx['team'] : 'mens';
    $comp = trim((string) (isset($fx['competition']) ? $fx['competition'] : ''));
    $static = cc25_static_fixtures();
    $league = isset($static[$team]['league']) ? $static[$team]['league'] : '';

    if ($comp === '' || strcasecmp($comp, 'League') === 0) {
        return $league !== '' ? $league : 'Ardal League South East';
    }
    $sides = array('mens' => "Men's First Team", 'womens' => "Women's First Team");
    return ($team !== 'mens' && isset($sides[$team])) ? $sides[$team] . ' · ' . $comp : $comp;
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
            'team' => 'vets',
            'date' => '2026-08-16', 'time' => '14:00', 'opp' => 'Tata Steel United', 'home' => true, 'cc' => 2, 'oc' => 2,
            // 2-2 after ninety, won 4-3 on penalties. COMET keeps the shootout on
            // the match (homeTeamResult.penalties, penaltyWin) and not in the events,
            // where the phase is recorded but no kicks are — so a tie decided this
            // way looks exactly like a draw to anything reading the events alone.
            'pens' => array(4, 3),
            'comp' => 'Workwear Supermarket O40s Cup', 'round' => 'Round 1',
            // The printed report leaves attendance blank rather than recording a zero.
            'venue' => 'Motazone Arena, Cwmbran', 'att' => 0,
            // COMET match 108096213, cross-checked against the printed report. The API
            // carries no officials for this game and the printed report does, which is
            // where the referee comes from; shirts 2 and 6 are withheld profiles ("N/A",
            // hideProfile) that the printed report names.
            'ref' => 'Tom Wise', 'ar1' => '', 'ar2' => '',
            'captain' => 'Dean Taylor', 'opp_captain' => 'Lee McLachlan',
            'starters' => array(
                array(1, 'Paul Taylor', 'GK'), array(2, 'Jason Jones'), array(3, 'Paul Scarfi'),
                array(4, 'Dean Taylor'), array(6, 'Jonathan Lowndes'), array(7, 'Martyn Graham John Evans'),
                array(8, 'Gareth Stacey'), array(9, 'David Fullagar'), array(10, 'Sean Matthews'),
                array(11, 'Gareth Williams'), array(14, 'Michael Phillips'),
            ),
            'subs' => array(
                array(5, 'Jonathan Tattershall'), array(12, 'Kieran Masterson'), array(15, 'Peter Scarfi'),
                array(16, 'Ward Griffiths'), array(17, 'Richmond Rice'),
            ),
            'opp_starters' => array(
                array(1, 'Damian John Turner', 'GK'), array(2, 'Michael James Lewis'), array(3, 'Matthew Hare'),
                array(4, 'Simon Hanford'), array(5, 'Gavin Jeffries'), array(6, 'Lee McLachlan'),
                array(7, 'Leon Murphy'), array(8, 'Dahi Al-Wadi'), array(10, 'Richard Williams'),
                array(11, 'Matthew Johnson'), array(18, 'Anthony Cole'),
            ),
            'opp_subs' => array(
                array(14, 'Andrew Terrance Cole'), array(20, 'Gavin Chappell'),
            ),
            // Deliberately empty, not forgotten. This report records no substitutions
            // at all — the two benches are listed and the goals are timed, but who
            // came on, when, and for whom is not in the record. Peter Scarfi and
            // Gavin Chappell are known to have played because they scored; the rest
            // of both benches cannot be told apart from unused substitutes, and
            // guessing would read exactly as authoritative as the timed facts above.
            'subs_made' => array(),
            'opp_subs_made' => array(),
            'goals' => array(
                array('scorer' => 'Peter Scarfi',   'assist' => 'Gareth Stacey', 'min' => 51),
                array('scorer' => 'David Fullagar', 'assist' => 'Peter Scarfi',  'min' => '90+3'),
            ),
            'opp_goals' => array(
                array('scorer' => 'Gavin Chappell',   'assist' => 'Lee McLachlan',   'min' => 60),
                array('scorer' => 'Richard Williams', 'assist' => 'Matthew Johnson', 'min' => 80),
            ),
            'cards' => array(),
            'opp_cards' => array(),
            'staff' => array(array('role' => 'Coach', 'name' => 'Kieran Masterson')),
            'opp_staff' => array(array('role' => 'Team Manager', 'name' => 'Richard Williams')),
            // Written from the official record only. Nobody's account of the game is
            // in it, so nothing here is anybody's account of the game.
            'report' => "The Vets are through to the second round of the Workwear Supermarket O40s Cup, and they got there the hard way — level in the third minute of stoppage time through David Fullagar, then 4-3 winners on penalties at the Motazone Arena.\n\nNothing separated the sides through a goalless first half. Six minutes after the interval Peter Scarfi put Celtic ahead from Gareth Stacey's pass, and the lead lasted nine minutes: Gavin Chappell equalised on the hour, set up by the Tata Steel captain Lee McLachlan. Richard Williams turned the tie around on 80 from Matthew Johnson's ball, and with the cup exit in sight Fullagar met a Scarfi pass in the 93rd minute to force the shootout.\n\nBoth of Celtic's goals came from the same pair, and both of Tata Steel's from their substitute and their number ten. Neither referee Tom Wise nor the record shows a single card in the ninety-three minutes.\n\nDean Taylor captained the side, with Paul Taylor in goal. The official record does not name the takers — that one is for whoever was behind the goal.",
            'report_by' => '',
        ),
        array(
            'team' => 'reserves',
            'date' => '2026-08-15', 'time' => '14:30', 'opp' => 'Croesyceiliog', 'home' => true, 'cc' => 1, 'oc' => 2,
            'comp' => 'Autocentre Gwent Premier Combination League', 'round' => 'Round 1',
            'venue' => 'Motazone Arena, Cwmbran', 'att' => 0,
            // The API carries no officials for this game; the printed report does.
            'ref' => 'Shaun Colin Knox', 'ar1' => '', 'ar2' => '',
            'captain' => 'Jamie Pring', 'opp_captain' => 'Kofi Williams',
            'starters' => array(
                array(1, 'Jamie Pring', 'GK'), array(2, 'Bailey Goodall'), array(3, 'Brooklyn Lee'),
                array(5, 'Jamie Williams'), array(6, 'Evan Prosser'), array(7, 'Sam Smith'),
                array(8, 'Ethan Hooper'), array(9, 'Daniel Madge'), array(10, 'Jack Prosser'),
                array(11, 'Daniel Camaj'), array(16, 'Jacob Cook'),
            ),
            'subs' => array(
                array(4, 'Cam Williams'), array(14, 'Joe Barber'), array(15, 'Luke Betts'),
                array(17, 'Harri Pritchard'), array(18, 'Tadiwa Chidembo'),
            ),
            'opp_starters' => array(
                array(1, 'Harley James', 'GK'), array(2, 'Jake West'), array(3, 'Shay Jones'),
                array(4, 'Mak James'), array(5, 'Logan Mulcahy'), array(6, 'Evan Haines'),
                array(7, 'Kenny Hurford'), array(8, 'Kofi Williams'), array(9, 'Oscar Balkwill'),
                array(10, 'Sam Leek'), array(11, 'Hari Holtham'),
            ),
            // Oliver Williams comes from the printed report. The API returns him as
            // "N/A" with hideProfile set — a redaction, not a missing player — so an
            // import of this game would drop the name and the substitution with it.
            'opp_subs' => array(
                array(12, 'Maxwell Wright'), array(14, 'Morgan Meredith'),
                array(15, 'Oliver Williams'), array(16, 'Samuel Jackson'),
            ),
            'subs_made' => array(
                array('min' => 57, 'off' => 'Jack Prosser',  'on' => 'Joe Barber'),
                array('min' => 58, 'off' => 'Daniel Madge',  'on' => 'Luke Betts'),
                array('min' => 75, 'off' => 'Brooklyn Lee',  'on' => 'Cam Williams'),
            ),
            'opp_subs_made' => array(
                array('min' => '45+4', 'off' => 'Evan Haines',   'on' => 'Morgan Meredith'),
                array('min' => 67,     'off' => 'Mak James',     'on' => 'Maxwell Wright'),
                array('min' => 77,     'off' => 'Kenny Hurford', 'on' => 'Oliver Williams'),
            ),
            'goals' => array(
                array('scorer' => 'Sam Smith', 'assist' => 'Daniel Madge', 'min' => 11),
            ),
            'opp_goals' => array(
                array('scorer' => 'Oscar Balkwill', 'assist' => 'Sam Leek',      'min' => 37),
                array('scorer' => 'Oscar Balkwill', 'assist' => 'Kenny Hurford', 'min' => 66),
            ),
            'cards' => array(
                array('player' => 'Jamie Williams', 'type' => 'y', 'min' => 41, 'reason' => 'Unsporting behaviour'),
                array('player' => 'Bailey Goodall', 'type' => 'y', 'min' => 45, 'reason' => 'Unsporting behaviour'),
            ),
            'opp_cards' => array(
                array('player' => 'Kofi Williams', 'type' => 'y', 'min' => 20, 'reason' => 'Unsporting behaviour'),
                array('player' => 'Logan Mulcahy', 'type' => 'y', 'min' => 31, 'reason' => 'Unsporting behaviour'),
            ),
            'staff' => array(
                array('role' => 'Coach', 'name' => 'Matt Hewkins'),
                array('role' => 'Coach', 'name' => 'Jack Shepard'),
                array('role' => 'Coach', 'name' => 'Jacob Pritchard'),
            ),
            'opp_staff' => array(array('role' => 'Team Manager', 'name' => 'Wayne James')),
            // From the official COMET record. No eyewitness detail — that is for
            // whoever was at the Motazone to add.
            'report' => "Croesyceiliog turned the Reserves' league opener around at the Motazone Arena, coming from behind to take the first points of the season back down the road.\n\nCeltic led inside twelve minutes, Sam Smith finishing a Daniel Madge pass, and held the lead for the best part of half an hour while the game turned scrappy — Kofi Williams booked on 20, Logan Mulcahy on 31. Then Oscar Balkwill levelled on 37 from Sam Leek's ball, and by the break Jamie Williams and Bailey Goodall had been cautioned too. Half-time: 1-1.\n\nBalkwill got the second on 66, this time set up by Kenny Hurford. Celtic had already gone to the bench — Joe Barber on for Jack Prosser on 57, Luke Betts for Madge a minute later — and Cam Williams replaced Brooklyn Lee on 75, but the equaliser never came.\n\nJamie Pring captained the side from goal; Shaun Colin Knox refereed.",
            'report_by' => '',
        ),
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
            /* 220, not the 210 first recorded: the COMET record and John Stockwell's
             * match report agree on 220, and Connor confirmed it. */
            'comp' => 'Ardal League South East', 'round' => 'Round 3', 'venue' => 'The Motazone Arena, Cwmbran', 'att' => 220,
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
            'report' => "Celtic went into this Torfaen derby game in good spirits after their fine win last week against Cwmbran Town but fair play to New Inn. The Ardal League South East newcomers surprised their hosts with striker Alex Berrow, returning to the Pontypool club after a season away at Blaenavon Blues, scoring a hat-trick and making his tally for the season 6 goals.\n\nCeltic took the lead in the 7th minute when Rudi Griffiths met Finlay Wood’s cross from wide out on the left to firmly head the ball home. For the visitors, Baker hit a free kick wide and Tutton-Coff also shot wide. In the 33rd minute New Inn equalised. Berrow forced his way down the by-line and after a free-for-all scramble in the Celtic 6-yard box the ball fell at Berrow’s feet and he stroked the ball home from point blank range. Berrow scored a second on 41 minutes tapping a cross from the right by ex-Celtic Academy player Kobi Preston-Watkins into the net and 2 minutes later Berrow started a move from midfield and then raced into the 6-yard box unmarked to score his hat-trick goal from a cross by Joel Richards. For Celtic, Wood shot wide shortly before the break.\n\nIt was stalemate in the third quarter of the game until, on 71 minutes, Celtic reduced the arrears when Kian Saunders headed Finlay Wood’s free kick into the net for his first Celtic goal. Griffiths headed wide when well-placed in front of the New Inn goal and Baker curled a shot just wide of the far post.\n\nIn the 82nd minute a long ball out of defence was passed back to keeper Manson by Joel Richards but he played the ball short allowing Celtic substitute Daniel Camaj to flip the ball past the on-rushing keeper, who did enough to distract Camaj and the ball bounced to safety. In the 87th minute Brad Baker drove forward and exchanged passes with Ben Williams before sliding the ball into the net to make the game safe for New Inn.\n\nCeltic gave 1st team debuts to substitutes Daniel Camaj and teenagers Charlie Donovan and Ollie Walters. The game attracted another good attendance of 220. Looking at the league table, it is no surprise that the early front-runners are Chepstow Town with a 100% record but nobody was expecting bookie’s favourites Cwmbran Town to be at the foot of the table with no points from 3 games.\n\nCeltic Reserves have opted to play in the Gwent Premier Combination League this season and on Friday night they opened their programme in round 1 of the Combination Cup at Rogerstone and they lost 2-1. Their goal was scored by Daniel Madge, a newcomer from Cardiff side St Albans. Celtic’s 15-man squad included 12 teenagers aged 16 and 17.",
            'report_by' => 'John Stockwell',
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
/**
 * The Reserves squad: everyone named on a team sheet so far this season.
 *
 * Deliberately no squad number. The list was seeded from the 7 August cup tie at
 * Rogerstone, where the numbers looked permanent; the 15 August league game
 * against Croesyceiliog showed they are not. Only Ethan Hooper (8) and Jacob Cook
 * (16) wore the same shirt twice — Sam Smith went 9 to 7, Daniel Madge 18 to 9,
 * Joe Barber 7 to 14. At this level the shirts are handed out on the day, so a
 * number on a squad card would be true of one match and wrong from the next, and
 * two team sheets cannot both be honoured without printing duplicates. The number
 * a player actually wore is on each match report, which is the only place it means
 * anything. Same reasoning as cc25_vets_squad().
 *
 * Ordered alphabetically by surname, like the Vets. 'pos' is '' for everyone the
 * record doesn't place — an invented position would look exactly as authoritative
 * as a real one.
 */
function cc25_reserves_squad() {
    return array(
        array('name' => 'Joe Barber',            'pos' => ''),
        array('name' => 'Luke Betts',            'pos' => ''),
        array('name' => 'Daniel Camaj',          'pos' => ''),
        array('name' => 'Tadiwa Chidembo',       'pos' => ''),
        array('name' => 'Jacob Cook',            'pos' => ''),
        array('name' => 'Zachary Benjamin Fry',  'pos' => ''),
        array('name' => 'Bailey Goodall',        'pos' => ''),
        array('name' => 'Evan Harvey',           'pos' => ''),
        array('name' => 'Ethan Hooper',          'pos' => ''),
        array('name' => 'Rhys Jones',            'pos' => ''),
        array('name' => 'Brooklyn Lee',          'pos' => ''),
        array('name' => 'Daniel Madge',          'pos' => ''),
        array('name' => 'Gethin Phillips',       'pos' => ''),
        array('name' => 'Jamie Pring',           'pos' => 'GK'),
        array('name' => 'Harri Pritchard',       'pos' => ''),
        array('name' => 'Evan Prosser',          'pos' => ''),
        array('name' => 'Jack Prosser',          'pos' => ''),
        array('name' => 'Jack Shepard',          'pos' => ''),
        array('name' => 'Sam Smith',             'pos' => ''),
        array('name' => 'Samuel Walsh',          'pos' => 'GK'),
        array('name' => 'Charlie Waters',        'pos' => ''),
        array('name' => 'Cam Williams',          'pos' => ''),
        array('name' => 'Jamie Williams',        'pos' => ''),
        array('name' => 'Tobias Williams-Dunne', 'pos' => ''),
        array('name' => 'Noah Willis',           'pos' => ''),
    );
}

/**
 * The Under-18s squad.
 *
 * Empty on purpose: the age group joined the site with the club's fixture list of
 * 10 Aug 2026 and the player list is coming later. template-u18s.php hides its squad
 * section while this returns none, so adding players here is the only step — same
 * shape as cc25_reserves_squad(): ['no' => int, 'name' => string, 'pos' => string].
 */
function cc25_u18s_squad() {
    return array();
}

/**
 * The Men's Vets (Over-40s) squad.
 *
 * The registered WVFA squad, in the order the registration list gives them —
 * alphabetical by surname. 'id' is the player's FAW/COMET registration number,
 * kept so these players can be matched to the match record the day the Vets
 * appear in the feed; it is never shown on the page. Deliberately no 'no' or
 * 'pos': the Vets have no squad numbers on record and an invented position
 * would look exactly as authoritative as a real one.
 *
 * Names are the ones the team sheets use, not the fuller ones the registration
 * list carries, because the squad and the match record are joined on the name —
 * the same rule cc25_reserves_squad() follows, where all 25 match exactly. The
 * registration numbers above are what makes that safe to do: they, not the
 * spelling, are what identifies the player. Michael Phillips (31745) came from a
 * team sheet rather than the registration list, which had never listed him.
 */
function cc25_vets_squad() {
    return array(
        array('id' => 669586,  'name' => 'Jonathan Behr'),
        array('id' => 1062929, 'name' => 'Paul Dummett'),
        array('id' => 1305026, 'name' => 'James Edwards'),
        array('id' => 25712,   'name' => 'Martyn Graham John Evans'),
        array('id' => 1104797, 'name' => 'Ben Felvud'),
        array('id' => 34189,   'name' => 'David Fullagar'),
        array('id' => 1305030, 'name' => 'John Gibbs'),
        array('id' => 28662,   'name' => 'Ward Griffiths'),
        array('id' => 67242,   'name' => 'Matthew Holyfield'),
        array('id' => 36199,   'name' => 'Thomas Andrew James'),
        array('id' => 1305024, 'name' => 'Jason Jones'),
        array('id' => 1304676, 'name' => 'Daniel Kendall'),
        array('id' => 1283920, 'name' => 'Jonathan Lowndes'),
        array('id' => 24145,   'name' => 'Kieran Masterson'),
        array('id' => 34193,   'name' => 'Sean Matthews'),
        array('id' => 31745,   'name' => 'Michael Phillips'),
        array('id' => 14340,   'name' => 'Alexander Pritchard'),
        array('id' => 298471,  'name' => 'Andy Rees'),
        array('id' => 151731,  'name' => 'Richmond Rice'),
        array('id' => 25799,   'name' => 'Paul Scarfi'),
        array('id' => 28653,   'name' => 'Peter Scarfi'),
        array('id' => 636184,  'name' => 'Gareth Andrew Shadbolt'),
        array('id' => 22960,   'name' => 'Gareth Stacey'),
        array('id' => 68600,   'name' => 'Jonathan Tattershall'),
        array('id' => 14346,   'name' => 'Dean Taylor'),
        array('id' => 80713,   'name' => 'Paul Taylor'),
        array('id' => 1062972, 'name' => 'Gareth Williams'),
        array('id' => 670347,  'name' => 'Nicholas Wilson'),
        array('id' => 26497,   'name' => 'Robert Yapp'),
    );
}

/** Who has captained the Reserves. Marked on the squad cards. */
function cc25_reserves_captain() { return 'Ethan Hooper'; }

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
        // A substitute who scored, assisted or was booked was plainly on the pitch,
        // whether or not the change itself was recorded. Some reports list both
        // benches and time every goal but never record the substitutions — the Vets'
        // O40s Cup tie is one — and without this the man who came on and scored ends
        // the season with a goal and no appearance to have scored it in. This only
        // ever recovers an appearance the record already evidences; it never invents
        // one for a bench player who did nothing on it.
        foreach (($m['goals'] ?? array()) as $g) {
            $cc25_on[strtolower(trim($g['scorer']))] = true;
            if (!empty($g['assist'])) $cc25_on[strtolower(trim($g['assist']))] = true;
        }
        foreach (($m['cards'] ?? array()) as $c) { $cc25_on[strtolower(trim($c['player']))] = true; }
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

/**
 * Split a ?g= value back into [date, team].
 *
 * The teams come from cc25_fx_teams() rather than a list written out here. A
 * hardcoded three — mens, reserves, womens — meant any other side's report
 * quietly resolved to the men's game instead of its own, which is a wrong page
 * rather than a missing one. The pattern matches every key that registry can
 * hold, digits and underscores included, so "u18s" and "womens_res" survive the
 * round trip as well as "vets".
 */
function cc25_parse_match_slug($g) {
    $g = strtolower(trim((string) $g));
    if (!preg_match('/^(\d{4}-\d{2}-\d{2})(?:-([a-z][a-z0-9_]*))?$/', $g, $mm)) return array('', 'mens');
    $team  = isset($mm[2]) && $mm[2] !== '' ? $mm[2] : 'mens';
    $teams = function_exists('cc25_fx_teams') ? array_keys(cc25_fx_teams()) : array('mens', 'reserves', 'womens');
    if (!in_array($team, $teams, true)) $team = 'mens';
    return array($mm[1], $team);
}

/**
 * A match minute as it should read: "51", or "90+3" for stoppage time.
 *
 * intval() was doing this job, which is safe but lossy — it turned a 90+3rd
 * minute equaliser into a 90th minute one. Anything that isn't a minute, or a
 * minute plus stoppage time, still comes back as a plain integer, so this stays
 * safe to print.
 */
function cc25_min_label($min) {
    if (preg_match('/^\s*(\d{1,3})\s*\+\s*(\d{1,2})\s*$/', (string) $min, $mm)) {
        return $mm[1] . '+' . $mm[2];
    }
    return (string) intval($min);
}

/** The characters a ?g= may legitimately contain, given the slug format above. */
function cc25_clean_match_slug($g) {
    return preg_replace('/[^0-9a-z_-]/', '', strtolower((string) $g));
}

/**
 * The [date, team] this request's ?g= names, or ['', 'mens'] when there is none.
 *
 * One place, because the canonical URL, the share preview and the schema each
 * used to strip ?g= down to digits and dashes and then ask for "that date". That
 * threw the team away, so every non-men's report advertised a different game
 * than the one on the page — the Reserves' Rogerstone tie described itself as
 * the Croesyceiliog match, which was simply the newest game in the list.
 */
function cc25_request_match_slug() {
    if (!isset($_GET['g'])) return array('', 'mens');
    return cc25_parse_match_slug(cc25_clean_match_slug($_GET['g']));
}
/**
 * The match record for exactly this game, or null.
 *
 * cc25_get_match() is for the report page, where a bare or unknown ?g= should
 * still show something, so it falls back to the most recent game. Anything asking
 * "is there a record for this row?" needs the opposite answer, or a game with no
 * record quietly borrows the newest one's details.
 */
function cc25_find_match($date, $team = 'mens') {
    foreach (cc25_season_matches() as $m) {
        if (($m['date'] ?? '') === $date && ($m['team'] ?? 'mens') === $team) return $m;
    }
    return null;
}

/**
 * A match's penalty shootout as [ours, theirs], or null if there wasn't one.
 *
 * A cup tie settled on penalties is still officially a draw, so the score and the
 * W/D/L badge stay as they were after ninety minutes. What must never happen is
 * the site showing only that draw: the Vets went out of the Motazone having won
 * the tie, and a bare 2-2 says the opposite of what happened.
 */
function cc25_match_pens($m) {
    $p = $m['pens'] ?? array();
    if (!is_array($p) || count($p) < 2) return null;
    if ((int) $p[0] === 0 && (int) $p[1] === 0) return null;
    return array((int) $p[0], (int) $p[1]);
}

/**
 * Win, draw or loss — with a shootout deciding a level score.
 *
 * A tie settled on penalties is officially a draw, and the site said so on every
 * badge: the Vets went out of the Motazone having knocked Tata Steel United out
 * of the cup and the front page called it a DRAW. Nobody reads a badge as a
 * statement about competition regulations; they read it as who won.
 *
 * Safe to apply everywhere a badge is drawn, because a shootout cannot happen in
 * a league game — so no league record can be changed by this.
 *
 * @return string 'w' | 'd' | 'l'
 */
function cc25_wdl($us, $them, $pens = null) {
    $us = (int) $us; $them = (int) $them;
    if ($us > $them) return 'w';
    if ($us < $them) return 'l';
    if (is_array($pens) && count($pens) >= 2 && (int) $pens[0] !== (int) $pens[1]) {
        return (int) $pens[0] > (int) $pens[1] ? 'w' : 'l';
    }
    return 'd';
}

/** The badge's words. "(PENS)" is never dropped — a WIN beside a 2-2 has to say
 *  how, or it reads as the scoreline being wrong. */
function cc25_wdl_label($wdl, $on_pens = false, $short = false) {
    if ($short) return strtoupper($wdl) . ($on_pens ? '<sup>P</sup>' : '');
    $word = $wdl === 'w' ? 'WIN' : ($wdl === 'l' ? 'LOSS' : 'DRAW');
    return $word . ($on_pens ? ' (PENS)' : '');
}

/** "Cwmbran Celtic won 4-3 on penalties", or '' when there was no shootout. */
function cc25_pens_line($m) {
    $p = cc25_match_pens($m);
    if (!$p) return '';
    $weWon = $p[0] > $p[1];
    return ($weWon ? 'Cwmbran Celtic' : ($m['opp'] ?? 'The visitors'))
         . ' won ' . max($p[0], $p[1]) . '-' . min($p[0], $p[1]) . ' on penalties';
}

/** One-line, factual summary of a match — used for share/meta descriptions. */
function cc25_match_summary($m) {
    $home = !empty($m['home']); $opp = $m['opp'];
    $line = $home
        ? 'Cwmbran Celtic ' . intval($m['cc']) . '-' . intval($m['oc']) . ' ' . $opp
        : $opp . ' ' . intval($m['oc']) . '-' . intval($m['cc']) . ' Cwmbran Celtic';
    $pens = cc25_pens_line($m);
    if ($pens !== '') $line .= ' (' . $pens . ')';
    $s = $line . ' — ' . $m['comp'] . (!empty($m['venue']) && $home ? ' at ' . $m['venue'] : '') . '.';
    $scorers = array();
    foreach (($m['goals'] ?? array()) as $g) {
        $scorers[] = $g['scorer'] . (!empty($g['pen']) ? ' (pen)' : '') . ' ' . cc25_min_label($g['min']) . "'";
    }
    if ($scorers) {
        if (count($scorers) > 1) { $last = array_pop($scorers); $join = implode(', ', $scorers) . ' and ' . $last; }
        else { $join = $scorers[0]; }
        $s .= ' Cwmbran Celtic: ' . $join . '.';
    }
    if (!empty($m['att'])) $s .= ' Att ' . intval($m['att']) . '.';
    return $s;
}
/** URL of a share card in assets/img/share/. Every card in there is 1200x630,
 *  which is why cc25_seo_head() can state og:image:width/height without asking
 *  the filesystem — see CC25_SHARE_W/H. */
function cc25_share_img($file) {
    return get_stylesheet_directory_uri() . '/assets/img/share/' . $file;
}

/** Every share card is cut to this. Facebook and WhatsApp only commit to the
 *  big card layout when the dimensions are declared, so they always are. */
define('CC25_SHARE_W', 1200);
define('CC25_SHARE_H', 630);

/** The share card for a team's match report, keyed exactly like cc25_fx_teams().
 *  Each card carries that team's own league badge, which is the whole reason
 *  one shared card for all seven sides was never good enough. */
function cc25_share_match_img($team) {
    $teams = array_keys(cc25_fx_teams());
    $key = in_array($team, $teams, true) ? $team : 'mens';
    return cc25_share_img('match-report-' . $key . '.jpg');
}

/**
 * Share copy and card for every page that isn't a post, keyed by slug.
 *
 * A page can be reached by more than one slug — the site has carried
 * 'sponsors' and 'sponsors-2' for years, and the squad pages answer to two or
 * three names each — so slugs are listed as arrays and flattened once, rather
 * than duplicating the copy per alias.
 *
 * Anything not listed falls through to cc25_share_meta()'s generic card, so a
 * new page is never worse off than the old shared-hero behaviour.
 */
function cc25_share_pages() {
    static $flat = null;
    if ($flat !== null) return $flat;

    $rows = array(
        /* No league named on the all-teams pages. The seven sides play in seven
         * different competitions, so naming one described the men's first team
         * and misdescribed the other six. */
        array(array('fixtures', 'fixtures-results', 'fixtures-and-results'), 'page-fixtures.jpg',
            'Every Cwmbran Celtic fixture and result across all seven teams, with live league tables and tickets for home games.'),
        array(array('news'), 'page-news.jpg',
            'Match reports, transfer news, club announcements and everything else happening at Cwmbran Celtic FC.'),
        array(array('teams'), 'page-teams.jpg',
            "All seven Cwmbran Celtic sides — Men's First Team and Reserves, Women's First Team, Reserves and Under-19s, Under-18s and Vets."),
        array(array('travel', 'travel-and-ground'), 'page-travel.jpg',
            'Getting to the Motazone Arena (Celtic Park), Cwmbran — directions, free parking and matchday info for home and visiting supporters.'),
        /* template-away-days.php covers mens, reserves and womens only — three
         * teams in three leagues — so this names the teams, not a league. */
        array(array('away-days'), 'page-away-days.jpg',
            "Travel guides to every away ground for the First Team, Reserves and Women's — addresses, postcodes and directions for following the Celts on the road."),
        array(array('the-celtic-bond', 'celtic-bond', 'bond'), 'page-celtic-bond.jpg',
            'Join the Celtic Bond and help fund Cwmbran Celtic FC — the club lottery with cash prizes every draw. Sign up and back the Celts.'),
        array(array('bond-results'), 'page-bond-results.jpg',
            'Every Celtic Bond draw result — winning numbers and prize amounts, draw by draw.'),
        array(array('sponsors', 'sponsors-2'), 'page-sponsors.jpg',
            'The businesses backing Cwmbran Celtic FC. Meet the sponsors who keep the Celts on the pitch.'),
        array(array('sponsorship', 'sponsorship-opportunities'), 'page-sponsorship.jpg',
            'Sponsor Cwmbran Celtic FC — shirt, board, matchball and player sponsorship packages for local businesses in Torfaen and Gwent.'),
        array(array('shop'), 'page-shop.jpg',
            'The official Cwmbran Celtic club shop — replica shirts, training wear, hoodies and accessories for seniors and juniors.'),
        array(array('contact'), 'page-contact.jpg',
            'Get in touch with Cwmbran Celtic FC — club contacts, the Motazone Arena address, and how to reach the committee.'),
        array(array('hospitality'), 'page-hospitality.jpg',
            'Matchday hospitality at the Motazone Arena — packages for supporters, sponsors and groups at Cwmbran Celtic.'),
        array(array('galleries', 'gallery', 'photo-gallery'), 'page-gallery.jpg',
            'Match photography from across the season — every Cwmbran Celtic gallery in one place.'),
        array(array('juniors'), 'page-juniors.jpg',
            'The Cwmbran Celtic junior section — age groups, training, and how to get your child playing for the Celts.'),
        array(array('walking-football'), 'page-walking-football.jpg',
            'Walking football at Cwmbran Celtic — a slower game, the same club. Sessions, times and how to join in.'),
        array(array('programme', 'cwmbran-celtic-fc-match-day-programme-digital'), 'page-programme.jpg',
            'Read the Cwmbran Celtic matchday programme online — line-ups, features and the story of the season, issue by issue.'),
        array(array('2025-26-archive'), 'page-archive.jpg',
            "Cwmbran Celtic's 2025-26 season results in full — every scoreline, with clickable match breakdowns."),
        array(array('2024-25-archive', '2023-24-archive', '2022-23-archive'), 'page-archive.jpg',
            'Cwmbran Celtic season results in full — every scoreline from the archive, season by season.'),
        array(array('club-history', 'club-documents', 'heritage', 'club'), 'page-club.jpg',
            'Cwmbran Celtic FC — founded 1924, Fraternitas in Ludus. Club history, heritage and official documents.'),
        array(array('tickets'), 'page-tickets.jpg',
            'Tickets for Cwmbran Celtic home games at the Motazone Arena — book online before matchday.'),

        /* Squad pages get the team's own card, so /mens-team/ never shares a
         * graphic that reads "MATCH REPORT". */
        array(array('mens', 'mens-team', 'mens-1st-team'), 'page-squad-mens.jpg',
            "The Cwmbran Celtic Men's First Team squad — players, positions and squad numbers for the Ardal League South East campaign."),
        array(array('mens-reserves'), 'page-squad-reserves.jpg',
            "The Cwmbran Celtic Men's Reserves squad — players and squad numbers for the Gwent Premier Combination League."),
        array(array('ladies', 'ladies-team', 'ladies-1st-team', 'womens', 'womens-team'), 'page-squad-womens.jpg',
            "The Cwmbran Celtic Women's First Team squad — players, positions and squad numbers for the Genero Adran South."),
        array(array('womens-reserves'), 'page-squad-womens_res.jpg',
            "The Cwmbran Celtic Women's Reserves squad — players and squad numbers for the SWWGL Women's Development League."),
        array(array('womens-under-19s'), 'page-squad-womens_u19.jpg',
            "The Cwmbran Celtic Women's Under-19s squad — players and squad numbers for the Adran U19s."),
        array(array('under-18s'), 'page-squad-u18s.jpg',
            "The Cwmbran Celtic Men's Under-18s squad — players and squad numbers for the Autocentre Gwent Premier Youth League – Div 1 South."),
        array(array('mens-vets'), 'page-squad-vets.jpg',
            "The Cwmbran Celtic Men's Vets squad — the Over-40s side in the WVFA Over-40s."),
    );

    $flat = array();
    foreach ($rows as $row) {
        list($slugs, $img, $desc) = $row;
        foreach ($slugs as $s) $flat[$s] = array('img' => cc25_share_img($img), 'desc' => $desc);
    }
    return $flat;
}

/**
 * Per-page share/meta overrides, so link previews describe and picture the
 * actual page instead of the generic site tagline over one shared photo of the
 * corner flag.
 *
 * Returns array('title'?, 'desc'?, 'img'?, 'type'?) — never null for a page,
 * because a page with no entry still deserves a club card rather than the hero.
 */
function cc25_share_meta() {
    if (is_front_page()) {
        return array('img' => cc25_share_img('page-home.jpg'));
    }
    if (!is_page()) return null;
    $slug = get_post_field('post_name', get_queried_object_id());

    switch ($slug) {
        case 'match-report':
            list($cc25_sg, $cc25_st) = cc25_request_match_slug();
            $m = cc25_get_match($cc25_sg, $cc25_st);
            /* The card follows the team, and the team comes off the match we
             * actually resolved — not off the URL. A bare ?g=<date> means the
             * men's game to cc25_request_match_slug(), but cc25_get_match()
             * will still hand back a Vets or Women's fixture when that's the
             * only game on the date, and the card has to agree with it. */
            $img = cc25_share_match_img($m ? ($m['team'] ?? $cc25_st) : $cc25_st);
            if ($m) {
                $home = !empty($m['home']); $opp = $m['opp'];
                $line = $home
                    ? 'Cwmbran Celtic ' . intval($m['cc']) . '-' . intval($m['oc']) . ' ' . $opp
                    : $opp . ' ' . intval($m['oc']) . '-' . intval($m['cc']) . ' Cwmbran Celtic';
                return array('title' => $line . ' | Match Report', 'desc' => cc25_match_summary($m), 'img' => $img, 'type' => 'article');
            }
            return array('title' => 'Match Report | Cwmbran Celtic', 'desc' => 'Full match report, goals, stats and line-ups from the latest Cwmbran Celtic game.', 'img' => $img, 'type' => 'article');

        case 'music-shirts': case 'kit':
            return array(
                'title' => 'Music Shirts 2026/27 | Cwmbran Celtic',
                'desc'  => 'Super Furry Animals, Mogwai, Panic Shack and Loose Articles become shirt sponsors for Cwmbran Celtic — with 10% of every shirt going to Music Venue Trust. Pre-order the 2026/27 kit now.',
                /* The kit shot, recut to 1200x630 — everything cc25_share_img()
                 * hands back is that size, which is what lets the head state
                 * og:image:width/height for any of them without checking. */
                'img'   => cc25_share_img('page-music-shirts.jpg'),
                'type'  => 'article',
            );
    }

    $pages = cc25_share_pages();
    if (isset($pages[$slug])) return $pages[$slug];

    /* An unlisted page — a one-off, or one added since this table was written.
     * It gets the club card and keeps whatever description cc25_seo_desc()
     * builds from its title, which is still better than the corner flag. */
    return array('img' => cc25_share_img('page-default.jpg'));
}
