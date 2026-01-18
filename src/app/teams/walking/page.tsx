import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Walking Football',
  description: 'Join Cwmbran Celtic Walking Football - football for all ages and abilities. A fun, social way to stay active and enjoy the beautiful game.',
};

export default function WalkingFootballPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-celtic-blue-dark via-celtic-blue to-celtic-blue-dark overflow-hidden py-4 md:py-6">
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
                <h1 className="text-xl md:text-2xl font-bold text-white">Walking Football</h1>
                <p className="text-xs text-celtic-yellow">Football for all ages and abilities</p>
              </div>

              {/* Info badges */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-celtic-yellow">50+</p>
                  <p className="text-[10px] text-white">Age</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-white">All</p>
                  <p className="text-[10px] text-white">Levels</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-white">Weekly</p>
                  <p className="text-[10px] text-white">Sessions</p>
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
            <h2 className="text-lg font-bold text-celtic-dark mb-4">What is Walking Football?</h2>

            <div className="card p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                Walking Football is a slower-paced version of the beautiful game, designed to help people stay active
                regardless of their age or fitness level. It&apos;s perfect for those who want to enjoy football without
                the physical demands of the traditional game.
              </p>
              <p className="text-sm text-gray-700">
                At Cwmbran Celtic, we run regular walking football sessions that provide a fun, social environment
                where you can improve your fitness, make new friends, and enjoy the game we all love.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1">Health Benefits</h3>
                <p className="text-xs text-gray-600">
                  Improve cardiovascular health, balance, and overall fitness in a low-impact environment.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1">Social Community</h3>
                <p className="text-xs text-gray-600">
                  Meet like-minded people, make new friends, and be part of the Cwmbran Celtic family.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1">Fun & Inclusive</h3>
                <p className="text-xs text-gray-600">
                  No experience necessary. Everyone is welcome regardless of ability or footballing background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-6 md:py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">The Rules</h2>
            <div className="card p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                  <span><strong>No running</strong> - Players must walk at all times. One foot must always be in contact with the ground.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                  <span><strong>No contact</strong> - Walking football is a non-contact sport. No slide tackles or physical challenges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                  <span><strong>Below head height</strong> - The ball must stay below head height at all times.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                  <span><strong>Smaller teams</strong> - Games are typically played with 5-7 players per side on a smaller pitch.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Join Our Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2">Session Details</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <p><strong>When:</strong> Contact us for current session times</p>
                  <p><strong>Where:</strong> Avondale Motor Park Arena, Cwmbran</p>
                  <p><strong>Cost:</strong> Contact us for pricing</p>
                  <p><strong>What to bring:</strong> Comfortable clothes, trainers, water bottle</p>
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2">First Time?</h3>
                <p className="text-xs text-gray-600 mb-3">
                  New players are always welcome! Just turn up to a session or get in touch beforehand.
                  We&apos;ll make sure you feel welcome and explain everything you need to know.
                </p>
                <Link href="/contact" className="text-celtic-blue text-xs font-semibold hover:underline">
                  Get in touch &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 md:py-8 bg-celtic-blue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-white mb-2">
            Ready to Get Started?
          </h2>
          <p className="text-sm text-celtic-yellow mb-4 max-w-xl mx-auto">
            Whether you&apos;re returning to football after years away or trying it for the first time,
            our walking football sessions are the perfect way to get involved.
          </p>
          <Link href="/contact" className="bg-celtic-yellow text-celtic-dark px-4 py-2 rounded font-semibold text-sm hover:bg-celtic-yellow-light transition-colors inline-block">
            Contact Us to Join
          </Link>
        </div>
      </section>

      {/* Celtic Bond Banner */}
      <CelticBondBanner />
    </>
  );
}
