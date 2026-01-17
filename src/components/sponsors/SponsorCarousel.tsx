import Link from 'next/link';
import { Sponsor } from '@/types';

interface SponsorCarouselProps {
  sponsors: Sponsor[];
  title?: string;
}

export default function SponsorCarousel({ sponsors, title = "Our Partners" }: SponsorCarouselProps) {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-celtic-dark mb-8">{title}</h2>

        <div className="flex flex-wrap justify-center items-center gap-8">
          {sponsors.slice(0, 7).map((sponsor, index) => (
            <div key={index} className="group">
              {sponsor.url ? (
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-32 flex items-center justify-center text-celtic-dark font-semibold text-sm text-center">
                    {sponsor.name}
                  </div>
                </a>
              ) : (
                <div className="block bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-12 w-32 flex items-center justify-center text-celtic-dark font-semibold text-sm text-center">
                    {sponsor.name}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/sponsors"
            className="text-celtic-blue font-semibold hover:text-celtic-blue-dark transition-colors"
          >
            View all sponsors →
          </Link>
        </div>
      </div>
    </section>
  );
}
