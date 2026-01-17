import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestAlbums } from '@/data/gallery-data';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos and galleries from Cwmbran Celtic AFC matches, events, and club history.',
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
    'match': { label: 'Match Day', color: 'bg-green-600' },
    'training': { label: 'Training', color: 'bg-blue-600' },
    'event': { label: 'Event', color: 'bg-purple-600' },
    'ground': { label: 'The Park', color: 'bg-orange-500' },
    'history': { label: 'History', color: 'bg-gray-600' },
  };
  return badges[category] || { label: category, color: 'bg-gray-600' };
}

function getTeamBadge(team?: string): { label: string; color: string; textColor: string } | null {
  if (!team || team === 'both') return null;
  return team === 'ladies'
    ? { label: 'Ladies', color: 'bg-celtic-yellow', textColor: 'text-celtic-dark' }
    : { label: "Men's", color: 'bg-celtic-blue', textColor: 'text-white' };
}

export default function GalleryPage() {
  const albums = getLatestAlbums(20);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Photos from matches, events, and moments in Cwmbran Celtic history
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button className="px-4 py-2 bg-celtic-blue text-white rounded-lg text-sm font-medium">
              All
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Match Days
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Events
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              The Park
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              History
            </button>
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {albums.map((album) => {
              const categoryBadge = getCategoryBadge(album.category);
              const teamBadge = getTeamBadge(album.team);

              return (
                <Link
                  key={album.id}
                  href={`/gallery/${album.slug}`}
                  className="group card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Album cover image */}
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                      <span className={`${categoryBadge.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                        {categoryBadge.label}
                      </span>
                      {teamBadge && (
                        <span className={`${teamBadge.color} ${teamBadge.textColor} px-2 py-0.5 rounded text-xs font-bold`}>
                          {teamBadge.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors mb-1">
                      {album.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(album.date)} • {album.images.length} photos
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {album.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upload CTA */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-celtic-dark mb-4">
            Got Photos to Share?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            If you have photos from matches or club events that you&apos;d like to share,
            we&apos;d love to feature them in our gallery.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
