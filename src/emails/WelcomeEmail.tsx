import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Hr,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  firstName?: string;
  unsubscribeUrl: string;
}

export default function WelcomeEmail({ firstName, unsubscribeUrl }: WelcomeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cwmbranceltic.com';

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/images/club-logo.webp`}
              alt="Cwmbran Celtic AFC"
              width={80}
              height={80}
              style={logo}
            />
            <Text style={headerTitle}>Welcome to the Celtic Family!</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>
              {firstName ? `Hi ${firstName},` : 'Hello,'}
            </Text>

            <Text style={paragraph}>
              Thank you for subscribing to the Cwmbran Celtic AFC newsletter! We&apos;re thrilled to have you join our community of supporters.
            </Text>

            <Text style={paragraph}>
              As a subscriber, you&apos;ll receive:
            </Text>

            <ul style={list}>
              <li style={listItem}>Weekly match reports and results</li>
              <li style={listItem}>Upcoming fixture information</li>
              <li style={listItem}>Exclusive club news and updates</li>
              <li style={listItem}>Special offers and promotions</li>
              <li style={listItem}>Player spotlights and behind-the-scenes content</li>
            </ul>

            <Text style={paragraph}>
              We can&apos;t wait to see you at the Avondale Motor Park Arena for our next home match!
            </Text>

            <Section style={ctaSection}>
              <Button style={ctaButton} href={`${baseUrl}/fixtures`}>
                View Upcoming Fixtures
              </Button>
            </Section>

            <Hr style={divider} />

            {/* Quick Links */}
            <Text style={quickLinksTitle}>Quick Links</Text>
            <Section style={quickLinks}>
              <Link href={`${baseUrl}/shop`} style={quickLink}>Shop</Link>
              <Text style={quickLinkSeparator}>•</Text>
              <Link href={`${baseUrl}/celtic-bond`} style={quickLink}>Celtic Bond</Link>
              <Text style={quickLinkSeparator}>•</Text>
              <Link href={`${baseUrl}/membership`} style={quickLink}>Membership</Link>
              <Text style={quickLinkSeparator}>•</Text>
              <Link href={`${baseUrl}/news`} style={quickLink}>News</Link>
            </Section>

            {/* Social */}
            <Text style={socialTitle}>Follow us on social media</Text>
            <Section style={socialSection}>
              <Link href="https://www.facebook.com/CwmbranCelticFC" style={socialLink}>Facebook</Link>
              <Text style={quickLinkSeparator}>•</Text>
              <Link href="https://twitter.com/CwmbranCeltic" style={socialLink}>Twitter/X</Link>
              <Text style={quickLinkSeparator}>•</Text>
              <Link href="https://www.instagram.com/cwmbranceltic" style={socialLink}>Instagram</Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Img
              src={`${baseUrl}/images/club-logo.webp`}
              alt="Cwmbran Celtic AFC"
              width={40}
              height={40}
              style={footerLogo}
            />
            <Text style={footerText}>Cwmbran Celtic AFC</Text>
            <Text style={footerAddress}>Avondale Motor Park Arena, Henllys Way, Cwmbran NP44 6NB</Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>Unsubscribe from this list</Link>
            <Text style={copyright}>© 2026 Cwmbran Celtic AFC. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f4f4f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const header = {
  backgroundColor: '#1e3a8a',
  background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
  padding: '40px 30px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto 20px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  padding: '5px',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const content = {
  padding: '40px 30px',
};

const greeting = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e3a8a',
  marginBottom: '20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '16px',
};

const list = {
  paddingLeft: '20px',
  marginBottom: '20px',
};

const listItem = {
  fontSize: '15px',
  lineHeight: '1.8',
  color: '#4b5563',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const ctaButton = {
  backgroundColor: '#facc15',
  color: '#1e3a8a',
  padding: '14px 28px',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '16px',
  textDecoration: 'none',
  display: 'inline-block',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const quickLinksTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#6b7280',
  textAlign: 'center' as const,
  marginBottom: '10px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const quickLinks = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const quickLink = {
  color: '#1e3a8a',
  fontSize: '14px',
  textDecoration: 'none',
};

const quickLinkSeparator = {
  display: 'inline',
  color: '#d1d5db',
  margin: '0 8px',
};

const socialTitle = {
  fontSize: '12px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  marginBottom: '8px',
};

const socialSection = {
  textAlign: 'center' as const,
};

const socialLink = {
  color: '#6b7280',
  fontSize: '13px',
  textDecoration: 'none',
};

const footer = {
  backgroundColor: '#1f2937',
  padding: '30px',
  textAlign: 'center' as const,
};

const footerLogo = {
  margin: '0 auto 10px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  padding: '3px',
};

const footerText = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 5px',
};

const footerAddress = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0 0 15px',
};

const unsubscribeLink = {
  color: '#9ca3af',
  fontSize: '12px',
  textDecoration: 'underline',
};

const copyright = {
  color: '#6b7280',
  fontSize: '11px',
  marginTop: '15px',
};
