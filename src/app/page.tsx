import HeroSection from '@/components/home/HeroSection';
import TeamCard from '@/components/home/TeamCard';
import LatestResult from '@/components/home/LatestResult';
import UpcomingFixtures from '@/components/home/UpcomingFixtures';
import LatestNews from '@/components/home/LatestNews';
import SponsorCarousel from '@/components/sponsors/SponsorCarousel';
import SponsorTicker from '@/components/sponsors/SponsorTicker';
import SectionHeader from '@/components/ui/SectionHeader';
import MatchStatusBanner from '@/components/home/MatchStatusBanner';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
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
      {/* Match Status Banner - Shows latest result or live score */}
      <MatchStatusBanner latestResult={latestResult} />

      {/* Hero Section - Dramatic Next Match Display */}
      <HeroSection fixture={nextHomeFixture} />

      {/* Sponsor Ticker - Rolling sponsor logos */}
      <SponsorTicker />

      {/* First Teams - Featured (Ladies first - they're doing better!) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Teams"
            subtitle="Follow our teams competing in the Welsh football pyramid"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Women's Team - Featured first (2nd place!) */}
            <TeamCard
              teamName="Women's Team"
              teamType="ladies"
              league="Genero Adran South"
              position={ladiesPosition}
              nextFixture={nextLadiesHome}
              href="/teams/ladies"
            />

            {/* Men's First Team */}
            <TeamCard
              teamName="Men's First Team"
              teamType="mens"
              league="JD Cymru South"
              position={mensPosition}
              nextFixture={nextMensHome}
              href="/teams/mens"
            />
          </div>
          <div className="text-center mt-8">
            <Link href="/teams" className="text-celtic-blue font-semibold hover:text-celtic-blue-dark transition-colors">
              View all teams including reserves & walking football →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Result & Upcoming Fixtures */}
      <section className="py-16 md:py-20 bg-gray-100">
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

      {/* Visit Us CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="Visit Us"
              subtitle={`Come and support Cwmbran Celtic at the ${clubInfo.ground.name}`}
              centered
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <Link href="/visit" className="p-8 bg-gray-50 rounded-2xl card-hover text-center block">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-celtic-blue/20 transition-colors">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-celtic-dark">Location</h3>
                <p className="text-sm text-gray-600">
                  {clubInfo.ground.address.street}<br />
                  {clubInfo.ground.address.town}<br />
                  {clubInfo.ground.address.postcode}
                </p>
              </Link>
              <Link href="/tickets" className="p-8 bg-gray-50 rounded-2xl card-hover text-center block">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-celtic-dark">Admission</h3>
                <p className="text-sm text-gray-600">
                  Adults: £{clubInfo.admission.adults}<br />
                  Concessions: £{clubInfo.admission.concessions}<br />
                  Under 16s: FREE
                </p>
              </Link>
              <Link href="/visit#facilities" className="p-8 bg-gray-50 rounded-2xl card-hover text-center block">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-celtic-dark">Facilities</h3>
                <p className="text-sm text-gray-600">
                  Licensed clubhouse bar<br />
                  Tea bar with hot food<br />
                  Free parking
                </p>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/tickets" className="btn-tickets">
                Buy Tickets
              </Link>
              <Link href="/visit" className="btn-primary">
                Plan Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 md:py-20 bg-celtic-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-display uppercase text-white mb-2">
                Stay Updated
              </h2>
              <p className="text-gray-300">
                Get the latest news, results, and fixtures delivered to your inbox
              </p>
            </div>
            <NewsletterSignup variant="card" />
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <SponsorCarousel sponsors={sponsors.partners} title="Our Partners" />
    </>
  );
}
