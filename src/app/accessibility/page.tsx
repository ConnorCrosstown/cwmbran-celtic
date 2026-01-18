import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'Accessibility statement for Cwmbran Celtic AFC website and ground facilities.',
};

export default function AccessibilityPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Accessibility</h1>
          <p className="text-white/80 mt-2">Our commitment to accessibility for all supporters</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Website Accessibility</h2>
            <p>
              Cwmbran Celtic AFC is committed to ensuring our website is accessible to all users,
              including those with disabilities. We strive to meet the Web Content Accessibility
              Guidelines (WCAG) 2.1 Level AA standards.
            </p>

            <h3>Accessibility Features</h3>
            <p>Our website includes the following accessibility features:</p>
            <ul>
              <li>Responsive design that works on all devices and screen sizes</li>
              <li>Clear navigation structure</li>
              <li>Alt text for images</li>
              <li>Sufficient colour contrast</li>
              <li>Keyboard navigation support</li>
              <li>Dark mode option for reduced eye strain</li>
              <li>Clear, readable fonts</li>
            </ul>

            <h3>Known Issues</h3>
            <p>
              We are continuously working to improve accessibility. If you encounter any issues,
              please let us know so we can address them.
            </p>

            <h2>Ground Accessibility</h2>
            <p>
              Avondale Motor Park Arena welcomes supporters of all abilities. We are committed to
              providing an inclusive match day experience for everyone.
            </p>

            <h3>Facilities</h3>
            <ul>
              <li><strong>Parking:</strong> Designated accessible parking spaces are available close to the entrance</li>
              <li><strong>Viewing Areas:</strong> Level viewing areas are available for wheelchair users</li>
              <li><strong>Toilets:</strong> Accessible toilet facilities are available</li>
              <li><strong>Clubhouse:</strong> The clubhouse has level access</li>
            </ul>

            <h3>Assistance</h3>
            <p>
              Our stewards and staff are trained to assist supporters with disabilities.
              If you require any specific assistance on match days, please contact us in advance
              so we can make appropriate arrangements.
            </p>

            <h3>Personal Assistants / Carers</h3>
            <p>
              Personal assistants and carers accompanying disabled supporters are admitted free
              of charge. Please inform us when booking tickets.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about accessibility at our ground or on our website,
              or if you need to arrange assistance for a match day, please contact us:
            </p>
            <p>
              <strong>Cwmbran Celtic AFC</strong><br />
              Avondale Motor Park Arena<br />
              Henllys Way<br />
              Cwmbran, NP44 3FS<br />
              Email: info@cwmbranceltic.co.uk
            </p>

            <h2>Feedback</h2>
            <p>
              We welcome feedback on our accessibility provision. If you have suggestions for
              improvements or have experienced any difficulties, please{' '}
              <Link href="/contact" className="text-celtic-blue hover:underline">
                contact us
              </Link>
              . Your feedback helps us improve the experience for all supporters.
            </p>

            <h2>Additional Resources</h2>
            <p>
              For more information about accessible football in Wales, visit:
            </p>
            <ul>
              <li>
                <a
                  href="https://www.faw.cymru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-celtic-blue hover:underline"
                >
                  Football Association of Wales
                </a>
              </li>
              <li>
                <a
                  href="https://www.levelplayingfield.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-celtic-blue hover:underline"
                >
                  Level Playing Field
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
