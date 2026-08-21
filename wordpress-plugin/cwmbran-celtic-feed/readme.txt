=== Cwmbran Celtic Live Feed ===

Pulls fixtures, results and the league table from the Cwmbran Celtic data feed
(https://cwmbran-celtic.vercel.app/api/feed) and renders them via shortcodes.

Install:
1. Zip the `cwmbran-celtic-feed` folder and upload via Plugins > Add New > Upload, then Activate.
2. Settings > Cwmbran Feed: paste the feed URL, Save, then "Refresh now".

Shortcodes:
- [cc_fixtures team="mens"]  upcoming fixtures
- [cc_results team="mens"]   recent results
- [cc_table team="mens"]     league table

`team` accepts "mens" (and "ladies" once the women's feed cid is live).

Keeping the table right (1.1.0)
------------------------------
Three things used to be able to take the league table off the site, and all three
did on 21 Aug 2026:

- The cache expired with nothing behind it. A successful fetch is now ALSO kept in
  an option that never expires, so the table degrades to stale, never to absent.
- Only WP-Cron could refill it. A cold cache now refreshes itself, rate-limited to
  one attempt every five minutes so a dead feed does not become one request per
  visitor.
- The CDN holds anonymous HTML for thirty days, so a page can outlive the
  standings printed on it. Pages that render a table now re-check
  /wp-json/ccf/v1/table, which is sent no-store, and swap the rows if they have
  changed. The server-rendered table stays for search engines and for anyone
  without JavaScript.

The endpoint renders its rows through the theme (filter: ccf_table_rows_html) so a
hydrated table cannot drift from a server-rendered one.

Still worth doing: give the plugin a Bunny CDN API key so it can purge / and
/fixtures/ when the data changes. That would fix stale RESULTS and fixture dates
too — this release only keeps the TABLE live.
