'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'match-report' | 'announcement' | 'club-news' | 'community';
  team: 'mens' | 'ladies' | 'both';
  author: string;
  publishedAt: number;
  tags: string[];
}

const defaultNews: NewsArticle[] = [
  {
    id: '1',
    slug: 'celtic-draw-with-carmarthen-town',
    title: 'Celtic Fight Back to Draw 2-2 with Carmarthen Town',
    excerpt: 'A spirited second-half performance sees Cwmbran Celtic earn a valuable point at home.',
    content: 'Cwmbran Celtic showed tremendous character to fight back from behind and earn a 2-2 draw against Carmarthen Town at the Avondale Motor Park Arena.',
    category: 'match-report',
    team: 'mens',
    author: 'Club Media',
    publishedAt: new Date('2026-01-11').getTime(),
    tags: ['match-report', 'jd-cymru-south', 'home'],
  },
  {
    id: '2',
    slug: 'celtic-bond-january-draw-results',
    title: 'Celtic Bond January Draw Results',
    excerpt: 'Congratulations to our January Celtic Bond winners!',
    content: 'The January Celtic Bond draw took place at the clubhouse following Saturday\'s match.',
    category: 'club-news',
    team: 'both',
    author: 'Club Secretary',
    publishedAt: new Date('2026-01-11').getTime(),
    tags: ['celtic-bond', 'fundraising'],
  },
  {
    id: '3',
    slug: 'walking-football-sessions-restart',
    title: 'Walking Football Sessions Return This February',
    excerpt: 'Our popular walking football sessions are back for the new year.',
    content: 'Great news for our walking football community - sessions are returning from February 1st!',
    category: 'community',
    team: 'both',
    author: 'Community Officer',
    publishedAt: new Date('2026-01-06').getTime(),
    tags: ['walking-football', 'community', 'sessions'],
  },
];

const categoryLabels: Record<string, string> = {
  'match-report': 'Match Report',
  'announcement': 'Announcement',
  'club-news': 'Club News',
  'community': 'Community',
};

const teamLabels: Record<string, string> = {
  'mens': "Men's Team",
  'ladies': "Women's Team",
  'both': 'All Teams',
};

export default function NewsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>(defaultNews);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'club-news' as NewsArticle['category'],
    team: 'both' as NewsArticle['team'],
    author: 'Club Media',
    tags: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      // Load saved data from localStorage
      const savedData = localStorage.getItem('news-data');
      if (savedData) {
        setNews(JSON.parse(savedData));
      }
    }
  }, []);

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('news-data', JSON.stringify(news));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
  };

  const openNewArticle = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'club-news',
      team: 'both',
      author: 'Club Media',
      tags: '',
    });
    setShowEditor(true);
  };

  const openEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      team: article.team,
      author: article.author,
      tags: article.tags.join(', '),
    });
    setShowEditor(true);
  };

  const saveArticle = () => {
    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (editingArticle) {
      // Update existing
      setNews(news.map(n =>
        n.id === editingArticle.id
          ? {
              ...n,
              ...formData,
              slug: formData.slug || generateSlug(formData.title),
              tags: tagsArray,
            }
          : n
      ));
    } else {
      // Create new
      const newArticle: NewsArticle = {
        id: Date.now().toString(),
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: tagsArray,
        publishedAt: Date.now(),
      };
      setNews([newArticle, ...news]);
    }

    setShowEditor(false);
    setEditingArticle(null);
  };

  const deleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setNews(news.filter(n => n.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">Please login from the admin dashboard first</p>
          <Link href="/admin" className="btn-primary">Go to Admin</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">News Manager</h1>
              <p className="text-sm text-white/80">Create and manage news articles</p>
            </div>
            <div className="flex items-center gap-4">
              {saved && (
                <span className="text-sm text-green-300 bg-green-900/30 px-3 py-1 rounded-full">
                  Saved!
                </span>
              )}
              <Link href="/admin" className="text-sm text-white/80 hover:text-white">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{news.length} articles</p>
              <div className="flex gap-3">
                <button onClick={saveData} className="btn-secondary text-sm py-2">
                  Save All Changes
                </button>
                <button onClick={openNewArticle} className="btn-primary text-sm py-2">
                  + New Article
                </button>
              </div>
            </div>

            {/* Editor Modal */}
            {showEditor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b sticky top-0 bg-white">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-celtic-dark">
                        {editingArticle ? 'Edit Article' : 'New Article'}
                      </h2>
                      <button
                        onClick={() => setShowEditor(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                          });
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Article title..."
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg text-sm text-gray-500"
                        placeholder="auto-generated-from-title"
                      />
                    </div>

                    {/* Category & Team */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsArticle['category'] })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="club-news">Club News</option>
                          <option value="match-report">Match Report</option>
                          <option value="announcement">Announcement</option>
                          <option value="community">Community</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team
                        </label>
                        <select
                          value={formData.team}
                          onChange={(e) => setFormData({ ...formData, team: e.target.value as NewsArticle['team'] })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="both">All Teams</option>
                          <option value="mens">Men&apos;s Team</option>
                          <option value="ladies">Women&apos;s Team</option>
                        </select>
                      </div>
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Club Media"
                      />
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Excerpt (short summary)
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg h-20"
                        placeholder="Brief description for previews..."
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content (supports basic HTML)
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg h-48 font-mono text-sm"
                        placeholder="<p>Article content here...</p>"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; for formatting
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="match-report, home, jd-cymru-south"
                      />
                    </div>
                  </div>

                  <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                      onClick={() => setShowEditor(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveArticle}
                      disabled={!formData.title.trim()}
                      className="btn-primary"
                    >
                      {editingArticle ? 'Update Article' : 'Create Article'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Articles List */}
            <div className="space-y-4">
              {news
                .sort((a, b) => b.publishedAt - a.publishedAt)
                .map((article) => (
                <div key={article.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          article.category === 'match-report' ? 'bg-green-100 text-green-700' :
                          article.category === 'announcement' ? 'bg-blue-100 text-blue-700' :
                          article.category === 'community' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {categoryLabels[article.category]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {teamLabels[article.team]}
                        </span>
                      </div>
                      <h3 className="font-semibold text-celtic-dark mb-1 truncate">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By {article.author}</span>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditArticle(article)}
                        className="text-sm text-celtic-blue hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {news.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No articles yet</p>
                <button onClick={openNewArticle} className="btn-primary">
                  Create Your First Article
                </button>
              </div>
            )}

            {/* Save Button */}
            {news.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button onClick={saveData} className="btn-primary">
                  Save All Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
