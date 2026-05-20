import Link from 'next/link';
import Image from 'next/image';
import { Sponsor } from '@/types';

interface SponsorCarouselProps {
  sponsors: Sponsor[];
  title?: string;
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  if (!sponsor.logo) {
    return (
      <div className="h-12 w-32 flex items-center justify-center text-celtic-dark font-semibold text-sm text-center">
        {sponsor.name}
      </div>
    );
  }
  return (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      width={140}
      height={48}
      className="h-12 w-auto max-w-[140px] object-contain"
      unoptimized={!sponsor.logo.startsWith('/')}
    />
  );
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
                  <SponsorLogo sponsor={sponsor} />
                </a>
              ) : (
                <div className="block bg-white p-4 rounded-lg shadow-sm">
                  <SponsorLogo sponsor={sponsor} />
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
