'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOppositionById } from '@/data/opposition-data';
import { mockSquad, mockLeagueTable, mockResults, mockFixtures } from '@/data/mock-data';
import CoverPage from '@/components/programme/CoverPage';

interface SquadPlayer {
  squadNo: number;
  firstName: string;
  lastName: string;
  position: string;
}

interface ProgrammeData {
  opponent: string;
  date: string;
  kickoff: string;
  competition: string;
  matchdayNumber: string;
  venue: 'home' | 'away';
  team: 'mens' | 'womens' | 'development';
  startingXI: number[];
  substitutes: number[];
  captain: number | null;
  referee: string;
  assistantRef1: string;
  assistantRef2: string;
  fourthOfficial: string;
  matchSponsor: string;
  mascotSponsor: string;
  matchballSponsor: string;
  programmePrice: string;
  managersNotes: string;
  teamNews: string;
  specialNotes: string;
  playerToWatch: number | null;
  coverImage: string;
  uploadedCover?: string;
  actionImage: string;
  status?: 'draft' | 'published';
}

// ============================================================
// DIGITAL PROGRAMME DESIGN - Modern blend with classic elements
// ============================================================

const COLORS = {
  navy: '#1e3a5f',
  navyDark: '#0f2847',
  yellow: '#f4c430',
  white: '#ffffff',
  offWhite: '#f8fafc',
  black: '#1a1a1a',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  green: '#22c55e',
  red: '#ef4444',
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ShareableProgrammePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [programmeData, setProgrammeData] = useState<ProgrammeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const parts = slug?.split('-') || [];
  const date = parts.slice(0, 3).join('-');
  const opponentId = parts.slice(3).join('-');
  const opposition = getOppositionById(opponentId);

  useEffect(() => {
    setShareUrl(window.location.href);
    const programmeKey = `programme-${slug}`;
    const savedData = localStorage.getItem(programmeKey);
    if (savedData) {
      try {
        setProgrammeData(JSON.parse(savedData));
      } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateInput: string | number) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const squad = mockSquad.results as SquadPlayer[];
  const goalkeepers = squad.filter(p => p.position === 'Goalkeeper');
  const defenders = squad.filter(p => p.position.includes('Back'));
  const midfielders = squad.filter(p => p.position.includes('Midfield') || p.position.includes('Wing'));
  const forwards = squad.filter(p => p.position === 'Striker' || p.position === 'Forward');

  const recentResults = mockResults.results
    .filter(r => (r.homeTeam.includes('Cwmbran Celtic') || r.awayTeam.includes('Cwmbran Celtic')) && !r.homeTeam.includes('Ladies'))
    .slice(0, 5);

  const upcomingFixtures = mockFixtures.results
    .filter(f => !f.homeTeam.includes('Ladies'))
    .slice(0, 5);

  // Check if player is in starting XI
  const isStartingXI = (squadNo: number) => programmeData?.startingXI?.includes(squadNo);
  const isSub = (squadNo: number) => programmeData?.substitutes?.includes(squadNo);
  const isCaptain = (squadNo: number) => programmeData?.captain === squadNo;

  const shareWhatsApp = () => {
    const text = `Match Day Programme: Cwmbran Celtic vs ${opposition?.name}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `Match Day Programme: Cwmbran Celtic vs ${opposition?.name} #UpTheCeltic`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowShareMenu(false);
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/programme/pdf?slug=${slug}`);
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cwmbran-celtic-programme-${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const pages = [
    'cover',
    'managers-notes',
    'squad',
    'todays-match',
    'history',
    'visitors',
    'league-table',
    'results-fixtures',
    'celtic-bond',
    'back-cover'
  ];

  const totalPages = pages.length;
  const nextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 0) setCurrentPage(currentPage - 1); };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navyDark }}>
        <div className="text-center">
          <div className="w-20 h-20 mb-6 mx-auto animate-pulse">
            <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={80} height={80} />
          </div>
          <p style={{ color: COLORS.gray500 }}>Loading programme...</p>
        </div>
      </div>
    );
  }

  if (!opposition) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navyDark }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: COLORS.white }}>Programme Not Found</h1>
          <Link href="/" className="underline" style={{ color: COLORS.yellow }}>Return to Homepage</Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // SHARED COMPONENT STYLES
  // ============================================================

  const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="px-4 py-3" style={{ backgroundColor: COLORS.navy, borderBottom: `3px solid ${COLORS.yellow}` }}>
      <h1 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h1>
      {subtitle && <p className="text-xs text-white/70 mt-0.5">{subtitle}</p>}
    </div>
  );

  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <div
      className="px-3 py-2 text-xs font-bold uppercase tracking-wide"
      style={{ backgroundColor: COLORS.gray100, color: COLORS.navy, borderLeft: `3px solid ${COLORS.yellow}` }}
    >
      {children}
    </div>
  );

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div
      className={`bg-white rounded-lg overflow-hidden ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
    >
      {children}
    </div>
  );

  // ============================================================
  // PAGE RENDERER - Digital Version (Modern Blend)
  // ============================================================

  const renderPage = () => {
    switch (pages[currentPage]) {

      // ==================== PAGE 1: COVER ====================
      case 'cover':
        return (
          <CoverPage
            uploadedCover={programmeData?.uploadedCover}
            opposition={opposition}
            date={date}
            kickoff={programmeData?.kickoff || '15:00'}
            coverImage={programmeData?.coverImage}
            forPrint={false}
          />
        );

      // ==================== PAGE 2: MANAGER'S NOTES ====================
      case 'managers-notes':
        const defaultNotes = `Good afternoon and welcome to the Avondale Motor Park Arena for today's JD Cymru South fixture against ${opposition.name}.

Thank you for your continued support - it means the world to everyone at the club. The lads have been working hard in training and we're looking forward to putting on a performance for you today.

We know ${opposition.name} will provide a tough test, but we're confident in our preparation and the quality we have in the squad. Let's make the atmosphere count today.

Enjoy the game and Up The Celtic!`;
        const notesText = programmeData?.managersNotes || defaultNotes;

        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Manager's Notes" />

            <div className="flex-1 p-3 overflow-auto">
              <Card className="mb-3">
                <div className="flex">
                  <div className="w-20 h-24 relative flex-shrink-0">
                    <Image src="/images/staff/simon-berry.webp" alt="Simon Berry" fill className="object-cover" />
                  </div>
                  <div className="p-3 flex-1">
                    <p className="font-bold" style={{ color: COLORS.navy }}>Simon Berry</p>
                    <p className="text-xs" style={{ color: COLORS.gray500 }}>First Team Manager</p>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}>
                      Since 2023
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <div className="text-sm leading-relaxed" style={{ color: COLORS.gray700 }}>
                    {notesText.split('\n').map((para, i) => (
                      para.trim() && <p key={i} className="mb-3 last:mb-0">{para}</p>
                    ))}
                  </div>
                  <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                    <p className="font-bold italic" style={{ color: COLORS.navy }}>Simon Berry</p>
                    <p className="text-xs" style={{ color: COLORS.gray500 }}>First Team Manager</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="p-2 text-center" style={{ backgroundColor: COLORS.navy }}>
              <Image src="/images/sponsors/avondale-hire.webp" alt="Avondale" width={80} height={28} className="mx-auto object-contain opacity-80" />
            </div>
          </div>
        );

      // ==================== PAGE 3: SQUAD ====================
      case 'squad':
        const renderPlayerRow = (p: SquadPlayer) => {
          const starting = isStartingXI(p.squadNo);
          const sub = isSub(p.squadNo);
          const cap = isCaptain(p.squadNo);

          return (
            <div
              key={p.squadNo}
              className="flex items-center py-1.5 px-2 border-b last:border-0"
              style={{
                borderColor: COLORS.gray200,
                backgroundColor: starting ? `${COLORS.yellow}20` : sub ? `${COLORS.navy}10` : 'transparent'
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2"
                style={{
                  backgroundColor: starting ? COLORS.yellow : sub ? COLORS.navy : COLORS.gray200,
                  color: starting ? COLORS.navy : sub ? COLORS.white : COLORS.gray600
                }}
              >
                {p.squadNo}
              </span>
              <span className="flex-1 text-sm" style={{ color: COLORS.gray700 }}>
                {p.firstName} {p.lastName}
                {cap && <span className="ml-1 text-xs font-bold" style={{ color: COLORS.yellow }}>(C)</span>}
              </span>
              {starting && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: COLORS.green, color: 'white' }}>XI</span>}
              {sub && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: COLORS.navy, color: 'white' }}>SUB</span>}
            </div>
          );
        };

        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Squad" subtitle="2025/26 Season" />

            <div className="flex-1 p-2 overflow-auto">
              <div className="grid grid-cols-2 gap-2">
                {/* Left column */}
                <div className="space-y-2">
                  <Card>
                    <SectionHeader>Goalkeepers</SectionHeader>
                    {goalkeepers.map(renderPlayerRow)}
                  </Card>
                  <Card>
                    <SectionHeader>Defenders</SectionHeader>
                    {defenders.slice(0, 7).map(renderPlayerRow)}
                  </Card>
                </div>

                {/* Right column */}
                <div className="space-y-2">
                  <Card>
                    <SectionHeader>Midfielders</SectionHeader>
                    {midfielders.slice(0, 8).map(renderPlayerRow)}
                  </Card>
                  <Card>
                    <SectionHeader>Forwards</SectionHeader>
                    {forwards.slice(0, 4).map(renderPlayerRow)}
                  </Card>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 mt-3 text-xs" style={{ color: COLORS.gray500 }}>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.yellow }}></span>
                  <span>Starting XI</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.navy }}></span>
                  <span>Substitute</span>
                </div>
              </div>
            </div>
          </div>
        );

      // ==================== PAGE 4: TODAY'S MATCH ====================
      case 'todays-match':
        const startingXI = programmeData?.startingXI?.map(no => squad.find(p => p.squadNo === no)).filter(Boolean) || [];
        const subs = programmeData?.substitutes?.map(no => squad.find(p => p.squadNo === no)).filter(Boolean) || [];

        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Today's Match" subtitle={programmeData?.competition || 'JD Cymru South'} />

            <div className="flex-1 p-3 overflow-auto">
              {/* Match header */}
              <Card className="mb-3">
                <div className="p-4 text-center" style={{ backgroundColor: COLORS.navy }}>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 relative">
                      <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" fill className="object-contain" />
                    </div>
                    <div>
                      <p className="text-white font-bold">CWMBRAN CELTIC</p>
                      <p className="text-2xl font-black" style={{ color: COLORS.yellow }}>vs</p>
                      <p className="text-white font-bold">{opposition.name.toUpperCase()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.white }}>
                      <span className="text-[8px] font-bold text-center" style={{ color: COLORS.navy }}>
                        {opposition.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mt-2">{formatDate(date)} • K.O. {programmeData?.kickoff || '15:00'}</p>
                </div>
              </Card>

              {/* Team sheets */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Card>
                  <SectionHeader>Cwmbran Celtic</SectionHeader>
                  <div className="p-2">
                    {startingXI.length > 0 ? startingXI.map((p, i) => p && (
                      <div key={p.squadNo} className="flex items-center py-1 text-sm border-b last:border-0" style={{ borderColor: COLORS.gray200 }}>
                        <span className="w-5 font-bold" style={{ color: COLORS.navy }}>{p.squadNo}</span>
                        <span style={{ color: COLORS.gray700 }}>{p.lastName}</span>
                        {isCaptain(p.squadNo) && <span className="ml-1 font-bold" style={{ color: COLORS.yellow }}>(C)</span>}
                      </div>
                    )) : (
                      <p className="text-xs italic py-2" style={{ color: COLORS.gray400 }}>Lineup to be confirmed</p>
                    )}
                    {subs.length > 0 && (
                      <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                        <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray500 }}>SUBS</p>
                        <p className="text-xs" style={{ color: COLORS.gray600 }}>
                          {subs.map(p => p && `${p.squadNo}. ${p.lastName}`).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card>
                  <SectionHeader>{opposition.name}</SectionHeader>
                  <div className="p-2">
                    <p className="text-xs italic py-2" style={{ color: COLORS.gray400 }}>Lineup to be confirmed</p>
                  </div>
                </Card>
              </div>

              {/* Match Officials */}
              <Card>
                <SectionHeader>Match Officials</SectionHeader>
                <div className="p-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-bold" style={{ color: COLORS.navy }}>Referee</p>
                    <p style={{ color: COLORS.gray600 }}>{programmeData?.referee || 'TBC'}</p>
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: COLORS.navy }}>Assistant 1</p>
                    <p style={{ color: COLORS.gray600 }}>{programmeData?.assistantRef1 || 'TBC'}</p>
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: COLORS.navy }}>Assistant 2</p>
                    <p style={{ color: COLORS.gray600 }}>{programmeData?.assistantRef2 || 'TBC'}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      // ==================== PAGE 5: HISTORY ====================
      case 'history':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Club History" subtitle="100 Years of Cwmbran Celtic" />

            <div className="flex-1 p-3 overflow-auto">
              <Card>
                <div className="p-4 space-y-4 text-sm" style={{ color: COLORS.gray700 }}>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: COLORS.navy }}>1925 - The Beginning</h3>
                    <p>Cwmbran Celtic AFC was founded in 1925, emerging from the proud working-class community of Cwmbran during the town&apos;s industrial era.</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: COLORS.navy }}>Post-War Revival</h3>
                    <p>After WWII, the club reformed with renewed vigour. Cwmbran was designated a New Town in 1949, and Celtic became central to community spirit.</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: COLORS.navy }}>Rising Through The Ranks</h3>
                    <p>The 21st century saw Celtic climb the Welsh pyramid, reaching Tier 3 of the Cymru Leagues.</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: COLORS.navy }}>The Celtic Today</h3>
                    <p>Today we field men&apos;s, women&apos;s and development teams at the Avondale Motor Park Arena.</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {[
                  { value: '1925', label: 'Founded' },
                  { value: '3', label: 'Teams' },
                  { value: 'Tier 3', label: 'League' },
                  { value: '100', label: 'Years' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-2 rounded" style={{ backgroundColor: COLORS.navy }}>
                    <p className="text-lg font-bold" style={{ color: COLORS.yellow }}>{stat.value}</p>
                    <p className="text-[10px] text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ==================== PAGE 6: VISITORS ====================
      case 'visitors':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Today's Visitors" subtitle={opposition.name} />

            <div className="flex-1 p-3 overflow-auto">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Card>
                  <SectionHeader>Club Info</SectionHeader>
                  <div className="p-3 space-y-2 text-sm">
                    <p><span style={{ color: COLORS.gray500 }}>Founded:</span> <span className="font-medium">{opposition.founded}</span></p>
                    <p><span style={{ color: COLORS.gray500 }}>Ground:</span> <span className="font-medium">{opposition.ground}</span></p>
                    <p><span style={{ color: COLORS.gray500 }}>Colours:</span> <span className="font-medium">{opposition.colours}</span></p>
                    {opposition.nickname && <p><span style={{ color: COLORS.gray500 }}>Nickname:</span> <span className="font-medium">&quot;{opposition.nickname}&quot;</span></p>}
                  </div>
                </Card>

                {opposition.headToHead && (
                  <Card>
                    <SectionHeader>Head to Head</SectionHeader>
                    <div className="p-3 grid grid-cols-2 gap-2 text-center">
                      {[
                        { value: opposition.headToHead.played, label: 'Played', color: COLORS.navy },
                        { value: opposition.headToHead.celticWins, label: 'Wins', color: COLORS.green },
                        { value: opposition.headToHead.draws, label: 'Draws', color: COLORS.gray500 },
                        { value: opposition.headToHead.oppositionWins, label: 'Losses', color: COLORS.red },
                      ].map((stat, i) => (
                        <div key={i} className="p-2 rounded" style={{ backgroundColor: COLORS.gray100 }}>
                          <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-[10px]" style={{ color: COLORS.gray500 }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              <Card>
                <SectionHeader>About Cwmbran Celtic</SectionHeader>
                <div className="p-3 text-sm" style={{ color: COLORS.gray700 }}>
                  <p>Founded in 1925, Cwmbran Celtic AFC is a community football club based in Cwmbran, South Wales. Playing at the Avondale Motor Park Arena, we compete in the JD Cymru South league.</p>
                </div>
              </Card>
            </div>
          </div>
        );

      // ==================== PAGE 7: LEAGUE TABLE ====================
      case 'league-table':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="League Table" subtitle="JD Cymru South" />

            <div className="flex-1 p-2 overflow-auto">
              <Card>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                      <th className="p-1.5 text-left w-6">#</th>
                      <th className="p-1.5 text-left">Club</th>
                      <th className="p-1.5 text-center w-6">P</th>
                      <th className="p-1.5 text-center w-6">W</th>
                      <th className="p-1.5 text-center w-6">D</th>
                      <th className="p-1.5 text-center w-6">L</th>
                      <th className="p-1.5 text-center w-8">GD</th>
                      <th className="p-1.5 text-center w-8">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLeagueTable.results.slice(0, 16).map((team, idx) => {
                      const isCeltic = team.club === 'Cwmbran Celtic';
                      const isOpp = team.club === opposition.name;
                      return (
                        <tr
                          key={team.club}
                          style={{
                            backgroundColor: isCeltic ? `${COLORS.yellow}30` : isOpp ? `${COLORS.navy}15` : idx % 2 === 0 ? COLORS.white : COLORS.gray100,
                          }}
                        >
                          <td className="p-1.5 font-medium">{team.position}</td>
                          <td className={`p-1.5 ${isCeltic || isOpp ? 'font-bold' : ''}`} style={{ color: isCeltic ? COLORS.navy : 'inherit' }}>
                            {team.club}
                          </td>
                          <td className="p-1.5 text-center">{team.played}</td>
                          <td className="p-1.5 text-center">{team.won}</td>
                          <td className="p-1.5 text-center">{team.drawn}</td>
                          <td className="p-1.5 text-center">{team.lost}</td>
                          <td className="p-1.5 text-center" style={{ color: team.gd > 0 ? COLORS.green : team.gd < 0 ? COLORS.red : COLORS.gray500 }}>
                            {team.gd > 0 ? `+${team.gd}` : team.gd}
                          </td>
                          <td className="p-1.5 text-center font-bold">{team.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        );

      // ==================== PAGE 8: RESULTS & FIXTURES ====================
      case 'results-fixtures':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Results & Fixtures" />

            <div className="flex-1 p-3 overflow-auto">
              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <SectionHeader>Recent Results</SectionHeader>
                  <div className="p-2">
                    {recentResults.map((r, i) => {
                      const home = r.homeTeam.includes('Cwmbran Celtic');
                      const celticScore = home ? r.homeScore : r.awayScore;
                      const oppScore = home ? r.awayScore : r.homeScore;
                      const res = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';
                      const resColor = res === 'W' ? COLORS.green : res === 'L' ? COLORS.red : COLORS.gray500;
                      return (
                        <div key={i} className="flex items-center py-1.5 border-b last:border-0" style={{ borderColor: COLORS.gray200 }}>
                          <span
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white mr-2"
                            style={{ backgroundColor: resColor }}
                          >
                            {res}
                          </span>
                          <span className="flex-1 text-xs truncate" style={{ color: COLORS.gray700 }}>
                            {home ? r.awayTeam : r.homeTeam}
                          </span>
                          <span className="text-sm font-bold" style={{ color: COLORS.navy }}>
                            {celticScore}-{oppScore}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card>
                  <SectionHeader>Up Next</SectionHeader>
                  <div className="p-2">
                    {upcomingFixtures.map((f, i) => {
                      const home = f.homeTeam.includes('Cwmbran Celtic');
                      return (
                        <div key={i} className="flex items-center py-1.5 border-b last:border-0" style={{ borderColor: COLORS.gray200 }}>
                          <span className="flex-1 text-xs truncate" style={{ color: COLORS.gray700 }}>
                            {home ? f.awayTeam : f.homeTeam}
                          </span>
                          <span
                            className="text-[10px] px-1 rounded mr-1"
                            style={{ backgroundColor: home ? COLORS.navy : COLORS.gray200, color: home ? COLORS.white : COLORS.gray600 }}
                          >
                            {home ? 'H' : 'A'}
                          </span>
                          <span className="text-xs font-medium" style={{ color: COLORS.navy }}>
                            {formatShortDate(f.date)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      // ==================== PAGE 9: CELTIC BOND ====================
      case 'celtic-bond':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.yellow }}>
            <PageHeader title="Celtic Bond" subtitle="Support Your Club" />

            <div className="flex-1 p-4 overflow-auto">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: COLORS.navy }}>Help Build Our Future</h2>
              </div>

              <Card className="mb-3">
                <div className="p-4">
                  <p className="font-bold mb-2" style={{ color: COLORS.navy }}>What is the Celtic Bond?</p>
                  <p className="text-sm" style={{ color: COLORS.gray700 }}>
                    A monthly lottery helping fund club improvements and community projects. For just £5/month, win cash prizes while supporting your club.
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { amount: '£100', label: '1st Prize' },
                  { amount: '£50', label: '2nd Prize' },
                  { amount: '£25', label: '3rd Prize' },
                ].map((prize, i) => (
                  <div key={i} className="text-center p-3 rounded-lg" style={{ backgroundColor: COLORS.navy }}>
                    <p className="text-xl font-bold" style={{ color: COLORS.yellow }}>{prize.amount}</p>
                    <p className="text-xs text-white/70">{prize.label}</p>
                  </div>
                ))}
              </div>

              <Card>
                <div className="p-4 text-center" style={{ backgroundColor: COLORS.navy }}>
                  <p className="text-2xl font-bold" style={{ color: COLORS.yellow }}>Only £5/month</p>
                  <p className="text-sm text-white/80 mt-1">Join at cwmbranceltic.com/celtic-bond</p>
                </div>
              </Card>
            </div>
          </div>
        );

      // ==================== PAGE 10: BACK COVER ====================
      case 'back-cover':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.navy }}>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-28 h-28 mb-4 relative">
                <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" fill className="object-contain" />
              </div>

              <h1 className="text-2xl font-bold uppercase tracking-wide">Cwmbran Celtic AFC</h1>
              <p className="text-sm mt-1" style={{ color: COLORS.yellow }}>Established 1925</p>

              <div className="grid grid-cols-2 gap-8 text-left mt-8 text-sm">
                <div>
                  <p className="font-bold mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.yellow }}>Our Ground</p>
                  <p>Avondale Motor Park Arena</p>
                  <p className="text-white/60">Henllys Way, Cwmbran</p>
                  <p className="text-white/60">NP44 3FS</p>
                </div>
                <div>
                  <p className="font-bold mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.yellow }}>Admission</p>
                  <p>Adults: £5</p>
                  <p>Concessions: £3</p>
                  <p style={{ color: COLORS.yellow }}>Under 16s: FREE</p>
                </div>
              </div>

              <div className="mt-8 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <p className="text-sm text-white/60">@cwmbranceltic • cwmbranceltic.com</p>
              </div>
            </div>

            <div className="p-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <p className="text-xs text-white/50">Thank you for supporting Cwmbran Celtic AFC</p>
              <p className="text-2xl font-bold mt-1" style={{ color: COLORS.yellow }}>#UpTheCeltic</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Programme Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          {/* Programme with shadow */}
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              aspectRatio: '1/1.414',
              maxHeight: 'calc(100vh - 140px)',
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.7)',
            }}
          >
            <div className="absolute inset-0">
              {renderPage()}
            </div>

            {/* Navigation arrows */}
            {currentPage > 0 && (
              <button
                onClick={prevPage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(30,58,95,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                <span className="text-xl" style={{ color: COLORS.yellow }}>‹</span>
              </button>
            )}
            {currentPage < totalPages - 1 && (
              <button
                onClick={nextPage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(30,58,95,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                <span className="text-xl" style={{ color: COLORS.yellow }}>›</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4" style={{ backgroundColor: COLORS.navy }}>
        {/* Page dots */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: i === currentPage ? COLORS.yellow : 'rgba(255,255,255,0.2)',
                transform: i === currentPage ? 'scale(1.3)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Share & info */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            cwmbranceltic.com
          </Link>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded text-xs font-bold transition-colors disabled:opacity-50"
              style={{ backgroundColor: COLORS.white, color: COLORS.navy }}
            >
              {isDownloading ? 'Saving...' : 'Save PDF'}
            </button>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="px-3 py-1.5 rounded text-xs font-bold transition-colors"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
            >
              Share
            </button>
          </div>
        </div>

        {/* Share menu */}
        {showShareMenu && (
          <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex gap-2">
              <button
                onClick={shareWhatsApp}
                className="flex-1 py-2 rounded text-xs font-bold"
                style={{ backgroundColor: '#25D366', color: COLORS.white }}
              >
                WhatsApp
              </button>
              <button
                onClick={shareTwitter}
                className="flex-1 py-2 rounded text-xs font-bold"
                style={{ backgroundColor: '#000000', color: COLORS.white }}
              >
                X
              </button>
              <button
                onClick={copyLink}
                className="flex-1 py-2 rounded text-xs font-bold"
                style={{ backgroundColor: COLORS.gray500, color: COLORS.white }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
