'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TicketPricingData {
  matchDay: {
    mens: { adult: number; concession: number; under16: number };
    womens: { adult: number; concession: number; under16: number };
  };
  seasonTickets: {
    earlyBirdEnds: string;
    superEarlyBirdEnds: string;
    superEarlyBirdLimit: number;
    mens: {
      superEarlyBird: { adult: number; concession: number };
      earlyBird: { adult: number; concession: number; family: number };
      standard: { adult: number; concession: number; family: number };
    };
    womens: {
      superEarlyBird: { adult: number; concession: number };
      earlyBird: { adult: number; concession: number };
      standard: { adult: number; concession: number };
    };
    golden: {
      superEarlyBird: { adult: number; concession: number };
      earlyBird: { adult: number; concession: number };
      standard: { adult: number; concession: number };
    };
  };
  giftPack: {
    extraCost: number;
  };
}

const defaultData: TicketPricingData = {
  matchDay: {
    mens: { adult: 7.50, concession: 5.00, under16: 0 },
    womens: { adult: 3.50, concession: 2.50, under16: 0 },
  },
  seasonTickets: {
    earlyBirdEnds: '2026-01-31',
    superEarlyBirdEnds: '2026-01-20',
    superEarlyBirdLimit: 50,
    mens: {
      superEarlyBird: { adult: 65, concession: 45 },
      earlyBird: { adult: 75, concession: 50, family: 130 },
      standard: { adult: 85, concession: 57, family: 150 },
    },
    womens: {
      superEarlyBird: { adult: 20, concession: 14 },
      earlyBird: { adult: 24, concession: 17 },
      standard: { adult: 28, concession: 20 },
    },
    golden: {
      superEarlyBird: { adult: 99, concession: 70 },
      earlyBird: { adult: 115, concession: 80 },
      standard: { adult: 130, concession: 90 },
    },
  },
  giftPack: {
    extraCost: 5,
  },
};

export default function TicketsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<TicketPricingData>(defaultData);
  const [activeTab, setActiveTab] = useState<'matchday' | 'season' | 'golden'>('matchday');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      const savedData = localStorage.getItem('ticket-pricing-data');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    }
  }, []);

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ticket-pricing-data', JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
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
              <h1 className="text-2xl font-bold text-white">Ticket Pricing Manager</h1>
              <p className="text-sm text-white/80">Update match day and season ticket prices</p>
            </div>
            <div className="flex items-center gap-4">
              {saved && (
                <span className="text-sm text-green-300 bg-green-900/30 px-3 py-1 rounded-full">
                  Saved!
                </span>
              )}
              <Link href="/admin" className="text-sm text-white/80 hover:text-white">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('matchday')}
              className={`px-6 py-3 font-semibold text-sm ${activeTab === 'matchday' ? 'bg-white text-celtic-blue border-b-2 border-celtic-blue' : 'text-gray-600 hover:text-celtic-blue'}`}
            >
              Match Day
            </button>
            <button
              onClick={() => setActiveTab('season')}
              className={`px-6 py-3 font-semibold text-sm ${activeTab === 'season' ? 'bg-white text-celtic-blue border-b-2 border-celtic-blue' : 'text-gray-600 hover:text-celtic-blue'}`}
            >
              Season Tickets
            </button>
            <button
              onClick={() => setActiveTab('golden')}
              className={`px-6 py-3 font-semibold text-sm ${activeTab === 'golden' ? 'bg-white text-celtic-yellow border-b-2 border-celtic-yellow' : 'text-gray-600 hover:text-celtic-yellow'}`}
            >
              Golden Ticket
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Match Day Pricing */}
            {activeTab === 'matchday' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-celtic-dark mb-4">Men&apos;s Match Day Tickets</h2>
                  <p className="text-sm text-gray-500 mb-4">15 home league games per season</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adult (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={data.matchDay.mens.adult}
                        onChange={(e) => setData({
                          ...data,
                          matchDay: {
                            ...data.matchDay,
                            mens: { ...data.matchDay.mens, adult: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Concession (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={data.matchDay.mens.concession}
                        onChange={(e) => setData({
                          ...data,
                          matchDay: {
                            ...data.matchDay,
                            mens: { ...data.matchDay.mens, concession: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Under 16s (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={data.matchDay.mens.under16}
                        onChange={(e) => setData({
                          ...data,
                          matchDay: {
                            ...data.matchDay,
                            mens: { ...data.matchDay.mens, under16: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <p className="text-xs text-green-600 mt-1">0 = FREE</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-bold text-celtic-dark mb-4">Women&apos;s Match Day Tickets</h2>
                  <p className="text-sm text-gray-500 mb-4">8 home league games per season</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adult (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={data.matchDay.womens.adult}
                        onChange={(e) => setData({
                          ...data,
                          matchDay: {
                            ...data.matchDay,
                            womens: { ...data.matchDay.womens, adult: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Concession (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={data.matchDay.womens.concession}
                        onChange={(e) => setData({
                          ...data,
                          matchDay: {
                            ...data.matchDay,
                            womens: { ...data.matchDay.womens, concession: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Under 16s (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={data.matchDay.womens.under16}
                        onChange={(e) => setData({
                          ...data,
                          matchDay: {
                            ...data.matchDay,
                            womens: { ...data.matchDay.womens, under16: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <p className="text-xs text-green-600 mt-1">0 = FREE</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Season Tickets */}
            {activeTab === 'season' && (
              <div className="space-y-6">
                {/* Dates */}
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-celtic-dark mb-4">Important Dates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Super Early Bird Ends</label>
                      <input
                        type="date"
                        value={data.seasonTickets.superEarlyBirdEnds}
                        onChange={(e) => setData({
                          ...data,
                          seasonTickets: { ...data.seasonTickets, superEarlyBirdEnds: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Early Bird Ends</label>
                      <input
                        type="date"
                        value={data.seasonTickets.earlyBirdEnds}
                        onChange={(e) => setData({
                          ...data,
                          seasonTickets: { ...data.seasonTickets, earlyBirdEnds: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Super Early Bird Limit</label>
                      <input
                        type="number"
                        value={data.seasonTickets.superEarlyBirdLimit}
                        onChange={(e) => setData({
                          ...data,
                          seasonTickets: { ...data.seasonTickets, superEarlyBirdLimit: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Men's Season Tickets */}
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-celtic-dark mb-4">Men&apos;s Season Tickets</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Tier</th>
                          <th className="text-left py-2">Adult (£)</th>
                          <th className="text-left py-2">Concession (£)</th>
                          <th className="text-left py-2">Family (£)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Super Early Bird</td>
                          <td><input type="number" value={data.seasonTickets.mens.superEarlyBird.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, superEarlyBird: {...data.seasonTickets.mens.superEarlyBird, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.mens.superEarlyBird.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, superEarlyBird: {...data.seasonTickets.mens.superEarlyBird, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td className="text-gray-400">-</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Early Bird</td>
                          <td><input type="number" value={data.seasonTickets.mens.earlyBird.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, earlyBird: {...data.seasonTickets.mens.earlyBird, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.mens.earlyBird.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, earlyBird: {...data.seasonTickets.mens.earlyBird, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.mens.earlyBird.family} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, earlyBird: {...data.seasonTickets.mens.earlyBird, family: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Standard</td>
                          <td><input type="number" value={data.seasonTickets.mens.standard.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, standard: {...data.seasonTickets.mens.standard, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.mens.standard.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, standard: {...data.seasonTickets.mens.standard, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.mens.standard.family} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, mens: {...data.seasonTickets.mens, standard: {...data.seasonTickets.mens.standard, family: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Women's Season Tickets */}
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-celtic-dark mb-4">Women&apos;s Season Tickets</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Tier</th>
                          <th className="text-left py-2">Adult (£)</th>
                          <th className="text-left py-2">Concession (£)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Super Early Bird</td>
                          <td><input type="number" value={data.seasonTickets.womens.superEarlyBird.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, womens: {...data.seasonTickets.womens, superEarlyBird: {...data.seasonTickets.womens.superEarlyBird, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.womens.superEarlyBird.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, womens: {...data.seasonTickets.womens, superEarlyBird: {...data.seasonTickets.womens.superEarlyBird, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Early Bird</td>
                          <td><input type="number" value={data.seasonTickets.womens.earlyBird.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, womens: {...data.seasonTickets.womens, earlyBird: {...data.seasonTickets.womens.earlyBird, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.womens.earlyBird.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, womens: {...data.seasonTickets.womens, earlyBird: {...data.seasonTickets.womens.earlyBird, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Standard</td>
                          <td><input type="number" value={data.seasonTickets.womens.standard.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, womens: {...data.seasonTickets.womens, standard: {...data.seasonTickets.womens.standard, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.womens.standard.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, womens: {...data.seasonTickets.womens, standard: {...data.seasonTickets.womens.standard, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Gift Pack */}
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-celtic-dark mb-4">Gift a Ticket - Gift Pack</h2>
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Extra Cost for Gift Pack (£)</label>
                    <input
                      type="number"
                      value={data.giftPack.extraCost}
                      onChange={(e) => setData({
                        ...data,
                        giftPack: { extraCost: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Includes scarf, badge, welcome letter</p>
                  </div>
                </div>
              </div>
            )}

            {/* Golden Ticket */}
            {activeTab === 'golden' && (
              <div className="space-y-6">
                <div className="card p-6 border-2 border-celtic-yellow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">⭐</span>
                    <h2 className="text-lg font-bold text-celtic-dark">Golden Season Ticket</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">All Men&apos;s, Women&apos;s, and Cup games included</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Tier</th>
                          <th className="text-left py-2">Adult (£)</th>
                          <th className="text-left py-2">Concession (£)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Super Early Bird</td>
                          <td><input type="number" value={data.seasonTickets.golden.superEarlyBird.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, golden: {...data.seasonTickets.golden, superEarlyBird: {...data.seasonTickets.golden.superEarlyBird, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.golden.superEarlyBird.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, golden: {...data.seasonTickets.golden, superEarlyBird: {...data.seasonTickets.golden.superEarlyBird, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Early Bird</td>
                          <td><input type="number" value={data.seasonTickets.golden.earlyBird.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, golden: {...data.seasonTickets.golden, earlyBird: {...data.seasonTickets.golden.earlyBird, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.golden.earlyBird.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, golden: {...data.seasonTickets.golden, earlyBird: {...data.seasonTickets.golden.earlyBird, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Standard</td>
                          <td><input type="number" value={data.seasonTickets.golden.standard.adult} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, golden: {...data.seasonTickets.golden, standard: {...data.seasonTickets.golden.standard, adult: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                          <td><input type="number" value={data.seasonTickets.golden.standard.concession} onChange={(e) => setData({...data, seasonTickets: {...data.seasonTickets, golden: {...data.seasonTickets.golden, standard: {...data.seasonTickets.golden.standard, concession: parseInt(e.target.value) || 0}}}})} className="w-20 px-2 py-1 border rounded" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6">
              <button onClick={saveData} className="btn-primary">
                Save All Pricing
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Note: Changes will be saved locally. In production, this would update the database.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
