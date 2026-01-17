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

// ============================================================
// DESIGN SYSTEM - Matching the PDF exactly
// ============================================================

const COLORS = {
  // Primary
  navy: '#1e3a5f',
  navyDark: '#0f2847',
  navyLight: '#2d4a6f',
  yellow: '#f4c430',
  yellowLight: '#fcd34d',

  // Neutrals
  white: '#ffffff',
  offWhite: '#fafafa',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',

  // Accents
  green: '#22c55e',
  red: '#ef4444',
  blue: '#3b82f6',
};

// Shared styles
const cardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
};

const cardStyleElevated = {
  ...cardStyle,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
};

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4">
        <div
          className="w-1.5 rounded-full self-stretch"
          style={{ backgroundColor: COLORS.yellow, minHeight: subtitle ? '48px' : '32px' }}
        />
        <div>
          <h1
            className="text-2xl font-extrabold uppercase tracking-wide"
            style={{ color: COLORS.navy, letterSpacing: '0.02em' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: COLORS.gray500 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div
        className="mt-4 h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${COLORS.yellow} 0%, transparent 100%)` }}
      />
    </div>
  );
}

function SponsorFooter() {
  return (
    <div
      className="mt-auto pt-6"
      style={{ borderTop: `1px solid ${COLORS.gray200}` }}
    >
      <p
        className="text-center text-xs uppercase tracking-widest mb-3"
        style={{ color: COLORS.gray400, letterSpacing: '0.15em' }}
      >
        Principal Partner
      </p>
      <div className="flex items-center justify-center">
        <Image
          src="/images/sponsors/avondale-hire.webp"
          alt="Avondale Vehicle Hire"
          width={140}
          height={50}
          className="object-contain"
        />
      </div>
    </div>
  );
}

function StatBox({ value, label, color = 'navy' }: { value: string | number; label: string; color?: 'navy' | 'yellow' }) {
  return (
    <div
      className="py-4 px-3 rounded-xl text-center"
      style={{
        backgroundColor: color === 'navy' ? COLORS.navy : COLORS.yellow,
      }}
    >
      <p
        className="text-2xl font-black"
        style={{ color: color === 'navy' ? COLORS.yellow : COLORS.navy }}
      >
        {value}
      </p>
      <p
        className="text-[10px] uppercase tracking-wider mt-1 font-semibold"
        style={{ color: color === 'navy' ? 'rgba(255,255,255,0.7)' : COLORS.navy }}
      >
        {label}
      </p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

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
          <p style={{ color: COLORS.gray400 }}>Loading programme...</p>
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
  // PAGE RENDERER
  // ============================================================

  const renderPage = () => {
    switch (pages[currentPage]) {

      // ==================== PAGE 1: COVER ====================
      case 'cover':
        return (
          <div className="h-full relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              {programmeData?.coverImage ? (
                <Image src={programmeData.coverImage} alt="" fill className="object-cover" />
              ) : (
                <Image src="/images/gallery/match-1.jpg" alt="" fill className="object-cover" />
              )}
              {/* Gradient overlay matching PDF */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg,
                    rgba(30,58,95,0.4) 0%,
                    rgba(30,58,95,0.35) 25%,
                    rgba(30,58,95,0.5) 50%,
                    rgba(30,58,95,0.75) 75%,
                    rgba(30,58,95,0.9) 100%
                  )`
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Top badges */}
              <div className="flex justify-between items-start p-5">
                {/* Official Programme Badge */}
                <div
                  className="px-4 py-3 rounded-xl"
                  style={{ backgroundColor: COLORS.yellow }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: COLORS.navy, letterSpacing: '0.1em' }}
                  >
                    Official Match Programme
                  </p>
                  <p
                    className="text-base font-bold mt-0.5"
                    style={{ color: COLORS.navy }}
                  >
                    JD Cymru South
                  </p>
                </div>

                {/* Kickoff Time */}
                <div
                  className="w-24 h-24 rounded-xl flex flex-col items-center justify-center"
                  style={{ backgroundColor: COLORS.yellow }}
                >
                  <p
                    className="text-4xl font-black"
                    style={{ color: COLORS.navy }}
                  >
                    {programmeData?.kickoff || '15:00'}
                  </p>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mt-1"
                    style={{ color: COLORS.navy }}
                  >
                    Kick-Off
                  </p>
                </div>
              </div>

              {/* Center content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                {/* Club crest */}
                <div className="w-36 h-36 mb-8 drop-shadow-2xl">
                  <Image
                    src="/images/club-logo.webp"
                    alt="Cwmbran Celtic"
                    width={144}
                    height={144}
                    className="object-contain"
                  />
                </div>

                {/* Team names */}
                <h1
                  className="text-4xl font-black uppercase tracking-wide"
                  style={{ color: COLORS.white, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
                >
                  Cwmbran Celtic
                </h1>

                <div className="flex items-center gap-4 my-5">
                  <div className="h-0.5 w-16" style={{ backgroundColor: COLORS.yellow }} />
                  <span
                    className="text-xl font-semibold lowercase"
                    style={{ color: COLORS.yellow }}
                  >
                    vs
                  </span>
                  <div className="h-0.5 w-16" style={{ backgroundColor: COLORS.yellow }} />
                </div>

                <h2
                  className="text-3xl font-black uppercase tracking-wide"
                  style={{ color: COLORS.white, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
                >
                  {opposition.name}
                </h2>

                {opposition.nickname && (
                  <p
                    className="text-xl italic mt-3"
                    style={{ color: COLORS.yellow }}
                  >
                    "{opposition.nickname}"
                  </p>
                )}
              </div>

              {/* Bottom bar */}
              <div
                className="flex justify-between items-center px-6 py-5"
                style={{ backgroundColor: 'rgba(15,40,71,0.95)' }}
              >
                <div>
                  <p
                    className="text-[10px] uppercase font-bold tracking-widest mb-1"
                    style={{ color: COLORS.yellow }}
                  >
                    Date
                  </p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.white }}>
                    {formatDate(date)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-[10px] uppercase font-bold tracking-widest mb-1"
                    style={{ color: COLORS.yellow }}
                  >
                    Venue
                  </p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.white }}>
                    Avondale Motor Park Arena
                  </p>
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
          <div className="h-full flex flex-col p-6" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Manager's Notes" />

            {/* Manager card */}
            <div
              className="flex items-start gap-5 p-5 mb-5"
              style={{ ...cardStyleElevated, backgroundColor: COLORS.gray50 }}
            >
              <div
                className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              >
                <Image
                  src="/images/staff/simon-berry.webp"
                  alt="Simon Berry"
                  width={80}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: COLORS.navy }}
                >
                  Simon Berry
                </h2>
                <p className="text-sm" style={{ color: COLORS.gray500 }}>
                  First Team Manager
                </p>
                <span
                  className="inline-block mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: COLORS.gray200, color: COLORS.navy }}
                >
                  Since 2023
                </span>
              </div>
            </div>

            {/* Notes */}
            <div
              className="flex-1 p-5"
              style={cardStyle}
            >
              {notesText.split('\n').map((paragraph, idx) => (
                paragraph.trim() && (
                  <p
                    key={idx}
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: COLORS.gray700 }}
                  >
                    {paragraph}
                  </p>
                )
              ))}
              <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                <p className="text-base font-bold" style={{ color: COLORS.navy }}>
                  Simon Berry
                </p>
                <p className="text-sm" style={{ color: COLORS.gray500 }}>
                  First Team Manager
                </p>
              </div>
            </div>

            <SponsorFooter />
          </div>
        );

      // ==================== PAGE 3: SQUAD ====================
      case 'squad':
        return (
          <div className="h-full flex flex-col p-6" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader
              title="Cwmbran Celtic Squad"
              subtitle="Tick the players in today's starting lineup"
            />

            <div className="flex-1 grid grid-cols-2 gap-5">
              {/* Left column */}
              <div className="space-y-4">
                {/* Goalkeepers */}
                <div style={cardStyle} className="overflow-hidden">
                  <div
                    className="px-4 py-2"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: COLORS.white }}
                    >
                      Goalkeepers
                    </p>
                  </div>
                  <div className="p-3 space-y-2">
                    {goalkeepers.map(p => (
                      <div key={p.squadNo} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded border-2 flex-shrink-0"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                        >
                          {p.squadNo}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.gray700 }}>
                          {p.firstName} {p.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defenders */}
                <div style={cardStyle} className="overflow-hidden">
                  <div
                    className="px-4 py-2"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: COLORS.white }}
                    >
                      Defenders
                    </p>
                  </div>
                  <div className="p-3 space-y-2">
                    {defenders.slice(0, 7).map(p => (
                      <div key={p.squadNo} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded border-2 flex-shrink-0"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                        >
                          {p.squadNo}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.gray700 }}>
                          {p.firstName} {p.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forwards */}
                <div style={cardStyle} className="overflow-hidden">
                  <div
                    className="px-4 py-2"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: COLORS.white }}
                    >
                      Forwards
                    </p>
                  </div>
                  <div className="p-3 space-y-2">
                    {forwards.slice(0, 4).map(p => (
                      <div key={p.squadNo} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded border-2 flex-shrink-0"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                        >
                          {p.squadNo}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.gray700 }}>
                          {p.firstName} {p.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Midfielders */}
                <div style={cardStyle} className="overflow-hidden">
                  <div
                    className="px-4 py-2"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: COLORS.white }}
                    >
                      Midfielders
                    </p>
                  </div>
                  <div className="p-3 space-y-2">
                    {midfielders.slice(0, 10).map(p => (
                      <div key={p.squadNo} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded border-2 flex-shrink-0"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                        >
                          {p.squadNo}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.gray700 }}>
                          {p.firstName} {p.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                <div className="p-4">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: COLORS.gray500 }}
                  >
                    Substitutes
                  </p>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                          style={{ borderColor: COLORS.gray300 }}
                        />
                        <div
                          className="flex-1 h-8 border-b-2"
                          style={{ borderColor: COLORS.gray200 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex justify-between items-center pt-4 mt-4"
              style={{ borderTop: `3px solid ${COLORS.yellow}` }}
            >
              <p className="text-sm font-bold" style={{ color: COLORS.navy }}>
                MANAGER: Simon Berry
              </p>
              <p className="text-sm font-bold" style={{ color: COLORS.yellow }}>
                #UpTheCeltic
              </p>
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
          <div className="h-full flex flex-col p-6" style={{ backgroundColor: COLORS.offWhite }}>
            <div className="text-center mb-6">
              <h1
                className="text-2xl font-extrabold uppercase tracking-wide"
                style={{ color: COLORS.navy }}
              >
                Today's Match
              </h1>
              <div
                className="mt-3 h-0.5 w-32 mx-auto"
                style={{ backgroundColor: COLORS.yellow }}
              />
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Home - Celtic */}
              <div style={cardStyle} className="overflow-hidden flex flex-col">
                <div
                  className="px-4 py-3 text-center"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  <p
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: COLORS.yellow }}
                  >
                    Cwmbran Celtic
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</p>
                </div>
                <div className="p-4 flex-1 space-y-1.5">
                  {startingXIPlayers.map((p) => p && (
                    <div key={p.squadNo} className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                      >
                        {p.squadNo}
                      </span>
                      <span className="text-xs" style={{ color: COLORS.gray700 }}>
                        {p.firstName} {p.lastName}
                        {programmeData?.captain === p.squadNo && (
                          <span className="font-bold" style={{ color: COLORS.yellow }}> (C)</span>
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 mt-2" style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: COLORS.gray400 }}
                    >
                      Substitutes
                    </p>
                    {subsPlayers.length > 0 ? (
                      subsPlayers.map(p => p && (
                        <div key={p.squadNo} className="flex items-center gap-2 mb-1">
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                            style={{ backgroundColor: COLORS.gray100, color: COLORS.navy }}
                          >
                            {p.squadNo}
                          </span>
                          <span className="text-xs" style={{ color: COLORS.gray500 }}>
                            {p.lastName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs" style={{ color: COLORS.gray400 }}>12. ___ 14. ___ 15. ___</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Away - Opposition */}
              <div style={cardStyle} className="overflow-hidden flex flex-col">
                <div
                  className="px-4 py-3 text-center"
                  style={{ backgroundColor: COLORS.gray500 }}
                >
                  <p
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: COLORS.white }}
                  >
                    {opposition.name}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Away</p>
                </div>
                <div className="p-4 flex-1">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-3"
                    style={{ color: COLORS.gray400 }}
                  >
                    Starting XI
                  </p>
                  <div className="space-y-2">
                    {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                      <div key={n} className="flex items-center gap-2">
                        <span
                          className="w-6 text-xs font-bold"
                          style={{ color: COLORS.gray400 }}
                        >
                          {n}
                        </span>
                        <div
                          className="flex-1 border-b-2"
                          style={{ borderColor: COLORS.gray200 }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 mt-3" style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: COLORS.gray400 }}
                    >
                      Substitutes
                    </p>
                    <p className="text-xs" style={{ color: COLORS.gray400 }}>
                      12. ___ 14. ___ 15. ___ 16. ___ 17. ___
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Officials */}
            <div
              className="mt-5 p-4"
              style={{ ...cardStyle, borderTop: `3px solid ${COLORS.yellow}` }}
            >
              <p
                className="text-xs font-bold uppercase text-center tracking-wider mb-4"
                style={{ color: COLORS.gray500 }}
              >
                Match Officials
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs uppercase mb-2" style={{ color: COLORS.gray400 }}>Referee</p>
                  <div className="border-b-2 mx-4" style={{ borderColor: COLORS.gray200 }} />
                </div>
                <div>
                  <p className="text-xs uppercase mb-2" style={{ color: COLORS.gray400 }}>Assistant 1</p>
                  <div className="border-b-2 mx-4" style={{ borderColor: COLORS.gray200 }} />
                </div>
                <div>
                  <p className="text-xs uppercase mb-2" style={{ color: COLORS.gray400 }}>Assistant 2</p>
                  <div className="border-b-2 mx-4" style={{ borderColor: COLORS.gray200 }} />
                </div>
              </div>
            </div>
          </div>
        );

      // ==================== PAGE 5: HISTORY ====================
      case 'history':
        const historyItems = [
          { year: '1925', title: 'The Beginning', text: 'Cwmbran Celtic AFC was founded in 1925, emerging from the proud working-class community of Cwmbran. In an era when the town was still developing around its iron and steel industries, local men came together to form a football club that would represent their community for generations to come.' },
          { year: '1940s', title: 'Post-War Revival', text: 'After the Second World War, the club reformed with renewed vigour. Cwmbran was designated a New Town in 1949, bringing an influx of new residents and supporters. The Celtic became a focal point for community spirit in the growing town.' },
          { year: '2000s', title: 'Rising Through the Ranks', text: 'The 21st century saw Celtic climb the Welsh football pyramid. The club earned promotion to the Welsh Football League and later to Tier 3 of the Cymru Leagues, competing against some of Wales\' most historic clubs.' },
          { year: 'NOW', title: 'The Celtic Today', text: 'Today, Cwmbran Celtic fields men\'s, women\'s and development teams. Playing at the Avondale Motor Park Arena, we remain committed to our founding values: community, passion, and the beautiful game.' },
        ];

        return (
          <div className="h-full flex flex-col p-6" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Our History" subtitle="100 Years of Cwmbran Celtic" />

            <div className="flex-1 space-y-4">
              {historyItems.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="w-16 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: COLORS.yellow }}
                  >
                    <span
                      className="text-xs font-black"
                      style={{ color: COLORS.navy }}
                    >
                      {item.year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-sm font-bold mb-1"
                      style={{ color: COLORS.navy }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[11px] leading-relaxed"
                      style={{ color: COLORS.gray600 }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div
              className="mt-5 p-5 rounded-xl text-center"
              style={{ backgroundColor: COLORS.navy }}
            >
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: COLORS.white }}
              >
                "More than a club - we are a family, a community, a century of shared dreams."
              </p>
              <p
                className="text-xs mt-3 font-semibold"
                style={{ color: COLORS.yellow }}
              >
                Fraternitas in Ludis - Brotherhood in Sport
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                { value: '101', label: 'Years' },
                { value: '3', label: 'Teams' },
                { value: 'Tier 3', label: 'Level' },
                { value: '1', label: 'Community' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center py-3 rounded-xl"
                  style={cardStyle}
                >
                  <p className="text-xl font-black" style={{ color: COLORS.navy }}>{stat.value}</p>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: COLORS.gray500 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // ==================== PAGE 6: VISITORS ====================
      case 'visitors':
        return (
          <div className="h-full flex flex-col p-6" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="Today's Visitors" subtitle={opposition.name} />

            {/* Info card */}
            <div
              className="p-5 mb-5"
              style={cardStyleElevated}
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Club info */}
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ color: COLORS.gray500 }}
                  >
                    Club Information
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: 'Founded', value: opposition.founded },
                      { label: 'Ground', value: opposition.ground },
                      { label: 'Colours', value: opposition.colours },
                      { label: 'Nickname', value: opposition.nickname ? `"${opposition.nickname}"` : 'N/A' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between pb-2"
                        style={{ borderBottom: `1px solid ${COLORS.gray200}` }}
                      >
                        <span className="text-sm" style={{ color: COLORS.gray500 }}>{item.label}</span>
                        <span className="text-sm font-semibold" style={{ color: COLORS.navy }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Head to head */}
                {opposition.headToHead && (
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-4"
                      style={{ color: COLORS.yellow }}
                    >
                      Head to Head Record
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <StatBox value={opposition.headToHead.played} label="Played" />
                      <StatBox value={opposition.headToHead.celticWins} label="Celtic Wins" />
                      <StatBox value={opposition.headToHead.draws} label="Draws" />
                      <StatBox value={opposition.headToHead.oppositionWins} label="Losses" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About Celtic */}
            <div className="p-5" style={cardStyle}>
              <h3
                className="text-base font-bold mb-3"
                style={{ color: COLORS.navy }}
              >
                About Cwmbran Celtic AFC
              </h3>
              <p
                className="text-xs leading-relaxed mb-4"
                style={{ color: COLORS.gray600 }}
              >
                Founded in 1925, Cwmbran Celtic AFC is a community football club based in Cwmbran, South Wales. Playing our home games at the Avondale Motor Park Arena, we compete in the JD Cymru South league. The club is committed to developing local talent and providing football opportunities for players of all ages and abilities.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
                {[
                  { value: '1925', label: 'Founded' },
                  { value: '3', label: 'Teams' },
                  { value: 'Tier 3', label: 'League Level' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-black" style={{ color: COLORS.navy }}>{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: COLORS.gray500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <SponsorFooter />
          </div>
        );

      // ==================== PAGE 7: LEAGUE TABLE ====================
      case 'league-table':
        return (
          <div className="h-full flex flex-col p-6" style={{ backgroundColor: COLORS.offWhite }}>
            <PageHeader title="JD Cymru South Table" />

            <div className="flex-1 overflow-hidden" style={cardStyle}>
              <table className="w-full text-[10px]">
                <thead>
                  <tr style={{ backgroundColor: COLORS.yellow }}>
                    <th className="p-2 text-left font-bold" style={{ color: COLORS.navy }}>Pos</th>
                    <th className="p-2 text-left font-bold" style={{ color: COLORS.navy }}>Club</th>
                    <th className="p-2 text-center font-bold" style={{ color: COLORS.navy }}>P</th>
                    <th className="p-2 text-center font-bold" style={{ color: COLORS.navy }}>W</th>
                    <th className="p-2 text-center font-bold" style={{ color: COLORS.navy }}>D</th>
                    <th className="p-2 text-center font-bold" style={{ color: COLORS.navy }}>L</th>
                    <th className="p-2 text-center font-bold" style={{ color: COLORS.navy }}>GD</th>
                    <th className="p-2 text-center font-bold" style={{ color: COLORS.navy }}>Pts</th>
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
                          backgroundColor: isCeltic ? '#fef9c3' : isOpp ? '#dbeafe' : idx % 2 === 0 ? COLORS.white : COLORS.gray50
                        }}
                      >
                        <td className="p-2 font-bold" style={{ color: COLORS.navy }}>{team.position}</td>
                        <td className="p-2" style={{ color: COLORS.navy, fontWeight: isCeltic || isOpp ? 700 : 400 }}>
                          <span className="flex items-center gap-1">
                            {team.club}
                            {isCeltic && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.yellow }} />}
                            {isOpp && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.navy }} />}
                          </span>
                        </td>
                        <td className="p-2 text-center" style={{ color: COLORS.gray500 }}>{team.played}</td>
                        <td className="p-2 text-center font-semibold" style={{ color: COLORS.gray700 }}>{team.won}</td>
                        <td className="p-2 text-center" style={{ color: COLORS.gray500 }}>{team.drawn}</td>
                        <td className="p-2 text-center" style={{ color: COLORS.gray500 }}>{team.lost}</td>
                        <td
                          className="p-2 text-center font-semibold"
                          style={{ color: team.gd > 0 ? COLORS.green : team.gd < 0 ? COLORS.red : COLORS.gray500 }}
                        >
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>
                        <td className="p-2 text-center font-bold" style={{ color: COLORS.navy }}>{team.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.gray200}` }}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
                <span className="text-xs" style={{ color: COLORS.gray500 }}>Cwmbran Celtic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.navy }} />
                <span className="text-xs" style={{ color: COLORS.gray500 }}>Today's Opposition</span>
              </div>
              <span className="text-xs" style={{ color: COLORS.gray400 }}>Table as of {formatShortDate(date)}</span>
            </div>
          </div>
        );

      // ==================== PAGE 8: RESULTS & FIXTURES ====================
      case 'results-fixtures':
        return (
          <div className="h-full flex flex-col" style={{ backgroundColor: COLORS.offWhite }}>
            {/* Action photo */}
            <div className="h-28 relative">
              {programmeData?.actionImage ? (
                <Image src={programmeData.actionImage} alt="" fill className="object-cover" />
              ) : (
                <Image src="/images/gallery/ground-1.jpg" alt="" fill className="object-cover" />
              )}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(0deg, rgba(250,250,250,1) 0%, transparent 100%)' }}
              />
            </div>

            <div className="flex-1 px-6 pb-6">
              <div className="grid grid-cols-2 gap-5 h-full">
                {/* Recent Results */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-1.5 h-6 rounded-full"
                      style={{ backgroundColor: COLORS.yellow }}
                    />
                    <h2
                      className="text-base font-bold uppercase"
                      style={{ color: COLORS.navy }}
                    >
                      Recent Results
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {recentResults.slice(0, 5).map((r, i) => {
                      const home = r.homeTeam.includes('Cwmbran Celtic');
                      const celticScore = home ? r.homeScore : r.awayScore;
                      const oppScore = home ? r.awayScore : r.homeScore;
                      const res = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={cardStyle}
                        >
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: res === 'W' ? COLORS.green : res === 'L' ? COLORS.red : COLORS.gray400,
                              color: COLORS.white
                            }}
                          >
                            {res}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-semibold truncate"
                              style={{ color: COLORS.navy }}
                            >
                              {home ? r.awayTeam : r.homeTeam}
                            </p>
                            <p className="text-[10px]" style={{ color: COLORS.gray500 }}>
                              {home ? 'Home' : 'Away'} • {formatShortDate(r.date)}
                            </p>
                          </div>
                          <span
                            className="text-lg font-black"
                            style={{ color: COLORS.navy }}
                          >
                            {celticScore}-{oppScore}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Up Next */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-1.5 h-6 rounded-full"
                      style={{ backgroundColor: COLORS.yellow }}
                    />
                    <h2
                      className="text-base font-bold uppercase"
                      style={{ color: COLORS.navy }}
                    >
                      Up Next
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {upcomingFixtures.slice(0, 5).map((f, i) => {
                      const home = f.homeTeam.includes('Cwmbran Celtic');
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={cardStyle}
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-semibold truncate"
                              style={{ color: COLORS.navy }}
                            >
                              {home ? f.awayTeam : f.homeTeam}
                            </p>
                            <p className="text-[10px]" style={{ color: COLORS.gray500 }}>
                              {home ? 'Home' : 'Away'} • {f.time || '15:00'}
                            </p>
                          </div>
                          <span
                            className="px-3 py-2 rounded-lg text-xs font-bold"
                            style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                          >
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
          <div className="h-full flex flex-col p-6" style={{ backgroundColor: COLORS.yellow }}>
            <div className="text-center mb-5">
              <span
                className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
              >
                Support Your Club
              </span>
              <h1
                className="text-4xl font-black mt-4 uppercase"
                style={{ color: COLORS.navy }}
              >
                Celtic Bond
              </h1>
              <p
                className="text-lg font-semibold mt-1"
                style={{ color: COLORS.navy }}
              >
                Help Build Our Future
              </p>
            </div>

            {/* Description */}
            <div
              className="p-5 mb-4 rounded-xl"
              style={{ backgroundColor: COLORS.white }}
            >
              <h3
                className="text-sm font-bold uppercase tracking-wide mb-3"
                style={{ color: COLORS.navy }}
              >
                What is the Celtic Bond?
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: COLORS.gray600 }}
              >
                The Celtic Bond is a monthly lottery that helps fund essential club improvements and community projects. For just £5 per month, you could win cash prizes while supporting your local football club.
              </p>
            </div>

            {/* Prizes */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { amount: '£100', label: '1st Prize' },
                { amount: '£50', label: '2nd Prize' },
                { amount: '£25', label: '3rd Prize' },
              ].map((prize, i) => (
                <div
                  key={i}
                  className="py-5 rounded-xl text-center"
                  style={{ backgroundColor: COLORS.blue }}
                >
                  <p
                    className="text-3xl font-black"
                    style={{ color: COLORS.yellow }}
                  >
                    {prize.amount}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-wider mt-1"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    {prize.label}
                  </p>
                </div>
              ))}
            </div>

            {/* What it funds */}
            <div
              className="p-5 mb-4 rounded-xl"
              style={{ backgroundColor: COLORS.white }}
            >
              <h3
                className="text-sm font-bold uppercase tracking-wide mb-3"
                style={{ color: COLORS.navy }}
              >
                Your Support Helps Fund:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['Pitch maintenance', 'Youth development', 'Kit & equipment', 'Ground improvements'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: COLORS.green, color: COLORS.white }}
                    >
                      ✓
                    </span>
                    <span className="text-sm" style={{ color: COLORS.navy }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to join */}
            <div
              className="p-5 rounded-xl"
              style={{ backgroundColor: COLORS.navy }}
            >
              <h3
                className="text-sm font-bold uppercase tracking-wide mb-3"
                style={{ color: COLORS.yellow }}
              >
                How to Join
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: COLORS.white }}
              >
                Sign up online at <span className="font-bold">cwmbranceltic.com/celtic-bond</span> or speak to a committee member on match day.
              </p>
              <div
                className="flex justify-between items-center p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div>
                  <p className="text-2xl font-black" style={{ color: COLORS.yellow }}>Only £5</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>per month</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold" style={{ color: COLORS.white }}>Monthly Draw</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Results on social media</p>
                </div>
              </div>
            </div>

            <div className="mt-auto text-center pt-4">
              <p className="text-sm font-bold" style={{ color: COLORS.navy }}>
                Thank you to all our Celtic Bond members!
              </p>
              <p className="text-lg font-black mt-1" style={{ color: COLORS.navy }}>
                #UpTheCeltic
              </p>
            </div>
          </div>
        );

      // ==================== PAGE 10: BACK COVER ====================
      case 'back-cover':
        return (
          <div
            className="h-full flex flex-col"
            style={{ background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` }}
          >
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              {/* Crest */}
              <div className="w-28 h-28 mb-6">
                <Image
                  src="/images/club-logo.webp"
                  alt="Cwmbran Celtic"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>

              <h1
                className="text-3xl font-black uppercase tracking-wide"
                style={{ color: COLORS.white }}
              >
                Cwmbran Celtic AFC
              </h1>
              <p
                className="text-base mt-2"
                style={{ color: COLORS.yellow }}
              >
                Established 1925
              </p>

              {/* Info columns */}
              <div className="grid grid-cols-2 gap-10 text-left mt-10 w-full max-w-xs">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: COLORS.yellow }}
                  >
                    Our Ground
                  </p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.white }}>
                    Avondale Motor Park Arena
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Henllys Way
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Cwmbran
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    NP44 3FS
                  </p>

                  <p
                    className="text-xs font-bold uppercase tracking-widest mt-5 mb-2"
                    style={{ color: COLORS.yellow }}
                  >
                    Contact
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    cwmbrancelticfc@gmail.com
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: COLORS.yellow }}
                  >
                    Admission Prices
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: 'Adults', value: '£5' },
                      { label: 'Concessions', value: '£3' },
                      { label: 'Under 16s', value: 'FREE', highlight: true },
                      { label: 'Programme', value: '£2' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: item.highlight ? COLORS.yellow : COLORS.white }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p
                    className="text-xs font-bold uppercase tracking-widest mt-5 mb-2"
                    style={{ color: COLORS.yellow }}
                  >
                    Follow Us
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    @cwmbranceltic
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    cwmbranceltic.com
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="p-5 text-center"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Thank you for supporting Cwmbran Celtic AFC
              </p>
              <p
                className="text-2xl font-black mt-2"
                style={{ color: COLORS.yellow }}
              >
                #UpTheCeltic
              </p>
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
            className="relative rounded-xl overflow-hidden"
            style={{
              aspectRatio: '1/1.414',
              maxHeight: 'calc(100vh - 140px)',
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.7)',
            }}
          >
            <div className="absolute inset-0 bg-white">
              {renderPage()}
            </div>

            {/* Navigation arrows */}
            {currentPage > 0 && (
              <button
                onClick={prevPage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-20 transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(30,58,95,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                <span className="text-xl" style={{ color: COLORS.yellow }}>‹</span>
              </button>
            )}
            {currentPage < totalPages - 1 && (
              <button
                onClick={nextPage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-20 transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(30,58,95,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                <span className="text-xl" style={{ color: COLORS.yellow }}>›</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-5" style={{ backgroundColor: COLORS.navy }}>
        {/* Page dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
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
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
          >
            Share
          </button>
        </div>

        {/* Share menu */}
        {showShareMenu && (
          <div
            className="mt-4 p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="flex gap-2">
              <button
                onClick={shareWhatsApp}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors"
                style={{ backgroundColor: '#25D366', color: COLORS.white }}
              >
                WhatsApp
              </button>
              <button
                onClick={shareTwitter}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors"
                style={{ backgroundColor: '#000000', color: COLORS.white }}
              >
                X
              </button>
              <button
                onClick={copyLink}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors"
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
