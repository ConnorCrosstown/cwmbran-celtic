import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Teams',
  description: 'Explore all Cwmbran Celtic AFC teams including Men\'s First Team, Women\'s Team, Development Squad, and Walking Football.',
};

const teams = [
  {
    name: "Men's First Team",
    href: '/teams/mens',
    description: 'Competing in the JD Cymru South league',
    league: 'JD Cymru South',
    color: 'bg-celtic-blue',
  },
  {
    name: "Men's Seconds",
    href: '/teams/mens-seconds',
    description: 'Competing in the Gwent County League Division 2',
    league: 'Gwent County League Division 2',
    color: 'bg-celtic-blue',
  },
  {
    name: "Men's Thirds",
    href: '/teams/mens-thirds',
    description: 'Competing in the Gwent County League Division 3',
    league: 'Gwent County League Division 3',
    color: 'bg-celtic-blue',
  },
  {
    name: "Women's Team",
    href: '/teams/ladies',
    description: 'Competing in the Genero Adran South league',
    league: 'Genero Adran South',
    color: 'bg-celtic-blue',
  },
  {
    name: 'Development Squad',
    href: '/teams/development',
    description: 'Developing the next generation of Celtic players',
    league: 'Reserve League',
    color: 'bg-celtic-blue-light',
  },
  {
    name: 'Walking Football',
    href: '/teams/walking',
    description: 'Football for all ages and abilities',
    league: 'Community',
    color: 'bg-celtic-blue',
  },
];

export default function TeamsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">Our Teams</h1>
          <p className="text-xs text-celtic-yellow">
            Football for everyone since 1925
          </p>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teams.map((team) => (
                <Link
                  key={team.href}
                  href={team.href}
                  className="card group hover:shadow-md transition-all flex items-center gap-3 p-3"
                >
                  <div className={`${team.color} w-10 h-10 rounded flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>CC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                      {team.name}
                    </h2>
                    <p className="text-xs text-gray-600">{team.description}</p>
                    <span className="inline-block bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 mt-0.5">
                      {team.league}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-celtic-blue transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Interested in Playing?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            We&apos;re always looking for talented players to join our squads. Get in touch to find out about trials and training sessions.
          </p>
          <Link href="/contact" className="btn-primary text-sm px-4 py-2">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
