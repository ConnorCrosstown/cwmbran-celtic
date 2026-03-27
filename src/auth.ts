/**
 * NextAuth.js Entry Point
 *
 * Exports auth handlers and utilities for use throughout the application.
 * Uses environment variables for staff credentials (Vercel-compatible).
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';

// Types
interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'commercial' | 'operations';
  passwordHash: string;
}

// Staff accounts - in production, these would come from a database
// Password hash is generated from 'celtic2025' with bcrypt (12 rounds)
const STAFF_ACCOUNTS: StaffMember[] = [
  {
    id: 'staff_connor',
    name: 'Connor Sherlock',
    email: 'connor@cwmbranceltic.com',
    role: 'super_admin',
    // Hash of 'celtic2025'
    passwordHash: '$2b$12$SDBwyYlelHheDhgwunU6bOkG7HxnziTICpcYivcyuBAXbrVCQSFky',
  },
  {
    id: 'staff_matt',
    name: 'Matt Sherlock',
    email: 'matt@cwmbranceltic.com',
    role: 'super_admin',
    // Hash of 'celtic2025'
    passwordHash: '$2b$12$SDBwyYlelHheDhgwunU6bOkG7HxnziTICpcYivcyuBAXbrVCQSFky',
  },
];

// Get staff by email
function getStaffByEmail(email: string): StaffMember | null {
  return STAFF_ACCOUNTS.find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
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
          const staff = getStaffByEmail(email);

          if (!staff) {
            return null;
          }

          // Verify password against bcrypt hash
          const isValidPassword = await bcrypt.compare(password, staff.passwordHash);

          if (!isValidPassword) {
            return null;
          }

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
