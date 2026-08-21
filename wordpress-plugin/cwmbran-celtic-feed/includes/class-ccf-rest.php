<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-rest.php
if (!defined('ABSPATH')) exit;

/**
 * The league table, fetched by the page instead of baked into it.
 *
 * This site is fronted by a CDN with an edge rule for anonymous HTML and
 * s-maxage=2592000 — thirty days. A page can therefore be served long after the
 * standings it contains stopped being true, and on 21 Aug 2026 that is exactly
 * what happened: the edge cached /fixtures/ at 21:42 and the feed arrived at
 * 21:48, so the club looked at an empty table for the rest of the evening.
 *
 * Purging on every change would need a CDN credential the site does not have, so
 * instead the page keeps its server-rendered table — search engines and anyone
 * without JavaScript still get one — and asks this endpoint whether it is still
 * right. The response carries no-store, so neither the CDN nor the browser can
 * hold it, and what a visitor sees is current however old the HTML is.
 */
class CCF_Rest {
    const NS = 'ccf/v1';

    public static function register(): void {
        add_action('rest_api_init', function () {
            register_rest_route(self::NS, '/table', array(
                'methods'  => 'GET',
                'callback' => array(__CLASS__, 'handle_table'),
                'permission_callback' => '__return_true',
                'args' => array('team' => array('default' => 'mens')),
            ));
        });
    }

    /** Headers that keep this response out of every cache between us and the reader. */
    public static function cache_headers(): array {
        return array('Cache-Control' => 'no-store, max-age=0');
    }

    /**
     * The table as the page needs it. No WP_REST types, so it can be tested
     * directly and reused by the server-side render.
     */
    public static function table_payload(string $team = 'mens'): array {
        $team = preg_replace('/[^a-z0-9_]/', '', strtolower($team));
        // A visitor arriving on a cold cache refills it. Rate-limited inside, so a
        // dead feed costs one request every few minutes, not one per reader.
        CCF_Client::maybe_refresh();
        $meta = CCF_Client::feed_meta();
        $rows = CCF_Client::table($team);
        // The theme owns how a row looks. It renders these through the same
        // function the page uses, so a hydrated table is byte-identical to a
        // server-rendered one and cannot drift from it. No theme listening (or a
        // different theme active) simply means the page keeps what it rendered.
        $html = (string) apply_filters('ccf_table_rows_html', '', $team, $rows, CCF_Client::get_feed());
        return array(
            'team'         => $team,
            'rows'         => $rows,
            'html'         => $html,
            'updated'      => $meta['fetched'],
            'updatedLabel' => $meta['fetched'] ? self::label($meta['fetched']) : '',
            'stale'        => $meta['stale'],
            'source'       => $meta['source'],
        );
    }

    /** "Fri 21 Aug, 9:48pm" — formatted once, here, so the page and the API agree. */
    public static function label(int $ts): string {
        if (function_exists('wp_date')) return wp_date('D j M, g:ia', $ts);
        if (function_exists('date_i18n')) return date_i18n('D j M, g:ia', $ts);
        return gmdate('D j M, g:ia', $ts);
    }

    public static function handle_table($request) {
        $team = is_object($request) && method_exists($request, 'get_param')
            ? (string) $request->get_param('team') : 'mens';
        $response = new WP_REST_Response(self::table_payload($team ?: 'mens'), 200);
        foreach (self::cache_headers() as $k => $v) $response->header($k, $v);
        return $response;
    }
}
