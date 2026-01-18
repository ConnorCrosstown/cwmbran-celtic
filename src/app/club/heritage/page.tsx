import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata = {
  title: 'Heritage & History',
  description: 'Explore 100 years of Cwmbran Celtic AFC history. From our founding in 1925 to the present day, discover the heritage of the Celts.',
};

const timeline = [
  {
    year: '1925',
    title: 'Club Founded',
    description: 'Cwmbran Celtic AFC was established, becoming one of the founding football clubs in the Cwmbran area. The club was formed by a group of local workers looking to provide sporting opportunities for the community.',
    highlight: true,
  },
  {
    year: '1930s',
    title: 'Early Years',
    description: 'The club competed in local leagues, building a reputation for competitive football and community spirit during challenging economic times.',
  },
  {
    year: '1940s',
    title: 'Wartime & Recovery',
    description: 'Like many clubs, Celtic suspended activities during World War II but quickly reformed after the war ended, with many returning servicemen joining the team.',
  },
  {
    year: '1960s',
    title: 'New Town Era',
    description: 'As Cwmbran developed into a new town, the club grew alongside the community. Facilities improved and membership expanded significantly.',
  },
  {
    year: '1990s',
    title: 'Welsh League Football',
    description: 'The club progressed through the Welsh football pyramid, competing at higher levels and establishing itself as a respected club in South Wales football.',
  },
  {
    year: '2000s',
    title: 'Modern Development',
    description: 'Investment in youth development and facilities saw the club continue to grow, producing talented players for both the men\'s and newly formed women\'s teams.',
  },
  {
    year: '2020',
    title: 'Women\'s Team Founded',
    description: 'Cwmbran Celtic Ladies was established, competing in the FAW Women\'s pyramid and marking a significant step forward for the club.',
    highlight: true,
  },
  {
    year: '2025',
    title: 'Centenary Year',
    description: 'The club celebrates 100 years of history, looking forward to the next century while honouring our rich heritage.',
    highlight: true,
  },
];

const honours = [
  { title: 'Gwent County League', years: 'Multiple winners' },
  { title: 'Welsh Football League Division 3', years: 'Promoted 2018' },
  { title: 'FAW Trophy', years: 'Quarter-finalists' },
  { title: 'Local Cup Honours', years: 'Various years' },
];

const legends = [
  { name: 'Player Name', era: '1960s-1970s', position: 'Forward', note: 'All-time leading scorer' },
  { name: 'Player Name', era: '1980s', position: 'Midfielder', note: 'Over 400 appearances' },
  { name: 'Player Name', era: '1990s-2000s', position: 'Defender', note: 'Club captain for 8 seasons' },
  { name: 'Player Name', era: '2010s', position: 'Goalkeeper', note: '150 clean sheets' },
];

export default function HeritagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-celtic-blue-dark via-celtic-blue to-celtic-blue-dark" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-celtic-yellow px-4 py-2 rounded-full mb-6">
              <span className="text-celtic-dark font-bold text-sm uppercase tracking-wide">Est. 1925</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
              100 Years of History
            </h1>
            <p className="text-xl text-white/80 mb-8">
              A century of football, community, and Celtic pride
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-celtic-yellow py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-display text-celtic-dark">100</p>
              <p className="text-celtic-dark/70 text-sm uppercase tracking-wide">Years</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-display text-celtic-dark">3</p>
              <p className="text-celtic-dark/70 text-sm uppercase tracking-wide">Teams</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-display text-celtic-dark">Tier 3</p>
              <p className="text-celtic-dark/70 text-sm uppercase tracking-wide">League Level</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-display text-celtic-dark">1</p>
              <p className="text-celtic-dark/70 text-sm uppercase tracking-wide">Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Timeline"
            subtitle="Key moments in Celtic history"
            centered
          />

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

              {timeline.map((event, index) => (
                <div key={index} className="relative flex gap-6 mb-8 last:mb-0">
                  {/* Year badge */}
                  <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold ${
                    event.highlight
                      ? 'bg-celtic-yellow text-celtic-dark'
                      : 'bg-celtic-blue text-white'
                  }`}>
                    {event.year}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 card-static p-5 ${event.highlight ? 'border-l-4 border-celtic-yellow' : ''}`}>
                    <h3 className="font-bold text-lg text-celtic-dark mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Honours Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Honours"
            subtitle="Achievements throughout our history"
            centered
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {honours.map((honour, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-celtic-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-celtic-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="font-bold text-celtic-dark mb-1">{honour.title}</h3>
                <p className="text-sm text-gray-500">{honour.years}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Legends */}
      <section className="py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Club Legends"
            subtitle="Players who have written themselves into Celtic history"
            centered
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {legends.map((legend, index) => (
              <div key={index} className="card-static p-5 text-center">
                {/* Placeholder for photo */}
                <div className="w-20 h-20 bg-gradient-to-br from-celtic-blue to-celtic-blue-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-celtic-dark">{legend.name}</h3>
                <p className="text-sm text-celtic-blue font-semibold">{legend.position}</p>
                <p className="text-xs text-gray-500 mt-1">{legend.era}</p>
                <p className="text-xs text-gray-600 mt-2 italic">{legend.note}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Help us build our legends archive. If you have information about former players, please <Link href="/contact" className="text-celtic-blue hover:underline">contact us</Link>.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 md:py-20 bg-celtic-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-12 h-12 text-celtic-yellow/50 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-2xl md:text-3xl font-display uppercase text-white mb-6">
              &quot;Cwmbran Celtic is more than a football club - it&apos;s the heart of our community.&quot;
            </blockquote>
            <p className="text-white/70">- Club Centenary Message</p>
          </div>
        </div>
      </section>

      {/* Archive CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <SectionHeader
            title="Explore Our Archive"
            subtitle="Dive deeper into Celtic history with our season-by-season archives"
            centered
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/club/archives" className="btn-primary">
              View Season Archives
            </Link>
            <Link href="/gallery" className="btn-outline">
              Photo Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
