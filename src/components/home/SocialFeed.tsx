'use client';

import Link from 'next/link';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  content: string;
  date: string;
  likes: number;
  image?: string;
}

// Mock social posts - in production would come from social media APIs
const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'twitter',
    content: 'FT: Cwmbran Celtic 3-1 Pontypridd United. A great win at The Park! Goals from Davies (2) and Williams. #UpTheCeltic',
    date: '2025-01-18',
    likes: 45,
  },
  {
    id: '2',
    platform: 'instagram',
    content: 'Match day vibes at The Park! Come support the Celts today. Kickoff 2:30pm.',
    date: '2025-01-18',
    likes: 128,
    image: '/images/social-1.jpg',
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Celtic Bond January draw takes place this Saturday at the clubhouse after the match. Good luck to all members!',
    date: '2025-01-17',
    likes: 67,
  },
  {
    id: '4',
    platform: 'twitter',
    content: 'Training looking sharp ahead of Saturday\'s big game. The lads are ready! #CCAFC',
    date: '2025-01-16',
    likes: 32,
  },
];

const platformIcons = {
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

const platformColors = {
  twitter: 'text-gray-900',
  instagram: 'text-pink-600',
  facebook: 'text-blue-600',
};

const platformLinks = {
  twitter: 'https://twitter.com/CwmbranCelticFC',
  instagram: 'https://instagram.com/cwmbranceltic',
  facebook: 'https://facebook.com/CwmbranCelticAFC',
};

function SocialPostCard({ post }: { post: SocialPost }) {
  return (
    <a
      href={platformLinks[post.platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="card-static p-4 hover:border-celtic-blue transition-colors group block"
    >
      <div className="flex items-start gap-3">
        <div className={`${platformColors[post.platform]} flex-shrink-0`}>
          {platformIcons[post.platform]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 line-clamp-3 group-hover:text-celtic-dark transition-colors">
            {post.content}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {post.likes}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function SocialFeed() {
  return (
    <section className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="section-header">
            <div className="section-header-accent" />
            <div className="section-header-content">
              <h2 className="section-title">Social Feed</h2>
              <p className="section-subtitle">Stay connected with Celtic</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://twitter.com/CwmbranCelticFC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-celtic-blue hover:text-white transition-colors"
              aria-label="Twitter"
            >
              {platformIcons.twitter}
            </a>
            <a
              href="https://instagram.com/cwmbranceltic"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              {platformIcons.instagram}
            </a>
            <a
              href="https://facebook.com/CwmbranCelticAFC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              {platformIcons.facebook}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPosts.map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Follow us on social media using <span className="text-celtic-blue font-semibold">#UpTheCeltic</span>
          </p>
          <div className="flex sm:hidden items-center justify-center gap-3">
            <a
              href="https://twitter.com/CwmbranCelticFC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-celtic-blue hover:text-white transition-colors"
              aria-label="Twitter"
            >
              {platformIcons.twitter}
            </a>
            <a
              href="https://instagram.com/cwmbranceltic"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              {platformIcons.instagram}
            </a>
            <a
              href="https://facebook.com/CwmbranCelticAFC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              {platformIcons.facebook}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
