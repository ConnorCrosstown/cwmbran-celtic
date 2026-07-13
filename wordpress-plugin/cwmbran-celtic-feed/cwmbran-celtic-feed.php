<?php
// wordpress-plugin/cwmbran-celtic-feed/cwmbran-celtic-feed.php
/**
 * Plugin Name: Cwmbran Celtic Live Feed
 * Description: Pulls fixtures, results and league table from the Cwmbran Celtic data feed and renders them via shortcodes.
 * Version: 1.0.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) exit;

define('CCF_DIR', plugin_dir_path(__FILE__));
define('CCF_URL', plugin_dir_url(__FILE__));

require_once CCF_DIR . 'includes/class-ccf-client.php';
require_once CCF_DIR . 'includes/class-ccf-render.php';
require_once CCF_DIR . 'includes/class-ccf-shortcodes.php';
require_once CCF_DIR . 'includes/class-ccf-admin.php';

// Hourly cron -> refresh cache.
add_action('ccf_hourly_refresh', ['CCF_Client', 'refresh']);

register_activation_hook(__FILE__, function () {
    if (!wp_next_scheduled('ccf_hourly_refresh')) {
        wp_schedule_event(time() + 60, 'hourly', 'ccf_hourly_refresh');
    }
});
register_deactivation_hook(__FILE__, function () {
    wp_clear_scheduled_hook('ccf_hourly_refresh');
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('ccf', CCF_URL . 'assets/ccf.css', [], '1.0.0');
});

CCF_Shortcodes::register();
CCF_Admin::register();
