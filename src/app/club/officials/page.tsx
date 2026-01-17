import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Club Officials',
  description: 'Meet the people behind Cwmbran Celtic AFC - our committee members, management staff, and volunteers.',
};

const boardMembers = [
  { role: 'Chairman', name: 'Barrie Desmond', description: 'Leading the club since 2018' },
  { role: 'Vice Chairman', name: 'TBC', description: '' },
  { role: 'Secretary', name: 'TBC', description: '' },
  { role: 'Treasurer', name: 'TBC', description: '' },
  { role: 'Welfare Officer', name: 'TBC', description: 'Safeguarding and welfare matters' },
];

const footballStaff = [
  {
    team: "Men's First Team",
    staff: [
      { role: 'Manager', name: 'Simon Berry', since: '2023' },
      { role: 'Assistant Manager', name: 'TBC', since: '' },
      { role: 'Coach', name: 'TBC', since: '' },
    ]
  },
  {
    team: "Women's Team",
    staff: [
      { role: 'Manager', name: 'TBC', since: '' },
      { role: 'Assistant Manager', name: 'TBC', since: '' },
    ]
  },
  {
    team: "Development Squad",
    staff: [
      { role: 'Manager', name: 'TBC', since: '' },
    ]
  },
];

const operationsStaff = [
  { role: 'Groundsman', name: 'TBC', description: 'Pitch maintenance and ground upkeep' },
  { role: 'Programme Editor', name: 'TBC', description: 'Match day programme production' },
  { role: 'Social Media', name: 'TBC', description: 'Club communications and social media' },
  { role: 'Hospitality', name: 'TBC', description: 'Match day hospitality coordination' },
];

export default function OfficialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#ffffff' }}>Club Officials</h1>
          <p className="text-xs" style={{ color: '#e5e7eb' }}>
            The people behind Cwmbran Celtic AFC
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-4 mb-6">
              <p className="text-sm text-gray-700">
                Cwmbran Celtic AFC is run by a dedicated team of volunteers who give their time to ensure
                the club continues to thrive. From the boardroom to the pitch, these individuals work
                tirelessly to provide football opportunities for our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Members */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Club Committee</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {boardMembers.map((member) => (
                <div key={member.role} className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-celtic-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-celtic-yellow font-bold text-sm">
                        {member.name !== 'TBC' ? member.name.split(' ').map(n => n[0]).join('') : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-celtic-blue font-semibold uppercase">{member.role}</p>
                      <p className="font-bold text-sm text-celtic-dark">{member.name}</p>
                      {member.description && (
                        <p className="text-xs text-gray-500">{member.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Football Staff */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Football Staff</h2>

            <div className="space-y-4">
              {footballStaff.map((team) => (
                <div key={team.team} className="card overflow-hidden">
                  <div className="bg-celtic-blue px-4 py-2">
                    <h3 className="font-semibold text-sm" style={{ color: '#ffffff' }}>{team.team}</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {team.staff.map((person, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-400 font-bold text-xs">
                              {person.name !== 'TBC' ? person.name.split(' ').map(n => n[0]).join('') : '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">{person.role}</p>
                            <p className="font-semibold text-sm text-celtic-dark">{person.name}</p>
                            {person.since && (
                              <p className="text-[10px] text-gray-400">Since {person.since}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operations */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Operations & Volunteers</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {operationsStaff.map((person) => (
                <div key={person.role} className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-celtic-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-celtic-dark font-bold text-xs">
                        {person.name !== 'TBC' ? person.name.split(' ').map(n => n[0]).join('') : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-celtic-blue font-semibold uppercase">{person.role}</p>
                      <p className="font-semibold text-sm text-celtic-dark">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Want to Get Involved?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            Cwmbran Celtic is always looking for volunteers to help with match days, events, and
            the day-to-day running of the club. If you&apos;d like to contribute, we&apos;d love to hear from you.
          </p>
          <Link href="/contact" className="btn-primary text-sm px-4 py-2">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-6">
        <div className="container mx-auto px-4 text-center">
          <Link href="/club" className="text-celtic-blue text-sm font-semibold hover:underline">
            &larr; Back to The Club
          </Link>
        </div>
      </section>
    </>
  );
}
