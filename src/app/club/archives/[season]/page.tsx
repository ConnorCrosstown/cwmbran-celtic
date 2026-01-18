import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { seasonArchives, getSeasonArchive, getAllSeasons } from '@/data/season-archives';

interface Props {
  params: Promise<{ season: string }>;
}

export async function generateStaticParams() {
  return getAllSeasons().map((season) => ({
    season,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { season } = await params;
  const archive = getSeasonArchive(season);

  if (!archive) {
    return { title: 'Season Not Found' };
  }

  return {
    title: `${archive.season} Season Archive`,
    description: `Cwmbran Celtic AFC ${archive.season} season - league positions, results, top scorers and highlights.`,
  };
}

export default async function SeasonArchivePage({ params }: Props) {
  const { season } = await params;
  const archive = getSeasonArchive(season);

  if (!archive) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/club/archives" className="text-celtic-yellow/80 text-xs hover:text-celtic-yellow mb-2 inline-block">
              &larr; All Archives
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white">{archive.season} Season</h1>
            <p className="text-xs text-gray-200">
              Season archive and statistics
            </p>
          </div>
        </div>
      </section>

      {/* Men's Team */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Men&apos;s First Team</h2>

            <div className="card overflow-hidden mb-4">
              <div className="bg-celtic-blue p-3">
                <p className="text-sm font-semibold text-white">{archive.mens.league}</p>
              </div>
              <div className="p-4">
                {/* League position */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-celtic-blue text-white w-16 h-16 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{archive.mens.position}</span>
                    <span className="text-[10px] text-celtic-yellow">Position</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Final league position</p>
                    {archive.mens.manager && (
                      <p className="text-xs text-gray-500">Manager: {archive.mens.manager}</p>
                    )}
                  </div>
                </div>

                {/* Stats table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500">P</th>
                        <th className="text-center py-2 text-gray-500">W</th>
                        <th className="text-center py-2 text-gray-500">D</th>
                        <th className="text-center py-2 text-gray-500">L</th>
                        <th className="text-center py-2 text-gray-500">GF</th>
                        <th className="text-center py-2 text-gray-500">GA</th>
                        <th className="text-center py-2 text-gray-500">GD</th>
                        <th className="text-right py-2 text-gray-500">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 font-semibold">{archive.mens.played}</td>
                        <td className="py-2 text-center text-green-600 font-semibold">{archive.mens.won}</td>
                        <td className="py-2 text-center text-gray-600">{archive.mens.drawn}</td>
                        <td className="py-2 text-center text-red-600">{archive.mens.lost}</td>
                        <td className="py-2 text-center">{archive.mens.goalsFor}</td>
                        <td className="py-2 text-center">{archive.mens.goalsAgainst}</td>
                        <td className="py-2 text-center">{archive.mens.goalsFor - archive.mens.goalsAgainst}</td>
                        <td className="py-2 text-right font-bold text-celtic-blue">{archive.mens.points}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Top Scorer */}
                {archive.mens.topScorer && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Top Scorer</p>
                    <p className="text-sm font-semibold text-celtic-dark">
                      {archive.mens.topScorer.name} - {archive.mens.topScorer.goals} goals
                    </p>
                  </div>
                )}

                {/* Highlights */}
                {archive.mens.highlights && archive.mens.highlights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase mb-2">Season Highlights</p>
                    <ul className="space-y-1">
                      {archive.mens.highlights.map((highlight, i) => (
                        <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                          <span className="text-celtic-yellow">&#9679;</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Women's Team */}
      {archive.womens && (
        <section className="py-6 md:py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-bold text-celtic-dark mb-4">Women&apos;s Team</h2>

              <div className="card overflow-hidden mb-4">
                <div className="bg-celtic-blue p-3">
                  <p className="text-sm font-semibold text-white">{archive.womens.league}</p>
                </div>
                <div className="p-4">
                  {/* League position */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-celtic-blue text-white w-16 h-16 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{archive.womens.position}</span>
                      <span className="text-[10px] text-celtic-yellow">Position</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Final league position</p>
                    </div>
                  </div>

                  {/* Stats table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500">P</th>
                          <th className="text-center py-2 text-gray-500">W</th>
                          <th className="text-center py-2 text-gray-500">D</th>
                          <th className="text-center py-2 text-gray-500">L</th>
                          <th className="text-center py-2 text-gray-500">GF</th>
                          <th className="text-center py-2 text-gray-500">GA</th>
                          <th className="text-center py-2 text-gray-500">GD</th>
                          <th className="text-right py-2 text-gray-500">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 font-semibold">{archive.womens.played}</td>
                          <td className="py-2 text-center text-green-600 font-semibold">{archive.womens.won}</td>
                          <td className="py-2 text-center text-gray-600">{archive.womens.drawn}</td>
                          <td className="py-2 text-center text-red-600">{archive.womens.lost}</td>
                          <td className="py-2 text-center">{archive.womens.goalsFor}</td>
                          <td className="py-2 text-center">{archive.womens.goalsAgainst}</td>
                          <td className="py-2 text-center">{archive.womens.goalsFor - archive.womens.goalsAgainst}</td>
                          <td className="py-2 text-right font-bold text-celtic-blue">{archive.womens.points}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Top Scorer */}
                  {archive.womens.topScorer && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-[10px] text-gray-500 uppercase mb-1">Top Scorer</p>
                      <p className="text-sm font-semibold text-celtic-dark">
                        {archive.womens.topScorer.name} - {archive.womens.topScorer.goals} goals
                      </p>
                    </div>
                  )}

                  {/* Highlights */}
                  {archive.womens.highlights && archive.womens.highlights.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-[10px] text-gray-500 uppercase mb-2">Season Highlights</p>
                      <ul className="space-y-1">
                        {archive.womens.highlights.map((highlight, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-celtic-yellow">&#9679;</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cup Runs */}
      {archive.cupRuns && archive.cupRuns.length > 0 && (
        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-bold text-celtic-dark mb-4">Cup Competitions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {archive.cupRuns.map((cup, i) => (
                  <div key={i} className="card p-3">
                    <p className="text-xs text-gray-500">{cup.competition}</p>
                    <p className="text-sm font-semibold text-celtic-dark">{cup.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="py-6 md:py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            {/* Previous season */}
            {(() => {
              const currentIndex = seasonArchives.findIndex(s => s.slug === archive.slug);
              const prevSeason = seasonArchives[currentIndex + 1];
              if (prevSeason) {
                return (
                  <Link href={`/club/archives/${prevSeason.slug}`} className="text-celtic-blue text-sm hover:underline">
                    &larr; {prevSeason.season}
                  </Link>
                );
              }
              return <span></span>;
            })()}

            {/* Next season */}
            {(() => {
              const currentIndex = seasonArchives.findIndex(s => s.slug === archive.slug);
              const nextSeason = seasonArchives[currentIndex - 1];
              if (nextSeason) {
                return (
                  <Link href={`/club/archives/${nextSeason.slug}`} className="text-celtic-blue text-sm hover:underline">
                    {nextSeason.season} &rarr;
                  </Link>
                );
              }
              return <span></span>;
            })()}
          </div>
        </div>
      </section>
    </>
  );
}
