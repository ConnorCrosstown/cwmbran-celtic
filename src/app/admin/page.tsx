'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBoardStats } from '@/data/advertising-boards';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const boardStats = getBoardStats();

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'celtic2025') {
      setIsAuthenticated(true);
      // Store auth in sessionStorage so it persists during navigation
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin-auth', 'true');
      }
    } else {
      alert('Incorrect password');
    }
  };

  // Password screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-celtic-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-xl font-bold text-celtic-dark">Admin Area</h1>
            <p className="text-sm text-gray-500">Enter password to access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border rounded-lg text-center text-lg tracking-widest"
              autoFocus
            />
            <button type="submit" className="btn-primary w-full py-3">
              Access Admin
            </button>
          </form>

          <Link href="/" className="block text-center text-sm text-gray-500 mt-6 hover:text-celtic-blue">
            ← Back to Website
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-white/80">Cwmbran Celtic AFC Management</p>
            </div>
            <Link href="/" className="text-sm text-white/80 hover:text-white">
              ← Back to Website
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Board Revenue</p>
              <p className="text-2xl font-bold text-celtic-dark">£{boardStats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">This season</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Available Boards</p>
              <p className="text-2xl font-bold text-celtic-dark">{boardStats.available}</p>
              <p className="text-xs text-gray-500">of {boardStats.total} total</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Renewals Due</p>
              <p className="text-2xl font-bold text-orange-600">{boardStats.renewalDue}</p>
              <p className="text-xs text-orange-600">Need attention</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Occupancy</p>
              <p className="text-2xl font-bold text-celtic-dark">{boardStats.occupancyRate}%</p>
              <p className="text-xs text-gray-500">Board sponsorship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Sections */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold text-celtic-dark mb-4">Management Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Programme Generator */}
            <Link href="/admin/programme" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-lg flex items-center justify-center group-hover:bg-celtic-blue/20 transition-colors">
                  <span className="text-3xl">📰</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Programme Generator
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Create and manage digital match day programmes
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Advertising Boards */}
            <Link href="/admin/advertising" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-celtic-yellow/20 rounded-lg flex items-center justify-center group-hover:bg-celtic-yellow/30 transition-colors">
                  <span className="text-3xl">📋</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Advertising Boards
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage pitch-side sponsors and renewals
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {boardStats.sponsored} Sponsored
                    </span>
                    {boardStats.renewalDue > 0 && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                        {boardStats.renewalDue} Renewals
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {/* Future: Celtic Bond Manager */}
            <div className="card p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🎫</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-400">Celtic Bond Manager</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage monthly draw and members
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Future: Squad Manager */}
            <div className="card p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">👥</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-400">Squad Manager</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Update player profiles and squad details
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Future: Fixture Manager */}
            <div className="card p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📅</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-400">Fixture Manager</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Update fixtures and results
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Future: News Manager */}
            <div className="card p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">✏️</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-400">News Manager</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Post news articles and updates
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold text-celtic-dark mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/sponsors/boards" className="card p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-xl block mb-1">🌐</span>
              <p className="text-sm font-semibold text-celtic-dark">View Boards Page</p>
              <p className="text-xs text-gray-500">Public view</p>
            </Link>
            <Link href="/programme" className="card p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-xl block mb-1">📰</span>
              <p className="text-sm font-semibold text-celtic-dark">View Programmes</p>
              <p className="text-xs text-gray-500">Public view</p>
            </Link>
            <Link href="/sponsors" className="card p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-xl block mb-1">🤝</span>
              <p className="text-sm font-semibold text-celtic-dark">Sponsors Page</p>
              <p className="text-xs text-gray-500">Public view</p>
            </Link>
            <Link href="/contact" className="card p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-xl block mb-1">📧</span>
              <p className="text-sm font-semibold text-celtic-dark">Contact Form</p>
              <p className="text-xs text-gray-500">Check enquiries</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
