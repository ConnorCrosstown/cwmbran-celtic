import Link from 'next/link';
import { NewsArticle } from '@/types/news';

interface LatestNewsProps {
  articles: NewsArticle[];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
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

export default function LatestNews({ articles }: LatestNewsProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center">Latest News</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => {
              const categoryBadge = getCategoryBadge(article.category);

              return (
                <article key={article.id} className="card card-hover">
                  <Link href={`/news/${article.slug}`} className="block p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${categoryBadge.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                        {categoryBadge.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>

                    <h3 className="font-bold text-celtic-dark mb-2 line-clamp-2 hover:text-celtic-blue transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/news" className="btn-primary">
              View All News
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
