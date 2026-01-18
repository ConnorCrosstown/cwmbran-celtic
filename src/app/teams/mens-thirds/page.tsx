import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: "Men's Thirds",
  description: "Cwmbran Celtic Men's Thirds - competing in the Gwent County League Division 3.",
};

export default function MensThirdsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-celtic-blue via-celtic-blue-dark to-celtic-blue overflow-hidden py-4 md:py-6">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-celtic-yellow blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white blur-2xl"></div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-celtic-yellow/5 to-transparent"></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Men&apos;s Thirds</h1>
                <p className="text-xs text-gray-200">Gwent County League Division 3</p>
              </div>

              {/* Info badges */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-celtic-yellow">3rd</p>
                  <p className="text-[10px]" style={{ color: '#d1d5db' }}>Team</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-white">Div 3</p>
                  <p className="text-[10px]" style={{ color: '#d1d5db' }}>League</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">About the Team</h2>

            <div className="card p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                Cwmbran Celtic Men&apos;s Thirds compete in the Gwent County League Division 3. The team
                is an important part of the club&apos;s structure, providing opportunities for players
                of all abilities to represent Cwmbran Celtic in competitive football.
              </p>
              <p className="text-sm text-gray-700">
                The Thirds team emphasises enjoyment, development, and community spirit while still
                competing at a good standard of local football. It&apos;s perfect for players who want
                to play regular competitive football in a supportive environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1 text-celtic-dark">Enjoyment First</h3>
                <p className="text-xs text-gray-600">
                  Football should be fun - we focus on enjoying the game while being competitive.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1 text-celtic-dark">All Welcome</h3>
                <p className="text-xs text-gray-600">
                  Open to players of all abilities who want to be part of the Celtic family.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1 text-celtic-dark">Community Spirit</h3>
                <p className="text-xs text-gray-600">
                  Strong team spirit and social connections both on and off the pitch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Coaching Staff</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-celtic-blue rounded-full flex items-center justify-center">
                    <span className="text-celtic-yellow font-bold">?</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-celtic-blue font-semibold uppercase">Manager</p>
                    <p className="font-bold text-sm text-celtic-dark">TBC</p>
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-celtic-blue rounded-full flex items-center justify-center">
                    <span className="text-celtic-yellow font-bold">?</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-celtic-blue font-semibold uppercase">Assistant Manager</p>
                    <p className="font-bold text-sm text-celtic-dark">TBC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training & Trials */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Training & Trials</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2 text-celtic-dark">Training Sessions</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Training takes place weekly. Contact the club for current training times and location.
                </p>
                <p className="text-xs text-gray-500">
                  Training is held at Avondale Motor Park Arena or local training facilities.
                </p>
              </div>
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2 text-celtic-dark">Interested in Joining?</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Looking for a team? The Thirds welcome players of all abilities.
                  Get in touch to find out more.
                </p>
                <Link href="/contact" className="text-celtic-blue text-xs font-semibold hover:underline">
                  Contact us about joining &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Want to Play for the Thirds?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            Whether you&apos;re returning to football, new to the area, or just want to play
            regular competitive football, we&apos;d love to hear from you.
          </p>
          <Link href="/contact" className="btn-primary text-sm px-4 py-2">
            Get In Touch
          </Link>
        </div>
      </section>

      {/* Celtic Bond Banner */}
      <CelticBondBanner />
    </>
  );
}
