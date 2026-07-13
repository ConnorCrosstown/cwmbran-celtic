import { fetchAllTeams } from '@/lib/allwalessport';
import { buildFeed } from '@/lib/feed';
import { SITE_URL } from '@/lib/site';

export async function GET(): Promise<Response> {
  const data = await fetchAllTeams(); // already degrades to empty arrays on error
  const feed = buildFeed(data, SITE_URL, Date.now());
  return new Response(JSON.stringify(feed), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
