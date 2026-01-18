import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { getNewsArticle, mockNews } from '@/data/news-data';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockNews.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getCategoryBadge(category: string): { label: string; color: string } {
  const badges: Record<string, { label: string; color: string }> = {
    'match-report': { label: 'Match Report', color: 'bg-celtic-blue' },
    'club-news': { label: 'Club News', color: 'bg-celtic-blue-dark' },
    'transfer': { label: 'Transfer', color: 'bg-celtic-blue-light' },
    'community': { label: 'Community', color: 'bg-celtic-yellow text-celtic-dark' },
    'announcement': { label: 'Announcement', color: 'bg-celtic-blue' },
  };
  return badges[category] || { label: category, color: 'bg-celtic-blue' };
}

function getTeamBadge(team?: string): { label: string; color: string } | null {
  if (!team || team === 'both') return null;
  return team === 'ladies'
    ? { label: "Women's", color: 'bg-celtic-yellow text-celtic-dark' }
    : { label: "Men's", color: 'bg-celtic-blue' };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const categoryBadge = getCategoryBadge(article.category);
  const teamBadge = getTeamBadge(article.team);

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/news"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 text-sm"
            >
              ← Back to News
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`${categoryBadge.color} text-white px-3 py-1 rounded text-sm font-bold`}>
                {categoryBadge.label}
              </span>
              {teamBadge && (
                <span className={`${teamBadge.color} text-white px-3 py-1 rounded text-sm font-bold`}>
                  {teamBadge.label}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>By {article.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <article
                  className="prose prose-lg max-w-none prose-headings:text-celtic-dark prose-a:text-celtic-blue"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share buttons (visual only) */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Share this article</h3>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#1877f2] text-white rounded-lg text-sm font-medium hover:opacity-90">
                      Facebook
                    </button>
                    <button className="px-4 py-2 bg-[#1da1f2] text-white rounded-lg text-sm font-medium hover:opacity-90">
                      Twitter
                    </button>
                    <button className="px-4 py-2 bg-[#25d366] text-white rounded-lg text-sm font-medium hover:opacity-90">
                      WhatsApp
                    </button>
                  </div>
                </div>

                {/* Back link */}
                <div className="mt-12">
                  <Link
                    href="/news"
                    className="inline-flex items-center text-celtic-blue font-semibold hover:text-celtic-blue-dark"
                  >
                    ← Back to all news
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <CelticBondBanner variant="sidebar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
