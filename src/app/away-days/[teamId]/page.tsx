import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { awayDays, getAwayDayInfo, getGoogleMapsUrl, CWMBRAN_COORDS } from '@/data/away-days';
import { getFixtures } from '@/lib/comet';

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export async function generateStaticParams() {
  return awayDays.map((info) => ({
    teamId: info.teamId,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { teamId } = await params;
  const info = getAwayDayInfo(teamId);

  if (!info) {
    return { title: 'Away Day Not Found' };
  }

  return {
    title: `Away Day Guide: ${info.teamName}`,
    description: `Your complete guide to ${info.ground.name}. Directions, parking, pubs and tips for Cwmbran Celtic fans visiting ${info.teamName}.`,
  };
}

export default async function AwayDayPage({ params }: PageProps) {
  const { teamId } = await params;
  const info = getAwayDayInfo(teamId);

  if (!info) {
    notFound();
  }

  // Get next fixture against this team
  const fixturesData = await getFixtures();
  const now = Date.now();
  const nextFixture = fixturesData.results
    .filter(f => f.date > now && f.homeTeam.toLowerCase().includes(info.teamName.toLowerCase().split(' ')[0]))
    .sort((a, b) => a.date - b.date)[0];

  const mapsUrl = getGoogleMapsUrl(info);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link href="/away-days" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Away Days
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{info.teamName}</h1>
          <p className="text-white/80 mt-2">{info.ground.name}</p>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="font-semibold">{info.travel.distanceFromCwmbran}</span>
              <span className="text-gray-500">from Cwmbran</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{info.travel.driveTime}</span>
              <span className="text-gray-500">drive time</span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-celtic-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Next Fixture */}
      {nextFixture && (
        <section className="py-6 bg-celtic-yellow">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-celtic-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">Next Visit:</span>
                <span>
                  {new Date(nextFixture.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-celtic-dark/70">• {nextFixture.time} KO</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Map & Address */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="card overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d${parseInt(info.travel.distanceFromCwmbran.replace(/[^0-9]/g, ''), 10) * 5000}!2d${(CWMBRAN_COORDS.lng + info.ground.coordinates.lng) / 2}!3d${(CWMBRAN_COORDS.lat + info.ground.coordinates.lat) / 2}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x0%3A0x0!2zNTHCsDM5JzEyLjIiTiAzwrAwMScyMy45Ilc!3m2!1d${CWMBRAN_COORDS.lat}!2d${CWMBRAN_COORDS.lng}!4m5!1s0x0%3A0x0!2zNTHCsDM2JzA4LjYiTiAzwrAyMCczMC44Ilc!3m2!1d${info.ground.coordinates.lat}!2d${info.ground.coordinates.lng}!5e0!3m2!1sen!2suk!4v1`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'absolute', inset: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map to ${info.ground.name}`}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-celtic-dark">{info.ground.name}</h3>
                  <p className="text-gray-600">{info.ground.address}</p>
                  <p className="text-gray-600">{info.ground.postcode}</p>
                  {info.ground.what3words && (
                    <p className="text-sm text-gray-500 mt-1">
                      what3words: <span className="text-celtic-blue">/{info.ground.what3words}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Directions */}
              <div className="card p-6">
                <h3 className="font-bold text-celtic-dark mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Directions from Cwmbran
                </h3>
                <p className="text-gray-700">{info.travel.directions}</p>
                {info.travel.publicTransport && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-700 mb-2">Public Transport</h4>
                    <p className="text-gray-600">{info.travel.publicTransport}</p>
                  </div>
                )}
              </div>

              {/* Parking */}
              <div className="card p-6">
                <h3 className="font-bold text-celtic-dark mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-8 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                  </svg>
                  Parking
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-700">At the Ground</h4>
                    <p className="text-gray-600">{info.parking.atGround}</p>
                  </div>
                  {info.parking.nearby.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700">Nearby Options</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {info.parking.nearby.map((option, i) => (
                          <li key={i}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {info.parking.cost && (
                    <p className="text-sm text-gray-500">Cost: {info.parking.cost}</p>
                  )}
                </div>
              </div>

              {/* Ground Info */}
              {info.groundInfo && (
                <div className="card p-6">
                  <h3 className="font-bold text-celtic-dark mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Ground Information
                  </h3>
                  <div className="space-y-3">
                    {info.groundInfo.capacity && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Capacity:</span> {info.groundInfo.capacity.toLocaleString()}
                      </p>
                    )}
                    {info.groundInfo.terraces && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Terraces:</span> {info.groundInfo.terraces}
                      </p>
                    )}
                    {info.groundInfo.facilities && info.groundInfo.facilities.length > 0 && (
                      <div>
                        <span className="font-semibold text-gray-700">Facilities:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {info.groundInfo.facilities.map((facility, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {info.groundInfo.tips && info.groundInfo.tips.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-gray-700 mb-2">Tips</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {info.groundInfo.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Pubs & Food */}
            <div className="space-y-6">
              {/* Pubs */}
              <div className="card p-6">
                <h3 className="font-bold text-celtic-dark mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Nearby Pubs
                </h3>
                {info.pubs.length > 0 ? (
                  <div className="space-y-4">
                    {info.pubs.map((pub, i) => (
                      <div key={i} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-gray-800">{pub.name}</h4>
                          {pub.fanFriendly && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              Fan Friendly
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{pub.distance}</p>
                        {pub.notes && <p className="text-sm text-gray-600 mt-1">{pub.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No pub info available yet</p>
                )}
              </div>

              {/* Food */}
              <div className="card p-6">
                <h3 className="font-bold text-celtic-dark mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Food Options
                </h3>
                {info.food.length > 0 ? (
                  <div className="space-y-3">
                    {info.food.map((place, i) => (
                      <div key={i} className="border-b pb-2 last:border-0 last:pb-0">
                        <h4 className="font-semibold text-gray-800">{place.name}</h4>
                        <p className="text-sm text-gray-500">{place.type} • {place.distance}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No food info available yet</p>
                )}
              </div>

              {/* Admission */}
              {info.admission && (
                <div className="card p-6 bg-celtic-blue text-white">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Admission Prices
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Adults</span>
                      <span className="font-semibold">£{info.admission.adults}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Concessions</span>
                      <span className="font-semibold">£{info.admission.concessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Children</span>
                      <span className="font-semibold">£{info.admission.children}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="card p-4">
                <p className="text-sm text-gray-500 text-center">
                  Last updated: {new Date(info.lastUpdated).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Got updated info? Let us know!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
