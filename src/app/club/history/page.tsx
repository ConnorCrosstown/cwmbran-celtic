import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Club History',
  description: 'The history of Cwmbran Celtic AFC from 1924 to present day. From CYMS to the JD Cymru South.',
};

const timeline = [
  {
    year: '1924',
    title: 'Founded as CYMS',
    description: 'Cwmbran Celtic was founded as CYMS (Catholic Young Men\'s Society), beginning a century of football in Cwmbran.',
  },
  {
    year: '1950s',
    title: 'Post-War Growth',
    description: 'The club grew in the post-war era, becoming an established part of the local football scene.',
  },
  {
    year: '1970s',
    title: 'Name Change',
    description: 'The club was renamed to Cwmbran Celtic, reflecting its growing identity in the community.',
  },
  {
    year: '1980s',
    title: 'League Success',
    description: 'A period of success in local leagues, establishing Celtic as a competitive force in Welsh football.',
  },
  {
    year: '2000s',
    title: 'Ground Development',
    description: 'Improvements to facilities at the ground, creating a better match day experience for supporters.',
  },
  {
    year: '2019',
    title: 'FAW Pyramid Restructure',
    description: 'Following the FAW pyramid restructure, Celtic compete in the newly formed tier 3 of Welsh football.',
  },
  {
    year: '2020',
    title: "Women's Section",
    description: "The club established a thriving women's section, competing in the Genero Adran South.",
  },
  {
    year: '2024',
    title: 'Centenary Year',
    description: 'Cwmbran Celtic celebrates 100 years of football, marking a century of service to the community.',
  },
];

export default function HistoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Club History</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            100 years of football in Cwmbran
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 mb-12">
              <h2 className="text-2xl font-bold text-celtic-dark mb-4">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                Cwmbran Celtic AFC has been at the heart of football in Cwmbran for over 100 years.
                Founded in 1924 as CYMS (Catholic Young Men&apos;s Society), the club has evolved
                from humble beginnings to become one of the established clubs in Welsh football.
              </p>
              <p className="text-gray-700 mb-6">
                Throughout our history, we have provided opportunities for players of all abilities
                to enjoy the beautiful game. From competitive league football to community initiatives
                like walking football, Celtic has always been about more than just results on the pitch.
              </p>
              <p className="text-gray-700">
                Today, competing in the JD Cymru South (Tier 3 of the Welsh football pyramid), we
                continue to build on the foundations laid by those who came before us, while looking
                forward to the next chapter in our story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Timeline</h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-celtic-blue transform md:-translate-x-1/2"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative flex items-start ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Year marker */}
                    <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-celtic-yellow rounded-full flex items-center justify-center transform -translate-x-1/2 z-10">
                      <div className="w-3 h-3 bg-celtic-blue rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}>
                      <div className="card p-6">
                        <span className="inline-block bg-celtic-blue text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                          {item.year}
                        </span>
                        <h3 className="font-bold text-lg text-celtic-dark mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Origins */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">The CYMS Origins</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  The Catholic Young Men&apos;s Society (CYMS) was a popular organisation in early
                  20th century Britain and Ireland, providing recreational and social activities
                  for young Catholic men. Football clubs were often formed under the CYMS banner.
                </p>
                <p className="text-gray-700 mb-4">
                  In 1924, a group of young men in Cwmbran came together to form a football team,
                  laying the foundations for what would become Cwmbran Celtic AFC.
                </p>
                <p className="text-gray-700">
                  While the club has evolved and changed over the decades, the community spirit
                  that drove those early founders remains at the heart of everything we do today.
                </p>
              </div>
              <div className="card bg-celtic-blue text-white p-8">
                <h3 className="text-xl font-bold mb-4 text-celtic-yellow">Did You Know?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-celtic-yellow">•</span>
                    <span>CYMS stood for Catholic Young Men&apos;s Society</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-celtic-yellow">•</span>
                    <span>The &quot;Celtic&quot; name reflects the club&apos;s Irish Catholic heritage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-celtic-yellow">•</span>
                    <span>We celebrated our centenary in 2024</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-celtic-yellow">•</span>
                    <span>The club colours of blue and yellow have been worn for decades</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Forward */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
              The Next 100 Years
            </h2>
            <p className="text-celtic-dark/80 mb-6 max-w-2xl mx-auto">
              As we look to the future, Cwmbran Celtic remains committed to providing
              football for all in our community. With our men&apos;s team, ladies team,
              development squad, and walking football programme, we continue to grow
              and evolve while staying true to our roots.
            </p>
            <Link href="/contact" className="btn-primary">
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Club */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/club" className="text-celtic-blue font-semibold hover:underline">
            ← Back to The Club
          </Link>
        </div>
      </section>
    </>
  );
}
