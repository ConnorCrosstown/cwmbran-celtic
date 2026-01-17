import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events at Cwmbran Celtic AFC. Quiz nights, race nights, golf day, awards evening and more.',
};

interface ClubEvent {
  title: string;
  date: string;
  time: string;
  description: string;
  price?: string;
  category: 'social' | 'fundraiser' | 'awards' | 'family';
  featured?: boolean;
}

const upcomingEvents: ClubEvent[] = [
  {
    title: 'Monthly Quiz Night',
    date: 'First Friday of every month',
    time: '7:30pm',
    description: 'Test your knowledge at our popular monthly quiz. Teams of up to 6 people. Cash prizes for winners!',
    price: '£2 per person',
    category: 'social',
  },
  {
    title: 'Race Night',
    date: 'Saturday 15th February 2027',
    time: '7:00pm',
    description: 'An evening of horse racing fun! Sponsor a race, buy a horse, or just enjoy the entertainment. Bar open all evening.',
    price: '£5 entry',
    category: 'fundraiser',
    featured: true,
  },
  {
    title: 'Celtic Golf Day',
    date: 'Friday 16th May 2027',
    time: '10:00am Tee Off',
    description: 'Annual golf day at Alice Springs Golf Club. 18 holes, dinner, and prizes. Teams of 4.',
    price: '£40 per person',
    category: 'social',
    featured: true,
  },
  {
    title: 'End of Season Awards Evening',
    date: 'Saturday 24th May 2027',
    time: '7:00pm',
    description: 'Celebrate the season with our players at the annual awards night. Three-course dinner, awards presentations, and entertainment.',
    price: '£25 per person',
    category: 'awards',
    featured: true,
  },
  {
    title: 'Family Fun Day',
    date: 'Sunday 8th June 2027',
    time: '12:00pm - 5:00pm',
    description: 'Fun for all the family with games, stalls, bouncy castles, and food. Plus special appearances from the squad!',
    price: 'Free entry',
    category: 'family',
  },
  {
    title: 'Summer BBQ & Presentation',
    date: 'Saturday 21st June 2027',
    time: '2:00pm',
    description: 'Join us for a summer BBQ as we look ahead to next season. Live music, food, and drinks.',
    price: '£10 adults / Kids free',
    category: 'social',
  },
];

const getCategoryBadge = (category: ClubEvent['category']) => {
  const badges = {
    social: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    fundraiser: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    awards: 'bg-celtic-yellow text-celtic-dark',
    family: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
  const labels = {
    social: 'Social',
    fundraiser: 'Fundraiser',
    awards: 'Awards',
    family: 'Family',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded ${badges[category]}`}>
      {labels[category]}
    </span>
  );
};

export default function EventsPage() {
  const featuredEvents = upcomingEvents.filter((e) => e.featured);
  const regularEvents = upcomingEvents.filter((e) => !e.featured);

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Events</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Join us for social events, fundraisers, and celebrations throughout the season
          </p>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title text-center">Featured Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {featuredEvents.map((event, index) => (
                <div
                  key={index}
                  className="card overflow-hidden border-2 border-celtic-blue"
                >
                  <div className="bg-celtic-blue text-white p-4">
                    <p className="text-celtic-yellow text-sm font-semibold">{event.date}</p>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {getCategoryBadge(event.category)}
                      <span className="text-sm text-gray-500">{event.time}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {event.description}
                    </p>
                    {event.price && (
                      <p className="font-bold text-celtic-blue">{event.price}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Events */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">All Upcoming Events</h2>

            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="card p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="md:w-1/4">
                      <p className="text-celtic-blue font-bold">{event.date}</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                    <div className="md:w-1/2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        {getCategoryBadge(event.category)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {event.description}
                      </p>
                    </div>
                    <div className="md:w-1/4 md:text-right">
                      {event.price && (
                        <p className="font-bold text-celtic-blue mb-2">{event.price}</p>
                      )}
                      <Link
                        href="/contact"
                        className="text-sm text-celtic-blue font-semibold hover:underline"
                      >
                        Book / Enquire →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regular Events */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Regular Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🧠</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Monthly Quiz Night</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      First Friday of every month at 7:30pm in the clubhouse. Teams of up to 6.
                    </p>
                    <p className="text-celtic-blue font-semibold">£2 per person</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚽</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Match Days</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      Every home game is an event! Clubhouse open before and after, plus tea bar with hot food.
                    </p>
                    <Link href="/fixtures" className="text-celtic-blue font-semibold hover:underline">
                      View Fixtures →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📺</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Live Football</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      Watch live Premier League and international matches on the big screen in the clubhouse.
                    </p>
                    <p className="text-celtic-blue font-semibold">Free entry</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎉</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Private Hire</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      The clubhouse is available for private functions. Contact us for availability and rates.
                    </p>
                    <Link href="/contact" className="text-celtic-blue font-semibold hover:underline">
                      Enquire →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Info */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">The Venue</h2>

            <div className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">Cwmbran Celtic Clubhouse</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Our clubhouse at the Avondale Motor Park Arena is the perfect venue for social events.
                    With a licensed bar, large screen TVs, and capacity for up to 100 guests, it&apos;s ideal
                    for parties, presentations, and community gatherings.
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Licensed bar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Large screen TVs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Free parking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Catering available</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    <strong>Avondale Motor Park Arena</strong><br />
                    Henllys Way<br />
                    Cwmbran<br />
                    NP44 3JY
                  </p>
                  <Link
                    href="/visit"
                    className="btn-primary inline-block"
                  >
                    Get Directions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
            Want to Book an Event?
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            Get in touch to book tickets for upcoming events or enquire about private hire.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Celtic Bond */}
      <CelticBondBanner variant="full" />
    </>
  );
}
