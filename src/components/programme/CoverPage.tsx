'use client';

import Image from 'next/image';

interface CoverPageProps {
  uploadedCover?: string; // Full cover image upload - if provided, shows this instead of generated design
  opposition?: {
    name: string;
    nickname?: string;
  };
  date?: string;
  kickoff?: string;
  coverImage?: string; // Action photo for generated design
  forPrint?: boolean;
}

export default function CoverPage({ uploadedCover, opposition, date, kickoff, coverImage, forPrint = false }: CoverPageProps) {
  // If an uploaded cover is provided, just display it full-page
  if (uploadedCover) {
    if (forPrint) {
      return (
        <div style={{
          width: 794,
          height: 1123,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Image
            src={uploadedCover}
            alt="Programme Cover"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      );
    }

    // Online responsive version
    return (
      <div className="h-full relative overflow-hidden">
        <Image
          src={uploadedCover}
          alt="Programme Cover"
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  // Fallback: Generated cover design (yellow/blue theme)
  // Colors matching the printed programme JPEG
  const YELLOW = '#f4c430';
  const BLUE = '#1e3a8a';
  const DARK_BLUE = '#0f172a';

  // Format date
  const matchDate = date ? new Date(date) : new Date();
  const formattedDate = matchDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  const oppName = opposition?.name || 'Opposition';

  if (forPrint) {
    return (
      <div style={{
        width: 794,
        height: 1123,
        backgroundColor: YELLOW,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        {/* Main Title - CWMBRAN CELTIC FC */}
        <div style={{ padding: '20px 28px 0 28px' }}>
          <h1 style={{
            fontSize: 68,
            fontWeight: 800,
            fontStyle: 'italic',
            color: BLUE,
            lineHeight: 0.9,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: -1,
          }}>
            CWMBRAN<br />CELTIC FC
          </h1>
        </div>

        {/* League logos and info row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 28px 8px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 44,
              height: 44,
              backgroundColor: DARK_BLUE,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontStyle: 'italic' }}>JD</span>
            </div>
            <div style={{
              width: 44,
              height: 44,
              backgroundColor: DARK_BLUE,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: 4,
            }}>
              <span style={{ color: YELLOW, fontWeight: 700, fontSize: 9, lineHeight: 1.1 }}>CYMRU</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 9, lineHeight: 1.1 }}>SOUTH</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: BLUE }}>
              OFFICIAL MATCH PROGRAMME <span style={{ fontWeight: 800 }}>£2</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: BLUE }}>
              SEASON 2025/2026
            </div>
          </div>
        </div>

        {/* Website */}
        <div style={{ padding: '0 28px 12px 28px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>
            WWW.CWMBRANCELTIC.COM
          </span>
        </div>

        {/* Action Photo */}
        <div style={{
          position: 'relative',
          margin: '0 20px',
          height: 520,
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: '#2d5a27',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt="Action shot"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 18,
            }}>
              Action photo will appear here
            </div>
          )}
        </div>

        {/* Match Details Section */}
        <div style={{
          padding: '16px 28px 12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ width: 70, height: 70, position: 'relative', flexShrink: 0 }}>
            <Image
              src="/images/club-logo.webp"
              alt="Cwmbran Celtic"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div style={{ textAlign: 'center', flex: 1, padding: '0 16px' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: BLUE }}>
              CWMBRAN CELTIC <span style={{ fontWeight: 400 }}>v</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: BLUE }}>
              {oppName.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, marginTop: 6 }}>
              {formattedDate}, K.O. {kickoff || '15:00'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: BLUE }}>
              AVONDALE MOTORPOINT AREA
            </div>
          </div>

          <div style={{
            width: 70,
            height: 70,
            backgroundColor: '#fff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${DARK_BLUE}`,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: DARK_BLUE, textAlign: 'center', padding: 4 }}>
              {oppName.split(' ').slice(0, 2).join(' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Avondale Sponsor Banner */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: DARK_BLUE,
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '3px 6px', backgroundColor: '#fff', borderRadius: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: DARK_BLUE }}>RHINO</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Coffiology</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontStyle: 'italic', color: YELLOW, letterSpacing: 1 }}>
              AVONDALE
            </div>
            <div style={{
              display: 'inline-block',
              backgroundColor: YELLOW,
              color: DARK_BLUE,
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 10px',
              borderRadius: 3,
              marginTop: 2,
            }}>
              MOTOR PARK
            </div>
            <div style={{ fontSize: 8, color: '#fff', marginTop: 3, letterSpacing: 0.5 }}>
              THE UK&apos;S VAN SUPERSTORE
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#c41e3a' }}>EnerSys</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Endurance</span>
          </div>
        </div>
      </div>
    );
  }

  // Online responsive version (generated design)
  return (
    <div className="h-full relative overflow-hidden" style={{ backgroundColor: YELLOW }}>
      {/* Main Title */}
      <div className="p-5 pb-0">
        <h1
          className="text-5xl sm:text-6xl font-extrabold italic leading-none"
          style={{ color: BLUE }}
        >
          CWMBRAN<br />CELTIC FC
        </h1>
      </div>

      {/* League logos and info row */}
      <div className="flex justify-between items-center px-5 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: DARK_BLUE }}
          >
            <span className="text-white font-extrabold italic text-sm">JD</span>
          </div>
          <div
            className="w-10 h-10 rounded-full flex flex-col items-center justify-center"
            style={{ backgroundColor: DARK_BLUE }}
          >
            <span className="text-[8px] font-bold" style={{ color: YELLOW }}>CYMRU</span>
            <span className="text-[8px] font-bold text-white">SOUTH</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold" style={{ color: BLUE }}>
            OFFICIAL MATCH PROGRAMME <span className="font-extrabold">£2</span>
          </p>
          <p className="text-xs font-semibold" style={{ color: BLUE }}>
            SEASON 2025/2026
          </p>
        </div>
      </div>

      {/* Website */}
      <div className="px-5 pb-3">
        <p className="text-xs font-bold" style={{ color: BLUE }}>
          WWW.CWMBRANCELTIC.COM
        </p>
      </div>

      {/* Action Photo */}
      <div
        className="mx-4 rounded overflow-hidden relative"
        style={{ height: '45%', backgroundColor: '#2d5a27' }}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt="Action shot"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
            Action photo will appear here
          </div>
        )}
      </div>

      {/* Match Details */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="w-14 h-14 relative flex-shrink-0">
          <Image
            src="/images/club-logo.webp"
            alt="Cwmbran Celtic"
            fill
            className="object-contain"
          />
        </div>

        <div className="text-center flex-1 px-3">
          <p className="text-sm font-extrabold" style={{ color: BLUE }}>
            CWMBRAN CELTIC <span className="font-normal">v</span>
          </p>
          <p className="text-sm font-extrabold" style={{ color: BLUE }}>
            {oppName.toUpperCase()}
          </p>
          <p className="text-[10px] font-semibold mt-1" style={{ color: BLUE }}>
            {formattedDate}, K.O. {kickoff || '15:00'}
          </p>
          <p className="text-[10px] font-semibold" style={{ color: BLUE }}>
            AVONDALE MOTORPOINT AREA
          </p>
        </div>

        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#fff', border: `2px solid ${DARK_BLUE}` }}
        >
          <span className="text-[8px] font-bold text-center p-1" style={{ color: DARK_BLUE }}>
            {oppName.split(' ').slice(0, 2).join(' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Avondale Banner - Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: DARK_BLUE }}
      >
        <div className="flex items-center gap-2">
          <div className="px-1.5 py-0.5 bg-white rounded">
            <span className="text-[8px] font-extrabold" style={{ color: DARK_BLUE }}>RHINO</span>
          </div>
          <span className="text-[9px] font-semibold text-white">Coffiology</span>
        </div>

        <div className="text-center">
          <p className="text-lg font-extrabold italic" style={{ color: YELLOW }}>
            AVONDALE
          </p>
          <span
            className="inline-block text-[8px] font-extrabold px-2 py-0.5 rounded"
            style={{ backgroundColor: YELLOW, color: DARK_BLUE }}
          >
            MOTOR PARK
          </span>
          <p className="text-[7px] text-white mt-0.5">
            THE UK&apos;S VAN SUPERSTORE
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold" style={{ color: '#c41e3a' }}>EnerSys</span>
          <span className="text-[9px] font-semibold text-white">Endurance</span>
        </div>
      </div>
    </div>
  );
}
