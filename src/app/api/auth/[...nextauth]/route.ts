/**
 * NextAuth.js API Route Handler
 *
 * Handles all authentication requests (sign in, sign out, session, etc.)
 */

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
