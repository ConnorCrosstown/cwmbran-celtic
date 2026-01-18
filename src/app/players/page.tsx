import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { mockSquad } from '@/data/mock-data';

export const metadata: Metadata = {
  title: 'Squad',
  description: 'Meet the Cwmbran Celtic AFC Men\'s First Team squad for the 2025-26 season.',
};

// Group players by position
function groupByPosition(players: typeof mockSquad.results) {
  const groups: Record<string, typeof players> = {
    'Goalkeepers': [],
    'Defenders': [],
    'Midfielders': [],
    'Forwards': [],
  };

  players.forEach(player => {
    if (player.position === 'Goalkeeper') {
      groups['Goalkeepers'].push(player);
    } else if (player.position.includes('Back') || player.position === 'Centre Back') {
      groups['Defenders'].push(player);
    } else if (player.position.includes('Midfield')) {
      groups['Midfielders'].push(player);
    } else {
      groups['Forwards'].push(player);
    }
  });

  return groups;
}

function createSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-');
}

export default function PlayersPage() {
  const groupedPlayers = groupByPosition(mockSquad.results);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display uppercase mb-4">
            Men&apos;s First Team Squad
          </h1>
          <p className="text-xl text-gray-300">
            2025-26 Season • JD Cymru South
          </p>
        </div>
      </section>

      {/* Squad */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {Object.entries(groupedPlayers).map(([position, players]) => (
            players.length > 0 && (
              <div key={position} className="mb-12">
                <SectionHeader title={position} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {players.sort((a, b) => a.squadNo - b.squadNo).map((player) => (
                    <Link
                      key={player.squadNo}
                      href={`/players/${createSlug(player.firstName, player.lastName)}`}
                      className="group"
                    >
                      <div className="card overflow-hidden">
                        {/* Player Image */}
                        <div className="aspect-square bg-gradient-to-br from-celtic-blue to-celtic-blue-dark relative">
                          {player.photo && !player.photo.includes('placeholder') ? (
                            <Image
                              src={player.photo}
                              alt={`${player.firstName} ${player.lastName}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-6xl font-display text-white/20">
                                {player.squadNo}
                              </span>
                            </div>
                          )}
                          {/* Squad Number Badge */}
                          <div className="absolute top-2 left-2 w-8 h-8 bg-celtic-yellow text-celtic-dark rounded-full flex items-center justify-center font-bold text-sm">
                            {player.squadNo}
                          </div>
                        </div>

                        {/* Player Info */}
                        <div className="p-4">
                          <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                            {player.firstName} {player.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{player.position}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Other Teams Link */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">Looking for other teams?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/teams/ladies" className="btn-outline">
              Women&apos;s Team
            </Link>
            <Link href="/teams" className="btn-primary">
              All Teams
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
