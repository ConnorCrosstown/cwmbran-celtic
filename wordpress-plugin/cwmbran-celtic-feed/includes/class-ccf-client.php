<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-client.php
if (!defined('ABSPATH')) exit;

class CCF_Client {
    const CACHE_KEY = 'ccf_feed_cache';

    /** Decoded cached feed, or [] if none. */
    public static function get_feed(): array {
        $cached = get_transient(self::CACHE_KEY);
        return is_array($cached) ? $cached : [];
    }

    public static function feed_url(): string {
        return trim((string) get_option('ccf_feed_url', ''));
    }

    /** Fetch the feed URL; on success replace the cache, on failure keep it. */
    public static function refresh(): bool {
        $url = self::feed_url();
        if ($url === '') {
            update_option('ccf_last_error', 'Feed URL is not set.');
            return false;
        }
        $resp = wp_remote_get($url, ['timeout' => 15, 'headers' => ['Accept' => 'application/json']]);
        if (is_wp_error($resp)) {
            update_option('ccf_last_error', $resp->get_error_message());
            return false;
        }
        $code = wp_remote_retrieve_response_code($resp);
        if ($code !== 200) {
            update_option('ccf_last_error', "HTTP $code from feed.");
            return false;
        }
        $data = json_decode(wp_remote_retrieve_body($resp), true);
        if (!is_array($data) || !isset($data['fixtures'])) {
            update_option('ccf_last_error', 'Feed response was not valid JSON.');
            return false;
        }
        // An entirely-empty payload usually means the upstream source was down.
        // Don't overwrite last-good cache with nothing — keep serving previous data.
        $has_fixtures = !empty($data['fixtures']);
        $has_results  = !empty($data['results']);
        $has_table    = false;
        if (!empty($data['tables']) && is_array($data['tables'])) {
            foreach ($data['tables'] as $rows) {
                if (!empty($rows)) { $has_table = true; break; }
            }
        }
        if (!$has_fixtures && !$has_results && !$has_table) {
            update_option('ccf_last_error', 'Feed returned no data; kept previous cache.');
            return false;
        }
        // Store for 26h so a missed cron still serves last-good until the next run.
        set_transient(self::CACHE_KEY, $data, 26 * HOUR_IN_SECONDS);
        update_option('ccf_last_fetch', time());
        update_option('ccf_last_error', '');
        return true;
    }
}
