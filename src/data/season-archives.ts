/**
 * Season Archives Data
 * Historical data for past seasons
 */

export interface SeasonArchive {
  season: string;
  slug: string;
  mens: {
    league: string;
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    topScorer?: { name: string; goals: number };
    manager?: string;
    highlights?: string[];
  };
  womens?: {
    league: string;
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    topScorer?: { name: string; goals: number };
    highlights?: string[];
  };
  cupRuns?: {
    competition: string;
    result: string;
  }[];
}

export const seasonArchives: SeasonArchive[] = [
  {
    season: "2024-25",
    slug: "2024-25",
    mens: {
      league: "JD Cymru South",
      position: 13,
      played: 30,
      won: 9,
      drawn: 3,
      lost: 18,
      goalsFor: 38,
      goalsAgainst: 61,
      points: 30,
      topScorer: { name: "Arthur Furness", goals: 8 },
      manager: "Simon Berry",
      highlights: [
        "Final day 1-0 win vs Llantwit Major",
        "Away win at Caerau Ely (2-1)",
        "Alex Bonthron named JD Cymru South Player of the Month (December)"
      ]
    },
    womens: {
      league: "Genero Adran South",
      position: 3,
      played: 14,
      won: 9,
      drawn: 1,
      lost: 4,
      goalsFor: 42,
      goalsAgainst: 24,
      points: 28,
      topScorer: { name: "Jade Crofts", goals: 12 },
      highlights: [
        "Best ever league finish (3rd place)",
        "6-1 victory over Caldicot Town",
        "Jade Crofts signed by Briton Ferry Llansawel"
      ]
    },
    cupRuns: [
      { competition: "FAW Trophy", result: "Second Round" },
      { competition: "Nathaniel MG Cup", result: "First Round" }
    ]
  },
  {
    season: "2023-24",
    slug: "2023-24",
    mens: {
      league: "JD Cymru South",
      position: 11,
      played: 30,
      won: 10,
      drawn: 6,
      lost: 14,
      goalsFor: 45,
      goalsAgainst: 52,
      points: 36,
      topScorer: { name: "Alex Bonthron", goals: 11 },
      manager: "Simon Berry",
      highlights: [
        "Alex Bonthron named Player of the Month (December 2023)",
        "Double over Taffs Well",
        "CPR & Defibrillator training for club volunteers"
      ]
    },
    womens: {
      league: "Genero Adran South",
      position: 5,
      played: 14,
      won: 6,
      drawn: 2,
      lost: 6,
      goalsFor: 28,
      goalsAgainst: 26,
      points: 20,
      highlights: [
        "Mid-table finish in competitive division",
        "Strong second half of season"
      ]
    },
    cupRuns: [
      { competition: "FAW Trophy", result: "Third Round" },
      { competition: "Nathaniel MG Cup", result: "Second Round" }
    ]
  },
  {
    season: "2022-23",
    slug: "2022-23",
    mens: {
      league: "JD Cymru South",
      position: 10,
      played: 30,
      won: 11,
      drawn: 5,
      lost: 14,
      goalsFor: 48,
      goalsAgainst: 55,
      points: 38,
      topScorer: { name: "Callum Davies", goals: 14 },
      manager: "Simon Berry",
      highlights: [
        "Simon Berry appointed as manager",
        "Strong run of form in spring",
        "Elvis Fundraiser at Pontnewydd WMC raised over £500"
      ]
    },
    cupRuns: [
      { competition: "FAW Trophy", result: "First Round" }
    ]
  }
];

export function getSeasonArchive(slug: string): SeasonArchive | undefined {
  return seasonArchives.find(s => s.slug === slug);
}

export function getAllSeasons(): string[] {
  return seasonArchives.map(s => s.slug);
}
