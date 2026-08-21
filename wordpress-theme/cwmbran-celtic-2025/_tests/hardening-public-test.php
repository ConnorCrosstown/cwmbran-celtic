<?php
/**
 * Public-surface hardening (audit SEC-1 / SEC-2 / SEC-3). Run from the theme root:
 *   php _tests/hardening-public-test.php
 *
 * The hooks themselves need WordPress, so what is pinned here is the part that
 * can be got wrong silently: the generator-stripping pattern, and the robots.txt
 * body. A too-greedy pattern that ate neighbouring tags, or a robots.txt that
 * reintroduced Crawl-delay or lost the sitemap, would look fine in a diff.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {} function remove_action() {}
function esc_html__($s) { return $s; }
function home_url($p = '') { return 'https://www.cwmbranceltic.com' . $p; }
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../inc/hardening.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/* ---- Generator stripping: both the ones we saw live, and no collateral ---- */

$head = '<link rel="profile" href="https://gmpg.org/xfn/11">' . "\n"
      . '<meta name="generator" content="WordPress 7.0.4" />' . "\n"
      . '<meta name="description" content="Official website of Cwmbran Celtic FC">' . "\n"
      . "<meta name='generator' content='SportsPress 2.7.31' />" . "\n"
      . '<link rel="canonical" href="https://www.cwmbranceltic.com/">';
$out = cc25_strip_generator_meta($head);

check('WordPress version is gone',   strpos($out, 'WordPress 7.0.4') === false);
check('SportsPress version is gone', strpos($out, 'SportsPress 2.7.31') === false);
check('single quotes are handled too', strpos($out, 'generator') === false);

// The pattern must not be greedy across tags — the classic way a regex like this
// silently eats the rest of the head.
check('the description survives',  strpos($out, 'name="description"') !== false);
check('the canonical survives',    strpos($out, 'rel="canonical"') !== false);
check('the xfn profile survives',  strpos($out, 'gmpg.org') !== false);
check('nothing else was removed',  substr_count($out, '<') === 3);

// A generator-ish word in ordinary content must not be touched.
$prose = '<p>The floodlight generator was replaced in 2019.</p>';
check('prose mentioning a generator is untouched', cc25_strip_generator_meta($prose) === $prose);
check('empty input is safe', cc25_strip_generator_meta('') === '');

/* ---- robots.txt ---- */

$robots = cc25_robots_txt('', true);
check('no crawl delay',        stripos($robots, 'crawl-delay') === false);
check('sitemap is declared',   strpos($robots, 'Sitemap: https://www.cwmbranceltic.com/wp-sitemap.xml') !== false);
check('xmlrpc is disallowed',  strpos($robots, 'Disallow: /xmlrpc.php') !== false);
check('admin-ajax stays open', strpos($robots, 'Allow: /wp-admin/admin-ajax.php') !== false);
check('no trace of Nettl',     stripos($robots, 'nettl') === false);

// A staging copy has "Discourage search engines" ticked; it must keep whatever
// WordPress was going to say rather than being handed a crawlable robots.txt.
check('a non-public site is left alone', cc25_robots_txt('KEEP ME', false) === 'KEEP ME');

echo "\n" . (count($failures) ? count($failures) . " FAILURE(S)\n" : "All checks passed\n");
exit(count($failures) ? 1 : 0);
