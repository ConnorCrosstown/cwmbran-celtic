import { NextRequest, NextResponse } from 'next/server';
import {
  deletePost,
  updatePostContent,
  updatePostStatus,
  publishPost,
  getAllPosts,
} from '@/lib/social-media';

// GET - Fetch a single post
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const posts = await getAllPosts();
    const post = posts.find(p => p.id === id);

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT - Update post content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, hashtags, platforms } = body;

    const updates: Record<string, unknown> = {};
    if (text !== undefined) updates.text = text;
    if (hashtags !== undefined) updates.hashtags = hashtags;

    const post = await updatePostContent(id, updates);

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deletePost(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

// POST - Publish the post
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await publishPost(id);

    return NextResponse.json({
      success: result.success,
      results: result.results,
    });
  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to publish post' },
      { status: 500 }
    );
  }
}
