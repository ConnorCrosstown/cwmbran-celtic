<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-shortcodes.php
if (!defined('ABSPATH')) exit;

class CCF_Shortcodes {
    public static function register(): void {
        add_shortcode('cc_fixtures', [__CLASS__, 'fixtures']);
        add_shortcode('cc_results', [__CLASS__, 'results']);
        add_shortcode('cc_table', [__CLASS__, 'table']);
    }

    private static function team(array $atts): string {
        $a = shortcode_atts(['team' => 'mens'], $atts);
        return sanitize_key($a['team']);
    }

    public static function fixtures($atts): string {
        return '<div class="ccf">' . CCF_Render::fixtures(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
    public static function results($atts): string {
        return '<div class="ccf">' . CCF_Render::results(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
    public static function table($atts): string {
        return '<div class="ccf">' . CCF_Render::table(CCF_Client::get_feed(), self::team((array) $atts)) . '</div>';
    }
}
