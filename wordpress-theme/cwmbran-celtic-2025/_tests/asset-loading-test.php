<?php
/**
 * Which third-party assets a page is allowed to shed. Run from the theme root:
 *   php _tests/asset-loading-test.php
 *
 * Dequeuing is the kind of change that looks free and occasionally costs you a
 * page's styling. The gate below decides whether SportsPress's four stylesheets,
 * dataTables and Roboto load — and getting it wrong means an unstyled league
 * table on a season archive, which nobody notices until a supporter does.
 *
 * So the rule is: it must FAIL SAFE. Every "don't know" answers yes.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {} function add_filter() {} function remove_action() {}
function get_transient() { return false; } function set_transient() {}
function date_i18n($fmt, $ts = null) { return date($fmt, $ts === null ? time() : $ts); }
function esc_url($u) { return htmlspecialchars((string) $u, ENT_QUOTES); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES); }
function esc_html__($s) { return $s; }
function add_query_arg($k, $v, $u) { return $u . (strpos($u, '?') === false ? '?' : '&') . $k . '=' . rawurlencode($v); }
function home_url($p = '') { return 'https://www.cwmbranceltic.com' . $p; }
function get_page_by_path($s) { return null; }
function get_permalink($p = 0) { return 'https://www.cwmbranceltic.com/x/'; }
function get_stylesheet_directory_uri() { return 'https://www.cwmbranceltic.com/wp-content/themes/cwmbran-celtic-2025'; }
function get_stylesheet_directory() { return dirname(__DIR__); }

class WP_Post { public $post_type = 'page'; public $post_content = ''; }
$GLOBALS['cc25_t_obj'] = null;
$GLOBALS['cc25_t_admin'] = false;
$GLOBALS['cc25_t_feed'] = false;
function get_queried_object() { return $GLOBALS['cc25_t_obj']; }
function is_admin() { return $GLOBALS['cc25_t_admin']; }
function is_feed() { return $GLOBALS['cc25_t_feed']; }

if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}
function page($content, $type = 'page') {
    $p = new WP_Post(); $p->post_type = $type; $p->post_content = $content;
    $GLOBALS['cc25_t_obj'] = $p;
    return cc25_page_uses_sportspress();
}

/* ---- Pages that DO use it must keep their assets ---- */

check('a league table shortcode keeps SportsPress',
    page('<p>Final standings.</p>[league_table id="812"]'));
check('an event list keeps it',        page('[event_list id="9"]'));
check('an event blocks grid keeps it', page('[event_blocks id="9"]'));
check('a player list keeps it',        page('[player_list id="4"]'));
check('a tournament bracket keeps it', page('[tournament_bracket id="7"]'));
check('a countdown keeps it',          page('[countdown id="3"]'));
check('the block editor form keeps it', page('<!-- wp:sportspress/league-table {"id":812} /-->'));
check('raw SportsPress markup keeps it', page('<div class="sp-template sp-template-league-table">'));
check('case does not matter',          page('[League_Table id="812"]'));

// A SportsPress match, club or player page renders through the plugin's own
// templates, so there is no shortcode in the content to find.
check('a SportsPress match page keeps it', page('', 'sp_event'));
check('a SportsPress club page keeps it',  page('Anything at all', 'sp_team'));

/* ---- Pages that do not, and can be read, may shed them ---- */

check('an ordinary news post sheds it',
    !page('<p>The Reserves edged out Goytre on Saturday.</p>', 'post'));
check('a plain page sheds it',
    !page('<h2>Directions to the ground</h2><p>Off Henllys Way.</p>'));
check('a mention of the word sport is not enough',
    !page('<p>Sport in Cwmbran has a long history.</p>'));

/* ---- Fail safe: every unknown answers yes ---- */

$GLOBALS['cc25_t_obj'] = null;
check('an archive or 404 with no post keeps it', cc25_page_uses_sportspress());

check('empty content keeps it — a page builder we cannot read', page(''));

$GLOBALS['cc25_t_obj'] = new WP_Post();
$GLOBALS['cc25_t_admin'] = true;
check('the admin keeps it', cc25_page_uses_sportspress());
$GLOBALS['cc25_t_admin'] = false;

$GLOBALS['cc25_t_feed'] = true;
check('a feed keeps it', cc25_page_uses_sportspress());
$GLOBALS['cc25_t_feed'] = false;

echo "\n" . (count($failures) ? count($failures) . " FAILURE(S)\n" : "All checks passed\n");
exit(count($failures) ? 1 : 0);
