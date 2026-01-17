import { NewsArticle, MatchReport } from '@/types/news';

// Helper to create timestamps
const toTimestamp = (dateStr: string): number => new Date(dateStr).getTime();

export const mockNews: NewsArticle[] = [
  {
    id: '1',
    slug: 'celtic-secure-vital-win-against-pontypridd',
    title: 'Celtic Secure Vital 3-1 Win Against Pontypridd Town',
    excerpt: 'A dominant second-half performance saw Cwmbran Celtic claim all three points at The Park.',
    content: `
      <p>Cwmbran Celtic produced an impressive second-half display to secure a crucial 3-1 victory over Pontypridd Town at The Park on Saturday afternoon.</p>

      <p>The visitors took an early lead through a well-worked corner routine, but Celtic responded brilliantly after the break with goals from Jones, Williams, and substitute Davies sealing the win.</p>

      <p>Manager's reaction: "The lads showed tremendous character today. We knew it would be a tough game but the response after going behind was exactly what we needed."</p>

      <p>The win moves Celtic up to 5th in the JD Cymru South table and continues their excellent home form this season.</p>
    `,
    category: 'match-report',
    team: 'mens',
    author: 'Club Media',
    publishedAt: toTimestamp('2025-01-11'),
    tags: ['match-report', 'jd-cymru-south', 'home'],
  } as MatchReport,
  {
    id: '2',
    slug: 'ladies-team-extend-unbeaten-run',
    title: 'Ladies Extend Unbeaten Run to Seven Games',
    excerpt: 'Another impressive performance sees the Ladies maintain their promotion push.',
    content: `
      <p>Cwmbran Celtic Ladies continued their fantastic form with a hard-fought 2-2 draw away at Abergavenny on Sunday.</p>

      <p>Despite going 2-0 down early in the second half, the Ladies showed tremendous spirit to fight back and claim a valuable point that extends their unbeaten run to seven games in all competitions.</p>

      <p>Goals from captain Morgan and midfielder Evans earned the draw, with Evans' 89th-minute equaliser sparking wild celebrations among the travelling supporters.</p>

      <p>The Ladies sit 3rd in the Genero Adran South and remain firmly in the promotion race.</p>
    `,
    category: 'match-report',
    team: 'ladies',
    author: 'Club Media',
    publishedAt: toTimestamp('2025-01-12'),
    tags: ['match-report', 'genero-adran-south', 'ladies'],
  } as MatchReport,
  {
    id: '3',
    slug: 'celtic-bond-january-draw-results',
    title: 'Celtic Bond January Draw Results',
    excerpt: 'Congratulations to our January Celtic Bond winners!',
    content: `
      <p>The January Celtic Bond draw took place at the clubhouse following Saturday's match, with the following lucky winners:</p>

      <ul>
        <li><strong>1st Prize (£100):</strong> Number 47 - Mrs S. Thomas</li>
        <li><strong>2nd Prize (£50):</strong> Number 23 - Mr D. Williams</li>
        <li><strong>3rd Prize (£25):</strong> Number 89 - Mr P. Jones</li>
      </ul>

      <p>Thank you to everyone who participates in the Celtic Bond - your support makes a real difference to the club.</p>

      <p>Interested in joining? Numbers are available for just £5 per month. Contact the club for more details or visit our Celtic Bond page.</p>
    `,
    category: 'club-news',
    team: 'both',
    author: 'Club Secretary',
    publishedAt: toTimestamp('2025-01-11'),
    tags: ['celtic-bond', 'fundraising'],
  },
  {
    id: '4',
    slug: 'new-signing-midfielder-joins-from-newport',
    title: 'Celtic Sign Experienced Midfielder Davies',
    excerpt: 'Cwmbran Celtic are delighted to announce the signing of experienced midfielder Rhys Davies.',
    content: `
      <p>Cwmbran Celtic are delighted to announce the signing of experienced midfielder Rhys Davies from Newport City.</p>

      <p>Davies, 26, brings valuable experience having played over 150 games in the Welsh pyramid system. He is known for his energy, passing range, and leadership qualities.</p>

      <p>"I'm thrilled to join Cwmbran Celtic," said Davies. "The club has great ambitions and I want to be part of achieving those goals. The facilities here are excellent and I can't wait to get started."</p>

      <p>Manager's comment: "Rhys is exactly the type of player we were looking for. His experience and quality will strengthen our squad as we push for promotion."</p>

      <p>Davies will wear the number 8 shirt and is available for selection for Saturday's fixture.</p>
    `,
    category: 'transfer',
    team: 'mens',
    author: 'Club Media',
    publishedAt: toTimestamp('2025-01-08'),
    tags: ['signing', 'transfer', 'mens'],
  },
  {
    id: '5',
    slug: 'walking-football-sessions-restart',
    title: 'Walking Football Sessions Return This February',
    excerpt: 'Our popular walking football sessions are back for the new year.',
    content: `
      <p>Great news for our walking football community - sessions are returning from February 1st!</p>

      <p>Sessions run every Tuesday and Thursday from 10am-11:30am at The Park. All abilities welcome, whether you're a seasoned player or complete beginner.</p>

      <h3>Session Details:</h3>
      <ul>
        <li><strong>Days:</strong> Tuesday & Thursday</li>
        <li><strong>Time:</strong> 10:00am - 11:30am</li>
        <li><strong>Cost:</strong> £3 per session</li>
        <li><strong>Location:</strong> The Park, Cwmbran</li>
      </ul>

      <p>Walking football is a great way to stay active, meet new people, and enjoy the beautiful game at a gentler pace. No booking required - just turn up!</p>

      <p>For more information, contact the clubhouse or email walkingfootball@cwmbranceltic.com</p>
    `,
    category: 'community',
    team: 'both',
    author: 'Community Officer',
    publishedAt: toTimestamp('2025-01-06'),
    tags: ['walking-football', 'community', 'sessions'],
  },
  {
    id: '6',
    slug: 'volunteer-appreciation-evening',
    title: 'Save the Date: Volunteer Appreciation Evening',
    excerpt: 'Join us to celebrate our amazing volunteers who make the club tick.',
    content: `
      <p>Cwmbran Celtic AFC would like to invite all volunteers to our annual Volunteer Appreciation Evening on Friday 28th February at the clubhouse.</p>

      <p>This is our opportunity to say thank you to everyone who gives their time to support the club - from matchday helpers to committee members, coaches to ground staff.</p>

      <h3>Event Details:</h3>
      <ul>
        <li><strong>Date:</strong> Friday 28th February 2025</li>
        <li><strong>Time:</strong> 7:00pm onwards</li>
        <li><strong>Venue:</strong> Cwmbran Celtic Clubhouse</li>
        <li><strong>Dress Code:</strong> Smart casual</li>
      </ul>

      <p>Complimentary refreshments will be provided. Please RSVP to the club secretary by 21st February.</p>

      <p>Without our volunteers, there would be no Cwmbran Celtic. Thank you for everything you do!</p>
    `,
    category: 'announcement',
    team: 'both',
    author: 'Club Chairman',
    publishedAt: toTimestamp('2025-01-04'),
    tags: ['volunteers', 'event', 'announcement'],
  },
];

// Helper functions
export function getNewsArticle(slug: string): NewsArticle | undefined {
  return mockNews.find(article => article.slug === slug);
}

export function getLatestNews(limit = 5): NewsArticle[] {
  return [...mockNews]
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
}

export function getNewsByCategory(category: NewsArticle['category']): NewsArticle[] {
  return mockNews
    .filter(article => article.category === category)
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

export function getNewsByTeam(team: 'mens' | 'ladies'): NewsArticle[] {
  return mockNews
    .filter(article => article.team === team || article.team === 'both')
    .sort((a, b) => b.publishedAt - a.publishedAt);
}
