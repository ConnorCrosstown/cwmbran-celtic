import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Celtic Bond Results',
  description: 'View all Celtic Bond monthly draw results and winners.',
};

const bondResults = [
  { month: 'January 2026', first: { bond: '147', winner: 'J. Williams' }, second: { bond: '032', winner: 'R. Jones' }, third: { bond: '089', winner: 'S. Davies' } },
  { month: 'December 2025', first: { bond: '056', winner: 'M. Thomas' }, second: { bond: '112', winner: 'C. Evans' }, third: { bond: '078', winner: 'A. Morgan' } },
  { month: 'November 2025', first: { bond: '023', winner: 'D. Roberts' }, second: { bond: '145', winner: 'G. Phillips' }, third: { bond: '067', winner: 'H. Lewis' } },
  { month: 'October 2025', first: { bond: '098', winner: 'P. Hughes' }, second: { bond: '011', winner: 'B. Edwards' }, third: { bond: '134', winner: 'K. Price' } },
  { month: 'September 2025', first: { bond: '072', winner: 'T. Griffiths' }, second: { bond: '156', winner: 'N. Morris' }, third: { bond: '043', winner: 'E. James' } },
  { month: 'August 2025', first: { bond: '119', winner: 'L. Owen' }, second: { bond: '087', winner: 'F. Richards' }, third: { bond: '002', winner: 'I. Hopkins' } },
  { month: 'July 2025', first: { bond: '054', winner: 'W. Rees' }, second: { bond: '128', winner: 'O. Watkins' }, third: { bond: '091', winner: 'U. Powell' } },
  { month: 'June 2025', first: { bond: '036', winner: 'Y. Jenkins' }, second: { bond: '103', winner: 'Q. Bowen' }, third: { bond: '078', winner: 'Z. Parry' } },
  { month: 'May 2025', first: { bond: '141', winner: 'V. Lloyd' }, second: { bond: '019', winner: 'X. Harries' }, third: { bond: '065', winner: 'J. Bevan' } },
  { month: 'April 2025', first: { bond: '082', winner: 'R. Howells' }, second: { bond: '147', winner: 'M. Pugh' }, third: { bond: '014', winner: 'S. Prosser' } },
  { month: 'March 2025', first: { bond: '107', winner: 'A. Beddoe' }, second: { bond: '058', winner: 'D. Rosser' }, third: { bond: '123', winner: 'L. Meredith' } },
  { month: 'February 2025', first: { bond: '029', winner: 'G. Llewellyn' }, second: { bond: '094', winner: 'H. Pritchard' }, third: { bond: '156', winner: 'B. Vaughan' } },
];

export default function CelticBondResultsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/celtic-bond" className="text-celtic-yellow/80 text-xs hover:text-celtic-yellow mb-2 inline-block">
              &larr; Back to Celtic Bond
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white">Celtic Bond Results</h1>
            <p className="text-xs text-gray-200">
              Monthly draw winners
            </p>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-celtic-blue text-white">
                      <th className="px-4 py-3 text-left">Month</th>
                      <th className="px-4 py-3 text-center">1st Prize (£100)</th>
                      <th className="px-4 py-3 text-center">2nd Prize (£50)</th>
                      <th className="px-4 py-3 text-center">3rd Prize (£25)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bondResults.map((result, index) => (
                      <tr key={result.month} className={`border-b border-gray-100 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-celtic-dark">{result.month}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono bg-celtic-yellow/20 text-celtic-dark px-2 py-0.5 rounded text-xs">#{result.first.bond}</span>
                          <span className="block text-xs text-gray-500 mt-0.5">{result.first.winner}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">#{result.second.bond}</span>
                          <span className="block text-xs text-gray-500 mt-0.5">{result.second.winner}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">#{result.third.bond}</span>
                          <span className="block text-xs text-gray-500 mt-0.5">{result.third.winner}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Draws take place on the last Saturday of each month. Winners are contacted directly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 md:py-8 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-celtic-dark mb-2">
            Want to Be a Winner?
          </h2>
          <p className="text-sm text-celtic-dark/80 mb-4 max-w-xl mx-auto">
            Join Celtic Bond for just £5/month and be in with a chance to win cash prizes while supporting the club.
          </p>
          <Link href="/celtic-bond#join" className="btn-primary text-sm px-4 py-2">
            Join Celtic Bond
          </Link>
        </div>
      </section>
    </>
  );
}
