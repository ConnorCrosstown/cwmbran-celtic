<?php
/**
 * Just enough WordPress to exercise the feed client from the command line.
 *
 * Options and transients are plain arrays, so a test can age a transient out
 * (the 26-hour cache expiring is the case that broke the live table) or wind the
 * clock forward past the refresh lock without waiting for either.
 */
if (PHP_SAPI !== 'cli') exit;

if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
define('MINUTE_IN_SECONDS', 60);
define('HOUR_IN_SECONDS', 3600);

$GLOBALS['wp_options'] = array();
$GLOBALS['wp_transients'] = array();   // key => ['value' => mixed, 'expires' => int|0]
$GLOBALS['wp_now'] = 1000000000;       // test clock, in seconds
$GLOBALS['wp_http'] = array();         // queued responses for wp_remote_get
$GLOBALS['wp_http_log'] = array();     // every URL requested

function ccf_test_now($t = null) { if ($t !== null) $GLOBALS['wp_now'] = $t; return $GLOBALS['wp_now']; }
function ccf_test_advance($secs) { $GLOBALS['wp_now'] += $secs; }
function ccf_test_queue_response($resp) { $GLOBALS['wp_http'][] = $resp; }
function ccf_test_reset() {
    $GLOBALS['wp_options'] = array(); $GLOBALS['wp_transients'] = array();
    $GLOBALS['wp_http'] = array(); $GLOBALS['wp_http_log'] = array();
    $GLOBALS['wp_filters'] = array();
}

function get_option($k, $d = false) { return array_key_exists($k, $GLOBALS['wp_options']) ? $GLOBALS['wp_options'][$k] : $d; }
function update_option($k, $v) { $GLOBALS['wp_options'][$k] = $v; return true; }
function delete_option($k) { unset($GLOBALS['wp_options'][$k]); return true; }

function get_transient($k) {
    if (!isset($GLOBALS['wp_transients'][$k])) return false;
    $t = $GLOBALS['wp_transients'][$k];
    if ($t['expires'] && $t['expires'] <= $GLOBALS['wp_now']) { unset($GLOBALS['wp_transients'][$k]); return false; }
    return $t['value'];
}
function set_transient($k, $v, $ttl = 0) {
    $GLOBALS['wp_transients'][$k] = array('value' => $v, 'expires' => $ttl ? $GLOBALS['wp_now'] + $ttl : 0);
    return true;
}
function delete_transient($k) { unset($GLOBALS['wp_transients'][$k]); return true; }

class WP_Error {
    private $msg;
    public function __construct($code = '', $msg = '') { $this->msg = $msg; }
    public function get_error_message() { return $this->msg; }
}
function is_wp_error($t) { return $t instanceof WP_Error; }

function wp_remote_get($url, $args = array()) {
    $GLOBALS['wp_http_log'][] = $url;
    if (!$GLOBALS['wp_http']) return new WP_Error('http', 'No response queued');
    return array_shift($GLOBALS['wp_http']);
}
function wp_remote_retrieve_response_code($r) { return is_array($r) ? ($r['response']['code'] ?? 0) : 0; }
function wp_remote_retrieve_body($r) { return is_array($r) ? ($r['body'] ?? '') : ''; }

$GLOBALS['wp_filters'] = array();
function add_action() {} function remove_action() {}
function add_filter($tag, $cb, $prio = 10, $args = 1) { $GLOBALS['wp_filters'][$tag][] = $cb; return true; }
function apply_filters($tag, $value) {
    $args = array_slice(func_get_args(), 1);
    foreach ($GLOBALS['wp_filters'][$tag] ?? array() as $cb) {
        $args[0] = call_user_func_array($cb, $args);
    }
    return $args[0];
}
function esc_url_raw($u) { return $u; }
function wp_next_scheduled() { return false; } function wp_schedule_event() {}
function wp_clear_scheduled_hook() {} function register_activation_hook() {}
function register_deactivation_hook() {} function plugin_dir_path($f) { return dirname($f) . '/'; }
function plugin_dir_url() { return 'https://example.test/wp-content/plugins/cwmbran-celtic-feed/'; }

/** A feed payload shaped like the real one from /api/feed. */
function ccf_test_feed($points = 9, $extra = array()) {
    return array_merge(array(
        'generatedAt' => '2026-08-21T20:48:00.000Z',
        'fixtures' => array(),
        'results'  => array(array('homeTeam' => 'Cwmbran Celtic', 'awayTeam' => 'New Inn', 'team' => 'mens')),
        'tables'   => array('mens' => array(
            array('position' => 1, 'club' => 'Chepstow Town', 'played' => 3, 'won' => 3,
                  'drawn' => 0, 'lost' => 0, 'gd' => 6, 'points' => $points),
            array('position' => 2, 'club' => 'Cwmbran Celtic', 'played' => 3, 'won' => 1,
                  'drawn' => 1, 'lost' => 1, 'gd' => 0, 'points' => 4),
        )),
        'crests' => array(),
        'teams'  => array(),
    ), $extra);
}
function ccf_test_http_ok($payload) {
    return array('response' => array('code' => 200), 'body' => json_encode($payload));
}
