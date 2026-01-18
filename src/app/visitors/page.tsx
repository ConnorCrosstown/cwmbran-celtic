import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { clubInfo } from '@/data/mock-data';

export const metadata = {
  title: 'Away Fan Information',
  description: 'Information for visiting supporters at Cwmbran Celtic AFC. Directions, facilities, admission prices, and what to expect at The Park.',
};

const facilities = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Covered Standing',
    description: 'Covered terrace areas available for home and away supporters',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Clubhouse',
    description: 'Licensed bar open to all supporters with hot and cold drinks',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Tea Bar',
    description: 'Hot food and drinks including burgers, hot dogs, and tea/coffee',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: 'Free Parking',
    description: 'Free car park on site with space for approximately 50 cars',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Accessible',
    description: 'Wheelchair accessible areas and disabled toilet facilities',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: 'Programme',
    description: 'Official matchday programme available at the turnstile',
  },
];

const nearbyPlaces = [
  {
    name: 'Cwmbran Town Centre',
    distance: '1 mile',
    description: 'Shopping centre with various food outlets and pubs',
  },
  {
    name: 'Cwmbran Railway Station',
    distance: '1.5 miles',
    description: 'Direct trains from Cardiff and Newport',
  },
  {
    name: 'Llanyrafon Manor',
    distance: '0.5 miles',
    description: 'Historic manor house and local heritage site',
  },
];

export default function VisitorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-celtic-yellow px-4 py-2 rounded-full mb-4">
              <span className="text-celtic-dark font-bold text-sm uppercase tracking-wide">Away Supporters</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
              Welcome to The Park
            </h1>
            <p className="text-xl text-celtic-yellow mb-8">
              Everything you need to know for your visit to Cwmbran Celtic
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-celtic-blue py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <p className="text-2xl font-display">£{clubInfo.admission.adults}</p>
              <p className="text-xs text-gray-300 uppercase tracking-wide">Adult Entry</p>
            </div>
            <div>
              <p className="text-2xl font-display">£{clubInfo.admission.concessions}</p>
              <p className="text-xs text-gray-300 uppercase tracking-wide">Concessions</p>
            </div>
            <div>
              <p className="text-2xl font-display">FREE</p>
              <p className="text-xs text-gray-300 uppercase tracking-wide">Under 16s</p>
            </div>
            <div>
              <p className="text-2xl font-display">2:30pm</p>
              <p className="text-xs text-gray-300 uppercase tracking-wide">Typical Kickoff</p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Here Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Getting Here"
            subtitle="How to find The Park"
          />

          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Address Card */}
            <div className="card-static p-6">
              <h3 className="font-bold text-lg text-celtic-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Ground Address
              </h3>
              <p className="text-gray-600 mb-4">
                {clubInfo.ground.name}<br />
                {clubInfo.ground.address.street}<br />
                {clubInfo.ground.address.town}<br />
                {clubInfo.ground.address.postcode}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clubInfo.ground.address.street}, ${clubInfo.ground.address.town}, ${clubInfo.ground.address.postcode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Open in Google Maps
              </a>
            </div>

            {/* Directions Card */}
            <div className="card-static p-6">
              <h3 className="font-bold text-lg text-celtic-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                By Car
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong className="text-celtic-dark">From M4:</strong> Exit at Junction 26 and follow signs for Cwmbran. Continue on the A4051 towards Cwmbran town centre.</p>
                <p><strong className="text-celtic-dark">From Cwmbran:</strong> Head towards Llanyrafon area. The ground is located off the main road with signage visible on matchdays.</p>
                <p><strong className="text-celtic-dark">Parking:</strong> Free parking available at the ground. Alternative parking at nearby retail parks if required.</p>
              </div>
            </div>

            {/* Public Transport Card */}
            <div className="card-static p-6">
              <h3 className="font-bold text-lg text-celtic-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                By Public Transport
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong className="text-celtic-dark">Train:</strong> Cwmbran railway station is approximately 1.5 miles from the ground. Direct services from Cardiff Central (20 mins) and Newport (10 mins).</p>
                <p><strong className="text-celtic-dark">Bus:</strong> Local bus services operate throughout Cwmbran. Check Stagecoach South Wales for routes to Llanyrafon area.</p>
                <p><strong className="text-celtic-dark">Taxi:</strong> Taxis are available from the station and town centre. Journey approximately £5-7.</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card-static p-0 overflow-hidden">
              <div className="h-full min-h-[300px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center p-6">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-500 text-sm">Interactive map</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clubInfo.ground.address.street}, ${clubInfo.ground.address.town}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-celtic-blue text-sm font-semibold hover:underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Ground Facilities"
            subtitle="What to expect at The Park"
            centered
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-celtic-blue/10/20 rounded-full flex items-center justify-center text-celtic-blue">
                  {facility.icon}
                </div>
                <h3 className="font-bold text-celtic-dark text-sm mb-1">{facility.title}</h3>
                <p className="text-xs text-gray-500">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ground Rules Section */}
      <section className="py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Ground Rules"
            subtitle="Help us make matchday enjoyable for everyone"
            centered
          />

          <div className="max-w-2xl mx-auto">
            <div className="card-static p-6">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Away supporters are welcome in all areas of the ground including the clubhouse bar</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Photography and filming for personal use is permitted</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>No alcohol to be taken from clubhouse to viewing areas</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Smoking only in designated areas outside the covered stands</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Any abusive, discriminatory, or violent behaviour will not be tolerated</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Places */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Nearby"
            subtitle="Places to visit before or after the match"
            centered
          />

          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {nearbyPlaces.map((place, index) => (
              <div key={index} className="card-static p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-celtic-dark">{place.name}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{place.distance}</span>
                </div>
                <p className="text-sm text-gray-600">{place.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-celtic-dark mb-4">
            Any Questions?
          </h2>
          <p className="text-celtic-dark/80 max-w-2xl mx-auto mb-8">
            If you need any additional information for your visit, please don&apos;t hesitate to get in touch.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/fixtures" className="btn-outline">
              View Fixtures
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
