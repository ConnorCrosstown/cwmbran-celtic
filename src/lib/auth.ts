/**
 * Staff Authentication System
 *
 * Currently uses localStorage for demo/admin-tool purposes.
 *
 * IMPORTANT (AUDIT-2026-05-20.md P0-6): this module runs entirely in the
 * browser. Anyone can reach `/admin` and read/write the localStorage hashes,
 * so it does NOT provide real authentication. Treat it as a soft gate.
 * Real auth (httpOnly session cookies + server-validated middleware) is the
 * next-step fix.
 */

import bcrypt from 'bcryptjs';

// Bcrypt cost factor — 10 is the bcryptjs default and is the right balance
// between brute-force resistance and browser-side hashing latency (~100ms).
const BCRYPT_ROUNDS = 10;

// Storage key bumped to v2 so the old XOR-style hashes are invalidated
// rather than silently accepted (they would never compare equal anyway).
const STAFF_STORAGE_KEY = 'staff-accounts-v2';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'commercial' | 'operations';
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
  active: boolean;
}

export interface ActivityLog {
  id: string;
  staffId: string;
  staffName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AuthSession {
  staffId: string;
  staffName: string;
  staffEmail: string;
  role: StaffMember['role'];
  loginTime: string;
}

// Hash a password with bcryptjs (sync). bcryptjs is JS-only and runs fine in
// the browser, though the hashing pause is ~100ms at cost 10 — acceptable for
// staff login flows.
function hashPassword(password: string): string {
  return bcrypt.hashSync(password, BCRYPT_ROUNDS);
}

function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}

// Role display names
export const roleLabels: Record<StaffMember['role'], string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Content Editor',
  commercial: 'Commercial Manager',
  operations: 'Operations',
};

// Default staff accounts
const defaultStaff: Omit<StaffMember, 'passwordHash'>[] = [
  {
    id: 'staff_connor',
    name: 'Connor Sherlock',
    email: 'connor@cwmbranceltic.com',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'staff_matt',
    name: 'Matt Sherlock',
    email: 'matt@cwmbranceltic.com',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    active: true,
  },
];

// Initialize staff accounts if not exists
export function initializeStaff(): void {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem(STAFF_STORAGE_KEY);
  if (!existing) {
    // Create default accounts with temporary passwords
    const staffWithPasswords: StaffMember[] = defaultStaff.map(staff => ({
      ...staff,
      // Default password is 'celtic2025' - staff should change on first login
      passwordHash: hashPassword('celtic2025'),
    }));
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffWithPasswords));
  }
}

// Get all staff accounts
export function getStaffAccounts(): StaffMember[] {
  if (typeof window === 'undefined') return [];
  initializeStaff();
  const data = localStorage.getItem(STAFF_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Get staff by email
export function getStaffByEmail(email: string): StaffMember | null {
  const staff = getStaffAccounts();
  return staff.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
}

// Get staff by ID
export function getStaffById(id: string): StaffMember | null {
  const staff = getStaffAccounts();
  return staff.find(s => s.id === id) || null;
}

// Authenticate staff member
export function authenticateStaff(email: string, password: string): { success: boolean; error?: string; staff?: StaffMember } {
  const staff = getStaffByEmail(email);

  if (!staff) {
    return { success: false, error: 'Account not found' };
  }

  if (!staff.active) {
    return { success: false, error: 'Account has been deactivated' };
  }

  if (!verifyPassword(password, staff.passwordHash)) {
    return { success: false, error: 'Incorrect password' };
  }

  // Update last login
  const allStaff = getStaffAccounts();
  const updatedStaff = allStaff.map(s =>
    s.id === staff.id ? { ...s, lastLogin: new Date().toISOString() } : s
  );
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedStaff));

  return { success: true, staff };
}

// Create session
export function createSession(staff: StaffMember): void {
  if (typeof window === 'undefined') return;

  const session: AuthSession = {
    staffId: staff.id,
    staffName: staff.name,
    staffEmail: staff.email,
    role: staff.role,
    loginTime: new Date().toISOString(),
  };

  sessionStorage.setItem('staff-session', JSON.stringify(session));
  // Also set the old auth flag for backwards compatibility
  sessionStorage.setItem('admin-auth', 'true');

  logActivity(staff.id, staff.name, 'login', 'Logged in');
}

// Get current session
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  const data = sessionStorage.getItem('staff-session');
  return data ? JSON.parse(data) : null;
}

// End session (logout)
export function endSession(): void {
  if (typeof window === 'undefined') return;

  const session = getSession();
  if (session) {
    logActivity(session.staffId, session.staffName, 'logout', 'Logged out');
  }

  sessionStorage.removeItem('staff-session');
  sessionStorage.removeItem('admin-auth');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

// Add new staff member (super_admin only)
export function addStaffMember(
  name: string,
  email: string,
  role: StaffMember['role'],
  temporaryPassword: string
): { success: boolean; error?: string } {
  const existing = getStaffByEmail(email);
  if (existing) {
    return { success: false, error: 'Email already exists' };
  }

  const newStaff: StaffMember = {
    id: 'staff_' + Date.now(),
    name,
    email,
    role,
    passwordHash: hashPassword(temporaryPassword),
    createdAt: new Date().toISOString(),
    active: true,
  };

  const allStaff = getStaffAccounts();
  allStaff.push(newStaff);
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(allStaff));

  const session = getSession();
  if (session) {
    logActivity(session.staffId, session.staffName, 'add_staff', `Added staff member: ${name} (${email})`);
  }

  return { success: true };
}

// Update staff member
export function updateStaffMember(id: string, updates: Partial<Pick<StaffMember, 'name' | 'email' | 'role' | 'active'>>): boolean {
  const allStaff = getStaffAccounts();
  const index = allStaff.findIndex(s => s.id === id);

  if (index === -1) return false;

  allStaff[index] = { ...allStaff[index], ...updates };
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(allStaff));

  const session = getSession();
  if (session) {
    logActivity(session.staffId, session.staffName, 'update_staff', `Updated staff member: ${allStaff[index].name}`);
  }

  return true;
}

// Change password
export function changePassword(staffId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const staff = getStaffById(staffId);
  if (!staff) {
    return { success: false, error: 'Staff member not found' };
  }

  if (!verifyPassword(currentPassword, staff.passwordHash)) {
    return { success: false, error: 'Current password is incorrect' };
  }

  const allStaff = getStaffAccounts();
  const updated = allStaff.map(s =>
    s.id === staffId ? { ...s, passwordHash: hashPassword(newPassword) } : s
  );
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));

  logActivity(staffId, staff.name, 'change_password', 'Changed password');

  return { success: true };
}

// Reset password (super_admin only)
export function resetPassword(staffId: string, newPassword: string): boolean {
  const allStaff = getStaffAccounts();
  const index = allStaff.findIndex(s => s.id === staffId);

  if (index === -1) return false;

  allStaff[index].passwordHash = hashPassword(newPassword);
  // NB: bcryptjs is sync but slow (~100ms); fine for one-off resets.
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(allStaff));

  const session = getSession();
  if (session) {
    logActivity(session.staffId, session.staffName, 'reset_password', `Reset password for: ${allStaff[index].name}`);
  }

  return true;
}

// Activity logging
export function logActivity(staffId: string, staffName: string, action: string, details: string): void {
  if (typeof window === 'undefined') return;

  const log: ActivityLog = {
    id: 'log_' + Date.now(),
    staffId,
    staffName,
    action,
    details,
    timestamp: new Date().toISOString(),
  };

  const logs = getActivityLogs();
  logs.unshift(log); // Add to beginning

  // Keep only last 500 logs
  const trimmed = logs.slice(0, 500);
  localStorage.setItem('activity-logs', JSON.stringify(trimmed));
}

// Get activity logs
export function getActivityLogs(limit = 100): ActivityLog[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem('activity-logs');
  const logs: ActivityLog[] = data ? JSON.parse(data) : [];
  return logs.slice(0, limit);
}

// Request password reset (would send email in production)
export function requestPasswordReset(email: string): { success: boolean; message: string } {
  const staff = getStaffByEmail(email);

  if (!staff) {
    // Don't reveal if email exists or not for security
    return {
      success: true,
      message: 'If an account exists with this email, a reset link will be sent.'
    };
  }

  // In production, this would send an email with a reset link
  // For now, we'll generate a temporary password and log it
  const tempPassword = 'reset_' + Math.random().toString(36).substring(2, 10);
  resetPassword(staff.id, tempPassword);

  // In a real system, this would be emailed
  console.log(`Password reset for ${email}: ${tempPassword}`);

  return {
    success: true,
    message: 'If an account exists with this email, a reset link will be sent.'
  };
}
