'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getOppositionById } from '@/data/opposition-data';
import CoverPage from '@/components/programme/CoverPage';

// Types
interface ProgrammeData {
  opponent: string;
  date: string;
  kickoff: string;
  competition: string;
  coverImage?: string;
}

// Parse slug to extract date and opponent ID
function parseSlug(slug: string): { date: string; opponent: string } | null {
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (match) {
    return { date: match[1], opponent: match[2] };
  }
  return null;
}

export default function PrintProgrammePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [programmeData, setProgrammeData] = useState<ProgrammeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    if (slug) {
      // First try localStorage (for when user previews from admin)
      if (typeof window !== 'undefined') {
        const programmeKey = `programme-${slug}`;
        const stored = localStorage.getItem(programmeKey);
        if (stored) {
          setProgrammeData(JSON.parse(stored));
          setLoading(false);
          return;
        }
      }

      // Fallback: parse the slug directly for Puppeteer/direct access
      const parsed = parseSlug(slug);
      if (parsed) {
        const kickoff = searchParams.get('kickoff') || '15:00';
        const competition = searchParams.get('competition') || 'JD Cymru South';
        const coverImage = searchParams.get('coverImage') || undefined;

        setProgrammeData({
          opponent: parsed.opponent,
          date: parsed.date,
          kickoff,
          competition,
          coverImage,
        });
      }
      setLoading(false);
    }
  }, [params.slug, searchParams]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (!programmeData) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Programme not found</div>;
  }

  const opposition = getOppositionById(programmeData.opponent);
  if (!opposition) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Opposition not found: {programmeData.opponent}</div>;
  }

  return (
    <div style={{ backgroundColor: '#333', padding: 20 }}>
      <CoverPage
        opposition={opposition}
        date={programmeData.date}
        kickoff={programmeData.kickoff}
        coverImage={programmeData.coverImage}
        forPrint={true}
      />
    </div>
  );
}
