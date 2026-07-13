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

`team` accepts "mens" (and "ladies" once the women's feed cid is live). Data
refreshes hourly via WP-Cron; use "Refresh now" on match days.
