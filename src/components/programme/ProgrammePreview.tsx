'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { getOppositionById } from '@/data/opposition-data';
import { mockSquad, mockLeagueTable, mockResults, mockFixtures, clubInfo, sponsors } from '@/data/mock-data';

interface ProgrammeData {
  opponent: string;
  date: string;
  kickoff: string;
  competition: string;
  matchdayNumber: string;
  managersNotes: string;
  teamNews: string;
  matchSponsor: string;
}

interface ProgrammePreviewProps {
  data: ProgrammeData;
  onBack: () => void;
}

export default function ProgrammePreview({ data, onBack }: ProgrammePreviewProps) {
  const programmeRef = useRef<HTMLDivElement>(null);
  const opposition = getOppositionById(data.opponent);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get recent results
  const recentResults = mockResults.results
    .filter(r => r.homeTeam.includes('Cwmbran Celtic') || r.awayTeam.includes('Cwmbran Celtic'))
    .slice(0, 5);

  // Get upcoming fixtures
  const upcomingFixtures = mockFixtures.results
    .filter(f => !f.homeTeam.includes('Ladies') && !f.awayTeam.includes('Ladies'))
    .slice(0, 5);

  // Group squad by position
  const goalkeepers = mockSquad.results.filter(p => p.position === 'Goalkeeper');
  const defenders = mockSquad.results.filter(p =>
    p.position.includes('Back') || p.position.includes('Centre Back')
  );
  const midfielders = mockSquad.results.filter(p =>
    p.position.includes('Midfield') || p.position.includes('Wing')
  );
  const forwards = mockSquad.results.filter(p =>
    p.position === 'Striker' || p.position === 'Forward'
  );

  const handlePrint = () => {
    window.print();
  };

  const defaultManagersNotes = `Good afternoon and welcome to the Avondale Motor Park Arena for today's ${data.competition} fixture against ${opposition?.name || 'our opponents'}.

Thank you for your continued support - it means the world to everyone at the club. The lads have been working hard in training and we're looking forward to putting on a performance for you today.

Enjoy the game!

Simon Berry
First Team Manager`;

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Control Bar */}
      <div className="sticky top-0 z-50 bg-celtic-dark text-white py-3 print:hidden">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm flex items-center gap-2 hover:text-celtic-yellow transition-colors"
          >
            ← Back to Editor
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-celtic-yellow text-celtic-dark px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>🖨</span> Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Programme Pages */}
      <div ref={programmeRef} className="py-8 print:py-0">
        <div className="max-w-[210mm] mx-auto space-y-8 print:space-y-0">

          {/* PAGE 1: COVER */}
          <div className="bg-white shadow-lg print:shadow-none programme-page">
            <div className="aspect-[1/1.414] relative bg-gradient-to-br from-celtic-blue via-celtic-blue-dark to-celtic-blue overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-celtic-yellow blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col p-8 text-white">
                {/* Top Bar */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-celtic-yellow">{data.competition}</p>
                    <p className="text-xs text-gray-300">{formatDate(data.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-300">Kick-off</p>
                    <p className="text-2xl font-bold text-celtic-yellow">{data.kickoff}</p>
                  </div>
                </div>

                {/* Club Badge */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 mb-6 relative">
                    <Image
                      src="/images/club-logo.webp"
                      alt="Cwmbran Celtic"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">CWMBRAN CELTIC</h1>
                  <p className="text-xl text-celtic-yellow mb-4">vs</p>
                  <h2 className="text-2xl font-bold">{opposition?.name?.toUpperCase() || 'OPPOSITION'}</h2>
                  {opposition?.nickname && (
                    <p className="text-sm text-gray-300 mt-1">&quot;{opposition.nickname}&quot;</p>
                  )}
                </div>

                {/* Bottom */}
                <div className="mt-auto">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Official Match Programme</p>
                      <p className="text-xs text-gray-300">Avondale Motor Park Arena</p>
                    </div>
                    {data.matchdayNumber && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">Match Day</p>
                        <p className="text-2xl font-bold text-celtic-yellow">{data.matchdayNumber}</p>
                      </div>
                    )}
                  </div>
                  {data.matchSponsor && (
                    <div className="mt-4 pt-4 border-t border-white/20 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Today&apos;s match sponsor</p>
                      <p className="text-sm font-semibold">{data.matchSponsor}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 2: MANAGER'S NOTES */}
          <div className="bg-white shadow-lg print:shadow-none programme-page print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              <h2 className="text-xl font-bold text-celtic-blue border-b-2 border-celtic-yellow pb-2 mb-6">
                Manager&apos;s Notes
              </h2>

              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src="/images/staff/simon-berry.webp"
                    alt="Simon Berry"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-celtic-dark">Simon Berry</h3>
                  <p className="text-sm text-gray-500">First Team Manager</p>
                </div>
              </div>

              <div className="prose prose-sm flex-1">
                <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                  {data.managersNotes || defaultManagersNotes}
                </p>
              </div>

              {data.teamNews && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-celtic-blue mb-2 text-sm">Team News</h4>
                  <p className="text-sm text-gray-700">{data.teamNews}</p>
                </div>
              )}

              {/* Sponsor Ad */}
              <div className="mt-auto pt-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Principal Partner</p>
                  <Image
                    src={sponsors.main.logo}
                    alt={sponsors.main.name}
                    width={150}
                    height={50}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 3: SQUAD LIST */}
          <div className="bg-white shadow-lg print:shadow-none programme-page print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              <h2 className="text-xl font-bold text-celtic-blue border-b-2 border-celtic-yellow pb-2 mb-4">
                The Celtic Squad
              </h2>

              <div className="flex-1 grid grid-cols-2 gap-4 text-xs">
                {/* Goalkeepers */}
                <div>
                  <h3 className="font-bold text-celtic-yellow bg-celtic-blue px-2 py-1 rounded text-xs mb-2">Goalkeepers</h3>
                  <div className="space-y-1">
                    {goalkeepers.map(player => (
                      <div key={player.squadNo} className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          {player.squadNo}
                        </span>
                        <span className="text-gray-800">{player.firstName} {player.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defenders */}
                <div>
                  <h3 className="font-bold text-celtic-yellow bg-celtic-blue px-2 py-1 rounded text-xs mb-2">Defenders</h3>
                  <div className="space-y-1">
                    {defenders.slice(0, 8).map(player => (
                      <div key={player.squadNo} className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          {player.squadNo}
                        </span>
                        <span className="text-gray-800">{player.firstName} {player.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Midfielders */}
                <div>
                  <h3 className="font-bold text-celtic-yellow bg-celtic-blue px-2 py-1 rounded text-xs mb-2">Midfielders</h3>
                  <div className="space-y-1">
                    {midfielders.slice(0, 10).map(player => (
                      <div key={player.squadNo} className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          {player.squadNo}
                        </span>
                        <span className="text-gray-800">{player.firstName} {player.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forwards */}
                <div>
                  <h3 className="font-bold text-celtic-yellow bg-celtic-blue px-2 py-1 rounded text-xs mb-2">Forwards</h3>
                  <div className="space-y-1">
                    {forwards.slice(0, 8).map(player => (
                      <div key={player.squadNo} className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-celtic-blue text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          {player.squadNo}
                        </span>
                        <span className="text-gray-800">{player.firstName} {player.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Management */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-celtic-blue text-sm mb-2">Management Team</h3>
                <div className="flex gap-6 text-xs">
                  <div>
                    <p className="text-gray-500">Manager</p>
                    <p className="font-semibold">Simon Berry</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 4: OPPOSITION INFO */}
          <div className="bg-white shadow-lg print:shadow-none programme-page print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              <h2 className="text-xl font-bold text-celtic-blue border-b-2 border-celtic-yellow pb-2 mb-6">
                Today&apos;s Visitors: {opposition?.name}
              </h2>

              {opposition && (
                <>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-bold text-sm text-celtic-dark mb-3">Club Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Founded:</span>
                          <span className="font-medium">{opposition.founded}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ground:</span>
                          <span className="font-medium">{opposition.ground}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Colours:</span>
                          <span className="font-medium">{opposition.colours}</span>
                        </div>
                        {opposition.nickname && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Nickname:</span>
                            <span className="font-medium">{opposition.nickname}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {opposition.headToHead && (
                      <div>
                        <h3 className="font-bold text-sm text-celtic-dark mb-3">Head to Head</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div>
                              <p className="text-2xl font-bold text-celtic-blue">{opposition.headToHead.played}</p>
                              <p className="text-[10px] text-gray-500 uppercase">Played</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-600">{opposition.headToHead.celticWins}</p>
                              <p className="text-[10px] text-gray-500 uppercase">Wins</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-500">{opposition.headToHead.draws}</p>
                              <p className="text-[10px] text-gray-500 uppercase">Draws</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-red-600">{opposition.headToHead.oppositionWins}</p>
                              <p className="text-[10px] text-gray-500 uppercase">Losses</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {opposition.lastMeeting && (
                    <div className="bg-celtic-blue/5 rounded-lg p-4 mb-6">
                      <h4 className="font-bold text-sm text-celtic-blue mb-2">Last Meeting</h4>
                      <p className="text-sm">
                        <span className="font-medium">{opposition.lastMeeting.date}</span> -
                        <span className={`ml-2 font-bold ${
                          opposition.lastMeeting.result === 'W' ? 'text-green-600' :
                          opposition.lastMeeting.result === 'L' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {opposition.lastMeeting.result === 'W' ? 'Won' :
                           opposition.lastMeeting.result === 'L' ? 'Lost' : 'Drew'} {opposition.lastMeeting.score}
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Sponsor Ads */}
              <div className="mt-auto grid grid-cols-3 gap-4">
                {sponsors.partners.slice(0, 3).map((sponsor, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={100}
                      height={40}
                      className="max-h-8 w-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 5: LEAGUE TABLE */}
          <div className="bg-white shadow-lg print:shadow-none programme-page print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              <h2 className="text-xl font-bold text-celtic-blue border-b-2 border-celtic-yellow pb-2 mb-4">
                {data.competition} Table
              </h2>

              <div className="flex-1 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-celtic-blue text-white">
                      <th className="py-2 px-2 text-left">Pos</th>
                      <th className="py-2 px-2 text-left">Club</th>
                      <th className="py-2 px-1 text-center">P</th>
                      <th className="py-2 px-1 text-center">W</th>
                      <th className="py-2 px-1 text-center">D</th>
                      <th className="py-2 px-1 text-center">L</th>
                      <th className="py-2 px-1 text-center">GD</th>
                      <th className="py-2 px-2 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLeagueTable.results.map((team, idx) => (
                      <tr
                        key={team.club}
                        className={`border-b border-gray-100 ${
                          team.club === 'Cwmbran Celtic' ? 'bg-celtic-yellow/20 font-bold' :
                          team.club === opposition?.name ? 'bg-gray-100' : ''
                        }`}
                      >
                        <td className="py-1.5 px-2">{team.position}</td>
                        <td className="py-1.5 px-2 truncate max-w-[120px]">{team.club}</td>
                        <td className="py-1.5 px-1 text-center">{team.played}</td>
                        <td className="py-1.5 px-1 text-center">{team.won}</td>
                        <td className="py-1.5 px-1 text-center">{team.drawn}</td>
                        <td className="py-1.5 px-1 text-center">{team.lost}</td>
                        <td className="py-1.5 px-1 text-center">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                        <td className="py-1.5 px-2 text-center font-bold">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-[10px] text-gray-500">
                Table as of programme print date. Visit cwmbranceltic.com for live standings.
              </div>
            </div>
          </div>

          {/* PAGE 6: RESULTS & FIXTURES */}
          <div className="bg-white shadow-lg print:shadow-none programme-page print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              <div className="grid grid-cols-2 gap-6 flex-1">
                {/* Recent Results */}
                <div>
                  <h2 className="text-lg font-bold text-celtic-blue border-b-2 border-celtic-yellow pb-2 mb-4">
                    Recent Results
                  </h2>
                  <div className="space-y-2">
                    {recentResults.map((result, idx) => {
                      const isCelticHome = result.homeTeam.includes('Cwmbran Celtic');
                      const celticScore = isCelticHome ? result.homeScore : result.awayScore;
                      const oppScore = isCelticHome ? result.awayScore : result.homeScore;
                      const opponent = isCelticHome ? result.awayTeam : result.homeTeam;
                      const resultType = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';

                      return (
                        <div key={idx} className="flex items-center gap-2 text-xs bg-gray-50 rounded p-2">
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-white font-bold text-[10px] ${
                            resultType === 'W' ? 'bg-green-500' :
                            resultType === 'L' ? 'bg-red-500' : 'bg-gray-400'
                          }`}>
                            {resultType}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{opponent.replace(' Ladies', '')}</p>
                            <p className="text-[10px] text-gray-500">{isCelticHome ? 'H' : 'A'}</p>
                          </div>
                          <span className="font-bold">{celticScore}-{oppScore}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming Fixtures */}
                <div>
                  <h2 className="text-lg font-bold text-celtic-blue border-b-2 border-celtic-yellow pb-2 mb-4">
                    Upcoming Fixtures
                  </h2>
                  <div className="space-y-2">
                    {upcomingFixtures.map((fixture, idx) => {
                      const isCelticHome = fixture.homeTeam.includes('Cwmbran Celtic');
                      const opponent = isCelticHome ? fixture.awayTeam : fixture.homeTeam;
                      const date = new Date(fixture.date);

                      return (
                        <div key={idx} className="text-xs bg-gray-50 rounded p-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{opponent}</p>
                              <p className="text-[10px] text-gray-500">{isCelticHome ? 'Home' : 'Away'} • {fixture.time}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sponsor Banner */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-3">
                  {sponsors.partners.map((sponsor, idx) => (
                    <div key={idx} className="bg-gray-50 rounded p-2 flex items-center justify-center">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={80}
                        height={30}
                        className="max-h-6 w-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 7: CLUB INFO / BACK COVER */}
          <div className="bg-white shadow-lg print:shadow-none programme-page print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col bg-gradient-to-br from-celtic-blue to-celtic-blue-dark text-white">
              <div className="flex-1">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <Image
                      src="/images/club-logo.webp"
                      alt="Cwmbran Celtic"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-bold">CWMBRAN CELTIC AFC</h2>
                  <p className="text-sm text-gray-300">Est. {clubInfo.founded}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="font-bold text-celtic-yellow mb-2">Ground</h3>
                    <p>{clubInfo.ground.name}</p>
                    <p className="text-gray-300 text-xs">{clubInfo.ground.address.street}</p>
                    <p className="text-gray-300 text-xs">{clubInfo.ground.address.town}, {clubInfo.ground.address.postcode}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-celtic-yellow mb-2">Admission</h3>
                    <p>Adults: £{clubInfo.admission.adults}</p>
                    <p>Concessions: £{clubInfo.admission.concessions}</p>
                    <p>Under 16s: FREE</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-celtic-yellow mb-2">Contact</h3>
                    <p className="text-xs">{clubInfo.contact.email}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-celtic-yellow mb-2">Online</h3>
                    <p className="text-xs">cwmbranceltic.com</p>
                    <p className="text-xs">@cwmbranceltic</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/20">
                <p className="text-center text-xs text-gray-400">
                  Thank you for supporting Cwmbran Celtic AFC
                </p>
                <p className="text-center text-[10px] text-gray-500 mt-2">
                  Programme designed by cwmbranceltic.com
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .programme-page {
            page-break-after: always;
            break-after: page;
          }
          .programme-page:last-child {
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
}
