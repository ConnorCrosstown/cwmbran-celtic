/**
 * Opposition Data for Programme Generator
 * Contains info about teams in JD Cymru South for auto-filling programmes
 */

export interface OppositionTeam {
  id: string;
  name: string;
  nickname?: string;
  ground: string;
  founded: number;
  colours: string;
  manager?: string;
  website?: string;
  badge?: string;
  lastMeeting?: {
    date: string;
    result: string;
    score: string;
  };
  headToHead?: {
    played: number;
    celticWins: number;
    draws: number;
    oppositionWins: number;
  };
}

export const oppositionTeams: OppositionTeam[] = [
  {
    id: 'llanelli-town',
    name: 'Llanelli Town',
    nickname: 'The Reds',
    ground: 'Stebonheath Park',
    founded: 1896,
    colours: 'Red and White',
    website: 'https://llanellitownafc.co.uk',
    badge: '/images/opponents/llanelli-town.png',
    headToHead: { played: 12, celticWins: 3, draws: 2, oppositionWins: 7 }
  },
  {
    id: 'trethomas-bluebirds',
    name: 'Trethomas Bluebirds',
    nickname: 'The Bluebirds',
    ground: 'Graig Y Rhacca',
    founded: 1946,
    colours: 'Blue and White',
    badge: '/images/opponents/trethomas-bluebirds.png',
    headToHead: { played: 10, celticWins: 4, draws: 3, oppositionWins: 3 }
  },
  {
    id: 'newport-city',
    name: 'Newport City',
    ground: 'Newport Stadium',
    founded: 2017,
    colours: 'Amber and Black',
    badge: '/images/opponents/newport-city.png',
    lastMeeting: { date: '4 Apr 2025', result: 'L', score: '2-0' },
    headToHead: { played: 8, celticWins: 2, draws: 2, oppositionWins: 4 }
  },
  {
    id: 'trefelin-bgc',
    name: 'Trefelin BGC',
    nickname: 'The Steelmen',
    ground: 'Ynys Park',
    founded: 1920,
    colours: 'Blue and Yellow',
    headToHead: { played: 10, celticWins: 3, draws: 4, oppositionWins: 3 }
  },
  {
    id: 'pontypridd-united',
    name: 'Pontypridd United',
    nickname: 'The Ponty',
    ground: 'Ynysangharad Park',
    founded: 2016,
    colours: 'Black and White',
    website: 'https://www.pontypriddunited.co.uk',
    badge: '/images/opponents/pontypridd-united.jpg',
    headToHead: { played: 14, celticWins: 5, draws: 4, oppositionWins: 5 }
  },
  {
    id: 'cambrian-united',
    name: 'Cambrian & Clydach Vale BGC',
    nickname: 'Cambrian',
    ground: 'King George V Playing Fields',
    founded: 2009,
    colours: 'Red and Black',
    badge: '/images/opponents/cambrian-united.png',
    headToHead: { played: 8, celticWins: 3, draws: 2, oppositionWins: 3 }
  },
  {
    id: 'carmarthen-town',
    name: 'Carmarthen Town',
    nickname: 'The Old Gold',
    ground: 'Richmond Park',
    founded: 1948,
    colours: 'Gold and Black',
    website: 'https://carmarthentownafc.co.uk',
    badge: '/images/opponents/carmarthen-town.png',
    headToHead: { played: 6, celticWins: 1, draws: 2, oppositionWins: 3 }
  },
  {
    id: 'baglan-dragons',
    name: 'Baglan Dragons',
    ground: 'Baglan Playing Fields',
    founded: 2017,
    colours: 'Red and Black',
    badge: '/images/opponents/baglan-dragons.png',
    lastMeeting: { date: '29 Mar 2025', result: 'L', score: '0-2' },
    headToHead: { played: 6, celticWins: 2, draws: 1, oppositionWins: 3 }
  },
  {
    id: 'llantwit-major',
    name: 'Llantwit Major',
    nickname: 'The Seasiders',
    ground: 'Windmill Lane',
    founded: 1962,
    colours: 'Blue and White',
    badge: '/images/opponents/llantwit-major.png',
    lastMeeting: { date: '12 Apr 2025', result: 'W', score: '1-0' },
    headToHead: { played: 12, celticWins: 6, draws: 3, oppositionWins: 3 }
  },
  {
    id: 'ammanford',
    name: 'Ammanford AFC',
    nickname: 'The Ammans',
    ground: 'The Recreation Ground',
    founded: 1903,
    colours: 'Red and White',
    badge: '/images/opponents/ammanford.png',
    headToHead: { played: 8, celticWins: 4, draws: 1, oppositionWins: 3 }
  },
  {
    id: 'afan-lido',
    name: 'Afan Lido',
    nickname: 'The Seasiders',
    ground: 'The Runtech Group Stadium',
    founded: 1967,
    colours: 'Maroon and Blue',
    badge: '/images/opponents/afan-lido.png',
    lastMeeting: { date: '22 Mar 2025', result: 'D', score: '2-2' },
    headToHead: { played: 14, celticWins: 5, draws: 4, oppositionWins: 5 }
  },
  {
    id: 'caerau-ely',
    name: 'Caerau Ely',
    nickname: 'The Ravens',
    ground: 'Cwrt-Yr-Ala Playing Fields',
    founded: 1946,
    colours: 'Green and White',
    badge: '/images/opponents/caerau-ely.png',
    lastMeeting: { date: '11 Jan 2025', result: 'W', score: '2-1' },
    headToHead: { played: 10, celticWins: 5, draws: 2, oppositionWins: 3 }
  },
  {
    id: 'penrhiwceiber-rangers',
    name: 'Penrhiwceiber Rangers',
    nickname: 'The Ceiber',
    ground: 'Welfare Ground',
    founded: 1947,
    colours: 'Red and Black',
    badge: '/images/opponents/penrhiwceiber-rangers.png',
    headToHead: { played: 8, celticWins: 4, draws: 2, oppositionWins: 2 }
  },
  {
    id: 'goytre-united',
    name: 'Goytre United',
    ground: 'Plough Road',
    founded: 1948,
    colours: 'Yellow and Black',
    badge: '/images/opponents/goytre-united.png',
    headToHead: { played: 16, celticWins: 8, draws: 4, oppositionWins: 4 }
  },
  {
    id: 'taffs-well',
    name: 'Taffs Well',
    nickname: 'The Wellmen',
    ground: 'Rhiw Dda\'r',
    founded: 1946,
    colours: 'Green and White',
    badge: '/images/opponents/taffs-well.png',
    headToHead: { played: 14, celticWins: 7, draws: 3, oppositionWins: 4 }
  },
  {
    id: 'cardiff-draconians',
    name: 'Cardiff Draconians',
    ground: 'Cyncoed Campus',
    founded: 1990,
    colours: 'Black and Gold',
    badge: '/images/opponents/cardiff-draconians.png',
    headToHead: { played: 4, celticWins: 1, draws: 1, oppositionWins: 2 }
  },
  {
    id: 'aberystwyth-town',
    name: 'Aberystwyth Town',
    nickname: 'The Seasiders',
    ground: 'Park Avenue',
    founded: 1884,
    colours: 'Green and Black',
    badge: '/images/opponents/aberystwyth-town.png',
    headToHead: { played: 2, celticWins: 0, draws: 0, oppositionWins: 2 }
  },
  {
    id: 'ynyshir-albions',
    name: 'Ynyshir Albions',
    nickname: 'The Albions',
    ground: 'Ynyshir Park',
    founded: 1903,
    colours: 'Red and White',
    badge: '/images/opponents/ynyshir-albions.png',
    headToHead: { played: 2, celticWins: 0, draws: 2, oppositionWins: 0 }
  },
  {
    id: 'treowen-stars',
    name: 'Treowen Stars',
    nickname: 'The Stars',
    ground: 'Treowen Recreation Ground',
    founded: 1972,
    colours: 'Blue and White',
    badge: '/images/opponents/treowen-stars.png',
    headToHead: { played: 2, celticWins: 0, draws: 2, oppositionWins: 0 }
  },
];

export const getOppositionById = (id: string): OppositionTeam | undefined => {
  return oppositionTeams.find(team => team.id === id);
};

export const getOppositionByName = (name: string): OppositionTeam | undefined => {
  const nameLower = name.toLowerCase();

  // First try exact match
  const exactMatch = oppositionTeams.find(team =>
    team.name.toLowerCase() === nameLower
  );
  if (exactMatch) return exactMatch;

  // Then try partial match (handles "Taffs Well Women" matching "Taffs Well")
  // Remove common suffixes like "Women", "Ladies", "FC", "AFC" for matching
  const cleanedName = nameLower
    .replace(/\s*(women|ladies|fc|afc|town|united|city)(\s+fc|\s+afc)?$/gi, '')
    .trim();

  return oppositionTeams.find(team => {
    const teamNameLower = team.name.toLowerCase();
    const cleanedTeamName = teamNameLower
      .replace(/\s*(women|ladies|fc|afc|town|united|city)(\s+fc|\s+afc)?$/gi, '')
      .trim();

    // Check if either contains the other (for partial matches)
    return cleanedTeamName.includes(cleanedName) ||
           cleanedName.includes(cleanedTeamName) ||
           nameLower.includes(teamNameLower) ||
           teamNameLower.includes(nameLower.replace(/\s*(women|ladies).*$/i, '').trim());
  });
};
