import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: "Men's Seconds",
  description: "Cwmbran Celtic Men's Seconds - competing in the Gwent County League Division 2.",
};

export default function MensSecondsPage() {
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
                <h1 className="text-xl md:text-2xl font-bold text-white">Men&apos;s Seconds</h1>
                <p className="text-xs text-gray-200">Gwent County League Division 2</p>
              </div>

              {/* Info badges */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-celtic-yellow">2nd</p>
                  <p className="text-[10px]" style={{ color: '#d1d5db' }}>Team</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-white">Div 2</p>
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
                Cwmbran Celtic Men&apos;s Seconds compete in the Gwent County League Division 2. The team
                provides an important stepping stone for players developing their skills and looking to
                progress to the First Team, as well as experienced players who want to continue playing
                competitive football.
              </p>
              <p className="text-sm text-gray-700">
                Playing in the Gwent County League gives players regular competitive matches against other
                clubs in the region, helping them to develop their game in a competitive environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1 text-celtic-dark">Development Pathway</h3>
                <p className="text-xs text-gray-600">
                  A bridge between youth football and the First Team for developing players.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1 text-celtic-dark">Team Spirit</h3>
                <p className="text-xs text-gray-600">
                  A close-knit squad with a strong team ethos and commitment to the club.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1 text-celtic-dark">Competitive Football</h3>
                <p className="text-xs text-gray-600">
                  Regular league matches throughout the season in the Gwent County League.
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
                  We&apos;re always looking for players to strengthen our squad.
                  If you&apos;re interested in playing, get in touch with us.
                </p>
                <Link href="/contact" className="text-celtic-blue text-xs font-semibold hover:underline">
                  Contact us about trials &rarr;
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
            Want to Play for the Seconds?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            Whether you&apos;re looking to step up from grassroots football or maintain your
            competitive edge, our Seconds team could be the right fit for you.
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
