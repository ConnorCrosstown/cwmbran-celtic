import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPosts,
  queuePost,
  createCustomPost,
  getPostStats,
  Platform,
} from '@/lib/social-media';

// GET - Fetch all posts
export async function GET() {
  try {
    const [posts, stats] = await Promise.all([
      getAllPosts(),
      getPostStats(),
    ]);

    return NextResponse.json({
      success: true,
      posts,
      stats,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new custom post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, platforms, hashtags, imageUrl } = body;

    if (!text || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Text and at least one platform are required' },
        { status: 400 }
      );
    }

    // Validate platforms
    const validPlatforms: Platform[] = ['twitter', 'facebook', 'instagram'];
    const selectedPlatforms = platforms.filter((p: string) =>
      validPlatforms.includes(p as Platform)
    ) as Platform[];

    if (selectedPlatforms.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one valid platform is required' },
        { status: 400 }
      );
    }

    const postData = createCustomPost(text, selectedPlatforms, hashtags, imageUrl);
    const post = await queuePost(postData);

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    );
  }
}
