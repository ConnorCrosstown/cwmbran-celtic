'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { oppositionTeams, getOppositionById } from '@/data/opposition-data';
import { mockSquad, mockLeagueTable, mockResults, mockFixtures, fromCometDate } from '@/data/mock-data';

// Dynamic import for PDF components (client-side only)
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span>Loading PDF generator...</span> }
);

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <span>Loading PDF viewer...</span> }
);

// Import the PDF document component
import ProgrammePDF from '@/components/programme-pdf/ProgrammePDF';

interface ProgrammeData {
  opponent: string;
  date: string;
  kickoff: string;
  managersNotes: string;
  startingXI: number[];
  substitutes: number[];
  captain: number | null;
}

interface SavedProgramme {
  id: string;
  data: ProgrammeData;
}

export default function ProgrammePDFPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState<SavedProgramme | null>(null);
  const [savedProgrammes, setSavedProgrammes] = useState<SavedProgramme[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      loadSavedProgrammes();
    }
  }, []);

  const loadSavedProgrammes = () => {
    const programmes: SavedProgramme[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('programme-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          programmes.push({ id: key, data });
        } catch {
          // Skip invalid entries
        }
      }
    }
    programmes.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
    setSavedProgrammes(programmes);

    // Auto-select first programme if available
    if (programmes.length > 0 && !selectedProgramme) {
      setSelectedProgramme(programmes[0]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'celtic2025') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Get data for the PDF
  const getDataForPDF = () => {
    if (!selectedProgramme) return null;

    const opposition = getOppositionById(selectedProgramme.data.opponent);
    if (!opposition) return null;

    // Transform data for PDF
    const squad = mockSquad.results.map(p => ({
      squadNo: p.squadNo,
      firstName: p.firstName,
      lastName: p.lastName,
      position: p.position,
    }));

    const leagueTable = mockLeagueTable.results.map(t => ({
      position: t.position,
      club: t.club,
      played: t.played,
      won: t.won,
      drawn: t.drawn,
      lost: t.lost,
      gd: t.gd,
      points: t.points,
    }));

    const recentResults = mockResults.results.slice(0, 5).map(r => ({
      homeTeam: r.homeTeam,
      awayTeam: r.awayTeam,
      homeScore: r.homeScore,
      awayScore: r.awayScore,
      date: fromCometDate(r.date).toISOString(),
    }));

    const upcomingFixtures = mockFixtures.results
      .filter(f => f.homeTeam.includes('Cwmbran Celtic') || f.awayTeam.includes('Cwmbran Celtic'))
      .slice(0, 5)
      .map(f => ({
        homeTeam: f.homeTeam,
        awayTeam: f.awayTeam,
        date: fromCometDate(f.date).toISOString(),
        time: f.time,
      }));

    return {
      opposition: {
        id: opposition.id,
        name: opposition.name,
        nickname: opposition.nickname,
        ground: opposition.ground,
        founded: opposition.founded,
        colours: opposition.colours,
        headToHead: opposition.headToHead,
      },
      date: selectedProgramme.data.date,
      programmeData: selectedProgramme.data,
      squad,
      leagueTable,
      recentResults,
      upcomingFixtures,
    };
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-6 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-celtic-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-celtic-yellow text-2xl">PDF</span>
            </div>
            <h1 className="text-xl font-bold text-celtic-dark">PDF Generator</h1>
            <p className="text-sm text-gray-500">Staff Access Required</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center text-lg"
            />
            <button
              type="submit"
              className="w-full bg-celtic-blue text-white py-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors"
            >
              Access PDF Generator
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pdfData = getDataForPDF();

  // PDF Preview mode
  if (showPreview && pdfData && isClient) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <div className="bg-celtic-blue text-white py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">PDF Preview</h1>
              <p className="text-xs text-gray-200">
                vs {pdfData.opposition.name} - {new Date(pdfData.date).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div className="flex gap-2">
              <PDFDownloadLink
                document={<ProgrammePDF {...pdfData} />}
                fileName={`cwmbran-celtic-programme-${pdfData.date}-${pdfData.opposition.id}.pdf`}
                className="px-4 py-2 bg-celtic-yellow text-celtic-dark rounded-lg text-sm font-semibold hover:bg-yellow-400"
              >
                {({ loading }) => (loading ? 'Generating...' : 'Download PDF')}
              </PDFDownloadLink>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30"
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <PDFViewer
            style={{ width: '100%', height: 'calc(100vh - 80px)', border: 'none' }}
          >
            <ProgrammePDF {...pdfData} />
          </PDFViewer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-celtic-blue text-white py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">PDF Programme Generator</h1>
            <p className="text-xs text-gray-200">Generate professional match day programmes</p>
          </div>
          <Link
            href="/admin/programme"
            className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30"
          >
            Back to Editor
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Programme Selection */}
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-lg text-celtic-dark mb-4">Select Programme</h2>

            {savedProgrammes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No saved programmes found</p>
                <Link
                  href="/admin/programme"
                  className="inline-block px-6 py-3 bg-celtic-blue text-white rounded-lg font-semibold hover:bg-celtic-blue-dark"
                >
                  Create a Programme First
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedProgrammes.map((prog) => {
                  const opp = getOppositionById(prog.data.opponent);
                  const dateStr = new Date(prog.data.date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const isSelected = selectedProgramme?.id === prog.id;

                  return (
                    <div
                      key={prog.id}
                      onClick={() => setSelectedProgramme(prog)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-celtic-blue bg-celtic-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-celtic-dark">
                            vs {opp?.name || prog.data.opponent}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dateStr} - {prog.data.kickoff}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-celtic-blue rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">OK</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          {selectedProgramme && pdfData && (
            <div className="card p-6">
              <h2 className="font-bold text-lg text-celtic-dark mb-4">Generate PDF</h2>

              {/* Programme Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Opponent</p>
                    <p className="font-semibold text-celtic-dark">{pdfData.opposition.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-semibold text-celtic-dark">
                      {new Date(pdfData.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Kick-off</p>
                    <p className="font-semibold text-celtic-dark">
                      {selectedProgramme.data.kickoff || '15:00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Starting XI</p>
                    <p className="font-semibold text-celtic-dark">
                      {selectedProgramme.data.startingXI?.length || 0}/11 selected
                    </p>
                  </div>
                </div>
              </div>

              {/* PDF Info */}
              <div className="bg-celtic-blue/5 border border-celtic-blue/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-celtic-dark text-sm mb-2">PDF Contents (10 pages)</h3>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                  <span>1. Cover Page</span>
                  <span>6. Today&apos;s Visitors</span>
                  <span>2. Manager&apos;s Notes</span>
                  <span>7. League Table</span>
                  <span>3. Squad List</span>
                  <span>8. Results & Fixtures</span>
                  <span>4. Today&apos;s Match</span>
                  <span>9. Celtic Bond</span>
                  <span>5. Club History</span>
                  <span>10. Back Cover</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-3 bg-white border-2 border-celtic-blue text-celtic-blue rounded-lg font-semibold hover:bg-celtic-blue/5 transition-colors"
                >
                  Preview PDF
                </button>
                {isClient && (
                  <PDFDownloadLink
                    document={<ProgrammePDF {...pdfData} />}
                    fileName={`cwmbran-celtic-programme-${pdfData.date}-${pdfData.opposition.id}.pdf`}
                    className="px-6 py-3 bg-celtic-blue text-white rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors text-center"
                  >
                    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                  </PDFDownloadLink>
                )}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              PDFs are generated with all match data auto-populated from the programme editor.
            </p>
            <p className="mt-1">
              <Link href="/admin/programme" className="text-celtic-blue hover:underline">
                Edit programme content
              </Link>
              {' '}to customize before generating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
