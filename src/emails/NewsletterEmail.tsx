import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface Fixture {
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
}

interface Result {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
}

interface NewsArticle {
  title: string;
  excerpt: string;
  slug: string;
}

interface NewsletterEmailProps {
  firstName?: string;
  customMessage?: string;
  recentResults?: Result[];
  upcomingFixtures?: Fixture[];
  latestNews?: NewsArticle[];
  mensPosition?: { position: number; played: number; won: number; drawn: number; lost: number; points: number };
  ladiesPosition?: { position: number; played: number; won: number; drawn: number; lost: number; points: number };
  unsubscribeUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cwmbranceltic.com';

export default function NewsletterEmail({
  firstName,
  customMessage,
  recentResults = [],
  upcomingFixtures = [],
  latestNews = [],
  mensPosition,
  ladiesPosition,
  unsubscribeUrl,
}: NewsletterEmailProps) {
  const previewText = `Cwmbran Celtic Newsletter - Latest results, fixtures, and news`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/images/badge.png`}
              width="80"
              height="80"
              alt="Cwmbran Celtic AFC"
              style={logo}
            />
            <Heading style={headerTitle}>CWMBRAN CELTIC AFC</Heading>
            <Text style={headerSubtitle}>Weekly Newsletter</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>
              {firstName ? `Hi ${firstName},` : 'Hi there,'}
            </Text>
            <Text style={intro}>
              Here&apos;s your weekly update from Cwmbran Celtic AFC.
            </Text>
          </Section>

          {/* Custom Message */}
          {customMessage && (
            <Section style={messageSection}>
              <Text style={customMessageText}>{customMessage}</Text>
            </Section>
          )}

          {/* League Standings */}
          {(mensPosition || ladiesPosition) && (
            <Section style={section}>
              <Heading as="h2" style={sectionTitle}>
                League Standings
              </Heading>
              <Row>
                {mensPosition && (
                  <Column style={standingCard}>
                    <Text style={standingTeam}>Men&apos;s First Team</Text>
                    <Text style={standingPosition}>{getOrdinal(mensPosition.position)}</Text>
                    <Text style={standingLeague}>JD Cymru South</Text>
                    <Text style={standingStats}>
                      P{mensPosition.played} W{mensPosition.won} D{mensPosition.drawn} L{mensPosition.lost} • {mensPosition.points}pts
                    </Text>
                  </Column>
                )}
                {ladiesPosition && (
                  <Column style={standingCard}>
                    <Text style={standingTeam}>Women&apos;s Team</Text>
                    <Text style={standingPosition}>{getOrdinal(ladiesPosition.position)}</Text>
                    <Text style={standingLeague}>Genero Adran South</Text>
                    <Text style={standingStats}>
                      P{ladiesPosition.played} W{ladiesPosition.won} D{ladiesPosition.drawn} L{ladiesPosition.lost} • {ladiesPosition.points}pts
                    </Text>
                  </Column>
                )}
              </Row>
            </Section>
          )}

          {/* Recent Results */}
          {recentResults.length > 0 && (
            <Section style={section}>
              <Heading as="h2" style={sectionTitle}>
                Recent Results
              </Heading>
              {recentResults.map((result, index) => (
                <Row key={index} style={resultRow}>
                  <Column style={resultTeams}>
                    <Text style={resultTeamName}>{result.homeTeam}</Text>
                    <Text style={resultScore}>
                      {result.homeScore} - {result.awayScore}
                    </Text>
                    <Text style={resultTeamName}>{result.awayTeam}</Text>
                  </Column>
                  <Column style={resultMeta}>
                    <Text style={resultCompetition}>{result.competition}</Text>
                    <Text style={resultDate}>{result.date}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          {/* Upcoming Fixtures */}
          {upcomingFixtures.length > 0 && (
            <Section style={section}>
              <Heading as="h2" style={sectionTitle}>
                Upcoming Fixtures
              </Heading>
              {upcomingFixtures.map((fixture, index) => (
                <Row key={index} style={fixtureRow}>
                  <Column style={fixtureDate}>
                    <Text style={fixtureDateText}>{fixture.date}</Text>
                    <Text style={fixtureTime}>{fixture.time}</Text>
                  </Column>
                  <Column style={fixtureTeams}>
                    <Text style={fixtureMatchup}>
                      {fixture.homeTeam} vs {fixture.awayTeam}
                    </Text>
                    <Text style={fixtureVenue}>{fixture.venue}</Text>
                    <Text style={fixtureCompetition}>{fixture.competition}</Text>
                  </Column>
                </Row>
              ))}
              <Link href={`${baseUrl}/fixtures`} style={viewAllLink}>
                View all fixtures →
              </Link>
            </Section>
          )}

          {/* Latest News */}
          {latestNews.length > 0 && (
            <Section style={section}>
              <Heading as="h2" style={sectionTitle}>
                Latest News
              </Heading>
              {latestNews.map((article, index) => (
                <Row key={index} style={newsRow}>
                  <Column>
                    <Link href={`${baseUrl}/news/${article.slug}`} style={newsTitle}>
                      {article.title}
                    </Link>
                    <Text style={newsExcerpt}>{article.excerpt}</Text>
                  </Column>
                </Row>
              ))}
              <Link href={`${baseUrl}/news`} style={viewAllLink}>
                Read more news →
              </Link>
            </Section>
          )}

          {/* CTA */}
          <Section style={ctaSection}>
            <Heading as="h2" style={ctaTitle}>
              Support the Club
            </Heading>
            <Text style={ctaText}>
              Come and support us at the Avondale Motor Park Arena!
            </Text>
            <Link href={`${baseUrl}/tickets`} style={ctaButton}>
              Buy Tickets
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Cwmbran Celtic AFC
              <br />
              Avondale Motor Park Arena, Henllys Way, Cwmbran NP44 6NB
            </Text>
            <Text style={footerLinks}>
              <Link href={baseUrl} style={footerLink}>Website</Link>
              {' • '}
              <Link href={`${baseUrl}/contact`} style={footerLink}>Contact</Link>
              {' • '}
              <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe</Link>
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Cwmbran Celtic AFC. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#003087',
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto 16px',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  letterSpacing: '2px',
  margin: '0',
};

const headerSubtitle = {
  color: '#FFD700',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const content = {
  padding: '32px 24px 16px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0 0 8px',
};

const intro = {
  color: '#666666',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};

const messageSection = {
  padding: '0 24px 24px',
};

const customMessageText = {
  backgroundColor: '#f0f7ff',
  borderLeft: '4px solid #003087',
  color: '#1a1a1a',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  padding: '16px',
};

const section = {
  padding: '24px',
  borderTop: '1px solid #e6e6e6',
};

const sectionTitle = {
  color: '#003087',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const standingCard = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  margin: '0 4px',
};

const standingTeam = {
  color: '#666666',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
};

const standingPosition = {
  color: '#003087',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
};

const standingLeague = {
  color: '#666666',
  fontSize: '11px',
  margin: '4px 0',
};

const standingStats = {
  color: '#888888',
  fontSize: '11px',
  margin: '0',
};

const resultRow = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  marginBottom: '8px',
  padding: '12px 16px',
};

const resultTeams = {
  textAlign: 'center' as const,
};

const resultTeamName = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const resultScore = {
  color: '#003087',
  fontSize: '20px',
  fontWeight: '700',
  margin: '4px 0',
};

const resultMeta = {
  textAlign: 'right' as const,
};

const resultCompetition = {
  color: '#666666',
  fontSize: '11px',
  margin: '0',
};

const resultDate = {
  color: '#888888',
  fontSize: '11px',
  margin: '4px 0 0',
};

const fixtureRow = {
  borderBottom: '1px solid #e6e6e6',
  marginBottom: '12px',
  paddingBottom: '12px',
};

const fixtureDate = {
  width: '80px',
};

const fixtureDateText = {
  color: '#003087',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
};

const fixtureTime = {
  color: '#666666',
  fontSize: '12px',
  margin: '0',
};

const fixtureTeams = {
  paddingLeft: '16px',
};

const fixtureMatchup = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const fixtureVenue = {
  color: '#666666',
  fontSize: '12px',
  margin: '0',
};

const fixtureCompetition = {
  color: '#888888',
  fontSize: '11px',
  margin: '4px 0 0',
};

const viewAllLink = {
  color: '#003087',
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  marginTop: '16px',
  textDecoration: 'none',
};

const newsRow = {
  marginBottom: '16px',
};

const newsTitle = {
  color: '#003087',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
};

const newsExcerpt = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '4px 0 0',
};

const ctaSection = {
  backgroundColor: '#FFD700',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const ctaTitle = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const ctaText = {
  color: '#333333',
  fontSize: '15px',
  margin: '0 0 16px',
};

const ctaButton = {
  backgroundColor: '#003087',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 32px',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '0',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const footerLinks = {
  margin: '0 0 12px',
};

const footerLink = {
  color: '#003087',
  fontSize: '12px',
  textDecoration: 'none',
};

const footerCopyright = {
  color: '#888888',
  fontSize: '11px',
  margin: '0',
};
