import HeroSection from '@/components/home/HeroSection';
import TeamCard from '@/components/home/TeamCard';
import LatestResult from '@/components/home/LatestResult';
import UpcomingFixtures from '@/components/home/UpcomingFixtures';
import LatestNews from '@/components/home/LatestNews';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import SponsorCarousel from '@/components/sponsors/SponsorCarousel';
import CelticBondBanner from '@/components/banners/CelticBondBanner';
import SectionHeader from '@/components/ui/SectionHeader';
import MatchStatusBanner from '@/components/home/MatchStatusBanner';
import CelticTVSection from '@/components/home/CelticTVSection';
import ShopSection from '@/components/home/ShopSection';
import SocialFeed from '@/components/home/SocialFeed';
import Link from 'next/link';

import {
  getNextHomeFixture,
  getNextMensHomeFixture,
  getNextLadiesHomeFixture,
  getLatestResult,
  getLeaguePosition,
  getLadiesLeaguePosition,
  getUpcomingFixtures,
} from '@/lib/comet';
import { getLatestNews } from '@/data/news-data';
import { clubInfo, sponsors } from '@/data/mock-data';

export default async function HomePage() {
  const [
    nextHomeFixture,
    nextMensHome,
    nextLadiesHome,
    latestResult,
    mensPosition,
    ladiesPosition,
    upcomingFixtures,
  ] = await Promise.all([
    getNextHomeFixture(),
    getNextMensHomeFixture(),
    getNextLadiesHomeFixture(),
    getLatestResult(),
    getLeaguePosition(),
    getLadiesLeaguePosition(),
    getUpcomingFixtures(6),
  ]);

  return (
    <>
      {/* Celtic Bond Top Banner - Promote the lottery */}
      <CelticBondBanner variant="topbar" />

      {/* Match Status Banner - Shows latest result or live score */}
      <MatchStatusBanner latestResult={latestResult} />

      {/* Hero Section - Dramatic Next Match Display */}
      <HeroSection fixture={nextHomeFixture} />

      {/* All Teams */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Teams"
            subtitle="Follow all our teams competing in the Welsh football pyramid"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {/* Men's First Team */}
            <TeamCard
              teamName="Men's First Team"
              teamType="mens"
              league="JD Cymru South"
              position={mensPosition}
              nextFixture={nextMensHome}
              href="/teams/mens"
            />

            {/* Women's Team */}
            <TeamCard
              teamName="Women's Team"
              teamType="ladies"
              league="Genero Adran South"
              position={ladiesPosition}
              nextFixture={nextLadiesHome}
              href="/teams/ladies"
            />
          </div>

          {/* Men's 2nd and 3rd Teams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Men's Seconds */}
            <Link href="/teams/mens-seconds" className="card card-accent-yellow-top card-hover overflow-hidden block">
              <div className="card-header-gradient p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/club-logo.webp"
                      alt="Cwmbran Celtic"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide" style={{ color: '#ffffff' }}>Men&apos;s Seconds</h3>
                    <p className="text-sm" style={{ color: '#facc15' }}>Gwent County League Div 2</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our second team competing in the Gwent County League Division 2.
                </p>
                <span className="inline-block py-2.5 px-4 bg-celtic-blue rounded-lg font-semibold text-sm text-white">
                  View Team
                </span>
              </div>
            </Link>

            {/* Men's Thirds */}
            <Link href="/teams/mens-thirds" className="card card-accent-yellow-top card-hover overflow-hidden block">
              <div className="card-header-gradient p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/club-logo.webp"
                      alt="Cwmbran Celtic"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide" style={{ color: '#ffffff' }}>Men&apos;s Thirds</h3>
                    <p className="text-sm" style={{ color: '#facc15' }}>Gwent County League Div 3</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our third team competing in the Gwent County League Division 3.
                </p>
                <span className="inline-block py-2.5 px-4 bg-celtic-blue rounded-lg font-semibold text-sm text-white">
                  View Team
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Result & Upcoming Fixtures */}
      <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Latest Result */}
            <div>
              <SectionHeader title="Latest Result" viewAllLink="/fixtures" viewAllText="All Results" />
              <LatestResult result={latestResult} />
            </div>

            {/* Upcoming Fixtures - All Teams */}
            <div>
              <SectionHeader title="Upcoming Fixtures" viewAllLink="/fixtures" />
              <UpcomingFixtures fixtures={upcomingFixtures} />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <LatestNews articles={getLatestNews(3)} />

      {/* Celtic TV - Video Content */}
      <CelticTVSection />

      {/* Club Shop */}
      <ShopSection />

      {/* Social Media Feed */}
      <SocialFeed />

      {/* Visit Us CTA */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="Visit Us"
              subtitle={`Come and support Cwmbran Celtic at the ${clubInfo.ground.name}`}
              centered
            />
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto text-center">
              We welcome all supporters with great facilities including our clubhouse bar
              and tea bar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <Link href="/visit" className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl card-hover text-center block">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-celtic-blue/20 transition-colors">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-celtic-dark dark:text-white">Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {clubInfo.ground.address.street}<br />
                  {clubInfo.ground.address.town}<br />
                  {clubInfo.ground.address.postcode}
                </p>
              </Link>
              <Link href="/tickets" className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl card-hover text-center block">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-celtic-dark dark:text-white">Admission</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Adults: £{clubInfo.admission.adults}<br />
                  Concessions: £{clubInfo.admission.concessions}<br />
                  Under 16s: FREE
                </p>
              </Link>
              <Link href="/visit#facilities" className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl card-hover text-center block">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-celtic-dark dark:text-white">Facilities</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Licensed clubhouse bar<br />
                  Tea bar with hot food<br />
                  Free parking
                </p>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/visit" className="btn-primary">
                Plan Your Visit
              </Link>
              <Link href="/tickets" className="btn-tickets">
                Buy Tickets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Celtic Bond CTA */}
      <CelticBondBanner variant="full" />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Sponsors */}
      <SponsorCarousel sponsors={sponsors.partners} title="Our Partners" />
    </>
  );
}
