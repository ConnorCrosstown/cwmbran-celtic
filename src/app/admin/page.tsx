'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBoardStats } from '@/data/advertising-boards';
import {
  initializeStaff,
  authenticateStaff,
  createSession,
  getSession,
  endSession,
  requestPasswordReset,
  roleLabels,
  type AuthSession,
} from '@/lib/auth';

export default function AdminDashboard() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const boardStats = getBoardStats();

  // Check for existing session on mount
  useEffect(() => {
    initializeStaff();
    const existingSession = getSession();
    setSession(existingSession);
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = authenticateStaff(email, password);

    if (result.success && result.staff) {
      createSession(result.staff);
      setSession(getSession());
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    endSession();
    setSession(null);
    setEmail('');
    setPassword('');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const result = requestPasswordReset(email);
    setResetMessage(result.message);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetMessage('');
    }, 3000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-celtic-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Login screen
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-celtic-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-celtic-dark">Staff Login</h1>
            <p className="text-sm text-gray-500">Cwmbran Celtic AFC Admin</p>
          </div>

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              {resetMessage && (
                <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{resetMessage}</p>
              )}

              <button type="submit" className="btn-primary w-full py-3">
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-sm text-gray-500 hover:text-celtic-blue"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <button type="submit" className="btn-primary w-full py-3">
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="w-full text-sm text-gray-500 hover:text-celtic-blue"
              >
                Forgot password?
              </button>
            </form>
          )}

          <Link href="/" className="block text-center text-sm text-gray-500 mt-6 hover:text-celtic-blue">
            Back to Website
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated dashboard
  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue py-4 sm:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-white/80">Cwmbran Celtic AFC Management</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-white">{session.staffName}</p>
                <p className="text-xs text-white/70">{roleLabels[session.role]}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Link href="/admin/staff" className="text-xs sm:text-sm text-white/80 hover:text-white px-2 sm:px-3 py-1.5 sm:py-1 rounded hover:bg-white/10">
                  Staff
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm text-white/80 hover:text-white px-2 sm:px-3 py-1.5 sm:py-1 rounded hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-4 sm:py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="card p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Board Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-celtic-dark">£{boardStats.totalRevenue.toLocaleString()}</p>
              <p className="text-[10px] sm:text-xs text-green-600">This season</p>
            </div>
            <div className="card p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Available</p>
              <p className="text-lg sm:text-2xl font-bold text-celtic-dark">{boardStats.available}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">of {boardStats.total} total</p>
            </div>
            <div className="card p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Renewals</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">{boardStats.renewalDue}</p>
              <p className="text-[10px] sm:text-xs text-orange-600">Need attention</p>
            </div>
            <div className="card p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Occupancy</p>
              <p className="text-lg sm:text-2xl font-bold text-celtic-dark">{boardStats.occupancyRate}%</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Board sponsorship</p>
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
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
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
                  <svg className="w-7 h-7 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
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

            {/* Celtic Bond Manager */}
            <Link href="/admin/celtic-bond" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Celtic Bond Manager
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage monthly draw and members
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Ticket Pricing Manager */}
            <Link href="/admin/tickets" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Ticket Pricing
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage match day and season ticket prices
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* News Manager */}
            <Link href="/admin/news" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    News Manager
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Post news articles and updates
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Sponsor Manager */}
            <Link href="/admin/sponsors" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Sponsor Manager
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage sponsors and partners
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Volunteer Submissions */}
            <Link href="/admin/volunteers" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Volunteer Submissions
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage volunteer sign-ups
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Sponsor Inquiries */}
            <Link href="/admin/inquiries" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Sponsor Inquiries
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Review sponsorship requests
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Newsletter Manager */}
            <Link href="/admin/newsletter" className="card p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                  <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                    Newsletter
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Send weekly updates to subscribers
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">Auto-content</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Staff Management - Super Admin Only */}
            {(session.role === 'super_admin' || session.role === 'admin') && (
              <Link href="/admin/staff" className="card p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-celtic-dark group-hover:text-celtic-blue transition-colors">
                      Staff Management
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage staff accounts and permissions
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">Admin Only</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold text-celtic-dark mb-4">Quick Links - View Public Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Link href="/tickets" className="card p-4 text-center hover:shadow-md transition-shadow">
              <svg className="w-6 h-6 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p className="text-sm font-semibold text-celtic-dark">Tickets Page</p>
            </Link>
            <Link href="/celtic-bond" className="card p-4 text-center hover:shadow-md transition-shadow">
              <svg className="w-6 h-6 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-celtic-dark">Celtic Bond</p>
            </Link>
            <Link href="/news" className="card p-4 text-center hover:shadow-md transition-shadow">
              <svg className="w-6 h-6 mx-auto mb-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-sm font-semibold text-celtic-dark">News Page</p>
            </Link>
            <Link href="/sponsors" className="card p-4 text-center hover:shadow-md transition-shadow">
              <svg className="w-6 h-6 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-semibold text-celtic-dark">Sponsors Page</p>
            </Link>
            <Link href="/sponsors/boards" className="card p-4 text-center hover:shadow-md transition-shadow">
              <svg className="w-6 h-6 mx-auto mb-2 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <p className="text-sm font-semibold text-celtic-dark">Ad Boards</p>
            </Link>
            <Link href="/programme" className="card p-4 text-center hover:shadow-md transition-shadow">
              <svg className="w-6 h-6 mx-auto mb-2 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-sm font-semibold text-celtic-dark">Programmes</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with session info */}
      <section className="py-4 bg-gray-100 border-t">
        <div className="container mx-auto px-4">
          <p className="text-xs text-gray-500 text-center">
            Logged in as {session.staffEmail} since {new Date(session.loginTime).toLocaleString()}
          </p>
        </div>
      </section>
    </>
  );
}
