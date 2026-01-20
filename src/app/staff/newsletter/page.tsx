'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function StaffNewsletterPage() {
  const [preview, setPreview] = useState<NewsletterPreview | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [staffSecret, setStaffSecret] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preview data
    loadPreview();
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
    if (!testEmail || !staffSecret) {
      setMessage('Please enter test email and staff secret.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${staffSecret}`,
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
    if (!staffSecret) {
      setMessage('Please enter staff secret.');
      setStatus('error');
      return;
    }

    if (!confirm(`Are you sure you want to send the newsletter to ${preview?.subscriberCount || 0} subscribers?`)) {
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${staffSecret}`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celtic-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading newsletter preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-celtic-blue text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display uppercase">Newsletter Manager</h1>
              <p className="text-gray-300 mt-1">Preview and send the weekly newsletter</p>
            </div>
            <Link href="/staff" className="text-celtic-yellow hover:text-white transition-colors">
              ← Back to Staff
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

            {/* Authentication */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-celtic-dark mb-3">Staff Authentication</h3>
              <input
                type="password"
                value={staffSecret}
                onChange={(e) => setStaffSecret(e.target.value)}
                placeholder="Staff secret key"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-celtic-blue"
              />
            </div>

            {/* Send Test */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-celtic-dark mb-3">Send Test Email</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-celtic-blue"
                />
                <button
                  onClick={sendTestEmail}
                  disabled={status === 'loading'}
                  className="w-full btn-outline"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Test'}
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
