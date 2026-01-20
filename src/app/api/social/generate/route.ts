import { NextRequest, NextResponse } from 'next/server';
import {
  generateResultPost,
  generateFixturePost,
  generateMatchdayPost,
  generateTableUpdatePost,
  queuePost,
  checkAndGenerateResultPosts,
  checkAndGenerateFixturePosts,
} from '@/lib/social-media';
import {
  getRecentResults,
  getUpcomingFixtures,
  getLeaguePosition,
} from '@/lib/comet';

// POST - Generate posts from data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'result': {
        // Generate post for a specific result
        if (!data) {
          return NextResponse.json(
            { success: false, message: 'Result data required' },
            { status: 400 }
          );
        }
        const postData = generateResultPost(data);
        const post = await queuePost(postData);
        return NextResponse.json({ success: true, posts: [post] });
      }

      case 'fixture': {
        // Generate post for a specific fixture
        if (!data) {
          return NextResponse.json(
            { success: false, message: 'Fixture data required' },
            { status: 400 }
          );
        }
        const postData = generateFixturePost(data);
        const post = await queuePost(postData);
        return NextResponse.json({ success: true, posts: [post] });
      }

      case 'matchday': {
        // Generate matchday post
        if (!data) {
          return NextResponse.json(
            { success: false, message: 'Fixture data required' },
            { status: 400 }
          );
        }
        const postData = generateMatchdayPost(data);
        const post = await queuePost(postData);
        return NextResponse.json({ success: true, posts: [post] });
      }

      case 'table_update': {
        // Generate table update post
        const leagueRow = await getLeaguePosition();
        if (!leagueRow) {
          return NextResponse.json(
            { success: false, message: 'Could not fetch league position' },
            { status: 500 }
          );
        }
        const postData = generateTableUpdatePost(leagueRow, 'Ardal SE');
        const post = await queuePost(postData);
        return NextResponse.json({ success: true, posts: [post] });
      }

      case 'auto_results': {
        // Auto-generate posts for recent results
        const results = await getRecentResults(5);
        const posts = await checkAndGenerateResultPosts(results);
        return NextResponse.json({
          success: true,
          posts,
          message: `Generated ${posts.length} new result posts`,
        });
      }

      case 'auto_fixtures': {
        // Auto-generate posts for upcoming fixtures
        const fixtures = await getUpcomingFixtures(10);
        const posts = await checkAndGenerateFixturePosts(fixtures);
        return NextResponse.json({
          success: true,
          posts,
          message: `Generated ${posts.length} new fixture posts`,
        });
      }

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate posts' },
      { status: 500 }
    );
  }
}
