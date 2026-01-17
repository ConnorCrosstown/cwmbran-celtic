'use client';

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// ============================================================
// TYPES
// ============================================================

interface SquadPlayer {
  squadNo: number;
  firstName: string;
  lastName: string;
  position: string;
}

interface Opposition {
  id: string;
  name: string;
  nickname?: string;
  ground: string;
  founded: number;
  colours: string;
  headToHead?: {
    played: number;
    celticWins: number;
    draws: number;
    oppositionWins: number;
  };
}

interface LeagueTeam {
  position: number;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
}

interface Result {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
}

interface Fixture {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time?: string;
}

interface ProgrammeData {
  opponent: string;
  date: string;
  kickoff: string;
  managersNotes: string;
  startingXI: number[];
  substitutes: number[];
  captain: number | null;
}

interface ProgrammePDFProps {
  opposition: Opposition;
  date: string;
  programmeData?: ProgrammeData | null;
  squad: SquadPlayer[];
  leagueTable: LeagueTeam[];
  recentResults: Result[];
  upcomingFixtures: Fixture[];
}

// ============================================================
// COLORS - Matching the PDF exactly
// ============================================================

const COLORS = {
  navy: '#1e3a5f',
  navyDark: '#0f2847',
  yellow: '#f4c430',
  white: '#ffffff',
  offWhite: '#fafafa',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  green: '#22c55e',
  red: '#ef4444',
  blue: '#3b82f6',
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.white,
    fontFamily: 'Helvetica',
  },

  // Cover styles
  coverPage: {
    position: 'relative',
    height: '100%',
  },
  coverBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.navy,
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coverContent: {
    flex: 1,
    padding: 20,
  },
  coverTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  officialBadge: {
    backgroundColor: COLORS.yellow,
    padding: 12,
    borderRadius: 8,
  },
  officialBadgeText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.navy,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  officialBadgeLeague: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginTop: 2,
  },
  kickoffBox: {
    backgroundColor: COLORS.yellow,
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kickoffTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  kickoffLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.navy,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  coverCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverCrest: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  coverTeamName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  coverVsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  coverVsLine: {
    width: 50,
    height: 2,
    backgroundColor: COLORS.yellow,
  },
  coverVs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.yellow,
    marginHorizontal: 12,
  },
  coverOpponent: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  coverNickname: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.yellow,
    marginTop: 8,
    textAlign: 'center',
  },
  coverFooter: {
    backgroundColor: 'rgba(15,40,71,0.95)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  coverFooterLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.yellow,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  coverFooterValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // Page header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  pageHeaderBar: {
    width: 5,
    backgroundColor: COLORS.yellow,
    borderRadius: 3,
    marginRight: 12,
  },
  pageHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.navy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pageHeaderSubtitle: {
    fontSize: 10,
    color: COLORS.gray500,
    marginTop: 2,
  },
  pageHeaderLine: {
    height: 2,
    marginTop: 12,
    marginBottom: 8,
  },

  // Content page
  contentPage: {
    padding: 24,
    backgroundColor: COLORS.offWhite,
  },

  // Card styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardElevated: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  // Manager's Notes
  managerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  managerPhoto: {
    width: 60,
    height: 75,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: COLORS.gray200,
  },
  managerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  managerRole: {
    fontSize: 10,
    color: COLORS.gray500,
    marginTop: 2,
  },
  managerBadge: {
    backgroundColor: COLORS.gray200,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  managerBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  notesText: {
    fontSize: 10,
    color: COLORS.gray700,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  notesSignature: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: 12,
    marginTop: 12,
  },

  // Squad page
  squadContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  squadColumn: {
    flex: 1,
  },
  positionSection: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  positionHeader: {
    backgroundColor: COLORS.navy,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  positionHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  positionPlayers: {
    padding: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  playerCheckbox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    borderRadius: 3,
    marginRight: 8,
  },
  playerNumber: {
    width: 22,
    height: 22,
    backgroundColor: COLORS.navy,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  playerNumberText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  playerName: {
    fontSize: 10,
    color: COLORS.gray700,
  },
  squadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: COLORS.yellow,
    paddingTop: 12,
    marginTop: 12,
  },
  squadFooterLeft: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  squadFooterRight: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.yellow,
  },

  // Today's Match
  matchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  teamColumn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  teamHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  teamHeaderHome: {
    backgroundColor: COLORS.navy,
  },
  teamHeaderAway: {
    backgroundColor: COLORS.gray500,
  },
  teamHeaderName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.yellow,
    textTransform: 'uppercase',
  },
  teamHeaderNameAway: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  teamHeaderSub: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  teamPlayers: {
    padding: 12,
  },
  matchPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchPlayerNumber: {
    width: 18,
    height: 18,
    backgroundColor: COLORS.navy,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  matchPlayerNumberText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  matchPlayerName: {
    fontSize: 9,
    color: COLORS.gray700,
  },
  matchSubsHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: 8,
  },
  awayLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  awayLineNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.gray400,
    width: 20,
  },
  awayLineLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  officialsSection: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderTopWidth: 3,
    borderTopColor: COLORS.yellow,
    padding: 16,
    marginTop: 16,
  },
  officialsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  officialsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  officialBox: {
    alignItems: 'center',
  },
  officialLabel: {
    fontSize: 8,
    color: COLORS.gray400,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  officialLine: {
    width: 60,
    height: 1,
    backgroundColor: COLORS.gray200,
  },

  // History page
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyYear: {
    width: 50,
    height: 30,
    backgroundColor: COLORS.yellow,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyYearText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 4,
  },
  historyText: {
    fontSize: 9,
    color: COLORS.gray600,
    lineHeight: 1.5,
  },
  quoteBox: {
    backgroundColor: COLORS.navy,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  quoteMotto: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.yellow,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statBox: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '23%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  statLabel: {
    fontSize: 7,
    color: COLORS.gray500,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // Visitors page
  visitorsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  visitorsCol: {
    flex: 1,
  },
  infoSectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.gray500,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  h2hTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.yellow,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  h2hGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  h2hBox: {
    width: '48%',
    backgroundColor: COLORS.navy,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  h2hValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  h2hLabel: {
    fontSize: 7,
    color: COLORS.yellow,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // League Table
  table: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.yellow,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.navy,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  tableRowHighlight: {
    backgroundColor: '#fef9c3',
  },
  tableRowOpp: {
    backgroundColor: '#dbeafe',
  },
  tableCell: {
    fontSize: 8,
    color: COLORS.gray600,
    textAlign: 'center',
  },
  tableCellBold: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  tableLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 8,
    color: COLORS.gray500,
  },

  // Results & Fixtures
  resultsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  resultsCol: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderBar: {
    width: 4,
    height: 18,
    backgroundColor: COLORS.yellow,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.navy,
    textTransform: 'uppercase',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  resultBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  resultBadgeW: {
    backgroundColor: COLORS.green,
  },
  resultBadgeL: {
    backgroundColor: COLORS.red,
  },
  resultBadgeD: {
    backgroundColor: COLORS.gray400,
  },
  resultBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  resultInfo: {
    flex: 1,
  },
  resultOpponent: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  resultMeta: {
    fontSize: 8,
    color: COLORS.gray500,
    marginTop: 2,
  },
  resultScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  fixtureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  fixtureDateBox: {
    backgroundColor: COLORS.navy,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  fixtureDateText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // Celtic Bond
  celticBondPage: {
    padding: 24,
    backgroundColor: COLORS.yellow,
  },
  bondHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bondBadge: {
    backgroundColor: COLORS.navy,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  bondBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bondTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.navy,
    textTransform: 'uppercase',
  },
  bondSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginTop: 4,
  },
  bondCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bondCardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.navy,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  bondCardText: {
    fontSize: 10,
    color: COLORS.gray600,
    lineHeight: 1.5,
  },
  prizeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  prizeBox: {
    flex: 1,
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  prizeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.yellow,
  },
  prizeLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  fundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  fundCheck: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.green,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fundCheckText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  fundText: {
    fontSize: 10,
    color: COLORS.navy,
  },
  joinCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    padding: 16,
  },
  joinTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.yellow,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  joinText: {
    fontSize: 10,
    color: COLORS.white,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  joinPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
  },
  joinPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.yellow,
  },
  joinPriceSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  bondFooter: {
    alignItems: 'center',
    marginTop: 16,
  },
  bondFooterText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  bondHashtag: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginTop: 4,
  },

  // Back Cover
  backCoverPage: {
    padding: 0,
    height: '100%',
  },
  backCoverGradient: {
    flex: 1,
    backgroundColor: COLORS.navy,
    padding: 32,
    justifyContent: 'center',
  },
  backCoverCenter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backCoverCrest: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  backCoverTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backCoverEst: {
    fontSize: 12,
    color: COLORS.yellow,
    marginTop: 4,
  },
  backCoverGrid: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 24,
  },
  backCoverCol: {
    flex: 1,
  },
  backCoverSectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.yellow,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  backCoverText: {
    fontSize: 10,
    color: COLORS.white,
    marginBottom: 2,
  },
  backCoverTextMuted: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  backCoverPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backCoverPriceLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
  },
  backCoverPriceValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  backCoverPriceHighlight: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.yellow,
  },
  backCoverFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  backCoverThanks: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  backCoverHashtag: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.yellow,
  },

  // Sponsor Footer
  sponsorFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: 16,
    marginTop: 'auto',
    alignItems: 'center',
  },
  sponsorLabel: {
    fontSize: 8,
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sponsorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  sponsorSub: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.yellow,
  },
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// ============================================================
// PDF DOCUMENT COMPONENT
// ============================================================

export default function ProgrammePDF({
  opposition,
  date,
  programmeData,
  squad,
  leagueTable,
  recentResults,
  upcomingFixtures,
}: ProgrammePDFProps) {
  // Filter squad by position
  const goalkeepers = squad.filter(p => p.position === 'Goalkeeper');
  const defenders = squad.filter(p => p.position.includes('Back'));
  const midfielders = squad.filter(p => p.position.includes('Midfield') || p.position.includes('Wing'));
  const forwards = squad.filter(p => p.position === 'Striker' || p.position === 'Forward');

  // Get starting XI
  const startingXI = programmeData?.startingXI?.length === 11
    ? programmeData.startingXI.map(no => squad.find(p => p.squadNo === no)).filter(Boolean)
    : [...goalkeepers.slice(0, 1), ...defenders.slice(0, 4), ...midfielders.slice(0, 4), ...forwards.slice(0, 2)];

  const substitutes = programmeData?.substitutes?.length
    ? programmeData.substitutes.map(no => squad.find(p => p.squadNo === no)).filter(Boolean)
    : [];

  const defaultNotes = `Good afternoon and welcome to the Avondale Motor Park Arena for today's JD Cymru South fixture against ${opposition.name}.\n\nThank you for your continued support - it means the world to everyone at the club. The lads have been working hard in training and we're looking forward to putting on a performance for you today.\n\nEnjoy the game!`;

  return (
    <Document>
      {/* PAGE 1: COVER */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.coverBackground} />
          <View style={styles.coverContent}>
            {/* Top badges */}
            <View style={styles.coverTopRow}>
              <View style={styles.officialBadge}>
                <Text style={styles.officialBadgeText}>Official Match Programme</Text>
                <Text style={styles.officialBadgeLeague}>JD Cymru South</Text>
              </View>
              <View style={styles.kickoffBox}>
                <Text style={styles.kickoffTime}>{programmeData?.kickoff || '15:00'}</Text>
                <Text style={styles.kickoffLabel}>Kick-Off</Text>
              </View>
            </View>

            {/* Center content */}
            <View style={styles.coverCenter}>
              <Image src="/images/club-logo.webp" style={styles.coverCrest} />
              <Text style={styles.coverTeamName}>Cwmbran Celtic</Text>
              <View style={styles.coverVsContainer}>
                <View style={styles.coverVsLine} />
                <Text style={styles.coverVs}>vs</Text>
                <View style={styles.coverVsLine} />
              </View>
              <Text style={styles.coverOpponent}>{opposition.name}</Text>
              {opposition.nickname && (
                <Text style={styles.coverNickname}>"{opposition.nickname}"</Text>
              )}
            </View>

            {/* Footer */}
            <View style={styles.coverFooter}>
              <View>
                <Text style={styles.coverFooterLabel}>Date</Text>
                <Text style={styles.coverFooterValue}>{formatDate(date)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.coverFooterLabel}>Venue</Text>
                <Text style={styles.coverFooterValue}>Avondale Motor Park Arena</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 2: MANAGER'S NOTES */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <View style={styles.pageHeader}>
          <View style={[styles.pageHeaderBar, { height: 32 }]} />
          <View>
            <Text style={styles.pageHeaderTitle}>Manager's Notes</Text>
          </View>
        </View>

        <View style={styles.managerCard}>
          <View style={styles.managerPhoto} />
          <View>
            <Text style={styles.managerName}>Simon Berry</Text>
            <Text style={styles.managerRole}>First Team Manager</Text>
            <View style={styles.managerBadge}>
              <Text style={styles.managerBadgeText}>Since 2023</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          {(programmeData?.managersNotes || defaultNotes).split('\n').map((para, i) => (
            para.trim() && <Text key={i} style={styles.notesText}>{para}</Text>
          ))}
          <View style={styles.notesSignature}>
            <Text style={[styles.managerName, { fontSize: 12 }]}>Simon Berry</Text>
            <Text style={styles.managerRole}>First Team Manager</Text>
          </View>
        </View>

        <View style={styles.sponsorFooter}>
          <Text style={styles.sponsorLabel}>Principal Partner</Text>
          <Text style={styles.sponsorName}>AVONDALE</Text>
          <Text style={styles.sponsorSub}>VEHICLE HIRE</Text>
        </View>
      </Page>

      {/* PAGE 3: SQUAD */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <View style={styles.pageHeader}>
          <View style={[styles.pageHeaderBar, { height: 40 }]} />
          <View>
            <Text style={styles.pageHeaderTitle}>Cwmbran Celtic Squad</Text>
            <Text style={styles.pageHeaderSubtitle}>Tick the players in today's starting lineup</Text>
          </View>
        </View>

        <View style={styles.squadContainer}>
          {/* Left column */}
          <View style={styles.squadColumn}>
            {/* Goalkeepers */}
            <View style={styles.positionSection}>
              <View style={styles.positionHeader}>
                <Text style={styles.positionHeaderText}>Goalkeepers</Text>
              </View>
              <View style={styles.positionPlayers}>
                {goalkeepers.map(p => (
                  <View key={p.squadNo} style={styles.playerRow}>
                    <View style={styles.playerCheckbox} />
                    <View style={styles.playerNumber}>
                      <Text style={styles.playerNumberText}>{p.squadNo}</Text>
                    </View>
                    <Text style={styles.playerName}>{p.firstName} {p.lastName}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Defenders */}
            <View style={styles.positionSection}>
              <View style={styles.positionHeader}>
                <Text style={styles.positionHeaderText}>Defenders</Text>
              </View>
              <View style={styles.positionPlayers}>
                {defenders.slice(0, 7).map(p => (
                  <View key={p.squadNo} style={styles.playerRow}>
                    <View style={styles.playerCheckbox} />
                    <View style={styles.playerNumber}>
                      <Text style={styles.playerNumberText}>{p.squadNo}</Text>
                    </View>
                    <Text style={styles.playerName}>{p.firstName} {p.lastName}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Forwards */}
            <View style={styles.positionSection}>
              <View style={styles.positionHeader}>
                <Text style={styles.positionHeaderText}>Forwards</Text>
              </View>
              <View style={styles.positionPlayers}>
                {forwards.slice(0, 4).map(p => (
                  <View key={p.squadNo} style={styles.playerRow}>
                    <View style={styles.playerCheckbox} />
                    <View style={styles.playerNumber}>
                      <Text style={styles.playerNumberText}>{p.squadNo}</Text>
                    </View>
                    <Text style={styles.playerName}>{p.firstName} {p.lastName}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Right column */}
          <View style={styles.squadColumn}>
            {/* Midfielders */}
            <View style={styles.positionSection}>
              <View style={styles.positionHeader}>
                <Text style={styles.positionHeaderText}>Midfielders</Text>
              </View>
              <View style={styles.positionPlayers}>
                {midfielders.slice(0, 10).map(p => (
                  <View key={p.squadNo} style={styles.playerRow}>
                    <View style={styles.playerCheckbox} />
                    <View style={styles.playerNumber}>
                      <Text style={styles.playerNumberText}>{p.squadNo}</Text>
                    </View>
                    <Text style={styles.playerName}>{p.firstName} {p.lastName}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Substitutes section */}
            <View style={{ padding: 12 }}>
              <Text style={[styles.positionHeaderText, { color: COLORS.gray500, marginBottom: 8 }]}>
                Substitutes
              </Text>
              {[1, 2, 3].map(i => (
                <View key={i} style={[styles.playerRow, { marginBottom: 10 }]}>
                  <View style={[styles.playerCheckbox, { borderRadius: 10 }]} />
                  <View style={{ flex: 1, height: 1, backgroundColor: COLORS.gray200, marginLeft: 8 }} />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.squadFooter}>
          <Text style={styles.squadFooterLeft}>MANAGER: Simon Berry</Text>
          <Text style={styles.squadFooterRight}>#UpTheCeltic</Text>
        </View>
      </Page>

      {/* PAGE 4: TODAY'S MATCH */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={styles.pageHeaderTitle}>Today's Match</Text>
          <View style={{ width: 100, height: 2, backgroundColor: COLORS.yellow, marginTop: 10 }} />
        </View>

        <View style={styles.matchContainer}>
          {/* Home team */}
          <View style={styles.teamColumn}>
            <View style={[styles.teamHeader, styles.teamHeaderHome]}>
              <Text style={styles.teamHeaderName}>Cwmbran Celtic</Text>
              <Text style={styles.teamHeaderSub}>Home</Text>
            </View>
            <View style={styles.teamPlayers}>
              {startingXI.map((p) => p && (
                <View key={p.squadNo} style={styles.matchPlayerRow}>
                  <View style={styles.matchPlayerNumber}>
                    <Text style={styles.matchPlayerNumberText}>{p.squadNo}</Text>
                  </View>
                  <Text style={styles.matchPlayerName}>
                    {p.firstName} {p.lastName}
                    {programmeData?.captain === p.squadNo && ' (C)'}
                  </Text>
                </View>
              ))}
              <Text style={styles.matchSubsHeader}>Substitutes</Text>
              {substitutes.length > 0 ? (
                substitutes.map(p => p && (
                  <View key={p.squadNo} style={styles.matchPlayerRow}>
                    <View style={[styles.matchPlayerNumber, { backgroundColor: COLORS.gray100 }]}>
                      <Text style={[styles.matchPlayerNumberText, { color: COLORS.navy }]}>{p.squadNo}</Text>
                    </View>
                    <Text style={[styles.matchPlayerName, { color: COLORS.gray500 }]}>{p.lastName}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontSize: 9, color: COLORS.gray400 }}>12. ___ 14. ___ 15. ___</Text>
              )}
            </View>
          </View>

          {/* Away team */}
          <View style={styles.teamColumn}>
            <View style={[styles.teamHeader, styles.teamHeaderAway]}>
              <Text style={styles.teamHeaderNameAway}>{opposition.name}</Text>
              <Text style={styles.teamHeaderSub}>Away</Text>
            </View>
            <View style={styles.teamPlayers}>
              <Text style={[styles.matchSubsHeader, { marginTop: 0, borderTopWidth: 0, paddingTop: 0 }]}>Starting XI</Text>
              {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                <View key={n} style={styles.awayLineRow}>
                  <Text style={styles.awayLineNumber}>{n}</Text>
                  <View style={styles.awayLineLine} />
                </View>
              ))}
              <Text style={styles.matchSubsHeader}>Substitutes</Text>
              <Text style={{ fontSize: 9, color: COLORS.gray400 }}>12. ___ 14. ___ 15. ___ 16. ___ 17. ___</Text>
            </View>
          </View>
        </View>

        <View style={styles.officialsSection}>
          <Text style={styles.officialsTitle}>Match Officials</Text>
          <View style={styles.officialsRow}>
            <View style={styles.officialBox}>
              <Text style={styles.officialLabel}>Referee</Text>
              <View style={styles.officialLine} />
            </View>
            <View style={styles.officialBox}>
              <Text style={styles.officialLabel}>Assistant 1</Text>
              <View style={styles.officialLine} />
            </View>
            <View style={styles.officialBox}>
              <Text style={styles.officialLabel}>Assistant 2</Text>
              <View style={styles.officialLine} />
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 5: HISTORY */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <View style={styles.pageHeader}>
          <View style={[styles.pageHeaderBar, { height: 40 }]} />
          <View>
            <Text style={styles.pageHeaderTitle}>Our History</Text>
            <Text style={styles.pageHeaderSubtitle}>100 Years of Cwmbran Celtic</Text>
          </View>
        </View>

        {[
          { year: '1925', title: 'The Beginning', text: 'Cwmbran Celtic AFC was founded in 1925, emerging from the proud working-class community of Cwmbran. In an era when the town was still developing around its iron and steel industries, local men came together to form a football club that would represent their community for generations to come.' },
          { year: '1940s', title: 'Post-War Revival', text: 'After the Second World War, the club reformed with renewed vigour. Cwmbran was designated a New Town in 1949, bringing an influx of new residents and supporters. The Celtic became a focal point for community spirit in the growing town.' },
          { year: '2000s', title: 'Rising Through the Ranks', text: 'The 21st century saw Celtic climb the Welsh football pyramid. The club earned promotion to the Welsh Football League and later to Tier 3 of the Cymru Leagues, competing against some of Wales\' most historic clubs.' },
          { year: 'NOW', title: 'The Celtic Today', text: 'Today, Cwmbran Celtic fields men\'s, women\'s and development teams. Playing at the Avondale Motor Park Arena, we remain committed to our founding values: community, passion, and the beautiful game.' },
        ].map((item, i) => (
          <View key={i} style={styles.historyItem}>
            <View style={styles.historyYear}>
              <Text style={styles.historyYearText}>{item.year}</Text>
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historyText}>{item.text}</Text>
            </View>
          </View>
        ))}

        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            "More than a club - we are a family, a community, a century of shared dreams."
          </Text>
          <Text style={styles.quoteMotto}>Fraternitas in Ludis - Brotherhood in Sport</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: '101', label: 'Years' },
            { value: '3', label: 'Teams' },
            { value: 'Tier 3', label: 'Level' },
            { value: '1', label: 'Community' },
          ].map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* PAGE 6: VISITORS */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <View style={styles.pageHeader}>
          <View style={[styles.pageHeaderBar, { height: 40 }]} />
          <View>
            <Text style={styles.pageHeaderTitle}>Today's Visitors</Text>
            <Text style={styles.pageHeaderSubtitle}>{opposition.name}</Text>
          </View>
        </View>

        <View style={[styles.card, { marginBottom: 16 }]}>
          <View style={styles.visitorsGrid}>
            <View style={styles.visitorsCol}>
              <Text style={styles.infoSectionTitle}>Club Information</Text>
              {[
                { label: 'Founded', value: opposition.founded },
                { label: 'Ground', value: opposition.ground },
                { label: 'Colours', value: opposition.colours },
                { label: 'Nickname', value: opposition.nickname ? `"${opposition.nickname}"` : 'N/A' },
              ].map((item, i) => (
                <View key={i} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            {opposition.headToHead && (
              <View style={styles.visitorsCol}>
                <Text style={styles.h2hTitle}>Head to Head Record</Text>
                <View style={styles.h2hGrid}>
                  <View style={styles.h2hBox}>
                    <Text style={styles.h2hValue}>{opposition.headToHead.played}</Text>
                    <Text style={styles.h2hLabel}>Played</Text>
                  </View>
                  <View style={styles.h2hBox}>
                    <Text style={styles.h2hValue}>{opposition.headToHead.celticWins}</Text>
                    <Text style={styles.h2hLabel}>Celtic Wins</Text>
                  </View>
                  <View style={styles.h2hBox}>
                    <Text style={styles.h2hValue}>{opposition.headToHead.draws}</Text>
                    <Text style={styles.h2hLabel}>Draws</Text>
                  </View>
                  <View style={styles.h2hBox}>
                    <Text style={styles.h2hValue}>{opposition.headToHead.oppositionWins}</Text>
                    <Text style={styles.h2hLabel}>Losses</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.historyTitle, { marginBottom: 8 }]}>About Cwmbran Celtic AFC</Text>
          <Text style={styles.historyText}>
            Founded in 1925, Cwmbran Celtic AFC is a community football club based in Cwmbran, South Wales. Playing our home games at the Avondale Motor Park Arena, we compete in the JD Cymru South league. The club is committed to developing local talent and providing football opportunities for players of all ages and abilities.
          </Text>
          <View style={[styles.statsRow, { marginTop: 16, borderTopWidth: 1, borderTopColor: COLORS.gray200, paddingTop: 16 }]}>
            {[
              { value: '1925', label: 'Founded' },
              { value: '3', label: 'Teams' },
              { value: 'Tier 3', label: 'League Level' },
            ].map((stat, i) => (
              <View key={i} style={[styles.statBox, { width: '30%' }]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sponsorFooter}>
          <Text style={styles.sponsorLabel}>Our Partners</Text>
          <Text style={styles.sponsorName}>AVONDALE</Text>
          <Text style={styles.sponsorSub}>VEHICLE HIRE</Text>
        </View>
      </Page>

      {/* PAGE 7: LEAGUE TABLE */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <View style={styles.pageHeader}>
          <View style={[styles.pageHeaderBar, { height: 32 }]} />
          <View>
            <Text style={styles.pageHeaderTitle}>JD Cymru South Table</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: 30 }]}>Pos</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'left' }]}>Club</Text>
            <Text style={[styles.tableHeaderCell, { width: 30 }]}>P</Text>
            <Text style={[styles.tableHeaderCell, { width: 30 }]}>W</Text>
            <Text style={[styles.tableHeaderCell, { width: 30 }]}>D</Text>
            <Text style={[styles.tableHeaderCell, { width: 30 }]}>L</Text>
            <Text style={[styles.tableHeaderCell, { width: 35 }]}>GD</Text>
            <Text style={[styles.tableHeaderCell, { width: 30 }]}>Pts</Text>
          </View>
          {leagueTable.slice(0, 16).map((team, idx) => {
            const isCeltic = team.club === 'Cwmbran Celtic';
            const isOpp = team.club === opposition.name;
            const bgColor = isCeltic
              ? COLORS.yellow + '40'
              : isOpp
              ? COLORS.navy + '20'
              : idx % 2 === 1
              ? COLORS.gray50
              : COLORS.white;
            return (
              <View
                key={team.club}
                style={[styles.tableRow, { backgroundColor: bgColor }]}
              >
                <Text style={[styles.tableCellBold, { width: 30 }]}>{team.position}</Text>
                <Text style={[isCeltic || isOpp ? styles.tableCellBold : styles.tableCell, { flex: 1, textAlign: 'left' as const }]}>
                  {team.club}
                </Text>
                <Text style={[styles.tableCell, { width: 30 }]}>{team.played}</Text>
                <Text style={[styles.tableCellBold, { width: 30 }]}>{team.won}</Text>
                <Text style={[styles.tableCell, { width: 30 }]}>{team.drawn}</Text>
                <Text style={[styles.tableCell, { width: 30 }]}>{team.lost}</Text>
                <Text style={[styles.tableCell, { width: 35, color: team.gd > 0 ? COLORS.green : team.gd < 0 ? COLORS.red : COLORS.gray500 }]}>
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </Text>
                <Text style={[styles.tableCellBold, { width: 30 }]}>{team.points}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.tableLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.yellow }]} />
            <Text style={styles.legendText}>Cwmbran Celtic</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.navy }]} />
            <Text style={styles.legendText}>Today's Opposition</Text>
          </View>
          <Text style={[styles.legendText, { color: COLORS.gray400 }]}>Table as of {formatShortDate(date)}</Text>
        </View>
      </Page>

      {/* PAGE 8: RESULTS & FIXTURES */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <View style={styles.resultsGrid}>
          {/* Recent Results */}
          <View style={styles.resultsCol}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderBar} />
              <Text style={styles.sectionHeaderText}>Recent Results</Text>
            </View>
            {recentResults.slice(0, 5).map((r, i) => {
              const home = r.homeTeam.includes('Cwmbran Celtic');
              const celticScore = home ? r.homeScore : r.awayScore;
              const oppScore = home ? r.awayScore : r.homeScore;
              const res = celticScore > oppScore ? 'W' : celticScore < oppScore ? 'L' : 'D';
              const badgeColor = res === 'W' ? COLORS.green : res === 'L' ? COLORS.red : COLORS.gray400;
              return (
                <View key={i} style={styles.resultCard}>
                  <View style={[styles.resultBadge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.resultBadgeText}>{res}</Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultOpponent}>{home ? r.awayTeam : r.homeTeam}</Text>
                    <Text style={styles.resultMeta}>{home ? 'Home' : 'Away'} - {formatShortDate(r.date)}</Text>
                  </View>
                  <Text style={styles.resultScore}>{celticScore}-{oppScore}</Text>
                </View>
              );
            })}
          </View>

          {/* Upcoming Fixtures */}
          <View style={styles.resultsCol}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderBar} />
              <Text style={styles.sectionHeaderText}>Up Next</Text>
            </View>
            {upcomingFixtures.slice(0, 5).map((f, i) => {
              const home = f.homeTeam.includes('Cwmbran Celtic');
              return (
                <View key={i} style={styles.fixtureCard}>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultOpponent}>{home ? f.awayTeam : f.homeTeam}</Text>
                    <Text style={styles.resultMeta}>{home ? 'Home' : 'Away'} - {f.time || '15:00'}</Text>
                  </View>
                  <View style={styles.fixtureDateBox}>
                    <Text style={styles.fixtureDateText}>{formatShortDate(f.date)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.sponsorFooter}>
          <Text style={styles.sponsorLabel}>Thank You To Our Sponsors</Text>
          <Text style={styles.sponsorName}>AVONDALE</Text>
          <Text style={styles.sponsorSub}>VEHICLE HIRE</Text>
        </View>
      </Page>

      {/* PAGE 9: CELTIC BOND */}
      <Page size="A4" style={[styles.page, styles.celticBondPage]}>
        <View style={styles.bondHeader}>
          <View style={styles.bondBadge}>
            <Text style={styles.bondBadgeText}>Support Your Club</Text>
          </View>
          <Text style={styles.bondTitle}>Celtic Bond</Text>
          <Text style={styles.bondSubtitle}>Help Build Our Future</Text>
        </View>

        <View style={styles.bondCard}>
          <Text style={styles.bondCardTitle}>What is the Celtic Bond?</Text>
          <Text style={styles.bondCardText}>
            The Celtic Bond is a monthly lottery that helps fund essential club improvements and community projects. For just £5 per month, you could win cash prizes while supporting your local football club.
          </Text>
        </View>

        <View style={styles.prizeRow}>
          {[
            { amount: '£100', label: '1st Prize' },
            { amount: '£50', label: '2nd Prize' },
            { amount: '£25', label: '3rd Prize' },
          ].map((prize, i) => (
            <View key={i} style={styles.prizeBox}>
              <Text style={styles.prizeAmount}>{prize.amount}</Text>
              <Text style={styles.prizeLabel}>{prize.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bondCard}>
          <Text style={styles.bondCardTitle}>Your Support Helps Fund:</Text>
          <View style={styles.fundGrid}>
            {['Pitch maintenance', 'Youth development', 'Kit & equipment', 'Ground improvements'].map((item, i) => (
              <View key={i} style={styles.fundItem}>
                <View style={styles.fundCheck}>
                  <Text style={styles.fundCheckText}>✓</Text>
                </View>
                <Text style={styles.fundText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.joinCard}>
          <Text style={styles.joinTitle}>How to Join</Text>
          <Text style={styles.joinText}>
            Sign up online at cwmbranceltic.com/celtic-bond or speak to a committee member on match day.
          </Text>
          <View style={styles.joinPriceRow}>
            <View>
              <Text style={styles.joinPrice}>Only £5</Text>
              <Text style={styles.joinPriceSub}>per month</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.joinText, { marginBottom: 0, fontWeight: 'bold' }]}>Monthly Draw</Text>
              <Text style={styles.joinPriceSub}>Results on social media</Text>
            </View>
          </View>
        </View>

        <View style={styles.bondFooter}>
          <Text style={styles.bondFooterText}>Thank you to all our Celtic Bond members!</Text>
          <Text style={styles.bondHashtag}>#UpTheCeltic</Text>
        </View>
      </Page>

      {/* PAGE 10: BACK COVER */}
      <Page size="A4" style={[styles.page, styles.backCoverPage]}>
        <View style={styles.backCoverGradient}>
          <View style={styles.backCoverCenter}>
            <View style={styles.backCoverCrest} />
            <Text style={styles.backCoverTitle}>Cwmbran Celtic AFC</Text>
            <Text style={styles.backCoverEst}>Established 1925</Text>
          </View>

          <View style={styles.backCoverGrid}>
            <View style={styles.backCoverCol}>
              <Text style={styles.backCoverSectionTitle}>Our Ground</Text>
              <Text style={styles.backCoverText}>Avondale Motor Park Arena</Text>
              <Text style={styles.backCoverTextMuted}>Henllys Way</Text>
              <Text style={styles.backCoverTextMuted}>Cwmbran</Text>
              <Text style={styles.backCoverTextMuted}>NP44 3FS</Text>

              <Text style={[styles.backCoverSectionTitle, { marginTop: 16 }]}>Contact</Text>
              <Text style={styles.backCoverTextMuted}>cwmbrancelticfc@gmail.com</Text>
            </View>

            <View style={styles.backCoverCol}>
              <Text style={styles.backCoverSectionTitle}>Admission Prices</Text>
              {[
                { label: 'Adults', value: '£5' },
                { label: 'Concessions', value: '£3' },
                { label: 'Under 16s', value: 'FREE', highlight: true },
                { label: 'Programme', value: '£2' },
              ].map((item, i) => (
                <View key={i} style={styles.backCoverPriceRow}>
                  <Text style={styles.backCoverPriceLabel}>{item.label}</Text>
                  <Text style={item.highlight ? styles.backCoverPriceHighlight : styles.backCoverPriceValue}>
                    {item.value}
                  </Text>
                </View>
              ))}

              <Text style={[styles.backCoverSectionTitle, { marginTop: 16 }]}>Follow Us</Text>
              <Text style={styles.backCoverTextMuted}>@cwmbranceltic</Text>
              <Text style={styles.backCoverTextMuted}>cwmbranceltic.com</Text>
            </View>
          </View>

          <View style={styles.backCoverFooter}>
            <Text style={styles.backCoverThanks}>Thank you for supporting Cwmbran Celtic AFC</Text>
            <Text style={styles.backCoverHashtag}>#UpTheCeltic</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
