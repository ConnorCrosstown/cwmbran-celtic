'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================

type Platform = 'twitter' | 'facebook' | 'instagram';
type PostType = 'result' | 'fixture' | 'matchday' | 'table_update' | 'custom';
type PostStatus = 'pending' | 'scheduled' | 'posted' | 'failed';

interface SocialPost {
  id: string;
  type: PostType;
  platforms: Platform[];
  content: {
    text: string;
    hashtags: string[];
    imageUrl?: string;
  };
  scheduledFor?: string;
  postedAt?: string;
  status: PostStatus;
  sourceData?: {
    matchId?: number;
    type?: string;
  };
  error?: string;
  createdAt: string;
}

interface PostStats {
  total: number;
  pending: number;
  posted: number;
  failed: number;
  byType: Record<PostType, number>;
}

// ============================================
// COMPONENTS
// ============================================

function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case 'twitter':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
  }
}

function StatusBadge({ status }: { status: PostStatus }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    posted: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const labels = {
    pending: 'Pending',
    scheduled: 'Scheduled',
    posted: 'Posted',
    failed: 'Failed',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: PostType }) {
  const styles = {
    result: 'bg-purple-100 text-purple-800',
    fixture: 'bg-blue-100 text-blue-800',
    matchday: 'bg-orange-100 text-orange-800',
    table_update: 'bg-green-100 text-green-800',
    custom: 'bg-gray-100 text-gray-800',
  };

  const labels = {
    result: 'Result',
    fixture: 'Fixture',
    matchday: 'Matchday',
    table_update: 'League Update',
    custom: 'Custom',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

function PostCard({
  post,
  onPublish,
  onDelete,
  onEdit,
}: {
  post: SocialPost;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (post: SocialPost) => void;
}) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <TypeBadge type={post.type} />
          <StatusBadge status={post.status} />
        </div>
        <div className="flex items-center gap-1">
          {post.platforms.map((platform) => (
            <span
              key={platform}
              className="p-1.5 bg-gray-100 rounded text-gray-600"
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            >
              <PlatformIcon platform={platform} />
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-4">
          {post.content.text}
        </p>
        {post.content.hashtags.length > 0 && (
          <p className="text-sm text-celtic-blue mt-2">
            {post.content.hashtags.map((h) => `#${h}`).join(' ')}
          </p>
        )}
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Created: {formattedDate}
        {post.postedAt && (
          <span className="ml-2">
            | Posted:{' '}
            {new Date(post.postedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {post.error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3">
          Error: {post.error}
        </div>
      )}

      <div className="flex gap-2">
        {post.status === 'pending' && (
          <>
            <button
              onClick={() => onPublish(post.id)}
              className="px-3 py-1.5 bg-celtic-blue text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Publish Now
            </button>
            <button
              onClick={() => onEdit(post)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(post.id)}
          className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  editingPost,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; platforms: Platform[]; hashtags: string[] }) => void;
  editingPost?: SocialPost | null;
}) {
  const [text, setText] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>(['twitter', 'facebook', 'instagram']);
  const [hashtags, setHashtags] = useState('CwmbranCeltic, CelticFamily, UpTheCelts');

  useEffect(() => {
    if (editingPost) {
      setText(editingPost.content.text);
      setPlatforms(editingPost.platforms);
      setHashtags(editingPost.content.hashtags.join(', '));
    } else {
      setText('');
      setPlatforms(['twitter', 'facebook', 'instagram']);
      setHashtags('CwmbranCeltic, CelticFamily, UpTheCelts');
    }
  }, [editingPost, isOpen]);

  if (!isOpen) return null;

  const togglePlatform = (platform: Platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      text,
      platforms,
      hashtags: hashtags.split(',').map((h) => h.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-transparent"
              placeholder="What's happening at the club?"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {text.length}/280 characters (Twitter limit)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platforms
            </label>
            <div className="flex gap-3">
              {(['twitter', 'facebook', 'instagram'] as Platform[]).map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    platforms.includes(platform)
                      ? 'bg-celtic-blue text-white border-celtic-blue'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <PlatformIcon platform={platform} />
                  <span className="text-sm capitalize">{platform === 'twitter' ? 'X' : platform}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hashtags (comma separated)
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-transparent"
              placeholder="CwmbranCeltic, WelshFootball"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim() || platforms.length === 0}
              className="px-4 py-2 bg-celtic-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {editingPost ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatsCard({ stats }: { stats: PostStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border p-4">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-500">Total Posts</div>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        <div className="text-sm text-gray-500">Pending</div>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <div className="text-2xl font-bold text-green-600">{stats.posted}</div>
        <div className="text-sm text-gray-500">Posted</div>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        <div className="text-sm text-gray-500">Failed</div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stats, setStats] = useState<PostStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [filter, setFilter] = useState<PostStatus | 'all'>('all');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/social/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Show message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Create/update post
  const handleCreatePost = async (data: { text: string; platforms: Platform[]; hashtags: string[] }) => {
    try {
      if (editingPost) {
        // Update existing post
        const response = await fetch(`/api/social/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          showMessage('success', 'Post updated successfully');
          fetchPosts();
        }
      } else {
        // Create new post
        const response = await fetch('/api/social/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          showMessage('success', 'Post created successfully');
          fetchPosts();
        }
      }
    } catch (error) {
      showMessage('error', 'Failed to save post');
    }
    setEditingPost(null);
  };

  // Publish post
  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/social/posts/${id}`, {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Post published successfully (mock mode)');
      } else {
        showMessage('error', 'Failed to publish post');
      }
      fetchPosts();
    } catch (error) {
      showMessage('error', 'Failed to publish post');
    }
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/social/posts/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Post deleted');
        fetchPosts();
      }
    } catch (error) {
      showMessage('error', 'Failed to delete post');
    }
  };

  // Generate posts
  const handleGenerate = async (type: string) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', result.message || `Generated ${result.posts?.length || 0} posts`);
        fetchPosts();
      } else {
        showMessage('error', result.message || 'Failed to generate posts');
      }
    } catch (error) {
      showMessage('error', 'Failed to generate posts');
    } finally {
      setGenerating(false);
    }
  };

  // Edit post
  const handleEdit = (post: SocialPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  // Filter posts
  const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-sm text-celtic-blue hover:underline">
                &larr; Back to Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Social Media Manager</h1>
              <p className="text-sm text-gray-500">
                Auto-generate and manage social media posts for Twitter/X, Facebook, and Instagram
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* API Status Banner */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-yellow-800">Test Mode Active</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Social media posts are in mock mode. Posts will be logged but not actually sent to social platforms.
                Connect your social media API keys in the environment variables to enable real posting.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && <StatsCard stats={stats} />}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setEditingPost(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-celtic-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Custom Post
          </button>

          <div className="border-l pl-3 ml-1 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 self-center mr-1">Auto-Generate:</span>
            <button
              onClick={() => handleGenerate('auto_results')}
              disabled={generating}
              className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm disabled:opacity-50"
            >
              Result Posts
            </button>
            <button
              onClick={() => handleGenerate('auto_fixtures')}
              disabled={generating}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm disabled:opacity-50"
            >
              Fixture Posts
            </button>
            <button
              onClick={() => handleGenerate('table_update')}
              disabled={generating}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
            >
              League Update
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mt-6 flex gap-2">
          {(['all', 'pending', 'posted', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === status
                  ? 'bg-celtic-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500">No posts yet</p>
              <p className="text-sm text-gray-400 mt-1">Create a custom post or auto-generate from results and fixtures</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPublish={handlePublish}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleCreatePost}
        editingPost={editingPost}
      />
    </div>
  );
}
