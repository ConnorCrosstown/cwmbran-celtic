import { Metadata } from 'next';
import Link from 'next/link';
import { seasonArchives } from '@/data/season-archives';

export const metadata: Metadata = {
  title: 'Season Archives',
  description: 'Browse historical season data for Cwmbran Celtic AFC including league positions, top scorers, and cup runs.',
};

export default function ArchivesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#ffffff' }}>Season Archives</h1>
          <p className="text-xs" style={{ color: '#e5e7eb' }}>
            Historical records and statistics
          </p>
        </div>
      </section>

      {/* Archives Grid */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonArchives.map((archive) => (
                <Link
                  key={archive.slug}
                  href={`/club/archives/${archive.slug}`}
                  className="card group hover:shadow-md transition-all p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                      {archive.season}
                    </h2>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-celtic-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    {/* Men's summary */}
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 uppercase mb-1">Men&apos;s First Team</p>
                      <p className="text-sm font-semibold text-celtic-dark">
                        {archive.mens.position}<sup className="text-[10px]">th</sup> in {archive.mens.league}
                      </p>
                      <p className="text-xs text-gray-600">
                        {archive.mens.won}W {archive.mens.drawn}D {archive.mens.lost}L &bull; {archive.mens.points} pts
                      </p>
                    </div>

                    {/* Women's summary */}
                    {archive.womens && (
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Women&apos;s Team</p>
                        <p className="text-sm font-semibold text-celtic-dark">
                          {archive.womens.position}<sup className="text-[10px]">{archive.womens.position === 1 ? 'st' : archive.womens.position === 2 ? 'nd' : archive.womens.position === 3 ? 'rd' : 'th'}</sup> in {archive.womens.league}
                        </p>
                        <p className="text-xs text-gray-600">
                          {archive.womens.won}W {archive.womens.drawn}D {archive.womens.lost}L &bull; {archive.womens.points} pts
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Looking for older records */}
            <div className="mt-8 text-center">
              <div className="card-static p-4 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Looking for older records? We&apos;re working on digitising our historical archives.
                </p>
                <Link href="/contact" className="text-celtic-blue text-sm font-semibold hover:underline mt-2 inline-block">
                  Get in touch if you can help &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
