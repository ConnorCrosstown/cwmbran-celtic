'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOppositionById } from '@/data/opposition-data';
import { mockSquad, mockLeagueTable, mockResults, mockFixtures, clubInfo, sponsors } from '@/data/mock-data';

export default function ShareableProgrammePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Parse slug: format is "YYYY-MM-DD-opponent-id"
  const parts = slug?.split('-') || [];
  const date = parts.slice(0, 3).join('-');
  const opponentId = parts.slice(3).join('-');

  const opposition = getOppositionById(opponentId);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Squad groups
  const goalkeepers = mockSquad.results.filter(p => p.position === 'Goalkeeper');
  const defenders = mockSquad.results.filter(p => p.position.includes('Back'));
  const midfielders = mockSquad.results.filter(p => p.position.includes('Midfield') || p.position.includes('Wing'));
  const forwards = mockSquad.results.filter(p => p.position === 'Striker' || p.position === 'Forward');

  // Results & fixtures
  const recentResults = mockResults.results
    .filter(r => (r.homeTeam.includes('Cwmbran Celtic') || r.awayTeam.includes('Cwmbran Celtic')) && !r.homeTeam.includes('Ladies'))
    .slice(0, 5);

  const upcomingFixtures = mockFixtures.results
    .filter(f => !f.homeTeam.includes('Ladies'))
    .slice(0, 5);

  // Share functions
  const shareWhatsApp = () => {
    const text = `Match day programme: Cwmbran Celtic vs ${opposition?.name}! 🔵🟡`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `Match day programme: Cwmbran Celtic vs ${opposition?.name}! #UpTheCeltic`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowShareMenu(false);
    alert('Link copied!');
  };

  // Pages array
  const pages = [
    'cover',
    'managers-notes',
    'squad',
    'todays-match',
    'history',
    'opposition',
    'league-table',
    'form-guide',
    'celtic-bond',
    'back-cover'
  ];

  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!opposition) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>Programme Not Found</h1>
          <Link href="/" className="underline" style={{ color: '#facc15' }}>Return to Homepage</Link>
        </div>
      </div>
    );
  }

  // Page content components
  const renderPage = () => {
    switch (pages[currentPage]) {
      case 'cover':
        return (
          <div className="h-full flex flex-col justify-between p-6 text-center relative" style={{ backgroundColor: '#1e3a8a' }}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: '#facc15' }}>Official Match Programme</p>
              <p className="text-xs font-semibold" style={{ color: '#ffffff' }}>JD Cymru South</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-24 h-24 relative mb-4">
                <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" fill className="object-contain" />
              </div>
              <h1 className="text-2xl font-black mb-2" style={{ color: '#ffffff' }}>CWMBRAN CELTIC</h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-0.5 w-8" style={{ backgroundColor: '#facc15' }} />
                <span className="text-lg font-bold" style={{ color: '#facc15' }}>VS</span>
                <div className="h-0.5 w-8" style={{ backgroundColor: '#facc15' }} />
              </div>
              <h2 className="text-xl font-black" style={{ color: '#ffffff' }}>{opposition.name.toUpperCase()}</h2>
              {opposition.nickname && (
                <p className="text-sm italic mt-1" style={{ color: '#facc15' }}>&ldquo;{opposition.nickname}&rdquo;</p>
              )}
            </div>

            <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <p className="text-xs" style={{ color: '#ffffff' }}>{formatDate(date)}</p>
              <p className="text-xl font-black" style={{ color: '#facc15' }}>15:00</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Avondale Motor Park Arena</p>
            </div>
          </div>
        );

      case 'managers-notes':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-lg font-black mb-3 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>MANAGER&apos;S NOTES</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2" style={{ borderColor: '#1e3a8a' }}>
                <Image src="/images/staff/simon-berry.webp" alt="Simon Berry" width={56} height={56} className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#0f172a' }}>Simon Berry</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>First Team Manager</p>
              </div>
            </div>
            <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: '#f3f4f6' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                Good afternoon and welcome to the Avondale Motor Park Arena for today&apos;s fixture against {opposition.name}.
              </p>
              <p className="text-xs leading-relaxed mt-3" style={{ color: '#374151' }}>
                Thank you for your continued support - it means the world to everyone at the club. The lads have been working hard in training and we&apos;re looking forward to putting on a performance for you today.
              </p>
              <p className="text-xs leading-relaxed mt-3" style={{ color: '#374151' }}>
                Enjoy the game!
              </p>
              <p className="text-xs mt-4 font-semibold" style={{ color: '#1e3a8a' }}>Simon Berry</p>
            </div>
          </div>
        );

      case 'squad':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-lg font-black mb-3 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>CELTIC SQUAD</h2>
            <div className="flex-1 grid grid-cols-2 gap-3 text-[10px]">
              <div>
                <p className="font-bold px-1 py-0.5 rounded mb-1" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>GOALKEEPERS</p>
                {goalkeepers.slice(0, 2).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-1 py-0.5">
                    <span className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
                <p className="font-bold px-1 py-0.5 rounded mt-2 mb-1" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>DEFENDERS</p>
                {defenders.slice(0, 5).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-1 py-0.5">
                    <span className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold px-1 py-0.5 rounded mb-1" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>MIDFIELDERS</p>
                {midfielders.slice(0, 6).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-1 py-0.5">
                    <span className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
                <p className="font-bold px-1 py-0.5 rounded mt-2 mb-1" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>FORWARDS</p>
                {forwards.slice(0, 4).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-1 py-0.5">
                    <span className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 p-2 rounded" style={{ backgroundColor: '#0f172a' }}>
              <div className="flex justify-between items-center text-[10px]">
                <span style={{ color: '#facc15' }}>Manager: Simon Berry</span>
                <span style={{ color: '#facc15' }}>#UpTheCeltic</span>
              </div>
            </div>
          </div>
        );

      case 'todays-match':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-lg font-black mb-3 pb-2 border-b-4 text-center" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>TODAY&apos;S MATCH</h2>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1e3a8a' }}>
                <div className="p-2 text-center" style={{ backgroundColor: '#0f172a' }}>
                  <p className="font-bold text-xs" style={{ color: '#facc15' }}>CWMBRAN CELTIC</p>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</p>
                </div>
                <div className="p-2 text-[9px]" style={{ color: '#ffffff' }}>
                  {[...goalkeepers.slice(0, 1), ...defenders.slice(0, 4), ...midfielders.slice(0, 4), ...forwards.slice(0, 2)].map((p, i) => (
                    <div key={p.squadNo} className="flex items-center gap-1 py-0.5">
                      <span className="w-3 h-3 rounded flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: '#facc15', color: '#0f172a' }}>{p.squadNo}</span>
                      <span>{p.firstName} {p.lastName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                <div className="p-2 text-center" style={{ backgroundColor: '#374151' }}>
                  <p className="font-bold text-xs" style={{ color: '#ffffff' }}>{opposition.name.toUpperCase()}</p>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Away</p>
                </div>
                <div className="p-2 text-[9px]" style={{ color: '#6b7280' }}>
                  {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                    <div key={n} className="flex items-center gap-1 py-0.5">
                      <span className="w-3 h-3 rounded flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: '#d1d5db', color: '#4b5563' }}>{n}</span>
                      <span>_______________</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 p-2 rounded text-center" style={{ backgroundColor: '#f3f4f6' }}>
              <p className="text-[9px] font-semibold" style={{ color: '#6b7280' }}>REFEREE: ____________</p>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#facc15' }}>
            <h2 className="text-lg font-black mb-3 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>OUR HISTORY</h2>
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>1925</div>
                <div className="flex-1">
                  <p className="font-bold text-xs" style={{ color: '#0f172a' }}>Founded</p>
                  <p className="text-[10px]" style={{ color: '#374151' }}>Cwmbran Celtic AFC was born in the heart of our working-class community.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[9px]" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>1949</div>
                <div className="flex-1">
                  <p className="font-bold text-xs" style={{ color: '#0f172a' }}>New Town Era</p>
                  <p className="text-[10px]" style={{ color: '#374151' }}>Cwmbran designated a New Town, bringing new supporters and growth.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[9px]" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>NOW</div>
                <div className="flex-1">
                  <p className="font-bold text-xs" style={{ color: '#0f172a' }}>The Celtic Today</p>
                  <p className="text-[10px]" style={{ color: '#374151' }}>Competing in Tier 3 with men&apos;s, women&apos;s and development teams.</p>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#1e3a8a' }}>
              <p className="text-xs italic text-center" style={{ color: '#ffffff' }}>&ldquo;More than a club - we are a family.&rdquo;</p>
              <p className="text-[10px] text-center mt-1" style={{ color: '#facc15' }}>Fraternitas in Ludis</p>
            </div>
          </div>
        );

      case 'opposition':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#1e3a8a' }}>
            <h2 className="text-lg font-black mb-2" style={{ color: '#ffffff' }}>TODAY&apos;S VISITORS</h2>
            <p className="text-sm font-semibold mb-3" style={{ color: '#facc15' }}>{opposition.name}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Founded</p>
                <p className="text-sm font-bold" style={{ color: '#ffffff' }}>{opposition.founded}</p>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Ground</p>
                <p className="text-xs font-bold" style={{ color: '#ffffff' }}>{opposition.ground}</p>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Colours</p>
                <p className="text-xs font-bold" style={{ color: '#ffffff' }}>{opposition.colours}</p>
              </div>
              {opposition.nickname && (
                <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Nickname</p>
                  <p className="text-xs font-bold" style={{ color: '#ffffff' }}>&ldquo;{opposition.nickname}&rdquo;</p>
                </div>
              )}
            </div>
            {opposition.headToHead && (
              <div>
                <p className="text-[10px] font-bold uppercase mb-2" style={{ color: '#facc15' }}>Head to Head</p>
                <div className="grid grid-cols-4 gap-1">
                  <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <p className="text-lg font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.played}</p>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Played</p>
                  </div>
                  <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(34,197,94,0.4)' }}>
                    <p className="text-lg font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.celticWins}</p>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Wins</p>
                  </div>
                  <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <p className="text-lg font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.draws}</p>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Draws</p>
                  </div>
                  <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(239,68,68,0.4)' }}>
                    <p className="text-lg font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.oppositionWins}</p>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Losses</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'league-table':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-lg font-black mb-3 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>LEAGUE TABLE</h2>
            <div className="flex-1 overflow-hidden">
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>
                    <th className="p-1 text-left">#</th>
                    <th className="p-1 text-left">Club</th>
                    <th className="p-1 text-center">P</th>
                    <th className="p-1 text-center">GD</th>
                    <th className="p-1 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeagueTable.results.slice(0, 12).map((team) => {
                    const isCeltic = team.club === 'Cwmbran Celtic';
                    const isOpp = team.club === opposition.name;
                    return (
                      <tr key={team.club} style={{ backgroundColor: isCeltic ? '#fef3c7' : isOpp ? '#dbeafe' : '' }}>
                        <td className="p-1 font-bold">{team.position}</td>
                        <td className="p-1" style={{ fontWeight: isCeltic || isOpp ? 700 : 400 }}>{team.club}</td>
                        <td className="p-1 text-center">{team.played}</td>
                        <td className="p-1 text-center">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                        <td className="p-1 text-center font-bold">{team.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'form-guide':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-lg font-black mb-3 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>FORM GUIDE</h2>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase mb-2" style={{ color: '#6b7280' }}>Recent Results</p>
                {recentResults.slice(0, 4).map((r, i) => {
                  const home = r.homeTeam.includes('Cwmbran Celtic');
                  const celticScore = home ? r.homeScore : r.awayScore;
                  const oppScore = home ? r.awayScore : r.homeScore;
                  const res = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';
                  return (
                    <div key={i} className="flex items-center gap-2 p-1.5 rounded mb-1" style={{ backgroundColor: '#f3f4f6' }}>
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: res === 'W' ? '#22c55e' : res === 'L' ? '#ef4444' : '#9ca3af', color: '#fff' }}>{res}</span>
                      <span className="flex-1 text-[10px]" style={{ color: '#111827' }}>{home ? r.awayTeam : r.homeTeam}</span>
                      <span className="text-xs font-bold" style={{ color: '#111827' }}>{celticScore}-{oppScore}</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase mb-2" style={{ color: '#6b7280' }}>Up Next</p>
                {upcomingFixtures.slice(0, 3).map((f, i) => {
                  const home = f.homeTeam.includes('Cwmbran Celtic');
                  const d = new Date(f.date);
                  return (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded mb-1" style={{ backgroundColor: '#f3f4f6' }}>
                      <span className="text-[10px]" style={{ color: '#111827' }}>{home ? f.awayTeam : f.homeTeam}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: '#1e3a8a', color: '#fff' }}>{d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'celtic-bond':
        return (
          <div className="h-full flex flex-col p-5" style={{ backgroundColor: '#facc15' }}>
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-1 rounded-full mb-2" style={{ backgroundColor: '#1e3a8a' }}>
                <p className="text-[10px] uppercase font-bold" style={{ color: '#ffffff' }}>Support Your Club</p>
              </div>
              <h2 className="text-2xl font-black" style={{ color: '#1e3a8a' }}>CELTIC BOND</h2>
            </div>
            <div className="flex-1 space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <p className="text-xs" style={{ color: '#374151' }}>
                  Join our monthly lottery for just £5 and help fund club improvements while winning cash prizes!
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded text-center" style={{ backgroundColor: '#1e3a8a' }}>
                  <p className="text-xl font-black" style={{ color: '#ffffff' }}>£100</p>
                  <p className="text-[9px]" style={{ color: '#facc15' }}>1st Prize</p>
                </div>
                <div className="p-2 rounded text-center" style={{ backgroundColor: '#2563eb' }}>
                  <p className="text-lg font-black" style={{ color: '#ffffff' }}>£50</p>
                  <p className="text-[9px]" style={{ color: '#facc15' }}>2nd Prize</p>
                </div>
                <div className="p-2 rounded text-center" style={{ backgroundColor: '#3b82f6' }}>
                  <p className="text-lg font-black" style={{ color: '#ffffff' }}>£25</p>
                  <p className="text-[9px]" style={{ color: '#facc15' }}>3rd Prize</p>
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#1e3a8a' }}>
                <p className="text-xs text-center" style={{ color: '#ffffff' }}>
                  Sign up at <span style={{ color: '#facc15' }}>cwmbranceltic.com/celtic-bond</span>
                </p>
              </div>
            </div>
          </div>
        );

      case 'back-cover':
        return (
          <div className="h-full flex flex-col p-5 text-center" style={{ backgroundColor: '#0f172a' }}>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 relative mb-4">
                <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" fill className="object-contain" />
              </div>
              <h2 className="text-xl font-black mb-1" style={{ color: '#ffffff' }}>CWMBRAN CELTIC AFC</h2>
              <p className="text-xs mb-4" style={{ color: '#facc15' }}>Established 1925</p>

              <div className="text-xs space-y-1 mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <p>Avondale Motor Park Arena</p>
                <p>Henllys Way, Cwmbran</p>
                <p>NP44 3FS</p>
              </div>

              <div className="text-xs mb-4" style={{ color: '#ffffff' }}>
                <p>@cwmbranceltic</p>
                <p>cwmbranceltic.com</p>
              </div>

              <p className="text-lg font-black" style={{ color: '#facc15' }}>#UpTheCeltic</p>
            </div>

            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <p>Thank you for supporting Cwmbran Celtic AFC</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#111827' }}>
      {/* Programme Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-sm shadow-2xl rounded-lg overflow-hidden"
          style={{
            aspectRatio: '1/1.414',
            maxHeight: 'calc(100vh - 120px)'
          }}
        >
          {/* Page Content */}
          <div className="absolute inset-0">
            {renderPage()}
          </div>

          {/* Page Navigation Arrows */}
          {currentPage > 0 && (
            <button
              onClick={prevPage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <span style={{ color: '#ffffff', fontSize: '18px' }}>‹</span>
            </button>
          )}
          {currentPage < totalPages - 1 && (
            <button
              onClick={nextPage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <span style={{ color: '#ffffff', fontSize: '18px' }}>›</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4" style={{ backgroundColor: '#0f172a' }}>
        {/* Page Indicator */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: i === currentPage ? '#facc15' : 'rgba(255,255,255,0.3)',
                transform: i === currentPage ? 'scale(1.3)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Share & Home */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            cwmbranceltic.com
          </Link>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Page {currentPage + 1} of {totalPages}
          </p>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="px-3 py-1 rounded text-xs font-semibold"
            style={{ backgroundColor: '#facc15', color: '#0f172a' }}
          >
            Share
          </button>
        </div>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#1e293b' }}>
            <div className="flex gap-2">
              <button onClick={shareWhatsApp} className="flex-1 py-2 rounded text-xs font-semibold" style={{ backgroundColor: '#25D366', color: '#ffffff' }}>WhatsApp</button>
              <button onClick={shareTwitter} className="flex-1 py-2 rounded text-xs font-semibold" style={{ backgroundColor: '#1DA1F2', color: '#ffffff' }}>Twitter</button>
              <button onClick={copyLink} className="flex-1 py-2 rounded text-xs font-semibold" style={{ backgroundColor: '#6b7280', color: '#ffffff' }}>Copy Link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
