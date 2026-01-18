/**
 * Mock Data - Matches Comet API Response Format
 *
 * This data structure mirrors what we'll receive from the FAW Comet API.
 * When API access is granted, replace these with actual API calls.
 *
 * Data sourced from:
 * - Transfermarkt (squad data)
 * - FAW Cymru Leagues (fixtures, tables)
 * - allwalessport.co.uk (league tables)
 *
 * Last updated: January 2026
 */

// Helper to convert date to Comet format (ms since epoch)
const toComet = (dateStr: string): number => new Date(dateStr).getTime();

// Helper to convert Comet date back to JS Date
export const fromCometDate = (ms: number): Date => new Date(ms);

/**
 * FIXTURES - Upcoming matches (2025-26 season)
 * Source: FAW Cymru Leagues
 */
export const mockFixtures = {
  reportName: "Club Fixtures",
  columnTypes: ["NUMBER", "DATE", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"],
  columnNames: ["Match ID", "Date", "Time", "Home Team", "Away Team", "Competition", "Venue", "Home/Away"],
  columnKeys: ["matchId", "date", "time", "homeTeam", "awayTeam", "competition", "venue", "homeAway"],
  results: [
    // Men's fixtures - 2025-26 season
    {
      matchId: 1001,
      date: toComet("2026-01-16"),
      time: "19:30",
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Cardiff Draconians",
      competition: "JD Cymru South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 1002,
      date: toComet("2026-01-20"),
      time: "19:30",
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Llantwit Major",
      competition: "JD Cymru South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 1003,
      date: toComet("2026-01-23"),
      time: "19:30",
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Pontypridd United",
      competition: "JD Cymru South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 1004,
      date: toComet("2026-01-30"),
      time: "19:45",
      homeTeam: "Trethomas Bluebirds",
      awayTeam: "Cwmbran Celtic",
      competition: "JD Cymru South",
      venue: "Trethomas Park",
      homeAway: "A"
    },
    {
      matchId: 1005,
      date: toComet("2026-02-07"),
      time: "14:30",
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Afan Lido",
      competition: "JD Cymru South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    // Women's fixtures - 2025-26 season
    {
      matchId: 2001,
      date: toComet("2026-01-18"),
      time: "14:00",
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Cardiff Met WFC",
      competition: "Genero Adran South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 2002,
      date: toComet("2026-01-25"),
      time: "14:00",
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Taffs Well FC Women",
      competition: "Genero Adran South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 2003,
      date: toComet("2026-02-01"),
      time: "14:00",
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Penybont Women FC",
      competition: "Genero Adran South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 2004,
      date: toComet("2026-02-15"),
      time: "14:00",
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Cascade YC Women",
      competition: "Genero Adran South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    }
  ],
  totalSize: 9,
  page: 0,
  pageSize: 25
};

/**
 * RESULTS - Recent match results (2025-26 season)
 * Source: FAW Cymru Leagues, Flashscore, AiScore
 */
export const mockResults = {
  reportName: "Club Results",
  columnTypes: ["NUMBER", "DATE", "STRING", "STRING", "NUMBER", "NUMBER", "STRING", "STRING", "NUMBER"],
  columnNames: ["Match ID", "Date", "Home Team", "Away Team", "Home Score", "Away Score", "Competition", "Scorers", "Attendance"],
  columnKeys: ["matchId", "date", "homeTeam", "awayTeam", "homeScore", "awayScore", "competition", "scorers", "attendance"],
  results: [
    // Men's results - 2025-26 season (most recent first)
    {
      matchId: 901,
      date: toComet("2026-01-11"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Carmarthen Town",
      homeScore: 2,
      awayScore: 2,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 120
    },
    {
      matchId: 902,
      date: toComet("2026-01-02"),
      homeTeam: "Treowen Stars",
      awayTeam: "Cwmbran Celtic",
      homeScore: 2,
      awayScore: 2,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 95
    },
    {
      matchId: 903,
      date: toComet("2025-12-27"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Ynyshir Albions",
      homeScore: 1,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 110
    },
    {
      matchId: 904,
      date: toComet("2025-12-05"),
      homeTeam: "Cardiff Draconians",
      awayTeam: "Cwmbran Celtic",
      homeScore: 2,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 145
    },
    {
      matchId: 905,
      date: toComet("2025-11-08"),
      homeTeam: "Pontypridd United",
      awayTeam: "Cwmbran Celtic",
      homeScore: 7,
      awayScore: 0,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 210
    },
    {
      matchId: 906,
      date: toComet("2025-11-01"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Baglan Dragons",
      homeScore: 0,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 125
    },
    {
      matchId: 907,
      date: toComet("2025-10-25"),
      homeTeam: "Ammanford",
      awayTeam: "Cwmbran Celtic",
      homeScore: 2,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 180
    },
    {
      matchId: 908,
      date: toComet("2025-10-11"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Caerau Ely",
      homeScore: 0,
      awayScore: 2,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 135
    },
    {
      matchId: 909,
      date: toComet("2025-09-27"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Trethomas Bluebirds",
      homeScore: 2,
      awayScore: 2,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 145
    },
    {
      matchId: 910,
      date: toComet("2025-09-13"),
      homeTeam: "Aberystwyth Town",
      awayTeam: "Cwmbran Celtic",
      homeScore: 2,
      awayScore: 0,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 320
    },
    {
      matchId: 911,
      date: toComet("2025-08-25"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Newport City",
      homeScore: 1,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 165
    },
    {
      matchId: 912,
      date: toComet("2025-08-23"),
      homeTeam: "Trefelin BGC",
      awayTeam: "Cwmbran Celtic",
      homeScore: 4,
      awayScore: 0,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 190
    },
    {
      matchId: 913,
      date: toComet("2025-08-16"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Afan Lido",
      homeScore: 1,
      awayScore: 4,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 140
    },
    {
      matchId: 914,
      date: toComet("2025-08-09"),
      homeTeam: "Cambrian United",
      awayTeam: "Cwmbran Celtic",
      homeScore: 4,
      awayScore: 0,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 225
    },
    {
      matchId: 915,
      date: toComet("2025-07-26"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Carmarthen Town",
      homeScore: 0,
      awayScore: 4,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 175
    }
  ],
  totalSize: 15,
  page: 0,
  pageSize: 25
};

/**
 * LEAGUE TABLE - JD Cymru South 2025-26 (Current)
 * Source: thefishy.net, FAW Cymru Leagues
 * Last updated: January 2026
 */
export const mockLeagueTable = {
  reportName: "JD Cymru South League Table",
  columnTypes: ["NUMBER", "STRING", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"],
  columnNames: ["Position", "Club", "Played", "Won", "Drawn", "Lost", "GD", "Points", "Form"],
  columnKeys: ["position", "club", "played", "won", "drawn", "lost", "gd", "points", "form"],
  results: [
    { position: 1, club: "Cambrian United", played: 19, won: 15, drawn: 2, lost: 2, gd: 33, points: 47 },
    { position: 2, club: "Trefelin BGC", played: 17, won: 13, drawn: 3, lost: 1, gd: 28, points: 42 },
    { position: 3, club: "Ammanford", played: 18, won: 10, drawn: 7, lost: 1, gd: 18, points: 37 },
    { position: 4, club: "Caerau Ely", played: 19, won: 9, drawn: 5, lost: 5, gd: 10, points: 32 },
    { position: 5, club: "Cardiff Draconians", played: 18, won: 9, drawn: 2, lost: 7, gd: 5, points: 29 },
    { position: 6, club: "Newport City", played: 18, won: 6, drawn: 9, lost: 3, gd: 4, points: 27 },
    { position: 7, club: "Aberystwyth Town", played: 17, won: 8, drawn: 3, lost: 6, gd: 4, points: 27 },
    { position: 8, club: "Carmarthen Town", played: 19, won: 6, drawn: 9, lost: 4, gd: 2, points: 27 },
    { position: 9, club: "Treowen Stars", played: 18, won: 6, drawn: 5, lost: 7, gd: -4, points: 23 },
    { position: 10, club: "Llantwit Major", played: 18, won: 4, drawn: 9, lost: 5, gd: -2, points: 21 },
    { position: 11, club: "Baglan Dragons", played: 17, won: 4, drawn: 7, lost: 6, gd: -1, points: 19 },
    { position: 12, club: "Pontypridd United", played: 19, won: 4, drawn: 4, lost: 11, gd: -7, points: 16 },
    { position: 13, club: "Trethomas Bluebirds", played: 18, won: 3, drawn: 7, lost: 8, gd: -11, points: 16 },
    { position: 14, club: "Afan Lido", played: 18, won: 3, drawn: 3, lost: 12, gd: -22, points: 12 },
    { position: 15, club: "Ynyshir Albions", played: 18, won: 3, drawn: 3, lost: 12, gd: -25, points: 12 },
    { position: 16, club: "Cwmbran Celtic", played: 19, won: 0, drawn: 6, lost: 13, gd: -32, points: 6 }
  ],
  totalSize: 16,
  page: 0,
  pageSize: 25
};

/**
 * LADIES LEAGUE TABLE - Genero Adran South 2024-25
 * Source: FAW Adran Leagues
 */
export const mockLadiesLeagueTable = {
  reportName: "Genero Adran South League Table",
  columnTypes: ["NUMBER", "STRING", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"],
  columnNames: ["Position", "Club", "Played", "Won", "Drawn", "Lost", "GD", "Points"],
  columnKeys: ["position", "club", "played", "won", "drawn", "lost", "gd", "points"],
  results: [
    { position: 1, club: "Pontypridd United", played: 14, won: 10, drawn: 1, lost: 3, gd: 22, points: 31 },
    { position: 2, club: "Swansea University", played: 14, won: 9, drawn: 2, lost: 3, gd: 16, points: 29 },
    { position: 3, club: "Cwmbran Celtic Ladies", played: 14, won: 9, drawn: 1, lost: 4, gd: 18, points: 28 },
    { position: 4, club: "Cascade YC", played: 14, won: 8, drawn: 2, lost: 4, gd: 12, points: 26 },
    { position: 5, club: "Cardiff Met", played: 14, won: 7, drawn: 1, lost: 6, gd: 8, points: 22 },
    { position: 6, club: "Penybont Women", played: 14, won: 4, drawn: 2, lost: 8, gd: -8, points: 14 },
    { position: 7, club: "Taffs Well Women", played: 14, won: 3, drawn: 1, lost: 10, gd: -18, points: 10 },
    { position: 8, club: "Llanelli Town", played: 14, won: 2, drawn: 1, lost: 11, gd: -24, points: 7 },
    { position: 9, club: "Caldicot Town", played: 14, won: 1, drawn: 1, lost: 12, gd: -26, points: 4 }
  ],
  totalSize: 9,
  page: 0,
  pageSize: 25
};

/**
 * SQUAD - Men's First Team 2025-26
 * Source: Transfermarkt (January 2026)
 */
export const mockSquad = {
  reportName: "Squad List - Men's First Team",
  columnTypes: ["IMAGELINK", "NUMBER", "STRING", "STRING", "STRING", "NUMBER", "DATE"],
  columnNames: ["Photo", "Squad No", "First Name", "Last Name", "Position", "Appearances", "Date of Birth"],
  columnKeys: ["photo", "squadNo", "firstName", "lastName", "position", "appearances", "dateOfBirth"],
  results: [
    // Goalkeepers
    {
      photo: "/images/players/lewis-watkins.webp",
      squadNo: 1,
      firstName: "Lewis",
      lastName: "Watkins",
      position: "Goalkeeper",
      appearances: 15,
      dateOfBirth: toComet("1992-06-15")
    },
    {
      photo: "/images/players/iwan-hooper.webp",
      squadNo: 13,
      firstName: "Iwan",
      lastName: "Hooper",
      position: "Goalkeeper",
      appearances: 4,
      dateOfBirth: toComet("2002-09-22")
    },
    // Defenders
    {
      photo: "/images/players/andrew-larcombe.webp",
      squadNo: 5,
      firstName: "Andrew",
      lastName: "Larcombe",
      position: "Centre Back",
      appearances: 17,
      dateOfBirth: toComet("1987-09-12")
    },
    {
      photo: "/images/players/josh-hinwood.webp",
      squadNo: 4,
      firstName: "Josh",
      lastName: "Hinwood",
      position: "Centre Back",
      appearances: 14,
      dateOfBirth: toComet("1997-05-22")
    },
    {
      photo: "/images/players/oliver-berry.webp",
      squadNo: 2,
      firstName: "Oliver",
      lastName: "Berry",
      position: "Left Back",
      appearances: 12,
      dateOfBirth: toComet("1999-03-18")
    },
    {
      photo: "/images/players/luke-edwards.webp",
      squadNo: 3,
      firstName: "Luke",
      lastName: "Edwards",
      position: "Left Back",
      appearances: 10,
      dateOfBirth: toComet("1999-08-18")
    },
    {
      photo: "/images/players/jac-evans.webp",
      squadNo: 6,
      firstName: "Jac",
      lastName: "Evans",
      position: "Left Back",
      appearances: 8,
      dateOfBirth: toComet("2005-02-18")
    },
    {
      photo: "/images/players/sam-powell.webp",
      squadNo: 15,
      firstName: "Sam",
      lastName: "Powell",
      position: "Right Back",
      appearances: 16,
      dateOfBirth: toComet("1996-11-08")
    },
    {
      photo: "/images/players/kian-bodenham.webp",
      squadNo: 16,
      firstName: "Kian",
      lastName: "Bodenham",
      position: "Right Back",
      appearances: 9,
      dateOfBirth: toComet("2004-04-25")
    },
    {
      photo: "/images/players/dominic-morris.webp",
      squadNo: 17,
      firstName: "Dominic",
      lastName: "Morris",
      position: "Centre Back",
      appearances: 6,
      dateOfBirth: toComet("2000-07-12")
    },
    // Midfielders
    {
      photo: "/images/players/finley-hayman.webp",
      squadNo: 7,
      firstName: "Finley",
      lastName: "Hayman",
      position: "Central Midfield",
      appearances: 15,
      dateOfBirth: toComet("2003-07-22")
    },
    {
      photo: "/images/players/isaac-powell.webp",
      squadNo: 8,
      firstName: "Isaac",
      lastName: "Powell",
      position: "Central Midfield",
      appearances: 17,
      dateOfBirth: toComet("2000-06-19")
    },
    {
      photo: "/images/players/efan-fletcher.webp",
      squadNo: 10,
      firstName: "Efan",
      lastName: "Fletcher",
      position: "Central Midfield",
      appearances: 11,
      dateOfBirth: toComet("2006-05-10")
    },
    {
      photo: "/images/players/tom-dean.webp",
      squadNo: 11,
      firstName: "Tom",
      lastName: "Dean",
      position: "Central Midfield",
      appearances: 8,
      dateOfBirth: toComet("2006-09-15")
    },
    {
      photo: "/images/players/mario-van-dieren.webp",
      squadNo: 14,
      firstName: "Mario",
      lastName: "van Dieren",
      position: "Central Midfield",
      appearances: 16,
      dateOfBirth: toComet("1996-01-14")
    },
    {
      photo: "/images/players/joseph-bowen.webp",
      squadNo: 18,
      firstName: "Joseph",
      lastName: "Bowen",
      position: "Central Midfield",
      appearances: 12,
      dateOfBirth: toComet("2003-02-28")
    },
    {
      photo: "/images/players/alex-mcdowell.webp",
      squadNo: 19,
      firstName: "Alex",
      lastName: "McDowell",
      position: "Attacking Midfield",
      appearances: 18,
      dateOfBirth: toComet("1997-12-07")
    },
    {
      photo: "/images/players/cole-doolan.webp",
      squadNo: 20,
      firstName: "Cole",
      lastName: "Doolan",
      position: "Attacking Midfield",
      appearances: 14,
      dateOfBirth: toComet("2000-07-15")
    },
    {
      photo: "/images/players/gabriel-howells.webp",
      squadNo: 21,
      firstName: "Gabriel",
      lastName: "Howells",
      position: "Attacking Midfield",
      appearances: 10,
      dateOfBirth: toComet("2006-09-03")
    },
    // Forwards
    {
      photo: "/images/players/tom-berry.webp",
      squadNo: 9,
      firstName: "Tom",
      lastName: "Berry",
      position: "Striker",
      appearances: 15,
      dateOfBirth: toComet("1997-11-12")
    },
    {
      photo: "/images/players/josh-gibson.webp",
      squadNo: 12,
      firstName: "Josh",
      lastName: "Gibson",
      position: "Striker",
      appearances: 12,
      dateOfBirth: toComet("2005-11-05")
    },
    {
      photo: "/images/players/arthur-furness.webp",
      squadNo: 22,
      firstName: "Arthur",
      lastName: "Furness",
      position: "Striker",
      appearances: 16,
      dateOfBirth: toComet("1994-08-25")
    },
    {
      photo: "/images/players/evan-maidment.webp",
      squadNo: 23,
      firstName: "Evan",
      lastName: "Maidment",
      position: "Striker",
      appearances: 7,
      dateOfBirth: toComet("2004-01-15")
    }
  ],
  totalSize: 23,
  page: 0,
  pageSize: 25
};

/**
 * PLAYER STATS - Men's First Team 2024-25
 * Source: Transfermarkt, match reports
 */
export const mockPlayerStats = {
  reportName: "Player Statistics",
  columnTypes: ["NUMBER", "STRING", "STRING", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"],
  columnNames: ["Person ID", "First Name", "Last Name", "Appearances", "Goals", "Assists", "Yellow Cards", "Red Cards"],
  columnKeys: ["personId", "firstName", "lastName", "appearances", "goals", "assists", "yellowCards", "redCards"],
  results: [
    { personId: 1, firstName: "Arthur", lastName: "Furness", appearances: 26, goals: 8, assists: 3, yellowCards: 4, redCards: 0 },
    { personId: 2, firstName: "Alex", lastName: "McDowell", appearances: 30, goals: 6, assists: 5, yellowCards: 5, redCards: 0 },
    { personId: 3, firstName: "Mario", lastName: "van Dieren", appearances: 28, goals: 5, assists: 7, yellowCards: 3, redCards: 0 },
    { personId: 4, firstName: "Isaac", lastName: "Powell", appearances: 25, goals: 4, assists: 4, yellowCards: 2, redCards: 0 },
    { personId: 5, firstName: "Louis", lastName: "Cochrane", appearances: 22, goals: 3, assists: 5, yellowCards: 1, redCards: 0 },
    { personId: 6, firstName: "Cole", lastName: "Doolan", appearances: 20, goals: 2, assists: 3, yellowCards: 4, redCards: 1 },
    { personId: 7, firstName: "Andrew", lastName: "Larcombe", appearances: 27, goals: 2, assists: 1, yellowCards: 6, redCards: 0 },
    { personId: 8, firstName: "Joshua", lastName: "Winstone", appearances: 24, goals: 1, assists: 0, yellowCards: 3, redCards: 0 },
    { personId: 9, firstName: "Oliver", lastName: "Berry", appearances: 28, goals: 1, assists: 4, yellowCards: 2, redCards: 0 },
    { personId: 10, firstName: "Gabriel", lastName: "Howells", appearances: 12, goals: 2, assists: 1, yellowCards: 0, redCards: 0 }
  ],
  totalSize: 10,
  page: 0,
  pageSize: 25
};

/**
 * CLUB INFO - Static data
 * Source: cwmbranceltic.com, Sofascore
 */
export const clubInfo = {
  name: "Cwmbran Celtic AFC",
  nameWelsh: "Clwb Pêl-droed Celtic Cwmbrân",
  founded: 1925, // Updated from Sofascore
  ground: {
    name: "Avondale Motor Park Arena",
    alternativeName: "Celtic Park",
    address: {
      street: "Henllys Way",
      town: "Cwmbran",
      county: "Torfaen",
      postcode: "NP44 3FS"
    },
    what3words: "///poets.status.wealth",
    coordinates: {
      lat: 51.6545,
      lng: -3.0234
    }
  },
  postalAddress: {
    street: "Oak Street",
    area: "Old Cwmbran",
    postcode: "NP44 3LT"
  },
  contact: {
    email: "cwmbrancelticfc@gmail.com",
    chairman: {
      name: "Barrie Desmond",
      phone: "07831 441109"
    }
  },
  social: {
    twitter: "https://twitter.com/cwmbranceltic",
    instagram: "https://www.instagram.com/cwmbrancelticfc/",
    facebook: "https://www.facebook.com/groups/171728059584376"
  },
  shop: "https://rhino.direct/pages/cwmbran-celtic-club-shop",
  colours: {
    primary: "#1e3a8a", // Celtic blue (home)
    secondary: "#facc15", // Yellow (home)
    away: "#006633", // Green (away)
    accent: "#FFFFFF"
  },
  admission: {
    adults: 5,
    concessions: 3,
    under16: 0, // Free
    programme: 2
  }
};

/**
 * SPONSORS
 */
export const sponsors = {
  main: {
    name: "Avondale Motor Park",
    logo: "/images/sponsors/avondale-hire.webp",
    url: "https://www.avondalemotorpark.com"
  },
  partners: [
    { name: "Avondale Hire", logo: "/images/sponsors/avondale-hire.webp", url: "http://www.avondalehire.co.uk" },
    { name: "Taking the Strain Travel", logo: "/images/sponsors/taking-the-strain-travel.webp", url: "https://takingthestraintravel.co.uk" },
    { name: "Hathways", logo: "/images/sponsors/hathways.webp", url: "https://hathways.co.uk" },
    { name: "Motazone", logo: "/images/sponsors/motazone.webp", url: "https://motazone.net" },
    { name: "Rhino Global", logo: "/images/sponsors/rhino-global.webp", url: null }
  ],
  advertisers: [
    { name: "John and Jane", logo: "/images/sponsors/john-and-jane.webp" },
    { name: "Lorann Engineering", logo: "/images/sponsors/lorann-engineering.webp" },
    { name: "MG's Carpets & Rugs", logo: "/images/sponsors/mgs-carpets.webp" }
  ]
};

/**
 * WOMEN'S TEAM KEY PLAYERS
 * Source: FAW Adran Leagues news, Clwb Peldroed
 * Last updated: January 2026
 */
export const womensKeyPlayers = [
  { name: "Natalia Shwartz", position: "Defender", notes: "Defensive rock, key to clean sheet record" },
  { name: "Jade Crofts", position: "Forward", notes: "Hat-trick hero, prolific scorer" },
  { name: "Lauren Boyd", position: "Forward", notes: "Clinical finisher, regular goalscorer" },
  { name: "Eloise Meaney", position: "Midfielder", notes: "Captain, leadership and composure" },
  { name: "Katie Williams", position: "Midfielder", notes: "Summer signing from TNS" },
  { name: "Georgina Cridland", position: "Midfielder", notes: "Key midfielder, goalscorer" },
  { name: "Alex Cridland", position: "Forward", notes: "Attacking threat" }
];

/**
 * MEN'S RESERVES SQUAD - Gwent County League
 * Source: Transfermarkt (January 2026)
 */
export const mockReservesSquad = {
  reportName: "Squad List - Men's Reserves",
  columnTypes: ["IMAGELINK", "NUMBER", "STRING", "STRING", "STRING", "NUMBER", "DATE"],
  columnNames: ["Photo", "Squad No", "First Name", "Last Name", "Position", "Appearances", "Date of Birth"],
  columnKeys: ["photo", "squadNo", "firstName", "lastName", "position", "appearances", "dateOfBirth"],
  results: [
    // Defenders
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 2,
      firstName: "Lloyd",
      lastName: "Perkins",
      position: "Right Back",
      appearances: 12,
      dateOfBirth: toComet("1995-08-03")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 3,
      firstName: "Joshua",
      lastName: "Winstone",
      position: "Centre Back",
      appearances: 14,
      dateOfBirth: toComet("2002-05-15")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 4,
      firstName: "Curtis",
      lastName: "Patel",
      position: "Centre Back",
      appearances: 10,
      dateOfBirth: toComet("1993-11-22")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 5,
      firstName: "Rory",
      lastName: "Coleman",
      position: "Centre Back",
      appearances: 11,
      dateOfBirth: toComet("1999-03-18")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 6,
      firstName: "Jack",
      lastName: "Prosser",
      position: "Centre Back",
      appearances: 8,
      dateOfBirth: toComet("2007-09-28")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 15,
      firstName: "Bailey",
      lastName: "Goodall",
      position: "Right Back",
      appearances: 9,
      dateOfBirth: toComet("2002-06-14")
    },
    // Midfielders
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 7,
      firstName: "Jai-Jnr",
      lastName: "Johnson",
      position: "Defensive Midfield",
      appearances: 13,
      dateOfBirth: toComet("2001-04-20")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 8,
      firstName: "Evan",
      lastName: "Prosser",
      position: "Central Midfield",
      appearances: 12,
      dateOfBirth: toComet("1997-02-10")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 10,
      firstName: "George",
      lastName: "Jenkins",
      position: "Central Midfield",
      appearances: 11,
      dateOfBirth: toComet("2002-07-25")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 11,
      firstName: "Tommy",
      lastName: "Challenger",
      position: "Central Midfield",
      appearances: 7,
      dateOfBirth: toComet("2007-03-20")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 14,
      firstName: "Louis",
      lastName: "Cochrane",
      position: "Central Midfield",
      appearances: 10,
      dateOfBirth: toComet("1997-11-22")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 16,
      firstName: "Sam",
      lastName: "Smith",
      position: "Central Midfield",
      appearances: 6,
      dateOfBirth: toComet("2000-01-15")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 17,
      firstName: "Kyle",
      lastName: "Jones",
      position: "Central Midfield",
      appearances: 5,
      dateOfBirth: toComet("2001-08-30")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 18,
      firstName: "Ethan",
      lastName: "Hooper",
      position: "Central Midfield",
      appearances: 8,
      dateOfBirth: toComet("2004-06-12")
    },
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 19,
      firstName: "Tom",
      lastName: "Barrett",
      position: "Central Midfield",
      appearances: 4,
      dateOfBirth: toComet("2003-12-05")
    },
    // Forwards
    {
      photo: "/images/players/placeholder.webp",
      squadNo: 9,
      firstName: "Callum",
      lastName: "Wakeham",
      position: "Left Wing",
      appearances: 11,
      dateOfBirth: toComet("1998-05-18")
    }
  ],
  totalSize: 16,
  page: 0,
  pageSize: 25
};

/**
 * WOMEN'S TEAM RESULTS - Genero Adran South 2025-26
 * Source: FAW Adran Leagues
 */
export const mockWomensResults = {
  reportName: "Club Results - Women's Team",
  columnTypes: ["NUMBER", "DATE", "STRING", "STRING", "NUMBER", "NUMBER", "STRING", "STRING", "NUMBER"],
  columnNames: ["Match ID", "Date", "Home Team", "Away Team", "Home Score", "Away Score", "Competition", "Scorers", "Attendance"],
  columnKeys: ["matchId", "date", "homeTeam", "awayTeam", "homeScore", "awayScore", "competition", "scorers", "attendance"],
  results: [
    {
      matchId: 3001,
      date: toComet("2025-12-07"),
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Caldicot Town",
      homeScore: 6,
      awayScore: 1,
      competition: "Genero Adran South",
      scorers: "Boyd 12', 37', Crofts 22', 45', 90+2', Meaney 86'",
      attendance: 95
    },
    {
      matchId: 3002,
      date: toComet("2025-11-14"),
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Llantwit Major",
      homeScore: 3,
      awayScore: 0,
      competition: "Genero Adran South",
      scorers: "",
      attendance: 85
    },
    {
      matchId: 3003,
      date: toComet("2025-10-31"),
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Baglan Dragons",
      homeScore: 2,
      awayScore: 0,
      competition: "Genero Adran South",
      scorers: "",
      attendance: 78
    },
    {
      matchId: 3004,
      date: toComet("2025-10-10"),
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Caerau Ely",
      homeScore: 4,
      awayScore: 1,
      competition: "Genero Adran South",
      scorers: "",
      attendance: 92
    },
    {
      matchId: 3005,
      date: toComet("2025-09-26"),
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Trethomas Bluebirds",
      homeScore: 3,
      awayScore: 1,
      competition: "Genero Adran South",
      scorers: "",
      attendance: 88
    },
    {
      matchId: 3006,
      date: toComet("2025-08-25"),
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Newport City",
      homeScore: 2,
      awayScore: 1,
      competition: "Genero Adran South",
      scorers: "",
      attendance: 102
    },
    {
      matchId: 3007,
      date: toComet("2025-03-16"),
      homeTeam: "Caldicot Town",
      awayTeam: "Cwmbran Celtic Ladies",
      homeScore: 1,
      awayScore: 3,
      competition: "Genero Adran South",
      scorers: "G. Cridland, A. Cridland, Boyd",
      attendance: 65
    },
    {
      matchId: 3008,
      date: toComet("2025-02-09"),
      homeTeam: "Pontypridd United",
      awayTeam: "Cwmbran Celtic Ladies",
      homeScore: 1,
      awayScore: 0,
      competition: "Genero Adran South",
      scorers: "",
      attendance: 112
    }
  ],
  totalSize: 8,
  page: 0,
  pageSize: 25
};

/**
 * WOMEN'S LEAGUE TABLE - Genero Adran South 2025-26
 * Source: FAW Adran Leagues
 * Note: Women's season runs Sept-April
 */
export const mockWomensLeagueTable = {
  reportName: "Genero Adran South League Table",
  columnTypes: ["NUMBER", "STRING", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"],
  columnNames: ["Position", "Club", "Played", "Won", "Drawn", "Lost", "GD", "Points"],
  columnKeys: ["position", "club", "played", "won", "drawn", "lost", "gd", "points"],
  results: [
    { position: 1, club: "Cardiff Met", played: 10, won: 8, drawn: 1, lost: 1, gd: 18, points: 25 },
    { position: 2, club: "Cwmbran Celtic Ladies", played: 10, won: 8, drawn: 0, lost: 2, gd: 16, points: 24 },
    { position: 3, club: "Cascade YC", played: 10, won: 7, drawn: 1, lost: 2, gd: 12, points: 22 },
    { position: 4, club: "Pure Swansea", played: 10, won: 5, drawn: 2, lost: 3, gd: 6, points: 17 },
    { position: 5, club: "Penybont Women", played: 10, won: 4, drawn: 2, lost: 4, gd: 2, points: 14 },
    { position: 6, club: "Taffs Well Women", played: 10, won: 3, drawn: 1, lost: 6, gd: -8, points: 10 },
    { position: 7, club: "Carmarthen Town", played: 10, won: 2, drawn: 2, lost: 6, gd: -12, points: 8 },
    { position: 8, club: "Llanelli Town", played: 10, won: 1, drawn: 1, lost: 8, gd: -18, points: 4 }
  ],
  totalSize: 8,
  page: 0,
  pageSize: 25
};
