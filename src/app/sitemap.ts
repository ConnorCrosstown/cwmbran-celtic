import { MetadataRoute } from 'next';
import { mockNews } from '@/data/news-data';
import { mockAlbums } from '@/data/gallery-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cwmbranceltic.com';

  // Static pages
  const staticPages = [
    '',
    '/news',
    '/fixtures',
    '/teams',
    '/teams/mens',
    '/teams/ladies',
    '/gallery',
    '/community',
    '/community/walking-football',
    '/community/youth',
    '/visit',
    '/club',
    '/club/history',
    '/celtic-bond',
    '/sponsors',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
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
