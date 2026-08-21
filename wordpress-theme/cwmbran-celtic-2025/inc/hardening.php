<?php
/**
 * Keeping the site un-breakable by the people who update it.
 *
 * The club's volunteers need to publish fixtures, results, reports and Bond
 * draws. None of that needs the ability to edit theme files — but until now a
 * single Administrator login could open Appearance > Theme File Editor and take
 * the live site down in a keystroke.
 *
 * The real fix is DISALLOW_FILE_EDIT in wp-config.php, which a theme cannot set
 * because wp-config loads first. So this does what a theme can: removes the
 * screens, blocks them if reached directly, and tells an admin how to make it
 * permanent.
 */
if (!defined('ABSPATH')) exit;

/** Drop the theme/plugin file editors from the menu. */
add_action('admin_menu', function () {
    remove_submenu_page('themes.php', 'theme-editor.php');
    remove_submenu_page('plugins.php', 'plugin-editor.php');
}, 999);

/** And refuse them if someone types the URL. Removing a menu item hides a screen;
 *  it does not protect it. */
add_action('admin_init', function () {
    global $pagenow;
    if (in_array($pagenow, array('theme-editor.php', 'plugin-editor.php'), true)) {
        wp_die(
            esc_html__('Editing theme and plugin files is disabled on this site. Ask your developer if you need a code change.', 'cc25'),
            esc_html__('Not allowed', 'cc25'),
            array('response' => 403, 'back_link' => true)
        );
    }
});

/** Belt and braces: WordPress asks this filter before showing the editors. */
add_filter('map_meta_cap', function ($caps, $cap) {
    if (in_array($cap, array('edit_themes', 'edit_plugins', 'edit_files'), true)) {
        return array('do_not_allow');
    }
    return $caps;
}, 10, 2);

/**
 * One-time nudge on the dashboard until wp-config carries the constant. Shown to
 * administrators only — an Editor can do nothing about it and shouldn't see it.
 */
add_action('admin_notices', function () {
    if (defined('DISALLOW_FILE_EDIT') && DISALLOW_FILE_EDIT) return;
    if (!current_user_can('manage_options')) return;
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'dashboard') return;
    echo '<div class="notice notice-warning"><p><strong>Cwmbran Celtic:</strong> the theme has disabled the file editors, '
       . 'but add <code>define(\'DISALLOW_FILE_EDIT\', true);</code> to <code>wp-config.php</code> to turn them off for good — '
       . 'a theme cannot do that on its own.</p></div>';
});

/* =========================================================================
 * Public-surface hardening (audit 2026-08-21, SEC-1 / SEC-2 / SEC-3)
 *
 * The audit found three weaknesses that are unremarkable alone and serious
 * together: the username of an administrator was discoverable, XML-RPC would
 * accept several hundred password guesses inside ONE request via
 * system.multicall, and the exact WordPress and plugin versions were printed
 * into every page for scanners to shortlist.
 *
 * All three are closed here. The one thing a theme cannot do is delete the
 * account called "admin" — that is a job for whoever holds the login.
 * ====================================================================== */

/**
 * XML-RPC off, completely.
 *
 * `xmlrpc_enabled` alone is not enough: it only gates the methods that
 * authenticate, so xmlrpc.php keeps answering and keeps advertising
 * system.multicall in system.listMethods. Emptying the method table is what
 * actually leaves nothing to call — including pingback.ping, which let an
 * anonymous caller make this server fetch a URL of their choosing (a traffic
 * reflector aimed at someone else, and a way to probe hosts only this server
 * can reach).
 *
 * Nothing on the site uses XML-RPC. It exists for desktop blogging clients and
 * the Jetpack mobile app, neither of which the club has ever used.
 */
add_filter('xmlrpc_enabled', '__return_false');
add_filter('xmlrpc_methods', '__return_empty_array');
add_filter('pings_open', '__return_false', 10, 2);
add_filter('wp_headers', function ($headers) {
    unset($headers['X-Pingback']);   // stop advertising the endpoint too
    return $headers;
});

/**
 * Stop handing out the list of who can log in.
 *
 * Two routes led to the same answer: the REST users collection, and ?author=1
 * which WordPress helpfully redirects to /author/<username>/. Author archives
 * are not linked from anywhere on this site and the theme has no author.php, so
 * closing them costs nothing a visitor could notice.
 */
add_filter('rest_endpoints', function ($endpoints) {
    if (is_user_logged_in()) return $endpoints;   // the admin screens need these
    unset($endpoints['/wp/v2/users']);
    unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    return $endpoints;
});

add_action('template_redirect', function () {
    if (is_user_logged_in()) return;
    if (!is_author() && !isset($_GET['author'])) return;
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
    nocache_headers();
});

/**
 * Strip <meta name="generator"> — ours and everybody else's.
 *
 * Removing WordPress's own is one remove_action. The rest are not: SportsPress
 * prints its exact version (2.7.31) from its own wp_head callback, whose name a
 * theme has no reliable way to know, and the next plugin will do the same. So
 * wp_head is buffered and the tags removed from the output, which works whoever
 * emitted them and cannot break when a plugin renames a function.
 *
 * The buffer wraps wp_head only, and touches nothing but generator tags.
 */
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');          // advertised xmlrpc.php
remove_action('wp_head', 'wlwmanifest_link');  // Windows Live Writer, dead since 2017
add_filter('the_generator', '__return_empty_string');

/** Pure, so the pattern is pinned by a test rather than eyeballed in a browser. */
function cc25_strip_generator_meta($html) {
    return preg_replace('#<meta[^>]+name=["\']generator["\'][^>]*>\s*#i', '', (string) $html);
}

add_action('wp_head', function () {
    $GLOBALS['cc25_gen_ob'] = ob_get_level() + 1;
    ob_start();
}, -PHP_INT_MAX);
add_action('wp_head', function () {
    if (empty($GLOBALS['cc25_gen_ob'])) return;
    // Close ONLY the buffer this pair opened. If a plugin opened another and left
    // it open the level is higher; if it closed ours the level is lower. Either
    // way, do nothing — the output still reaches the page, just unfiltered — and
    // never end a buffer belonging to somebody else.
    if (ob_get_level() !== (int) $GLOBALS['cc25_gen_ob']) return;
    echo cc25_strip_generator_meta((string) ob_get_clean());
    unset($GLOBALS['cc25_gen_ob']);
}, PHP_INT_MAX);

/**
 * robots.txt — remove the previous agency's crawl throttle, declare the sitemap.
 *
 * ⚠️ This filter only runs when WordPress is the one serving robots.txt. The
 * live site currently has a PHYSICAL /robots.txt ("# Installed by Nettl") which
 * the web server returns directly, so WordPress is never asked and this code
 * never runs. Delete that file and this becomes the source of truth.
 *
 * What it replaces: `Crawl-delay: 300`, five minutes between requests. Google
 * ignores it; Bing and others honour it, which put a full crawl of ~230 URLs at
 * roughly nineteen hours — so a Saturday result could go unindexed until Sunday
 * night. There was also no Sitemap line, though /wp-sitemap.xml works.
 */
function cc25_robots_txt($output, $public) {
    // "Discourage search engines" is ticked on staging copies; leave those shut.
    if (!$public) return $output;
    $out  = "User-agent: *\n";
    $out .= "Disallow: /wp-admin/\n";
    $out .= "Allow: /wp-admin/admin-ajax.php\n";
    $out .= "Disallow: /xmlrpc.php\n";
    $out .= "\nSitemap: " . home_url('/wp-sitemap.xml') . "\n";
    return $out;
}
add_filter('robots_txt', 'cc25_robots_txt', 10, 2);

/**
 * Paste-a-table parser, shared by every field where the club supplies a list.
 *
 * They already hand this data over as a pasted table, so the field is shaped like
 * one. Parsing is deliberately forgiving: a header row, stray whitespace, a
 * missing trailing column or a blank line should never cost someone their work.
 *
 * @param string $text  one record per line, columns separated by | or tab
 * @param array  $cols  column keys, in order
 * @return array        one row per line, keyed by $cols; short rows padded ''
 */
function cc25_parse_table($text, $cols) {
    $rows = array();
    $text = str_replace(array("\r\n", "\r"), "\n", (string) $text);
    foreach (explode("\n", $text) as $line) {
        $line = trim($line);
        if ($line === '') continue;
        // Tabs are what a spreadsheet paste actually produces; pipes are what
        // someone types by hand. Accept either, and a comma only if neither is
        // present (names contain commas far too often to split on them blindly).
        if (strpos($line, '|') !== false)        $parts = explode('|', $line);
        elseif (strpos($line, "\t") !== false)   $parts = explode("\t", $line);
        else                                     continue;   // one column is not a table row
        $parts = array_map('trim', $parts);
        // Skip a header row — the club's tables usually have one.
        if (count($rows) === 0 && cc25_table_looks_like_header($parts, $cols)) continue;
        $row = array();
        foreach ($cols as $i => $key) {
            $row[$key] = isset($parts[$i]) ? $parts[$i] : '';
        }
        if (implode('', $row) === '') continue;   // nothing but separators
        $rows[] = $row;
    }
    return $rows;
}

/** True when a row is column headings rather than data. */
function cc25_table_looks_like_header($parts, $cols) {
    $norm = function ($s) { return preg_replace('/[^a-z]/', '', strtolower((string) $s)); };
    $hits = 0;
    foreach ($parts as $p) {
        foreach ($cols as $c) {
            if ($norm($p) !== '' && $norm($p) === $norm($c)) { $hits++; break; }
        }
    }
    // Also catch the common wordings the keys don't match exactly.
    $words = array('bondno', 'no', 'number', 'prize', 'name', 'winner', 'paymentgroup', 'group',
                   'date', 'team', 'opponent', 'venue', 'score', 'competition');
    foreach ($parts as $p) {
        if (in_array($norm($p), $words, true)) $hits++;
    }
    return $hits >= 2;
}
