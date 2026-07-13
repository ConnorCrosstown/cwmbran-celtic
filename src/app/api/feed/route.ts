import { fetchAllTeams } from '@/lib/allwalessport';
import { buildFeed } from '@/lib/feed';

// Revalidate the underlying fetch hourly; SWR keeps the last good copy warm.
export const revalidate = 3600;

export async function GET(request: Request): Promise<Response> {
  const origin = new URL(request.url).origin;
  const data = await fetchAllTeams(); // already degrades to empty arrays on error
  const feed = buildFeed(data, origin, Date.now());
  return new Response(JSON.stringify(feed), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
