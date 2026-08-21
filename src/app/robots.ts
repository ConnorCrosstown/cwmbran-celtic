import { MetadataRoute } from 'next';

/**
 * This deployment must not be indexed.
 *
 * The club's website is cwmbranceltic.com. This app began as that site and is
 * now kept for one reason only: /api/feed, which the WordPress feed plugin
 * fetches for fixtures, results and league tables. Every page route below it
 * still renders, and a 2026-08-21 audit found this domain fully crawlable with
 * its own sitemap — a second "official" Cwmbran Celtic site competing with the
 * real one in search results, showing fixtures nobody maintains any more.
 *
 * Disallow everything. The feed is fetched server-to-server by WordPress, which
 * never consults robots.txt, so shutting crawlers out costs nothing.
 *
 * The sitemap is deliberately not declared, and src/app/sitemap.ts is gone with
 * it — it existed to get these pages indexed, which is exactly what we no longer
 * want. Do not reintroduce either without deciding this domain should be public.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
