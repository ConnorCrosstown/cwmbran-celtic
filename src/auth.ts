/**
 * NextAuth.js Entry Point
 *
 * Exports auth handlers and utilities for use throughout the application.
 * This file runs in Node.js runtime (not Edge) for API routes.
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import type { NextAuthConfig } from 'next-auth';

// Types
interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'commercial' | 'operations';
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
  active: boolean;
}

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const STAFF_FILE = path.join(DATA_DIR, 'staff-accounts.json');

// Default staff accounts
const defaultStaff = [
  {
    id: 'staff_connor',
    name: 'Connor Sherlock',
    email: 'connor@cwmbranceltic.com',
    role: 'super_admin' as const,
  },
  {
    id: 'staff_matt',
    name: 'Matt Sherlock',
    email: 'matt@cwmbranceltic.com',
    role: 'super_admin' as const,
  },
];

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize staff accounts if they don't exist
async function initializeStaff(): Promise<void> {
  await ensureDataDir();

  try {
    await fs.access(STAFF_FILE);
    // File exists, check if it needs migration from simple hash
    const data = await fs.readFile(STAFF_FILE, 'utf-8');
    const staff: StaffMember[] = JSON.parse(data);

    // Check if any passwords need migration (start with 'hash_')
    const needsMigration = staff.some((s) => s.passwordHash.startsWith('hash_'));
    if (needsMigration) {
      const defaultPasswordHash = await bcrypt.hash('celtic2025', 12);
      const migratedStaff = staff.map((s) => ({
        ...s,
        passwordHash: s.passwordHash.startsWith('hash_') ? defaultPasswordHash : s.passwordHash,
      }));
      await fs.writeFile(STAFF_FILE, JSON.stringify(migratedStaff, null, 2));
    }
  } catch {
    // File doesn't exist, create default accounts
    const defaultPasswordHash = await bcrypt.hash('celtic2025', 12);
    const staffAccounts: StaffMember[] = defaultStaff.map((staff) => ({
      ...staff,
      passwordHash: defaultPasswordHash,
      createdAt: new Date().toISOString(),
      active: true,
    }));
    await fs.writeFile(STAFF_FILE, JSON.stringify(staffAccounts, null, 2));
  }
}

// Get staff by email
async function getStaffByEmail(email: string): Promise<StaffMember | null> {
  await initializeStaff();
  const data = await fs.readFile(STAFF_FILE, 'utf-8');
  const staff: StaffMember[] = JSON.parse(data);
  return staff.find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
}

// Update last login
async function updateLastLogin(staffId: string): Promise<void> {
  const data = await fs.readFile(STAFF_FILE, 'utf-8');
  const staff: StaffMember[] = JSON.parse(data);
  const updated = staff.map((s) =>
    s.id === staffId ? { ...s, lastLogin: new Date().toISOString() } : s
  );
  await fs.writeFile(STAFF_FILE, JSON.stringify(updated, null, 2));
}

// Auth configuration
const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'Staff Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const staff = await getStaffByEmail(email);

          if (!staff || !staff.active) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(password, staff.passwordHash);

          if (!isValidPassword) {
            return null;
          }

          // Update last login time
          await updateLastLogin(staff.id);

          return {
            id: staff.id,
            email: staff.email,
            name: staff.name,
            role: staff.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
