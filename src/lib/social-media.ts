/**
 * Social Media Auto-Posting Service
 *
 * Handles automatic posting to Twitter/X, Facebook, and Instagram.
 * Currently uses mock posting - will connect to real APIs when access is granted.
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Fixture, Result, LeagueTableRow } from '@/types';
import { formatMatchDate, formatMatchDateLong, getResultOutcome, isHomeResult } from '@/lib/comet';

// ============================================
// TYPES
// ============================================

export type Platform = 'twitter' | 'facebook' | 'instagram';
export type PostType = 'result' | 'fixture' | 'matchday' | 'table_update' | 'custom';
export type PostStatus = 'pending' | 'scheduled' | 'posted' | 'failed';

export interface SocialPost {
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

export interface PostTemplate {
  type: PostType;
  templates: {
    win: string;
    draw: string;
    loss: string;
    fixture: string;
    matchday: string;
    tableUpdate: string;
  };
  hashtags: string[];
}

interface SocialPostsData {
  posts: SocialPost[];
  lastUpdated: string;
}

// ============================================
// CONFIGURATION
// ============================================

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'social-posts.json');

// Social Media API Configuration (populate when access granted)
const SOCIAL_CONFIG = {
  twitter: {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
  },
  facebook: {
    pageId: process.env.FACEBOOK_PAGE_ID || '',
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
  },
  instagram: {
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ID || '',
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
  },
};

// Set to true when API keys are available
const USE_LIVE_API = false;

// Default hashtags for posts
const DEFAULT_HASHTAGS = ['CwmbranCeltic', 'CelticFamily', 'UpTheCelts', 'WelshFootball'];

// ============================================
// POST TEMPLATES
// ============================================

const POST_TEMPLATES: PostTemplate = {
  type: 'result',
  templates: {
    win: `✅ FULL TIME | VICTORY!\n\n{homeTeam} {homeScore} - {awayScore} {awayTeam}\n\n{scorers}\n\n🏟️ {venue}\n📊 {competition}\n\nGet in! What a result, Celts! 💚💙`,
    draw: `⚖️ FULL TIME | DRAW\n\n{homeTeam} {homeScore} - {awayScore} {awayTeam}\n\n{scorers}\n\n🏟️ {venue}\n📊 {competition}\n\nA point on the road. We go again! 💚💙`,
    loss: `❌ FULL TIME\n\n{homeTeam} {homeScore} - {awayScore} {awayTeam}\n\n{scorers}\n\n🏟️ {venue}\n📊 {competition}\n\nWe'll bounce back. Thanks for your support! 💚💙`,
    fixture: `📅 UPCOMING FIXTURE\n\n🆚 {opponent}\n📆 {date}\n⏰ {time}\n🏟️ {venue}\n📊 {competition}\n\nCome support the Celts! 💚💙`,
    matchday: `🔥 IT'S MATCHDAY!\n\n🆚 {opponent}\n⏰ Kick-off: {time}\n🏟️ {venue}\n📊 {competition}\n\n🎟️ Adults: £{adultPrice} | Concessions: £{concessionPrice}\n\nSee you at the ground! 💚💙`,
    tableUpdate: `📊 LEAGUE UPDATE\n\nWe sit {position}{suffix} in the {league} with {points} points from {played} games.\n\n✅ {won} wins\n🤝 {drawn} draws\n❌ {lost} losses\n\nOnwards and upwards! 💚💙`,
  },
  hashtags: DEFAULT_HASHTAGS,
};

// ============================================
// DATA PERSISTENCE
// ============================================

async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readPosts(): Promise<SocialPostsData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { posts: [], lastUpdated: new Date().toISOString() };
  }
}

async function writePosts(data: SocialPostsData): Promise<void> {
  await ensureDataDir();
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(POSTS_FILE, JSON.stringify(data, null, 2));
}

// ============================================
// POST GENERATION
// ============================================

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function formatTemplate(template: string, vars: Record<string, string | number | undefined>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value || ''));
  }
  return result;
}

/**
 * Generate a post for a match result
 */
export function generateResultPost(result: Result): Omit<SocialPost, 'id' | 'createdAt'> {
  const outcome = getResultOutcome(result);
  const isHome = isHomeResult(result);

  let template: string;
  if (outcome === 'W') {
    template = POST_TEMPLATES.templates.win;
  } else if (outcome === 'D') {
    template = POST_TEMPLATES.templates.draw;
  } else {
    template = POST_TEMPLATES.templates.loss;
  }

  const scorersText = result.scorers
    ? `⚽ ${result.scorers}`
    : '';

  const text = formatTemplate(template, {
    homeTeam: result.homeTeam,
    awayTeam: result.awayTeam,
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    scorers: scorersText,
    venue: isHome ? 'Avondale Motor Park Arena' : 'Away',
    competition: result.competition,
  });

  return {
    type: 'result',
    platforms: ['twitter', 'facebook', 'instagram'],
    content: {
      text,
      hashtags: [...POST_TEMPLATES.hashtags],
    },
    status: 'pending',
    sourceData: {
      matchId: result.matchId,
      type: 'result',
    },
  };
}

/**
 * Generate a post for an upcoming fixture
 */
export function generateFixturePost(fixture: Fixture): Omit<SocialPost, 'id' | 'createdAt'> {
  const isHome = fixture.homeAway === 'H';
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;

  const text = formatTemplate(POST_TEMPLATES.templates.fixture, {
    opponent,
    date: formatMatchDateLong(fixture.date),
    time: fixture.time,
    venue: isHome ? 'Avondale Motor Park Arena' : fixture.venue,
    competition: fixture.competition,
  });

  return {
    type: 'fixture',
    platforms: ['twitter', 'facebook', 'instagram'],
    content: {
      text,
      hashtags: [...POST_TEMPLATES.hashtags],
    },
    status: 'pending',
    sourceData: {
      matchId: fixture.matchId,
      type: 'fixture',
    },
  };
}

/**
 * Generate a matchday post (same day reminder)
 */
export function generateMatchdayPost(fixture: Fixture): Omit<SocialPost, 'id' | 'createdAt'> {
  const isHome = fixture.homeAway === 'H';
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;

  const text = formatTemplate(POST_TEMPLATES.templates.matchday, {
    opponent,
    time: fixture.time,
    venue: isHome ? 'Avondale Motor Park Arena' : fixture.venue,
    competition: fixture.competition,
    adultPrice: '5',
    concessionPrice: '3',
  });

  return {
    type: 'matchday',
    platforms: ['twitter', 'facebook', 'instagram'],
    content: {
      text,
      hashtags: [...POST_TEMPLATES.hashtags, 'Matchday'],
    },
    status: 'pending',
    sourceData: {
      matchId: fixture.matchId,
      type: 'matchday',
    },
  };
}

/**
 * Generate a league table update post
 */
export function generateTableUpdatePost(row: LeagueTableRow, leagueName: string): Omit<SocialPost, 'id' | 'createdAt'> {
  const text = formatTemplate(POST_TEMPLATES.templates.tableUpdate, {
    position: row.position,
    suffix: getOrdinalSuffix(row.position),
    league: leagueName,
    points: row.points,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
  });

  return {
    type: 'table_update',
    platforms: ['twitter', 'facebook'],
    content: {
      text,
      hashtags: [...POST_TEMPLATES.hashtags, 'LeagueUpdate'],
    },
    status: 'pending',
  };
}

/**
 * Create a custom post
 */
export function createCustomPost(
  text: string,
  platforms: Platform[],
  hashtags: string[] = DEFAULT_HASHTAGS,
  imageUrl?: string
): Omit<SocialPost, 'id' | 'createdAt'> {
  return {
    type: 'custom',
    platforms,
    content: {
      text,
      hashtags,
      imageUrl,
    },
    status: 'pending',
  };
}

// ============================================
// POST MANAGEMENT
// ============================================

/**
 * Save a new post to the queue
 */
export async function queuePost(post: Omit<SocialPost, 'id' | 'createdAt'>): Promise<SocialPost> {
  const data = await readPosts();

  const newPost: SocialPost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  data.posts.push(newPost);
  await writePosts(data);

  return newPost;
}

/**
 * Get all posts
 */
export async function getAllPosts(): Promise<SocialPost[]> {
  const data = await readPosts();
  return data.posts.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get pending posts
 */
export async function getPendingPosts(): Promise<SocialPost[]> {
  const data = await readPosts();
  return data.posts.filter(p => p.status === 'pending');
}

/**
 * Get posts by status
 */
export async function getPostsByStatus(status: PostStatus): Promise<SocialPost[]> {
  const data = await readPosts();
  return data.posts.filter(p => p.status === status);
}

/**
 * Update post status
 */
export async function updatePostStatus(
  postId: string,
  status: PostStatus,
  error?: string
): Promise<SocialPost | null> {
  const data = await readPosts();
  const post = data.posts.find(p => p.id === postId);

  if (!post) return null;

  post.status = status;
  if (status === 'posted') {
    post.postedAt = new Date().toISOString();
  }
  if (error) {
    post.error = error;
  }

  await writePosts(data);
  return post;
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<boolean> {
  const data = await readPosts();
  const index = data.posts.findIndex(p => p.id === postId);

  if (index === -1) return false;

  data.posts.splice(index, 1);
  await writePosts(data);
  return true;
}

/**
 * Update post content
 */
export async function updatePostContent(
  postId: string,
  content: Partial<SocialPost['content']>
): Promise<SocialPost | null> {
  const data = await readPosts();
  const post = data.posts.find(p => p.id === postId);

  if (!post) return null;

  post.content = { ...post.content, ...content };
  await writePosts(data);
  return post;
}

/**
 * Check if post already exists for a match
 */
export async function postExistsForMatch(matchId: number, type: string): Promise<boolean> {
  const data = await readPosts();
  return data.posts.some(
    p => p.sourceData?.matchId === matchId && p.sourceData?.type === type
  );
}

// ============================================
// MOCK POSTING (Replace with real API calls)
// ============================================

/**
 * Post to Twitter/X (mock)
 */
async function postToTwitter(post: SocialPost): Promise<{ success: boolean; error?: string }> {
  if (USE_LIVE_API && SOCIAL_CONFIG.twitter.apiKey) {
    // Real Twitter API v2 implementation would go here
    // const client = new TwitterApi(SOCIAL_CONFIG.twitter);
    // await client.v2.tweet(post.content.text + '\n\n' + post.content.hashtags.map(h => `#${h}`).join(' '));
    return { success: false, error: 'Twitter API not implemented' };
  }

  // Mock posting
  console.log('[MOCK] Twitter post:', post.content.text);
  return { success: true };
}

/**
 * Post to Facebook (mock)
 */
async function postToFacebook(post: SocialPost): Promise<{ success: boolean; error?: string }> {
  if (USE_LIVE_API && SOCIAL_CONFIG.facebook.accessToken) {
    // Real Facebook Graph API implementation would go here
    // await fetch(`https://graph.facebook.com/${SOCIAL_CONFIG.facebook.pageId}/feed`, {
    //   method: 'POST',
    //   body: JSON.stringify({ message: post.content.text, access_token: SOCIAL_CONFIG.facebook.accessToken })
    // });
    return { success: false, error: 'Facebook API not implemented' };
  }

  // Mock posting
  console.log('[MOCK] Facebook post:', post.content.text);
  return { success: true };
}

/**
 * Post to Instagram (mock)
 */
async function postToInstagram(post: SocialPost): Promise<{ success: boolean; error?: string }> {
  if (USE_LIVE_API && SOCIAL_CONFIG.instagram.accessToken) {
    // Real Instagram Graph API implementation would go here
    // Note: Instagram requires an image for posts
    return { success: false, error: 'Instagram API not implemented' };
  }

  // Mock posting
  console.log('[MOCK] Instagram post:', post.content.text);
  return { success: true };
}

/**
 * Post to all selected platforms
 */
export async function publishPost(postId: string): Promise<{
  success: boolean;
  results: Record<Platform, { success: boolean; error?: string }>;
}> {
  const data = await readPosts();
  const post = data.posts.find(p => p.id === postId);

  if (!post) {
    return {
      success: false,
      results: {
        twitter: { success: false, error: 'Post not found' },
        facebook: { success: false, error: 'Post not found' },
        instagram: { success: false, error: 'Post not found' },
      },
    };
  }

  const results: Record<Platform, { success: boolean; error?: string }> = {
    twitter: { success: false, error: 'Not selected' },
    facebook: { success: false, error: 'Not selected' },
    instagram: { success: false, error: 'Not selected' },
  };

  // Post to each platform
  for (const platform of post.platforms) {
    switch (platform) {
      case 'twitter':
        results.twitter = await postToTwitter(post);
        break;
      case 'facebook':
        results.facebook = await postToFacebook(post);
        break;
      case 'instagram':
        results.instagram = await postToInstagram(post);
        break;
    }
  }

  // Update post status
  const allSuccess = post.platforms.every(p => results[p].success);
  await updatePostStatus(postId, allSuccess ? 'posted' : 'failed');

  return {
    success: allSuccess,
    results,
  };
}

// ============================================
// AUTO-POSTING TRIGGERS
// ============================================

/**
 * Check for new results and generate posts
 */
export async function checkAndGenerateResultPosts(results: Result[]): Promise<SocialPost[]> {
  const newPosts: SocialPost[] = [];

  for (const result of results) {
    const exists = await postExistsForMatch(result.matchId, 'result');
    if (!exists) {
      const postData = generateResultPost(result);
      const post = await queuePost(postData);
      newPosts.push(post);
    }
  }

  return newPosts;
}

/**
 * Check for upcoming fixtures and generate posts
 */
export async function checkAndGenerateFixturePosts(fixtures: Fixture[]): Promise<SocialPost[]> {
  const newPosts: SocialPost[] = [];
  const now = Date.now();
  const threeDaysFromNow = now + (3 * 24 * 60 * 60 * 1000);

  for (const fixture of fixtures) {
    // Only generate posts for fixtures within the next 3 days
    if (fixture.date > now && fixture.date < threeDaysFromNow) {
      const exists = await postExistsForMatch(fixture.matchId, 'fixture');
      if (!exists) {
        const postData = generateFixturePost(fixture);
        const post = await queuePost(postData);
        newPosts.push(post);
      }
    }
  }

  return newPosts;
}

/**
 * Get statistics about posts
 */
export async function getPostStats(): Promise<{
  total: number;
  pending: number;
  posted: number;
  failed: number;
  byType: Record<PostType, number>;
}> {
  const data = await readPosts();

  const stats = {
    total: data.posts.length,
    pending: 0,
    posted: 0,
    failed: 0,
    byType: {
      result: 0,
      fixture: 0,
      matchday: 0,
      table_update: 0,
      custom: 0,
    } as Record<PostType, number>,
  };

  for (const post of data.posts) {
    if (post.status === 'pending') stats.pending++;
    if (post.status === 'posted') stats.posted++;
    if (post.status === 'failed') stats.failed++;
    stats.byType[post.type]++;
  }

  return stats;
}
