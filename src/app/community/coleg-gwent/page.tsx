import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coleg Gwent Partnership',
  description: 'Cwmbran Celtic AFC and Coleg Gwent partnership - combining education with football development for young players.',
};

export default function ColegGwentPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-celtic-blue via-celtic-blue-dark to-celtic-blue overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-celtic-yellow blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-celtic-yellow text-celtic-dark px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Education Partnership
            </span>
            <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">
              Coleg Gwent Partnership
            </h1>
            <p className="text-sm text-gray-200">
              Combining education with elite football development
            </p>
          </div>
        </div>
      </section>

      {/* About Partnership */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-4 md:p-6 mb-6">
              <h2 className="text-lg font-bold text-celtic-dark mb-3">About the Partnership</h2>
              <p className="text-sm text-gray-700 mb-3">
                In 2022, Cwmbran Celtic AFC signed a historic collaboration agreement with Coleg Gwent,
                creating a unique pathway for young players to combine their education with football development.
              </p>
              <p className="text-sm text-gray-700 mb-3">
                This partnership provides aspiring footballers with the opportunity to train and develop their
                skills at Cwmbran Celtic while pursuing their academic qualifications at one of Wales&apos;s
                leading further education colleges.
              </p>
              <p className="text-sm text-gray-700">
                The programme aims to develop the whole player - both on and off the pitch - preparing them
                for careers in football while ensuring they have the educational foundation for success in life.
              </p>
            </div>

            {/* Benefits */}
            <h2 className="text-lg font-bold text-celtic-dark mb-4">Programme Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">⚽</span>
                </div>
                <h3 className="font-bold text-sm text-celtic-dark mb-2">Football Development</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Professional coaching from Cwmbran Celtic staff</li>
                  <li>Regular training sessions during college hours</li>
                  <li>Pathway to first team football</li>
                  <li>Competitive matches against other college teams</li>
                </ul>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">🎓</span>
                </div>
                <h3 className="font-bold text-sm text-celtic-dark mb-2">Academic Excellence</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Study towards recognised qualifications</li>
                  <li>Sports-related courses available</li>
                  <li>Balance of education and training</li>
                  <li>Support from dedicated tutors</li>
                </ul>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">🏋️</span>
                </div>
                <h3 className="font-bold text-sm text-celtic-dark mb-2">Facilities</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Access to Coleg Gwent sports facilities</li>
                  <li>Training at Cwmbran Celtic&apos;s ground</li>
                  <li>Gym and fitness equipment</li>
                  <li>Analysis and performance tracking</li>
                </ul>
              </div>
              <div className="card p-4">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">🚀</span>
                </div>
                <h3 className="font-bold text-sm text-celtic-dark mb-2">Career Pathways</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Route into semi-professional football</li>
                  <li>Coaching qualifications available</li>
                  <li>Work experience opportunities</li>
                  <li>Links to higher education</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4">How to Apply</h2>

            <div className="card p-4 mb-4">
              <p className="text-sm text-gray-700 mb-4">
                The Coleg Gwent Football Programme accepts applications from students aged 16-19 who are
                passionate about developing their football whilst gaining valuable qualifications.
              </p>

              <h3 className="font-bold text-sm text-celtic-dark mb-2">Entry Requirements</h3>
              <ul className="text-xs text-gray-600 space-y-1 mb-4">
                <li>Aged 16-19 at the start of the academic year</li>
                <li>Commitment to both football and education</li>
                <li>Ability to attend training and college sessions</li>
                <li>Successful trial with the football programme</li>
              </ul>

              <h3 className="font-bold text-sm text-celtic-dark mb-2">Application Process</h3>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>Apply to Coleg Gwent for your chosen academic course</li>
                <li>Express interest in the football programme</li>
                <li>Attend a trial session when invited</li>
                <li>If successful, join the programme at the start of term</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://www.coleggwent.ac.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 hover:shadow-md transition-shadow group"
              >
                <h3 className="font-bold text-sm text-celtic-dark group-hover:text-celtic-blue mb-1">
                  Visit Coleg Gwent Website
                </h3>
                <p className="text-xs text-gray-600">
                  Learn more about courses and apply online
                </p>
                <span className="text-celtic-blue text-xs mt-2 inline-block">coleggwent.ac.uk &rarr;</span>
              </a>
              <Link href="/contact" className="card p-4 hover:shadow-md transition-shadow group">
                <h3 className="font-bold text-sm text-celtic-dark group-hover:text-celtic-blue mb-1">
                  Contact Cwmbran Celtic
                </h3>
                <p className="text-xs text-gray-600">
                  Get in touch with questions about the football programme
                </p>
                <span className="text-celtic-blue text-xs mt-2 inline-block">Contact us &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-6 md:py-8 bg-celtic-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-lg md:text-xl italic mb-4 text-white">
              &ldquo;This partnership creates a fantastic opportunity for young players in our area to
              develop their football while getting a quality education. It&apos;s exactly what our
              community needs.&rdquo;
            </blockquote>
            <p className="text-celtic-yellow text-sm font-semibold">
              Cwmbran Celtic AFC
            </p>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-6">
        <div className="container mx-auto px-4 text-center">
          <Link href="/community" className="text-celtic-blue text-sm font-semibold hover:underline">
            &larr; Back to Community
          </Link>
        </div>
      </section>
    </>
  );
}
