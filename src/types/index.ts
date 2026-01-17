/**
 * TypeScript definitions for Cwmbran Celtic website
 * Matches Comet API response structures
 */

// ============================================
// COMET API RESPONSE TYPES
// ============================================

export type CometColumnType = 
  | 'STRING' 
  | 'NUMBER' 
  | 'DATE' 
  | 'DATETIME' 
  | 'IMAGELINK' 
  | 'AMOUNT';

export interface CometResponse<T> {
  reportName: string;
  columnTypes: CometColumnType[];
  columnNames: string[];
  columnKeys: string[];
  results: T[];
  totalSize: number;
  page: number;
  pageSize: number;
  lastPage?: number;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc';
  locale?: string;
}

// ============================================
// FIXTURE & RESULT TYPES
// ============================================

export interface Fixture {
  matchId: number;
  date: number; // Comet date (ms since epoch)
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  homeAway: 'H' | 'A';
}

export interface Result {
  matchId: number;
  date: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  scorers: string;
  attendance: number;
}

// ============================================
// LEAGUE TABLE TYPES
// ============================================

export interface LeagueTableRow {
  position: number;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
  form?: string; // e.g., "WWDLW"
}

// ============================================
// PLAYER / SQUAD TYPES
// ============================================

export type PlayerPosition = 
  | 'Goalkeeper'
  | 'Right Back'
  | 'Left Back'
  | 'Centre Back'
  | 'Defensive Midfield'
  | 'Central Midfield'
  | 'Attacking Midfield'
  | 'Right Wing'
  | 'Left Wing'
  | 'Striker';

export interface Player {
  photo: string;
  squadNo: number;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  appearances: number;
  dateOfBirth: number;
}

export interface PlayerStats {
  personId: number;
  firstName: string;
  lastName: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

// ============================================
// CLUB INFO TYPES
// ============================================

export interface Address {
  street: string;
  town?: string;
  area?: string;
  county?: string;
  postcode: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Ground {
  name: string;
  address: Address;
  what3words: string;
  coordinates: Coordinates;
}

export interface ContactPerson {
  name: string;
  phone?: string;
  email?: string;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface ClubColours {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Admission {
  adults: number;
  concessions: number;
  under16: number;
  programme: number;
}

export interface ClubInfo {
  name: string;
  nameWelsh: string;
  founded: number;
  ground: Ground;
  postalAddress: Address;
  contact: {
    email: string;
    chairman: ContactPerson;
  };
  social: SocialLinks;
  shop: string;
  colours: ClubColours;
  admission: Admission;
}

// ============================================
// SPONSOR TYPES
// ============================================

export interface Sponsor {
  name: string;
  logo: string;
  url?: string | null;
}

export interface Sponsors {
  main: Sponsor;
  partners: Sponsor[];
  advertisers: Sponsor[];
}

// ============================================
// NEWS / CONTENT TYPES
// ============================================

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: 'news' | 'match-report' | 'transfer' | 'event' | 'community';
  publishedAt: Date;
  author?: string;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface FixtureCardProps {
  fixture: Fixture;
  showAdmission?: boolean;
}

export interface ResultCardProps {
  result: Result;
}

export interface LeagueTableProps {
  data: LeagueTableRow[];
  highlightTeam?: string;
  compact?: boolean;
}

export interface PlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  onClick?: () => void;
}

export interface NextMatchHeroProps {
  fixture: Fixture | null;
  admission: Admission;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Team = 'mens' | 'ladies' | 'development' | 'walking';

export interface TeamFilter {
  team: Team | 'all';
  competition?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}
