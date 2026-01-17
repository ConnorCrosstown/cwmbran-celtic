import { GalleryAlbum } from '@/types/gallery';

const toTimestamp = (dateStr: string): number => new Date(dateStr).getTime();

// Gallery albums with generated placeholder images
// Replace with actual club photos for production
export const mockAlbums: GalleryAlbum[] = [
  {
    id: '1',
    slug: 'celtic-vs-pontypridd-jan-2025',
    title: 'Celtic 3-1 Pontypridd Town',
    description: "Action shots from our convincing home win against Pontypridd Town in the JD Cymru South.",
    coverImage: '/images/gallery/match-1.jpg',
    date: toTimestamp('2025-01-11'),
    category: 'match',
    team: 'mens',
    images: [
      { id: '1-1', src: '/images/gallery/match-1.jpg', alt: 'Goal celebration', category: 'match', team: 'mens' },
      { id: '1-2', src: '/images/gallery/match-2.jpg', alt: 'Match action', category: 'match', team: 'mens' },
      { id: '1-3', src: '/images/gallery/match-3.jpg', alt: 'Team huddle', category: 'match', team: 'mens' },
      { id: '1-4', src: '/images/gallery/match-4.jpg', alt: 'Fans celebrating', category: 'match', team: 'mens' },
    ],
  },
  {
    id: '2',
    slug: 'ladies-vs-abergavenny-jan-2025',
    title: 'Ladies Draw at Abergavenny',
    description: 'Photos from our dramatic 2-2 draw away at Abergavenny.',
    coverImage: '/images/gallery/ladies-1.jpg',
    date: toTimestamp('2025-01-12'),
    category: 'match',
    team: 'ladies',
    images: [
      { id: '2-1', src: '/images/gallery/ladies-1.jpg', alt: 'Ladies team', category: 'match', team: 'ladies' },
      { id: '2-2', src: '/images/gallery/ladies-2.jpg', alt: 'Match action', category: 'match', team: 'ladies' },
      { id: '2-3', src: '/images/gallery/ladies-3.jpg', alt: 'Goal celebration', category: 'match', team: 'ladies' },
    ],
  },
  {
    id: '3',
    slug: 'the-park-ground-photos',
    title: 'The Park - Our Home',
    description: 'Photos of our beautiful home ground, The Park.',
    coverImage: '/images/gallery/ground-1.jpg',
    date: toTimestamp('2024-12-01'),
    category: 'ground',
    team: 'both',
    images: [
      { id: '3-1', src: '/images/gallery/ground-1.jpg', alt: 'Main stand', category: 'ground' },
      { id: '3-2', src: '/images/gallery/ground-2.jpg', alt: 'Pitch view', category: 'ground' },
      { id: '3-3', src: '/images/gallery/ground-3.jpg', alt: 'Clubhouse', category: 'ground' },
      { id: '3-4', src: '/images/gallery/ground-4.jpg', alt: 'Floodlights', category: 'ground' },
    ],
  },
  {
    id: '4',
    slug: 'christmas-party-2024',
    title: 'Christmas Party 2024',
    description: 'Photos from our annual Christmas party at the clubhouse.',
    coverImage: '/images/gallery/event-1.jpg',
    date: toTimestamp('2024-12-21'),
    category: 'event',
    team: 'both',
    images: [
      { id: '4-1', src: '/images/gallery/event-1.jpg', alt: 'Christmas party', category: 'event' },
      { id: '4-2', src: '/images/gallery/event-2.jpg', alt: 'Team photo', category: 'event' },
    ],
  },
  {
    id: '5',
    slug: 'historic-photos',
    title: 'Celtic Through The Years',
    description: 'Historic photos from our 100-year history.',
    coverImage: '/images/gallery/history-1.jpg',
    date: toTimestamp('2024-01-01'),
    category: 'history',
    team: 'both',
    images: [
      { id: '5-1', src: '/images/gallery/history-1.jpg', alt: '1920s team photo', category: 'history' },
      { id: '5-2', src: '/images/gallery/history-2.jpg', alt: '1970s promotion', category: 'history' },
      { id: '5-3', src: '/images/gallery/history-3.jpg', alt: '2000s cup run', category: 'history' },
    ],
  },
];

export function getAlbum(slug: string): GalleryAlbum | undefined {
  return mockAlbums.find(album => album.slug === slug);
}

export function getAlbumsByCategory(category: GalleryAlbum['category']): GalleryAlbum[] {
  return mockAlbums
    .filter(album => album.category === category)
    .sort((a, b) => b.date - a.date);
}

export function getLatestAlbums(limit = 6): GalleryAlbum[] {
  return [...mockAlbums]
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);
}
