'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
}

// Static search data - pages and content across the site
const searchableContent: SearchResult[] = [
  // Main pages
  { title: 'Home', description: 'Cwmbran Celtic AFC homepage', href: '/', category: 'Pages' },
  { title: 'Fixtures & Results', description: 'View all fixtures and results', href: '/fixtures', category: 'Pages' },
  { title: 'News', description: 'Latest club news and updates', href: '/news', category: 'Pages' },
  { title: 'Contact Us', description: 'Get in touch with the club', href: '/contact', category: 'Pages' },

  // Teams
  { title: "Men's First Team", description: 'JD Cymru South squad and info', href: '/teams/mens', category: 'Teams' },
  { title: "Women's Team", description: 'Genero Adran South squad and info', href: '/teams/ladies', category: 'Teams' },
  { title: 'Development Squad', description: 'Youth development team', href: '/teams/development', category: 'Teams' },
  { title: 'Walking Football', description: 'Over 50s walking football', href: '/teams/walking', category: 'Teams' },

  // Club
  { title: 'Club History', description: '100 years of Celtic history', href: '/club/history', category: 'Club' },
  { title: 'Heritage', description: 'Club heritage and timeline', href: '/club/heritage', category: 'Club' },
  { title: 'Club Officials', description: 'Board and committee members', href: '/club/officials', category: 'Club' },
  { title: 'Season Archives', description: 'Historical season data', href: '/club/archives', category: 'Club' },
  { title: 'Club Documents', description: 'Official club documents', href: '/club/documents', category: 'Club' },

  // Fans
  { title: 'Fan Zone', description: 'Supporters community and engagement', href: '/fans', category: 'Fans' },
  { title: 'Celtic Bond', description: 'Monthly prize draw - support the club', href: '/celtic-bond', category: 'Fans' },
  { title: 'Celtic Card', description: 'Loyalty rewards programme', href: '/celtic-card', category: 'Fans' },
  { title: 'Membership', description: 'Season tickets and membership', href: '/membership', category: 'Fans' },
  { title: 'Gallery', description: 'Photo galleries from matchdays', href: '/gallery', category: 'Fans' },

  // Visit
  { title: 'Visit Us', description: 'Directions and ground info', href: '/visit', category: 'Visit' },
  { title: 'Tickets', description: 'Buy match tickets', href: '/tickets', category: 'Visit' },
  { title: 'Away Fans', description: 'Information for visiting supporters', href: '/visitors', category: 'Visit' },
  { title: 'Hospitality', description: 'Matchday hospitality packages', href: '/hospitality', category: 'Visit' },

  // Commercial
  { title: 'Club Shop', description: 'Official merchandise', href: '/shop', category: 'Commercial' },
  { title: 'Sponsors', description: 'Our club partners', href: '/sponsors', category: 'Commercial' },
  { title: 'Advertising Boards', description: 'Pitch-side advertising', href: '/sponsors/boards', category: 'Commercial' },
  { title: 'Sponsorship Opportunities', description: 'Partner with the club', href: '/sponsors/opportunities', category: 'Commercial' },

  // Community
  { title: 'Community', description: 'Community programmes and initiatives', href: '/community', category: 'Community' },
  { title: 'Youth Football', description: 'Junior football programmes', href: '/community/youth', category: 'Community' },
  { title: 'Coleg Gwent Partnership', description: 'Educational partnership', href: '/community/coleg-gwent', category: 'Community' },

  // Events
  { title: 'Events', description: 'Upcoming club events', href: '/events', category: 'Events' },
  { title: 'Matchday Programme', description: 'Digital matchday programme', href: '/programme', category: 'Events' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery)
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
    setSelectedIndex(0);
  }, []);

  // Handle query changes
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search the site..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((result, index) => (
                <Link
                  key={result.href}
                  href={result.href}
                  onClick={onClose}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    index === selectedIndex
                      ? 'bg-celtic-blue/10 dark:bg-celtic-blue/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-celtic-dark dark:text-white text-sm">
                      {result.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.description}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded">
                    {result.category}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* No results */}
          {query && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No results found for &quot;{query}&quot;
              </p>
            </div>
          )}

          {/* Quick links when no query */}
          {!query && (
            <div className="p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Quick Links
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/fixtures"
                  onClick={onClose}
                  className="text-sm text-celtic-blue dark:text-celtic-yellow hover:underline"
                >
                  Fixtures
                </Link>
                <Link
                  href="/news"
                  onClick={onClose}
                  className="text-sm text-celtic-blue dark:text-celtic-yellow hover:underline"
                >
                  News
                </Link>
                <Link
                  href="/tickets"
                  onClick={onClose}
                  className="text-sm text-celtic-blue dark:text-celtic-yellow hover:underline"
                >
                  Tickets
                </Link>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="text-sm text-celtic-blue dark:text-celtic-yellow hover:underline"
                >
                  Shop
                </Link>
              </div>
            </div>
          )}

          {/* Footer hint */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
            <p className="text-xs text-gray-400 text-center">
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded ml-1">↓</kbd>
              <span className="mx-2">to navigate</span>
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd>
              <span className="ml-2">to select</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
