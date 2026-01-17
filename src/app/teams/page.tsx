import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Teams',
  description: 'Explore all Cwmbran Celtic AFC teams including Men\'s First Team, Ladies, Development Squad, and Walking Football.',
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
    name: 'Ladies',
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
    color: 'bg-celtic-green',
  },
];

export default function TeamsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Teams</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Cwmbran Celtic AFC - football for everyone since 1924
          </p>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team) => (
                <Link
                  key={team.href}
                  href={team.href}
                  className="card group hover:shadow-lg transition-shadow"
                >
                  <div className={`${team.color} h-32 flex items-center justify-center`}>
                    <span className="text-4xl font-bold text-white/30 group-hover:text-white/50 transition-colors">
                      CC
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-celtic-dark mb-2 group-hover:text-celtic-blue transition-colors">
                      {team.name}
                    </h2>
                    <p className="text-gray-600 mb-3">{team.description}</p>
                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      {team.league}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
            Interested in Playing?
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            We&apos;re always looking for talented players to join our squads. Get in touch to find out about trials and training sessions.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
