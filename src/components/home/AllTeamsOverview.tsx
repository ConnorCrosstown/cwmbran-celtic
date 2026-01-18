import Link from 'next/link';
import Image from 'next/image';

interface TeamInfo {
  name: string;
  category: 'senior' | 'junior';
  league?: string;
  href: string;
  badge?: 'M' | 'W' | '2' | '3' | 'D' | 'WF' | 'J';
  badgeColor?: string;
}

const teams: TeamInfo[] = [
  // Senior Teams
  { name: "Men's First Team", category: 'senior', league: 'JD Cymru South', href: '/teams/mens', badge: 'M', badgeColor: 'bg-celtic-blue' },
  { name: "Women's Team", category: 'senior', league: 'Genero Adran South', href: '/teams/ladies', badge: 'W', badgeColor: 'bg-celtic-yellow text-celtic-dark' },
  { name: "Men's Seconds", category: 'senior', league: 'Gwent County Div 2', href: '/teams/mens-seconds', badge: '2', badgeColor: 'bg-celtic-blue' },
  { name: "Men's Thirds", category: 'senior', league: 'Gwent County Div 3', href: '/teams/mens-thirds', badge: '3', badgeColor: 'bg-celtic-blue' },
  { name: "Development Squad", category: 'senior', league: 'Development League', href: '/teams/development', badge: 'D', badgeColor: 'bg-gray-600' },
  { name: "Walking Football", category: 'senior', href: '/teams/walking', badge: 'WF', badgeColor: 'bg-celtic-green' },
  // Junior Teams
  { name: "Junior Teams", category: 'junior', league: 'Various Age Groups', href: '/community/youth', badge: 'J', badgeColor: 'bg-celtic-yellow text-celtic-dark' },
];

export default function AllTeamsOverview() {
  const seniorTeams = teams.filter(t => t.category === 'senior');
  const juniorTeams = teams.filter(t => t.category === 'junior');

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display uppercase text-celtic-dark mb-2">
            Our Club
          </h2>
          <p className="text-gray-600">
            From our first teams in the Welsh pyramid to our thriving junior section
          </p>
        </div>

        {/* Senior Teams */}
        <div className="mb-8">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-semibold">Senior Teams</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {seniorTeams.map((team) => (
              <Link
                key={team.name}
                href={team.href}
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-center group"
              >
                <div className={`w-10 h-10 ${team.badgeColor} rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm`}>
                  {team.badge}
                </div>
                <h4 className="font-semibold text-sm text-celtic-dark group-hover:text-celtic-blue transition-colors">
                  {team.name}
                </h4>
                {team.league && (
                  <p className="text-xs text-gray-500 mt-1">{team.league}</p>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Junior Section */}
        <div className="bg-celtic-yellow/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/club-logo.webp"
                alt="Cwmbran Celtic"
                width={64}
                height={64}
                className="w-16 h-16 flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-lg text-celtic-dark">Cwmbran Celtic Juniors</h3>
                <p className="text-gray-600 text-sm">
                  Developing the next generation of Celtic players across multiple age groups
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/community/youth"
                className="bg-celtic-blue text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-celtic-blue-dark transition-colors"
              >
                Junior Teams
              </Link>
              <Link
                href="/community"
                className="bg-white text-celtic-dark px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Community
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-celtic-blue">6</div>
            <div className="text-sm text-gray-500">Senior Teams</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-celtic-yellow">10+</div>
            <div className="text-sm text-gray-500">Junior Age Groups</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-celtic-blue">Tier 3</div>
            <div className="text-sm text-gray-500">Welsh Pyramid</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-celtic-green">1925</div>
            <div className="text-sm text-gray-500">Est.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
