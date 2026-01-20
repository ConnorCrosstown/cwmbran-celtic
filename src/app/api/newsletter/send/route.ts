import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getActiveSubscribers } from '@/lib/newsletter';
import NewsletterEmail from '@/emails/NewsletterEmail';
import { getRecentResults, getUpcomingFixtures, getLeaguePosition, getLadiesLeaguePosition, formatMatchDate } from '@/lib/comet';
import { getLatestNews } from '@/data/news-data';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cwmbranceltic.com';

// Initialize Resend lazily to avoid build errors when API key is not set
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Newsletter service not configured. Please set RESEND_API_KEY.' },
        { status: 503 }
      );
    }

    // Verify staff authentication
    const authHeader = request.headers.get('authorization');
    const staffSecret = process.env.NEWSLETTER_STAFF_SECRET;

    if (!staffSecret || authHeader !== `Bearer ${staffSecret}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customMessage, testEmail } = body;

    // Get subscribers (or just test email)
    let recipients: { email: string; firstName?: string; unsubscribeToken: string }[];

    if (testEmail) {
      // Send test email
      recipients = [{ email: testEmail, firstName: 'Test', unsubscribeToken: 'test' }];
    } else {
      // Send to all active subscribers
      recipients = await getActiveSubscribers();
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No subscribers to send to.' },
        { status: 400 }
      );
    }

    // Fetch latest data for newsletter
    const [recentResults, upcomingFixtures, mensPosition, ladiesPosition] = await Promise.all([
      getRecentResults(3),
      getUpcomingFixtures(5),
      getLeaguePosition(),
      getLadiesLeaguePosition(),
    ]);

    const latestNews = getLatestNews(3);

    // Format data for email template
    const formattedResults = recentResults.map(r => ({
      date: formatMatchDate(r.date),
      homeTeam: r.homeTeam,
      awayTeam: r.awayTeam,
      homeScore: r.homeScore,
      awayScore: r.awayScore,
      competition: r.competition,
    }));

    const formattedFixtures = upcomingFixtures.map(f => ({
      date: formatMatchDate(f.date),
      time: f.time,
      homeTeam: f.homeTeam,
      awayTeam: f.awayTeam,
      competition: f.competition,
      venue: f.venue,
    }));

    const formattedNews = latestNews.map(n => ({
      title: n.title,
      excerpt: n.excerpt,
      slug: n.slug,
    }));

    // Send emails
    const resend = getResendClient();
    const results = await Promise.allSettled(
      recipients.map(async (subscriber) => {
        const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;

        const { error } = await resend.emails.send({
          from: 'Cwmbran Celtic AFC <newsletter@cwmbranceltic.com>',
          to: subscriber.email,
          subject: 'Cwmbran Celtic Weekly Newsletter',
          react: NewsletterEmail({
            firstName: subscriber.firstName,
            customMessage,
            recentResults: formattedResults,
            upcomingFixtures: formattedFixtures,
            latestNews: formattedNews,
            mensPosition: mensPosition ? {
              position: mensPosition.position,
              played: mensPosition.played,
              won: mensPosition.won,
              drawn: mensPosition.drawn,
              lost: mensPosition.lost,
              points: mensPosition.points,
            } : undefined,
            ladiesPosition: ladiesPosition ? {
              position: ladiesPosition.position,
              played: ladiesPosition.played,
              won: ladiesPosition.won,
              drawn: ladiesPosition.drawn,
              lost: ladiesPosition.lost,
              points: ladiesPosition.points,
            } : undefined,
            unsubscribeUrl,
          }),
        });

        if (error) {
          throw error;
        }

        return subscriber.email;
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successful} subscribers.${failed > 0 ? ` ${failed} failed.` : ''}`,
      stats: { total: recipients.length, successful, failed },
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send newsletter.' },
      { status: 500 }
    );
  }
}
