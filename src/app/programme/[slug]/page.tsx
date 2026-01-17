'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOppositionById, oppositionTeams } from '@/data/opposition-data';
import { mockSquad, mockLeagueTable, mockResults, mockFixtures, clubInfo, sponsors } from '@/data/mock-data';

export default function ShareableProgrammePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [shareUrl, setShareUrl] = useState('');

  // Parse slug: format is "YYYY-MM-DD-opponent-id"
  const parts = slug?.split('-') || [];
  const date = parts.slice(0, 3).join('-'); // "2026-01-24"
  const opponentId = parts.slice(3).join('-'); // "pontypridd-united"

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

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // Share functions
  const shareWhatsApp = () => {
    const text = `Check out the match day programme for Cwmbran Celtic vs ${opposition?.name || 'our opponents'}! 🔵🟡`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `Match day programme for Cwmbran Celtic vs ${opposition?.name || 'our opponents'}! #UpTheCeltic 🔵🟡`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
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
  const defenders = mockSquad.results.filter(p => p.position.includes('Back'));
  const midfielders = mockSquad.results.filter(p => p.position.includes('Midfield') || p.position.includes('Wing'));
  const forwards = mockSquad.results.filter(p => p.position === 'Striker' || p.position === 'Forward');

  if (!opposition) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Programme Not Found</h1>
          <p className="text-gray-600 mb-4">This programme doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="text-celtic-blue hover:underline">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e3a8a' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#0f172a' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" fill className="object-contain" />
            </div>
            <span className="font-bold text-sm" style={{ color: '#ffffff' }}>Cwmbran Celtic</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={shareWhatsApp}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: '#25D366' }}
              title="Share on WhatsApp"
            >
              <span className="text-white text-lg">📱</span>
            </button>
            <button
              onClick={shareTwitter}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: '#1DA1F2' }}
              title="Share on Twitter"
            >
              <span className="text-white text-lg">𝕏</span>
            </button>
            <button
              onClick={shareFacebook}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: '#4267B2' }}
              title="Share on Facebook"
            >
              <span className="text-white text-lg">f</span>
            </button>
            <button
              onClick={copyLink}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: '#6b7280' }}
              title="Copy Link"
            >
              <span className="text-white text-lg">🔗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Programme Content - Scrollable */}
      <div className="max-w-lg mx-auto pb-20">

        {/* Cover Section */}
        <section className="min-h-screen flex flex-col justify-center p-6 text-center relative">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#facc15' }}>Official Match Programme</p>
            <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>JD Cymru South</p>
          </div>

          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" fill className="object-contain" />
          </div>

          <h1 className="text-3xl font-black mb-4" style={{ color: '#ffffff' }}>CWMBRAN CELTIC</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-12" style={{ backgroundColor: '#facc15' }} />
            <span className="text-xl font-bold" style={{ color: '#facc15' }}>VS</span>
            <div className="h-0.5 w-12" style={{ backgroundColor: '#facc15' }} />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#ffffff' }}>{opposition.name.toUpperCase()}</h2>
          {opposition.nickname && (
            <p className="italic" style={{ color: '#facc15' }}>&ldquo;{opposition.nickname}&rdquo;</p>
          )}

          <div className="mt-8 rounded-lg p-4" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <p className="text-sm" style={{ color: '#ffffff' }}>{formatDate(date)}</p>
            <p className="text-2xl font-black mt-1" style={{ color: '#facc15' }}>15:00 KICK-OFF</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Avondale Motor Park Arena</p>
          </div>

          <div className="mt-8 animate-bounce">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Scroll down ↓</p>
          </div>
        </section>

        {/* Squad Section */}
        <section className="p-6" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-xl font-black mb-4 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>
            CELTIC SQUAD
          </h2>

          <div className="space-y-4">
            {/* Goalkeepers */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>Goalkeepers</h3>
              <div className="space-y-1">
                {goalkeepers.slice(0, 2).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-2 px-2 py-1" style={{ backgroundColor: '#f3f4f6' }}>
                    <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span className="text-sm" style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Defenders */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>Defenders</h3>
              <div className="space-y-1">
                {defenders.slice(0, 5).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-2 px-2 py-1" style={{ backgroundColor: '#f3f4f6' }}>
                    <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span className="text-sm" style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Midfielders */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>Midfielders</h3>
              <div className="space-y-1">
                {midfielders.slice(0, 6).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-2 px-2 py-1" style={{ backgroundColor: '#f3f4f6' }}>
                    <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span className="text-sm" style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forwards */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>Forwards</h3>
              <div className="space-y-1">
                {forwards.slice(0, 4).map(p => (
                  <div key={p.squadNo} className="flex items-center gap-2 px-2 py-1" style={{ backgroundColor: '#f3f4f6' }}>
                    <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>{p.squadNo}</span>
                    <span className="text-sm" style={{ color: '#111827' }}>{p.firstName} {p.lastName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#0f172a' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: '#facc15' }}>MANAGER:</span>
                <span className="text-xs" style={{ color: '#ffffff' }}>Simon Berry</span>
              </div>
              <span className="text-xs font-bold" style={{ color: '#facc15' }}>#UpTheCeltic</span>
            </div>
          </div>
        </section>

        {/* Opposition Section */}
        <section className="p-6" style={{ backgroundColor: '#1e3a8a' }}>
          <h2 className="text-xl font-black mb-4 pb-2 border-b-4" style={{ color: '#ffffff', borderColor: '#facc15' }}>
            TODAY&apos;S VISITORS
          </h2>
          <p className="text-lg font-semibold mb-4" style={{ color: '#facc15' }}>{opposition.name}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Founded</p>
              <p className="font-bold" style={{ color: '#ffffff' }}>{opposition.founded}</p>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Ground</p>
              <p className="font-bold text-sm" style={{ color: '#ffffff' }}>{opposition.ground}</p>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Colours</p>
              <p className="font-bold" style={{ color: '#ffffff' }}>{opposition.colours}</p>
            </div>
            {opposition.nickname && (
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Nickname</p>
                <p className="font-bold" style={{ color: '#ffffff' }}>&ldquo;{opposition.nickname}&rdquo;</p>
              </div>
            )}
          </div>

          {opposition.headToHead && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#facc15' }}>Head to Head</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-xl font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.played}</p>
                  <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Played</p>
                </div>
                <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(34,197,94,0.4)' }}>
                  <p className="text-xl font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.celticWins}</p>
                  <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Wins</p>
                </div>
                <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-xl font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.draws}</p>
                  <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Draws</p>
                </div>
                <div className="p-2 rounded text-center" style={{ backgroundColor: 'rgba(239,68,68,0.4)' }}>
                  <p className="text-xl font-black" style={{ color: '#ffffff' }}>{opposition.headToHead.oppositionWins}</p>
                  <p className="text-[9px] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Losses</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Results & Fixtures */}
        <section className="p-6" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-xl font-black mb-4 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>
            FORM GUIDE
          </h2>

          {/* Recent Results */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Recent Results</p>
            <div className="space-y-2">
              {recentResults.map((result, idx) => {
                const isCelticHome = result.homeTeam.includes('Cwmbran Celtic');
                const celticScore = isCelticHome ? result.homeScore : result.awayScore;
                const oppScore = isCelticHome ? result.awayScore : result.homeScore;
                const opponent = isCelticHome ? result.awayTeam : result.homeTeam;
                const resultType = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';

                return (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                    <span
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: resultType === 'W' ? '#22c55e' : resultType === 'L' ? '#ef4444' : '#9ca3af',
                        color: '#ffffff'
                      }}
                    >
                      {resultType}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: '#111827' }}>{opponent}</p>
                      <p className="text-xs" style={{ color: '#6b7280' }}>{isCelticHome ? 'H' : 'A'}</p>
                    </div>
                    <span className="font-bold" style={{ color: '#111827' }}>{celticScore}-{oppScore}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Up Next</p>
            <div className="space-y-2">
              {upcomingFixtures.slice(0, 3).map((fixture, idx) => {
                const isCelticHome = fixture.homeTeam.includes('Cwmbran Celtic');
                const opponent = isCelticHome ? fixture.awayTeam : fixture.homeTeam;
                const d = new Date(fixture.date);

                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#111827' }}>{opponent}</p>
                      <p className="text-xs" style={{ color: '#6b7280' }}>{isCelticHome ? 'Home' : 'Away'} • {fixture.time}</p>
                    </div>
                    <div className="px-2 py-1 rounded text-center" style={{ backgroundColor: '#1e3a8a' }}>
                      <p className="text-xs font-bold" style={{ color: '#ffffff' }}>{formatShortDate(fixture.date as unknown as string)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Club History */}
        <section className="p-6" style={{ backgroundColor: '#facc15' }}>
          <h2 className="text-xl font-black mb-4 pb-2 border-b-4" style={{ color: '#0f172a', borderColor: '#1e3a8a' }}>
            OUR HISTORY
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151' }}>
            Founded in 1925, Cwmbran Celtic AFC has been at the heart of our community for {new Date().getFullYear() - 1925} years.
            From humble beginnings in the working-class town of Cwmbran, through the post-war years when our town became
            a New Town in 1949, to competing in the third tier of Welsh football today.
          </p>
          <div className="p-4 rounded" style={{ backgroundColor: '#1e3a8a' }}>
            <p className="text-sm italic text-center" style={{ color: '#ffffff' }}>
              &ldquo;More than a club - we are a family, a community, a century of shared dreams.&rdquo;
            </p>
            <p className="text-xs text-center mt-2" style={{ color: '#facc15' }}>
              Fraternitas in Ludis - Brotherhood in Sport
            </p>
          </div>
        </section>

        {/* Celtic Bond */}
        <section className="p-6" style={{ backgroundColor: '#1e3a8a' }}>
          <h2 className="text-xl font-black mb-2" style={{ color: '#facc15' }}>CELTIC BOND</h2>
          <p className="text-sm mb-4" style={{ color: '#ffffff' }}>
            Support your club and win cash prizes! Join our monthly lottery for just £5.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-3 rounded text-center" style={{ backgroundColor: '#0f172a' }}>
              <p className="text-xl font-black" style={{ color: '#ffffff' }}>£100</p>
              <p className="text-[10px]" style={{ color: '#facc15' }}>1st Prize</p>
            </div>
            <div className="p-3 rounded text-center" style={{ backgroundColor: '#0f172a' }}>
              <p className="text-lg font-black" style={{ color: '#ffffff' }}>£50</p>
              <p className="text-[10px]" style={{ color: '#facc15' }}>2nd Prize</p>
            </div>
            <div className="p-3 rounded text-center" style={{ backgroundColor: '#0f172a' }}>
              <p className="text-lg font-black" style={{ color: '#ffffff' }}>£25</p>
              <p className="text-[10px]" style={{ color: '#facc15' }}>3rd Prize</p>
            </div>
          </div>
          <Link
            href="/celtic-bond"
            className="block w-full text-center py-3 rounded font-bold text-sm"
            style={{ backgroundColor: '#facc15', color: '#0f172a' }}
          >
            Join the Celtic Bond
          </Link>
        </section>

        {/* Footer */}
        <section className="p-6 text-center" style={{ backgroundColor: '#0f172a' }}>
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" fill className="object-contain" />
          </div>
          <p className="font-bold mb-1" style={{ color: '#ffffff' }}>Cwmbran Celtic AFC</p>
          <p className="text-xs mb-4" style={{ color: '#facc15' }}>Established 1925</p>

          <div className="text-xs space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <p>Avondale Motor Park Arena</p>
            <p>Henllys Way, Cwmbran, NP44 3FS</p>
            <p className="mt-2">@cwmbranceltic</p>
          </div>

          <p className="mt-6 text-lg font-bold" style={{ color: '#facc15' }}>#UpTheCeltic</p>
        </section>

      </div>
    </div>
  );
}
