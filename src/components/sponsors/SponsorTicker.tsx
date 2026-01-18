'use client';

import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/data/mock-data';

export default function SponsorTicker() {
  // Combine all sponsors for the ticker
  const allSponsors = [...sponsors.officialPartners, ...sponsors.clubPartners];
  // Duplicate for seamless loop
  const tickerSponsors = [...allSponsors, ...allSponsors];

  return (
    <div className="bg-gray-50 border-b border-gray-100 overflow-hidden">
      <div className="py-2">
        <div className="flex items-center animate-ticker">
          {tickerSponsors.map((sponsor, idx) => (
            <Link
              key={`${sponsor.name}-${idx}`}
              href={sponsor.url || '#'}
              className="flex items-center gap-3 px-8 hover:opacity-70 transition-opacity flex-shrink-0"
              target={sponsor.url?.startsWith('http') ? '_blank' : undefined}
              rel={sponsor.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <div className="relative h-6 w-20">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
