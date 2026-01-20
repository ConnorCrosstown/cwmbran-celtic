'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSession, initializeStaff, type AuthSession } from '@/lib/auth';

// Block types for the newsletter
type BlockType = 'hero' | 'message' | 'results' | 'fixtures' | 'news' | 'standings' | 'cta' | 'image' | 'divider';

interface NewsletterBlock {
  id: string;
  type: BlockType;
  enabled: boolean;
  content: Record<string, unknown>;
}

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
    played: number;
    won: number;
    drawn: number;
    lost: number;
  };
  ladiesPosition?: {
    position: number;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
  };
  subscriberCount: number;
}

const defaultBlocks: NewsletterBlock[] = [
  { id: 'hero', type: 'hero', enabled: true, content: { title: 'Weekly Update', subtitle: 'Your Cwmbran Celtic Newsletter', imageUrl: '' } },
  { id: 'message', type: 'message', enabled: false, content: { text: '' } },
  { id: 'standings', type: 'standings', enabled: true, content: {} },
  { id: 'results', type: 'results', enabled: true, content: { title: 'Recent Results' } },
  { id: 'fixtures', type: 'fixtures', enabled: true, content: { title: 'Upcoming Fixtures' } },
  { id: 'news', type: 'news', enabled: true, content: { title: 'Latest News' } },
  { id: 'cta', type: 'cta', enabled: true, content: { title: 'Support the Club', text: 'Come and support us at the Avondale Motor Park Arena!', buttonText: 'Buy Tickets', buttonUrl: '/tickets' } },
];

export default function AdminNewsletterPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [preview, setPreview] = useState<NewsletterPreview | null>(null);
  const [blocks, setBlocks] = useState<NewsletterBlock[]>(defaultBlocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    initializeStaff();
    const existingSession = getSession();
    setSession(existingSession);

    if (existingSession) {
      loadPreview();
      loadSavedDraft();
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

  function loadSavedDraft() {
    const saved = localStorage.getItem('newsletter-draft');
    if (saved) {
      try {
        setBlocks(JSON.parse(saved));
      } catch {
        // Invalid saved data
      }
    }
  }

  function saveDraft() {
    localStorage.setItem('newsletter-draft', JSON.stringify(blocks));
    setMessage('Draft saved!');
    setStatus('success');
    setTimeout(() => setMessage(''), 2000);
  }

  function updateBlock(id: string, updates: Partial<NewsletterBlock>) {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  }

  function updateBlockContent(id: string, content: Record<string, unknown>) {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b));
  }

  function moveBlock(id: string, direction: 'up' | 'down') {
    const index = blocks.findIndex(b => b.id === id);
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setBlocks(newBlocks);
    }
  }

  function addCustomBlock(type: BlockType) {
    const newBlock: NewsletterBlock = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      content: type === 'image' ? { url: '', alt: '', caption: '' } :
               type === 'message' ? { text: '' } :
               type === 'divider' ? {} :
               { title: 'Custom Section', text: '' }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock.id);
  }

  function removeBlock(id: string) {
    // Don't allow removing core blocks
    const coreBlocks = ['hero', 'standings', 'results', 'fixtures', 'news', 'cta'];
    if (coreBlocks.includes(id)) return;
    setBlocks(blocks.filter(b => b.id !== id));
    setSelectedBlock(null);
  }

  async function sendNewsletter(testOnly: boolean) {
    if (testOnly && !testEmail) {
      setMessage('Please enter a test email address.');
      setStatus('error');
      return;
    }

    if (!testOnly && !confirm(`Send newsletter to ${preview?.subscriberCount || 0} subscribers?`)) {
      return;
    }

    setStatus('loading');
    setMessage('');

    // Build newsletter content from blocks
    const enabledBlocks = blocks.filter(b => b.enabled);
    const customMessage = blocks.find(b => b.id === 'message')?.content?.text as string || '';
    const heroBlock = blocks.find(b => b.id === 'hero');

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NEWSLETTER_SECRET || 'admin-session'}`,
        },
        body: JSON.stringify({
          customMessage,
          testEmail: testOnly ? testEmail : undefined,
          blocks: enabledBlocks,
          heroTitle: heroBlock?.content?.title,
          heroSubtitle: heroBlock?.content?.subtitle,
          heroImage: heroBlock?.content?.imageUrl,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(testOnly ? `Test email sent to ${testEmail}` : data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send newsletter');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to send newsletter');
    }
  }

  // Render a block based on its type
  function renderBlock(block: NewsletterBlock, preview: NewsletterPreview | null): React.ReactNode {
    switch (block.type) {
      case 'hero':
        return (
          <div className="bg-gradient-to-br from-celtic-blue-dark to-celtic-blue text-white">
            {block.content.imageUrl ? (
              <div className="relative h-48 md:h-64">
                <Image
                  src={block.content.imageUrl as string}
                  alt="Newsletter header"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-celtic-blue-dark/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={50} height={50} className="rounded-full bg-white p-1" />
                    <span className="text-celtic-yellow font-bold text-sm uppercase tracking-wider">Cwmbran Celtic AFC</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display uppercase">{(block.content.title as string) || 'Weekly Update'}</h1>
                  <p className="text-white/80 mt-1">{(block.content.subtitle as string) || 'Your weekly newsletter'}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={50} height={50} className="rounded-full bg-white p-1" />
                  <span className="text-celtic-yellow font-bold text-sm uppercase tracking-wider">Cwmbran Celtic AFC</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-display uppercase">{(block.content.title as string) || 'Weekly Update'}</h1>
                <p className="text-white/80 mt-1">{(block.content.subtitle as string) || 'Your weekly newsletter'}</p>
              </div>
            )}
          </div>
        );

      case 'message':
        if (!block.content.text) return null;
        return (
          <div className="p-6 md:p-8 bg-blue-50 border-l-4 border-celtic-blue">
            <p className="text-gray-700">{block.content.text as string}</p>
          </div>
        );

      case 'standings':
        if (!preview?.mensPosition && !preview?.ladiesPosition) return null;
        return (
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-celtic-dark mb-4 uppercase tracking-wide">League Standings</h2>
            <div className="grid grid-cols-2 gap-4">
              {preview?.ladiesPosition ? (
                <div className="bg-gradient-to-br from-celtic-blue to-celtic-blue-dark rounded-xl p-4 text-white text-center">
                  <p className="text-xs opacity-80 uppercase">Women&apos;s Team</p>
                  <p className="text-4xl font-display my-2">{getOrdinal(preview.ladiesPosition.position)}</p>
                  <p className="text-celtic-yellow font-bold">{preview.ladiesPosition.points} pts</p>
                  <p className="text-xs opacity-70 mt-1">P{preview.ladiesPosition.played} W{preview.ladiesPosition.won} D{preview.ladiesPosition.drawn} L{preview.ladiesPosition.lost}</p>
                </div>
              ) : null}
              {preview?.mensPosition ? (
                <div className="bg-gradient-to-br from-celtic-blue to-celtic-blue-dark rounded-xl p-4 text-white text-center">
                  <p className="text-xs opacity-80 uppercase">Men&apos;s First Team</p>
                  <p className="text-4xl font-display my-2">{getOrdinal(preview.mensPosition.position)}</p>
                  <p className="text-celtic-yellow font-bold">{preview.mensPosition.points} pts</p>
                  <p className="text-xs opacity-70 mt-1">P{preview.mensPosition.played} W{preview.mensPosition.won} D{preview.mensPosition.drawn} L{preview.mensPosition.lost}</p>
                </div>
              ) : null}
            </div>
          </div>
        );

      case 'results':
        if (!preview?.recentResults || preview.recentResults.length === 0) return null;
        return (
          <div className="p-6 md:p-8 bg-gray-50">
            <h2 className="text-lg font-bold text-celtic-dark mb-4 uppercase tracking-wide">Recent Results</h2>
            <div className="space-y-3">
              {preview.recentResults.map((result, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">{result.homeTeam}</p>
                    </div>
                    <div className="px-4 py-1 bg-celtic-blue text-white font-bold rounded">
                      {result.homeScore} - {result.awayScore}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-medium text-sm text-gray-800">{result.awayTeam}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">{result.competition} • {result.date}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'fixtures':
        if (!preview?.upcomingFixtures || preview.upcomingFixtures.length === 0) return null;
        return (
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-celtic-dark mb-4 uppercase tracking-wide">Upcoming Fixtures</h2>
            <div className="space-y-3">
              {preview.upcomingFixtures.map((fixture, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border-l-4 border-celtic-yellow bg-gray-50 rounded-r-lg">
                  <div className="text-center w-16 flex-shrink-0">
                    <p className="text-sm font-bold text-celtic-blue">{fixture.date}</p>
                    <p className="text-xs text-gray-500">{fixture.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{fixture.homeTeam} vs {fixture.awayTeam}</p>
                    <p className="text-xs text-gray-500">{fixture.venue} • {fixture.competition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'news':
        if (!preview?.latestNews || preview.latestNews.length === 0) return null;
        return (
          <div className="p-6 md:p-8 bg-gray-50">
            <h2 className="text-lg font-bold text-celtic-dark mb-4 uppercase tracking-wide">Latest News</h2>
            <div className="space-y-4">
              {preview.latestNews.map((article, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-celtic-blue hover:underline cursor-pointer">{article.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'image':
        if (!block.content.url) return null;
        return (
          <div className="p-6 md:p-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={block.content.url as string}
                alt={(block.content.alt as string) || ''}
                fill
                className="object-cover"
              />
            </div>
            {block.content.caption ? (
              <p className="text-sm text-gray-500 text-center mt-2">{block.content.caption as string}</p>
            ) : null}
          </div>
        );

      case 'divider':
        return (
          <div className="px-8 py-4">
            <hr className="border-gray-200" />
          </div>
        );

      case 'cta':
        return (
          <div className="p-6 md:p-8 bg-celtic-yellow text-center">
            <h2 className="text-xl font-bold text-celtic-dark">{(block.content.title as string) || 'Support the Club'}</h2>
            <p className="text-celtic-dark/80 mt-1">{(block.content.text as string) || 'Come and support us!'}</p>
            <button className="mt-4 px-8 py-3 bg-celtic-blue text-white font-bold rounded-lg hover:bg-celtic-blue-dark transition-colors">
              {(block.content.buttonText as string) || 'Learn More'}
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celtic-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading newsletter editor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-celtic-dark mb-2">Authentication Required</h1>
          <p className="text-gray-500 mb-6">Please log in to access the newsletter editor.</p>
          <Link href="/admin" className="btn-primary">Go to Admin Login</Link>
        </div>
      </div>
    );
  }

  const selectedBlockData = blocks.find(b => b.id === selectedBlock);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-celtic-blue text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-white/70 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Newsletter Editor</h1>
                <p className="text-xs text-white/70">{preview?.subscriberCount || 0} subscribers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="bg-white/10 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'edit' ? 'bg-white text-celtic-blue' : 'text-white/70 hover:text-white'}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'preview' ? 'bg-white text-celtic-blue' : 'text-white/70 hover:text-white'}`}
                >
                  Preview
                </button>
              </div>
              <button onClick={saveDraft} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                Save Draft
              </button>
              <button
                onClick={() => sendNewsletter(true)}
                disabled={status === 'loading'}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                Test Send
              </button>
              <button
                onClick={() => sendNewsletter(false)}
                disabled={status === 'loading' || !preview?.subscriberCount}
                className="px-4 py-2 bg-celtic-yellow text-celtic-dark rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Newsletter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`py-2 px-4 text-center text-sm ${status === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message}
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Block Controls */}
          {viewMode === 'edit' && (
            <div className="w-72 flex-shrink-0 space-y-4">
              {/* Add Blocks */}
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-sm text-gray-700 mb-3">Add Content</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addCustomBlock('message')}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                  >
                    <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="text-xs">Message</span>
                  </button>
                  <button
                    onClick={() => addCustomBlock('image')}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                  >
                    <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Image</span>
                  </button>
                  <button
                    onClick={() => addCustomBlock('divider')}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                  >
                    <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    <span className="text-xs">Divider</span>
                  </button>
                </div>
              </div>

              {/* Block List */}
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-sm text-gray-700 mb-3">Content Blocks</h3>
                <div className="space-y-2">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlock(block.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${selectedBlock === block.id ? 'bg-celtic-blue text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={block.enabled}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateBlock(block.id, { enabled: e.target.checked });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm font-medium capitalize">{block.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                            disabled={index === 0}
                            className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                            disabled={index === blocks.length - 1}
                            className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Block Editor */}
              {selectedBlockData && (
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-gray-700 capitalize">Edit {selectedBlockData.type}</h3>
                    {!['hero', 'standings', 'results', 'fixtures', 'news', 'cta'].includes(selectedBlockData.id) && (
                      <button
                        onClick={() => removeBlock(selectedBlockData.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Hero Editor */}
                  {selectedBlockData.type === 'hero' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.title as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Weekly Update"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.subtitle as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { subtitle: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Your Cwmbran Celtic Newsletter"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hero Image URL</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.imageUrl as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Message Editor */}
                  {selectedBlockData.type === 'message' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Message</label>
                      <textarea
                        value={(selectedBlockData.content.text as string) || ''}
                        onChange={(e) => updateBlockContent(selectedBlockData.id, { text: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={4}
                        placeholder="Add a personal message to your newsletter..."
                      />
                    </div>
                  )}

                  {/* Image Editor */}
                  {selectedBlockData.type === 'image' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.url as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { url: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.alt as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { alt: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Image description"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Caption</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.caption as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { caption: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Optional caption"
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA Editor */}
                  {selectedBlockData.type === 'cta' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.title as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Text</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.text as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { text: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.buttonText as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { buttonText: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Auto-content blocks info */}
                  {['standings', 'results', 'fixtures', 'news'].includes(selectedBlockData.type) && (
                    <p className="text-xs text-gray-500">
                      This content is automatically populated from the website.
                    </p>
                  )}
                </div>
              )}

              {/* Test Email */}
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-sm text-gray-700 mb-3">Test Email</h3>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-500">Send a test before publishing</p>
              </div>
            </div>
          )}

          {/* Email Preview */}
          <div className="flex-1">
            <div className="bg-gray-300 rounded-xl p-4 md:p-8">
              <div className="max-w-[600px] mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
                {/* Email Content */}
                {blocks.filter(b => b.enabled).map((block) => (
                  <div
                    key={block.id}
                    onClick={() => viewMode === 'edit' && setSelectedBlock(block.id)}
                    className={`${viewMode === 'edit' ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-celtic-blue hover:outline-offset-2' : ''} ${selectedBlock === block.id && viewMode === 'edit' ? 'outline outline-2 outline-celtic-blue outline-offset-2' : ''}`}
                  >
                    {renderBlock(block, preview)}
                  </div>
                ))}

                {/* Footer */}
                <div className="bg-gray-800 text-white p-6 md:p-8 text-center">
                  <Image src="/images/club-logo.webp" alt="Cwmbran Celtic" width={40} height={40} className="mx-auto mb-3 rounded-full bg-white p-1" />
                  <p className="font-bold">Cwmbran Celtic AFC</p>
                  <p className="text-xs text-gray-400 mt-1">Avondale Motor Park Arena, Henllys Way, Cwmbran NP44 6NB</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="text-xs text-gray-400 hover:text-white cursor-pointer">Website</span>
                    <span className="text-xs text-gray-400 hover:text-white cursor-pointer">Contact</span>
                    <span className="text-xs text-gray-400 hover:text-white cursor-pointer">Unsubscribe</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">© 2026 Cwmbran Celtic AFC. All rights reserved.</p>
                </div>
              </div>
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
