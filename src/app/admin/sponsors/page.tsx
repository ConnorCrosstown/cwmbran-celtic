'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: 'main' | 'official' | 'partner' | 'advertiser';
  description?: string;
}

const tierLabels: Record<string, string> = {
  main: 'Stadium Partner',
  official: 'Official Partner',
  partner: 'Club Partner',
  advertiser: 'Programme Advertiser',
};

const tierColors: Record<string, string> = {
  main: 'bg-celtic-yellow text-celtic-dark',
  official: 'bg-celtic-blue text-white',
  partner: 'bg-blue-100 text-blue-700',
  advertiser: 'bg-gray-100 text-gray-700',
};

const defaultSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Avondale Motor Park',
    logo: '/images/sponsors/avondale-hire.webp',
    url: 'https://www.avondalemotorpark.com',
    tier: 'main',
    description: 'Stadium Naming Rights Partner',
  },
  {
    id: '2',
    name: 'OXO',
    logo: '/images/sponsors/oxo.png',
    url: '/ban-the-bovril',
    tier: 'official',
    description: 'Official Hot Beverage Partner',
  },
  {
    id: '3',
    name: 'Avondale Hire',
    logo: '/images/sponsors/avondale-hire.webp',
    url: 'http://www.avondalehire.co.uk',
    tier: 'official',
    description: 'Official Equipment Partner',
  },
  {
    id: '4',
    name: 'Taking the Strain Travel',
    logo: '/images/sponsors/taking-the-strain-travel.webp',
    url: 'https://takingthestraintravel.co.uk',
    tier: 'official',
    description: 'Official Travel Partner',
  },
  {
    id: '5',
    name: 'Rhino Global',
    logo: '/images/sponsors/rhino-global.webp',
    url: 'https://rhino.direct',
    tier: 'official',
    description: 'Official Kit Partner',
  },
  {
    id: '6',
    name: 'Hathways',
    logo: '/images/sponsors/hathways.webp',
    url: 'https://hathways.co.uk',
    tier: 'partner',
  },
  {
    id: '7',
    name: 'Motazone',
    logo: '/images/sponsors/motazone.webp',
    url: 'https://motazone.net',
    tier: 'partner',
  },
  {
    id: '8',
    name: 'John and Jane',
    logo: '/images/sponsors/john-and-jane.webp',
    url: '',
    tier: 'advertiser',
  },
  {
    id: '9',
    name: 'Lorann Engineering',
    logo: '/images/sponsors/lorann-engineering.webp',
    url: '',
    tier: 'advertiser',
  },
  {
    id: '10',
    name: "MG's Carpets & Rugs",
    logo: '/images/sponsors/mgs-carpets.webp',
    url: '',
    tier: 'advertiser',
  },
];

export default function SponsorsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>(defaultSponsors);
  const [showEditor, setShowEditor] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Sponsor['tier']>('main');
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    url: '',
    tier: 'partner' as Sponsor['tier'],
    description: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      // Load saved data from localStorage
      const savedData = localStorage.getItem('sponsors-data');
      if (savedData) {
        setSponsors(JSON.parse(savedData));
      }
    }
  }, []);

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sponsors-data', JSON.stringify(sponsors));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const openNewSponsor = () => {
    setEditingSponsor(null);
    setFormData({
      name: '',
      logo: '',
      url: '',
      tier: activeTab === 'main' ? 'official' : activeTab,
      description: '',
    });
    setShowEditor(true);
  };

  const openEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      logo: sponsor.logo,
      url: sponsor.url,
      tier: sponsor.tier,
      description: sponsor.description || '',
    });
    setShowEditor(true);
  };

  const saveSponsor = () => {
    if (editingSponsor) {
      // Update existing
      setSponsors(sponsors.map(s =>
        s.id === editingSponsor.id
          ? { ...s, ...formData }
          : s
      ));
    } else {
      // Create new
      const newSponsor: Sponsor = {
        id: Date.now().toString(),
        ...formData,
      };
      setSponsors([...sponsors, newSponsor]);
    }

    setShowEditor(false);
    setEditingSponsor(null);
  };

  const deleteSponsor = (id: string) => {
    if (confirm('Are you sure you want to remove this sponsor?')) {
      setSponsors(sponsors.filter(s => s.id !== id));
    }
  };

  const getFilteredSponsors = () => {
    if (activeTab === 'main') {
      return sponsors.filter(s => s.tier === 'main' || s.tier === 'official');
    }
    return sponsors.filter(s => s.tier === activeTab);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">Please login from the admin dashboard first</p>
          <Link href="/admin" className="btn-primary">Go to Admin</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sponsor Manager</h1>
              <p className="text-sm text-white/80">Manage sponsors and partners</p>
            </div>
            <div className="flex items-center gap-4">
              {saved && (
                <span className="text-sm text-green-300 bg-green-900/30 px-3 py-1 rounded-full">
                  Saved!
                </span>
              )}
              <Link href="/admin" className="text-sm text-white/80 hover:text-white">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('main')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === 'main'
                    ? 'bg-celtic-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Main & Official Partners
              </button>
              <button
                onClick={() => setActiveTab('partner')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === 'partner'
                    ? 'bg-celtic-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Club Partners
              </button>
              <button
                onClick={() => setActiveTab('advertiser')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === 'advertiser'
                    ? 'bg-celtic-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Programme Advertisers
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {getFilteredSponsors().length} sponsor{getFilteredSponsors().length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-3">
                <button onClick={saveData} className="btn-secondary text-sm py-2">
                  Save All Changes
                </button>
                <button onClick={openNewSponsor} className="btn-primary text-sm py-2">
                  + Add Sponsor
                </button>
              </div>
            </div>

            {/* Editor Modal */}
            {showEditor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-lg w-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-celtic-dark">
                        {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
                      </h2>
                      <button
                        onClick={() => setShowEditor(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sponsor Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Company Name"
                      />
                    </div>

                    {/* Tier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sponsor Tier
                      </label>
                      <select
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value as Sponsor['tier'] })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="main">Stadium Partner (Main)</option>
                        <option value="official">Official Partner</option>
                        <option value="partner">Club Partner</option>
                        <option value="advertiser">Programme Advertiser</option>
                      </select>
                    </div>

                    {/* Logo Path */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo Path
                      </label>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="/images/sponsors/logo.webp"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload logo to /public/images/sponsors/ first
                      </p>
                    </div>

                    {/* Website URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="text"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="https://example.com"
                      />
                    </div>

                    {/* Description (for official partners) */}
                    {(formData.tier === 'main' || formData.tier === 'official') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Partnership Description
                        </label>
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Official Kit Partner"
                        />
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
                      onClick={saveSponsor}
                      disabled={!formData.name.trim()}
                      className="btn-primary"
                    >
                      {editingSponsor ? 'Update Sponsor' : 'Add Sponsor'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sponsors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredSponsors().map((sponsor) => (
                <div key={sponsor.id} className="card p-5">
                  <div className="flex items-start gap-4">
                    {/* Logo Preview */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {sponsor.logo ? (
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs text-center">No logo</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tierColors[sponsor.tier]}`}>
                          {tierLabels[sponsor.tier]}
                        </span>
                      </div>
                      <h3 className="font-semibold text-celtic-dark truncate">
                        {sponsor.name}
                      </h3>
                      {sponsor.description && (
                        <p className="text-sm text-gray-500 truncate">{sponsor.description}</p>
                      )}
                      {sponsor.url && (
                        <a
                          href={sponsor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-celtic-blue hover:underline truncate block"
                        >
                          {sponsor.url}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => openEditSponsor(sponsor)}
                        className="text-xs text-celtic-blue hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSponsor(sponsor.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredSponsors().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No sponsors in this category</p>
                <button onClick={openNewSponsor} className="btn-primary">
                  Add First Sponsor
                </button>
              </div>
            )}

            {/* Save Button */}
            {sponsors.length > 0 && (
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
