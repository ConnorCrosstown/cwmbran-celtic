import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAlbum, mockAlbums } from '@/data/gallery-data';
import GalleryViewer from '@/components/gallery/GalleryViewer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return mockAlbums.map((album) => ({
    slug: album.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbum(slug);

  if (!album) {
    return { title: 'Album Not Found' };
  }

  return {
    title: album.title,
    description: album.description,
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
    'match': { label: 'Match Day', color: 'bg-celtic-blue' },
    'training': { label: 'Training', color: 'bg-celtic-blue-dark' },
    'event': { label: 'Event', color: 'bg-celtic-yellow text-celtic-dark' },
    'ground': { label: 'The Park', color: 'bg-celtic-blue-light' },
    'history': { label: 'History', color: 'bg-celtic-blue-dark' },
  };
  return badges[category] || { label: category, color: 'bg-celtic-blue' };
}

function getTeamBadge(team?: string): { label: string; color: string; textColor: string } | null {
  if (!team || team === 'both') return null;
  return team === 'ladies'
    ? { label: "Women's", color: 'bg-celtic-yellow', textColor: 'text-celtic-dark' }
    : { label: "Men's", color: 'bg-celtic-blue', textColor: 'text-white' };
}

export default async function GalleryAlbumPage({ params }: PageProps) {
  const { slug } = await params;
  const album = getAlbum(slug);

  if (!album) {
    notFound();
  }

  const categoryBadge = getCategoryBadge(album.category);
  const teamBadge = getTeamBadge(album.team);

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/gallery"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 text-sm"
            >
              ← Back to Gallery
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`${categoryBadge.color} text-white px-3 py-1 rounded text-sm font-bold`}>
                {categoryBadge.label}
              </span>
              {teamBadge && (
                <span className={`${teamBadge.color} ${teamBadge.textColor} px-3 py-1 rounded text-sm font-bold`}>
                  {teamBadge.label}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              {album.title}
            </h1>

            <p className="text-gray-300 mb-2">
              {album.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <span>{formatDate(album.date)}</span>
              <span>•</span>
              <span>{album.images.length} photos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid with Lightbox */}
      <GalleryViewer images={album.images} />

      {/* Back link */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/gallery"
              className="inline-flex items-center text-celtic-blue font-semibold hover:text-celtic-blue-dark"
            >
              ← Back to all galleries
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
