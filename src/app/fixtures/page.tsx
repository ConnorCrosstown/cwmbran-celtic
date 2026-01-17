import { Metadata } from 'next';
import FixtureCard from '@/components/fixtures/FixtureCard';
import ResultCard from '@/components/fixtures/ResultCard';
import LeagueTable from '@/components/tables/LeagueTable';
import { getFixtures, getResults, getMensLeagueTable, getLadiesLeagueTable } from '@/lib/comet';

export const metadata: Metadata = {
  title: 'Fixtures & Results',
  description: 'View all Cwmbran Celtic AFC fixtures and results. Check the latest scores, upcoming games, and league tables.',
};

export default async function FixturesPage() {
  const [fixturesData, resultsData, mensLeagueData, ladiesLeagueData] = await Promise.all([
    getFixtures(),
    getResults(),
    getMensLeagueTable(),
    getLadiesLeagueTable(),
  ]);

  const now = Date.now();
  const upcomingFixtures = fixturesData.results
    .filter(f => f.date > now)
    .sort((a, b) => a.date - b.date);

  const recentResults = resultsData.results
    .sort((a, b) => b.date - a.date);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Fixtures & Results</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Follow Cwmbran Celtic throughout the season
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fixtures & Results Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Upcoming Fixtures */}
              <div>
                <h2 className="section-title">Upcoming Fixtures</h2>
                {upcomingFixtures.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingFixtures.map((fixture) => (
                      <FixtureCard key={fixture.matchId} fixture={fixture} showAdmission />
                    ))}
                  </div>
                ) : (
                  <div className="card p-8 text-center text-gray-500">
                    No upcoming fixtures scheduled
                  </div>
                )}
              </div>

              {/* Recent Results */}
              <div>
                <h2 className="section-title">Recent Results</h2>
                {recentResults.length > 0 ? (
                  <div className="space-y-4">
                    {recentResults.map((result) => (
                      <ResultCard key={result.matchId} result={result} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-8 text-center text-gray-500">
                    No results to display
                  </div>
                )}
              </div>
            </div>

            {/* League Tables Sidebar */}
            <div className="space-y-8">
              {/* Men's League Table */}
              <div>
                <h3 className="text-xl font-bold text-celtic-dark mb-4">JD Cymru South</h3>
                <div className="card overflow-hidden">
                  <LeagueTable
                    data={mensLeagueData.results}
                    highlightTeam="Cwmbran Celtic"
                  />
                </div>
              </div>

              {/* Ladies League Table */}
              <div>
                <h3 className="text-xl font-bold text-celtic-dark mb-4">Genero Adran South</h3>
                <div className="card overflow-hidden">
                  <LeagueTable
                    data={ladiesLeagueData.results}
                    highlightTeam="Cwmbran Celtic Ladies"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-bold mb-4">Key</h3>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded"></span>
                <span>Promotion</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded"></span>
                <span>Relegation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-celtic-yellow rounded"></span>
                <span>Cwmbran Celtic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded"></span>
                <span className="text-green-600">Win</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-500 rounded"></span>
                <span className="text-yellow-600">Draw</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded"></span>
                <span className="text-red-600">Loss</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
