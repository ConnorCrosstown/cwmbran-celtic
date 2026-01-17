import NextMatchHero from '@/components/home/NextMatchHero';
import TeamCard from '@/components/home/TeamCard';
import LatestResult from '@/components/home/LatestResult';
import UpcomingFixtures from '@/components/home/UpcomingFixtures';
import LatestNews from '@/components/home/LatestNews';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import SponsorCarousel from '@/components/sponsors/SponsorCarousel';
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
      {/* Hero Section - Next Home Game (either team) */}
      <NextMatchHero fixture={nextHomeFixture} admission={clubInfo.admission} />

      {/* Both Teams - Equal Presence */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Our Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Men's Team */}
            <TeamCard
              teamName="Men's First Team"
              teamType="mens"
              league="JD Cymru South"
              position={mensPosition}
              nextFixture={nextMensHome}
              href="/teams/mens"
            />

            {/* Ladies Team */}
            <TeamCard
              teamName="Ladies"
              teamType="ladies"
              league="Genero Adran South"
              position={ladiesPosition}
              nextFixture={nextLadiesHome}
              href="/teams/ladies"
            />
          </div>
        </div>
      </section>

      {/* Latest Result & Upcoming Fixtures */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Latest Result */}
            <div>
              <h2 className="section-title">Latest Result</h2>
              <LatestResult result={latestResult} />
            </div>

            {/* Upcoming Fixtures - All Teams */}
            <div>
              <h2 className="section-title">Upcoming Fixtures</h2>
              <UpcomingFixtures fixtures={upcomingFixtures} />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <LatestNews articles={getLatestNews(3)} />

      {/* Celtic Bond CTA */}
      <section className="bg-celtic-yellow py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-2">
                Support the Club with Celtic Bond
              </h2>
              <p className="text-celtic-dark/80">
                Monthly prize draw supporting Cwmbran Celtic AFC. Win cash prizes while backing your club!
              </p>
            </div>
            <Link href="/celtic-bond" className="btn-primary whitespace-nowrap">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Visit Us CTA */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title">Visit Us</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Come and support Cwmbran Celtic at the {clubInfo.ground.name}.
              We welcome all supporters with great facilities including our clubhouse bar
              and tea bar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-sm text-gray-600">
                  {clubInfo.ground.address.street}<br />
                  {clubInfo.ground.address.town}<br />
                  {clubInfo.ground.address.postcode}
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-3">🎟️</div>
                <h3 className="font-semibold mb-2">Admission</h3>
                <p className="text-sm text-gray-600">
                  Adults: £{clubInfo.admission.adults}<br />
                  Concessions: £{clubInfo.admission.concessions}<br />
                  Under 16s: FREE
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-3">🍺</div>
                <h3 className="font-semibold mb-2">Facilities</h3>
                <p className="text-sm text-gray-600">
                  Licensed clubhouse bar<br />
                  Tea bar with hot food<br />
                  Free parking
                </p>
              </div>
            </div>
            <Link href="/visit" className="btn-primary">
              Plan Your Visit
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Sponsors */}
      <SponsorCarousel sponsors={sponsors.partners} title="Our Partners" />
    </>
  );
}
