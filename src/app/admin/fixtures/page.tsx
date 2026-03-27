'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  type Fixture,
  fetchFixtures,
  saveFixture as apiSaveFixture,
  deleteFixture as apiDeleteFixture,
  bulkSaveFixtures,
  isApiConfigured,
} from '@/lib/fixtures-api';

const competitions = [
  'JD Cymru South',
  'Genero Adran South',
  'FAW Cup',
  'FAW Trophy',
  'League Cup',
  'Nathaniel MG Cup',
  'Friendly',
];

const teamLabels: Record<string, string> = {
  mens: "Men's First Team",
  womens: "Women's Team",
  reserves: 'Reserves',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  postponed: 'Postponed',
  cancelled: 'Cancelled',
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  postponed: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Default fixtures from mock data
const defaultFixtures: Fixture[] = [
  {
    id: '1001',
    date: '2026-02-28',
    time: '14:30',
    homeTeam: 'Cambrian United',
    awayTeam: 'Cwmbran Celtic',
    competition: 'JD Cymru South',
    venue: 'Clydach Vale',
    team: 'mens',
    homeScore: null,
    awayScore: null,
    attendance: null,
    scorers: '',
    status: 'scheduled',
  },
  {
    id: '1002',
    date: '2026-03-07',
    time: '14:30',
    homeTeam: 'Cwmbran Celtic',
    awayTeam: 'Baglan Dragons',
    competition: 'JD Cymru South',
    venue: 'Avondale Motor Park Arena',
    team: 'mens',
    homeScore: null,
    awayScore: null,
    attendance: null,
    scorers: '',
    status: 'scheduled',
  },
  {
    id: '1003',
    date: '2026-03-01',
    time: '14:00',
    homeTeam: 'Cwmbran Celtic Ladies',
    awayTeam: 'Carmarthen Town Women',
    competition: 'Genero Adran South',
    venue: 'Avondale Motor Park Arena',
    team: 'womens',
    homeScore: null,
    awayScore: null,
    attendance: null,
    scorers: '',
    status: 'scheduled',
  },
];

export default function FixturesAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fixtures, setFixtures] = useState<Fixture[]>(defaultFixtures);
  const [showEditor, setShowEditor] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showResultsOnly, setShowResultsOnly] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  const [formData, setFormData] = useState<Omit<Fixture, 'id'>>({
    date: '',
    time: '14:30',
    homeTeam: '',
    awayTeam: '',
    competition: 'JD Cymru South',
    venue: 'Avondale Motor Park Arena',
    team: 'mens',
    homeScore: null,
    awayScore: null,
    attendance: null,
    scorers: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      setApiConnected(isApiConfigured());

      // Load fixtures from API or localStorage
      loadFixtures();
    }
  }, []);

  const loadFixtures = async () => {
    setLoading(true);
    try {
      const data = await fetchFixtures();
      if (data.length > 0) {
        setFixtures(data);
      }
    } catch (error) {
      console.error('Failed to load fixtures:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      await bulkSaveFixtures(fixtures);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const openNewFixture = () => {
    setEditingFixture(null);
    setFormData({
      date: '',
      time: '14:30',
      homeTeam: '',
      awayTeam: '',
      competition: 'JD Cymru South',
      venue: 'Avondale Motor Park Arena',
      team: 'mens',
      homeScore: null,
      awayScore: null,
      attendance: null,
      scorers: '',
      status: 'scheduled',
    });
    setShowEditor(true);
  };

  const openEditFixture = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setFormData({
      date: fixture.date,
      time: fixture.time,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      competition: fixture.competition,
      venue: fixture.venue,
      team: fixture.team,
      homeScore: fixture.homeScore,
      awayScore: fixture.awayScore,
      attendance: fixture.attendance,
      scorers: fixture.scorers,
      status: fixture.status,
    });
    setShowEditor(true);
  };

  const openAddResult = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setFormData({
      ...fixture,
      status: 'completed',
    });
    setShowEditor(true);
  };

  const saveFixtureHandler = async () => {
    const fixtureToSave: Fixture = editingFixture
      ? { ...editingFixture, ...formData }
      : { id: Date.now().toString(), ...formData };

    // Update local state immediately
    if (editingFixture) {
      setFixtures(fixtures.map((f) => (f.id === editingFixture.id ? fixtureToSave : f)));
    } else {
      setFixtures([...fixtures, fixtureToSave]);
    }

    setShowEditor(false);
    setEditingFixture(null);

    // Save to API in background
    try {
      await apiSaveFixture(fixtureToSave);
    } catch (error) {
      console.error('Failed to save to API:', error);
    }
  };

  const deleteFixtureHandler = async (id: string) => {
    if (confirm('Are you sure you want to delete this fixture?')) {
      // Update local state immediately
      setFixtures(fixtures.filter((f) => f.id !== id));

      // Delete from API in background
      try {
        await apiDeleteFixture(id);
      } catch (error) {
        console.error('Failed to delete from API:', error);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isHomeGame = (fixture: Fixture) => {
    return (
      fixture.homeTeam.toLowerCase().includes('cwmbran') ||
      fixture.venue.toLowerCase().includes('avondale')
    );
  };

  // Filter fixtures
  const filteredFixtures = fixtures
    .filter((f) => filterTeam === 'all' || f.team === filterTeam)
    .filter((f) => filterStatus === 'all' || f.status === filterStatus)
    .filter((f) => !showResultsOnly || f.status === 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Stats
  const stats = {
    total: fixtures.length,
    upcoming: fixtures.filter((f) => f.status === 'scheduled').length,
    completed: fixtures.filter((f) => f.status === 'completed').length,
    needsResult: fixtures.filter(
      (f) =>
        f.status === 'scheduled' && new Date(f.date) < new Date()
    ).length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">
            Please login from the admin dashboard first
          </p>
          <Link href="/admin" className="btn-primary">
            Go to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Fixtures & Results
              </h1>
              <p className="text-sm text-white/80">
                Manage fixtures and add match results
              </p>
            </div>
            <div className="flex items-center gap-4">
              {apiConnected ? (
                <span className="text-xs text-green-300 bg-green-900/30 px-2 py-1 rounded-full">
                  Google Sheets Connected
                </span>
              ) : (
                <span className="text-xs text-yellow-300 bg-yellow-900/30 px-2 py-1 rounded-full">
                  Local Storage Only
                </span>
              )}
              {saved && (
                <span className="text-sm text-green-300 bg-green-900/30 px-3 py-1 rounded-full">
                  Saved!
                </span>
              )}
              {saving && (
                <span className="text-sm text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full">
                  Saving...
                </span>
              )}
              <Link
                href="/admin"
                className="text-sm text-white/80 hover:text-white"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-celtic-dark">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">Total Fixtures</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.upcoming}
              </p>
              <p className="text-xs text-gray-500">Upcoming</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${stats.needsResult > 0 ? 'text-orange-600' : 'text-gray-400'}`}
              >
                {stats.needsResult}
              </p>
              <p className="text-xs text-gray-500">Needs Result</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Teams</option>
                  <option value="mens">Men&apos;s</option>
                  <option value="womens">Women&apos;s</option>
                  <option value="reserves">Reserves</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="postponed">Postponed</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showResultsOnly}
                    onChange={(e) => setShowResultsOnly(e.target.checked)}
                    className="rounded"
                  />
                  Results only
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={saveData} className="btn-secondary text-sm py-2">
                  Save Changes
                </button>
                <button
                  onClick={openNewFixture}
                  className="btn-primary text-sm py-2"
                >
                  + Add Fixture
                </button>
              </div>
            </div>

            {/* Editor Modal */}
            {showEditor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b sticky top-0 bg-white">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-celtic-dark">
                        {editingFixture
                          ? formData.status === 'completed' &&
                            editingFixture.status !== 'completed'
                            ? 'Add Result'
                            : 'Edit Fixture'
                          : 'New Fixture'}
                      </h2>
                      <button
                        onClick={() => setShowEditor(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Team Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team *
                      </label>
                      <select
                        value={formData.team}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            team: e.target.value as Fixture['team'],
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="mens">Men&apos;s First Team</option>
                        <option value="womens">Women&apos;s Team</option>
                        <option value="reserves">Reserves</option>
                      </select>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kick-off *
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Home Team *
                        </label>
                        <input
                          type="text"
                          value={formData.homeTeam}
                          onChange={(e) =>
                            setFormData({ ...formData, homeTeam: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Cwmbran Celtic"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Away Team *
                        </label>
                        <input
                          type="text"
                          value={formData.awayTeam}
                          onChange={(e) =>
                            setFormData({ ...formData, awayTeam: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Opposition"
                        />
                      </div>
                    </div>

                    {/* Competition & Venue */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Competition
                        </label>
                        <select
                          value={formData.competition}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              competition: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          {competitions.map((comp) => (
                            <option key={comp} value={comp}>
                              {comp}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue
                        </label>
                        <input
                          type="text"
                          value={formData.venue}
                          onChange={(e) =>
                            setFormData({ ...formData, venue: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Avondale Motor Park Arena"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as Fixture['status'],
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="postponed">Postponed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Result Section - Only show if completed */}
                    {formData.status === 'completed' && (
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold text-celtic-dark mb-4">
                          Match Result
                        </h3>

                        {/* Score */}
                        <div className="grid grid-cols-3 gap-4 items-center mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                              {formData.homeTeam || 'Home'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.homeScore ?? ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  homeScore:
                                    e.target.value === ''
                                      ? null
                                      : parseInt(e.target.value),
                                })
                              }
                              className="w-full px-4 py-3 border rounded-lg text-center text-2xl font-bold"
                              placeholder="0"
                            />
                          </div>
                          <div className="text-center text-2xl text-gray-400 font-bold pt-6">
                            -
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                              {formData.awayTeam || 'Away'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.awayScore ?? ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  awayScore:
                                    e.target.value === ''
                                      ? null
                                      : parseInt(e.target.value),
                                })
                              }
                              className="w-full px-4 py-3 border rounded-lg text-center text-2xl font-bold"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Scorers */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Goalscorers (Cwmbran)
                          </label>
                          <input
                            type="text"
                            value={formData.scorers}
                            onChange={(e) =>
                              setFormData({ ...formData, scorers: e.target.value })
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Berry 23', McDowell 67' (pen)"
                          />
                        </div>

                        {/* Attendance */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attendance
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.attendance ?? ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                attendance:
                                  e.target.value === ''
                                    ? null
                                    : parseInt(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="150"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                      onClick={() => setShowEditor(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveFixtureHandler}
                      disabled={
                        !formData.date ||
                        !formData.homeTeam.trim() ||
                        !formData.awayTeam.trim()
                      }
                      className="btn-primary"
                    >
                      {editingFixture ? 'Update' : 'Add Fixture'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fixtures List */}
            <div className="space-y-3">
              {filteredFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className={`card p-4 ${isHomeGame(fixture) ? 'border-l-4 border-l-celtic-blue' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      {/* Date & Competition */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {formatDate(fixture.date)} • {fixture.time}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${statusColors[fixture.status]}`}
                        >
                          {statusLabels[fixture.status]}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {teamLabels[fixture.team]}
                        </span>
                      </div>

                      {/* Teams & Score */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold ${fixture.homeTeam.toLowerCase().includes('cwmbran') ? 'text-celtic-blue' : 'text-celtic-dark'}`}
                            >
                              {fixture.homeTeam}
                            </span>
                            {fixture.status === 'completed' && (
                              <span className="text-xl font-bold text-celtic-dark">
                                {fixture.homeScore}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold ${fixture.awayTeam.toLowerCase().includes('cwmbran') ? 'text-celtic-blue' : 'text-celtic-dark'}`}
                            >
                              {fixture.awayTeam}
                            </span>
                            {fixture.status === 'completed' && (
                              <span className="text-xl font-bold text-celtic-dark">
                                {fixture.awayScore}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Venue & Scorers */}
                      <div className="mt-2 text-xs text-gray-500">
                        <span>{fixture.venue}</span>
                        {fixture.competition && (
                          <span> • {fixture.competition}</span>
                        )}
                        {fixture.scorers && (
                          <div className="mt-1 text-green-700">
                            {fixture.scorers}
                          </div>
                        )}
                        {fixture.attendance && (
                          <span className="ml-2">
                            Attendance: {fixture.attendance}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      {fixture.status === 'scheduled' &&
                        new Date(fixture.date) < new Date() && (
                          <button
                            onClick={() => openAddResult(fixture)}
                            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Add Result
                          </button>
                        )}
                      <button
                        onClick={() => openEditFixture(fixture)}
                        className="text-sm text-celtic-blue hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFixtureHandler(fixture.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFixtures.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No fixtures found</p>
                <button onClick={openNewFixture} className="btn-primary">
                  Add Your First Fixture
                </button>
              </div>
            )}

            {/* Save Button */}
            {fixtures.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button onClick={saveData} className="btn-primary">
                  Save All Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
