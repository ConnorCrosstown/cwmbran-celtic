<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-client.php
if (!defined('ABSPATH')) exit;

/**
 * The feed, and the several ways it can quietly stop arriving.
 *
 * On 21 Aug 2026 the league table vanished from the live site. Nothing had
 * errored: the cache had simply expired with nothing behind it, and only the
 * hourly cron was allowed to refill it. Three things follow from that, and they
 * are the reason this class is shaped the way it is.
 *
 *  1. A successful fetch is kept TWICE — a short transient that says "this is
 *     current", and an option that never expires and says "this is the last
 *     thing we knew to be true". The table degrades to stale, never to absent.
 *  2. A cold cache refreshes itself. Cron is a nice-to-have, not the only path,
 *     because on a low-traffic site WP-Cron is exactly the thing that stops.
 *  3. That self-refresh is rate-limited, so a feed that is genuinely down costs
 *     one request every few minutes rather than one per visitor.
 */
class CCF_Client {
    const CACHE_KEY = 'ccf_feed_cache';        // "current" — expires
    const LAST_GOOD = 'ccf_feed_last_good';    // "last known true" — does not
    const LOCK_KEY  = 'ccf_refresh_lock';      // rate limit for the self-refresh

    const CACHE_TTL = 93600;   // 26h — a missed cron still serves current data
    const LOCK_TTL  = 300;     // 5m between self-refresh attempts

    /**
     * Seam for the clock, so tests can age a cache out without waiting a day.
     * Production never reassigns it.
     */
    public static $clock = 'time';

    private static function now(): int { return (int) call_user_func(self::$clock); }

    /** The feed: current if we have it, last-known-good if we do not, else []. */
    public static function get_feed(): array {
        $fresh = get_transient(self::CACHE_KEY);
        if (is_array($fresh) && $fresh) return $fresh;
        $last = get_option(self::LAST_GOOD, array());
        return is_array($last) ? $last : array();
    }

    /** Where the current feed came from, and when — for the "updated" line. */
    public static function feed_meta(): array {
        $fetched = (int) get_option('ccf_last_fetch', 0);
        $fresh = get_transient(self::CACHE_KEY);
        if (is_array($fresh) && $fresh) {
            return array('source' => 'fresh', 'fetched' => $fetched, 'stale' => false);
        }
        $last = get_option(self::LAST_GOOD, array());
        if (is_array($last) && $last) {
            return array('source' => 'last-good', 'fetched' => $fetched, 'stale' => true);
        }
        return array('source' => 'none', 'fetched' => 0, 'stale' => false);
    }

    /** One team's league table rows, always an array. */
    public static function table(string $team = 'mens'): array {
        $feed = self::get_feed();
        $rows = isset($feed['tables'][$team]) ? $feed['tables'][$team] : null;
        return is_array($rows) ? array_values($rows) : array();
    }

    /**
     * Refresh if the current cache is cold and we have not just tried.
     *
     * Safe to call on any request: a warm cache costs one transient read.
     */
    public static function maybe_refresh(): void {
        $fresh = get_transient(self::CACHE_KEY);
        if (is_array($fresh) && $fresh) return;
        if (get_transient(self::LOCK_KEY)) return;
        set_transient(self::LOCK_KEY, 1, self::LOCK_TTL);
        self::refresh();
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
        set_transient(self::CACHE_KEY, $data, self::CACHE_TTL);
        // The copy that outlives the cache. Without it, one expiry with cron down
        // takes the league table off the site altogether.
        update_option(self::LAST_GOOD, $data);
        update_option('ccf_last_fetch', self::now());
        update_option('ccf_last_error', '');
        return true;
    }
}
