/**
 * Mock Data - Matches Comet API Response Format
 * 
 * This data structure mirrors what we'll receive from the FAW Comet API.
 * When API access is granted, replace these with actual API calls.
 * 
 * Comet API returns:
 * - columnTypes: ["STRING", "NUMBER", "DATE", "IMAGELINK", etc.]
 * - columnNames: Human-readable headers
 * - columnKeys: Machine keys for the data
 * - results: Array of objects with the data
 * - Dates are in milliseconds UTC
 */

// Helper to convert date to Comet format (ms since epoch)
const toComet = (dateStr: string): number => new Date(dateStr).getTime();

// Helper to convert Comet date back to JS Date
export const fromCometDate = (ms: number): Date => new Date(ms);

/**
 * FIXTURES - All upcoming matches
 */
export const mockFixtures = {
  reportName: "Club Fixtures",
  columnTypes: ["NUMBER", "DATE", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING"],
  columnNames: ["Match ID", "Date", "Time", "Home Team", "Away Team", "Competition", "Venue", "Home/Away"],
  columnKeys: ["matchId", "date", "time", "homeTeam", "awayTeam", "competition", "venue", "homeAway"],
  results: [
    {
      matchId: 1001,
      date: toComet("2026-01-18"),
      time: "14:30",
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Caerau Ely",
      competition: "JD Cymru South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 1002,
      date: toComet("2026-01-25"),
      time: "14:30",
      homeTeam: "Afan Lido",
      awayTeam: "Cwmbran Celtic",
      competition: "JD Cymru South",
      venue: "The Mariner's Ground",
      homeAway: "A"
    },
    {
      matchId: 1003,
      date: toComet("2026-02-01"),
      time: "14:30",
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Goytre United",
      competition: "JD Cymru South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 1004,
      date: toComet("2026-02-08"),
      time: "14:30",
      homeTeam: "Llanelli Town",
      awayTeam: "Cwmbran Celtic",
      competition: "JD Cymru South",
      venue: "Stebonheath Park",
      homeAway: "A"
    },
    {
      matchId: 1005,
      date: toComet("2026-02-15"),
      time: "14:30",
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Taffs Well",
      competition: "JD Cymru South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    // Ladies fixtures
    {
      matchId: 2001,
      date: toComet("2026-01-19"),
      time: "14:00",
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Cardiff Met",
      competition: "Genero Adran South",
      venue: "Avondale Motor Park Arena",
      homeAway: "H"
    },
    {
      matchId: 2002,
      date: toComet("2026-01-26"),
      time: "14:00",
      homeTeam: "Pontypridd United",
      awayTeam: "Cwmbran Celtic Ladies",
      competition: "Genero Adran South",
      venue: "Ynysangharad Park",
      homeAway: "A"
    }
  ],
  totalSize: 7,
  page: 0,
  pageSize: 25
};

/**
 * RESULTS - Recent match results
 */
export const mockResults = {
  reportName: "Club Results",
  columnTypes: ["NUMBER", "DATE", "STRING", "STRING", "NUMBER", "NUMBER", "STRING", "STRING", "NUMBER"],
  columnNames: ["Match ID", "Date", "Home Team", "Away Team", "Home Score", "Away Score", "Competition", "Scorers", "Attendance"],
  columnKeys: ["matchId", "date", "homeTeam", "awayTeam", "homeScore", "awayScore", "competition", "scorers", "attendance"],
  results: [
    {
      matchId: 901,
      date: toComet("2026-01-11"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Penrhiwceiber Rangers",
      homeScore: 2,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "Williams 34', Jones 67'",
      attendance: 187
    },
    {
      matchId: 900,
      date: toComet("2026-01-04"),
      homeTeam: "Trefelin",
      awayTeam: "Cwmbran Celtic",
      homeScore: 3,
      awayScore: 0,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 245
    },
    {
      matchId: 899,
      date: toComet("2025-12-28"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Cambrian United",
      homeScore: 1,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "Davies 55'",
      attendance: 203
    },
    {
      matchId: 898,
      date: toComet("2025-12-21"),
      homeTeam: "Newport City",
      awayTeam: "Cwmbran Celtic",
      homeScore: 2,
      awayScore: 0,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 312
    }
  ],
  totalSize: 4,
  page: 0,
  pageSize: 25
};

/**
 * LEAGUE TABLE - JD Cymru South
 */
export const mockLeagueTable = {
  reportName: "JD Cymru South League Table",
  columnTypes: ["NUMBER", "STRING", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"],
  columnNames: ["Position", "Club", "Played", "Won", "Drawn", "Lost", "GD", "Points", "Form"],
  columnKeys: ["position", "club", "played", "won", "drawn", "lost", "gd", "points", "form"],
  results: [
    { position: 1, club: "Llanelli Town", played: 30, won: 18, drawn: 10, lost: 2, gd: 39, points: 64 },
    { position: 2, club: "Trethomas Bluebirds", played: 30, won: 17, drawn: 8, lost: 5, gd: 20, points: 59 },
    { position: 3, club: "Newport City", played: 30, won: 16, drawn: 6, lost: 8, gd: 18, points: 54 },
    { position: 4, club: "Trefelin", played: 30, won: 15, drawn: 8, lost: 7, gd: 13, points: 53 },
    { position: 5, club: "Pontypridd United", played: 30, won: 16, drawn: 5, lost: 9, gd: 10, points: 53 },
    { position: 6, club: "Cambrian United", played: 30, won: 13, drawn: 11, lost: 6, gd: 12, points: 47 },
    { position: 7, club: "Carmarthen Town", played: 30, won: 12, drawn: 9, lost: 9, gd: 11, points: 45 },
    { position: 8, club: "Baglan Dragons FC", played: 30, won: 11, drawn: 10, lost: 9, gd: 10, points: 43 },
    { position: 9, club: "Llantwit Major", played: 30, won: 11, drawn: 10, lost: 9, gd: 3, points: 43 },
    { position: 10, club: "Ammanford", played: 30, won: 11, drawn: 3, lost: 16, gd: -3, points: 36 },
    { position: 11, club: "Afan Lido", played: 30, won: 8, drawn: 10, lost: 12, gd: -7, points: 34 },
    { position: 12, club: "Caerau (Ely) FC", played: 30, won: 9, drawn: 5, lost: 16, gd: -1, points: 32 },
    { position: 13, club: "Cwmbran Celtic", played: 30, won: 9, drawn: 3, lost: 18, gd: -23, points: 30 },
    { position: 14, club: "Penrhiwceiber Rangers", played: 30, won: 7, drawn: 7, lost: 16, gd: -27, points: 28 },
    { position: 15, club: "Goytre United", played: 30, won: 6, drawn: 5, lost: 19, gd: -31, points: 23 },
    { position: 16, club: "Taffs Well", played: 30, won: 3, drawn: 6, lost: 21, gd: -44, points: 15 }
  ],
  totalSize: 16,
  page: 0,
  pageSize: 25
};

/**
 * LADIES LEAGUE TABLE - Genero Adran South
 */
export const mockLadiesLeagueTable = {
  reportName: "Genero Adran South League Table",
  columnTypes: ["NUMBER", "STRING", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"],
  columnNames: ["Position", "Club", "Played", "Won", "Drawn", "Lost", "GD", "Points"],
  columnKeys: ["position", "club", "played", "won", "drawn", "lost", "gd", "points"],
  results: [
    { position: 1, club: "Pontypridd United", played: 12, won: 9, drawn: 0, lost: 3, gd: 19, points: 27 },
    { position: 2, club: "Swansea University", played: 12, won: 8, drawn: 1, lost: 3, gd: 13, points: 25 },
    { position: 3, club: "Cascade YC", played: 12, won: 8, drawn: 1, lost: 3, gd: 9, points: 25 },
    { position: 4, club: "Cardiff Met", played: 12, won: 6, drawn: 1, lost: 5, gd: 6, points: 19 },
    { position: 5, club: "Cwmbran Celtic Ladies", played: 12, won: 6, drawn: 1, lost: 5, gd: 8, points: 19 },
    { position: 6, club: "Llanelli Town", played: 12, won: 1, drawn: 1, lost: 10, gd: -22, points: 4 },
    { position: 7, club: "Caldicot Town", played: 12, won: 1, drawn: 0, lost: 11, gd: -33, points: 3 }
  ],
  totalSize: 7,
  page: 0,
  pageSize: 25
};

/**
 * SQUAD - Men's First Team
 */
export const mockSquad = {
  reportName: "Squad List - Men's First Team",
  columnTypes: ["IMAGELINK", "NUMBER", "STRING", "STRING", "STRING", "NUMBER", "DATE"],
  columnNames: ["Photo", "Squad No", "First Name", "Last Name", "Position", "Appearances", "Date of Birth"],
  columnKeys: ["photo", "squadNo", "firstName", "lastName", "position", "appearances", "dateOfBirth"],
  results: [
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 1,
      firstName: "Ryan",
      lastName: "Evans",
      position: "Goalkeeper",
      appearances: 28,
      dateOfBirth: toComet("1995-03-15")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 2,
      firstName: "James",
      lastName: "Morgan",
      position: "Right Back",
      appearances: 25,
      dateOfBirth: toComet("1998-07-22")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 3,
      firstName: "Daniel",
      lastName: "Price",
      position: "Left Back",
      appearances: 30,
      dateOfBirth: toComet("1996-11-08")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 4,
      firstName: "Thomas",
      lastName: "Williams",
      position: "Centre Back",
      appearances: 27,
      dateOfBirth: toComet("1994-05-30")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 5,
      firstName: "Chris",
      lastName: "Davies",
      position: "Centre Back",
      appearances: 29,
      dateOfBirth: toComet("1993-09-12")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 6,
      firstName: "Rhys",
      lastName: "Hughes",
      position: "Defensive Midfield",
      appearances: 26,
      dateOfBirth: toComet("1997-02-18")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 7,
      firstName: "Luke",
      lastName: "Thomas",
      position: "Right Wing",
      appearances: 24,
      dateOfBirth: toComet("2000-04-25")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 8,
      firstName: "Owen",
      lastName: "Roberts",
      position: "Central Midfield",
      appearances: 31,
      dateOfBirth: toComet("1995-08-03")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 9,
      firstName: "Jack",
      lastName: "Jones",
      position: "Striker",
      appearances: 30,
      dateOfBirth: toComet("1999-01-14")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 10,
      firstName: "Lewis",
      lastName: "Edwards",
      position: "Attacking Midfield",
      appearances: 28,
      dateOfBirth: toComet("1998-12-07")
    },
    {
      photo: "https://comet.faw.cymru/resources/images/noImageAvailable.png",
      squadNo: 11,
      firstName: "Ben",
      lastName: "Phillips",
      position: "Left Wing",
      appearances: 22,
      dateOfBirth: toComet("2001-06-19")
    }
  ],
  totalSize: 11,
  page: 0,
  pageSize: 25
};

/**
 * PLAYER STATS
 */
export const mockPlayerStats = {
  reportName: "Player Statistics",
  columnTypes: ["NUMBER", "STRING", "STRING", "NUMBER", "NUMBER", "NUMBER", "NUMBER", "NUMBER"],
  columnNames: ["Person ID", "First Name", "Last Name", "Appearances", "Goals", "Assists", "Yellow Cards", "Red Cards"],
  columnKeys: ["personId", "firstName", "lastName", "appearances", "goals", "assists", "yellowCards", "redCards"],
  results: [
    { personId: 1, firstName: "Jack", lastName: "Jones", appearances: 30, goals: 12, assists: 4, yellowCards: 3, redCards: 0 },
    { personId: 2, firstName: "Lewis", lastName: "Edwards", appearances: 28, goals: 8, assists: 7, yellowCards: 2, redCards: 0 },
    { personId: 3, firstName: "Luke", lastName: "Thomas", appearances: 24, goals: 5, assists: 9, yellowCards: 1, redCards: 0 },
    { personId: 4, firstName: "Ben", lastName: "Phillips", appearances: 22, goals: 4, assists: 3, yellowCards: 4, redCards: 1 },
    { personId: 5, firstName: "Owen", lastName: "Roberts", appearances: 31, goals: 3, assists: 5, yellowCards: 6, redCards: 0 },
    { personId: 6, firstName: "Rhys", lastName: "Hughes", appearances: 26, goals: 2, assists: 2, yellowCards: 5, redCards: 0 },
    { personId: 7, firstName: "Thomas", lastName: "Williams", appearances: 27, goals: 2, assists: 0, yellowCards: 4, redCards: 0 },
    { personId: 8, firstName: "Chris", lastName: "Davies", appearances: 29, goals: 1, assists: 1, yellowCards: 3, redCards: 0 }
  ],
  totalSize: 8,
  page: 0,
  pageSize: 25
};

/**
 * CLUB INFO - Static data (not from Comet)
 */
export const clubInfo = {
  name: "Cwmbran Celtic AFC",
  nameWelsh: "Clwb Pêl-droed Celtic Cwmbrân",
  founded: 1924,
  ground: {
    name: "Avondale Motor Park Arena",
    address: {
      street: "Henllys Way",
      town: "Cwmbran",
      county: "Torfaen",
      postcode: "NP44 3FS"
    },
    what3words: "///poets.status.wealth", // Example - needs confirming
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
    logo: "/images/sponsors/avondale-hire.webp", // Using Avondale Hire logo for now
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
