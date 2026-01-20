/**
 * Away Day Information Database
 * Contains travel info, directions, parking, pubs etc for each opponent's ground
 */

export interface AwayDayInfo {
  teamId: string;
  teamName: string;
  ground: {
    name: string;
    address: string;
    postcode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    what3words?: string;
  };
  travel: {
    distanceFromCwmbran: string; // e.g., "12 miles"
    driveTime: string; // e.g., "25 mins"
    directions: string; // Brief driving directions
    publicTransport?: string;
  };
  parking: {
    atGround: string;
    nearby: string[];
    cost?: string;
  };
  pubs: {
    name: string;
    distance: string;
    notes?: string;
    fanFriendly: boolean;
  }[];
  food: {
    name: string;
    type: string;
    distance: string;
  }[];
  groundInfo: {
    capacity?: number;
    terraces?: string;
    facilities?: string[];
    tips?: string[];
  };
  admission?: {
    adults: number;
    concessions: number;
    children: number;
  };
  lastUpdated: string;
}

// Cwmbran Celtic's home ground coordinates for distance calculations
export const CWMBRAN_COORDS = {
  lat: 51.6534,
  lng: -3.0233,
  address: 'Avondale Motor Park Arena, Henllys Way, Cwmbran NP44 6NB'
};

export const awayDays: AwayDayInfo[] = [
  {
    teamId: 'pontypridd-united',
    teamName: 'Pontypridd United',
    ground: {
      name: 'Ynysangharad Park',
      address: 'Ynysangharad Park, Pontypridd',
      postcode: 'CF37 4PE',
      coordinates: { lat: 51.6024, lng: -3.3419 },
      what3words: 'meals.bronze.plots'
    },
    travel: {
      distanceFromCwmbran: '14 miles',
      driveTime: '25-30 mins',
      directions: 'Take A4042 north to Pontypool, then A472 west through Newbridge. Continue on A470 south into Pontypridd. Ground is in the park near the town centre.',
      publicTransport: 'Train to Pontypridd station (15 min walk to ground). Regular services from Cardiff.'
    },
    parking: {
      atGround: 'Limited parking within the park. Arrive early on match days.',
      nearby: [
        'Sardis Road car park (5 min walk)',
        'Town centre multi-storey (10 min walk)',
        'On-street parking on residential roads'
      ],
      cost: 'Park car parks: £2-3'
    },
    pubs: [
      { name: 'The Bunch of Grapes', distance: '5 min walk', notes: 'Good real ale pub', fanFriendly: true },
      { name: 'Clwb y Bont', distance: '10 min walk', notes: 'Town centre', fanFriendly: true }
    ],
    food: [
      { name: 'Various takeaways', type: 'Fish & chips, kebabs', distance: 'Town centre' }
    ],
    groundInfo: {
      capacity: 2000,
      terraces: 'Open standing around pitch. Small covered stand.',
      facilities: ['Toilets', 'Tea bar'],
      tips: ['Pitch can be boggy in wet weather', 'Nice views of the park']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'newport-city',
    teamName: 'Newport City',
    ground: {
      name: 'Newport Stadium',
      address: 'Newport International Sports Village, Spytty Road, Newport',
      postcode: 'NP19 4PT',
      coordinates: { lat: 51.5621, lng: -2.9687 },
      what3words: 'issued.secret.dined'
    },
    travel: {
      distanceFromCwmbran: '8 miles',
      driveTime: '15-20 mins',
      directions: 'Take A4042 south to Newport. Join A48 (SDR) and follow signs for Newport Retail Park/Sports Village. Stadium is well signposted.',
      publicTransport: 'Bus from Newport city centre. No direct train service.'
    },
    parking: {
      atGround: 'Large free car park at the Sports Village.',
      nearby: [
        'Retail park parking nearby',
        'Overflow parking at velodrome'
      ],
      cost: 'Free'
    },
    pubs: [
      { name: 'The Dragonfly', distance: '5 min drive', notes: 'Near retail park', fanFriendly: true },
      { name: 'Wetherspoons (town centre)', distance: '10 min drive', notes: 'City centre options', fanFriendly: true }
    ],
    food: [
      { name: 'McDonalds/KFC', type: 'Fast food', distance: 'Retail park' },
      { name: 'Stadium cafe', type: 'Hot food', distance: 'At ground' }
    ],
    groundInfo: {
      capacity: 4500,
      terraces: 'Main stand seating. Standing areas available.',
      facilities: ['Toilets', 'Cafe', 'Bar'],
      tips: ['Athletic stadium so pitch is a distance from stands', 'Good facilities overall']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'trethomas-bluebirds',
    teamName: 'Trethomas Bluebirds',
    ground: {
      name: 'Graig Y Rhacca',
      address: 'Graig Y Rhacca, Caerphilly',
      postcode: 'CF83 8AJ',
      coordinates: { lat: 51.5689, lng: -3.2145 },
      what3words: 'winks.gems.plots'
    },
    travel: {
      distanceFromCwmbran: '11 miles',
      driveTime: '20-25 mins',
      directions: 'Take A4042 north, then A472 towards Crumlin. Turn south on A467 to Machen then follow signs to Trethomas.',
      publicTransport: 'Limited. Best to drive.'
    },
    parking: {
      atGround: 'Small car park at the ground.',
      nearby: [
        'Street parking in residential areas',
        'Caerphilly town centre (10 min drive)'
      ],
      cost: 'Free'
    },
    pubs: [
      { name: 'The Hollybush', distance: '5 min walk', fanFriendly: true }
    ],
    food: [
      { name: 'Local shops', type: 'Various', distance: 'Village centre' }
    ],
    groundInfo: {
      terraces: 'Small ground with basic facilities.',
      facilities: ['Toilets', 'Tea hut'],
      tips: ['Friendly club', 'Basic but welcoming facilities']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'carmarthen-town',
    teamName: 'Carmarthen Town',
    ground: {
      name: 'Richmond Park',
      address: 'Priory Street, Carmarthen',
      postcode: 'SA31 1ND',
      coordinates: { lat: 51.8580, lng: -4.3090 },
      what3words: 'tops.meals.dine'
    },
    travel: {
      distanceFromCwmbran: '55 miles',
      driveTime: '1 hour 15 mins',
      directions: 'M4 west to Junction 49, then A48 west to Carmarthen. Follow signs for town centre, ground is near the castle.',
      publicTransport: 'Train to Carmarthen station, 10 min walk to ground.'
    },
    parking: {
      atGround: 'Limited parking near the ground.',
      nearby: [
        'St Peters car park (5 min walk)',
        'Carmarthen town centre car parks'
      ],
      cost: '£1-2'
    },
    pubs: [
      { name: 'The Drovers Arms', distance: '5 min walk', notes: 'Good food', fanFriendly: true },
      { name: 'Yr Hen Dderwen', distance: '10 min walk', notes: 'Town centre', fanFriendly: true }
    ],
    food: [
      { name: 'Town centre options', type: 'Various restaurants and takeaways', distance: '5-10 min walk' }
    ],
    groundInfo: {
      capacity: 3000,
      terraces: 'Nice traditional ground. Main stand seating, covered terrace behind goal.',
      facilities: ['Toilets', 'Club bar', 'Tea bar'],
      tips: ['Lovely little ground', 'Make a day of it - nice market town']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'llanelli-town',
    teamName: 'Llanelli Town',
    ground: {
      name: 'Stebonheath Park',
      address: 'Stebonheath, Llanelli',
      postcode: 'SA15 1EY',
      coordinates: { lat: 51.6788, lng: -4.1662 },
      what3words: 'fonts.shout.storm'
    },
    travel: {
      distanceFromCwmbran: '50 miles',
      driveTime: '1 hour 10 mins',
      directions: 'M4 west to Junction 48, then A4138 to Llanelli. Follow signs for Stebonheath.',
      publicTransport: 'Train to Llanelli, then local bus or 20 min walk.'
    },
    parking: {
      atGround: 'Parking available at the ground.',
      nearby: [
        'Side streets nearby',
        'Town centre car parks'
      ],
      cost: 'Free at ground'
    },
    pubs: [
      { name: 'The York Palace', distance: '10 min walk', notes: 'Wetherspoons in town', fanFriendly: true }
    ],
    food: [
      { name: 'Town centre', type: 'Various options', distance: '10 min walk' }
    ],
    groundInfo: {
      capacity: 3700,
      terraces: 'Historic ground. Main stand, covered terrace.',
      facilities: ['Toilets', 'Clubhouse bar', 'Tea bar'],
      tips: ['Historic club with great atmosphere', 'Good facilities for this level']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'afan-lido',
    teamName: 'Afan Lido',
    ground: {
      name: 'The Runtech Group Stadium',
      address: 'Princess Margaret Way, Aberavon',
      postcode: 'SA12 6QW',
      coordinates: { lat: 51.5879, lng: -3.8065 },
      what3words: 'lofts.skills.quiz'
    },
    travel: {
      distanceFromCwmbran: '30 miles',
      driveTime: '45 mins',
      directions: 'M4 west to Junction 41 (Port Talbot). Follow A48 towards Aberavon Beach. Ground is near the seafront.',
      publicTransport: 'Train to Port Talbot Parkway, then bus to Aberavon.'
    },
    parking: {
      atGround: 'Car park at the ground.',
      nearby: [
        'Aberavon Beach car parks',
        'Street parking'
      ],
      cost: 'Free/nominal'
    },
    pubs: [
      { name: 'Beachcomber', distance: '5 min walk', notes: 'By the beach', fanFriendly: true },
      { name: 'The Grand Hotel', distance: '5 min walk', fanFriendly: true }
    ],
    food: [
      { name: 'Beach cafes', type: 'Various', distance: '5 min walk' },
      { name: 'Chip shops', type: 'Fish & chips', distance: 'Seafront' }
    ],
    groundInfo: {
      capacity: 2000,
      terraces: 'Decent ground by the beach.',
      facilities: ['Toilets', 'Clubhouse', 'Tea bar'],
      tips: ['Great location by the beach', 'Make a day trip of it!']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'goytre-united',
    teamName: 'Goytre United',
    ground: {
      name: 'Plough Road',
      address: 'Plough Road, Penperlleni',
      postcode: 'NP4 0AH',
      coordinates: { lat: 51.7351, lng: -3.0012 },
      what3words: 'hobby.jazz.flame'
    },
    travel: {
      distanceFromCwmbran: '6 miles',
      driveTime: '12-15 mins',
      directions: 'Head north on A4042 towards Abergavenny. Turn off at Penperlleni, ground is on Plough Road.',
      publicTransport: 'Limited. Best to drive or share.'
    },
    parking: {
      atGround: 'Parking available at the ground.',
      nearby: ['Street parking in village'],
      cost: 'Free'
    },
    pubs: [
      { name: 'The Crown Inn', distance: '5 min walk', notes: 'Village pub', fanFriendly: true }
    ],
    food: [
      { name: 'Tea bar at ground', type: 'Hot drinks, snacks', distance: 'At ground' }
    ],
    groundInfo: {
      terraces: 'Small village ground.',
      facilities: ['Toilets', 'Clubhouse', 'Tea bar'],
      tips: ['Short trip - local derby!', 'Friendly village club']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'caerau-ely',
    teamName: 'Caerau Ely',
    ground: {
      name: 'Cwrt-Yr-Ala Playing Fields',
      address: 'Cwrt-Yr-Ala Road, Cardiff',
      postcode: 'CF5 5QJ',
      coordinates: { lat: 51.4802, lng: -3.2489 },
      what3words: 'drill.closed.clues'
    },
    travel: {
      distanceFromCwmbran: '18 miles',
      driveTime: '30-35 mins',
      directions: 'A4042 south to Newport, M4 west to Junction 33, A4232 towards Cardiff Bay, exit for Ely/Caerau.',
      publicTransport: 'Bus from Cardiff city centre to Caerau.'
    },
    parking: {
      atGround: 'Parking at the ground.',
      nearby: ['Street parking nearby'],
      cost: 'Free'
    },
    pubs: [
      { name: 'Local pubs in Ely', distance: '5-10 min walk', fanFriendly: true }
    ],
    food: [
      { name: 'Takeaways in Ely', type: 'Various', distance: '10 min walk' }
    ],
    groundInfo: {
      terraces: 'Open ground in playing fields.',
      facilities: ['Toilets', 'Tea bar'],
      tips: ['In a residential area', 'Basic but functional']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'taffs-well',
    teamName: 'Taffs Well',
    ground: {
      name: "Rhiw Dda'r",
      address: 'Ffordd y Berllan, Taffs Well',
      postcode: 'CF15 7RY',
      coordinates: { lat: 51.5414, lng: -3.2638 },
      what3words: 'soup.pinks.winks'
    },
    travel: {
      distanceFromCwmbran: '15 miles',
      driveTime: '25-30 mins',
      directions: 'A4042 south to Newport, M4 west, exit Junction 32 for A470 north. Turn off for Taffs Well.',
      publicTransport: 'Train to Taffs Well station, 10 min walk to ground.'
    },
    parking: {
      atGround: 'Limited parking at ground.',
      nearby: [
        'Street parking in village',
        'By the train station'
      ],
      cost: 'Free'
    },
    pubs: [
      { name: 'The Fagins Ale & Chop House', distance: '5 min walk', notes: 'Good pub', fanFriendly: true },
      { name: 'Taffs Well Inn', distance: '5 min walk', fanFriendly: true }
    ],
    food: [
      { name: 'Village shops', type: 'Various', distance: '5 min walk' }
    ],
    groundInfo: {
      capacity: 1500,
      terraces: 'Nice ground in scenic location.',
      facilities: ['Toilets', 'Clubhouse', 'Tea bar'],
      tips: ['Lovely setting', 'Hills around the ground!']
    },
    lastUpdated: '2025-01-20'
  },
  {
    teamId: 'ammanford',
    teamName: 'Ammanford AFC',
    ground: {
      name: 'The Recreation Ground',
      address: 'Recreation Ground, Ammanford',
      postcode: 'SA18 2EY',
      coordinates: { lat: 51.7994, lng: -3.9883 },
      what3words: 'tribe.dots.storm'
    },
    travel: {
      distanceFromCwmbran: '55 miles',
      driveTime: '1 hour 15 mins',
      directions: 'M4 west, exit Junction 49 for A483 to Ammanford. Follow signs to town centre.',
      publicTransport: 'Train to Ammanford, 10 min walk.'
    },
    parking: {
      atGround: 'Street parking near ground.',
      nearby: ['Town centre car parks'],
      cost: 'Free'
    },
    pubs: [
      { name: 'The Cross Inn', distance: '5 min walk', fanFriendly: true },
      { name: 'Town centre pubs', distance: '10 min walk', fanFriendly: true }
    ],
    food: [
      { name: 'Town centre', type: 'Various', distance: '5-10 min walk' }
    ],
    groundInfo: {
      terraces: 'Traditional ground.',
      facilities: ['Toilets', 'Clubhouse', 'Tea bar'],
      tips: ['Long trip but friendly club', 'Nice valleys town']
    },
    lastUpdated: '2025-01-20'
  }
];

// Helper functions
export function getAwayDayInfo(teamId: string): AwayDayInfo | undefined {
  return awayDays.find(a => a.teamId === teamId);
}

export function getAwayDayByTeamName(teamName: string): AwayDayInfo | undefined {
  // Fuzzy match - handle variations in team names
  const normalizedSearch = teamName.toLowerCase().replace(/fc|afc|town|city|united/gi, '').trim();
  return awayDays.find(a => {
    const normalizedTeam = a.teamName.toLowerCase().replace(/fc|afc|town|city|united/gi, '').trim();
    return normalizedTeam.includes(normalizedSearch) || normalizedSearch.includes(normalizedTeam);
  });
}

export function getGoogleMapsUrl(info: AwayDayInfo): string {
  return `https://www.google.com/maps/dir/${CWMBRAN_COORDS.lat},${CWMBRAN_COORDS.lng}/${info.ground.coordinates.lat},${info.ground.coordinates.lng}`;
}

export function getGoogleMapsEmbedUrl(info: AwayDayInfo): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(info.ground.address + ', ' + info.ground.postcode)}`;
}
