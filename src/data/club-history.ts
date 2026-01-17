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
    year: 1924,
    title: "Club Founded",
    description: "Cwmbran Celtic AFC was established, becoming one of the oldest football clubs in the Torfaen area.",
    type: "founding"
  },
  {
    year: 1949,
    title: "Post-War Revival",
    description: "The club reformed after World War II and joined the local league structure.",
    type: "milestone"
  },
  {
    year: 1970,
    title: "Gwent County League Success",
    description: "Celtic enjoyed a successful period in the Gwent County League, establishing themselves as a competitive force in local football.",
    type: "achievement"
  },
  {
    year: 1992,
    title: "Welsh Football League Entry",
    description: "The club joined the Welsh Football League system, competing at a higher level of Welsh football.",
    type: "milestone"
  },
  {
    year: 2000,
    title: "Ground Development",
    description: "Major improvements made to Celtic Park, including new facilities for players and supporters.",
    type: "ground"
  },
  {
    year: 2010,
    title: "Women's Team Established",
    description: "Cwmbran Celtic Ladies was formed, expanding the club's reach and providing opportunities for women's football in the area.",
    type: "milestone"
  },
  {
    year: 2019,
    title: "Welsh Football Pyramid Restructure",
    description: "Celtic joined the newly formed JD Cymru South (Tier 3) as part of the FAW's restructure of Welsh football.",
    type: "milestone"
  },
  {
    year: 2022,
    title: "Coleg Gwent Partnership",
    description: "Historic collaboration agreement signed with Coleg Gwent, creating pathways for young players to combine education with football development.",
    type: "milestone"
  },
  {
    year: 2023,
    title: "Simon Berry Appointed Manager",
    description: "Simon Berry took charge of the Men's First Team, bringing fresh ideas and a focus on developing local talent.",
    type: "general"
  },
  {
    year: 2024,
    title: "Avondale Motor Park Arena",
    description: "The ground received naming rights sponsorship from Avondale Motor Park, with continued investment in facilities.",
    type: "ground"
  },
  {
    year: 2025,
    title: "Women's Team Best-Ever Finish",
    description: "Cwmbran Celtic Ladies achieved their highest league position (3rd) in the Genero Adran South.",
    type: "achievement"
  }
];

export const honours = [
  {
    competition: "Gwent County League",
    achievements: [
      { title: "League Champions", years: ["1972-73", "1985-86"] },
      { title: "Runners-Up", years: ["1970-71", "1984-85", "1987-88"] }
    ]
  },
  {
    competition: "Gwent Senior Cup",
    achievements: [
      { title: "Winners", years: ["1974-75"] },
      { title: "Runners-Up", years: ["1986-87"] }
    ]
  },
  {
    competition: "Welsh Amateur Cup",
    achievements: [
      { title: "Quarter-Finalists", years: ["1973-74"] }
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
