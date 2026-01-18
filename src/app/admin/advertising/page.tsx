'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  advertisingBoards,
  AdvertisingBoard,
  BoardLocation,
  BoardStatus,
  BoardSize,
  locationNames,
  sizeDetails,
  getBoardStats,
  getBoardsByLocation,
  getBoardsByStatus,
} from '@/data/advertising-boards';

type ViewMode = 'grid' | 'list' | 'location';
type FilterStatus = BoardStatus | 'all';

// Password protection component
function PasswordGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'celtic2025') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin-auth', 'true');
      }
      onAuthenticated();
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-celtic-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-celtic-dark">Advertising Admin</h1>
          <p className="text-sm text-gray-500">Enter password to access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 border rounded-lg text-center text-lg tracking-widest"
            autoFocus
          />
          <button type="submit" className="btn-primary w-full py-3">
            Access Admin
          </button>
        </form>

        <Link href="/admin" className="block text-center text-sm text-gray-500 mt-6 hover:text-celtic-blue">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}

const statusColors: Record<BoardStatus, string> = {
  'available': 'bg-green-100 text-green-800 border-green-300',
  'sponsored': 'bg-blue-100 text-blue-800 border-blue-300',
  'reserved': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'renewal-due': 'bg-orange-100 text-orange-800 border-orange-300',
};

const statusLabels: Record<BoardStatus, string> = {
  'available': 'Available',
  'sponsored': 'Sponsored',
  'reserved': 'Reserved',
  'renewal-due': 'Renewal Due',
};

function BoardCard({ board, onEdit }: { board: AdvertisingBoard; onEdit: (board: AdvertisingBoard) => void }) {
  const size = sizeDetails[board.size];

  return (
    <div className="card p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs text-gray-500">Board #{board.boardNumber}</span>
          <h3 className="font-bold text-celtic-dark">{locationNames[board.location]}</h3>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusColors[board.status]}`}>
          {statusLabels[board.status]}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Size:</span>
          <span className="font-medium">{size.name} ({size.dimensions})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Price:</span>
          <span className="font-bold text-celtic-blue">£{board.pricePerSeason}/season</span>
        </div>

        {board.sponsor && (
          <div className="pt-2 mt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">SPONSOR</p>
            <p className="font-semibold text-celtic-dark">{board.sponsor.name}</p>
            {board.sponsor.contactName && (
              <p className="text-xs text-gray-500">{board.sponsor.contactName}</p>
            )}
            {board.sponsor.contactEmail && (
              <p className="text-xs text-celtic-blue">{board.sponsor.contactEmail}</p>
            )}
          </div>
        )}

        {board.contract && (
          <div className="pt-2 mt-2 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Contract:</span>
              <span className={board.contract.paymentStatus === 'paid' ? 'text-green-600' : board.contract.paymentStatus === 'overdue' ? 'text-red-600' : 'text-yellow-600'}>
                {board.contract.paymentStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(board.contract.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(board.contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => onEdit(board)}
        className="mt-3 w-full btn-primary text-xs py-2"
      >
        {board.status === 'available' ? 'Add Sponsor' : 'Edit Details'}
      </button>
    </div>
  );
}

function StatsCard({ label, value, subtext, color }: { label: string; value: string | number; subtext?: string; color: string }) {
  return (
    <div className={`card p-4 border-l-4 ${color}`}>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="text-2xl font-bold text-celtic-dark">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );
}

function RenewalAlerts({ boards, onEdit }: { boards: AdvertisingBoard[]; onEdit: (board: AdvertisingBoard) => void }) {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Get boards with contracts expiring soon
  const getExpiringBoards = () => {
    return boards
      .filter(b => b.contract?.endDate && (b.status === 'sponsored' || b.status === 'renewal-due'))
      .map(b => {
        const endDate = new Date(b.contract!.endDate);
        const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return { ...b, daysUntilExpiry, endDate };
      })
      .filter(b => b.daysUntilExpiry <= 90) // Show boards expiring within 90 days
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  };

  const expiringBoards = getExpiringBoards();

  // Get overdue payments
  const overdueBoards = boards.filter(b => b.contract?.paymentStatus === 'overdue');

  if (expiringBoards.length === 0 && overdueBoards.length === 0) {
    return null;
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return 'bg-red-100 border-red-300 text-red-800';
    if (days <= 30) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (days <= 60) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-blue-100 border-blue-300 text-blue-800';
  };

  const getUrgencyLabel = (days: number) => {
    if (days <= 0) return 'EXPIRED';
    if (days <= 7) return 'URGENT';
    if (days <= 30) return 'DUE SOON';
    return 'UPCOMING';
  };

  return (
    <section className="py-6 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <h2 className="font-bold text-lg text-celtic-dark">Renewal Alerts</h2>
          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            {expiringBoards.length + overdueBoards.length} attention needed
          </span>
        </div>

        {/* Overdue Payments */}
        {overdueBoards.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Overdue Payments ({overdueBoards.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {overdueBoards.map(board => (
                <div key={board.id} className="card p-3 border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-celtic-dark">Board #{board.boardNumber}</p>
                      <p className="text-xs text-gray-500">{board.sponsor?.name}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-full">
                      OVERDUE
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">£{board.pricePerSeason} owed</p>
                    <button
                      onClick={() => onEdit(board)}
                      className="text-xs text-celtic-blue font-semibold hover:underline"
                    >
                      Update →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expiring Contracts */}
        {expiringBoards.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Contracts Expiring Soon ({expiringBoards.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {expiringBoards.map(board => (
                <div
                  key={board.id}
                  className={`card p-3 border-l-4 ${board.daysUntilExpiry <= 0 ? 'border-red-500' : board.daysUntilExpiry <= 30 ? 'border-orange-500' : board.daysUntilExpiry <= 60 ? 'border-yellow-500' : 'border-blue-500'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-celtic-dark">Board #{board.boardNumber}</p>
                      <p className="text-xs text-gray-500">{board.sponsor?.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getUrgencyColor(board.daysUntilExpiry)}`}>
                      {getUrgencyLabel(board.daysUntilExpiry)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        Expires: {board.endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className={`text-xs font-semibold ${board.daysUntilExpiry <= 0 ? 'text-red-600' : board.daysUntilExpiry <= 30 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {board.daysUntilExpiry <= 0
                          ? `${Math.abs(board.daysUntilExpiry)} days overdue`
                          : `${board.daysUntilExpiry} days remaining`
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => onEdit(board)}
                      className="text-xs text-celtic-blue font-semibold hover:underline"
                    >
                      Renew →
                    </button>
                  </div>
                  {board.sponsor?.contactEmail && (
                    <a
                      href={`mailto:${board.sponsor.contactEmail}?subject=Cwmbran Celtic - Advertising Board Renewal&body=Hi ${board.sponsor.contactName || ''},\n\nYour advertising board sponsorship (Board #${board.boardNumber}) at Cwmbran Celtic is due for renewal on ${board.endDate.toLocaleDateString('en-GB')}.\n\nWe would love to have you continue supporting the club. Please let us know if you would like to renew your sponsorship for another season.\n\nBest regards,\nCwmbran Celtic AFC`}
                      className="mt-2 block w-full text-center px-3 py-1.5 bg-celtic-blue/10 text-celtic-blue text-xs font-semibold rounded hover:bg-celtic-blue/20 transition-colors"
                    >
                      Send Renewal Email
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EditModal({
  board,
  onClose,
  onSave
}: {
  board: AdvertisingBoard;
  onClose: () => void;
  onSave: (board: AdvertisingBoard) => void;
}) {
  const [formData, setFormData] = useState<AdvertisingBoard>(board);

  const handleSponsorChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sponsor: {
        ...prev.sponsor,
        name: prev.sponsor?.name || '',
        [field]: value,
      }
    }));
  };

  const handleContractChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contract: {
        ...prev.contract,
        startDate: prev.contract?.startDate || new Date().toISOString().split('T')[0],
        endDate: prev.contract?.endDate || new Date().toISOString().split('T')[0],
        paymentStatus: prev.contract?.paymentStatus || 'pending',
        [field]: value,
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-celtic-blue p-4 sticky top-0">
          <h2 className="text-lg font-bold text-white">
            Edit Board #{board.boardNumber}
          </h2>
          <p className="text-xs text-white/80">{locationNames[board.location]} - {sizeDetails[board.size].name}</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BoardStatus })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value="available">Available</option>
              <option value="sponsored">Sponsored</option>
              <option value="reserved">Reserved</option>
              <option value="renewal-due">Renewal Due</option>
            </select>
          </div>

          {/* Sponsor Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm text-celtic-dark mb-3">Sponsor Details</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Business Name *</label>
                <input
                  type="text"
                  value={formData.sponsor?.name || ''}
                  onChange={(e) => handleSponsorChange('name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g. Cwmbran Carpets"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.sponsor?.contactName || ''}
                  onChange={(e) => handleSponsorChange('contactName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g. John Smith"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.sponsor?.contactEmail || ''}
                    onChange={(e) => handleSponsorChange('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.sponsor?.contactPhone || ''}
                    onChange={(e) => handleSponsorChange('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="07xxx xxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.sponsor?.website || ''}
                  onChange={(e) => handleSponsorChange('website', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm text-celtic-dark mb-3">Contract Details</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.contract?.startDate || ''}
                    onChange={(e) => handleContractChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.contract?.endDate || ''}
                    onChange={(e) => handleContractChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
                  <select
                    value={formData.contract?.paymentStatus || 'pending'}
                    onChange={(e) => handleContractChange('paymentStatus', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Amount Paid (£)</label>
                  <input
                    type="number"
                    value={formData.contract?.paidAmount || ''}
                    onChange={(e) => handleContractChange('paidAmount', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder={String(formData.pricePerSeason)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <textarea
                  value={formData.contract?.notes || ''}
                  onChange={(e) => handleContractChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  rows={2}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 btn-primary text-sm py-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdvertisingAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [boards, setBoards] = useState<AdvertisingBoard[]>(advertisingBoards);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [editingBoard, setEditingBoard] = useState<AdvertisingBoard | null>(null);

  // Check auth on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const stats = getBoardStats();

  const filteredBoards = filterStatus === 'all'
    ? boards
    : boards.filter(b => b.status === filterStatus);

  const locations: BoardLocation[] = ['main-stand', 'far-side', 'home-end', 'away-end', 'clubhouse'];

  const handleSaveBoard = (updatedBoard: AdvertisingBoard) => {
    setBoards(prev => prev.map(b => b.id === updatedBoard.id ? updatedBoard : b));
    setEditingBoard(null);
    // In a real app, this would save to a database
  };

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Advertising Boards</h1>
              <p className="text-xs text-white/80">Manage pitch-side advertising and sponsorship</p>
            </div>
            <Link href="/admin" className="text-xs text-white/80 hover:text-white">
              ← Back to Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <StatsCard
              label="Total Boards"
              value={stats.total}
              color="border-celtic-blue"
            />
            <StatsCard
              label="Sponsored"
              value={stats.sponsored}
              subtext={`${stats.occupancyRate}% occupancy`}
              color="border-blue-500"
            />
            <StatsCard
              label="Available"
              value={stats.available}
              color="border-green-500"
            />
            <StatsCard
              label="Reserved"
              value={stats.reserved}
              color="border-yellow-500"
            />
            <StatsCard
              label="Renewal Due"
              value={stats.renewalDue}
              color="border-orange-500"
            />
            <StatsCard
              label="Revenue"
              value={`£${stats.totalRevenue.toLocaleString()}`}
              subtext={`£${stats.potentialRevenue} potential`}
              color="border-celtic-yellow"
            />
          </div>
        </div>
      </section>

      {/* Filters & View Toggle */}
      <section className="py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                <option value="all">All Boards</option>
                <option value="available">Available</option>
                <option value="sponsored">Sponsored</option>
                <option value="reserved">Reserved</option>
                <option value="renewal-due">Renewal Due</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs rounded ${viewMode === 'grid' ? 'bg-white shadow text-celtic-blue font-semibold' : 'text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-white shadow text-celtic-blue font-semibold' : 'text-gray-600'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('location')}
                className={`px-3 py-1 text-xs rounded ${viewMode === 'location' ? 'bg-white shadow text-celtic-blue font-semibold' : 'text-gray-600'}`}
              >
                By Location
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Board Grid View */}
      {viewMode === 'grid' && (
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBoards.map(board => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onEdit={setEditingBoard}
                />
              ))}
            </div>
            {filteredBoards.length === 0 && (
              <p className="text-center text-gray-500 py-8">No boards match the selected filter.</p>
            )}
          </div>
        </section>
      )}

      {/* Board List View */}
      {viewMode === 'list' && (
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Sponsor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contract End</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBoards.map(board => (
                    <tr key={board.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{board.boardNumber}</td>
                      <td className="px-4 py-3">{locationNames[board.location]}</td>
                      <td className="px-4 py-3 text-gray-600">{sizeDetails[board.size].dimensions}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${statusColors[board.status]}`}>
                          {statusLabels[board.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">{board.sponsor?.name || '-'}</td>
                      <td className="px-4 py-3 font-semibold">£{board.pricePerSeason}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {board.contract?.endDate
                          ? new Date(board.contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingBoard(board)}
                          className="text-celtic-blue text-xs font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* By Location View */}
      {viewMode === 'location' && (
        <section className="py-6">
          <div className="container mx-auto px-4 space-y-6">
            {locations.map(location => {
              const locationBoards = filteredBoards.filter(b => b.location === location);
              if (locationBoards.length === 0) return null;

              return (
                <div key={location}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-bold text-lg text-celtic-dark">{locationNames[location]}</h2>
                    <span className="text-xs text-gray-500">
                      {locationBoards.filter(b => b.status === 'sponsored' || b.status === 'renewal-due').length}/{locationBoards.length} sponsored
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {locationBoards.map(board => (
                      <BoardCard
                        key={board.id}
                        board={board}
                        onEdit={setEditingBoard}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Renewal Alerts */}
      <RenewalAlerts boards={boards} onEdit={setEditingBoard} />

      {/* Quick Actions */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-lg text-celtic-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/sponsors"
              className="card p-4 hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-10 h-10 bg-celtic-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <p className="font-semibold text-sm">View Public Page</p>
              <p className="text-xs text-gray-500">See how sponsors appear</p>
            </Link>
            <button
              onClick={() => alert('Export feature coming soon!')}
              className="card p-4 hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-10 h-10 bg-celtic-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <p className="font-semibold text-sm">Export Report</p>
              <p className="text-xs text-gray-500">Download sponsor list</p>
            </button>
            <button
              onClick={() => setFilterStatus('renewal-due')}
              className="card p-4 hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-10 h-10 bg-celtic-yellow/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-semibold text-sm">Renewals Due</p>
              <p className="text-xs text-gray-500">{stats.renewalDue} boards need attention</p>
            </button>
            <button
              onClick={() => setFilterStatus('available')}
              className="card p-4 hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-10 h-10 bg-celtic-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <p className="font-semibold text-sm">Available Boards</p>
              <p className="text-xs text-gray-500">{stats.available} ready to sell</p>
            </button>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editingBoard && (
        <EditModal
          board={editingBoard}
          onClose={() => setEditingBoard(null)}
          onSave={handleSaveBoard}
        />
      )}
    </>
  );
}
