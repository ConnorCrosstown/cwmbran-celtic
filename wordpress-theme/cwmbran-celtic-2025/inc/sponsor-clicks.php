<?php
/**
 * Sponsor click tracking.
 *
 * Every sponsor logo on the site links to /go/<slug>, which counts the click
 * and redirects. The point is renewal: "your logo was clicked 38 times in
 * August" is a sentence the club can say, and "it's on the website" is not.
 *
 * Clicks are counted; impressions are NOT, and deliberately so — on a cached
 * site a server-side impression count under-reports by whatever share of views
 * the cache serves, and a wrong number is worse than no number.
 */
if (!defined('ABSPATH')) exit;

define('CC25_CLICKS_OPTION', 'cc25_sponsor_clicks');
define('CC25_REWRITE_VERSION', '1');

/** Where a sponsor's logo points: /go/<slug>, not the sponsor's own URL. */
function cc25_sponsor_click_url($slug) {
    return home_url('/go/' . $slug);
}

/* ---- The rewrite ------------------------------------------------------ */

add_action('init', function () {
    add_rewrite_rule('^go/([a-z0-9-]+)/?$', 'index.php?cc25_go=$matches[1]', 'top');

    // The theme had no rewrite rules before this one, so the rules stored in the
    // database do not contain it and every sponsor link 404s until they are
    // rebuilt. Flushing on every load is expensive, so it happens once per
    // version — bump CC25_REWRITE_VERSION if the rule above ever changes.
    if (get_option('cc25_rewrite_version') !== CC25_REWRITE_VERSION) {
        flush_rewrite_rules();
        update_option('cc25_rewrite_version', CC25_REWRITE_VERSION, false);
    }
});

add_filter('query_vars', function ($vars) {
    $vars[] = 'cc25_go';
    return $vars;
});

add_action('template_redirect', function () {
    $slug = get_query_var('cc25_go');
    if (!$slug) return;

    $sponsor = cc25_sponsor_by_slug($slug);
    // An unknown slug 404s rather than redirecting. The slug list is the
    // whitelist; without that this is an open redirect with the club's domain
    // on the front of it.
    if (!$sponsor || empty($sponsor['url'])) {
        global $wp_query;
        $wp_query->set_404();
        status_header(404);
        nocache_headers();
        $tpl = get_query_template('404');
        if ($tpl) include $tpl;
        exit;
    }

    if (!cc25_sponsor_is_bot($_SERVER['HTTP_USER_AGENT'] ?? '')) {
        cc25_sponsor_record_click($slug, date('Y-m'));
    }

    // Without this a caching layer can store one sponsor's redirect and serve
    // it to everyone who clicks any sponsor.
    nocache_headers();
    wp_redirect($sponsor['url'], 302);
    exit;
});

/* ---- Counting --------------------------------------------------------- */

/** Everything counted so far: slug => array('YYYY-MM' => clicks). */
function cc25_sponsor_clicks() {
    $v = get_option(CC25_CLICKS_OPTION, array());
    return is_array($v) ? $v : array();
}

function cc25_sponsor_record_click($slug, $month) {
    $all = cc25_sponsor_clicks();
    if (!isset($all[$slug])) $all[$slug] = array();
    $all[$slug][$month] = (isset($all[$slug][$month]) ? (int) $all[$slug][$month] : 0) + 1;
    // Not autoloaded: this grows with every sponsor and month, and nothing on
    // the front end reads it.
    update_option(CC25_CLICKS_OPTION, $all, false);
}

/** Crawlers and command-line fetches, which must not inflate the count. */
function cc25_sponsor_is_bot($ua) {
    if ($ua === '' || $ua === null) return true;   // no agent, no human
    return (bool) preg_match('/bot|crawl|spider|slurp|curl|wget|headless|preview|facebookexternalhit|python-requests/i', $ua);
}
