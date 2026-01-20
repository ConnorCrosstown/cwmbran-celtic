/**
 * Newsletter Subscriber Management
 *
 * Simple file-based storage for newsletter subscribers.
 * For production, consider migrating to a proper database.
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  subscribedAt: string;
  unsubscribeToken: string;
  active: boolean;
}

interface SubscribersData {
  subscribers: Subscriber[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'newsletter-subscribers.json');

/**
 * Ensure data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Read subscribers from file
 */
async function readSubscribers(): Promise<SubscribersData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { subscribers: [], lastUpdated: new Date().toISOString() };
  }
}

/**
 * Write subscribers to file
 */
async function writeSubscribers(data: SubscribersData): Promise<void> {
  await ensureDataDir();
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2));
}

/**
 * Generate unique token for unsubscribe links
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Add a new subscriber
 */
export async function addSubscriber(email: string, firstName?: string): Promise<{ success: boolean; message: string }> {
  const data = await readSubscribers();

  // Check if already subscribed
  const existing = data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    if (existing.active) {
      return { success: false, message: 'This email is already subscribed.' };
    }
    // Reactivate
    existing.active = true;
    existing.subscribedAt = new Date().toISOString();
    await writeSubscribers(data);
    return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
  }

  // Add new subscriber
  const subscriber: Subscriber = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    firstName,
    subscribedAt: new Date().toISOString(),
    unsubscribeToken: generateToken(),
    active: true,
  };

  data.subscribers.push(subscriber);
  await writeSubscribers(data);

  return { success: true, message: 'Successfully subscribed to the newsletter!' };
}

/**
 * Unsubscribe by token
 */
export async function unsubscribeByToken(token: string): Promise<{ success: boolean; message: string }> {
  const data = await readSubscribers();

  const subscriber = data.subscribers.find(s => s.unsubscribeToken === token);

  if (!subscriber) {
    return { success: false, message: 'Invalid unsubscribe link.' };
  }

  if (!subscriber.active) {
    return { success: false, message: 'This email is already unsubscribed.' };
  }

  subscriber.active = false;
  await writeSubscribers(data);

  return { success: true, message: 'Successfully unsubscribed from the newsletter.' };
}

/**
 * Get all active subscribers
 */
export async function getActiveSubscribers(): Promise<Subscriber[]> {
  const data = await readSubscribers();
  return data.subscribers.filter(s => s.active);
}

/**
 * Get subscriber count
 */
export async function getSubscriberCount(): Promise<number> {
  const active = await getActiveSubscribers();
  return active.length;
}

/**
 * Get subscriber by email
 */
export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const data = await readSubscribers();
  return data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
}
