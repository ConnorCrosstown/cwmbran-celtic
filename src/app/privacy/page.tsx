import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Cwmbran Celtic AFC website.',
};

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/80 mt-2">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Introduction</h2>
            <p>
              Cwmbran Celtic AFC (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when you
              visit our website or interact with our services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>We may collect information you voluntarily provide, including:</p>
            <ul>
              <li>Name and contact information when you contact us or sign up for newsletters</li>
              <li>Payment information when purchasing tickets, merchandise, or memberships</li>
              <li>Communications you send to us</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website information</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process ticket purchases and merchandise orders</li>
              <li>Send newsletters and club updates (with your consent)</li>
              <li>Respond to your enquiries</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small text files
              stored on your device. You can control cookies through your browser settings.
            </p>

            <h2>Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li>Service providers who assist in operating our website</li>
              <li>Payment processors for transactions</li>
              <li>Football Association of Wales and league authorities as required</li>
              <li>Law enforcement when required by law</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>Your Rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights,
              please contact us at:
            </p>
            <p>
              <strong>Cwmbran Celtic AFC</strong><br />
              Avondale Motor Park Arena<br />
              Henllys Way<br />
              Cwmbran, NP44 3FS<br />
              Email: info@cwmbranceltic.co.uk
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page with an updated revision date.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
