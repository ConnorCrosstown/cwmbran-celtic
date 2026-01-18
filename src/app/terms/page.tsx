import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for Cwmbran Celtic AFC website.',
};

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Terms of Use</h1>
          <p className="text-white mt-2">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using the Cwmbran Celtic AFC website, you accept and agree to be bound
              by these Terms of Use. If you do not agree to these terms, please do not use our website.
            </p>

            <h2>Use of Website</h2>
            <p>You agree to use this website only for lawful purposes and in a way that does not:</p>
            <ul>
              <li>Infringe the rights of others</li>
              <li>Restrict or inhibit anyone else&apos;s use of the website</li>
              <li>Breach any applicable laws or regulations</li>
              <li>Transmit any harmful or malicious content</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software,
              is the property of Cwmbran Celtic AFC or its content suppliers and is protected by
              copyright and other intellectual property laws.
            </p>
            <p>
              The Cwmbran Celtic AFC name, crest, and associated branding are trademarks of the club
              and may not be used without prior written permission.
            </p>

            <h2>User Content</h2>
            <p>
              If you submit content to our website (such as comments or contact form messages),
              you grant us a non-exclusive, royalty-free license to use, reproduce, and display
              such content in connection with our services.
            </p>

            <h2>Ticket Purchases</h2>
            <p>All ticket purchases are subject to the following conditions:</p>
            <ul>
              <li>Tickets are non-transferable unless otherwise stated</li>
              <li>Entry to matches is subject to ground regulations</li>
              <li>The club reserves the right to refuse entry or eject persons who breach ground regulations</li>
              <li>Refunds will only be issued for cancelled matches</li>
            </ul>

            <h2>Shop Purchases</h2>
            <p>
              Purchases from our official shop are subject to our standard terms and conditions
              of sale. All prices are in GBP and include VAT where applicable.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the content, privacy policies, or practices of any third-party sites.
            </p>

            <h2>Disclaimer</h2>
            <p>
              This website is provided &quot;as is&quot; without any warranties, express or implied.
              We do not warrant that the website will be uninterrupted, error-free, or free of
              viruses or other harmful components.
            </p>
            <p>
              Match information, fixtures, and results are provided for informational purposes
              and may be subject to change. Always check official sources for confirmation.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Cwmbran Celtic AFC shall not be liable for
              any indirect, incidental, special, or consequential damages arising from your use
              of this website.
            </p>

            <h2>Ground Regulations</h2>
            <p>
              Entry to Avondale Motor Park Arena is subject to the club&apos;s ground regulations
              and the Football Association of Wales ground regulations. These are available at
              the ground on match days.
            </p>

            <h2>Modifications</h2>
            <p>
              We reserve the right to modify these Terms of Use at any time. Changes will be
              effective immediately upon posting to the website. Your continued use of the
              website following any changes constitutes acceptance of the new terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms of Use are governed by the laws of England and Wales. Any disputes
              arising from these terms shall be subject to the exclusive jurisdiction of the
              courts of England and Wales.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <p>
              <strong>Cwmbran Celtic AFC</strong><br />
              Avondale Motor Park Arena<br />
              Henllys Way<br />
              Cwmbran, NP44 3FS<br />
              Email: info@cwmbranceltic.co.uk
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
