'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getSession, initializeStaff, type AuthSession } from '@/lib/auth';

// Dynamically import rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-3 min-h-[100px] bg-gray-50 animate-pulse" />
});

// Block types for the newsletter
type BlockType = 'hero' | 'message' | 'results' | 'fixtures' | 'news' | 'standings' | 'cta' | 'image' | 'divider' | 'shop' | 'celticbond' | 'membership' | 'sponsor' | 'volunteer' | 'matchday' | 'playerspotlight' | 'managermessage';

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

// Template presets
interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  blocks: NewsletterBlock[];
}

const defaultBlocks: NewsletterBlock[] = [
  { id: 'hero', type: 'hero', enabled: true, content: { title: 'Weekly Update', subtitle: 'Your Cwmbran Celtic Newsletter', imageUrl: '' } },
  { id: 'managermessage', type: 'managermessage', enabled: false, content: { message: '', managerName: 'Simon Berry', managerTitle: 'First Team Manager' } },
  { id: 'message', type: 'message', enabled: false, content: { text: '' } },
  { id: 'standings', type: 'standings', enabled: true, content: {} },
  { id: 'results', type: 'results', enabled: true, content: { title: 'Recent Results' } },
  { id: 'fixtures', type: 'fixtures', enabled: true, content: { title: 'Upcoming Fixtures' } },
  { id: 'playerspotlight', type: 'playerspotlight', enabled: false, content: { playerName: '', position: '', bio: '', imageUrl: '', stats: '' } },
  { id: 'news', type: 'news', enabled: true, content: { title: 'Latest News' } },
  { id: 'shop', type: 'shop', enabled: false, content: {} },
  { id: 'celticbond', type: 'celticbond', enabled: false, content: {} },
  { id: 'membership', type: 'membership', enabled: false, content: {} },
  { id: 'sponsor', type: 'sponsor', enabled: false, content: {} },
  { id: 'volunteer', type: 'volunteer', enabled: false, content: {} },
  { id: 'matchday', type: 'matchday', enabled: false, content: {} },
  { id: 'cta', type: 'cta', enabled: true, content: { title: 'Support the Club', text: 'Come and support us at the Avondale Motor Park Arena!', buttonText: 'Buy Tickets', buttonUrl: '/tickets' } },
];

const templatePresets: NewsletterTemplate[] = [
  {
    id: 'weekly',
    name: 'Weekly Update',
    description: 'Standard weekly newsletter with results, fixtures & news',
    blocks: defaultBlocks,
  },
  {
    id: 'matchday',
    name: 'Match Day Special',
    description: 'Pre-match newsletter with fixtures and ticket info',
    blocks: defaultBlocks.map(b => ({
      ...b,
      enabled: ['hero', 'fixtures', 'matchday', 'cta'].includes(b.id)
    })),
  },
  {
    id: 'fundraising',
    name: 'Fundraising Focus',
    description: 'Promote Celtic Bond, membership and sponsorship',
    blocks: defaultBlocks.map(b => ({
      ...b,
      enabled: ['hero', 'message', 'celticbond', 'membership', 'sponsor', 'cta'].includes(b.id)
    })),
  },
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
  const [mobilePreview, setMobilePreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

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

  function loadTemplate(template: NewsletterTemplate) {
    setBlocks(JSON.parse(JSON.stringify(template.blocks)));
    setShowTemplates(false);
    setMessage(`Loaded "${template.name}" template`);
    setStatus('success');
    setTimeout(() => setMessage(''), 2000);
  }

  function saveAsTemplate() {
    const name = prompt('Enter a name for this template:');
    if (!name) return;

    const savedTemplates = JSON.parse(localStorage.getItem('newsletter-templates') || '[]');
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name,
      description: 'Custom saved template',
      blocks: JSON.parse(JSON.stringify(blocks)),
    };
    savedTemplates.push(newTemplate);
    localStorage.setItem('newsletter-templates', JSON.stringify(savedTemplates));
    setMessage(`Template "${name}" saved!`);
    setStatus('success');
    setTimeout(() => setMessage(''), 2000);
  }

  function getSavedTemplates(): NewsletterTemplate[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('newsletter-templates') || '[]');
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

      case 'shop':
        return (
          <div className="p-6 md:p-8 bg-gradient-to-r from-celtic-blue to-celtic-blue-dark text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Official Club Shop</h2>
                <p className="text-white/80 text-sm mt-1">Get your official Cwmbran Celtic merchandise - replica kits, training wear, and accessories.</p>
              </div>
            </div>
            <button className="mt-4 w-full px-6 py-3 bg-celtic-yellow text-celtic-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors">
              Shop Now
            </button>
          </div>
        );

      case 'celticbond':
        return (
          <div className="p-6 md:p-8 bg-gradient-to-br from-green-600 to-green-800 text-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display uppercase">Celtic Bond</h2>
              <p className="text-white/80 mt-2">Join the Celtic Bond monthly draw! Win cash prizes while supporting your club.</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-xl font-bold text-celtic-yellow">£100</p>
                  <p className="text-xs opacity-80">1st Prize</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-xl font-bold text-celtic-yellow">£50</p>
                  <p className="text-xs opacity-80">2nd Prize</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-xl font-bold text-celtic-yellow">£25</p>
                  <p className="text-xs opacity-80">3rd Prize</p>
                </div>
              </div>
              <button className="mt-4 px-8 py-3 bg-celtic-yellow text-celtic-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors">
                Join for £5/month
              </button>
            </div>
          </div>
        );

      case 'membership':
        return (
          <div className="p-6 md:p-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Become a Member</h2>
                <p className="text-white/80 text-sm mt-1">Join the Cwmbran Celtic family with official membership. Get exclusive benefits and support grassroots football.</p>
              </div>
            </div>
            <button className="mt-4 w-full px-6 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Join Today
            </button>
          </div>
        );

      case 'sponsor':
        return (
          <div className="p-6 md:p-8 bg-gray-900 text-white">
            <div className="text-center">
              <h2 className="text-xl font-bold text-celtic-yellow">Become a Sponsor</h2>
              <p className="text-white/80 mt-2">Partner with Cwmbran Celtic AFC and reach thousands of local supporters. Sponsorship packages available from £100.</p>
              <div className="mt-4 flex justify-center gap-4 flex-wrap">
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Match Ball Sponsor</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Pitch Side Boards</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Kit Sponsor</span>
              </div>
              <button className="mt-4 px-8 py-3 bg-celtic-yellow text-celtic-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors">
                Sponsorship Enquiry
              </button>
            </div>
          </div>
        );

      case 'volunteer':
        return (
          <div className="p-6 md:p-8 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Volunteer With Us</h2>
                <p className="text-white/80 text-sm mt-1">Help your local club thrive! We need matchday helpers, coaches, and committee members.</p>
              </div>
            </div>
            <button className="mt-4 w-full px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Get Involved
            </button>
          </div>
        );

      case 'matchday':
        return (
          <div className="p-6 md:p-8 bg-celtic-blue text-white">
            <div className="text-center">
              <p className="text-celtic-yellow font-bold text-sm uppercase tracking-wider">Next Home Game</p>
              <h2 className="text-2xl font-display uppercase mt-2">Matchday Experience</h2>
              <p className="text-white/80 mt-2">Join us at the Avondale Motor Park Arena for an unforgettable matchday. Hot food, drinks, and great atmosphere!</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/10 rounded-lg p-3">
                  <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-xs">Free Parking</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs">Gates 1:30pm</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <p className="text-xs">£5 Entry</p>
                </div>
              </div>
              <button className="mt-4 px-8 py-3 bg-celtic-yellow text-celtic-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors">
                View Fixtures
              </button>
            </div>
          </div>
        );

      case 'playerspotlight':
        return (
          <div className="p-6 md:p-8 bg-gradient-to-br from-celtic-blue-dark to-celtic-blue text-white">
            <div className="text-center mb-4">
              <p className="text-celtic-yellow font-bold text-sm uppercase tracking-wider">Player Spotlight</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              {block.content.imageUrl ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-celtic-yellow flex-shrink-0">
                  <Image
                    src={block.content.imageUrl as string}
                    alt={(block.content.playerName as string) || 'Player'}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 border-4 border-celtic-yellow flex-shrink-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-display uppercase">{(block.content.playerName as string) || 'Player Name'}</h2>
                <p className="text-celtic-yellow font-medium">{(block.content.position as string) || 'Position'}</p>
                {block.content.bio ? (
                  <p className="text-white/80 text-sm mt-2">{block.content.bio as string}</p>
                ) : null}
                {block.content.stats ? (
                  <p className="text-xs text-white/60 mt-2">{block.content.stats as string}</p>
                ) : null}
              </div>
            </div>
          </div>
        );

      case 'managermessage':
        return (
          <div className="p-6 md:p-8 bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-celtic-blue flex-shrink-0 flex items-center justify-center text-white text-2xl font-display">
                {((block.content.managerName as string) || 'SB').split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <p className="font-bold text-celtic-dark">{(block.content.managerName as string) || 'Simon Berry'}</p>
                  <p className="text-xs text-gray-500">{(block.content.managerTitle as string) || 'First Team Manager'}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-celtic-blue">
                  {block.content.message ? (
                    <div className="text-gray-700 text-sm prose prose-sm" dangerouslySetInnerHTML={{ __html: block.content.message as string }} />
                  ) : (
                    <p className="text-gray-400 text-sm italic">Add a message from the manager...</p>
                  )}
                </div>
              </div>
            </div>
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
            <div className="flex items-center gap-2 flex-wrap">
              {/* Templates Button */}
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Templates
              </button>

              {/* Mobile Preview Toggle */}
              <button
                onClick={() => setMobilePreview(!mobilePreview)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${mobilePreview ? 'bg-white text-celtic-blue' : 'bg-white/10 hover:bg-white/20'}`}
                title={mobilePreview ? 'Switch to desktop view' : 'Switch to mobile view'}
              >
                {mobilePreview ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

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
              <button onClick={saveDraft} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                Save Draft
              </button>
              <button onClick={saveAsTemplate} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                Save as Template
              </button>
              <button
                onClick={() => sendNewsletter(true)}
                disabled={status === 'loading'}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
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

      {/* Templates Panel */}
      {showTemplates && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-700">Choose a Template</h3>
              <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[...templatePresets, ...getSavedTemplates()].map((template) => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template)}
                  className="p-3 bg-gray-50 hover:bg-celtic-blue hover:text-white rounded-lg text-left transition-colors group"
                >
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-gray-500 group-hover:text-white/70 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
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

                  {/* Message Editor - Rich Text */}
                  {selectedBlockData.type === 'message' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Message</label>
                      <RichTextEditor
                        content={(selectedBlockData.content.text as string) || ''}
                        onChange={(html) => updateBlockContent(selectedBlockData.id, { text: html })}
                        placeholder="Add a personal message to your newsletter..."
                      />
                    </div>
                  )}

                  {/* Manager Message Editor */}
                  {selectedBlockData.type === 'managermessage' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Manager Name</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.managerName as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { managerName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Simon Berry"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.managerTitle as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { managerTitle: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="First Team Manager"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Message</label>
                        <RichTextEditor
                          content={(selectedBlockData.content.message as string) || ''}
                          onChange={(html) => updateBlockContent(selectedBlockData.id, { message: html })}
                          placeholder="Write a message from the manager..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Player Spotlight Editor */}
                  {selectedBlockData.type === 'playerspotlight' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Player Name</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.playerName as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { playerName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Lewis Watkins"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Position</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.position as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { position: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Midfielder"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Photo URL</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.imageUrl as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Bio</label>
                        <textarea
                          value={(selectedBlockData.content.bio as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { bio: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          rows={3}
                          placeholder="Brief player bio..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Stats (optional)</label>
                        <input
                          type="text"
                          value={(selectedBlockData.content.stats as string) || ''}
                          onChange={(e) => updateBlockContent(selectedBlockData.id, { stats: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="10 apps, 3 goals this season"
                        />
                      </div>
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

                  {/* Promotional blocks info */}
                  {['shop', 'celticbond', 'membership', 'sponsor', 'volunteer', 'matchday'].includes(selectedBlockData.type) && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">
                        This is a pre-designed promotional block. Enable it to include in your newsletter.
                      </p>
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                        Tip: These blocks link to the relevant pages on your website.
                      </div>
                    </div>
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
          <div className="flex-1 flex justify-center">
            <div className={`bg-gray-300 rounded-xl p-4 md:p-8 transition-all ${mobilePreview ? 'w-[375px]' : 'w-full'}`}>
              {mobilePreview && (
                <div className="text-center text-xs text-gray-500 mb-2">Mobile Preview (375px)</div>
              )}
              <div className={`mx-auto bg-white shadow-2xl rounded-lg overflow-hidden ${mobilePreview ? 'max-w-[343px]' : 'max-w-[600px]'}`}>
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
