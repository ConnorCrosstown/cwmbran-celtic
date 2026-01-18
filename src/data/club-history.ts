/**
 * Club History Data
 * Timeline of Cwmbran Celtic AFC
 */

export interface HistoryEvent {
  year: number;
  title: string;
  description: string;
  type: 'founding' | 'achievement' | 'milestone' | 'ground' | 'general';
}

export const clubHistory: HistoryEvent[] = [
  {
    year: 1925,
    title: "Club Founded as CYMS",
    description: "Cwmbran Celtic AFC was founded as CYMS (Catholic Young Men's Society), one of the oldest football clubs in the Torfaen area. The club began playing in the Newport & District League.",
    type: "founding"
  },
  {
    year: 1926,
    title: "First League Title",
    description: "In their debut season, CYMS won the Newport & District League Division 2 Section A title.",
    type: "achievement"
  },
  {
    year: 1930,
    title: "Gwent Church League Era",
    description: "The club moved to the Gwent Church League, where they competed until 1939.",
    type: "milestone"
  },
  {
    year: 1949,
    title: "Post-War Revival",
    description: "The club reformed after World War II and returned to the Newport & District League.",
    type: "milestone"
  },
  {
    year: 1951,
    title: "Premier Division Champions",
    description: "Celtic won the Newport & District League Premier Division title in the 1950-51 season.",
    type: "achievement"
  },
  {
    year: 1960,
    title: "Became Cwmbran Catholics",
    description: "After a period of running only junior sides, the club was reformed under the new name of Cwmbran Catholics.",
    type: "milestone"
  },
  {
    year: 1972,
    title: "Renamed Cwmbran Celtic",
    description: "The club adopted its current name, Cwmbran Celtic, while maintaining its proud heritage and Irish-Catholic roots.",
    type: "milestone"
  },
  {
    year: 1973,
    title: "Gwent Amateur Cup Winners",
    description: "Celtic won the Gwent Amateur Cup and finished runners-up in the Gwent Premier League in the 1972-73 season.",
    type: "achievement"
  },
  {
    year: 1979,
    title: "Club Headquarters Established",
    description: "The club bought its own premises at Oak Street, Old Cwmbran, which remains the club's headquarters today.",
    type: "ground"
  },
  {
    year: 2001,
    title: "Gwent County League Progress",
    description: "Celtic finished runners-up in Gwent County League Division Two, beginning their climb through the Welsh football pyramid.",
    type: "milestone"
  },
  {
    year: 2005,
    title: "Welsh League Promotion",
    description: "Under player-manager Mickey Copeman, Celtic finished runners-up to Clydach Wasps and were promoted to the Welsh League Division Three.",
    type: "milestone"
  },
  {
    year: 2007,
    title: "Welsh League Division 3 Champions",
    description: "Celtic enjoyed a remarkable 24-match unbeaten run and won the Welsh League Division Three title at their upgraded and newly named Celtic Park.",
    type: "achievement"
  },
  {
    year: 2010,
    title: "Women's Team Established",
    description: "Cwmbran Celtic Ladies was formed, expanding the club's reach and providing opportunities for women's football in the area.",
    type: "milestone"
  },
  {
    year: 2016,
    title: "Welsh Cup Quarter-Finals",
    description: "Under manager Nicky Church, Celtic reached the Welsh Cup Quarter-Finals for the first time in the club's history.",
    type: "achievement"
  },
  {
    year: 2016,
    title: "Best Modern League Season",
    description: "Celtic achieved their best modern-era league record: 24 wins, 0 draws, 6 losses, scoring 89 goals and conceding just 33. They finished as Welsh League Division Two runners-up with 72 points.",
    type: "achievement"
  },
  {
    year: 2019,
    title: "JD Cymru South Founder Members",
    description: "Celtic became founding members of the newly formed JD Cymru South (Tier 3) as part of the FAW's restructure of Welsh football.",
    type: "milestone"
  },
  {
    year: 2023,
    title: "Welsh Cup Quarter-Finals Return",
    description: "Celtic reached the Welsh Cup Quarter-Finals for the second time in their history.",
    type: "achievement"
  },
  {
    year: 2024,
    title: "Simon Berry Appointed Manager",
    description: "Simon Berry took charge of the Men's First Team in May 2024, bringing seven years of experience from Risca United and a focus on developing local talent.",
    type: "general"
  },
  {
    year: 2024,
    title: "Coleg Gwent Partnership",
    description: "Historic collaboration agreement signed with Coleg Gwent in October 2024, creating pathways for young players to combine education with football development through the Football Excellence Programme.",
    type: "milestone"
  },
  {
    year: 2024,
    title: "Avondale Motor Park Arena",
    description: "The ground received naming rights sponsorship from Avondale Motor Park, with continued investment in facilities.",
    type: "ground"
  },
  {
    year: 2025,
    title: "Centenary Year",
    description: "Cwmbran Celtic celebrates 100 years of football in Cwmbran, marking a century of serving the local community since 1925.",
    type: "milestone"
  },
  {
    year: 2025,
    title: "Women's Team Promotion Push",
    description: "Cwmbran Celtic Ladies challenge for promotion, sitting second in the Genero Adran South table.",
    type: "achievement"
  }
];

export const honours = [
  {
    competition: "Welsh League",
    achievements: [
      { title: "Division 3 Champions", years: ["2006-07"] },
      { title: "Division 2 Runners-Up", years: ["2015-16"] }
    ]
  },
  {
    competition: "Welsh Cup",
    achievements: [
      { title: "Quarter-Finalists", years: ["2015-16", "2022-23"] }
    ]
  },
  {
    competition: "Newport & District League",
    achievements: [
      { title: "Premier Division Champions", years: ["1950-51"] },
      { title: "Division 2 Section A Champions", years: ["1925-26"] }
    ]
  },
  {
    competition: "Gwent County League",
    achievements: [
      { title: "Division 1 Runners-Up", years: ["2001-02", "2004-05"] },
      { title: "Division 2 Runners-Up", years: ["2000-01"] }
    ]
  },
  {
    competition: "Gwent Amateur Cup",
    achievements: [
      { title: "Winners", years: ["1972-73"] }
    ]
  },
  {
    competition: "Gwent Premier League",
    achievements: [
      { title: "Runners-Up", years: ["1972-73"] }
    ]
  }
];

export const clubOfficials = [
  { role: "Chairman", name: "Barrie Desmond" },
  { role: "Vice Chairman", name: "TBC" },
  { role: "Secretary", name: "TBC" },
  { role: "Treasurer", name: "TBC" },
  { role: "Men's First Team Manager", name: "Simon Berry" },
  { role: "Women's Team Manager", name: "TBC" },
  { role: "Groundsman", name: "TBC" }
];
