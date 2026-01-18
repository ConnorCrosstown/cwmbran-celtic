'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  type: 'highlights' | 'interview' | 'behind-the-scenes';
}

// Mock video data
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'HIGHLIGHTS | Cwmbran Celtic 3-1 Pontypridd United',
    thumbnail: '/images/video-thumb-1.jpg',
    duration: '4:32',
    date: '2025-01-18',
    type: 'highlights',
  },
  {
    id: '2',
    title: 'POST-MATCH | Manager Simon Berry reacts',
    thumbnail: '/images/video-thumb-2.jpg',
    duration: '2:15',
    date: '2025-01-18',
    type: 'interview',
  },
  {
    id: '3',
    title: 'TRAINING | Getting ready for the big game',
    thumbnail: '/images/video-thumb-3.jpg',
    duration: '3:45',
    date: '2025-01-15',
    type: 'behind-the-scenes',
  },
];

function VideoCard({ video }: { video: Video }) {
  const typeColors = {
    highlights: 'bg-red-600',
    interview: 'bg-celtic-blue',
    'behind-the-scenes': 'bg-purple-600',
  };

  const typeLabels = {
    highlights: 'HIGHLIGHTS',
    interview: 'INTERVIEW',
    'behind-the-scenes': 'BTS',
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3">
        {/* Placeholder for video thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-br from-celtic-blue to-celtic-blue-dark flex items-center justify-center">
          <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
            <svg className="w-6 h-6 text-celtic-blue ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
          {video.duration}
        </div>

        {/* Type badge */}
        <div className={`absolute top-2 left-2 ${typeColors[video.type]} text-white text-xs font-bold px-2 py-1 rounded`}>
          {typeLabels[video.type]}
        </div>
      </div>

      <h4 className="font-semibold text-celtic-dark dark:text-white text-sm leading-tight group-hover:text-celtic-blue dark:group-hover:text-celtic-yellow transition-colors line-clamp-2">
        {video.title}
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {new Date(video.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  );
}

export default function CelticTVSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="section-header">
            <div className="section-header-accent" />
            <div className="section-header-content">
              <h2 className="section-title flex items-center gap-3">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-lg">
                  <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                Celtic TV
              </h2>
              <p className="section-subtitle">Watch highlights, interviews and more</p>
            </div>
          </div>
          <Link
            href="/celtic-tv"
            className="text-celtic-blue dark:text-celtic-yellow font-semibold text-sm hover:underline flex items-center gap-1 group"
          >
            View All
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-10 bg-gradient-to-r from-celtic-blue to-celtic-blue-dark rounded-xl p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-display uppercase text-white mb-2">
            Never Miss a Moment
          </h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Subscribe to our YouTube channel for the latest highlights, interviews, and behind-the-scenes content.
          </p>
          <a
            href="https://youtube.com/@cwmbranceltic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
