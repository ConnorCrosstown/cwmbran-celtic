export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  date?: number;
  category: 'match' | 'training' | 'event' | 'ground' | 'history';
  team?: 'mens' | 'ladies' | 'both';
}

export interface GalleryAlbum {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
  date: number;
  category: 'match' | 'training' | 'event' | 'ground' | 'history';
  team?: 'mens' | 'ladies' | 'both';
}
