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
  actionImage: string;
  status?: 'draft' | 'published';
}

// Design constants matching PDF
const COLORS = {
  navy: '#1e3a5f',
  navyDark: '#0f2744',
  yellow: '#facc15',
  white: '#ffffff',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  grayBorder: '#e5e7eb',
};

// Reusable page header component (yellow bar on left)
function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: COLORS.yellow }} />
      <div>
        <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: COLORS.navy }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs" style={{ color: COLORS.gray }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// Sponsor footer for pages
function SponsorFooter() {
  return (
    <div className="mt-auto pt-4 border-t" style={{ borderColor: COLORS.grayBorder }}>
      <p className="text-[10px] text-center uppercase tracking-wider mb-2" style={{ color: COLORS.gray }}>
        Principal Partner
      </p>
      <div className="flex items-center justify-center">
        <div className="px-4 py-2">
          <p className="text-sm font-black" style={{ color: COLORS.navy }}>AVONDALE</p>
          <p className="text-[10px] font-bold" style={{ color: COLORS.yellow }}>VEHICLE HIRE</p>
        </div>
      </div>
    </div>
  );
}

export default function ShareableProgrammePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
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

  // 10 pages matching PDF exactly
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navyDark }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: COLORS.white }}>Programme Not Found</h1>
          <Link href="/" className="underline" style={{ color: COLORS.yellow }}>Return to Homepage</Link>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (pages[currentPage]) {
      // ==================== PAGE 1: COVER ====================
      case 'cover':
        return (
          <div className="h-full relative overflow-hidden">
            {/* Background - Action photo with gradient */}
            <div className="absolute inset-0">
              {programmeData?.coverImage ? (
                <Image src={programmeData.coverImage} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: '#3a5a40' }} />
              )}
              {/* Dark gradient overlay */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(180deg, rgba(15,39,68,0.4) 0%, rgba(15,39,68,0.2) 40%, rgba(15,39,68,0.8) 100%)'
              }} />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col p-4">
              {/* Top Row - Badge and Kickoff */}
              <div className="flex justify-between items-start">
                {/* Left: Official Programme badge */}
                <div className="px-3 py-2 rounded" style={{ backgroundColor: COLORS.yellow }}>
                  <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: COLORS.navy }}>
                    Official Match Programme
                  </p>
                  <p className="text-[10px] font-bold" style={{ color: COLORS.navy }}>
                    JD Cymru South
                  </p>
                </div>

                {/* Right: Kickoff time */}
                <div className="px-4 py-2 rounded text-center" style={{ backgroundColor: COLORS.yellow }}>
                  <p className="text-2xl font-black" style={{ color: COLORS.navy }}>
                    {programmeData?.kickoff || '15:00'}
                  </p>
                  <p className="text-[8px] font-bold uppercase" style={{ color: COLORS.navy }}>Kick-Off</p>
                </div>
              </div>

              {/* Center - Club crest and match info */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 mb-4">
                  <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={96} height={96} className="object-contain drop-shadow-xl" />
                </div>

                <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: COLORS.white, textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                  CWMBRAN CELTIC
                </h1>

                <div className="flex items-center gap-3 my-2">
                  <div className="h-px w-8" style={{ backgroundColor: COLORS.yellow }} />
                  <span className="text-sm font-bold" style={{ color: COLORS.yellow }}>vs</span>
                  <div className="h-px w-8" style={{ backgroundColor: COLORS.yellow }} />
                </div>

                <h2 className="text-2xl font-black tracking-tight" style={{ color: COLORS.white, textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                  {opposition.name.toUpperCase()}
                </h2>
                {opposition.nickname && (
                  <p className="text-sm italic mt-1" style={{ color: COLORS.yellow }}>
                    "{opposition.nickname}"
                  </p>
                )}
              </div>

              {/* Bottom - Date and Venue bar */}
              <div className="flex justify-between items-end px-2 py-3 rounded" style={{ backgroundColor: 'rgba(15,39,68,0.9)' }}>
                <div>
                  <p className="text-[8px] uppercase font-bold" style={{ color: COLORS.yellow }}>Date</p>
                  <p className="text-xs font-bold" style={{ color: COLORS.white }}>{formatDate(date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase font-bold" style={{ color: COLORS.yellow }}>Venue</p>
                  <p className="text-xs font-bold" style={{ color: COLORS.white }}>Avondale Motor Park Arena</p>
                </div>
              </div>
            </div>
          </div>
        );

      // ==================== PAGE 2: MANAGER'S NOTES ====================
      case 'managers-notes':
        const defaultNotes = `Good afternoon and welcome to the Avondale Motor Park Arena for today's JD Cymru South fixture against ${opposition.name}.\n\nThank you for your continued support - it means the world to everyone at the club. The lads have been working hard in training and we're looking forward to putting on a performance for you today.\n\nEnjoy the game!`;
        const notesText = programmeData?.managersNotes || defaultNotes;

        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: COLORS.white }}>
            <PageHeader title="Manager's Notes" />

            {/* Manager card */}
            <div className="flex items-start gap-4 p-4 rounded-lg mb-4" style={{ backgroundColor: COLORS.grayLight }}>
              <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0">
                <Image src="/images/staff/simon-berry.webp" alt="Simon Berry" width={64} height={80} className="object-cover w-full h-full" />
              </div>
              <div>
                <h2 className="text-lg font-black" style={{ color: COLORS.navy }}>Simon Berry</h2>
                <p className="text-sm" style={{ color: COLORS.gray }}>First Team Manager</p>
                <span className="inline-block mt-2 px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: COLORS.grayBorder, color: COLORS.navy }}>
                  Since 2023
                </span>
              </div>
            </div>

            {/* Notes content */}
            <div className="flex-1 p-4 rounded-lg" style={{ backgroundColor: COLORS.grayLight }}>
              {notesText.split('\n').map((paragraph, idx) => (
                paragraph.trim() && (
                  <p key={idx} className="text-sm leading-relaxed mb-3" style={{ color: '#374151' }}>
                    {paragraph}
                  </p>
                )
              ))}
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
                <p className="text-sm font-bold" style={{ color: COLORS.navy }}>Simon Berry</p>
                <p className="text-xs" style={{ color: COLORS.gray }}>First Team Manager</p>
              </div>
            </div>

            <SponsorFooter />
          </div>
        );

      // ==================== PAGE 3: SQUAD ====================
      case 'squad':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: COLORS.white }}>
            <PageHeader title="Cwmbran Celtic Squad" subtitle="Tick the players in today's starting lineup" />

            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Left column - GK, DEF, FWD */}
              <div className="space-y-3">
                {/* Goalkeepers */}
                <div>
                  <div className="px-2 py-1 rounded-t text-[10px] font-bold uppercase" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                    Goalkeepers
                  </div>
                  <div className="border border-t-0 rounded-b p-2 space-y-1" style={{ borderColor: COLORS.grayBorder }}>
                    {goalkeepers.map(p => (
                      <div key={p.squadNo} className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded" style={{ borderColor: COLORS.grayBorder }} />
                        <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                          {p.squadNo}
                        </span>
                        <span className="text-xs" style={{ color: COLORS.navy }}>{p.firstName} {p.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defenders */}
                <div>
                  <div className="px-2 py-1 rounded-t text-[10px] font-bold uppercase" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                    Defenders
                  </div>
                  <div className="border border-t-0 rounded-b p-2 space-y-1" style={{ borderColor: COLORS.grayBorder }}>
                    {defenders.slice(0, 6).map(p => (
                      <div key={p.squadNo} className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded" style={{ borderColor: COLORS.grayBorder }} />
                        <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                          {p.squadNo}
                        </span>
                        <span className="text-xs" style={{ color: COLORS.navy }}>{p.firstName} {p.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forwards */}
                <div>
                  <div className="px-2 py-1 rounded-t text-[10px] font-bold uppercase" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                    Forwards
                  </div>
                  <div className="border border-t-0 rounded-b p-2 space-y-1" style={{ borderColor: COLORS.grayBorder }}>
                    {forwards.slice(0, 4).map(p => (
                      <div key={p.squadNo} className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded" style={{ borderColor: COLORS.grayBorder }} />
                        <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                          {p.squadNo}
                        </span>
                        <span className="text-xs" style={{ color: COLORS.navy }}>{p.firstName} {p.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - MID and SUBS */}
              <div className="space-y-3">
                {/* Midfielders */}
                <div>
                  <div className="px-2 py-1 rounded-t text-[10px] font-bold uppercase" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                    Midfielders
                  </div>
                  <div className="border border-t-0 rounded-b p-2 space-y-1" style={{ borderColor: COLORS.grayBorder }}>
                    {midfielders.slice(0, 10).map(p => (
                      <div key={p.squadNo} className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded" style={{ borderColor: COLORS.grayBorder }} />
                        <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                          {p.squadNo}
                        </span>
                        <span className="text-xs" style={{ color: COLORS.navy }}>{p.firstName} {p.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                <div>
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: COLORS.gray }}>Substitutes</p>
                  <div className="space-y-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded" style={{ borderColor: COLORS.grayBorder }} />
                        <div className="flex-1 h-6 border-b" style={{ borderColor: COLORS.grayBorder }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 mt-3" style={{ borderTop: `2px solid ${COLORS.yellow}` }}>
              <p className="text-xs font-bold" style={{ color: COLORS.navy }}>MANAGER: Simon Berry</p>
              <p className="text-xs font-bold" style={{ color: COLORS.yellow }}>#UpTheCeltic</p>
            </div>
          </div>
        );

      // ==================== PAGE 4: TODAY'S MATCH ====================
      case 'todays-match':
        const startingXIPlayers = programmeData?.startingXI?.length === 11
          ? programmeData.startingXI.map(no => squad.find(p => p.squadNo === no)).filter(Boolean)
          : [...goalkeepers.slice(0, 1), ...defenders.slice(0, 4), ...midfielders.slice(0, 4), ...forwards.slice(0, 2)];

        const subsPlayers = programmeData?.substitutes?.length
          ? programmeData.substitutes.map(no => squad.find(p => p.squadNo === no)).filter(Boolean)
          : [];

        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: COLORS.white }}>
            <PageHeader title="Today's Match" />

            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* Home - Celtic */}
              <div className="rounded-lg overflow-hidden border" style={{ borderColor: COLORS.grayBorder }}>
                <div className="p-2 text-center" style={{ backgroundColor: COLORS.navy }}>
                  <p className="text-xs font-black" style={{ color: COLORS.yellow }}>CWMBRAN CELTIC</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</p>
                </div>
                <div className="p-3 space-y-1">
                  {startingXIPlayers.map((p) => p && (
                    <div key={p.squadNo} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                        {p.squadNo}
                      </span>
                      <span className="text-[11px]" style={{ color: COLORS.navy }}>
                        {p.firstName} {p.lastName}
                        {programmeData?.captain === p.squadNo && <span className="font-bold" style={{ color: COLORS.yellow }}> (C)</span>}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2" style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
                    <p className="text-[9px] font-bold uppercase mb-1" style={{ color: COLORS.gray }}>Substitutes</p>
                    {subsPlayers.length > 0 ? (
                      subsPlayers.map(p => p && (
                        <div key={p.squadNo} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: COLORS.grayLight, color: COLORS.navy }}>
                            {p.squadNo}
                          </span>
                          <span className="text-[10px]" style={{ color: COLORS.gray }}>{p.lastName}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px]" style={{ color: COLORS.gray }}>12. ___ 14. ___ 15. ___</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Away - Opposition */}
              <div className="rounded-lg overflow-hidden border" style={{ borderColor: COLORS.grayBorder }}>
                <div className="p-2 text-center" style={{ backgroundColor: COLORS.gray }}>
                  <p className="text-xs font-black" style={{ color: COLORS.white }}>{opposition.name.toUpperCase()}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Away</p>
                </div>
                <div className="p-3">
                  <p className="text-[9px] font-bold uppercase mb-2" style={{ color: COLORS.gray }}>Starting XI</p>
                  <div className="space-y-1">
                    {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                      <div key={n} className="flex items-center gap-2">
                        <span className="w-5 text-[10px] font-bold" style={{ color: COLORS.gray }}>{n}</span>
                        <div className="flex-1 border-b" style={{ borderColor: COLORS.grayBorder }} />
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 mt-2" style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
                    <p className="text-[9px] font-bold uppercase mb-1" style={{ color: COLORS.gray }}>Substitutes</p>
                    <p className="text-[10px]" style={{ color: COLORS.gray }}>12. ___ 14. ___ 15. ___</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Officials */}
            <div className="mt-4 pt-3" style={{ borderTop: `2px solid ${COLORS.yellow}` }}>
              <p className="text-[10px] font-bold uppercase text-center mb-2" style={{ color: COLORS.gray }}>Match Officials</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[9px] uppercase" style={{ color: COLORS.gray }}>Referee</p>
                  <div className="border-b mt-1" style={{ borderColor: COLORS.grayBorder }} />
                </div>
                <div>
                  <p className="text-[9px] uppercase" style={{ color: COLORS.gray }}>Assistant 1</p>
                  <div className="border-b mt-1" style={{ borderColor: COLORS.grayBorder }} />
                </div>
                <div>
                  <p className="text-[9px] uppercase" style={{ color: COLORS.gray }}>Assistant 2</p>
                  <div className="border-b mt-1" style={{ borderColor: COLORS.grayBorder }} />
                </div>
              </div>
            </div>
          </div>
        );

      // ==================== PAGE 5: HISTORY ====================
      case 'history':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: COLORS.white }}>
            <PageHeader title="Our History" subtitle="100 Years of Cwmbran Celtic" />

            <div className="flex-1 space-y-4">
              {/* Timeline items */}
              {[
                { year: '1925', title: 'The Beginning', text: 'Cwmbran Celtic AFC was founded in 1925, emerging from the proud working-class community of Cwmbran. In an era when the town was still developing around its iron and steel industries, local men came together to form a football club that would represent their community for generations to come.' },
                { year: '1940s', title: 'Post-War Revival', text: 'After the Second World War, the club reformed with renewed vigour. Cwmbran was designated a New Town in 1949, bringing an influx of new residents and supporters. The Celtic became a focal point for community spirit in the growing town.' },
                { year: '2000s', title: 'Rising Through the Ranks', text: 'The 21st century saw Celtic climb the Welsh football pyramid. The club earned promotion to the Welsh Football League and later to Tier 3 of the Cymru Leagues, competing against some of Wales\' most historic clubs.' },
                { year: 'NOW', title: 'The Celtic Today', text: 'Today, Cwmbran Celtic fields men\'s, women\'s and development teams. Playing at the Avondale Motor Park Arena, we remain committed to our founding values: community, passion, and the beautiful game.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.yellow }}>
                    <span className="text-[10px] font-black" style={{ color: COLORS.navy }}>{item.year}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: COLORS.navy }}>{item.title}</h3>
                    <p className="text-[10px] leading-relaxed" style={{ color: COLORS.gray }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote banner */}
            <div className="mt-4 p-3 rounded-lg text-center" style={{ backgroundColor: COLORS.navy }}>
              <p className="text-xs italic" style={{ color: COLORS.white }}>
                "More than a club - we are a family, a community, a century of shared dreams."
              </p>
              <p className="text-[10px] mt-1" style={{ color: COLORS.yellow }}>Fraternitas in Ludis - Brotherhood in Sport</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
              {[
                { value: '101', label: 'YEARS' },
                { value: '3', label: 'TEAMS' },
                { value: 'Tier 3', label: 'LEVEL' },
                { value: '1', label: 'COMMUNITY' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-black" style={{ color: COLORS.navy }}>{stat.value}</p>
                  <p className="text-[8px] uppercase" style={{ color: COLORS.gray }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // ==================== PAGE 6: VISITORS ====================
      case 'visitors':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: COLORS.white }}>
            <PageHeader title="Today's Visitors" subtitle={opposition.name} />

            {/* Club info and head to head in card */}
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: COLORS.grayLight }}>
              <div className="grid grid-cols-2 gap-4">
                {/* Club info */}
                <div>
                  <p className="text-[10px] font-bold uppercase mb-2" style={{ color: COLORS.gray }}>Club Information</p>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-1" style={{ borderColor: COLORS.grayBorder }}>
                      <span className="text-xs" style={{ color: COLORS.gray }}>Founded</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.navy }}>{opposition.founded}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1" style={{ borderColor: COLORS.grayBorder }}>
                      <span className="text-xs" style={{ color: COLORS.gray }}>Ground</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.navy }}>{opposition.ground}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1" style={{ borderColor: COLORS.grayBorder }}>
                      <span className="text-xs" style={{ color: COLORS.gray }}>Colours</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.navy }}>{opposition.colours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: COLORS.gray }}>Nickname</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.navy }}>"{opposition.nickname || 'N/A'}"</span>
                    </div>
                  </div>
                </div>

                {/* Head to head */}
                {opposition.headToHead && (
                  <div>
                    <p className="text-[10px] font-bold uppercase mb-2" style={{ color: COLORS.yellow }}>Head to Head Record</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded text-center" style={{ backgroundColor: COLORS.navy }}>
                        <p className="text-xl font-black" style={{ color: COLORS.white }}>{opposition.headToHead.played}</p>
                        <p className="text-[8px] uppercase" style={{ color: COLORS.yellow }}>Played</p>
                      </div>
                      <div className="p-2 rounded text-center" style={{ backgroundColor: COLORS.navy }}>
                        <p className="text-xl font-black" style={{ color: COLORS.white }}>{opposition.headToHead.celticWins}</p>
                        <p className="text-[8px] uppercase" style={{ color: COLORS.yellow }}>Celtic Wins</p>
                      </div>
                      <div className="p-2 rounded text-center" style={{ backgroundColor: COLORS.navy }}>
                        <p className="text-xl font-black" style={{ color: COLORS.white }}>{opposition.headToHead.draws}</p>
                        <p className="text-[8px] uppercase" style={{ color: COLORS.yellow }}>Draws</p>
                      </div>
                      <div className="p-2 rounded text-center" style={{ backgroundColor: COLORS.navy }}>
                        <p className="text-xl font-black" style={{ color: COLORS.white }}>{opposition.headToHead.oppositionWins}</p>
                        <p className="text-[8px] uppercase" style={{ color: COLORS.yellow }}>Losses</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About Celtic */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.grayLight }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: COLORS.navy }}>About Cwmbran Celtic AFC</h3>
              <p className="text-[10px] leading-relaxed" style={{ color: COLORS.gray }}>
                Founded in 1925, Cwmbran Celtic AFC is a community football club based in Cwmbran, South Wales. Playing our home games at the Avondale Motor Park Arena, we compete in the JD Cymru South league. The club is committed to developing local talent and providing football opportunities for players of all ages and abilities.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
                <div className="text-center">
                  <p className="text-lg font-black" style={{ color: COLORS.navy }}>1925</p>
                  <p className="text-[8px] uppercase" style={{ color: COLORS.gray }}>Founded</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black" style={{ color: COLORS.navy }}>3</p>
                  <p className="text-[8px] uppercase" style={{ color: COLORS.gray }}>Teams</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black" style={{ color: COLORS.navy }}>Tier 3</p>
                  <p className="text-[8px] uppercase" style={{ color: COLORS.gray }}>League Level</p>
                </div>
              </div>
            </div>

            <SponsorFooter />
          </div>
        );

      // ==================== PAGE 7: LEAGUE TABLE ====================
      case 'league-table':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: COLORS.white }}>
            <PageHeader title="JD Cymru South Table" />

            <div className="flex-1 overflow-hidden">
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ backgroundColor: COLORS.yellow }}>
                    <th className="p-1.5 text-left font-bold" style={{ color: COLORS.navy }}>Pos</th>
                    <th className="p-1.5 text-left font-bold" style={{ color: COLORS.navy }}>Club</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: COLORS.navy }}>P</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: COLORS.navy }}>W</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: COLORS.navy }}>D</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: COLORS.navy }}>L</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: COLORS.navy }}>GD</th>
                    <th className="p-1.5 text-center font-bold" style={{ color: COLORS.navy }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeagueTable.results.slice(0, 16).map((team, idx) => {
                    const isCeltic = team.club === 'Cwmbran Celtic';
                    const isOpp = team.club === opposition.name;
                    return (
                      <tr key={team.club} style={{
                        backgroundColor: isCeltic ? '#fef9c3' : isOpp ? '#e0e7ff' : idx % 2 === 0 ? COLORS.white : COLORS.grayLight
                      }}>
                        <td className="p-1.5 font-bold" style={{ color: COLORS.navy }}>{team.position}</td>
                        <td className="p-1.5" style={{ color: COLORS.navy, fontWeight: isCeltic || isOpp ? 700 : 400 }}>
                          {team.club}
                          {(isCeltic || isOpp) && <span className="ml-1 inline-block w-2 h-2 rounded-full" style={{ backgroundColor: isCeltic ? COLORS.yellow : COLORS.navy }} />}
                        </td>
                        <td className="p-1.5 text-center" style={{ color: COLORS.gray }}>{team.played}</td>
                        <td className="p-1.5 text-center" style={{ color: COLORS.gray }}>{team.won}</td>
                        <td className="p-1.5 text-center" style={{ color: COLORS.gray }}>{team.drawn}</td>
                        <td className="p-1.5 text-center" style={{ color: COLORS.gray }}>{team.lost}</td>
                        <td className="p-1.5 text-center" style={{ color: team.gd > 0 ? '#16a34a' : team.gd < 0 ? '#dc2626' : COLORS.gray }}>
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>
                        <td className="p-1.5 text-center font-bold" style={{ color: COLORS.navy }}>{team.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-3 mt-2" style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
                <span className="text-[10px]" style={{ color: COLORS.gray }}>Cwmbran Celtic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.navy }} />
                <span className="text-[10px]" style={{ color: COLORS.gray }}>Today's Opposition</span>
              </div>
              <span className="text-[10px]" style={{ color: COLORS.gray }}>Table as of {formatShortDate(date)}</span>
            </div>
          </div>
        );

      // ==================== PAGE 8: RESULTS & FIXTURES ====================
      case 'results-fixtures':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.white }}>
            {/* Action photo header */}
            <div className="h-24 relative">
              {programmeData?.actionImage ? (
                <Image src={programmeData.actionImage} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: COLORS.navy }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Recent Action</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 p-5">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Recent Results */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
                    <h2 className="text-sm font-black uppercase" style={{ color: COLORS.navy }}>Recent Results</h2>
                  </div>
                  <div className="space-y-2">
                    {recentResults.slice(0, 5).map((r, i) => {
                      const home = r.homeTeam.includes('Cwmbran Celtic');
                      const celticScore = home ? r.homeScore : r.awayScore;
                      const oppScore = home ? r.awayScore : r.homeScore;
                      const res = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';
                      return (
                        <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: COLORS.grayLight }}>
                          <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{
                            backgroundColor: res === 'W' ? '#16a34a' : res === 'L' ? '#dc2626' : COLORS.gray,
                            color: COLORS.white
                          }}>{res}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold truncate" style={{ color: COLORS.navy }}>{home ? r.awayTeam : r.homeTeam}</p>
                            <p className="text-[8px]" style={{ color: COLORS.gray }}>{home ? 'Home' : 'Away'} • {formatShortDate(r.date)}</p>
                          </div>
                          <span className="text-sm font-black" style={{ color: COLORS.navy }}>{celticScore}-{oppScore}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Up Next */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
                    <h2 className="text-sm font-black uppercase" style={{ color: COLORS.navy }}>Up Next</h2>
                  </div>
                  <div className="space-y-2">
                    {upcomingFixtures.slice(0, 5).map((f, i) => {
                      const home = f.homeTeam.includes('Cwmbran Celtic');
                      return (
                        <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: COLORS.grayLight }}>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold truncate" style={{ color: COLORS.navy }}>{home ? f.awayTeam : f.homeTeam}</p>
                            <p className="text-[8px]" style={{ color: COLORS.gray }}>{home ? 'Home' : 'Away'} • {f.time || '15:00'}</p>
                          </div>
                          <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                            {formatShortDate(f.date)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <SponsorFooter />
          </div>
        );

      // ==================== PAGE 9: CELTIC BOND ====================
      case 'celtic-bond':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: COLORS.yellow }}>
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                Support Your Club
              </span>
              <h1 className="text-3xl font-black mt-2" style={{ color: COLORS.navy }}>CELTIC BOND</h1>
              <p className="text-sm" style={{ color: COLORS.navy }}>Help Build Our Future</p>
            </div>

            {/* Description card */}
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: COLORS.white }}>
              <h3 className="text-xs font-bold uppercase mb-2" style={{ color: COLORS.navy }}>What is the Celtic Bond?</h3>
              <p className="text-[11px] leading-relaxed" style={{ color: COLORS.gray }}>
                The Celtic Bond is a monthly lottery that helps fund essential club improvements and community projects. For just £5 per month, you could win cash prizes while supporting your local football club.
              </p>
            </div>

            {/* Prize boxes */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-3 rounded-lg text-center" style={{ backgroundColor: COLORS.navy }}>
                <p className="text-2xl font-black" style={{ color: COLORS.yellow }}>£100</p>
                <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>1st Prize</p>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ backgroundColor: COLORS.navy }}>
                <p className="text-xl font-black" style={{ color: COLORS.yellow }}>£50</p>
                <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>2nd Prize</p>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ backgroundColor: COLORS.navy }}>
                <p className="text-xl font-black" style={{ color: COLORS.yellow }}>£25</p>
                <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>3rd Prize</p>
              </div>
            </div>

            {/* What it funds */}
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: COLORS.white }}>
              <h3 className="text-xs font-bold uppercase mb-2" style={{ color: COLORS.navy }}>Your Support Helps Fund:</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Pitch maintenance', 'Youth development', 'Kit & equipment', 'Ground improvements'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: '#16a34a', color: COLORS.white }}>✓</span>
                    <span className="text-[11px]" style={{ color: COLORS.navy }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to join */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.navy }}>
              <h3 className="text-xs font-bold uppercase mb-2" style={{ color: COLORS.yellow }}>How to Join</h3>
              <p className="text-[11px] mb-3" style={{ color: COLORS.white }}>
                Sign up online at <span className="font-bold">cwmbranceltic.com/celtic-bond</span> or speak to a committee member on match day.
              </p>
              <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div>
                  <p className="text-lg font-black" style={{ color: COLORS.yellow }}>Only £5</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>per month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: COLORS.white }}>Monthly Draw</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Results on social media</p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs mt-4 font-bold" style={{ color: COLORS.navy }}>
              Thank you to all our Celtic Bond members!
            </p>
            <p className="text-center text-sm font-black" style={{ color: COLORS.navy }}>#UpTheCeltic</p>
          </div>
        );

      // ==================== PAGE 10: BACK COVER ====================
      case 'back-cover':
        return (
          <div className="h-full flex flex-col" style={{ background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {/* Club crest */}
              <div className="w-24 h-24 mb-4">
                <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={96} height={96} className="object-contain" />
              </div>

              <h1 className="text-2xl font-black" style={{ color: COLORS.white }}>CWMBRAN CELTIC AFC</h1>
              <p className="text-sm mb-6" style={{ color: COLORS.yellow }}>Established 1925</p>

              {/* Info columns */}
              <div className="grid grid-cols-2 gap-8 text-left mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase mb-2" style={{ color: COLORS.yellow }}>Our Ground</p>
                  <p className="text-sm font-bold" style={{ color: COLORS.white }}>Avondale Motor Park Arena</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Henllys Way</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Cwmbran</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>NP44 3FS</p>

                  <p className="text-[10px] font-bold uppercase mt-4 mb-1" style={{ color: COLORS.yellow }}>Contact</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>cwmbrancelticfc@gmail.com</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase mb-2" style={{ color: COLORS.yellow }}>Admission Prices</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Adults</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.white }}>£5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Concessions</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.white }}>£3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Under 16s</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.yellow }}>FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Programme</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.white }}>£2</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold uppercase mt-4 mb-1" style={{ color: COLORS.yellow }}>Follow Us</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>@cwmbranceltic</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>cwmbranceltic.com</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Thank you for supporting Cwmbran Celtic AFC</p>
              <p className="text-lg font-black" style={{ color: COLORS.yellow }}>#UpTheCeltic</p>
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
          {/* Programme with shadow */}
          <div
            className="relative rounded overflow-hidden"
            style={{
              aspectRatio: '1/1.414',
              maxHeight: 'calc(100vh - 140px)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
            }}
          >
            <div className="absolute inset-0">
              {renderPage()}
            </div>

            {/* Navigation Arrows */}
            {currentPage > 0 && (
              <button
                onClick={prevPage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20 transition-transform hover:scale-110"
                style={{ backgroundColor: 'rgba(30,58,95,0.95)' }}
              >
                <span className="text-lg" style={{ color: COLORS.yellow }}>‹</span>
              </button>
            )}
            {currentPage < totalPages - 1 && (
              <button
                onClick={nextPage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20 transition-transform hover:scale-110"
                style={{ backgroundColor: 'rgba(30,58,95,0.95)' }}
              >
                <span className="text-lg" style={{ color: COLORS.yellow }}>›</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4" style={{ backgroundColor: COLORS.navy }}>
        {/* Page Indicator */}
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
            style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
          >
            Share
          </button>
        </div>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex gap-2">
              <button onClick={shareWhatsApp} className="flex-1 py-2 rounded text-[10px] font-bold" style={{ backgroundColor: '#25D366', color: COLORS.white }}>WhatsApp</button>
              <button onClick={shareTwitter} className="flex-1 py-2 rounded text-[10px] font-bold" style={{ backgroundColor: '#000000', color: COLORS.white }}>X</button>
              <button onClick={copyLink} className="flex-1 py-2 rounded text-[10px] font-bold" style={{ backgroundColor: COLORS.gray, color: COLORS.white }}>Copy Link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
