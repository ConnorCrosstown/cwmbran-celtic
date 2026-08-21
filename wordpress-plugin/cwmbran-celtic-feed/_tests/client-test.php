<?php
/**
 * Assertions over the feed client. Run from the plugin root:
 *   php _tests/client-test.php
 *
 * These exist because of a real outage: on 21 Aug 2026 the league table vanished
 * from the live site. Three separate weaknesses had to line up for that, and each
 * one is pinned here — the cache expiring with nothing behind it, a cold cache
 * that never refetches because only cron may populate it, and no record of when
 * the data was last known good.
 */
// This file ships inside the plugin zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;
require __DIR__ . '/wp-stubs.php';
require __DIR__ . '/../includes/class-ccf-client.php';
CCF_Client::$clock = 'ccf_test_now';   // drive the client off the test clock

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/* ---------------------------------------------------------- the fallback chain */

ccf_test_reset();
check('nothing stored gives an empty feed', CCF_Client::get_feed() === array());
check('and reports that it has never had data', CCF_Client::feed_meta()['source'] === 'none');

update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
check('a refresh succeeds', CCF_Client::refresh() === true);
check('the feed is now served', count(CCF_Client::get_feed()['tables']['mens']) === 2);
check('and is reported as fresh', CCF_Client::feed_meta()['source'] === 'fresh');
check('with the time it was fetched', CCF_Client::feed_meta()['fetched'] === ccf_test_now());

// THE OUTAGE: the 26-hour cache expires and cron has not run. Before this change
// get_feed() returned [] here and the table disappeared from the site entirely.
ccf_test_advance(27 * HOUR_IN_SECONDS);
check('the transient really has expired', get_transient('ccf_feed_cache') === false);
check('the table survives the cache expiring', count(CCF_Client::get_feed()['tables']['mens']) === 2);
check('and is reported as last-good, not fresh', CCF_Client::feed_meta()['source'] === 'last-good');
check('last-good is stale', CCF_Client::feed_meta()['stale'] === true);
check('and still knows when it was fetched', CCF_Client::feed_meta()['fetched'] > 0);

/* ------------------------------------------------- last-good is never clobbered */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed(9)));
CCF_Client::refresh();
$before = CCF_Client::get_feed()['tables']['mens'][0]['points'];
// Upstream comes back empty — keep what we had rather than publishing nothing.
ccf_test_queue_response(ccf_test_http_ok(array('fixtures' => array(), 'results' => array(), 'tables' => array())));
check('an empty payload is refused', CCF_Client::refresh() === false);
check('and last-good is untouched', CCF_Client::get_feed()['tables']['mens'][0]['points'] === $before);
ccf_test_queue_response(new WP_Error('http_request_failed', 'Connection timed out'));
check('a transport error is refused', CCF_Client::refresh() === false);
check('last-good still there after an error', count(CCF_Client::get_feed()['tables']['mens']) === 2);
check('and the error is recorded', get_option('ccf_last_error') === 'Connection timed out');

/* ---------------------------------------- lazy refresh: cron is not the only way */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
CCF_Client::maybe_refresh();
check('a cold cache refreshes itself', count($GLOBALS['wp_http_log']) === 1);
check('and the feed is populated', CCF_Client::get_feed() !== array());

// A warm cache must not refetch on every page view.
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
CCF_Client::maybe_refresh();
check('a warm cache does not refetch', count($GLOBALS['wp_http_log']) === 1);

/* -------------------------------------------------------------- the rate limiter */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
// Feed is down. Every visitor must not become an outbound request.
ccf_test_queue_response(new WP_Error('http_request_failed', 'down'));
CCF_Client::maybe_refresh();
check('a failing feed is attempted once', count($GLOBALS['wp_http_log']) === 1);
// Deliberately queue nothing: if the limiter leaks, the stub returns an error for
// the unqueued call and the request log gives it away.
CCF_Client::maybe_refresh();
check('and not retried immediately', count($GLOBALS['wp_http_log']) === 1);
ccf_test_advance(6 * MINUTE_IN_SECONDS);
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
CCF_Client::maybe_refresh();
check('but is retried once the window passes', count($GLOBALS['wp_http_log']) === 2);
check('and recovers on its own', CCF_Client::get_feed() !== array());

/* ------------------------------------------------------------------ table access */

ccf_test_reset();
update_option('ccf_feed_url', 'https://feed.test/api/feed');
ccf_test_queue_response(ccf_test_http_ok(ccf_test_feed()));
CCF_Client::refresh();
$t = CCF_Client::table('mens');
check('the table comes back for a known team', count($t) === 2);
check('rows keep their shape', $t[0]['club'] === 'Chepstow Town' && $t[0]['points'] === 9);
check('an unknown team gives an empty table', CCF_Client::table('womens') === array());
check('and never a non-array', is_array(CCF_Client::table('nonsense')));

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
