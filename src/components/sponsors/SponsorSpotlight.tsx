'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/data/mock-data';

export default function SponsorSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allSponsors = sponsors.officialPartners;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSponsors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allSponsors.length]);

  const sponsor = allSponsors[currentIndex];

  return (
    <section className="py-8 bg-gradient-to-r from-celtic-blue to-celtic-blue-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-celtic-yellow text-xs uppercase tracking-wider font-semibold">
              Official Partner
            </span>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-white text-sm">
              {sponsor.description}
            </span>
          </div>

          <Link
            href={sponsor.url || '#'}
            className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-6 py-3"
            target={sponsor.url?.startsWith('http') ? '_blank' : undefined}
            rel={sponsor.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <div className="relative h-10 w-28 bg-white rounded px-2 py-1">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-white font-semibold">{sponsor.name}</span>
            <svg className="w-4 h-4 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="flex gap-2">
            {allSponsors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-celtic-yellow' : 'bg-white/30'
                }`}
                aria-label={`View sponsor ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
