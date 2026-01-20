'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession, initializeStaff, type AuthSession } from '@/lib/auth';

interface NewsletterPreview {
  recentResults: Array<{
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    competition: string;
  }>;
  upcomingFixtures: Array<{
    date: string;
    time: string;
    homeTeam: string;
    awayTeam: string;
    competition: string;
    venue: string;
  }>;
  latestNews: Array<{
    title: string;
    excerpt: string;
  }>;
  mensPosition?: {
    position: number;
    points: number;
  };
  ladiesPosition?: {
    position: number;
    points: number;
  };
  subscriberCount: number;
}

export default function AdminNewsletterPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [preview, setPreview] = useState<NewsletterPreview | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStaff();
    const existingSession = getSession();
    setSession(existingSession);

    if (existingSession) {
      loadPreview();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function loadPreview() {
    try {
      const response = await fetch('/api/newsletter/preview');
      if (response.ok) {
        const data = await response.json();
        setPreview(data);
      }
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendTestEmail() {
    if (!testEmail) {
      setMessage('Please enter a test email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NEWSLETTER_SECRET || 'admin-session'}`,
        },
        body: JSON.stringify({ customMessage, testEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(`Test email sent to ${testEmail}`);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send test email');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to send test email');
    }
  }

  async function sendToAllSubscribers() {
    if (!confirm(`Are you sure you want to send the newsletter to ${preview?.subscriberCount || 0} subscribers?`)) {
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NEWSLETTER_SECRET || 'admin-session'}`,
        },
        body: JSON.stringify({ customMessage }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send newsletter');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to send newsletter');
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celtic-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading newsletter...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to admin
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-celtic-dark mb-2">Authentication Required</h1>
          <p className="text-gray-500 mb-6">Please log in to access the newsletter manager.</p>
          <Link href="/admin" className="btn-primary">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-celtic-blue text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-display uppercase">Newsletter Manager</h1>
              <p className="text-gray-300 text-sm mt-1">Preview and send the weekly newsletter</p>
            </div>
            <Link href="/admin" className="text-celtic-yellow hover:text-white transition-colors text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-celtic-blue-dark text-white p-4">
                <h2 className="font-bold">Newsletter Preview</h2>
                <p className="text-sm text-gray-300">This is what subscribers will receive</p>
              </div>

              <div className="p-6 space-y-6">
                {/* League Standings */}
                {(preview?.mensPosition || preview?.ladiesPosition) && (
                  <div>
                    <h3 className="font-bold text-celtic-dark mb-3">League Standings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {preview?.ladiesPosition && (
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-gray-500 uppercase">Women&apos;s Team</p>
                          <p className="text-3xl font-display text-celtic-blue">{getOrdinal(preview.ladiesPosition.position)}</p>
                          <p className="text-sm text-gray-600">{preview.ladiesPosition.points} pts</p>
                        </div>
                      )}
                      {preview?.mensPosition && (
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-gray-500 uppercase">Men&apos;s First Team</p>
                          <p className="text-3xl font-display text-celtic-blue">{getOrdinal(preview.mensPosition.position)}</p>
                          <p className="text-sm text-gray-600">{preview.mensPosition.points} pts</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Results */}
                {preview?.recentResults && preview.recentResults.length > 0 && (
                  <div>
                    <h3 className="font-bold text-celtic-dark mb-3">Recent Results</h3>
                    <div className="space-y-2">
                      {preview.recentResults.map((result, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">
                              {result.homeTeam} {result.homeScore} - {result.awayScore} {result.awayTeam}
                            </p>
                            <p className="text-xs text-gray-500">{result.competition}</p>
                          </div>
                          <span className="text-xs text-gray-400">{result.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Fixtures */}
                {preview?.upcomingFixtures && preview.upcomingFixtures.length > 0 && (
                  <div>
                    <h3 className="font-bold text-celtic-dark mb-3">Upcoming Fixtures</h3>
                    <div className="space-y-2">
                      {preview.upcomingFixtures.map((fixture, i) => (
                        <div key={i} className="border-l-4 border-celtic-yellow bg-gray-50 rounded-r-lg p-3">
                          <p className="font-medium text-sm">
                            {fixture.homeTeam} vs {fixture.awayTeam}
                          </p>
                          <p className="text-xs text-gray-500">
                            {fixture.date} • {fixture.time} • {fixture.venue}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Latest News */}
                {preview?.latestNews && preview.latestNews.length > 0 && (
                  <div>
                    <h3 className="font-bold text-celtic-dark mb-3">Latest News</h3>
                    <div className="space-y-2">
                      {preview.latestNews.map((article, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-celtic-blue">{article.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Subscriber Count */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <p className="text-4xl font-display text-celtic-blue">{preview?.subscriberCount || 0}</p>
                <p className="text-gray-600">Active Subscribers</p>
              </div>
            </div>

            {/* Custom Message */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-celtic-dark mb-3">Custom Message</h3>
              <p className="text-sm text-gray-500 mb-3">Add an optional message to this newsletter</p>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="e.g., Big game this weekend! Make sure to come down and support the lads..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-celtic-blue resize-none"
                rows={4}
              />
            </div>

            {/* Send Test */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-celtic-dark mb-3">Send Test Email</h3>
              <p className="text-sm text-gray-500 mb-3">Preview the newsletter in your inbox first</p>
              <div className="space-y-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-celtic-blue"
                />
                <button
                  onClick={sendTestEmail}
                  disabled={status === 'loading'}
                  className="w-full btn-outline"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Test Email'}
                </button>
              </div>
            </div>

            {/* Send to All */}
            <div className="bg-celtic-yellow rounded-2xl p-6">
              <h3 className="font-bold text-celtic-dark mb-3">Send Newsletter</h3>
              <p className="text-sm text-celtic-dark/80 mb-4">
                Send to all {preview?.subscriberCount || 0} active subscribers
              </p>
              <button
                onClick={sendToAllSubscribers}
                disabled={status === 'loading' || !preview?.subscriberCount}
                className="w-full bg-celtic-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-celtic-blue-dark transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send to All Subscribers'}
              </button>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-4 rounded-xl ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                <li>Content is automatically pulled from the site</li>
                <li>Add a custom message for timely updates</li>
                <li>Send a test email to yourself first</li>
                <li>Then send to all subscribers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
