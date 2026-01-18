'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DrawResult {
  id: string;
  date: string;
  firstPrize: { name: string; amount: number };
  secondPrize: { name: string; amount: number };
  thirdPrize: { name: string; amount: number };
}

interface CelticBondData {
  currentJackpot: number;
  nextDrawDate: string;
  totalMembers: number;
  monthlyPrice: number;
  recentResults: DrawResult[];
}

// Default data - in production this would come from a database/API
const defaultData: CelticBondData = {
  currentJackpot: 175,
  nextDrawDate: '2025-01-25',
  totalMembers: 87,
  monthlyPrice: 10,
  recentResults: [
    {
      id: '1',
      date: '2024-12-25',
      firstPrize: { name: 'D. Williams', amount: 100 },
      secondPrize: { name: 'S. Jones', amount: 50 },
      thirdPrize: { name: 'M. Davies', amount: 25 },
    },
    {
      id: '2',
      date: '2024-11-25',
      firstPrize: { name: 'R. Thomas', amount: 100 },
      secondPrize: { name: 'A. Evans', amount: 50 },
      thirdPrize: { name: 'C. Morgan', amount: 25 },
    },
  ],
};

export default function CelticBondAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<CelticBondData>(defaultData);
  const [showAddResult, setShowAddResult] = useState(false);
  const [newResult, setNewResult] = useState({
    date: '',
    firstName: '',
    firstAmount: 100,
    secondName: '',
    secondAmount: 50,
    thirdName: '',
    thirdAmount: 25,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      // Load saved data from localStorage
      const savedData = localStorage.getItem('celtic-bond-data');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    }
  }, []);

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('celtic-bond-data', JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const addResult = () => {
    const result: DrawResult = {
      id: Date.now().toString(),
      date: newResult.date,
      firstPrize: { name: newResult.firstName, amount: newResult.firstAmount },
      secondPrize: { name: newResult.secondName, amount: newResult.secondAmount },
      thirdPrize: { name: newResult.thirdName, amount: newResult.thirdAmount },
    };
    setData({
      ...data,
      recentResults: [result, ...data.recentResults],
    });
    setNewResult({
      date: '',
      firstName: '',
      firstAmount: 100,
      secondName: '',
      secondAmount: 50,
      thirdName: '',
      thirdAmount: 25,
    });
    setShowAddResult(false);
  };

  const deleteResult = (id: string) => {
    if (confirm('Are you sure you want to delete this result?')) {
      setData({
        ...data,
        recentResults: data.recentResults.filter(r => r.id !== id),
      });
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
              <h1 className="text-2xl font-bold text-white">Celtic Bond Manager</h1>
              <p className="text-sm text-white/80">Manage the monthly prize draw</p>
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

      {/* Settings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Current Settings */}
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-bold text-celtic-dark mb-4">Current Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Jackpot (£)
                  </label>
                  <input
                    type="number"
                    value={data.currentJackpot}
                    onChange={(e) => setData({ ...data, currentJackpot: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Draw Date
                  </label>
                  <input
                    type="date"
                    value={data.nextDrawDate}
                    onChange={(e) => setData({ ...data, nextDrawDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Members
                  </label>
                  <input
                    type="number"
                    value={data.totalMembers}
                    onChange={(e) => setData({ ...data, totalMembers: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Price (£)
                  </label>
                  <input
                    type="number"
                    value={data.monthlyPrice}
                    onChange={(e) => setData({ ...data, monthlyPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button onClick={saveData} className="btn-primary">
                  Save Settings
                </button>
              </div>
            </div>

            {/* Draw Results */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-celtic-dark">Draw Results</h2>
                <button
                  onClick={() => setShowAddResult(!showAddResult)}
                  className="btn-primary text-sm py-2"
                >
                  + Add Result
                </button>
              </div>

              {/* Add Result Form */}
              {showAddResult && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Add New Draw Result</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Draw Date</label>
                      <input
                        type="date"
                        value={newResult.date}
                        onChange={(e) => setNewResult({ ...newResult, date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <label className="block text-sm font-semibold text-yellow-800 mb-2">1st Prize (£{newResult.firstAmount})</label>
                      <input
                        type="text"
                        placeholder="Winner name"
                        value={newResult.firstName}
                        onChange={(e) => setNewResult({ ...newResult, firstName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">2nd Prize (£{newResult.secondAmount})</label>
                      <input
                        type="text"
                        placeholder="Winner name"
                        value={newResult.secondName}
                        onChange={(e) => setNewResult({ ...newResult, secondName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <label className="block text-sm font-semibold text-orange-800 mb-2">3rd Prize (£{newResult.thirdAmount})</label>
                      <input
                        type="text"
                        placeholder="Winner name"
                        value={newResult.thirdName}
                        onChange={(e) => setNewResult({ ...newResult, thirdName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addResult} className="btn-primary text-sm py-2">
                      Add Result
                    </button>
                    <button
                      onClick={() => setShowAddResult(false)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Results List */}
              <div className="space-y-3">
                {data.recentResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-celtic-dark">
                        {new Date(result.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => deleteResult(result.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-yellow-50 p-2 rounded text-center">
                        <p className="text-xs text-yellow-800">1st - £{result.firstPrize.amount}</p>
                        <p className="font-semibold">{result.firstPrize.name}</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <p className="text-xs text-gray-600">2nd - £{result.secondPrize.amount}</p>
                        <p className="font-semibold">{result.secondPrize.name}</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <p className="text-xs text-orange-800">3rd - £{result.thirdPrize.amount}</p>
                        <p className="font-semibold">{result.thirdPrize.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button onClick={saveData} className="btn-primary">
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
