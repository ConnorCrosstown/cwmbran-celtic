import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Digital Match Programme',
  description: 'Download the official Cwmbran Celtic AFC digital match day programme.',
};

const recentProgrammes = [
  {
    match: 'Cwmbran Celtic vs Llantwit Major',
    date: '12 April 2025',
    competition: 'JD Cymru South',
    downloadUrl: '#',
    featured: true,
  },
  {
    match: 'Cwmbran Celtic vs Baglan Dragons',
    date: '29 March 2025',
    competition: 'JD Cymru South',
    downloadUrl: '#',
  },
  {
    match: 'Cwmbran Celtic vs Afan Lido',
    date: '22 March 2025',
    competition: 'JD Cymru South',
    downloadUrl: '#',
  },
  {
    match: 'Cwmbran Celtic Ladies vs Caldicot Town',
    date: '5 January 2025',
    competition: 'Genero Adran South',
    downloadUrl: '#',
  },
];

export default function ProgrammePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">Digital Match Programme</h1>
          <p className="text-xs text-gray-200">
            Your official matchday companion
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-24 h-32 bg-gradient-to-br from-celtic-blue to-celtic-blue-dark rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <div className="text-center">
                    <span className="text-celtic-yellow text-2xl font-bold block">CC</span>
                    <span className="text-white text-[8px] uppercase tracking-wider">Programme</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-celtic-dark mb-2">Welcome to Our Digital Programme</h2>
                  <p className="text-sm text-gray-700 mb-2">
                    Our digital match programme brings you all the information you need for every home game.
                    Featuring team news, player profiles, opposition info, and much more.
                  </p>
                  <p className="text-sm text-gray-700">
                    Programmes are available to download for free, though printed copies are available at
                    the ground on match days for £2.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Inside */}
            <h2 className="text-lg font-bold text-celtic-dark mb-4">What&apos;s Inside</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="card p-3 text-center">
                <span className="text-2xl mb-2 block">📰</span>
                <p className="text-xs font-semibold text-celtic-dark">Manager&apos;s Notes</p>
              </div>
              <div className="card p-3 text-center">
                <span className="text-2xl mb-2 block">👥</span>
                <p className="text-xs font-semibold text-celtic-dark">Squad Profiles</p>
              </div>
              <div className="card p-3 text-center">
                <span className="text-2xl mb-2 block">📊</span>
                <p className="text-xs font-semibold text-celtic-dark">Stats & Tables</p>
              </div>
              <div className="card p-3 text-center">
                <span className="text-2xl mb-2 block">🏟️</span>
                <p className="text-xs font-semibold text-celtic-dark">Opposition Guide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Programmes */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Recent Programmes</h2>

            <div className="space-y-3">
              {recentProgrammes.map((programme, idx) => (
                <div
                  key={idx}
                  className={`card p-4 ${programme.featured ? 'border-2 border-celtic-yellow' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-celtic-blue rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-celtic-yellow text-xs font-bold">PDF</span>
                      </div>
                      <div>
                        {programme.featured && (
                          <span className="inline-block bg-celtic-yellow text-celtic-dark text-[10px] font-bold px-2 py-0.5 rounded mb-1">
                            LATEST
                          </span>
                        )}
                        <p className="font-semibold text-sm text-celtic-dark">{programme.match}</p>
                        <p className="text-xs text-gray-500">{programme.date} &bull; {programme.competition}</p>
                      </div>
                    </div>
                    <a
                      href={programme.downloadUrl}
                      className="btn-primary text-xs px-3 py-2 text-center"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Looking for older programmes? Contact us and we&apos;ll try to help.
            </p>
          </div>
        </div>
      </section>

      {/* Advertise */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-4 md:p-6 bg-celtic-blue text-white">
              <h2 className="text-lg font-bold mb-2">Advertise in Our Programme</h2>
              <p className="text-sm text-gray-200 mb-4">
                Reach fans on match day with an advert in our official programme. Various sizes and
                packages available to suit your budget.
              </p>
              <Link href="/sponsors#advertising" className="bg-celtic-yellow text-celtic-dark px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400 transition-colors inline-block">
                View Advertising Options
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Never Miss a Programme
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            Follow us on social media to be notified when new programmes are available for download.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="https://twitter.com/cwmbranceltic"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-celtic-dark text-white px-4 py-2 rounded font-semibold text-sm hover:bg-gray-800 transition-colors"
            >
              Twitter/X
            </a>
            <a
              href="https://www.facebook.com/groups/171728059584376"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-celtic-blue text-white px-4 py-2 rounded font-semibold text-sm hover:bg-celtic-blue-dark transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
