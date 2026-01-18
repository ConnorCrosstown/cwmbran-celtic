import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Club Documents',
  description: 'Official Cwmbran Celtic AFC documents including policies, constitution, and safeguarding information.',
};

const documents = [
  {
    category: 'Governance',
    items: [
      { name: 'Club Constitution', description: 'The governing document of Cwmbran Celtic AFC', url: '#', type: 'PDF' },
      { name: 'Club Rules', description: 'Rules and regulations for members', url: '#', type: 'PDF' },
    ]
  },
  {
    category: 'Safeguarding',
    items: [
      { name: 'Safeguarding Policy', description: 'Our commitment to safeguarding children and vulnerable adults', url: '#', type: 'PDF' },
      { name: 'Code of Conduct - Players', description: 'Expected standards of behaviour for players', url: '#', type: 'PDF' },
      { name: 'Code of Conduct - Parents/Spectators', description: 'Expected standards for parents and spectators', url: '#', type: 'PDF' },
      { name: 'Anti-Bullying Policy', description: 'Our stance on bullying and harassment', url: '#', type: 'PDF' },
    ]
  },
  {
    category: 'Health & Safety',
    items: [
      { name: 'Health & Safety Policy', description: 'Our health and safety procedures', url: '#', type: 'PDF' },
      { name: 'Emergency Action Plan', description: 'Procedures for emergencies at the ground', url: '#', type: 'PDF' },
      { name: 'First Aid Policy', description: 'First aid provision at the club', url: '#', type: 'PDF' },
    ]
  },
  {
    category: 'Equality & Inclusion',
    items: [
      { name: 'Equality Policy', description: 'Our commitment to equality and diversity', url: '#', type: 'PDF' },
      { name: 'Anti-Discrimination Policy', description: 'Our stance against all forms of discrimination', url: '#', type: 'PDF' },
    ]
  },
  {
    category: 'Data Protection',
    items: [
      { name: 'Privacy Policy', description: 'How we handle personal data', url: '/privacy', type: 'Link' },
      { name: 'Photography Policy', description: 'Guidelines for photography at club events', url: '#', type: 'PDF' },
    ]
  },
];

export default function DocumentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">Club Documents</h1>
          <p className="text-xs text-gray-200">
            Policies, procedures, and official documents
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-4 mb-6">
              <p className="text-sm text-gray-700">
                Cwmbran Celtic AFC is committed to operating transparently and in accordance with best
                practice. Below you&apos;ll find our key policies and documents. If you have any questions
                about any of these documents, please <Link href="/contact" className="text-celtic-blue hover:underline">contact us</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documents by Category */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {documents.map((category) => (
              <div key={category.category}>
                <h2 className="text-lg font-bold text-celtic-dark mb-3">{category.category}</h2>
                <div className="card overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {category.items.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                            doc.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-celtic-blue/10 text-celtic-blue'
                          }`}>
                            {doc.type === 'PDF' ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-celtic-dark group-hover:text-celtic-blue transition-colors">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500">{doc.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-celtic-blue transition-colors">
                          <span className="text-[10px] uppercase font-semibold">{doc.type}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAW Affiliation */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-4 bg-celtic-blue text-white">
              <h2 className="font-bold text-lg mb-2">FAW Affiliated Club</h2>
              <p className="text-sm text-gray-200 mb-3">
                Cwmbran Celtic AFC is affiliated to the Football Association of Wales (FAW) and adheres
                to all FAW regulations and guidelines. Our coaches hold valid FAW coaching qualifications
                and we maintain appropriate insurance coverage.
              </p>
              <a
                href="https://www.faw.cymru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-celtic-yellow text-sm font-semibold hover:underline"
              >
                Visit FAW Website &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Need a Document?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            If you need a copy of any document not listed here, or have questions about our policies,
            please get in touch.
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
