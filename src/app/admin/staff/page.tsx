'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getSession,
  getStaffAccounts,
  getActivityLogs,
  addStaffMember,
  updateStaffMember,
  resetPassword,
  changePassword,
  roleLabels,
  type StaffMember,
  type ActivityLog,
  type AuthSession,
} from '@/lib/auth';

export default function StaffManagementPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'staff' | 'logs' | 'password'>('staff');
  const [showAddForm, setShowAddForm] = useState(false);

  // New staff form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<StaffMember['role']>('commercial');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPasswordChange, setNewPasswordChange] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);
    if (currentSession) {
      setStaff(getStaffAccounts());
      setLogs(getActivityLogs(50));
    }
  }, []);

  const refreshData = () => {
    setStaff(getStaffAccounts());
    setLogs(getActivityLogs(50));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newName || !newEmail || !newPassword) {
      setFormError('All fields are required');
      return;
    }

    const result = addStaffMember(newName, newEmail, newRole, newPassword);

    if (result.success) {
      setFormSuccess('Staff member added successfully');
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('commercial');
      setShowAddForm(false);
      refreshData();
    } else {
      setFormError(result.error || 'Failed to add staff member');
    }
  };

  const handleToggleActive = (staffId: string, currentActive: boolean) => {
    updateStaffMember(staffId, { active: !currentActive });
    refreshData();
  };

  const handleResetPassword = (staffId: string, staffName: string) => {
    const tempPassword = 'celtic' + Math.random().toString(36).substring(2, 8);
    if (confirm(`Reset password for ${staffName}? New temporary password will be: ${tempPassword}`)) {
      resetPassword(staffId, tempPassword);
      alert(`Password reset. Temporary password: ${tempPassword}\n\nPlease share this securely with ${staffName}.`);
      refreshData();
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPasswordChange !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPasswordChange.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (!session) return;

    const result = changePassword(session.staffId, currentPassword, newPasswordChange);

    if (result.success) {
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPasswordChange('');
      setConfirmPassword('');
    } else {
      setPasswordError(result.error || 'Failed to change password');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">Please login to access this page</p>
          <Link href="/admin" className="btn-primary">Go to Admin</Link>
        </div>
      </div>
    );
  }

  const canManageStaff = session.role === 'super_admin' || session.role === 'admin';

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Staff Management</h1>
              <p className="text-sm text-white/80">Manage accounts and view activity</p>
            </div>
            <Link href="/admin" className="text-sm text-white/80 hover:text-white">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'staff'
                  ? 'border-celtic-blue text-celtic-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Staff Accounts
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-celtic-blue text-celtic-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity Logs
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-celtic-blue text-celtic-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Staff Accounts Tab */}
            {activeTab === 'staff' && (
              <>
                {canManageStaff && (
                  <div className="mb-6">
                    {!showAddForm ? (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary"
                      >
                        + Add Staff Member
                      </button>
                    ) : (
                      <div className="card p-6">
                        <h3 className="font-bold text-lg mb-4">Add New Staff Member</h3>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="John Smith"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="john@cwmbranceltic.com"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                              </label>
                              <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value as StaffMember['role'])}
                                className="w-full px-4 py-2 border rounded-lg"
                              >
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="editor">Content Editor</option>
                                <option value="commercial">Commercial Manager</option>
                                <option value="operations">Operations</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Temporary Password
                              </label>
                              <input
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="celtic2025"
                                required
                              />
                            </div>
                          </div>

                          {formError && (
                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>
                          )}
                          {formSuccess && (
                            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{formSuccess}</p>
                          )}

                          <div className="flex gap-3">
                            <button type="submit" className="btn-primary">
                              Add Staff Member
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddForm(false);
                                setFormError('');
                                setFormSuccess('');
                              }}
                              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {staff.map((member) => (
                    <div
                      key={member.id}
                      className={`card p-6 ${!member.active ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg text-celtic-dark">{member.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              member.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {member.active ? 'Active' : 'Inactive'}
                            </span>
                            {member.id === session.staffId && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-celtic-blue/10 text-celtic-blue">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-sm text-gray-500">{roleLabels[member.role]}</p>
                          {member.lastLogin && (
                            <p className="text-xs text-gray-400 mt-2">
                              Last login: {new Date(member.lastLogin).toLocaleString()}
                            </p>
                          )}
                        </div>

                        {canManageStaff && member.id !== session.staffId && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResetPassword(member.id, member.name)}
                              className="text-sm text-celtic-blue hover:underline"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => handleToggleActive(member.id, member.active)}
                              className={`text-sm ${
                                member.active ? 'text-red-600' : 'text-green-600'
                              } hover:underline`}
                            >
                              {member.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Activity Logs Tab */}
            {activeTab === 'logs' && (
              <div className="card overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-bold">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Last 50 actions</p>
                </div>
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No activity logged yet
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-celtic-dark">{log.staffName}</p>
                            <p className="text-sm text-gray-600">{log.details}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              log.action === 'login' ? 'bg-green-100 text-green-700' :
                              log.action === 'logout' ? 'bg-gray-100 text-gray-700' :
                              log.action.includes('password') ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {log.action.replace('_', ' ')}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="card p-6 max-w-md mx-auto">
                <h3 className="font-bold text-lg mb-4">Change Your Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPasswordChange}
                      onChange={(e) => setNewPasswordChange(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      minLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      minLength={6}
                      required
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{passwordSuccess}</p>
                  )}

                  <button type="submit" className="btn-primary w-full">
                    Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
