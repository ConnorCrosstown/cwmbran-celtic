import { Metadata } from 'next';
import Link from 'next/link';
import {
  advertisingBoards,
  locationNames,
  sizeDetails,
  getBoardStats,
  getAvailableBoards,
  getSponsoredBoards,
  BoardLocation,
} from '@/data/advertising-boards';

export const metadata: Metadata = {
  title: 'Advertising Boards | Cwmbran Celtic AFC',
  description: 'View available pitch-side advertising boards at Cwmbran Celtic AFC. Support your local club with a sponsorship board.',
};

export default function AdvertisingBoardsPage() {
  const stats = getBoardStats();
  const availableBoards = getAvailableBoards();
  const sponsoredBoards = getSponsoredBoards();

  // Group available boards by location
  const locations: BoardLocation[] = ['main-stand', 'far-side', 'home-end', 'away-end', 'clubhouse'];
  const availableByLocation = locations.map(loc => ({
    location: loc,
    boards: availableBoards.filter(b => b.location === loc)
  })).filter(g => g.boards.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-6 md:py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Pitch-Side Advertising</h1>
          <p className="text-sm text-celtic-yellow max-w-2xl mx-auto">
            Promote your business at every Cwmbran Celtic home match with a pitch-side advertising board.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-4 bg-celtic-yellow">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-celtic-dark">{stats.available}</p>
              <p className="text-xs text-celtic-dark/70">Boards Available</p>
            </div>
            <div className="border-l border-celtic-dark/20 pl-6">
              <p className="text-2xl font-bold text-celtic-dark">{stats.occupancyRate}%</p>
              <p className="text-xs text-celtic-dark/70">Currently Sponsored</p>
            </div>
            <div className="border-l border-celtic-dark/20 pl-6">
              <p className="text-2xl font-bold text-celtic-dark">3</p>
              <p className="text-xs text-celtic-dark/70">Board Sizes</p>
            </div>
            <div className="border-l border-celtic-dark/20 pl-6">
              <p className="text-2xl font-bold text-celtic-dark">£100</p>
              <p className="text-xs text-celtic-dark/70">Starting From</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-celtic-dark text-center mb-6">Board Sizes & Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Premium */}
            <div className="card overflow-hidden border-2 border-celtic-yellow">
              <div className="bg-celtic-yellow px-4 py-2 text-center">
                <span className="text-xs font-bold text-celtic-dark uppercase">Most Popular</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg text-celtic-dark">Premium Board</h3>
                <p className="text-sm text-gray-500 mb-4">{sizeDetails.large.dimensions}</p>
                <p className="text-3xl font-bold text-celtic-blue mb-1">£{sizeDetails.large.price}</p>
                <p className="text-xs text-gray-500 mb-4">per season</p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Maximum visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Prime pitch-side locations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Featured in match photos
                  </li>
                </ul>
                <Link href="/contact?subject=premium-board" className="btn-primary w-full text-sm py-2">
                  Enquire Now
                </Link>
              </div>
            </div>

            {/* Standard */}
            <div className="card p-6 text-center">
              <h3 className="font-bold text-lg text-celtic-dark">Standard Board</h3>
              <p className="text-sm text-gray-500 mb-4">{sizeDetails.standard.dimensions}</p>
              <p className="text-3xl font-bold text-celtic-blue mb-1">£{sizeDetails.standard.price}</p>
              <p className="text-xs text-gray-500 mb-4">per season</p>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Great visibility
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Various locations available
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Perfect for local businesses
                </li>
              </ul>
              <Link href="/contact?subject=standard-board" className="btn-primary w-full text-sm py-2">
                Enquire Now
              </Link>
            </div>

            {/* Budget */}
            <div className="card p-6 text-center">
              <h3 className="font-bold text-lg text-celtic-dark">Budget Board</h3>
              <p className="text-sm text-gray-500 mb-4">{sizeDetails.small.dimensions}</p>
              <p className="text-3xl font-bold text-celtic-blue mb-1">£{sizeDetails.small.price}</p>
              <p className="text-xs text-gray-500 mb-4">per season</p>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Affordable entry point
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Support the club
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Ideal for small businesses
                </li>
              </ul>
              <Link href="/contact?subject=budget-board" className="btn-primary w-full text-sm py-2">
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available Boards */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-celtic-dark text-center mb-2">Available Boards</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            {availableBoards.length} board{availableBoards.length !== 1 ? 's' : ''} currently available for sponsorship
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {availableByLocation.map(({ location, boards }) => (
              <div key={location}>
                <h3 className="font-semibold text-celtic-dark mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {locationNames[location]}
                  <span className="text-xs text-gray-500 font-normal">({boards.length} available)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {boards.map(board => (
                    <div key={board.id} className="card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs text-gray-500">Board #{board.boardNumber}</span>
                          <p className="font-semibold text-celtic-dark">{sizeDetails[board.size].name}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          Available
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{sizeDetails[board.size].dimensions}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-celtic-blue">£{board.pricePerSeason}/season</span>
                        <Link
                          href={`/contact?subject=board-${board.boardNumber}`}
                          className="text-xs text-celtic-blue font-semibold hover:underline"
                        >
                          Enquire →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-celtic-dark text-center mb-2">Current Board Sponsors</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Thank you to all our pitch-side advertisers
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {sponsoredBoards.map(board => (
              <div
                key={board.id}
                className="px-4 py-2 bg-white rounded-full shadow-sm border text-sm font-medium text-gray-700"
              >
                {board.sponsor?.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ground Map Placeholder */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-celtic-dark text-center mb-6">Board Locations</h2>

          <div className="max-w-3xl mx-auto">
            <div className="card p-6">
              {/* Simple pitch diagram */}
              <div className="relative bg-green-600 rounded-lg aspect-[3/2] overflow-hidden">
                {/* Pitch markings */}
                <div className="absolute inset-4 border-2 border-white/50 rounded">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 -translate-x-1/2"></div>
                  <div className="absolute left-1/2 top-1/2 w-16 h-16 border-2 border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Location labels */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                  Away End
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                  Home End
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                  Far Side
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                  Main Stand
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                {locations.map(loc => {
                  const locBoards = advertisingBoards.filter(b => b.location === loc);
                  const available = locBoards.filter(b => b.status === 'available').length;
                  return (
                    <div key={loc} className="p-2 bg-gray-100 rounded">
                      <p className="font-semibold text-celtic-dark">{locationNames[loc]}</p>
                      <p className="text-gray-500">{available}/{locBoards.length} available</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-14 bg-celtic-blue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Ready to Advertise?
          </h2>
          <p className="text-sm text-celtic-yellow max-w-xl mx-auto mb-6">
            Get in touch today to secure your pitch-side advertising board for the season.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact?subject=advertising"
              className="bg-celtic-yellow text-celtic-dark px-6 py-3 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
            >
              Contact Us About Sponsorship
            </Link>
            <Link
              href="/sponsors"
              className="bg-white/10 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              View All Sponsors
            </Link>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-6">
        <div className="container mx-auto px-4 text-center">
          <Link href="/sponsors" className="text-celtic-blue text-sm font-semibold hover:underline">
            ← Back to Sponsors
          </Link>
        </div>
      </section>
    </>
  );
}
