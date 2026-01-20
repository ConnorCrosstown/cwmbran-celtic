import { NextResponse } from 'next/server';
import { getSubscriberCount } from '@/lib/newsletter';
import { getRecentResults, getUpcomingFixtures, getLeaguePosition, getLadiesLeaguePosition, formatMatchDate } from '@/lib/comet';
import { getLatestNews } from '@/data/news-data';

export async function GET() {
  try {
    const [recentResults, upcomingFixtures, mensPosition, ladiesPosition, subscriberCount] = await Promise.all([
      getRecentResults(3),
      getUpcomingFixtures(5),
      getLeaguePosition(),
      getLadiesLeaguePosition(),
      getSubscriberCount(),
    ]);

    const latestNews = getLatestNews(3);

    return NextResponse.json({
      recentResults: recentResults.map(r => ({
        date: formatMatchDate(r.date),
        homeTeam: r.homeTeam,
        awayTeam: r.awayTeam,
        homeScore: r.homeScore,
        awayScore: r.awayScore,
        competition: r.competition,
      })),
      upcomingFixtures: upcomingFixtures.map(f => ({
        date: formatMatchDate(f.date),
        time: f.time,
        homeTeam: f.homeTeam,
        awayTeam: f.awayTeam,
        competition: f.competition,
        venue: f.venue,
      })),
      latestNews: latestNews.map(n => ({
        title: n.title,
        excerpt: n.excerpt,
      })),
      mensPosition: mensPosition ? {
        position: mensPosition.position,
        points: mensPosition.points,
        played: mensPosition.played,
        won: mensPosition.won,
        drawn: mensPosition.drawn,
        lost: mensPosition.lost,
      } : null,
      ladiesPosition: ladiesPosition ? {
        position: ladiesPosition.position,
        points: ladiesPosition.points,
        played: ladiesPosition.played,
        won: ladiesPosition.won,
        drawn: ladiesPosition.drawn,
        lost: ladiesPosition.lost,
      } : null,
      subscriberCount,
    });
  } catch (error) {
    console.error('Newsletter preview error:', error);
    return NextResponse.json(
      { error: 'Failed to load preview' },
      { status: 500 }
    );
  }
}
