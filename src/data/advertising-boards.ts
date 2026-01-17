/**
 * Advertising Board Management System
 * Tracks pitch-side advertising boards, sponsors, and availability
 */

export type BoardLocation =
  | 'main-stand'      // Behind main stand
  | 'far-side'        // Opposite side of pitch
  | 'home-end'        // Behind home goal
  | 'away-end'        // Behind away goal
  | 'clubhouse';      // Near clubhouse/entrance

export type BoardSize =
  | 'large'           // 8ft x 3ft - Premium
  | 'standard'        // 6ft x 2ft - Standard
  | 'small';          // 4ft x 2ft - Budget

export type BoardStatus =
  | 'available'       // Open for sponsorship
  | 'sponsored'       // Currently sponsored
  | 'reserved'        // Reserved/pending payment
  | 'renewal-due';    // Sponsored but renewal due soon

export interface AdvertisingBoard {
  id: string;
  boardNumber: number;              // Board reference number (e.g., 1, 2, 3...)
  location: BoardLocation;
  size: BoardSize;
  status: BoardStatus;

  // Pricing
  pricePerSeason: number;           // Annual cost

  // Sponsor details (if sponsored)
  sponsor?: {
    name: string;                   // Business/sponsor name
    contactName?: string;           // Contact person
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    logoUrl?: string;               // Logo image URL
  };

  // Contract details
  contract?: {
    startDate: string;              // ISO date string
    endDate: string;                // ISO date string
    renewalReminder?: string;       // Date to send reminder
    paidAmount?: number;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    notes?: string;
  };

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// Board location display names
export const locationNames: Record<BoardLocation, string> = {
  'main-stand': 'Main Stand',
  'far-side': 'Far Side',
  'home-end': 'Home End',
  'away-end': 'Away End',
  'clubhouse': 'Clubhouse Area',
};

// Board size details
export const sizeDetails: Record<BoardSize, { name: string; dimensions: string; price: number }> = {
  'large': { name: 'Premium', dimensions: '8ft x 3ft', price: 300 },
  'standard': { name: 'Standard', dimensions: '6ft x 2ft', price: 200 },
  'small': { name: 'Budget', dimensions: '4ft x 2ft', price: 100 },
};

// Sample data - representing current board inventory
export const advertisingBoards: AdvertisingBoard[] = [
  // Main Stand boards
  {
    id: 'board-001',
    boardNumber: 1,
    location: 'main-stand',
    size: 'large',
    status: 'sponsored',
    pricePerSeason: 300,
    sponsor: {
      name: 'Avondale Motor Park',
      contactName: 'John Davies',
      contactEmail: 'info@avondalemotorpark.co.uk',
      website: 'https://avondalemotorpark.co.uk',
    },
    contract: {
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      paymentStatus: 'paid',
      paidAmount: 300,
    },
  },
  {
    id: 'board-002',
    boardNumber: 2,
    location: 'main-stand',
    size: 'large',
    status: 'sponsored',
    pricePerSeason: 300,
    sponsor: {
      name: 'Celtic Supporters Club',
      contactName: 'Mike Thomas',
    },
    contract: {
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      paymentStatus: 'paid',
      paidAmount: 300,
    },
  },
  {
    id: 'board-003',
    boardNumber: 3,
    location: 'main-stand',
    size: 'standard',
    status: 'available',
    pricePerSeason: 200,
  },
  {
    id: 'board-004',
    boardNumber: 4,
    location: 'main-stand',
    size: 'standard',
    status: 'renewal-due',
    pricePerSeason: 200,
    sponsor: {
      name: 'Cwmbran Carpets',
      contactName: 'Steve Williams',
      contactEmail: 'steve@cwmbrancarpets.co.uk',
    },
    contract: {
      startDate: '2024-01-01',
      endDate: '2025-01-31',
      paymentStatus: 'paid',
      paidAmount: 200,
      renewalReminder: '2025-01-01',
    },
  },
  {
    id: 'board-005',
    boardNumber: 5,
    location: 'main-stand',
    size: 'small',
    status: 'available',
    pricePerSeason: 100,
  },

  // Far Side boards
  {
    id: 'board-006',
    boardNumber: 6,
    location: 'far-side',
    size: 'large',
    status: 'sponsored',
    pricePerSeason: 300,
    sponsor: {
      name: 'Torfaen Taxis',
      contactEmail: 'bookings@torfaentaxis.com',
    },
    contract: {
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      paymentStatus: 'paid',
      paidAmount: 300,
    },
  },
  {
    id: 'board-007',
    boardNumber: 7,
    location: 'far-side',
    size: 'standard',
    status: 'available',
    pricePerSeason: 200,
  },
  {
    id: 'board-008',
    boardNumber: 8,
    location: 'far-side',
    size: 'standard',
    status: 'reserved',
    pricePerSeason: 200,
    sponsor: {
      name: 'New Sponsor TBC',
      contactName: 'Pending',
    },
    contract: {
      startDate: '2025-02-01',
      endDate: '2026-01-31',
      paymentStatus: 'pending',
    },
  },
  {
    id: 'board-009',
    boardNumber: 9,
    location: 'far-side',
    size: 'small',
    status: 'available',
    pricePerSeason: 100,
  },
  {
    id: 'board-010',
    boardNumber: 10,
    location: 'far-side',
    size: 'small',
    status: 'available',
    pricePerSeason: 100,
  },

  // Home End boards
  {
    id: 'board-011',
    boardNumber: 11,
    location: 'home-end',
    size: 'large',
    status: 'sponsored',
    pricePerSeason: 300,
    sponsor: {
      name: 'Pontypool RFC',
      website: 'https://pontypoolrfc.co.uk',
    },
    contract: {
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      paymentStatus: 'paid',
      paidAmount: 300,
    },
  },
  {
    id: 'board-012',
    boardNumber: 12,
    location: 'home-end',
    size: 'standard',
    status: 'available',
    pricePerSeason: 200,
  },
  {
    id: 'board-013',
    boardNumber: 13,
    location: 'home-end',
    size: 'small',
    status: 'sponsored',
    pricePerSeason: 100,
    sponsor: {
      name: 'The Crown Inn',
    },
    contract: {
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      paymentStatus: 'paid',
      paidAmount: 100,
    },
  },

  // Away End boards
  {
    id: 'board-014',
    boardNumber: 14,
    location: 'away-end',
    size: 'standard',
    status: 'available',
    pricePerSeason: 200,
  },
  {
    id: 'board-015',
    boardNumber: 15,
    location: 'away-end',
    size: 'small',
    status: 'available',
    pricePerSeason: 100,
  },

  // Clubhouse Area
  {
    id: 'board-016',
    boardNumber: 16,
    location: 'clubhouse',
    size: 'large',
    status: 'sponsored',
    pricePerSeason: 300,
    sponsor: {
      name: 'Cwmbran Community Council',
    },
    contract: {
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      paymentStatus: 'paid',
      paidAmount: 300,
    },
  },
  {
    id: 'board-017',
    boardNumber: 17,
    location: 'clubhouse',
    size: 'standard',
    status: 'available',
    pricePerSeason: 200,
  },
  {
    id: 'board-018',
    boardNumber: 18,
    location: 'clubhouse',
    size: 'small',
    status: 'available',
    pricePerSeason: 100,
  },
];

// Helper functions
export const getBoardById = (id: string): AdvertisingBoard | undefined => {
  return advertisingBoards.find(board => board.id === id);
};

export const getBoardsByLocation = (location: BoardLocation): AdvertisingBoard[] => {
  return advertisingBoards.filter(board => board.location === location);
};

export const getBoardsByStatus = (status: BoardStatus): AdvertisingBoard[] => {
  return advertisingBoards.filter(board => board.status === status);
};

export const getAvailableBoards = (): AdvertisingBoard[] => {
  return advertisingBoards.filter(board => board.status === 'available');
};

export const getSponsoredBoards = (): AdvertisingBoard[] => {
  return advertisingBoards.filter(board => board.status === 'sponsored' || board.status === 'renewal-due');
};

export const getRenewalsDue = (): AdvertisingBoard[] => {
  return advertisingBoards.filter(board => board.status === 'renewal-due');
};

// Stats
export const getBoardStats = () => {
  const total = advertisingBoards.length;
  const sponsored = advertisingBoards.filter(b => b.status === 'sponsored').length;
  const available = advertisingBoards.filter(b => b.status === 'available').length;
  const reserved = advertisingBoards.filter(b => b.status === 'reserved').length;
  const renewalDue = advertisingBoards.filter(b => b.status === 'renewal-due').length;

  const totalRevenue = advertisingBoards
    .filter(b => b.contract?.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.contract?.paidAmount || 0), 0);

  const potentialRevenue = advertisingBoards
    .filter(b => b.status === 'available')
    .reduce((sum, b) => sum + b.pricePerSeason, 0);

  return {
    total,
    sponsored,
    available,
    reserved,
    renewalDue,
    totalRevenue,
    potentialRevenue,
    occupancyRate: Math.round(((sponsored + renewalDue) / total) * 100),
  };
};
