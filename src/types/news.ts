export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'match-report' | 'club-news' | 'transfer' | 'community' | 'announcement';
  team?: 'mens' | 'ladies' | 'both';
  featuredImage?: string;
  author: string;
  publishedAt: number; // timestamp
  tags: string[];
}

export interface MatchReport extends NewsArticle {
  category: 'match-report';
  matchId?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  scorers?: string[];
  motm?: string; // Man of the Match
}
