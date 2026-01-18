import { Metadata } from 'next';
import PlayerCard from '@/components/squad/PlayerCard';
import LeagueTable from '@/components/tables/LeagueTable';
import CelticBondBanner from '@/components/banners/CelticBondBanner';
import { getMensSquad, getPlayerStats, getMensLeagueTable, getLeaguePosition, getUpcomingMensFixtures, getResults, formatMatchDate, getOpponent, getOpponentFromResult, isHomeResult } from '@/lib/comet';
import { Player, PlayerStats } from '@/types';

export const metadata: Metadata = {
  title: "Men's First Team",
  description: "Meet the Cwmbran Celtic AFC Men's First Team squad. View player profiles, statistics, and league position.",
};

// Group players by position
function groupByPosition(players: Player[]) {
  const groups: Record<string, Player[]> = {
    Goalkeepers: [],
    Defenders: [],
    Midfielders: [],
    Forwards: [],
  };

  players.forEach((player) => {
    if (player.position === 'Goalkeeper') {
      groups.Goalkeepers.push(player);
    } else if (['Right Back', 'Left Back', 'Centre Back'].includes(player.position)) {
      groups.Defenders.push(player);
    } else if (['Defensive Midfield', 'Central Midfield', 'Attacking Midfield', 'Right Wing', 'Left Wing'].includes(player.position)) {
      groups.Midfielders.push(player);
    } else {
      groups.Forwards.push(player);
    }
  });

  return groups;
}

// Find stats for a player
function findPlayerStats(player: Player, allStats: PlayerStats[]): PlayerStats | undefined {
  return allStats.find(
    (s) => s.firstName === player.firstName && s.lastName === player.lastName
  );
}

export default async function MensTeamPage() {
  const [squadData, statsData, leagueData, position, upcomingFixtures, resultsData] = await Promise.all([
    getMensSquad(),
    getPlayerStats(),
    getMensLeagueTable(),
    getLeaguePosition(),
    getUpcomingMensFixtures(1),
    getResults(),
  ]);

  const groupedPlayers = groupByPosition(squadData.results);
  const nextFixture = upcomingFixtures[0];

  // Get latest men's result
  const mensResults = resultsData.results.filter(
    r => !r.homeTeam.includes('Ladies') && !r.awayTeam.includes('Ladies')
  );
  const lastResult = mensResults[0];

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
                <h1 className="text-xl md:text-2xl font-bold text-white">Men&apos;s First Team</h1>
                <p className="text-xs text-gray-200">JD Cymru South</p>
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
                Cwmbran Celtic Men&apos;s First Team compete in the JD Cymru South, the third tier of
                Welsh football. The club has a proud history dating back to 1925 and plays home games
                at the Avondale Motor Park Arena.
              </p>
              <p className="text-sm text-gray-700">
                We&apos;re always looking for talented players to strengthen our squad. If you&apos;re interested
                in joining, get in touch with us.
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

      {/* Squad */}
      <section className="py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-bold text-celtic-dark mb-3">Squad</h2>

            {Object.entries(groupedPlayers).map(([group, players]) => (
              players.length > 0 && (
                <div key={group} className="mb-4">
                  <h3 className="text-xs font-semibold text-celtic-blue mb-2">
                    {group}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {players
                      .sort((a, b) => a.squadNo - b.squadNo)
                      .map((player) => (
                        <PlayerCard
                          key={player.squadNo}
                          player={player}
                          stats={findPlayerStats(player, statsData.results)}
                        />
                      ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* League Table */}
      <section className="py-6 md:py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">JD Cymru South Table</h2>
            <div className="card overflow-hidden">
              <LeagueTable
                data={leagueData.results}
                highlightTeam="Cwmbran Celtic"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Scorers */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Top Scorers</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-celtic-blue text-white">
                    <th className="px-2 py-2 text-left">#</th>
                    <th className="px-2 py-2 text-left">Player</th>
                    <th className="px-2 py-2 text-center">Apps</th>
                    <th className="px-2 py-2 text-center">Goals</th>
                    <th className="px-2 py-2 text-center">Assists</th>
                  </tr>
                </thead>
                <tbody>
                  {statsData.results
                    .sort((a, b) => b.goals - a.goals)
                    .slice(0, 5)
                    .map((player, index) => (
                      <tr key={player.personId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-2 py-2 font-bold text-celtic-blue">{index + 1}</td>
                        <td className="px-2 py-2 font-medium">
                          {player.firstName} {player.lastName}
                        </td>
                        <td className="px-2 py-2 text-center">{player.appearances}</td>
                        <td className="px-2 py-2 text-center font-bold text-celtic-blue">{player.goals}</td>
                        <td className="px-2 py-2 text-center">{player.assists}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Celtic Bond Banner */}
      <CelticBondBanner />
    </>
  );
}
