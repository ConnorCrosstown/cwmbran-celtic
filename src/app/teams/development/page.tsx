import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Development Squad',
  description: 'Cwmbran Celtic Development Squad - developing the next generation of Celtic players.',
};

export default function DevelopmentSquadPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-celtic-blue-light via-celtic-blue to-celtic-blue-dark overflow-hidden py-4 md:py-6">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-celtic-yellow blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Development Squad</h1>
                <p className="text-xs text-gray-200">Building for the future</p>
              </div>

              {/* Info badges */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-celtic-yellow">U21</p>
                  <p className="text-[10px]" style={{ color: '#d1d5db' }}>Age</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                  <p className="text-base font-bold text-white">Reserve</p>
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
            <h2 className="text-lg font-bold text-celtic-dark mb-4">About the Development Squad</h2>

            <div className="card p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                The Cwmbran Celtic Development Squad provides a vital pathway for young players to progress
                from youth football into the senior game. Playing in the Reserve League, the team gives
                promising players regular competitive football and the chance to earn a place in the First Team.
              </p>
              <p className="text-sm text-gray-700">
                The squad is made up of a mix of younger players developing their skills and more experienced
                players returning from injury or building fitness. It&apos;s an essential part of our club
                structure and has produced several players who have gone on to represent the First Team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-bold text-sm mb-1">Pathway to First Team</h3>
                <p className="text-xs text-gray-600">
                  Regular opportunities for development players to train with and be selected for the First Team.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">📈</span>
                </div>
                <h3 className="font-bold text-sm mb-1">Player Development</h3>
                <p className="text-xs text-gray-600">
                  Focus on technical, tactical, and physical development to prepare players for senior football.
                </p>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">⚽</span>
                </div>
                <h3 className="font-bold text-sm mb-1">Competitive Football</h3>
                <p className="text-xs text-gray-600">
                  Regular matches in the Reserve League against other clubs&apos; development teams.
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
                <h3 className="font-bold text-sm mb-2">Training Sessions</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Development squad training takes place weekly. Contact the club for current training times and location.
                </p>
                <p className="text-xs text-gray-500">
                  Training is held at Avondale Motor Park Arena or local training facilities.
                </p>
              </div>
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2">Interested in Joining?</h3>
                <p className="text-xs text-gray-600 mb-2">
                  We&apos;re always looking for talented young players to join our Development Squad.
                  If you&apos;re aged 17-21 and interested in trialling, get in touch.
                </p>
                <Link href="/contact" className="text-celtic-blue text-xs font-semibold hover:underline">
                  Contact us about trials &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coleg Gwent Link */}
      <section className="py-6 md:py-8 bg-celtic-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-lg font-bold mb-2 text-white">
              Coleg Gwent Partnership
            </h2>
            <p className="text-sm mb-4 text-gray-200">
              Our partnership with Coleg Gwent provides an additional pathway for young players
              to develop their football while gaining educational qualifications.
            </p>
            <Link
              href="/community/coleg-gwent"
              className="bg-celtic-yellow text-celtic-dark px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400 transition-colors inline-block"
            >
              Learn About the Programme
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Ready to Take the Next Step?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            Whether you&apos;re a young player looking to develop or transitioning from youth football,
            our Development Squad could be the perfect fit for you.
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
