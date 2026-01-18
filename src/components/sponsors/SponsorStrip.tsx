'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/data/mock-data';

export default function SponsorStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allSponsors = sponsors.officialPartners;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSponsors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allSponsors.length]);

  const currentSponsor = allSponsors[currentIndex];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 py-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider hidden sm:inline">
            {currentSponsor.description}
          </span>
          <span className="text-xs text-gray-500 sm:hidden">Official Partner</span>
          <Link
            href={currentSponsor.url || '#'}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            target={currentSponsor.url?.startsWith('http') ? '_blank' : undefined}
            rel={currentSponsor.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <div className="relative h-6 w-20">
              <Image
                src={currentSponsor.logo}
                alt={currentSponsor.name}
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <div className="flex gap-1 ml-2">
            {allSponsors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-celtic-blue' : 'bg-gray-300'
                }`}
                aria-label={`Go to sponsor ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
