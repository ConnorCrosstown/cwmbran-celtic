import { Metadata } from 'next';
import Link from 'next/link';
import { getFixtures } from '@/lib/comet';
import { awayDays, getAwayDayByTeamName } from '@/data/away-days';

export const metadata: Metadata = {
  title: 'Away Days Guide',
  description: 'Your complete guide to following Cwmbran Celtic away from home. Find directions, parking, pubs and more for every away fixture.',
};

export default async function AwayDaysPage() {
  const fixturesData = await getFixtures();
  const now = Date.now();

  // Get upcoming away fixtures
  const awayFixtures = fixturesData.results
    .filter(f => f.date > now && f.homeAway === 'A')
    .sort((a, b) => a.date - b.date)
    .slice(0, 10);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Away Days Guide</h1>
          <p className="text-white/80 mt-2">Your complete guide to following the Celts on the road</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600">
              Planning to follow Cwmbran Celtic away from home? We&apos;ve got you covered with
              directions, parking info, nearby pubs, and ground tips for every away fixture.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Away Fixtures */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-celtic-dark mb-6">Upcoming Away Fixtures</h2>

          {awayFixtures.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {awayFixtures.map((fixture) => {
                const awayInfo = getAwayDayByTeamName(fixture.homeTeam);
                const fixtureDate = new Date(fixture.date);

                return (
                  <div key={fixture.matchId} className="card p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-celtic-dark">{fixture.homeTeam}</p>
                        <p className="text-sm text-gray-500">{fixture.competition}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-celtic-blue">
                          {fixtureDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-sm text-gray-500">{fixture.time}</p>
                      </div>
                    </div>

                    {awayInfo ? (
                      <>
                        <div className="text-sm text-gray-600 mb-3">
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {awayInfo.ground.name}
                          </p>
                          <p className="flex items-center gap-2 mt-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {awayInfo.travel.distanceFromCwmbran} • {awayInfo.travel.driveTime}
                          </p>
                        </div>
                        <Link
                          href={`/away-days/${awayInfo.teamId}`}
                          className="block w-full text-center bg-celtic-blue text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Away Day Guide
                        </Link>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        Away guide coming soon
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming away fixtures</p>
          )}
        </div>
      </section>

      {/* All Away Grounds */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-celtic-dark mb-6">All Away Grounds</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {awayDays
              .sort((a, b) => a.teamName.localeCompare(b.teamName))
              .map((info) => (
                <Link
                  key={info.teamId}
                  href={`/away-days/${info.teamId}`}
                  className="card p-4 hover:shadow-lg transition-shadow group"
                >
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    {info.teamName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{info.ground.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {info.travel.distanceFromCwmbran}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {info.travel.driveTime}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-celtic-dark mb-6 text-center">Away Day Tips</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-celtic-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-celtic-dark">Arrive Early</h3>
                    <p className="text-sm text-gray-600">Allow extra time for parking and finding the ground, especially for first visits.</p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-celtic-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-celtic-dark">Car Share</h3>
                    <p className="text-sm text-gray-600">Save money and the environment by sharing lifts with fellow supporters.</p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-celtic-dark">Bring Cash</h3>
                    <p className="text-sm text-gray-600">Many lower league grounds are cash only at the turnstile and tea bar.</p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-celtic-dark">Check Weather</h3>
                    <p className="text-sm text-gray-600">Welsh weather! Bring layers and waterproofs just in case.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
