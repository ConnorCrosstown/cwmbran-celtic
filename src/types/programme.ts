export interface SquadPlayer {
  id: string;
  squadNo: number;
  firstName: string;
  lastName: string;
  position: string;
  photoUrl?: string;
  penPicture?: string;
}

export interface Programme {
  id: string;
  slug: string;
  status: 'draft' | 'published';
  opponent: string;
  date: string;
  kickoff: string;
  competition: string;
  matchdayNumber: string;
  venue: 'home' | 'away';
  team: 'mens' | 'womens' | 'development';
  startingXI: number[];
  substitutes: number[];
  captain: number | null;
  referee: string;
  assistantRef1: string;
  assistantRef2: string;
  fourthOfficial: string;
  matchSponsor: string;
  mascotSponsor: string;
  matchballSponsor: string;
  programmePrice: string;
  managersNotes: string;
  teamNews: string;
  specialNotes: string;
  playerToWatch: number | null;
  coverImage: string;
  actionImage: string;
  createdAt: string;
  updatedAt: string;
}
