import { Metadata } from 'next';
import Link from 'next/link';
import LeagueTable from '@/components/tables/LeagueTable';
import CelticBondBanner from '@/components/banners/CelticBondBanner';
import { getLadiesLeagueTable } from '@/lib/comet';

export const metadata: Metadata = {
  title: 'Ladies Team',
  description: 'Meet the Cwmbran Celtic Ladies team. View fixtures, results, and league position in the Genero Adran South.',
};

export default async function LadiesTeamPage() {
  const leagueData = await getLadiesLeagueTable();

  // Find team position
  const position = leagueData.results.find((row) =>
    row.club.includes('Cwmbran Celtic Ladies')
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cwmbran Celtic Ladies</h1>
            <p className="text-lg text-gray-200 mb-6">
              Competing in the Genero Adran South
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

      {/* About */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">About the Team</h2>

            <div className="card p-6 mb-8">
              <p className="text-gray-700 mb-4">
                Cwmbran Celtic Ladies compete in the Genero Adran South, part of the FAW Women&apos;s
                pyramid system. The team trains regularly and plays home games at the Avondale Motor Park Arena.
              </p>
              <p className="text-gray-700">
                We&apos;re always looking for new players to join our squad. Whether you&apos;re an experienced
                player or new to the game, we&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-3">Training</h3>
                <p className="text-gray-600">
                  Training sessions are held weekly. Contact us for current times and location.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-3">Home Games</h3>
                <p className="text-gray-600">
                  Home matches are played at the Avondale Motor Park Arena. Check fixtures for kick-off times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* League Table */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Genero Adran South Table</h2>
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
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
            Interested in Joining?
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            We welcome players of all abilities. Get in touch to find out about training sessions and trials.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Celtic Bond Banner */}
      <CelticBondBanner />
    </>
  );
}
