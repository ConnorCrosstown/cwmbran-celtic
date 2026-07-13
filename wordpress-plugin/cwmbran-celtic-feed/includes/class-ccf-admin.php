<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-admin.php
if (!defined('ABSPATH')) exit;

class CCF_Admin {
    public static function register(): void {
        add_action('admin_menu', [__CLASS__, 'menu']);
        add_action('admin_init', [__CLASS__, 'settings']);
        add_action('admin_post_ccf_refresh', [__CLASS__, 'handle_refresh']);
    }

    public static function menu(): void {
        add_options_page('Cwmbran Feed', 'Cwmbran Feed', 'manage_options', 'ccf', [__CLASS__, 'page']);
    }

    public static function settings(): void {
        register_setting('ccf', 'ccf_feed_url', ['sanitize_callback' => 'esc_url_raw']);
    }

    public static function handle_refresh(): void {
        if (!current_user_can('manage_options')) wp_die('Nope');
        check_admin_referer('ccf_refresh');
        CCF_Client::refresh();
        wp_safe_redirect(admin_url('options-general.php?page=ccf&refreshed=1'));
        exit;
    }

    public static function page(): void {
        $last = (int) get_option('ccf_last_fetch', 0);
        $err = (string) get_option('ccf_last_error', '');
        echo '<div class="wrap"><h1>Cwmbran Celtic Live Feed</h1>';
        echo '<form method="post" action="options.php">';
        settings_fields('ccf');
        echo '<table class="form-table"><tr><th>Feed URL</th><td>';
        echo '<input type="url" name="ccf_feed_url" class="regular-text" value="' . esc_attr(get_option('ccf_feed_url', '')) . '" placeholder="https://cwmbran-celtic.vercel.app/api/feed" />';
        echo '</td></tr></table>';
        submit_button('Save');
        echo '</form>';

        echo '<hr /><h2>Status</h2><p>';
        echo $last ? 'Last successful fetch: ' . esc_html(date_i18n('j M Y H:i', $last)) : 'No successful fetch yet.';
        if ($err !== '') echo '<br /><strong style="color:#b32d2e">Last error:</strong> ' . esc_html($err);
        echo '</p>';

        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
        echo '<input type="hidden" name="action" value="ccf_refresh" />';
        wp_nonce_field('ccf_refresh');
        submit_button('Refresh now', 'secondary');
        echo '</form></div>';
    }
}
