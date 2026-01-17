import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Youth Development',
  description: 'Youth football development at Cwmbran Celtic AFC. Sessions for various age groups from U7s to U16s.',
};

const ageGroups = [
  { name: 'Under 7s', day: 'Saturday', time: '9:00am - 10:00am', coach: 'TBC' },
  { name: 'Under 9s', day: 'Saturday', time: '10:00am - 11:00am', coach: 'TBC' },
  { name: 'Under 11s', day: 'Saturday', time: '11:00am - 12:00pm', coach: 'TBC' },
  { name: 'Under 13s', day: 'Saturday', time: '12:00pm - 1:00pm', coach: 'TBC' },
  { name: 'Under 16s', day: 'Wednesday', time: '6:00pm - 7:30pm', coach: 'TBC' },
];

export default function YouthPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Link
              href="/community"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 text-sm"
            >
              ← Back to Community
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Youth Development</h1>
            <p className="text-lg text-gray-200">
              Developing the next generation of Cwmbran Celtic players
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none mb-12">
              <h2 className="text-2xl font-bold text-celtic-dark mb-4">Our Youth Programme</h2>
              <p className="text-gray-600 mb-4">
                Cwmbran Celtic AFC is committed to developing young footballers in our community.
                Our youth development programme provides coaching for children and young people
                from ages 6 to 16, with a focus on fun, skill development, and a love of the game.
              </p>
              <p className="text-gray-600">
                All our coaches are FA Wales qualified and DBS checked, ensuring a safe and
                professional environment for your child to develop their football skills.
              </p>
            </div>

            {/* Age Groups */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-celtic-dark mb-6">Training Sessions</h2>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-celtic-blue text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Age Group</th>
                      <th className="px-4 py-3 text-left">Day</th>
                      <th className="px-4 py-3 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ageGroups.map((group) => (
                      <tr key={group.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-celtic-dark">{group.name}</td>
                        <td className="px-4 py-3 text-gray-600">{group.day}</td>
                        <td className="px-4 py-3 text-gray-600">{group.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                * Session times may vary. Please contact us for the latest schedule.
              </p>
            </div>

            {/* What We Offer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-celtic-dark mb-4">What We Offer</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>FA Wales qualified coaches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Age-appropriate training sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Focus on fun and skill development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Competitive matches (older age groups)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Pathway to senior football</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Safe, welcoming environment</span>
                  </li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-bold text-celtic-dark mb-4">Registration</h3>
                <p className="text-gray-600 mb-4">
                  To register your child for our youth programme, please contact us with:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Child&apos;s name and date of birth</li>
                  <li>• Parent/guardian contact details</li>
                  <li>• Any medical conditions we should know about</li>
                  <li>• Previous football experience (if any)</li>
                </ul>
                <p className="text-sm text-gray-500">
                  We&apos;ll then invite you to a trial session to see if we&apos;re the right fit.
                </p>
              </div>
            </div>

            {/* Fees */}
            <div className="card p-6 mb-12">
              <h3 className="text-xl font-bold text-celtic-dark mb-4">Fees</h3>
              <p className="text-gray-600 mb-4">
                Our youth development programme fees cover coaching, pitch hire, and equipment.
                Payment can be made monthly or termly.
              </p>
              <p className="text-gray-600">
                We believe cost should not be a barrier to participation. If you have any
                concerns about affordability, please speak to us confidentially and we will
                do our best to help.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-celtic-yellow rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-celtic-dark mb-4">
                Ready to Join?
              </h2>
              <p className="text-celtic-dark/80 mb-6">
                Get in touch to register your child or to arrange a trial session.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
