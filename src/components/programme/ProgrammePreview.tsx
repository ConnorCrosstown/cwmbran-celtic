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
  coverImage?: string;
  actionImage?: string;
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

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get recent results (men's only)
  const recentResults = mockResults.results
    .filter(r =>
      (r.homeTeam.includes('Cwmbran Celtic') || r.awayTeam.includes('Cwmbran Celtic')) &&
      !r.homeTeam.includes('Ladies') && !r.awayTeam.includes('Ladies')
    )
    .slice(0, 5);

  // Get upcoming fixtures (men's only)
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

  // Player row component with checkbox - compact version for PDF
  const PlayerRow = ({ player }: { player: typeof mockSquad.results[0] }) => (
    <div className="flex items-center gap-1.5 py-0.5">
      {/* Checkbox for lineup */}
      <div className="w-3.5 h-3.5 border-2 border-gray-400 rounded-sm flex-shrink-0" />

      {/* Squad number */}
      <span className="w-5 h-5 bg-celtic-blue text-white rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0">
        {player.squadNo}
      </span>

      {/* Name */}
      <span className="text-[11px] text-gray-800 font-medium leading-tight">
        {player.firstName} {player.lastName}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-300 print:bg-white" id="programme-container">
      {/* Control Bar - Hidden when printing */}
      <div className="sticky top-0 z-50 bg-celtic-dark text-white py-3 print:hidden shadow-lg no-print">
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
              className="bg-celtic-yellow text-celtic-dark px-6 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow"
            >
              <span>🖨️</span> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Instructions - Hidden when printing */}
      <div className="bg-celtic-blue/10 border-b border-celtic-blue/20 py-2 print:hidden no-print">
        <div className="container mx-auto px-4 text-center text-sm text-celtic-dark">
          <strong>Tip:</strong> Click &quot;Print / Save as PDF&quot; then select &quot;Save as PDF&quot; as the destination. Use A4 paper size for best results.
        </div>
      </div>

      {/* Programme Pages Container */}
      <div ref={programmeRef} className="py-8 print:py-0 print:m-0">
        <div className="max-w-[210mm] mx-auto print:max-w-none print:w-full">

          {/* ==================== PAGE 1: COVER ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0">
            <div className="aspect-[1/1.414] relative overflow-hidden">
              {/* Cover Image Background */}
              {data.coverImage ? (
                <div className="absolute inset-0">
                  <Image
                    src={data.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                  {/* Stronger gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-celtic-dark via-celtic-blue/80 to-celtic-blue/40" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-celtic-blue via-celtic-blue-dark to-celtic-blue">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-celtic-yellow blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                  </div>
                  {/* Diagonal stripes */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 2px, transparent 2px, transparent 20px)'
                  }} />
                </div>
              )}

              {/* Cover Content */}
              <div className="relative h-full flex flex-col p-10">
                {/* Header Bar */}
                <div className="flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: '#facc15' }}>Official Match Programme</p>
                    <p className="text-sm font-bold text-white">{data.competition}</p>
                  </div>
                  <div className="rounded-lg px-4 py-2 text-center" style={{ backgroundColor: '#facc15' }}>
                    <p className="text-2xl font-black" style={{ color: '#0f172a' }}>{data.kickoff}</p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#374151' }}>Kick-off</p>
                  </div>
                </div>

                {/* Main Content - Centered */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  {/* Club Badge */}
                  <div className="w-36 h-36 mb-6 relative drop-shadow-2xl">
                    <Image
                      src="/images/club-logo.webp"
                      alt="Cwmbran Celtic"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Team Names */}
                  <h1 className="text-4xl font-black tracking-tight mb-3" style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>CWMBRAN CELTIC</h1>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-[2px] w-16" style={{ backgroundColor: '#facc15' }} />
                    <span className="text-2xl font-bold" style={{ color: '#facc15' }}>VS</span>
                    <div className="h-[2px] w-16" style={{ backgroundColor: '#facc15' }} />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight" style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>{opposition?.name?.toUpperCase() || 'OPPOSITION'}</h2>
                  {opposition?.nickname && (
                    <p className="text-lg mt-2 italic font-semibold" style={{ color: '#facc15' }}>&ldquo;{opposition.nickname}&rdquo;</p>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto">
                  {/* Match Details Bar */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#facc15' }}>Date</p>
                        <p className="font-semibold text-white">{formatDate(data.date)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#facc15' }}>Venue</p>
                        <p className="font-semibold text-white">Avondale Motor Park Arena</p>
                      </div>
                      {data.matchdayNumber && (
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#facc15' }}>Match Day</p>
                          <p className="font-black text-xl text-white">{data.matchdayNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sponsor */}
                  {data.matchSponsor && (
                    <div className="text-center border-t border-white/30 pt-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-1 font-semibold" style={{ color: '#facc15' }}>Today&apos;s Match Sponsor</p>
                      <p className="font-bold text-lg text-white">{data.matchSponsor}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 2: MANAGER'S NOTES ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page">
            <div className="aspect-[1/1.414] p-10 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-4 border-celtic-blue">
                <div className="w-3 h-12 bg-celtic-yellow rounded-full" />
                <h2 className="text-2xl font-black text-celtic-dark tracking-tight">MANAGER&apos;S NOTES</h2>
              </div>

              {/* Manager Info */}
              <div className="flex gap-6 mb-6">
                <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-4 border-celtic-blue">
                  <Image
                    src="/images/staff/simon-berry.webp"
                    alt="Simon Berry"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-black text-xl text-celtic-dark">Simon Berry</h3>
                  <p className="text-celtic-blue font-semibold">First Team Manager</p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-celtic-blue/10 text-celtic-blue text-[10px] font-semibold px-2 py-1 rounded">Since 2023</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 whitespace-pre-line text-[13px] leading-relaxed">
                  {data.managersNotes || defaultManagersNotes}
                </p>
              </div>

              {/* Team News */}
              {data.teamNews && (
                <div className="mt-6 bg-celtic-yellow/20 border-l-4 border-celtic-yellow rounded-r-lg p-4">
                  <h4 className="font-bold text-celtic-dark mb-2 flex items-center gap-2">
                    <span>📋</span> Team News
                  </h4>
                  <p className="text-sm text-gray-700">{data.teamNews}</p>
                </div>
              )}

              {/* Sponsor */}
              <div className="mt-auto pt-6">
                <div className="bg-white border-2 border-gray-100 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-2 font-semibold">Principal Partner</p>
                  <Image
                    src={sponsors.main.logo}
                    alt={sponsors.main.name}
                    width={160}
                    height={60}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 3: SQUAD LIST WITH CHECKBOXES ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page overflow-hidden">
            <div className="aspect-[1/1.414] p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3 pb-2 border-b-4 border-celtic-blue">
                <div className="w-2 h-8 bg-celtic-yellow rounded-full" />
                <div>
                  <h2 className="text-xl font-black text-celtic-dark tracking-tight">CWMBRAN CELTIC SQUAD</h2>
                  <p className="text-[10px] text-gray-500">Tick the players in today&apos;s starting lineup</p>
                </div>
              </div>

              {/* Squad Grid - 2 columns */}
              <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1">
                {/* Left Column: Goalkeepers & Defenders */}
                <div className="space-y-2">
                  {/* Goalkeepers */}
                  <div>
                    <div className="bg-celtic-blue text-white px-2 py-1 rounded-t">
                      <h3 className="font-bold text-[10px] uppercase tracking-wider">Goalkeepers</h3>
                    </div>
                    <div className="border border-t-0 border-gray-200 rounded-b px-2 py-1 bg-gray-50/50">
                      {goalkeepers.slice(0, 2).map(player => (
                        <PlayerRow key={player.squadNo} player={player} />
                      ))}
                    </div>
                  </div>

                  {/* Defenders */}
                  <div>
                    <div className="bg-celtic-blue text-white px-2 py-1 rounded-t">
                      <h3 className="font-bold text-[10px] uppercase tracking-wider">Defenders</h3>
                    </div>
                    <div className="border border-t-0 border-gray-200 rounded-b px-2 py-1 bg-gray-50/50">
                      {defenders.slice(0, 6).map(player => (
                        <PlayerRow key={player.squadNo} player={player} />
                      ))}
                    </div>
                  </div>

                  {/* Forwards */}
                  <div>
                    <div className="bg-celtic-blue text-white px-2 py-1 rounded-t">
                      <h3 className="font-bold text-[10px] uppercase tracking-wider">Forwards</h3>
                    </div>
                    <div className="border border-t-0 border-gray-200 rounded-b px-2 py-1 bg-gray-50/50">
                      {forwards.slice(0, 4).map(player => (
                        <PlayerRow key={player.squadNo} player={player} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Midfielders */}
                <div className="space-y-2">
                  {/* Midfielders */}
                  <div>
                    <div className="bg-celtic-blue text-white px-2 py-1 rounded-t">
                      <h3 className="font-bold text-[10px] uppercase tracking-wider">Midfielders</h3>
                    </div>
                    <div className="border border-t-0 border-gray-200 rounded-b px-2 py-1 bg-gray-50/50">
                      {midfielders.slice(0, 10).map(player => (
                        <PlayerRow key={player.squadNo} player={player} />
                      ))}
                    </div>
                  </div>

                  {/* Substitutes / Notes area */}
                  <div className="bg-gray-100 rounded p-2">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Substitutes</p>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border border-gray-300 rounded-sm" />
                        <span className="text-[10px] text-gray-400">_________________</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border border-gray-300 rounded-sm" />
                        <span className="text-[10px] text-gray-400">_________________</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border border-gray-300 rounded-sm" />
                        <span className="text-[10px] text-gray-400">_________________</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Management Footer */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between bg-celtic-dark text-white rounded px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-celtic-yellow font-bold text-xs">MANAGER:</span>
                    <span className="text-xs">Simon Berry</span>
                  </div>
                  <div className="text-celtic-yellow text-xs font-bold">
                    #UpTheCeltic
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 4: TODAY'S MATCH - BOTH TEAMS ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page overflow-hidden">
            <div className="aspect-[1/1.414] p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-center gap-4 mb-4 pb-3 border-b-4 border-celtic-blue">
                <h2 className="text-xl font-black text-celtic-dark tracking-tight text-center">TODAY&apos;S MATCH</h2>
              </div>

              {/* Two Team Columns */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Home Team - Cwmbran Celtic */}
                <div className="bg-celtic-blue rounded-lg overflow-hidden">
                  <div className="bg-celtic-dark px-3 py-2 text-center">
                    <p className="text-celtic-yellow font-black text-sm">CWMBRAN CELTIC</p>
                    <p className="text-white/80 text-[10px]">Home</p>
                  </div>
                  <div className="p-3 space-y-0.5">
                    {/* Show all squad in compact list */}
                    {[...goalkeepers.slice(0, 1), ...defenders.slice(0, 4), ...midfielders.slice(0, 4), ...forwards.slice(0, 2)].map((player, idx) => (
                      <div key={player.squadNo} className="flex items-center gap-1.5 py-0.5">
                        <span className="w-4 h-4 bg-celtic-yellow text-celtic-dark rounded text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {player.squadNo}
                        </span>
                        <span className="text-white text-[10px]">{player.firstName} {player.lastName}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/20 mt-2 pt-2">
                      <p className="text-celtic-yellow text-[9px] font-semibold">SUBSTITUTES</p>
                      {[...goalkeepers.slice(1, 2), ...defenders.slice(4, 5), ...midfielders.slice(4, 6), ...forwards.slice(2, 3)].map((player) => (
                        <div key={player.squadNo} className="flex items-center gap-1.5 py-0.5">
                          <span className="w-4 h-4 bg-white/20 text-white rounded text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                            {player.squadNo}
                          </span>
                          <span className="text-white/80 text-[10px]">{player.firstName} {player.lastName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Away Team - Opposition */}
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-3 py-2 text-center">
                    <p className="text-white font-black text-sm">{opposition?.name?.toUpperCase() || 'OPPOSITION'}</p>
                    <p className="text-gray-400 text-[10px]">Away</p>
                  </div>
                  <div className="p-3">
                    <p className="text-gray-500 text-[10px] mb-2 uppercase font-semibold">Starting XI</p>
                    {/* Placeholder lines for away team */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                      <div key={num} className="flex items-center gap-1.5 py-0.5">
                        <span className="w-4 h-4 bg-gray-300 text-gray-600 rounded text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {num}
                        </span>
                        <span className="text-gray-400 text-[10px]">____________________</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <p className="text-gray-500 text-[9px] font-semibold">SUBSTITUTES</p>
                      {[12, 14, 15, 16, 17].map((num) => (
                        <div key={num} className="flex items-center gap-1.5 py-0.5">
                          <span className="w-4 h-4 bg-gray-200 text-gray-500 rounded text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                            {num}
                          </span>
                          <span className="text-gray-300 text-[10px]">____________________</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Officials */}
              <div className="mt-3 pt-3 border-t-2 border-gray-200">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold mb-2 text-center">Match Officials</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase">Referee</p>
                      <p className="text-[10px] text-gray-600 font-medium">_____________</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase">Assistant 1</p>
                      <p className="text-[10px] text-gray-600 font-medium">_____________</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase">Assistant 2</p>
                      <p className="text-[10px] text-gray-600 font-medium">_____________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 5: CLUB HISTORY ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4 pb-3 border-b-4" style={{ borderColor: '#1e3a8a' }}>
                <div className="w-3 h-10 rounded-full" style={{ backgroundColor: '#facc15' }} />
                <div>
                  <h2 className="text-xl font-black tracking-tight" style={{ color: '#0f172a' }}>OUR HISTORY</h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>100 Years of Cwmbran Celtic</p>
                </div>
              </div>

              {/* Timeline Content */}
              <div className="flex-1 space-y-4">
                {/* Founding */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>
                      1925
                    </div>
                    <div className="w-0.5 flex-1" style={{ backgroundColor: '#e5e7eb' }} />
                  </div>
                  <div className="flex-1 pb-4">
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#0f172a' }}>The Beginning</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>
                      Cwmbran Celtic AFC was founded in 1925, emerging from the proud working-class community of Cwmbran.
                      In an era when the town was still developing around its iron and steel industries, local men came together
                      to form a football club that would represent their community for generations to come.
                    </p>
                  </div>
                </div>

                {/* Early Years */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs" style={{ backgroundColor: '#facc15', color: '#0f172a' }}>
                      1940s
                    </div>
                    <div className="w-0.5 flex-1" style={{ backgroundColor: '#e5e7eb' }} />
                  </div>
                  <div className="flex-1 pb-4">
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#0f172a' }}>Post-War Revival</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>
                      After the Second World War, the club reformed with renewed vigour. Cwmbran was designated a New Town
                      in 1949, bringing an influx of new residents and supporters. The Celtic became a focal point for
                      community spirit in the growing town.
                    </p>
                  </div>
                </div>

                {/* Modern Era */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>
                      2000s
                    </div>
                    <div className="w-0.5 flex-1" style={{ backgroundColor: '#e5e7eb' }} />
                  </div>
                  <div className="flex-1 pb-4">
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#0f172a' }}>Rising Through the Ranks</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>
                      The 21st century saw Celtic climb the Welsh football pyramid. The club earned promotion to the
                      Welsh Football League and later to Tier 3 of the Cymru Leagues, competing against some of
                      Wales&apos; most historic clubs.
                    </p>
                  </div>
                </div>

                {/* Today */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs" style={{ backgroundColor: '#facc15', color: '#0f172a' }}>
                      NOW
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#0f172a' }}>The Celtic Today</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>
                      Today, Cwmbran Celtic fields men&apos;s, women&apos;s and development teams. Playing at the Avondale Motor Park Arena,
                      we remain committed to our founding values: community, passion, and the beautiful game. As we approach
                      our centenary, we thank every player, volunteer, and supporter who has made this journey possible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote Box */}
              <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: '#1e3a8a' }}>
                <p className="text-sm italic text-center text-white">
                  &ldquo;More than a club - we are a family, a community, a century of shared dreams.&rdquo;
                </p>
                <p className="text-xs text-center mt-2" style={{ color: '#facc15' }}>
                  Fraternitas in Ludis - Brotherhood in Sport
                </p>
              </div>

              {/* Stats Row */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="text-center p-2 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                  <p className="text-xl font-black" style={{ color: '#1e3a8a' }}>{new Date().getFullYear() - 1925}</p>
                  <p className="text-[9px] uppercase" style={{ color: '#6b7280' }}>Years</p>
                </div>
                <div className="text-center p-2 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                  <p className="text-xl font-black" style={{ color: '#1e3a8a' }}>3</p>
                  <p className="text-[9px] uppercase" style={{ color: '#6b7280' }}>Teams</p>
                </div>
                <div className="text-center p-2 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                  <p className="text-xl font-black" style={{ color: '#1e3a8a' }}>Tier 3</p>
                  <p className="text-[9px] uppercase" style={{ color: '#6b7280' }}>Level</p>
                </div>
                <div className="text-center p-2 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                  <p className="text-xl font-black" style={{ color: '#1e3a8a' }}>1</p>
                  <p className="text-[9px] uppercase" style={{ color: '#6b7280' }}>Community</p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 6: TODAY'S OPPOSITION ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4 pb-3 border-b-4 border-celtic-blue">
                <div className="w-3 h-10 bg-celtic-yellow rounded-full" />
                <div>
                  <h2 className="text-xl font-black text-celtic-dark tracking-tight">TODAY&apos;S VISITORS</h2>
                  <p className="text-base text-gray-700 font-semibold">{opposition?.name}</p>
                </div>
              </div>

              {opposition && (
                <div className="flex-1">
                  {/* Club Info Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-xs text-gray-700 mb-3 uppercase tracking-wider">Club Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                          <span className="text-gray-500 text-xs">Founded</span>
                          <span className="font-bold text-gray-800 text-sm">{opposition.founded}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                          <span className="text-gray-500 text-xs">Ground</span>
                          <span className="font-bold text-gray-800 text-sm text-right">{opposition.ground}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                          <span className="text-gray-500 text-xs">Colours</span>
                          <span className="font-bold text-gray-800 text-sm">{opposition.colours}</span>
                        </div>
                        {opposition.nickname && (
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-gray-500 text-xs">Nickname</span>
                            <span className="font-bold text-gray-800 text-sm">&ldquo;{opposition.nickname}&rdquo;</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {opposition.headToHead && (
                      <div className="rounded-lg p-4" style={{ backgroundColor: '#1e3a8a' }}>
                        <h3 className="font-bold text-xs mb-3 uppercase tracking-wider" style={{ color: '#facc15' }}>Head to Head Record</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded p-2 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <p className="text-2xl font-black text-white">{opposition.headToHead.played}</p>
                            <p className="text-[9px] uppercase tracking-wider font-semibold text-white">Played</p>
                          </div>
                          <div className="rounded p-2 text-center" style={{ backgroundColor: 'rgba(34,197,94,0.5)' }}>
                            <p className="text-2xl font-black text-white">{opposition.headToHead.celticWins}</p>
                            <p className="text-[9px] uppercase tracking-wider font-semibold text-white">Celtic Wins</p>
                          </div>
                          <div className="rounded p-2 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <p className="text-2xl font-black text-white">{opposition.headToHead.draws}</p>
                            <p className="text-[9px] uppercase tracking-wider font-semibold text-white">Draws</p>
                          </div>
                          <div className="rounded p-2 text-center" style={{ backgroundColor: 'rgba(239,68,68,0.5)' }}>
                            <p className="text-2xl font-black text-white">{opposition.headToHead.oppositionWins}</p>
                            <p className="text-[9px] uppercase tracking-wider font-semibold text-white">Losses</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Last Meeting */}
                  {opposition.lastMeeting && (
                    <div className="bg-celtic-yellow/20 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-gray-800 mb-2 text-sm">Last Meeting</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600">{opposition.lastMeeting.date}</p>
                        </div>
                        <div className={`text-xl font-black ${
                          opposition.lastMeeting.result === 'W' ? 'text-green-600' :
                          opposition.lastMeeting.result === 'L' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {opposition.lastMeeting.result === 'W' ? 'WON' :
                           opposition.lastMeeting.result === 'L' ? 'LOST' : 'DREW'} {opposition.lastMeeting.score}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About Cwmbran Celtic section */}
                  <div className="bg-celtic-blue/10 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">About Cwmbran Celtic AFC</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Founded in {clubInfo.founded}, Cwmbran Celtic AFC is a community football club based in Cwmbran, South Wales.
                      Playing our home games at the Avondale Motor Park Arena, we compete in the JD Cymru South league.
                      The club is committed to developing local talent and providing football opportunities for players of all ages and abilities.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="text-center">
                        <p className="text-xl font-black text-celtic-blue">{clubInfo.founded}</p>
                        <p className="text-[9px] text-gray-500 uppercase">Founded</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-celtic-blue">3</p>
                        <p className="text-[9px] text-gray-500 uppercase">Teams</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-celtic-blue">Tier 3</p>
                        <p className="text-[9px] text-gray-500 uppercase">League Level</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sponsors */}
              <div className="mt-auto pt-3 border-t-2 border-gray-200">
                <p className="text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-2 text-center font-semibold">Our Partners</p>
                <div className="grid grid-cols-3 gap-3">
                  {sponsors.partners.slice(0, 3).map((sponsor, idx) => (
                    <div key={idx} className="bg-gray-50 rounded p-2 flex items-center justify-center h-12">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={80}
                        height={32}
                        className="max-h-8 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 7: LEAGUE TABLE ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page">
            <div className="aspect-[1/1.414] p-10 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-4 border-celtic-blue">
                <div className="w-3 h-12 bg-celtic-yellow rounded-full" />
                <h2 className="text-2xl font-black text-celtic-dark tracking-tight">{data.competition.toUpperCase()} TABLE</h2>
              </div>

              {/* Table */}
              <div className="flex-1">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-celtic-blue text-white">
                        <th className="py-3 px-3 text-left font-bold">Pos</th>
                        <th className="py-3 px-3 text-left font-bold">Club</th>
                        <th className="py-3 px-2 text-center font-bold">P</th>
                        <th className="py-3 px-2 text-center font-bold">W</th>
                        <th className="py-3 px-2 text-center font-bold">D</th>
                        <th className="py-3 px-2 text-center font-bold">L</th>
                        <th className="py-3 px-2 text-center font-bold">GD</th>
                        <th className="py-3 px-3 text-center font-bold">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLeagueTable.results.map((team) => {
                        const isCeltic = team.club === 'Cwmbran Celtic';
                        const isOpposition = team.club === opposition?.name;

                        return (
                          <tr
                            key={team.club}
                            className={`border-b border-gray-100 transition-colors ${
                              isCeltic ? 'bg-celtic-yellow/30 font-bold' :
                              isOpposition ? 'bg-celtic-blue/10' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-bold">{team.position}</td>
                            <td className="py-2.5 px-3">
                              <span className={isCeltic || isOpposition ? 'font-bold' : ''}>
                                {team.club}
                              </span>
                              {isCeltic && <span className="ml-2 text-celtic-blue">●</span>}
                              {isOpposition && <span className="ml-2 text-gray-400">●</span>}
                            </td>
                            <td className="py-2.5 px-2 text-center">{team.played}</td>
                            <td className="py-2.5 px-2 text-center text-green-600 font-medium">{team.won}</td>
                            <td className="py-2.5 px-2 text-center">{team.drawn}</td>
                            <td className="py-2.5 px-2 text-center text-red-600 font-medium">{team.lost}</td>
                            <td className="py-2.5 px-2 text-center">
                              <span className={team.gd > 0 ? 'text-green-600' : team.gd < 0 ? 'text-red-600' : ''}>
                                {team.gd > 0 ? `+${team.gd}` : team.gd}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-black text-lg">{team.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-celtic-yellow/30 rounded" />
                  <span>Cwmbran Celtic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-celtic-blue/10 rounded" />
                  <span>Today&apos;s Opposition</span>
                </div>
                <div className="ml-auto">
                  Table as of {formatShortDate(data.date)}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 8: RESULTS & FIXTURES ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page">
            <div className="aspect-[1/1.414] p-8 flex flex-col">
              {/* Action Image Banner */}
              {data.actionImage && (
                <div className="h-32 mb-4 rounded-xl overflow-hidden relative">
                  <Image
                    src={data.actionImage}
                    alt="Match action"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white text-xs font-semibold">Recent Action</p>
                  </div>
                </div>
              )}

              <div className={`grid grid-cols-2 gap-6 ${data.actionImage ? '' : 'flex-1'}`}>
                {/* Recent Results */}
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b-4" style={{ borderColor: '#1e3a8a' }}>
                    <div className="w-2 h-10 rounded-full" style={{ backgroundColor: '#facc15' }} />
                    <h2 className="text-xl font-black tracking-tight" style={{ color: '#0f172a' }}>RECENT RESULTS</h2>
                  </div>
                  <div className="space-y-3">
                    {recentResults.map((result, idx) => {
                      const isCelticHome = result.homeTeam.includes('Cwmbran Celtic');
                      const celticScore = isCelticHome ? result.homeScore : result.awayScore;
                      const oppScore = isCelticHome ? result.awayScore : result.homeScore;
                      const opponent = isCelticHome ? result.awayTeam : result.homeTeam;
                      const resultType = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';
                      const date = new Date(result.date);

                      return (
                        <div key={idx} className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: '#f3f4f6' }}>
                          <span
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm"
                            style={{
                              backgroundColor: resultType === 'W' ? '#22c55e' : resultType === 'L' ? '#ef4444' : '#9ca3af',
                              color: '#ffffff'
                            }}
                          >
                            {resultType}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate" style={{ color: '#111827' }}>{opponent}</p>
                            <p className="text-[11px]" style={{ color: '#6b7280' }}>
                              {isCelticHome ? 'Home' : 'Away'} • {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <span className="font-black text-lg" style={{ color: '#111827' }}>{celticScore}-{oppScore}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming Fixtures */}
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b-4" style={{ borderColor: '#1e3a8a' }}>
                    <div className="w-2 h-10 rounded-full" style={{ backgroundColor: '#facc15' }} />
                    <h2 className="text-xl font-black tracking-tight" style={{ color: '#0f172a' }}>UP NEXT</h2>
                  </div>
                  <div className="space-y-3">
                    {upcomingFixtures.map((fixture, idx) => {
                      const isCelticHome = fixture.homeTeam.includes('Cwmbran Celtic');
                      const opponent = isCelticHome ? fixture.awayTeam : fixture.homeTeam;
                      const date = new Date(fixture.date);

                      return (
                        <div key={idx} className="rounded-lg p-3" style={{ backgroundColor: '#f3f4f6' }}>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-bold text-sm" style={{ color: '#111827' }}>{opponent}</p>
                              <p className="text-[11px]" style={{ color: '#4b5563' }}>
                                {isCelticHome ? 'Home' : 'Away'} • {fixture.time}
                              </p>
                            </div>
                            <div className="px-3 py-2 rounded text-center" style={{ backgroundColor: '#1e3a8a' }}>
                              <p className="font-bold text-sm text-white">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sponsors */}
              <div className="mt-auto pt-6 border-t-2 border-gray-200">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-3 text-center font-semibold">Thank You To Our Sponsors</p>
                <div className="grid grid-cols-5 gap-3">
                  {sponsors.partners.map((sponsor, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-2 flex items-center justify-center h-12">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={70}
                        height={28}
                        className="max-h-7 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 9: CELTIC BOND ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page mb-8 print:mb-0 print:break-before-page">
            <div className="aspect-[1/1.414] relative overflow-hidden" style={{ backgroundColor: '#fde047' }}>
              {/* Content */}
              <div className="relative h-full flex flex-col p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-block px-6 py-2 rounded-full mb-4" style={{ backgroundColor: '#1e3a8a' }}>
                    <p className="text-xs uppercase tracking-wider font-bold text-white">Support Your Club</p>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#1e3a8a' }}>CELTIC BOND</h2>
                  <p className="text-lg font-semibold" style={{ color: '#374151' }}>Help Build Our Future</p>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* What is Celtic Bond */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                    <h3 className="font-bold mb-2 text-sm uppercase tracking-wider" style={{ color: '#1e3a8a' }}>What is the Celtic Bond?</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                      The Celtic Bond is a monthly lottery that helps fund essential club improvements and community projects.
                      For just £5 per month, you could win cash prizes while supporting your local football club.
                    </p>
                  </div>

                  {/* Prize Info */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1e3a8a' }}>
                      <p className="text-3xl font-black text-white">£100</p>
                      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#facc15' }}>1st Prize</p>
                    </div>
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#2563eb' }}>
                      <p className="text-2xl font-black text-white">£50</p>
                      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#facc15' }}>2nd Prize</p>
                    </div>
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#3b82f6' }}>
                      <p className="text-2xl font-black text-white">£25</p>
                      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#facc15' }}>3rd Prize</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                    <h3 className="font-bold mb-3 text-sm uppercase tracking-wider" style={{ color: '#1e3a8a' }}>Your Support Helps Fund:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#22c55e', color: '#ffffff' }}>✓</span>
                        <span className="text-sm" style={{ color: '#374151' }}>Pitch maintenance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#22c55e', color: '#ffffff' }}>✓</span>
                        <span className="text-sm" style={{ color: '#374151' }}>Youth development</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#22c55e', color: '#ffffff' }}>✓</span>
                        <span className="text-sm" style={{ color: '#374151' }}>Kit & equipment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#22c55e', color: '#ffffff' }}>✓</span>
                        <span className="text-sm" style={{ color: '#374151' }}>Ground improvements</span>
                      </div>
                    </div>
                  </div>

                  {/* How to Join */}
                  <div className="rounded-xl p-5" style={{ backgroundColor: '#1e3a8a' }}>
                    <h3 className="font-bold mb-2 text-sm uppercase tracking-wider" style={{ color: '#facc15' }}>How to Join</h3>
                    <p className="text-sm mb-3 text-white">
                      Sign up online at <span className="font-bold" style={{ color: '#facc15' }}>cwmbranceltic.com/celtic-bond</span> or speak to a committee member on match day.
                    </p>
                    <div className="flex items-center justify-between rounded-lg p-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                      <div>
                        <p className="font-bold text-xl" style={{ color: '#facc15' }}>Only £5</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>per month</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">Monthly Draw</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Results on social media</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold" style={{ color: '#374151' }}>
                    Thank you to all our Celtic Bond members!
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#4b5563' }}>
                    #UpTheCeltic
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== PAGE 10: BACK COVER ==================== */}
          <div className="bg-white shadow-xl print:shadow-none programme-page print:break-before-page">
            <div className="aspect-[1/1.414] relative overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-celtic-blue via-celtic-blue-dark to-celtic-dark">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-celtic-yellow blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col p-10 text-white">
                {/* Club Badge & Name */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <Image
                      src="/images/club-logo.webp"
                      alt="Cwmbran Celtic"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">CWMBRAN CELTIC AFC</h2>
                  <p className="text-celtic-yellow font-semibold">Established {clubInfo.founded}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 flex-1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-celtic-yellow font-bold mb-2 uppercase tracking-wider text-sm">Our Ground</h3>
                      <p className="font-semibold">{clubInfo.ground.name}</p>
                      <p className="text-white/70 text-sm">{clubInfo.ground.address.street}</p>
                      <p className="text-white/70 text-sm">{clubInfo.ground.address.town}</p>
                      <p className="text-white/70 text-sm">{clubInfo.ground.address.postcode}</p>
                    </div>
                    <div>
                      <h3 className="text-celtic-yellow font-bold mb-2 uppercase tracking-wider text-sm">Contact</h3>
                      <p className="text-sm">{clubInfo.contact.email}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-celtic-yellow font-bold mb-2 uppercase tracking-wider text-sm">Admission Prices</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Adults</span>
                          <span className="font-bold">£{clubInfo.admission.adults}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Concessions</span>
                          <span className="font-bold">£{clubInfo.admission.concessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Under 16s</span>
                          <span className="font-bold text-celtic-yellow">FREE</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Programme</span>
                          <span className="font-bold">£{clubInfo.admission.programme}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-celtic-yellow font-bold mb-2 uppercase tracking-wider text-sm">Follow Us</h3>
                      <p className="text-sm">@cwmbranceltic</p>
                      <p className="text-sm text-white/70">cwmbranceltic.com</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-white/20 text-center">
                  <p className="text-white/60 text-sm mb-2">
                    Thank you for supporting Cwmbran Celtic AFC
                  </p>
                  <p className="text-celtic-yellow font-bold text-lg">
                    #UpTheCeltic
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Page setup */
          @page {
            size: A4 portrait;
            margin: 0;
          }

          /* Reset everything */
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          html {
            width: 210mm;
            margin: 0;
            padding: 0;
          }

          body {
            width: 210mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          /* Hide EVERYTHING by default */
          body > * {
            display: none !important;
          }

          /* Show only our programme container */
          body > div:has(.programme-page),
          body > main:has(.programme-page) {
            display: block !important;
          }

          /* Hide navigation, header, footer elements */
          header, footer, nav,
          [role="navigation"],
          .print\\:hidden,
          .sticky,
          button,
          a[href]:not(.programme-page a) {
            display: none !important;
          }

          /* Programme pages */
          .programme-page {
            display: block !important;
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            box-shadow: none !important;
            border: none !important;
          }

          .programme-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Fix aspect ratio container */
          .programme-page > .aspect-\\[1\\/1\\.414\\],
          .programme-page > div[class*="aspect"] {
            aspect-ratio: unset !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
          }

          /* Ensure backgrounds print */
          .programme-page,
          .programme-page * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide control bar and tips */
          .bg-celtic-dark,
          .bg-celtic-blue\\/10 {
            display: none !important;
          }

          /* Ensure images load */
          img {
            max-width: 100% !important;
            page-break-inside: avoid !important;
          }

          /* Remove shadows and margins between pages */
          .shadow-xl {
            box-shadow: none !important;
          }

          .mb-8 {
            margin-bottom: 0 !important;
          }

          /* Container fixes */
          .max-w-\\[210mm\\] {
            max-width: none !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .py-8 {
            padding: 0 !important;
          }

          .bg-gray-300 {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
