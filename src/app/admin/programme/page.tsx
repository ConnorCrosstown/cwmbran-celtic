'use client';

import { useState } from 'react';
import Image from 'next/image';
import { oppositionTeams } from '@/data/opposition-data';
import ProgrammePreview from '@/components/programme/ProgrammePreview';

export default function ProgrammeGeneratorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    kickoff: '15:00',
    competition: 'JD Cymru South',
    matchdayNumber: '',
    managersNotes: '',
    teamNews: '',
    matchSponsor: '',
    coverImage: '',
    actionImage: '',
  });

  // Simple password check (in production, use proper auth)
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

  const handlePreview = () => {
    if (!formData.opponent || !formData.date) {
      alert('Please select an opponent and date');
      return;
    }
    setShowPreview(true);
  };

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

  if (showPreview) {
    return (
      <ProgrammePreview
        data={formData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-celtic-blue text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">Programme Generator</h1>
          <p className="text-sm text-gray-200">Create match day programmes in minutes</p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Match Details */}
          <div className="card p-4 md:p-6 mb-4">
            <h2 className="font-bold text-lg text-celtic-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-celtic-blue rounded-full flex items-center justify-center text-white text-sm">1</span>
              Match Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opponent *
                </label>
                <select
                  name="opponent"
                  value={formData.opponent}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Competition
                </label>
                <select
                  name="competition"
                  value={formData.competition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
                >
                  <option value="JD Cymru South">JD Cymru South</option>
                  <option value="FAW Trophy">FAW Trophy</option>
                  <option value="FAW Amateur Trophy">FAW Amateur Trophy</option>
                  <option value="Nathaniel MG Cup">Nathaniel MG Cup</option>
                  <option value="Friendly">Friendly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kick-off Time
                </label>
                <select
                  name="kickoff"
                  value={formData.kickoff}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
                >
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Match Day Number
                </label>
                <input
                  type="text"
                  name="matchdayNumber"
                  value={formData.matchdayNumber}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Match Sponsor
                </label>
                <input
                  type="text"
                  name="matchSponsor"
                  value={formData.matchSponsor}
                  onChange={handleChange}
                  placeholder="e.g. Avondale Motor Park"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="card p-4 md:p-6 mb-4">
            <h2 className="font-bold text-lg text-celtic-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-celtic-blue rounded-full flex items-center justify-center text-white text-sm">2</span>
              Photos
              <span className="text-xs font-normal text-gray-500">(optional)</span>
            </h2>

            {/* Cover Photo */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm text-celtic-dark mb-2">Cover Photo</h3>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'coverImage')}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-celtic-blue file:text-white hover:file:bg-celtic-blue-dark file:cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Main cover image - action shot or ground photo
                  </p>
                </div>
                {formData.coverImage && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden border-2 border-celtic-blue relative">
                    <Image
                      src={formData.coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Photo */}
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
                  <p className="text-xs text-gray-500 mt-1">
                    Action shot for the results page
                  </p>
                </div>
                {formData.actionImage && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden border-2 border-celtic-blue relative">
                    <Image
                      src={formData.actionImage}
                      alt="Action preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, actionImage: '' })}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Manager's Notes */}
          <div className="card p-4 md:p-6 mb-4">
            <h2 className="font-bold text-lg text-celtic-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-celtic-blue rounded-full flex items-center justify-center text-white text-sm">3</span>
              Manager&apos;s Notes
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message from Simon Berry (optional)
              </label>
              <textarea
                name="managersNotes"
                value={formData.managersNotes}
                onChange={handleChange}
                rows={5}
                placeholder="Welcome back to the Avondale Motor Park Arena for today's game against..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use a default welcome message</p>
            </div>
          </div>

          {/* Team News */}
          <div className="card p-4 md:p-6 mb-4">
            <h2 className="font-bold text-lg text-celtic-dark mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-celtic-blue rounded-full flex items-center justify-center text-white text-sm">4</span>
              Team News
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Injury updates, returning players, etc. (optional)
              </label>
              <textarea
                name="teamNews"
                value={formData.teamNews}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Welcome back to Arthur Furness who returns from suspension..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
              />
            </div>
          </div>

          {/* Auto-filled content info */}
          <div className="card p-4 md:p-6 mb-6 bg-celtic-yellow/10 border-celtic-yellow">
            <h2 className="font-bold text-celtic-dark mb-2">Auto-filled Content</h2>
            <p className="text-sm text-gray-600 mb-3">The following will be added automatically:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Full squad list with tick boxes for lineup
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Current league table
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Recent results (last 5 games)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Upcoming fixtures
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Opposition information
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Head-to-head record
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Sponsor advertisements
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Club information & directions
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePreview}
              className="flex-1 bg-white border-2 border-celtic-blue text-celtic-blue py-3 px-6 rounded-lg font-semibold hover:bg-celtic-blue/5 transition-colors flex items-center justify-center gap-2"
            >
              <span>👁</span> Preview PDF
            </button>
            <button
              onClick={handlePreview}
              className="flex-1 bg-celtic-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors flex items-center justify-center gap-2"
            >
              <span>📄</span> Print / Save PDF
            </button>
          </div>

          {/* Shareable Link Section */}
          {formData.opponent && formData.date && (
            <div className="mt-4 card p-4 bg-celtic-yellow/10 border-celtic-yellow">
              <h3 className="font-bold text-celtic-dark mb-2 flex items-center gap-2">
                <span>🔗</span> Digital Programme Link
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Share this link on WhatsApp, social media, or embed on the website:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/programme/${formData.date}-${formData.opponent}`}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/programme/${formData.date}-${formData.opponent}`;
                    navigator.clipboard.writeText(url);
                    alert('Link copied!');
                  }}
                  className="px-4 py-2 bg-celtic-blue text-white rounded-lg text-sm font-semibold hover:bg-celtic-blue-dark"
                >
                  Copy
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/programme/${formData.date}-${formData.opponent}`;
                    const text = `Check out the match day programme for Cwmbran Celtic! 🔵🟡`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
                  }}
                  className="flex-1 py-2 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <span>📱</span> WhatsApp
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/programme/${formData.date}-${formData.opponent}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Match day programme for Cwmbran Celtic! #UpTheCeltic 🔵🟡')}&url=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="flex-1 py-2 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1DA1F2' }}
                >
                  <span>𝕏</span> Twitter
                </button>
                <a
                  href={`/programme/${formData.date}-${formData.opponent}`}
                  target="_blank"
                  className="flex-1 py-2 rounded-lg bg-celtic-blue text-white text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <span>👁</span> View
                </a>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-500 mt-4">
            Use &quot;Print / Save PDF&quot; for printable A4 format, or share the digital link for mobile viewing
          </p>
        </div>
      </div>
    </div>
  );
}
