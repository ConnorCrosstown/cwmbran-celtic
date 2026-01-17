import { Metadata } from 'next';
import PlayerCard from '@/components/squad/PlayerCard';
import LeagueTable from '@/components/tables/LeagueTable';
import { getMensSquad, getPlayerStats, getMensLeagueTable, getLeaguePosition } from '@/lib/comet';
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
  const [squadData, statsData, leagueData, position] = await Promise.all([
    getMensSquad(),
    getPlayerStats(),
    getMensLeagueTable(),
    getLeaguePosition(),
  ]);

  const groupedPlayers = groupByPosition(squadData.results);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Men&apos;s First Team</h1>
            <p className="text-lg text-gray-200 mb-6">
              Competing in the JD Cymru South
            </p>

            {/* Current Position */}
            {position && (
              <div className="inline-flex items-center gap-4 bg-white/10 rounded-lg px-6 py-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-celtic-yellow">{position.position}<sup>th</sup></p>
                  <p className="text-sm text-gray-300">Position</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-4xl font-bold">{position.points}</p>
                  <p className="text-sm text-gray-300">Points</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <p className="text-4xl font-bold">{position.played}</p>
                  <p className="text-sm text-gray-300">Played</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Squad */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title">Squad</h2>

            {Object.entries(groupedPlayers).map(([group, players]) => (
              players.length > 0 && (
                <div key={group} className="mb-12">
                  <h3 className="text-xl font-bold text-celtic-blue mb-6 pb-2 border-b-2 border-celtic-yellow">
                    {group}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">JD Cymru South Table</h2>
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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Top Scorers</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-celtic-blue text-white">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Player</th>
                    <th className="px-4 py-3 text-center">Apps</th>
                    <th className="px-4 py-3 text-center">Goals</th>
                    <th className="px-4 py-3 text-center">Assists</th>
                  </tr>
                </thead>
                <tbody>
                  {statsData.results
                    .sort((a, b) => b.goals - a.goals)
                    .slice(0, 5)
                    .map((player, index) => (
                      <tr key={player.personId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold text-celtic-blue">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">
                          {player.firstName} {player.lastName}
                        </td>
                        <td className="px-4 py-3 text-center">{player.appearances}</td>
                        <td className="px-4 py-3 text-center font-bold text-celtic-blue">{player.goals}</td>
                        <td className="px-4 py-3 text-center">{player.assists}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
