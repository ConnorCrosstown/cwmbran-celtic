<?php
/**
 * Assertions over the table endpoint the page hydrates from. Run from the plugin root:
 *   php _tests/rest-test.php
 *
 * The endpoint exists because the site sits behind a CDN that holds anonymous
 * HTML for thirty days (s-maxage=2592000). The rendered page can therefore be a
 * month old; this is fetched with no-store so what a visitor SEES is current
 * regardless. The payload builder is kept free of WP_REST plumbing so that
 * contract can be pinned here.
 */
// This file ships inside the plugin zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;
require __DIR__ . '/wp-stubs.php';
require __DIR__ . '/../includes/class-ccf-client.php';
CCF_Client::$clock = 'ccf_test_now';
require __DIR__ . '/../includes/class-ccf-rest.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/* ------------------------------------------------------------ the happy payload */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
CCF_Client::refresh();

$p = CCF_Rest::table_payload('mens');
check('the team comes back', $p['team'] === 'mens');
check('the rows come back', count($p['rows']) === 2);
check('a row carries everything the table renders',
      array_diff(array('position','club','played','won','drawn','lost','gd','points'),
                 array_keys($p['rows'][0])) === array());
check('the fetch time is included', $p['updated'] === ccf_test_now());
check('with a label the page can print', is_string($p['updatedLabel']) && $p['updatedLabel'] !== '');
check('fresh data is not marked stale', $p['stale'] === false);
check('and knows it is fresh', $p['source'] === 'fresh');

/* ------------------------------------------ the endpoint outlives the cache too */

ccf_test_advance(27 * HOUR_IN_SECONDS);
// No response queued: the self-refresh will fail, which is the point — the
// endpoint must still answer with the last table we knew to be true.
$p = CCF_Rest::table_payload('mens');
check('the endpoint still returns a table', count($p['rows']) === 2);
check('and marks it stale', $p['stale'] === true);
check('naming the source', $p['source'] === 'last-good');
check('and still reports when it was fetched', $p['updated'] > 0);

/* --------------------------------------------------- a cold start is not a lie */

ccf_test_reset();
$p = CCF_Rest::table_payload('mens');
check('with no data ever, rows are empty', $p['rows'] === array());
check('and the payload says so rather than implying staleness', $p['source'] === 'none');
check('with no invented timestamp', $p['updated'] === 0 && $p['updatedLabel'] === '');

/* ------------------------------------------------------------------- edge cases */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
CCF_Client::refresh();
check('an unknown team gives empty rows, not an error', CCF_Rest::table_payload('womens')['rows'] === array());
check('a junk team name is harmless', CCF_Rest::table_payload('../../etc/passwd')['rows'] === array());
check('the team is echoed back sanitised',
      CCF_Rest::table_payload('../../etc/passwd')['team'] === 'etcpasswd');

/* ------------------------------------------- a cold cache refreshes on demand */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
$p = CCF_Rest::table_payload('mens');
check('an empty cache is filled by the request itself', count($p['rows']) === 2);
check('which took exactly one fetch', count($GLOBALS['wp_http_log']) === 1);

/* ------------------------- rendered rows, so hydrated markup matches the page's */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
CCF_Client::refresh();
check('with no theme listening, html is empty and the page keeps its own',
      CCF_Rest::table_payload('mens')['html'] === '');

// The theme renders the rows; the endpoint reuses that exact renderer so a
// hydrated table cannot drift from a server-rendered one.
add_filter('ccf_table_rows_html', function ($html, $team, $rows) {
    $out = '';
    foreach ($rows as $r) $out .= '<tr><td>' . intval($r['position']) . '</td><td>' . $r['club'] . '</td></tr>';
    return $out;
}, 10, 3);
$p = CCF_Rest::table_payload('mens');
check('a listening theme supplies the rows', strpos($p['html'], 'Chepstow Town') !== false);
check('every row is rendered', substr_count($p['html'], '<tr>') === 2);

/* ------------------------------------------------- the response must not be cached */

check('the endpoint declares itself uncacheable',
      CCF_Rest::cache_headers() === array('Cache-Control' => 'no-store, max-age=0'));

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
