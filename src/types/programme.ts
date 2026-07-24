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
  startingXI: number[];
  substitutes: number[];
  captain: number | null;
  referee: string;
  assistantRef1: string;
  assistantRef2: string;
  managersNotes: string;
  teamNews: string;
  updatedAt: string;
}
