import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockSquad, mockPlayerStats } from '@/data/mock-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function createSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-');
}

function getPlayerBySlug(slug: string) {
  return mockSquad.results.find(
    (p) => createSlug(p.firstName, p.lastName) === slug
  );
}

function getPlayerStats(firstName: string, lastName: string) {
  return mockPlayerStats.results.find(
    (s) => s.firstName === firstName && s.lastName === lastName
  );
}

function calculateAge(dateOfBirth: number): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export async function generateStaticParams() {
  return mockSquad.results.map((player) => ({
    slug: createSlug(player.firstName, player.lastName),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    return { title: 'Player Not Found' };
  }

  return {
    title: `${player.firstName} ${player.lastName}`,
    description: `${player.firstName} ${player.lastName} - ${player.position} for Cwmbran Celtic AFC Men's First Team.`,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const stats = getPlayerStats(player.firstName, player.lastName);
  const age = calculateAge(player.dateOfBirth);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-celtic-blue-dark to-celtic-blue overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Player Image */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
              <div className="absolute inset-0 bg-celtic-yellow rounded-full transform -rotate-6" />
              <div className="absolute inset-2 bg-white rounded-full overflow-hidden">
                {player.photo && !player.photo.includes('placeholder') ? (
                  <Image
                    src={player.photo}
                    alt={`${player.firstName} ${player.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-celtic-blue to-celtic-blue-dark flex items-center justify-center">
                    <span className="text-7xl font-display text-white/30">
                      {player.squadNo}
                    </span>
                  </div>
                )}
              </div>
              {/* Squad Number */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-celtic-yellow rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-display font-bold text-celtic-dark">
                  {player.squadNo}
                </span>
              </div>
            </div>

            {/* Player Info */}
            <div className="text-center md:text-left text-white">
              <div className="text-celtic-yellow font-semibold mb-2">
                {player.position}
              </div>
              <h1 className="text-4xl md:text-6xl font-display uppercase mb-4">
                {player.firstName}<br />
                <span className="text-celtic-yellow">{player.lastName}</span>
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Age</span>
                  <p className="text-xl font-bold">{age}</p>
                </div>
                <div>
                  <span className="text-gray-400">Squad No.</span>
                  <p className="text-xl font-bold">#{player.squadNo}</p>
                </div>
                <div>
                  <span className="text-gray-400">Appearances</span>
                  <p className="text-xl font-bold">{player.appearances}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Season Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-display uppercase text-celtic-dark mb-6">
                2025-26 Season Stats
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl md:text-4xl font-display text-celtic-blue mb-1">
                    {player.appearances}
                  </div>
                  <div className="text-sm text-gray-500">Appearances</div>
                </div>

                {stats && (
                  <>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl md:text-4xl font-display text-celtic-blue mb-1">
                        {stats.goals}
                      </div>
                      <div className="text-sm text-gray-500">Goals</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl md:text-4xl font-display text-celtic-blue mb-1">
                        {stats.assists}
                      </div>
                      <div className="text-sm text-gray-500">Assists</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl md:text-4xl font-display text-celtic-yellow mb-1">
                        {stats.yellowCards}
                      </div>
                      <div className="text-sm text-gray-500">Yellow Cards</div>
                    </div>
                  </>
                )}

                {!stats && (
                  <>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl md:text-4xl font-display text-celtic-blue mb-1">-</div>
                      <div className="text-sm text-gray-500">Goals</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl md:text-4xl font-display text-celtic-blue mb-1">-</div>
                      <div className="text-sm text-gray-500">Assists</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl md:text-4xl font-display text-celtic-blue mb-1">-</div>
                      <div className="text-sm text-gray-500">Yellow Cards</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Player Sponsorship CTA */}
            <div className="bg-celtic-yellow rounded-2xl p-6 md:p-8 text-center">
              <h3 className="text-xl font-bold text-celtic-dark mb-2">
                Sponsor {player.firstName}!
              </h3>
              <p className="text-celtic-dark/80 mb-4">
                Show your support by becoming {player.firstName}&apos;s official player sponsor for the season.
              </p>
              <Link href="/hospitality" className="btn-primary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <Link
              href="/players"
              className="text-celtic-blue font-semibold hover:text-celtic-blue-dark transition-colors"
            >
              ← Back to Squad
            </Link>
            <Link
              href="/teams/mens"
              className="text-celtic-blue font-semibold hover:text-celtic-blue-dark transition-colors"
            >
              Team Page →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
