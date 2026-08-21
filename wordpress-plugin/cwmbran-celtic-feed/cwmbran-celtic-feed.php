<?php
// wordpress-plugin/cwmbran-celtic-feed/cwmbran-celtic-feed.php
/**
 * Plugin Name: Cwmbran Celtic Live Feed
 * Description: Pulls fixtures, results and league table from the Cwmbran Celtic data feed and renders them via shortcodes.
 * Version: 1.1.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) exit;

define('CCF_DIR', plugin_dir_path(__FILE__));
define('CCF_URL', plugin_dir_url(__FILE__));

require_once CCF_DIR . 'includes/class-ccf-client.php';
require_once CCF_DIR . 'includes/class-ccf-rest.php';
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

/*
 * Registered, not enqueued. This stylesheet exists solely to lay out the markup
 * CCF_Render produces for the three shortcodes below — and the theme renders
 * fixtures, results and tables itself from cc25_feed(), so on this site those
 * shortcodes are used nowhere. It was still being fetched on all 51 pages to
 * style markup that never appeared (audit RED-7).
 *
 * The shortcodes now enqueue it when one of them actually runs. They are kept
 * rather than deleted so a page that does use one still works.
 */
add_action('wp_enqueue_scripts', function () {
    wp_register_style('ccf', CCF_URL . 'assets/ccf.css', [], '1.0.1');
});

/*
 * The table hydrator, loaded only on a page that actually renders a table. The
 * theme says so by printing data-ccf-table, and asks for the script by calling
 * ccf_enqueue_table_script() — see CCF_Rest for why the page cannot simply trust
 * its own HTML.
 */
function ccf_enqueue_table_script() {
    if (!function_exists('wp_enqueue_script')) return;
    wp_enqueue_script('ccf-table', CCF_URL . 'assets/ccf-table.js', [], '1.1.0', true);
    wp_localize_script('ccf-table', 'CCF_TABLE', [
        'endpoint' => esc_url_raw(rest_url(CCF_Rest::NS . '/table')),
    ]);
}

CCF_Rest::register();

CCF_Shortcodes::register();
CCF_Admin::register();
