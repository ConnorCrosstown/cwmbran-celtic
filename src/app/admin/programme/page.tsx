'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { oppositionTeams, getOppositionById } from '@/data/opposition-data';
import { mockSquad } from '@/data/mock-data';
import ProgrammePreview from '@/components/programme/ProgrammePreview';

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
  startingXI: number[]; // Squad numbers
  substitutes: number[]; // Squad numbers
  captain: number | null; // Squad number

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
  createdAt?: string;
  updatedAt?: string;
}

interface SavedProgramme {
  id: string;
  data: ProgrammeData;
}

const defaultFormData: ProgrammeData = {
  opponent: '',
  date: '',
  kickoff: '15:00',
  competition: 'JD Cymru South',
  matchdayNumber: '',
  venue: 'home',
  team: 'mens',
  startingXI: [],
  substitutes: [],
  captain: null,
  referee: '',
  assistantRef1: '',
  assistantRef2: '',
  fourthOfficial: '',
  matchSponsor: '',
  mascotSponsor: '',
  matchballSponsor: '',
  programmePrice: 'FREE',
  managersNotes: '',
  teamNews: '',
  specialNotes: '',
  playerToWatch: null,
  coverImage: '',
  actionImage: '',
  status: 'draft',
};

export default function ProgrammeGeneratorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedProgrammes, setSavedProgrammes] = useState<SavedProgramme[]>([]);
  const [activeSection, setActiveSection] = useState(1);
  const [formData, setFormData] = useState<ProgrammeData>(defaultFormData);

  // Get squad for current team
  const squad = mockSquad.results as SquadPlayer[];
  const goalkeepers = squad.filter(p => p.position === 'Goalkeeper');
  const defenders = squad.filter(p => p.position.includes('Back'));
  const midfielders = squad.filter(p => p.position.includes('Midfield') || p.position.includes('Wing'));
  const forwards = squad.filter(p => p.position === 'Striker' || p.position === 'Forward');

  useEffect(() => {
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
        } catch (e) {
          // Skip invalid entries
        }
      }
    }
    programmes.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
    setSavedProgrammes(programmes);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'celtic2025') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'coverImage' | 'actionImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [imageType]: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlayerInStartingXI = (squadNo: number) => {
    const isInXI = formData.startingXI.includes(squadNo);
    const isInSubs = formData.substitutes.includes(squadNo);

    if (isInXI) {
      // Remove from XI
      setFormData({
        ...formData,
        startingXI: formData.startingXI.filter(n => n !== squadNo),
        captain: formData.captain === squadNo ? null : formData.captain
      });
    } else if (isInSubs) {
      // Move from subs to XI (if space)
      if (formData.startingXI.length < 11) {
        setFormData({
          ...formData,
          startingXI: [...formData.startingXI, squadNo],
          substitutes: formData.substitutes.filter(n => n !== squadNo)
        });
      }
    } else {
      // Add to XI (if space)
      if (formData.startingXI.length < 11) {
        setFormData({
          ...formData,
          startingXI: [...formData.startingXI, squadNo]
        });
      } else if (formData.substitutes.length < 7) {
        // XI full, add to subs
        setFormData({
          ...formData,
          substitutes: [...formData.substitutes, squadNo]
        });
      }
    }
  };

  const togglePlayerInSubs = (squadNo: number) => {
    const isInXI = formData.startingXI.includes(squadNo);
    const isInSubs = formData.substitutes.includes(squadNo);

    if (isInSubs) {
      // Remove from subs
      setFormData({
        ...formData,
        substitutes: formData.substitutes.filter(n => n !== squadNo)
      });
    } else if (isInXI) {
      // Move from XI to subs
      setFormData({
        ...formData,
        startingXI: formData.startingXI.filter(n => n !== squadNo),
        substitutes: [...formData.substitutes, squadNo],
        captain: formData.captain === squadNo ? null : formData.captain
      });
    } else {
      // Add to subs (if space)
      if (formData.substitutes.length < 7) {
        setFormData({
          ...formData,
          substitutes: [...formData.substitutes, squadNo]
        });
      }
    }
  };

  const setCaptain = (squadNo: number) => {
    if (formData.startingXI.includes(squadNo)) {
      setFormData({
        ...formData,
        captain: formData.captain === squadNo ? null : squadNo
      });
    }
  };

  const clearSelection = () => {
    setFormData({
      ...formData,
      startingXI: [],
      substitutes: [],
      captain: null
    });
  };

  const handlePreview = () => {
    if (!formData.opponent || !formData.date) {
      alert('Please select an opponent and date');
      return;
    }
    saveProgramme('draft');
    setShowPreview(true);
  };

  const saveProgramme = (status: 'draft' | 'published') => {
    if (!formData.opponent || !formData.date) {
      alert('Please select an opponent and date');
      return;
    }
    const programmeKey = `programme-${formData.date}-${formData.opponent}`;
    const dataToSave = {
      ...formData,
      status,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString(),
    };
    localStorage.setItem(programmeKey, JSON.stringify(dataToSave));
    setFormData(dataToSave);
    loadSavedProgrammes();

    if (status === 'published') {
      alert('Programme published! The digital link is now active.');
    } else {
      alert('Draft saved!');
    }
  };

  const loadProgramme = (programme: SavedProgramme) => {
    setFormData(programme.data);
    setShowSavedList(false);
  };

  const duplicateProgramme = (programme: SavedProgramme) => {
    const newData = {
      ...programme.data,
      date: '',
      opponent: '',
      status: 'draft' as const,
      createdAt: undefined,
      updatedAt: undefined,
    };
    setFormData(newData);
    setShowSavedList(false);
    alert('Programme duplicated! Update the date and opponent.');
  };

  const deleteProgramme = (id: string) => {
    if (confirm('Are you sure you want to delete this programme?')) {
      localStorage.removeItem(id);
      loadSavedProgrammes();
    }
  };

  const clearForm = () => {
    if (confirm('Clear the form and start fresh?')) {
      setFormData(defaultFormData);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-6 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-celtic-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-celtic-yellow text-2xl">🔒</span>
            </div>
            <h1 className="text-xl font-bold text-celtic-dark">Staff Access</h1>
            <p className="text-sm text-gray-500">Programme Generator</p>
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
              Access Generator
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Preview mode
  if (showPreview) {
    return (
      <ProgrammePreview
        data={formData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  // Saved programmes list
  if (showSavedList) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-celtic-blue text-white py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Saved Programmes</h1>
              <p className="text-sm text-gray-200">{savedProgrammes.length} programmes saved</p>
            </div>
            <button
              onClick={() => setShowSavedList(false)}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30"
            >
              Back to Editor
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-3">
            {savedProgrammes.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-500">No saved programmes yet</p>
                <button
                  onClick={() => setShowSavedList(false)}
                  className="mt-4 px-4 py-2 bg-celtic-blue text-white rounded-lg text-sm font-semibold"
                >
                  Create New Programme
                </button>
              </div>
            ) : (
              savedProgrammes.map((prog) => {
                const opp = getOppositionById(prog.data.opponent);
                const dateStr = new Date(prog.data.date).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                return (
                  <div key={prog.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {prog.data.coverImage ? (
                          <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image src={prog.data.coverImage} alt="" width={48} height={64} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-12 h-16 bg-celtic-blue rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-celtic-yellow text-lg">📄</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-celtic-dark">vs {opp?.name || prog.data.opponent}</p>
                          <p className="text-xs text-gray-500">{dateStr} • {prog.data.kickoff}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${prog.data.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {prog.data.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {prog.data.team === 'mens' ? "Men's" : prog.data.team === 'womens' ? "Women's" : 'Dev'}
                            </span>
                            {prog.data.startingXI?.length === 11 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                XI Set
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => loadProgramme(prog)}
                          className="px-3 py-1.5 bg-celtic-blue text-white rounded text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => duplicateProgramme(prog)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold"
                        >
                          Duplicate
                        </button>
                        {prog.data.status === 'published' && (
                          <a
                            href={`/programme/${prog.data.date}-${prog.data.opponent}`}
                            target="_blank"
                            className="px-3 py-1.5 bg-celtic-yellow text-celtic-dark rounded text-xs font-semibold text-center"
                          >
                            View
                          </a>
                        )}
                        <button
                          onClick={() => deleteProgramme(prog.id)}
                          className="px-3 py-1.5 bg-red-100 text-red-600 rounded text-xs font-semibold hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Helper component for player selection
  const PlayerCard = ({ player }: { player: SquadPlayer }) => {
    const isInXI = formData.startingXI.includes(player.squadNo);
    const isInSubs = formData.substitutes.includes(player.squadNo);
    const isCaptain = formData.captain === player.squadNo;

    return (
      <div
        className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
          isInXI
            ? 'border-celtic-blue bg-celtic-blue/10'
            : isInSubs
            ? 'border-celtic-yellow bg-celtic-yellow/10'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => togglePlayerInStartingXI(player.squadNo)}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              isInXI
                ? 'bg-celtic-blue text-white'
                : isInSubs
                ? 'bg-celtic-yellow text-celtic-dark'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {player.squadNo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-celtic-dark truncate">
              {player.firstName} {player.lastName}
            </p>
            <p className="text-[10px] text-gray-500">{player.position}</p>
          </div>
          {isInXI && (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCaptain(player.squadNo);
                }}
                className={`w-5 h-5 rounded text-[9px] font-bold ${
                  isCaptain ? 'bg-celtic-yellow text-celtic-dark' : 'bg-gray-200 text-gray-500'
                }`}
                title="Captain"
              >
                C
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayerInSubs(player.squadNo);
                }}
                className="w-5 h-5 rounded bg-gray-200 text-gray-500 text-[9px] font-bold"
                title="Move to subs"
              >
                S
              </button>
            </div>
          )}
          {isInSubs && (
            <span className="text-[9px] font-bold text-celtic-yellow bg-celtic-yellow/20 px-1.5 py-0.5 rounded">
              SUB
            </span>
          )}
        </div>
      </div>
    );
  };

  // Section tabs
  const sections = [
    { id: 1, label: 'Match', icon: '⚽' },
    { id: 2, label: 'Squad', icon: '👥' },
    { id: 3, label: 'Officials', icon: '🏁' },
    { id: 4, label: 'Content', icon: '📝' },
    { id: 5, label: 'Photos', icon: '📷' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-celtic-blue text-white py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Programme Generator</h1>
            <p className="text-xs text-gray-200">
              {formData.status === 'published' ? 'Editing published' : formData.opponent ? 'Editing draft' : 'New programme'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSavedList(true)}
              className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-semibold hover:bg-white/30 flex items-center gap-1"
            >
              📁 Saved ({savedProgrammes.length})
            </button>
            <button
              onClick={clearForm}
              className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-semibold hover:bg-white/30"
            >
              New
            </button>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-celtic-blue text-celtic-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">

          {/* Section 1: Match Details */}
          {activeSection === 1 && (
            <div className="card p-4 md:p-6">
              <h2 className="font-bold text-lg text-celtic-dark mb-4">Match Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team *</label>
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  >
                    <option value="mens">Men&apos;s First Team</option>
                    <option value="womens">Women&apos;s Team</option>
                    <option value="development">Development Squad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  >
                    <option value="home">Home</option>
                    <option value="away">Away</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opponent *</label>
                  <select
                    name="opponent"
                    value={formData.opponent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  >
                    <option value="">Select opponent...</option>
                    {oppositionTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competition</label>
                  <select
                    name="competition"
                    value={formData.competition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  >
                    <option value="JD Cymru South">JD Cymru South</option>
                    <option value="FAW Trophy">FAW Trophy</option>
                    <option value="FAW Amateur Trophy">FAW Amateur Trophy</option>
                    <option value="Nathaniel MG Cup">Nathaniel MG Cup</option>
                    <option value="SWWGL Premier">SWWGL Premier (Women)</option>
                    <option value="Friendly">Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kick-off</label>
                  <select
                    name="kickoff"
                    value={formData.kickoff}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  >
                    <option value="12:00">12:00</option>
                    <option value="12:30">12:30</option>
                    <option value="14:00">14:00</option>
                    <option value="14:30">14:30</option>
                    <option value="15:00">15:00</option>
                    <option value="17:30">17:30</option>
                    <option value="19:30">19:30</option>
                    <option value="19:45">19:45</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matchday Number</label>
                  <input
                    type="text"
                    name="matchdayNumber"
                    value={formData.matchdayNumber}
                    onChange={handleChange}
                    placeholder="e.g. 15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programme Price</label>
                  <select
                    name="programmePrice"
                    value={formData.programmePrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  >
                    <option value="FREE">FREE</option>
                    <option value="£1">£1</option>
                    <option value="£2">£2</option>
                    <option value="£3">£3</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Squad Selection */}
          {activeSection === 2 && (
            <div className="card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-celtic-dark">Squad Selection</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-celtic-blue text-white px-2 py-1 rounded">
                    XI: {formData.startingXI.length}/11
                  </span>
                  <span className="text-xs bg-celtic-yellow text-celtic-dark px-2 py-1 rounded">
                    Subs: {formData.substitutes.length}/7
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Click to add to Starting XI (blue). Click &quot;S&quot; to move to subs (yellow). Click &quot;C&quot; to set captain.
              </p>

              {/* Selected XI */}
              {formData.startingXI.length > 0 && (
                <div className="mb-4 p-3 bg-celtic-blue/5 rounded-lg">
                  <h3 className="text-xs font-bold text-celtic-blue mb-2">STARTING XI</h3>
                  <div className="flex flex-wrap gap-1">
                    {formData.startingXI.map(no => {
                      const player = squad.find(p => p.squadNo === no);
                      return player ? (
                        <span key={no} className="text-xs bg-celtic-blue text-white px-2 py-1 rounded flex items-center gap-1">
                          {no}. {player.lastName}
                          {formData.captain === no && <span className="text-celtic-yellow">(C)</span>}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Selected Subs */}
              {formData.substitutes.length > 0 && (
                <div className="mb-4 p-3 bg-celtic-yellow/10 rounded-lg">
                  <h3 className="text-xs font-bold text-celtic-dark mb-2">SUBSTITUTES</h3>
                  <div className="flex flex-wrap gap-1">
                    {formData.substitutes.map(no => {
                      const player = squad.find(p => p.squadNo === no);
                      return player ? (
                        <span key={no} className="text-xs bg-celtic-yellow text-celtic-dark px-2 py-1 rounded">
                          {no}. {player.lastName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Goalkeepers */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Goalkeepers</h3>
                <div className="grid grid-cols-2 gap-2">
                  {goalkeepers.map(player => (
                    <PlayerCard key={player.squadNo} player={player} />
                  ))}
                </div>
              </div>

              {/* Defenders */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Defenders</h3>
                <div className="grid grid-cols-2 gap-2">
                  {defenders.map(player => (
                    <PlayerCard key={player.squadNo} player={player} />
                  ))}
                </div>
              </div>

              {/* Midfielders */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Midfielders</h3>
                <div className="grid grid-cols-2 gap-2">
                  {midfielders.map(player => (
                    <PlayerCard key={player.squadNo} player={player} />
                  ))}
                </div>
              </div>

              {/* Forwards */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Forwards</h3>
                <div className="grid grid-cols-2 gap-2">
                  {forwards.map(player => (
                    <PlayerCard key={player.squadNo} player={player} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Match Officials */}
          {activeSection === 3 && (
            <div className="card p-4 md:p-6">
              <h2 className="font-bold text-lg text-celtic-dark mb-4">Match Officials</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referee</label>
                  <input
                    type="text"
                    name="referee"
                    value={formData.referee}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assistant Referee 1</label>
                  <input
                    type="text"
                    name="assistantRef1"
                    value={formData.assistantRef1}
                    onChange={handleChange}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assistant Referee 2</label>
                  <input
                    type="text"
                    name="assistantRef2"
                    value={formData.assistantRef2}
                    onChange={handleChange}
                    placeholder="e.g. Mike Jones"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fourth Official (if applicable)</label>
                  <input
                    type="text"
                    name="fourthOfficial"
                    value={formData.fourthOfficial}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Williams"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>
              </div>

              <hr className="my-6" />

              <h2 className="font-bold text-lg text-celtic-dark mb-4">Sponsors</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Match Sponsor</label>
                  <input
                    type="text"
                    name="matchSponsor"
                    value={formData.matchSponsor}
                    onChange={handleChange}
                    placeholder="e.g. Avondale Motor Park"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matchball Sponsor</label>
                  <input
                    type="text"
                    name="matchballSponsor"
                    value={formData.matchballSponsor}
                    onChange={handleChange}
                    placeholder="e.g. Local Business"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mascot Sponsor</label>
                  <input
                    type="text"
                    name="mascotSponsor"
                    value={formData.mascotSponsor}
                    onChange={handleChange}
                    placeholder="e.g. Today's mascot is sponsored by..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Content */}
          {activeSection === 4 && (
            <div className="card p-4 md:p-6">
              <h2 className="font-bold text-lg text-celtic-dark mb-4">Programme Content</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager&apos;s Notes
                  </label>
                  <textarea
                    name="managersNotes"
                    value={formData.managersNotes}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Welcome to the Avondale Motor Park Arena..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for default message</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team News
                  </label>
                  <textarea
                    name="teamNews"
                    value={formData.teamNews}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Welcome back to Arthur Furness who returns from suspension..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Notes / Announcements
                  </label>
                  <textarea
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. Minute's silence in memory of... / Half-time draw tickets available..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Player to Watch
                  </label>
                  <select
                    name="playerToWatch"
                    value={formData.playerToWatch || ''}
                    onChange={(e) => setFormData({ ...formData, playerToWatch: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue"
                  >
                    <option value="">Select player...</option>
                    {squad.map(player => (
                      <option key={player.squadNo} value={player.squadNo}>
                        {player.squadNo}. {player.firstName} {player.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Photos */}
          {activeSection === 5 && (
            <div className="card p-4 md:p-6">
              <h2 className="font-bold text-lg text-celtic-dark mb-4">Photos</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm text-celtic-dark mb-2">Cover Photo</h3>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'coverImage')}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-celtic-blue file:text-white hover:file:bg-celtic-blue-dark file:cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Action shot or ground photo for cover</p>
                    </div>
                    {formData.coverImage && (
                      <div className="w-20 h-28 rounded-lg overflow-hidden border-2 border-celtic-blue relative flex-shrink-0">
                        <Image src={formData.coverImage} alt="Cover" fill className="object-cover" />
                        <button
                          onClick={() => setFormData({ ...formData, coverImage: '' })}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-celtic-dark mb-2">Action Photo</h3>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'actionImage')}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-celtic-blue file:text-white hover:file:bg-celtic-blue-dark file:cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Additional action shot for inside pages</p>
                    </div>
                    {formData.actionImage && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border-2 border-celtic-blue relative flex-shrink-0">
                        <Image src={formData.actionImage} alt="Action" fill className="object-cover" />
                        <button
                          onClick={() => setFormData({ ...formData, actionImage: '' })}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => saveProgramme('draft')}
              className="bg-gray-100 border-2 border-gray-300 text-gray-700 py-2.5 px-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              💾 Save
            </button>
            <button
              onClick={() => saveProgramme('published')}
              className="bg-green-600 text-white py-2.5 px-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              ✓ Publish
            </button>
            <button
              onClick={handlePreview}
              className="bg-white border-2 border-celtic-blue text-celtic-blue py-2.5 px-3 rounded-lg font-semibold hover:bg-celtic-blue/5 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              👁 Preview
            </button>
            <button
              onClick={handlePreview}
              className="bg-celtic-blue text-white py-2.5 px-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors flex items-center justify-center gap-1 text-sm"
            >
              📄 PDF
            </button>
          </div>

          {/* Status */}
          {formData.status && (
            <div className="mt-3 text-center">
              <span className={`text-xs px-3 py-1 rounded-full ${formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {formData.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
          )}

          {/* Shareable Link */}
          {formData.opponent && formData.date && (
            <div className="mt-4 card p-4 bg-celtic-yellow/10 border-celtic-yellow">
              <h3 className="font-bold text-celtic-dark mb-2 text-sm">🔗 Digital Programme Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/programme/${formData.date}-${formData.opponent}`}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                />
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/programme/${formData.date}-${formData.opponent}`;
                    navigator.clipboard.writeText(url);
                    alert('Link copied!');
                  }}
                  className="px-3 py-2 bg-celtic-blue text-white rounded-lg text-xs font-semibold"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
