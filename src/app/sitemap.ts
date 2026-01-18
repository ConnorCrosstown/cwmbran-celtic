import { MetadataRoute } from 'next';
import { mockNews } from '@/data/news-data';
import { mockAlbums } from '@/data/gallery-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cwmbranceltic.com';

  // Static pages - comprehensive list of all routes
  const staticPages = [
    // Main pages
    { route: '', priority: 1, changeFrequency: 'daily' as const },
    { route: '/news', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/fixtures', priority: 0.9, changeFrequency: 'daily' as const },

    // Teams
    { route: '/teams', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/teams/mens', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/teams/ladies', priority: 0.8, changeFrequency: 'weekly' as const },

    // Gallery
    { route: '/gallery', priority: 0.7, changeFrequency: 'weekly' as const },

    // Community
    { route: '/community', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/community/walking-football', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/community/youth', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/community/volunteers', priority: 0.6, changeFrequency: 'monthly' as const },

    // Club info
    { route: '/club', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/club/history', priority: 0.6, changeFrequency: 'yearly' as const },

    // Commercial
    { route: '/celtic-bond', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/sponsors', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/sponsors/packages', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/tickets', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/shop', priority: 0.7, changeFrequency: 'weekly' as const },

    // Visitor info
    { route: '/visit', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  // News articles
  const newsPages = mockNews.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Gallery albums
  const galleryPages = mockAlbums.map((album) => ({
    url: `${baseUrl}/gallery/${album.slug}`,
    lastModified: new Date(album.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...newsPages, ...galleryPages];
}
