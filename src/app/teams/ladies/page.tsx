import { Metadata } from 'next';
import Link from 'next/link';
import LeagueTable from '@/components/tables/LeagueTable';
import CelticBondBanner from '@/components/banners/CelticBondBanner';
import { getLadiesLeagueTable, getUpcomingLadiesFixtures, getResults, formatMatchDate, getOpponent, getOpponentFromResult, isHomeResult } from '@/lib/comet';

export const metadata: Metadata = {
  title: "Women's Team",
  description: "Meet the Cwmbran Celtic Women's team. View fixtures, results, and league position in the Genero Adran South.",
};

export default async function LadiesTeamPage() {
  const [leagueData, upcomingFixtures, resultsData] = await Promise.all([
    getLadiesLeagueTable(),
    getUpcomingLadiesFixtures(1),
    getResults(),
  ]);

  // Find team position
  const position = leagueData.results.find((row) =>
    row.club.includes('Cwmbran Celtic Ladies')
  );

  const nextFixture = upcomingFixtures[0];

  // Get latest women's result
  const womensResults = resultsData.results.filter(
    r => r.homeTeam.includes('Ladies') || r.awayTeam.includes('Ladies')
  );
  const lastResult = womensResults[0];

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
                <h1 className="text-xl md:text-2xl font-bold text-white">Women&apos;s Team</h1>
                <p className="text-xs text-gray-200">Genero Adran South</p>
              </div>

              {/* Stats Row */}
              {position && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                    <p className="text-base font-bold text-celtic-yellow">{position.position}<sup className="text-[10px]">th</sup></p>
                    <p className="text-[10px]" style={{ color: '#d1d5db' }}>Pos</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                    <p className="text-base font-bold text-white">{position.points}</p>
                    <p className="text-[10px]" style={{ color: '#d1d5db' }}>Pts</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 text-center border border-white/10">
                    <p className="text-base font-bold text-white">{position.played}</p>
                    <p className="text-[10px]" style={{ color: '#d1d5db' }}>P</p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Game & Last Result */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {nextFixture && (
                <div className="bg-white/10 backdrop-blur-sm rounded p-3 border border-white/10">
                  <p className="text-[10px] uppercase mb-1" style={{ color: '#9ca3af' }}>Next Game</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">vs {getOpponent(nextFixture)}</p>
                      <p className="text-xs" style={{ color: '#d1d5db' }}>{formatMatchDate(nextFixture.date)} • {nextFixture.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${nextFixture.homeAway === 'H' ? 'bg-celtic-yellow text-celtic-dark' : 'bg-white/20'}`} style={nextFixture.homeAway !== 'H' ? { color: '#ffffff' } : {}}>
                      {nextFixture.homeAway === 'H' ? 'HOME' : 'AWAY'}
                    </span>
                  </div>
                </div>
              )}
              {lastResult && (
                <div className="bg-white/10 backdrop-blur-sm rounded p-3 border border-white/10">
                  <p className="text-[10px] uppercase mb-1" style={{ color: '#9ca3af' }}>Last Result</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">vs {getOpponentFromResult(lastResult)}</p>
                      <p className="text-xs" style={{ color: '#d1d5db' }}>{formatMatchDate(lastResult.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-white">{lastResult.homeScore} - {lastResult.awayScore}</p>
                      <span className={`text-[10px] font-bold ${
                        (isHomeResult(lastResult) && lastResult.homeScore > lastResult.awayScore) ||
                        (!isHomeResult(lastResult) && lastResult.awayScore > lastResult.homeScore)
                          ? 'text-green-400'
                          : lastResult.homeScore === lastResult.awayScore
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {(isHomeResult(lastResult) && lastResult.homeScore > lastResult.awayScore) ||
                         (!isHomeResult(lastResult) && lastResult.awayScore > lastResult.homeScore)
                          ? 'WIN'
                          : lastResult.homeScore === lastResult.awayScore
                          ? 'DRAW'
                          : 'LOSS'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
                Cwmbran Celtic Women compete in the Genero Adran South, part of the FAW Women&apos;s
                pyramid system. The team trains regularly and plays home games at the Avondale Motor Park Arena.
              </p>
              <p className="text-sm text-gray-700">
                We&apos;re always looking for new players to join our squad. Whether you&apos;re an experienced
                player or new to the game, we&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2">Training</h3>
                <p className="text-xs text-gray-600">
                  Training sessions are held weekly. Contact us for current times and location.
                </p>
              </div>
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2">Home Games</h3>
                <p className="text-xs text-gray-600">
                  Home matches are played at the Avondale Motor Park Arena. Check fixtures for kick-off times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* League Table */}
      <section className="py-6 md:py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Genero Adran South Table</h2>
            <div className="card overflow-hidden">
              <LeagueTable
                data={leagueData.results}
                highlightTeam="Cwmbran Celtic Ladies"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Interested in Joining?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            We welcome players of all abilities. Get in touch to find out about training sessions and trials.
          </p>
          <Link href="/contact" className="btn-primary text-sm px-4 py-2">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Celtic Bond Banner */}
      <CelticBondBanner />
    </>
  );
}
