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

  // Separate fixtures by team
  const allFixtures = fixturesData.results
    .filter(f => f.date > now)
    .sort((a, b) => a.date - b.date);

  const mensFixtures = allFixtures.filter(f =>
    !f.homeTeam.includes('Ladies') && !f.awayTeam.includes('Ladies')
  );

  const womensFixtures = allFixtures.filter(f =>
    f.homeTeam.includes('Ladies') || f.awayTeam.includes('Ladies')
  );

  // Separate results by team
  const allResults = resultsData.results.sort((a, b) => b.date - a.date);

  const mensResults = allResults.filter(r =>
    !r.homeTeam.includes('Ladies') && !r.awayTeam.includes('Ladies')
  );

  const womensResults = allResults.filter(r =>
    r.homeTeam.includes('Ladies') || r.awayTeam.includes('Ladies')
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Fixtures & Results</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Men's Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-celtic-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">M</span>
              <h2 className="text-2xl font-bold text-celtic-dark">Men&apos;s Team</h2>
              <span className="text-sm text-gray-500">JD Cymru South</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Men's Fixtures */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Upcoming</h3>
                {mensFixtures.length > 0 ? (
                  <div className="space-y-3">
                    {mensFixtures.slice(0, 5).map((fixture) => (
                      <FixtureCard key={fixture.matchId} fixture={fixture} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming fixtures</p>
                )}
              </div>

              {/* Men's Results */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Results</h3>
                {mensResults.length > 0 ? (
                  <div className="space-y-3">
                    {mensResults.slice(0, 5).map((result) => (
                      <ResultCard key={result.matchId} result={result} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No recent results</p>
                )}
              </div>

              {/* Men's League Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">League Table</h3>
                <div className="card overflow-hidden">
                  <LeagueTable
                    data={mensLeagueData.results}
                    highlightTeam="Cwmbran Celtic"
                    compact
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 my-8" />

          {/* Women's Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-celtic-yellow text-celtic-dark w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">W</span>
              <h2 className="text-2xl font-bold text-celtic-dark">Women&apos;s Team</h2>
              <span className="text-sm text-gray-500">Genero Adran South</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Women's Fixtures */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Upcoming</h3>
                {womensFixtures.length > 0 ? (
                  <div className="space-y-3">
                    {womensFixtures.slice(0, 5).map((fixture) => (
                      <FixtureCard key={fixture.matchId} fixture={fixture} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming fixtures</p>
                )}
              </div>

              {/* Women's Results */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Results</h3>
                {womensResults.length > 0 ? (
                  <div className="space-y-3">
                    {womensResults.slice(0, 5).map((result) => (
                      <ResultCard key={result.matchId} result={result} compact />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No recent results</p>
                )}
              </div>

              {/* Women's League Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">League Table</h3>
                <div className="card overflow-hidden">
                  <LeagueTable
                    data={ladiesLeagueData.results}
                    highlightTeam="Cwmbran Celtic Ladies"
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Info */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-bold text-lg mb-4">Match Day Admission</h3>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <span className="text-gray-600">Adults</span>
                <span className="block font-bold text-celtic-dark">£5</span>
              </div>
              <div>
                <span className="text-gray-600">Concessions</span>
                <span className="block font-bold text-celtic-dark">£3</span>
              </div>
              <div>
                <span className="text-gray-600">Under 16s</span>
                <span className="block font-bold text-celtic-yellow">FREE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
