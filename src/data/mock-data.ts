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
 * Last updated: January 2025
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
 * RESULTS - Recent match results (2024-25 season)
 * Source: FAW Cymru Leagues, allwalessport.co.uk
 */
export const mockResults = {
  reportName: "Club Results",
  columnTypes: ["NUMBER", "DATE", "STRING", "STRING", "NUMBER", "NUMBER", "STRING", "STRING", "NUMBER"],
  columnNames: ["Match ID", "Date", "Home Team", "Away Team", "Home Score", "Away Score", "Competition", "Scorers", "Attendance"],
  columnKeys: ["matchId", "date", "homeTeam", "awayTeam", "homeScore", "awayScore", "competition", "scorers", "attendance"],
  results: [
    // Men's results - 2024-25 season (most recent first)
    {
      matchId: 901,
      date: toComet("2025-01-11"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Carmarthen Town",
      homeScore: 3,
      awayScore: 1,
      competition: "JD Cymru South",
      scorers: "Berry 23', van Dieren 56', Hughes 78'",
      attendance: 195
    },
    {
      matchId: 902,
      date: toComet("2025-04-04"),
      homeTeam: "Newport City",
      awayTeam: "Cwmbran Celtic",
      homeScore: 2,
      awayScore: 0,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 245
    },
    {
      matchId: 903,
      date: toComet("2025-03-29"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Baglan Dragons",
      homeScore: 0,
      awayScore: 2,
      competition: "JD Cymru South",
      scorers: "",
      attendance: 156
    },
    {
      matchId: 904,
      date: toComet("2025-03-22"),
      homeTeam: "Cwmbran Celtic",
      awayTeam: "Afan Lido",
      homeScore: 2,
      awayScore: 2,
      competition: "JD Cymru South",
      scorers: "McDowell 23', van Dieren 67'",
      attendance: 189
    },
    {
      matchId: 905,
      date: toComet("2025-01-11"),
      homeTeam: "Caerau Ely",
      awayTeam: "Cwmbran Celtic",
      homeScore: 1,
      awayScore: 2,
      competition: "JD Cymru South",
      scorers: "McDowell 2', Furness 78'",
      attendance: 134
    },
    // Women's results - 2024-25 season
    {
      matchId: 2901,
      date: toComet("2025-01-05"),
      homeTeam: "Cwmbran Celtic Ladies",
      awayTeam: "Caldicot Town",
      homeScore: 6,
      awayScore: 1,
      competition: "Genero Adran South",
      scorers: "Boyd 12', 37', Crofts 22', 45', 90+2', Meaney 86'",
      attendance: 95
    },
    {
      matchId: 2902,
      date: toComet("2025-02-09"),
      homeTeam: "Pontypridd United",
      awayTeam: "Cwmbran Celtic Ladies",
      homeScore: 1,
      awayScore: 0,
      competition: "Genero Adran South",
      scorers: "",
      attendance: 112
    },
    {
      matchId: 2903,
      date: toComet("2024-09-15"),
      homeTeam: "Llanelli Town",
      awayTeam: "Cwmbran Celtic Ladies",
      homeScore: 1,
      awayScore: 2,
      competition: "Genero Adran South",
      scorers: "Crofts 34', Boyd 71'",
      attendance: 78
    }
  ],
  totalSize: 8,
  page: 0,
  pageSize: 25
};

/**
 * LEAGUE TABLE - JD Cymru South 2024-25 (Final)
 * Source: Transfermarkt, allwalessport.co.uk
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
    { position: 4, club: "Trefelin BGC", played: 30, won: 15, drawn: 8, lost: 7, gd: 13, points: 53 },
    { position: 5, club: "Pontypridd United", played: 30, won: 16, drawn: 5, lost: 9, gd: 10, points: 53 },
    { position: 6, club: "Cambrian United", played: 30, won: 13, drawn: 11, lost: 6, gd: 12, points: 47 },
    { position: 7, club: "Carmarthen Town", played: 30, won: 12, drawn: 9, lost: 9, gd: 11, points: 45 },
    { position: 8, club: "Baglan Dragons", played: 30, won: 11, drawn: 10, lost: 9, gd: 10, points: 43 },
    { position: 9, club: "Llantwit Major", played: 30, won: 11, drawn: 10, lost: 9, gd: 3, points: 43 },
    { position: 10, club: "Ammanford", played: 30, won: 11, drawn: 3, lost: 16, gd: -3, points: 36 },
    { position: 11, club: "Afan Lido", played: 30, won: 8, drawn: 10, lost: 12, gd: -7, points: 34 },
    { position: 12, club: "Caerau Ely", played: 30, won: 9, drawn: 5, lost: 16, gd: -1, points: 32 },
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
 * SQUAD - Men's First Team 2024-25
 * Source: Transfermarkt
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
      appearances: 25,
      dateOfBirth: toComet("1992-06-15")
    },
    {
      photo: "/images/players/iwan-hooper.webp",
      squadNo: 13,
      firstName: "Iwan",
      lastName: "Hooper",
      position: "Goalkeeper",
      appearances: 8,
      dateOfBirth: toComet("2002-09-22")
    },
    // Defenders
    {
      photo: "/images/players/oliver-berry.webp",
      squadNo: 2,
      firstName: "Oliver",
      lastName: "Berry",
      position: "Right Back",
      appearances: 28,
      dateOfBirth: toComet("1999-03-18")
    },
    {
      photo: "/images/players/sam-powell.webp",
      squadNo: 3,
      firstName: "Sam",
      lastName: "Powell",
      position: "Left Back",
      appearances: 26,
      dateOfBirth: toComet("1996-11-08")
    },
    {
      photo: "/images/players/dominic-connor.webp",
      squadNo: 4,
      firstName: "Dominic",
      lastName: "Connor",
      position: "Centre Back",
      appearances: 24,
      dateOfBirth: toComet("1998-05-30")
    },
    {
      photo: "/images/players/andrew-larcombe.webp",
      squadNo: 5,
      firstName: "Andrew",
      lastName: "Larcombe",
      position: "Centre Back",
      appearances: 27,
      dateOfBirth: toComet("1987-09-12")
    },
    {
      photo: "/images/players/jac-evans.webp",
      squadNo: 6,
      firstName: "Jac",
      lastName: "Evans",
      position: "Centre Back",
      appearances: 22,
      dateOfBirth: toComet("1997-02-18")
    },
    {
      photo: "/images/players/kian-bodenham.webp",
      squadNo: 15,
      firstName: "Kian",
      lastName: "Bodenham",
      position: "Left Back",
      appearances: 18,
      dateOfBirth: toComet("2003-04-25")
    },
    {
      photo: "/images/players/lloyd-perkins.webp",
      squadNo: 16,
      firstName: "Lloyd",
      lastName: "Perkins",
      position: "Right Back",
      appearances: 15,
      dateOfBirth: toComet("2002-08-03")
    },
    {
      photo: "/images/players/tyler-broom.webp",
      squadNo: 21,
      firstName: "Tyler",
      lastName: "Broom",
      position: "Centre Back",
      appearances: 12,
      dateOfBirth: toComet("2001-03-15")
    },
    // Midfielders
    {
      photo: "/images/players/mario-van-dieren.webp",
      squadNo: 7,
      firstName: "Mario",
      lastName: "van Dieren",
      position: "Central Midfield",
      appearances: 28,
      dateOfBirth: toComet("1995-01-14")
    },
    {
      photo: "/images/players/alex-mcdowell.webp",
      squadNo: 8,
      firstName: "Alex",
      lastName: "McDowell",
      position: "Central Midfield",
      appearances: 30,
      dateOfBirth: toComet("1996-12-07")
    },
    {
      photo: "/images/players/isaac-powell.webp",
      squadNo: 10,
      firstName: "Isaac",
      lastName: "Powell",
      position: "Attacking Midfield",
      appearances: 25,
      dateOfBirth: toComet("2000-06-19")
    },
    {
      photo: "/images/players/louis-cochrane.webp",
      squadNo: 11,
      firstName: "Louis",
      lastName: "Cochrane",
      position: "Left Wing",
      appearances: 22,
      dateOfBirth: toComet("1997-11-22")
    },
    {
      photo: "/images/players/cole-doolan.webp",
      squadNo: 14,
      firstName: "Cole",
      lastName: "Doolan",
      position: "Central Midfield",
      appearances: 20,
      dateOfBirth: toComet("2000-07-15")
    },
    {
      photo: "/images/players/joseph-bowen.webp",
      squadNo: 17,
      firstName: "Joseph",
      lastName: "Bowen",
      position: "Central Midfield",
      appearances: 16,
      dateOfBirth: toComet("2003-02-28")
    },
    {
      photo: "/images/players/efan-fletcher.webp",
      squadNo: 18,
      firstName: "Efan",
      lastName: "Fletcher",
      position: "Defensive Midfield",
      appearances: 19,
      dateOfBirth: toComet("1998-05-10")
    },
    {
      photo: "/images/players/gabriel-howells.webp",
      squadNo: 19,
      firstName: "Gabriel",
      lastName: "Howells",
      position: "Right Wing",
      appearances: 12,
      dateOfBirth: toComet("2006-09-03")
    },
    {
      photo: "/images/players/tommy-challenger.webp",
      squadNo: 20,
      firstName: "Tommy",
      lastName: "Challenger",
      position: "Central Midfield",
      appearances: 10,
      dateOfBirth: toComet("2007-03-20")
    },
    {
      photo: "/images/players/ethan-hooper.webp",
      squadNo: 22,
      firstName: "Ethan",
      lastName: "Hooper",
      position: "Central Midfield",
      appearances: 8,
      dateOfBirth: toComet("2004-06-12")
    },
    {
      photo: "/images/players/jack-prosser.webp",
      squadNo: 23,
      firstName: "Jack",
      lastName: "Prosser",
      position: "Central Midfield",
      appearances: 6,
      dateOfBirth: toComet("2003-09-28")
    },
    {
      photo: "/images/players/evan-maidment.webp",
      squadNo: 24,
      firstName: "Evan",
      lastName: "Maidment",
      position: "Central Midfield",
      appearances: 5,
      dateOfBirth: toComet("2004-01-15")
    },
    {
      photo: "/images/players/finley-hayman.webp",
      squadNo: 25,
      firstName: "Finley",
      lastName: "Hayman",
      position: "Central Midfield",
      appearances: 4,
      dateOfBirth: toComet("2005-07-22")
    },
    // Forwards
    {
      photo: "/images/players/arthur-furness.webp",
      squadNo: 9,
      firstName: "Arthur",
      lastName: "Furness",
      position: "Striker",
      appearances: 26,
      dateOfBirth: toComet("1993-08-25")
    },
    {
      photo: "/images/players/connor-james.webp",
      squadNo: 12,
      firstName: "Connor",
      lastName: "James",
      position: "Striker",
      appearances: 14,
      dateOfBirth: toComet("2000-04-12")
    },
    {
      photo: "/images/players/joshua-gibson.webp",
      squadNo: 26,
      firstName: "Joshua",
      lastName: "Gibson",
      position: "Striker",
      appearances: 8,
      dateOfBirth: toComet("2003-11-05")
    },
    {
      photo: "/images/players/luke-edwards.webp",
      squadNo: 27,
      firstName: "Luke",
      lastName: "Edwards",
      position: "Striker",
      appearances: 7,
      dateOfBirth: toComet("2002-08-18")
    },
    {
      photo: "/images/players/martin-ingram.webp",
      squadNo: 28,
      firstName: "Martin",
      lastName: "Ingram",
      position: "Striker",
      appearances: 5,
      dateOfBirth: toComet("1999-02-14")
    },
    {
      photo: "/images/players/robert-jones.webp",
      squadNo: 29,
      firstName: "Robert",
      lastName: "Jones",
      position: "Striker",
      appearances: 4,
      dateOfBirth: toComet("2001-05-30")
    },
    {
      photo: "/images/players/ryan-saunders.webp",
      squadNo: 30,
      firstName: "Ryan",
      lastName: "Saunders",
      position: "Striker",
      appearances: 3,
      dateOfBirth: toComet("2000-12-08")
    },
    {
      photo: "/images/players/ryan-thomas.webp",
      squadNo: 31,
      firstName: "Ryan",
      lastName: "Thomas",
      position: "Striker",
      appearances: 6,
      dateOfBirth: toComet("1998-09-22")
    },
    {
      photo: "/images/players/sam-lewis.webp",
      squadNo: 32,
      firstName: "Sam",
      lastName: "Lewis",
      position: "Striker",
      appearances: 5,
      dateOfBirth: toComet("2001-03-18")
    },
    {
      photo: "/images/players/steven-muir.webp",
      squadNo: 33,
      firstName: "Steven",
      lastName: "Muir",
      position: "Striker",
      appearances: 4,
      dateOfBirth: toComet("1997-06-25")
    },
    {
      photo: "/images/players/tom-berry.webp",
      squadNo: 34,
      firstName: "Tom",
      lastName: "Berry",
      position: "Striker",
      appearances: 3,
      dateOfBirth: toComet("2002-11-12")
    }
  ],
  totalSize: 34,
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
 * Source: FAW Adran Leagues news
 */
export const womensKeyPlayers = [
  { name: "Natalia Shwartz", position: "Defender", notes: "Consistent performer, defensive rock" },
  { name: "Jade Crofts", position: "Forward", notes: "Top scorer before move to Briton Ferry - 8 goals in 7 games" },
  { name: "Lauren Boyd", position: "Forward", notes: "Stepped up after Crofts departure, clinical finisher" },
  { name: "Eloise Meaney", position: "Midfielder", notes: "Captain, leadership and composure" },
  { name: "Katie Williams", position: "Midfielder", notes: "Summer signing from TNS" }
];
