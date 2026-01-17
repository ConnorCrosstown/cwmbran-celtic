'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOppositionById } from '@/data/opposition-data';
import { mockSquad, mockLeagueTable, mockResults, mockFixtures } from '@/data/mock-data';

interface SquadPlayer {
  squadNo: number;
  firstName: string;
  lastName: string;
  position: string;
}

interface ProgrammeData {
  // Match details
  opponent: string;
  date: string;
  kickoff: string;
  competition: string;
  matchdayNumber: string;
  venue: 'home' | 'away';

  // Team selection
  team: 'mens' | 'womens' | 'development';
  startingXI: number[];
  substitutes: number[];
  captain: number | null;

  // Match officials
  referee: string;
  assistantRef1: string;
  assistantRef2: string;
  fourthOfficial: string;

  // Sponsors & extras
  matchSponsor: string;
  mascotSponsor: string;
  matchballSponsor: string;
  programmePrice: string;

  // Content
  managersNotes: string;
  teamNews: string;
  specialNotes: string;
  playerToWatch: number | null;

  // Images
  coverImage: string;
  actionImage: string;

  // Meta
  status?: 'draft' | 'published';
}

export default function ShareableProgrammePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [programmeData, setProgrammeData] = useState<ProgrammeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parse slug: format is "YYYY-MM-DD-opponent-id"
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
      } catch (e) { /* ignore */ }
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

  // Squad - type assertion
  const squad = mockSquad.results as SquadPlayer[];
  const goalkeepers = squad.filter(p => p.position === 'Goalkeeper');
  const defenders = squad.filter(p => p.position.includes('Back'));
  const midfielders = squad.filter(p => p.position.includes('Midfield') || p.position.includes('Wing'));
  const forwards = squad.filter(p => p.position === 'Striker' || p.position === 'Forward');

  // Results & fixtures
  const recentResults = mockResults.results
    .filter(r => (r.homeTeam.includes('Cwmbran Celtic') || r.awayTeam.includes('Cwmbran Celtic')) && !r.homeTeam.includes('Ladies'))
    .slice(0, 5);

  const upcomingFixtures = mockFixtures.results
    .filter(f => !f.homeTeam.includes('Ladies'))
    .slice(0, 5);

  // Share functions
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
    alert('Link copied!');
  };

  // Pages - Professional programme structure
  const pages = [
    'cover',
    'welcome',
    'managers-notes',
    'squad-gk-def',
    'squad-mid-fwd',
    'todays-match',
    'opposition',
    'head-to-head',
    'league-table',
    'form-guide',
    'club-history',
    'celtic-bond',
    'sponsors',
    'back-cover'
  ];

  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  // Paper texture overlay style
  const paperTexture = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-center">
          <div className="w-16 h-16 mb-4 mx-auto animate-pulse">
            <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={64} height={64} />
          </div>
          <p style={{ color: '#94a3b8' }}>Loading programme...</p>
        </div>
      </div>
    );
  }

  if (!opposition) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>Programme Not Found</h1>
          <Link href="/" className="underline" style={{ color: '#facc15' }}>Return to Homepage</Link>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (pages[currentPage]) {
      // ==================== COVER ====================
      case 'cover':
        return (
          <div className="h-full relative overflow-hidden" style={{ backgroundColor: '#facc15' }}>
            {/* Yellow Background */}
            <div className="absolute inset-0" style={{ backgroundColor: '#facc15' }} />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Header - Club Name */}
              <div className="pt-3 px-3 text-center">
                <h1 className="text-[28px] leading-none font-black tracking-tight" style={{
                  color: '#1e56a0',
                  textShadow: '2px 2px 0px rgba(255,255,255,0.5)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  CWMBRAN
                </h1>
                <h1 className="text-[28px] leading-none font-black tracking-tight -mt-1" style={{
                  color: '#1e56a0',
                  textShadow: '2px 2px 0px rgba(255,255,255,0.5)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  CELTIC FC
                </h1>
              </div>

              {/* League & Price Row */}
              <div className="flex items-center justify-between px-3 mt-1">
                <div className="flex items-center gap-1.5">
                  {/* JD Sports logo placeholder */}
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#000' }}>
                    <span className="text-[8px] font-bold text-white">JD</span>
                  </div>
                  {/* Cymru South logo placeholder */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e56a0' }}>
                    <span className="text-[5px] font-bold text-white text-center leading-tight">CYMRU<br/>SOUTH</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold" style={{ color: '#1e56a0' }}>OFFICIAL MATCH PROGRAMME</p>
                  <p className="text-[10px] font-black" style={{ color: '#1e56a0' }}>{programmeData?.programmePrice || '£1.50'}</p>
                  <p className="text-[7px]" style={{ color: '#1e56a0' }}>SEASON 2024/2025</p>
                </div>
              </div>

              {/* Website */}
              <div className="text-center -mt-0.5">
                <p className="text-[7px] font-medium" style={{ color: '#1e56a0' }}>WWW.CWMBRANCLTIC.COM</p>
              </div>

              {/* Main Action Image */}
              <div className="flex-1 mx-2 mt-1 relative overflow-hidden rounded-sm" style={{ minHeight: '45%' }}>
                {programmeData?.coverImage ? (
                  <Image
                    src={programmeData.coverImage}
                    alt="Match action"
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#4a7c59' }}>
                    {/* Placeholder pitch pattern */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 opacity-50">
                        <Image src="/images/club-logo.webp" alt="" width={80} height={80} className="object-contain" />
                      </div>
                      <p className="text-[10px] font-medium text-white/70">Action Photo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Match Info Strip */}
              <div className="mx-2 mt-1 p-2 rounded-sm flex items-center justify-between" style={{ backgroundColor: '#1e56a0' }}>
                {/* Home Badge */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#fff' }}>
                  <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={40} height={40} className="object-contain w-full h-full p-0.5" />
                </div>

                {/* Match Details */}
                <div className="flex-1 text-center px-2">
                  <p className="text-[9px] font-bold text-white">CWMBRAN CELTIC v</p>
                  <p className="text-[11px] font-black text-white">{opposition.name.toUpperCase()}</p>
                  <p className="text-[7px] text-white/90 mt-0.5">
                    {formatDate(date).toUpperCase()}, K.O. {programmeData?.kickoff || '15:00'}
                  </p>
                  <p className="text-[7px] text-white/80">AVONDALE MOTORPOINT ARENA</p>
                </div>

                {/* Away Badge */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#fff' }}>
                  <span className="text-[8px] font-bold text-center" style={{ color: '#1e56a0' }}>
                    {opposition.name.split(' ').map(w => w[0]).join('')}
                  </span>
                </div>
              </div>

              {/* Main Sponsor */}
              <div className="mx-2 mt-1 p-2 text-center rounded-sm" style={{ backgroundColor: '#1e56a0' }}>
                <p className="text-[14px] font-black italic text-white tracking-wide">AVONDALE</p>
                <p className="text-[10px] font-bold" style={{ color: '#facc15' }}>MOTOR PARK</p>
                <p className="text-[6px] text-white/80">THE UK'S VAN SUPERSTORE</p>
              </div>

              {/* Partner Logos Footer */}
              <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: '#0a1628' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded flex items-center justify-center" style={{ backgroundColor: '#333' }}>
                    <span className="text-[5px] text-white font-bold">RHINO</span>
                  </div>
                  <div className="w-8 h-4 rounded flex items-center justify-center" style={{ backgroundColor: '#1e56a0' }}>
                    <span className="text-[5px] text-white">Cofficology</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded flex items-center justify-center" style={{ backgroundColor: '#c41e3a' }}>
                    <span className="text-[5px] text-white font-bold">EnerSys</span>
                  </div>
                  <div className="w-8 h-4 rounded flex items-center justify-center" style={{ backgroundColor: '#333' }}>
                    <span className="text-[5px] text-white">Endurance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ==================== WELCOME PAGE ====================
      case 'welcome':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#fafafa', ...paperTexture }}>
            {/* Header bar */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                Welcome to The Avondale Motor Park Arena
              </p>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              {/* Chairman's message */}
              <div className="mb-4">
                <h2 className="text-sm font-black uppercase mb-2" style={{ color: '#0a1628', borderBottom: '2px solid #facc15', paddingBottom: '4px', display: 'inline-block' }}>
                  From The Chairman
                </h2>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: '#0a1628' }}>
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
                      <span className="text-xs font-bold" style={{ color: '#facc15' }}>BD</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] leading-relaxed" style={{ color: '#374151' }}>
                      Good afternoon and welcome to the Avondale Motor Park Arena for today's {programmeData?.competition || 'JD Cymru South'} fixture against {opposition.name}.
                    </p>
                    <p className="text-[10px] leading-relaxed mt-2" style={{ color: '#374151' }}>
                      We extend a warm welcome to the players, officials and supporters of {opposition.name}. We hope you enjoy your visit.
                    </p>
                    <p className="text-[9px] font-semibold mt-2" style={{ color: '#0a1628' }}>
                      Barrie Desmond, Chairman
                    </p>
                  </div>
                </div>
              </div>

              {/* Today's Officials */}
              <div className="p-3 rounded mb-3" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 className="text-[10px] font-bold uppercase mb-2" style={{ color: '#0a1628' }}>Match Officials</h3>
                <div className="grid grid-cols-3 gap-2 text-[9px]">
                  <div>
                    <p style={{ color: '#6b7280' }}>Referee</p>
                    <p className="font-semibold" style={{ color: '#0a1628' }}>{programmeData?.referee || 'TBC'}</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280' }}>Assistant 1</p>
                    <p className="font-semibold" style={{ color: '#0a1628' }}>{programmeData?.assistantRef1 || 'TBC'}</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280' }}>Assistant 2</p>
                    <p className="font-semibold" style={{ color: '#0a1628' }}>{programmeData?.assistantRef2 || 'TBC'}</p>
                  </div>
                </div>
              </div>

              {/* Sponsors */}
              {(programmeData?.matchSponsor || programmeData?.matchballSponsor || programmeData?.mascotSponsor) && (
                <div className="p-3 rounded mb-3" style={{ backgroundColor: '#facc15' }}>
                  {programmeData?.matchSponsor && (
                    <div className="mb-2">
                      <p className="text-[9px] font-bold uppercase" style={{ color: '#0a1628' }}>Match Sponsor</p>
                      <p className="text-sm font-black" style={{ color: '#0a1628' }}>{programmeData.matchSponsor}</p>
                    </div>
                  )}
                  {programmeData?.matchballSponsor && (
                    <div className="mb-2">
                      <p className="text-[9px] font-bold uppercase" style={{ color: '#0a1628' }}>Matchball Sponsor</p>
                      <p className="text-xs font-bold" style={{ color: '#0a1628' }}>{programmeData.matchballSponsor}</p>
                    </div>
                  )}
                  {programmeData?.mascotSponsor && (
                    <div>
                      <p className="text-[9px] font-bold uppercase" style={{ color: '#0a1628' }}>Mascot Sponsor</p>
                      <p className="text-xs font-bold" style={{ color: '#0a1628' }}>{programmeData.mascotSponsor}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Facts */}
              <div className="mt-3">
                <h3 className="text-[10px] font-bold uppercase mb-2" style={{ color: '#0a1628' }}>Quick Facts</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <p className="text-[8px] uppercase" style={{ color: '#6b7280' }}>Founded</p>
                    <p className="text-sm font-black" style={{ color: '#0a1628' }}>1925</p>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <p className="text-[8px] uppercase" style={{ color: '#6b7280' }}>Nickname</p>
                    <p className="text-sm font-black" style={{ color: '#0a1628' }}>The Celts</p>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <p className="text-[8px] uppercase" style={{ color: '#6b7280' }}>Colours</p>
                    <p className="text-sm font-black" style={{ color: '#0a1628' }}>Blue & Yellow</p>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <p className="text-[8px] uppercase" style={{ color: '#6b7280' }}>Ground</p>
                    <p className="text-[10px] font-bold" style={{ color: '#0a1628' }}>Avondale MPA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>2</p>
            </div>
          </div>
        );

      // ==================== MANAGER'S NOTES ====================
      case 'managers-notes':
        const defaultNotes = `Good afternoon and a warm welcome to all supporters joining us at the Avondale Motor Park Arena for today's fixture against ${opposition.name}.\n\nThe lads have been working hard in training this week and we're looking forward to putting on a performance for you today. The support we receive week in, week out means everything to this club.\n\nEnjoy the game and thank you for your continued support.\n\nUp The Celtic!`;
        const notesText = programmeData?.managersNotes || defaultNotes;

        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#fafafa', ...paperTexture }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                Manager's Notes
              </p>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              {/* Manager photo and intro */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0 border-2" style={{ borderColor: '#0a1628' }}>
                  <Image src="/images/staff/simon-berry.webp" alt="Simon Berry" width={64} height={80} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h2 className="text-lg font-black" style={{ color: '#0a1628' }}>Simon Berry</h2>
                  <p className="text-[10px] font-medium" style={{ color: '#6b7280' }}>First Team Manager</p>
                  <div className="mt-1 h-1 w-12" style={{ backgroundColor: '#facc15' }} />
                </div>
              </div>

              {/* Notes content */}
              <div className="p-3 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {notesText.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className="text-[10px] leading-relaxed mb-2" style={{ color: '#374151' }}>
                      {paragraph}
                    </p>
                  )
                ))}
                <div className="mt-3 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
                  <p className="text-[10px] font-bold italic" style={{ color: '#0a1628' }}>Simon Berry</p>
                  <p className="text-[9px]" style={{ color: '#6b7280' }}>First Team Manager</p>
                </div>
              </div>

              {/* Team News */}
              {programmeData?.teamNews && (
                <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#fef3c7' }}>
                  <h3 className="text-[10px] font-bold uppercase mb-1" style={{ color: '#0a1628' }}>Team News</h3>
                  <p className="text-[10px]" style={{ color: '#374151' }}>{programmeData.teamNews}</p>
                </div>
              )}

              {/* Special Notes */}
              {programmeData?.specialNotes && (
                <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#0a1628' }}>
                  <h3 className="text-[10px] font-bold uppercase mb-1" style={{ color: '#facc15' }}>Announcement</h3>
                  <p className="text-[10px]" style={{ color: '#ffffff' }}>{programmeData.specialNotes}</p>
                </div>
              )}
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>3</p>
            </div>
          </div>
        );

      // ==================== SQUAD - GK & DEFENDERS ====================
      case 'squad-gk-def':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#0a1628' }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#facc15' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#0a1628' }}>
                First Team Squad
              </p>
            </div>

            <div className="flex-1 p-3 overflow-hidden">
              {/* Goalkeepers */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                  <h3 className="text-[10px] font-bold uppercase" style={{ color: '#facc15' }}>Goalkeepers</h3>
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {goalkeepers.slice(0, 2).map(player => (
                    <div key={player.squadNo} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>
                        {player.squadNo}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold" style={{ color: '#ffffff' }}>{player.firstName} {player.lastName}</p>
                        <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{player.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defenders */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                  <h3 className="text-[10px] font-bold uppercase" style={{ color: '#facc15' }}>Defenders</h3>
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {defenders.slice(0, 8).map(player => (
                    <div key={player.squadNo} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>
                        {player.squadNo}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold" style={{ color: '#ffffff' }}>{player.firstName} {player.lastName}</p>
                        <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{player.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Management footer */}
            <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'rgba(250,204,21,0.1)' }}>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Manager: Simon Berry</p>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>4</p>
            </div>
          </div>
        );

      // ==================== SQUAD - MID & FWD ====================
      case 'squad-mid-fwd':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#0a1628' }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#facc15' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#0a1628' }}>
                First Team Squad
              </p>
            </div>

            <div className="flex-1 p-3 overflow-hidden">
              {/* Midfielders */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                  <h3 className="text-[10px] font-bold uppercase" style={{ color: '#facc15' }}>Midfielders</h3>
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {midfielders.slice(0, 8).map(player => (
                    <div key={player.squadNo} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>
                        {player.squadNo}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold" style={{ color: '#ffffff' }}>{player.firstName} {player.lastName}</p>
                        <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{player.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forwards */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                  <h3 className="text-[10px] font-bold uppercase" style={{ color: '#facc15' }}>Forwards</h3>
                  <div className="h-px flex-1" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {forwards.slice(0, 6).map(player => (
                    <div key={player.squadNo} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>
                        {player.squadNo}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold" style={{ color: '#ffffff' }}>{player.firstName} {player.lastName}</p>
                        <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{player.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'rgba(250,204,21,0.1)' }}>
              <p className="text-[9px]" style={{ color: '#facc15' }}>#UpTheCeltic</p>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>5</p>
            </div>
          </div>
        );

      // ==================== TODAY'S MATCH ====================
      case 'todays-match':
        // Get starting XI players from programme data, or use default
        const startingXIPlayers = programmeData?.startingXI?.length === 11
          ? programmeData.startingXI.map(no => squad.find(p => p.squadNo === no)).filter(Boolean)
          : [...goalkeepers.slice(0, 1), ...defenders.slice(0, 4), ...midfielders.slice(0, 4), ...forwards.slice(0, 2)];

        const subsPlayers = programmeData?.substitutes?.length
          ? programmeData.substitutes.map(no => squad.find(p => p.squadNo === no)).filter(Boolean)
          : [];

        const isHome = programmeData?.venue !== 'away';

        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#fafafa', ...paperTexture }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                Today&apos;s Match
              </p>
            </div>

            <div className="flex-1 p-3">
              {/* Teams header */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-center flex-1">
                  <div className="w-10 h-10 mx-auto mb-1">
                    <Image src="/images/club-logo.webp" alt="Celtic" width={40} height={40} className="object-contain" />
                  </div>
                  <p className="text-[10px] font-black" style={{ color: '#0a1628' }}>CELTIC</p>
                  <p className="text-[8px]" style={{ color: '#6b7280' }}>{isHome ? 'Home' : 'Away'}</p>
                </div>
                <div className="px-3">
                  <p className="text-lg font-black" style={{ color: '#facc15' }}>VS</p>
                </div>
                <div className="text-center flex-1">
                  <div className="w-10 h-10 mx-auto mb-1 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e5e7eb' }}>
                    <span className="text-[10px] font-bold" style={{ color: '#6b7280' }}>{opposition.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <p className="text-[10px] font-black" style={{ color: '#0a1628' }}>{opposition.name.split(' ')[0].toUpperCase()}</p>
                  <p className="text-[8px]" style={{ color: '#6b7280' }}>{isHome ? 'Away' : 'Home'}</p>
                </div>
              </div>

              {/* Team sheets */}
              <div className="grid grid-cols-2 gap-2">
                {/* Home - Celtic */}
                <div className="rounded overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
                  <div className="p-2 text-center" style={{ backgroundColor: '#facc15' }}>
                    <p className="text-[9px] font-bold" style={{ color: '#0a1628' }}>CWMBRAN CELTIC</p>
                  </div>
                  <div className="p-2">
                    {startingXIPlayers.map((p) => p && (
                      <div key={p.squadNo} className="flex items-center gap-1 py-0.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>{p.squadNo}</span>
                        <span className="text-[8px]" style={{ color: '#ffffff' }}>
                          {p.firstName[0]}. {p.lastName}
                          {programmeData?.captain === p.squadNo && <span style={{ color: '#facc15' }}> (C)</span>}
                        </span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <p className="text-[7px]" style={{ color: 'rgba(255,255,255,0.5)' }}>SUBS</p>
                      {subsPlayers.length > 0 ? (
                        <div className="flex flex-wrap gap-x-2">
                          {subsPlayers.map(p => p && (
                            <span key={p.squadNo} className="text-[7px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                              {p.squadNo}. {p.lastName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[7px]" style={{ color: 'rgba(255,255,255,0.4)' }}>12. ___  14. ___  15. ___</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Away - Opposition */}
                <div className="rounded overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                  <div className="p-2 text-center" style={{ backgroundColor: '#374151' }}>
                    <p className="text-[9px] font-bold" style={{ color: '#ffffff' }}>{opposition.name.toUpperCase()}</p>
                  </div>
                  <div className="p-2">
                    {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                      <div key={n} className="flex items-center gap-1 py-0.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: '#d1d5db', color: '#374151' }}>{n}</span>
                        <span className="text-[8px]" style={{ color: '#6b7280' }}>_______________</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
                      <p className="text-[7px]" style={{ color: '#9ca3af' }}>SUBS</p>
                      <p className="text-[7px]" style={{ color: '#9ca3af' }}>12. ___  14. ___  15. ___</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>6</p>
            </div>
          </div>
        );

      // ==================== OPPOSITION ====================
      case 'opposition':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#fafafa', ...paperTexture }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                The Opposition
              </p>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <div className="text-center mb-4">
                <h2 className="text-xl font-black" style={{ color: '#0a1628' }}>{opposition.name}</h2>
                {opposition.nickname && (
                  <p className="text-xs italic" style={{ color: '#6b7280' }}>"{opposition.nickname}"</p>
                )}
                <div className="mt-2 h-1 w-16 mx-auto" style={{ backgroundColor: '#facc15' }} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-3 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <p className="text-[8px] uppercase mb-1" style={{ color: '#6b7280' }}>Founded</p>
                  <p className="text-lg font-black" style={{ color: '#0a1628' }}>{opposition.founded}</p>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <p className="text-[8px] uppercase mb-1" style={{ color: '#6b7280' }}>Ground</p>
                  <p className="text-xs font-bold" style={{ color: '#0a1628' }}>{opposition.ground}</p>
                </div>
                <div className="p-3 rounded col-span-2" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <p className="text-[8px] uppercase mb-1" style={{ color: '#6b7280' }}>Club Colours</p>
                  <p className="text-sm font-bold" style={{ color: '#0a1628' }}>{opposition.colours}</p>
                </div>
              </div>

              {/* Last meeting */}
              {opposition.lastMeeting && (
                <div className="p-3 rounded" style={{ backgroundColor: '#0a1628' }}>
                  <p className="text-[9px] font-bold uppercase mb-2" style={{ color: '#facc15' }}>Last Meeting</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#ffffff' }}>{opposition.lastMeeting.date}</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold`} style={{
                        backgroundColor: opposition.lastMeeting.result === 'W' ? '#22c55e' : opposition.lastMeeting.result === 'L' ? '#ef4444' : '#6b7280',
                        color: '#ffffff'
                      }}>
                        {opposition.lastMeeting.result}
                      </span>
                      <span className="text-lg font-black" style={{ color: '#ffffff' }}>{opposition.lastMeeting.score}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>7</p>
            </div>
          </div>
        );

      // ==================== HEAD TO HEAD ====================
      case 'head-to-head':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#0a1628' }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#facc15' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#0a1628' }}>
                Head to Head
              </p>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-center">
              {/* VS Display */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-2">
                    <Image src="/images/club-logo.webp" alt="Celtic" width={56} height={56} className="object-contain" />
                  </div>
                  <p className="text-xs font-bold" style={{ color: '#ffffff' }}>CELTIC</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl font-black" style={{ color: '#facc15' }}>VS</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <span className="text-lg font-bold" style={{ color: '#facc15' }}>{opposition.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: '#ffffff' }}>{opposition.name.split(' ')[0].toUpperCase()}</p>
                </div>
              </div>

              {/* Stats */}
              {opposition.headToHead && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-2xl font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.played}</p>
                    <p className="text-[8px] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Played</p>
                  </div>
                  <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(34,197,94,0.3)' }}>
                    <p className="text-2xl font-black" style={{ color: '#22c55e' }}>{opposition.headToHead.celticWins}</p>
                    <p className="text-[8px] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Celtic Wins</p>
                  </div>
                  <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-2xl font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.draws}</p>
                    <p className="text-[8px] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Draws</p>
                  </div>
                  <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(239,68,68,0.3)' }}>
                    <p className="text-2xl font-black" style={{ color: '#ef4444' }}>{opposition.headToHead.oppositionWins}</p>
                    <p className="text-[8px] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Opp Wins</p>
                  </div>
                </div>
              )}

              {/* Win percentage bar */}
              {opposition.headToHead && (
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-[9px] uppercase mb-2 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>Win Rate Comparison</p>
                  <div className="flex h-6 rounded overflow-hidden">
                    <div style={{ width: `${(opposition.headToHead.celticWins / opposition.headToHead.played) * 100}%`, backgroundColor: '#22c55e' }} className="flex items-center justify-center">
                      <span className="text-[8px] font-bold" style={{ color: '#ffffff' }}>{Math.round((opposition.headToHead.celticWins / opposition.headToHead.played) * 100)}%</span>
                    </div>
                    <div style={{ width: `${(opposition.headToHead.draws / opposition.headToHead.played) * 100}%`, backgroundColor: '#6b7280' }} />
                    <div style={{ width: `${(opposition.headToHead.oppositionWins / opposition.headToHead.played) * 100}%`, backgroundColor: '#ef4444' }} className="flex items-center justify-center">
                      <span className="text-[8px] font-bold" style={{ color: '#ffffff' }}>{Math.round((opposition.headToHead.oppositionWins / opposition.headToHead.played) * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: 'rgba(250,204,21,0.1)' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>8</p>
            </div>
          </div>
        );

      // ==================== LEAGUE TABLE ====================
      case 'league-table':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#fafafa', ...paperTexture }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                {programmeData?.competition || 'JD Cymru South'} Table
              </p>
            </div>

            <div className="flex-1 p-2 overflow-hidden">
              <table className="w-full text-[8px]">
                <thead>
                  <tr style={{ backgroundColor: '#0a1628' }}>
                    <th className="p-1.5 text-left font-bold" style={{ color: '#facc15' }}>#</th>
                    <th className="p-1.5 text-left font-bold" style={{ color: '#facc15' }}>Club</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: '#facc15' }}>P</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: '#facc15' }}>W</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: '#facc15' }}>D</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: '#facc15' }}>L</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: '#facc15' }}>GD</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: '#facc15' }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeagueTable.results.slice(0, 16).map((team, idx) => {
                    const isCeltic = team.club === 'Cwmbran Celtic';
                    const isOpp = team.club === opposition.name;
                    return (
                      <tr key={team.club} style={{
                        backgroundColor: isCeltic ? '#fef3c7' : isOpp ? '#dbeafe' : idx % 2 === 0 ? '#ffffff' : '#f9fafb'
                      }}>
                        <td className="p-1.5 font-bold" style={{ color: '#0a1628' }}>{team.position}</td>
                        <td className="p-1.5" style={{ color: '#0a1628', fontWeight: isCeltic || isOpp ? 700 : 400 }}>
                          {team.club.length > 18 ? team.club.substring(0, 16) + '...' : team.club}
                        </td>
                        <td className="p-1.5 text-center" style={{ color: '#6b7280' }}>{team.played}</td>
                        <td className="p-1.5 text-center" style={{ color: '#6b7280' }}>{team.won}</td>
                        <td className="p-1.5 text-center" style={{ color: '#6b7280' }}>{team.drawn}</td>
                        <td className="p-1.5 text-center" style={{ color: '#6b7280' }}>{team.lost}</td>
                        <td className="p-1.5 text-center" style={{ color: team.gd > 0 ? '#22c55e' : team.gd < 0 ? '#ef4444' : '#6b7280' }}>
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>
                        <td className="p-1.5 text-center font-bold" style={{ color: '#0a1628' }}>{team.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Key */}
            <div className="px-4 py-2 flex items-center justify-center gap-4" style={{ backgroundColor: '#f3f4f6' }}>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fef3c7' }} />
                <span className="text-[7px]" style={{ color: '#6b7280' }}>Celtic</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dbeafe' }} />
                <span className="text-[7px]" style={{ color: '#6b7280' }}>Today's Opponent</span>
              </div>
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>9</p>
            </div>
          </div>
        );

      // ==================== FORM GUIDE ====================
      case 'form-guide':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#fafafa', ...paperTexture }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                Form Guide
              </p>
            </div>

            <div className="flex-1 p-3 overflow-hidden">
              {/* Recent Results */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase mb-2 pb-1" style={{ color: '#0a1628', borderBottom: '2px solid #facc15' }}>
                  Recent Results
                </h3>
                <div className="space-y-1.5">
                  {recentResults.slice(0, 5).map((r, i) => {
                    const home = r.homeTeam.includes('Cwmbran Celtic');
                    const celticScore = home ? r.homeScore : r.awayScore;
                    const oppScore = home ? r.awayScore : r.homeScore;
                    const res = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';
                    return (
                      <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{
                          backgroundColor: res === 'W' ? '#22c55e' : res === 'L' ? '#ef4444' : '#6b7280',
                          color: '#ffffff'
                        }}>{res}</span>
                        <span className="flex-1 text-[10px]" style={{ color: '#374151' }}>
                          {home ? 'vs' : '@'} {home ? r.awayTeam : r.homeTeam}
                        </span>
                        <span className="text-sm font-black" style={{ color: '#0a1628' }}>{celticScore}-{oppScore}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Fixtures */}
              <div>
                <h3 className="text-[10px] font-bold uppercase mb-2 pb-1" style={{ color: '#0a1628', borderBottom: '2px solid #facc15' }}>
                  Upcoming Fixtures
                </h3>
                <div className="space-y-1.5">
                  {upcomingFixtures.slice(0, 4).map((f, i) => {
                    const home = f.homeTeam.includes('Cwmbran Celtic');
                    return (
                      <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <span className="px-2 py-1 rounded text-[8px] font-bold" style={{ backgroundColor: home ? '#0a1628' : '#f3f4f6', color: home ? '#facc15' : '#6b7280' }}>
                          {home ? 'H' : 'A'}
                        </span>
                        <span className="flex-1 text-[10px]" style={{ color: '#374151' }}>
                          {home ? f.awayTeam : f.homeTeam}
                        </span>
                        <span className="text-[9px] px-2 py-1 rounded" style={{ backgroundColor: '#0a1628', color: '#ffffff' }}>
                          {formatShortDate(f.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>10</p>
            </div>
          </div>
        );

      // ==================== CLUB HISTORY ====================
      case 'club-history':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#0a1628' }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#facc15' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#0a1628' }}>
                Club History
              </p>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <div className="text-center mb-4">
                <h2 className="text-lg font-black" style={{ color: '#ffffff' }}>CWMBRAN CELTIC AFC</h2>
                <p className="text-xs italic" style={{ color: '#facc15' }}>Est. 1925</p>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>
                    1925
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs font-bold" style={{ color: '#ffffff' }}>Founded</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Cwmbran Celtic AFC established in the heart of our working-class community.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>
                    1949
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs font-bold" style={{ color: '#ffffff' }}>New Town Era</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Cwmbran designated a New Town, bringing growth and new supporters.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0" style={{ backgroundColor: '#facc15', color: '#0a1628' }}>
                    2024
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs font-bold" style={{ color: '#ffffff' }}>The Celtic Today</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Competing in JD Cymru South with men's, women's and development teams.
                    </p>
                  </div>
                </div>
              </div>

              {/* Motto */}
              <div className="mt-4 p-3 rounded text-center" style={{ backgroundColor: 'rgba(250,204,21,0.1)' }}>
                <p className="text-sm italic" style={{ color: '#facc15' }}>"Fraternitas in Ludis"</p>
                <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Brotherhood in Sport</p>
              </div>
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: 'rgba(250,204,21,0.1)' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>11</p>
            </div>
          </div>
        );

      // ==================== CELTIC BOND ====================
      case 'celtic-bond':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#facc15' }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                Support Your Club
              </p>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-center">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-black" style={{ color: '#0a1628' }}>CELTIC BOND</h2>
                <p className="text-xs" style={{ color: '#374151' }}>Monthly Lottery</p>
              </div>

              <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#ffffff' }}>
                <p className="text-xs text-center mb-3" style={{ color: '#374151' }}>
                  Join our monthly lottery for just <span className="font-bold">£5</span> and help fund club improvements while winning cash prizes!
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded text-center" style={{ backgroundColor: '#0a1628' }}>
                    <p className="text-xl font-black" style={{ color: '#facc15' }}>£100</p>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.6)' }}>1st Prize</p>
                  </div>
                  <div className="p-3 rounded text-center" style={{ backgroundColor: '#1e3a5f' }}>
                    <p className="text-lg font-black" style={{ color: '#facc15' }}>£50</p>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.6)' }}>2nd Prize</p>
                  </div>
                  <div className="p-3 rounded text-center" style={{ backgroundColor: '#2d4a6f' }}>
                    <p className="text-lg font-black" style={{ color: '#facc15' }}>£25</p>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.6)' }}>3rd Prize</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded text-center" style={{ backgroundColor: '#0a1628' }}>
                <p className="text-xs" style={{ color: '#ffffff' }}>
                  Sign up at <span className="font-bold" style={{ color: '#facc15' }}>cwmbranceltic.com/celtic-bond</span>
                </p>
              </div>
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>12</p>
            </div>
          </div>
        );

      // ==================== SPONSORS ====================
      case 'sponsors':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#fafafa', ...paperTexture }}>
            {/* Header */}
            <div className="px-4 py-2" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#facc15' }}>
                Thank You To Our Sponsors
              </p>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-center">
              {/* Main sponsor */}
              <div className="text-center mb-4">
                <p className="text-[9px] uppercase mb-2" style={{ color: '#6b7280' }}>Principal Partner</p>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <p className="text-lg font-black" style={{ color: '#0a1628' }}>AVONDALE MOTOR PARK</p>
                  <p className="text-[10px]" style={{ color: '#6b7280' }}>Stadium Naming Rights Partner</p>
                </div>
              </div>

              {/* Other sponsors grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded text-center" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <p className="text-[9px] uppercase mb-1" style={{ color: '#6b7280' }}>Kit Sponsor</p>
                  <p className="text-xs font-bold" style={{ color: '#0a1628' }}>Partner Name</p>
                </div>
                <div className="p-3 rounded text-center" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <p className="text-[9px] uppercase mb-1" style={{ color: '#6b7280' }}>Training Wear</p>
                  <p className="text-xs font-bold" style={{ color: '#0a1628' }}>Partner Name</p>
                </div>
                <div className="p-3 rounded text-center" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <p className="text-[9px] uppercase mb-1" style={{ color: '#6b7280' }}>Match Ball</p>
                  <p className="text-xs font-bold" style={{ color: '#0a1628' }}>Partner Name</p>
                </div>
                <div className="p-3 rounded text-center" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <p className="text-[9px] uppercase mb-1" style={{ color: '#6b7280' }}>Programme</p>
                  <p className="text-xs font-bold" style={{ color: '#0a1628' }}>Partner Name</p>
                </div>
              </div>

              {/* Sponsor CTA */}
              <div className="mt-4 p-3 rounded text-center" style={{ backgroundColor: '#0a1628' }}>
                <p className="text-[9px]" style={{ color: '#facc15' }}>
                  Interested in sponsoring? Email sponsors@cwmbranceltic.com
                </p>
              </div>
            </div>

            {/* Page number */}
            <div className="px-4 py-1 text-center" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.5)' }}>13</p>
            </div>
          </div>
        );

      // ==================== BACK COVER ====================
      case 'back-cover':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: '#0a1628' }}>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 mb-4">
                <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={96} height={96} className="object-contain" />
              </div>

              <h2 className="text-xl font-black mb-1" style={{ color: '#ffffff' }}>CWMBRAN CELTIC AFC</h2>
              <p className="text-xs mb-4" style={{ color: '#facc15' }}>Established 1925</p>

              <div className="h-px w-24 mb-4" style={{ backgroundColor: 'rgba(250,204,21,0.3)' }} />

              <div className="text-xs space-y-1 mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <p>Avondale Motor Park Arena</p>
                <p>Henllys Way, Cwmbran</p>
                <p>NP44 3FS</p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Web</p>
                  <p className="text-xs font-bold" style={{ color: '#ffffff' }}>cwmbranceltic.com</p>
                </div>
                <div className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <div className="text-center">
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Social</p>
                  <p className="text-xs font-bold" style={{ color: '#ffffff' }}>@cwmbranceltic</p>
                </div>
              </div>

              <p className="text-xl font-black" style={{ color: '#facc15' }}>#UpTheCeltic</p>
            </div>

            {/* Footer */}
            <div className="p-4 text-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Thank you for your support
              </p>
              <p className="text-[8px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Programme produced by Cwmbran Celtic AFC
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Programme Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm">
          {/* Programme with shadow and page effect */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              aspectRatio: '1/1.414',
              maxHeight: 'calc(100vh - 140px)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            {/* Page Content */}
            <div className="absolute inset-0">
              {renderPage()}
            </div>

            {/* Page edge effect (right side) */}
            <div className="absolute top-0 right-0 bottom-0 w-1 pointer-events-none" style={{
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))'
            }} />

            {/* Navigation Arrows */}
            {currentPage > 0 && (
              <button
                onClick={prevPage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20 transition-transform hover:scale-110"
                style={{ backgroundColor: 'rgba(10,22,40,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <span className="text-lg" style={{ color: '#facc15' }}>‹</span>
              </button>
            )}
            {currentPage < totalPages - 1 && (
              <button
                onClick={nextPage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20 transition-transform hover:scale-110"
                style={{ backgroundColor: 'rgba(10,22,40,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <span className="text-lg" style={{ color: '#facc15' }}>›</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4" style={{ backgroundColor: '#0a1628' }}>
        {/* Page Indicator */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: i === currentPage ? '#facc15' : 'rgba(255,255,255,0.2)',
                transform: i === currentPage ? 'scale(1.3)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Share & Home */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            cwmbranceltic.com
          </Link>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Page {currentPage + 1} of {totalPages}
          </p>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="px-3 py-1.5 rounded text-[10px] font-bold"
            style={{ backgroundColor: '#facc15', color: '#0a1628' }}
          >
            Share
          </button>
        </div>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex gap-2">
              <button onClick={shareWhatsApp} className="flex-1 py-2 rounded text-[10px] font-bold" style={{ backgroundColor: '#25D366', color: '#ffffff' }}>WhatsApp</button>
              <button onClick={shareTwitter} className="flex-1 py-2 rounded text-[10px] font-bold" style={{ backgroundColor: '#000000', color: '#ffffff' }}>X</button>
              <button onClick={copyLink} className="flex-1 py-2 rounded text-[10px] font-bold" style={{ backgroundColor: '#6b7280', color: '#ffffff' }}>Copy Link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
