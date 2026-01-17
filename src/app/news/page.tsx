import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestNews } from '@/data/news-data';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news, match reports, and announcements from Cwmbran Celtic AFC.',
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getCategoryBadge(category: string): { label: string; color: string } {
  const badges: Record<string, { label: string; color: string }> = {
    'match-report': { label: 'Match Report', color: 'bg-green-600' },
    'club-news': { label: 'Club News', color: 'bg-celtic-blue' },
    'transfer': { label: 'Transfer', color: 'bg-purple-600' },
    'community': { label: 'Community', color: 'bg-orange-500' },
    'announcement': { label: 'Announcement', color: 'bg-red-600' },
  };
  return badges[category] || { label: category, color: 'bg-gray-600' };
}

function getTeamBadge(team?: string): { label: string; color: string } | null {
  if (!team || team === 'both') return null;
  return team === 'ladies'
    ? { label: "Women's", color: 'bg-purple-600' }
    : { label: "Men's", color: 'bg-celtic-blue' };
}

export default function NewsPage() {
  const news = getLatestNews(20);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Match reports, club updates, and all the latest from Cwmbran Celtic
          </p>
        </div>
      </section>

      {/* News List */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Filter tabs (visual only for now) */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button className="px-4 py-2 bg-celtic-blue text-white rounded-lg text-sm font-medium">
                All News
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                Match Reports
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                Club News
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                Community
              </button>
            </div>

            {/* Articles */}
            <div className="space-y-6">
              {news.map((article) => {
                const categoryBadge = getCategoryBadge(article.category);
                const teamBadge = getTeamBadge(article.team);

                return (
                  <article
                    key={article.id}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/news/${article.slug}`} className="block p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`${categoryBadge.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                          {categoryBadge.label}
                        </span>
                        {teamBadge && (
                          <span className={`${teamBadge.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                            {teamBadge.label}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-celtic-dark mb-2 hover:text-celtic-blue transition-colors">
                        {article.title}
                      </h2>

                      <p className="text-gray-600 mb-4">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          By {article.author}
                        </span>
                        <span className="text-celtic-blue font-semibold text-sm">
                          Read more →
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
