<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-shortcodes.php
if (!defined('ABSPATH')) exit;

class CCF_Shortcodes {
    public static function register(): void {
        add_shortcode('cc_fixtures', [__CLASS__, 'fixtures']);
        add_shortcode('cc_results', [__CLASS__, 'results']);
        add_shortcode('cc_table', [__CLASS__, 'table']);
    }

    /** Pull the stylesheet in only when a shortcode has really rendered. */
    private static function styles(): void {
        wp_enqueue_style('ccf');
    }

    private static function team(array $atts): string {
        $a = shortcode_atts(['team' => 'mens'], $atts);
        return sanitize_key($a['team']);
    }

    public static function fixtures($atts): string {
        self::styles();
        return '<div class="ccf">' . CCF_Render::fixtures(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
    public static function results($atts): string {
        self::styles();
        return '<div class="ccf">' . CCF_Render::results(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
    public static function table($atts): string {
        self::styles();
        return '<div class="ccf">' . CCF_Render::table(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
}
