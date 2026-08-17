<?php
/**
 * Search and answer-engine metadata: descriptions, canonical URLs, the
 * organisation and event JSON-LD, and the <head> block.
 *
 * Lifted verbatim out of functions.php, which had grown past 2,700 lines — the
 * size at which a one-line edit is riskier than it should be. Nothing here
 * changed in the move.
 */
if (!defined('ABSPATH')) exit;

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
            // onto the bare page). Rebuilt from the parsed slug, so the team stays
            // in it: stripping g to digits pointed every non-men's report's
            // canonical at a different game.
            if (is_page() && get_post_field('post_name', get_queried_object_id()) === 'match-report' && !empty($_GET['g'])) {
                list($cc25_cg, $cc25_ct) = cc25_request_match_slug();
                if ($cc25_cg !== '') $u = add_query_arg('g', cc25_match_slug($cc25_cg, $cc25_ct), $u);
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
    // Anything with no card of its own — an archive, a search page, a 404 — gets
    // the club card. It used to get a photograph of the corner flag, which said
    // nothing about the page and was the same on every link the club shared.
    $img  = cc25_share_img('page-default.jpg');
    $imgw = CC25_SHARE_W;
    $imgh = CC25_SHARE_H;
    $type = 'website';
    // Page-specific share title (e.g. the match scoreline) where we have one.
    $ov = cc25_share_meta();
    if ($ov && !empty($ov['title'])) $title = $ov['title'];
    if ($ov && !empty($ov['img']))   $img  = $ov['img'];
    if ($ov && !empty($ov['type']))  $type = $ov['type'];
    if (is_singular('post')) {
        $type = 'article';
        // A post's featured image is the best card it can have — it's the
        // per-team match-report graphic on a report, the artwork on anything
        // else. Without one it falls back to the news card, never the hero.
        $src = has_post_thumbnail() ? wp_get_attachment_image_src(get_post_thumbnail_id(), 'large') : false;
        if ($src && !empty($src[0])) {
            $img  = $src[0];
            $imgw = (int) $src[1];
            $imgh = (int) $src[2];
        } else {
            $img = cc25_share_img('page-news.jpg');
        }
    }
    // og:image:alt describes the card, not the page — screen-reader users get
    // the headline from og:title either way.
    $imgalt = 'Cwmbran Celtic AFC';
    echo "\n<!-- Cwmbran Celtic SEO -->\n";
    echo '<meta name="description" content="' . esc_attr($desc) . "\">\n";
    echo '<link rel="canonical" href="' . esc_url($url) . "\">\n";
    echo '<meta property="og:site_name" content="Cwmbran Celtic AFC">' . "\n";
    echo '<meta property="og:type" content="' . esc_attr($type) . "\">\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . "\">\n";
    echo '<meta property="og:description" content="' . esc_attr($desc) . "\">\n";
    echo '<meta property="og:url" content="' . esc_url($url) . "\">\n";
    echo '<meta property="og:image" content="' . esc_url($img) . "\">\n";
    // Declared dimensions are what make Facebook and WhatsApp commit to the big
    // card on first scrape instead of guessing, or rendering a thumbnail.
    if ($imgw > 0 && $imgh > 0) {
        echo '<meta property="og:image:width" content="' . intval($imgw) . "\">\n";
        echo '<meta property="og:image:height" content="' . intval($imgh) . "\">\n";
    }
    echo '<meta property="og:image:alt" content="' . esc_attr($imgalt) . "\">\n";
    echo '<meta property="og:locale" content="en_GB">' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:site" content="@CwmbranCelticFC">' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($title) . "\">\n";
    echo '<meta name="twitter:description" content="' . esc_attr($desc) . "\">\n";
    echo '<meta name="twitter:image" content="' . esc_url($img) . "\">\n";
    echo '<meta name="twitter:image:alt" content="' . esc_attr($imgalt) . "\">\n";

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
        list($g, $gt) = cc25_request_match_slug();
        $m = cc25_get_match($g, $gt);
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
