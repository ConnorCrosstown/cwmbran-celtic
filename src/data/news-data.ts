import { NewsArticle, MatchReport } from '@/types/news';

// Helper to create timestamps
const toTimestamp = (dateStr: string): number => new Date(dateStr).getTime();

export const mockNews: NewsArticle[] = [
  {
    id: '1',
    slug: 'celtic-draw-with-carmarthen-town',
    title: 'Celtic Fight Back to Draw 2-2 with Carmarthen Town',
    excerpt: 'A spirited second-half performance sees Cwmbran Celtic earn a valuable point at home.',
    content: `
      <p>Cwmbran Celtic showed tremendous character to fight back from behind and earn a 2-2 draw against Carmarthen Town at the Avondale Motor Park Arena.</p>

      <p>The visitors took the lead in the first half, but Celtic responded well after the break and managed to level the scores twice to secure a hard-earned point.</p>

      <p>Manager Simon Berry was pleased with his team's resilience: "We showed great spirit to come back twice. The lads never gave up and that mentality is important for us."</p>

      <p>The result means Celtic continue their recent improved form with four draws from their last five league games, showing defensive improvements under Berry's guidance.</p>
    `,
    category: 'match-report',
    team: 'mens',
    author: 'Club Media',
    publishedAt: toTimestamp('2026-01-11'),
    tags: ['match-report', 'jd-cymru-south', 'home'],
  } as MatchReport,
  {
    id: '2',
    slug: 'coleg-gwent-football-excellence-programme',
    title: 'Celtic and Coleg Gwent Launch Football Excellence Programme',
    excerpt: 'Historic partnership brings professional football training to college students in Torfaen.',
    content: `
      <p>Cwmbran Celtic and Coleg Gwent have announced the launch of an exciting new Football Excellence Programme, providing students with the opportunity to develop their football talents alongside their education.</p>

      <p>The collaboration agreement, signed in October 2024, establishes a three-year partnership with both parties planning for it to become a long-term arrangement.</p>

      <h3>Programme Benefits</h3>
      <p>Students enrolled in the programme will benefit from:</p>
      <ul>
        <li>Training on Cwmbran Celtic's state-of-the-art pitch</li>
        <li>Access to specialised VEO technology for performance analysis</li>
        <li>Expert coaching from Cwmbran Celtic's coaching staff</li>
        <li>Integrated timetable allowing sport alongside studies</li>
      </ul>

      <p>Jess Pike, Employer Engagement Advisor at Coleg Gwent, said: "This programme joins our successful rugby and netball academies. Learners will have fantastic opportunities to develop their football skills while receiving support in their education."</p>

      <p>The longer-term aim is to raise the standard of football at the college, the club, and the wider Torfaen area.</p>

      <p>For more information about the Football Excellence Programme, contact Coleg Gwent admissions.</p>
    `,
    category: 'announcement',
    team: 'both',
    author: 'Club Media',
    publishedAt: toTimestamp('2024-10-15'),
    tags: ['partnership', 'coleg-gwent', 'youth', 'development'],
  },
  {
    id: '3',
    slug: 'simon-berry-appointed-manager',
    title: 'Simon Berry Appointed as New Celtic Manager',
    excerpt: 'Experienced manager takes the helm at Cwmbran Celtic after seven years at Risca United.',
    content: `
      <p>Cwmbran Celtic are delighted to confirm that Simon Berry has been appointed as the club's new First Team Manager, taking over from outgoing boss James Kinsella.</p>

      <p>This marks the second time Celtic have offered Simon the position, having previously approached him in 2019 under the chairmanship of Scott Kinsella.</p>

      <h3>Managerial Experience</h3>
      <p>Berry joins Celtic after seven successful years at Risca United, where he served first as coach before being promoted to manager. Prior to that, he managed Newport Civil Service and led Monmouth Town youth to become Welsh Youth League Champions in 2015/16.</p>

      <h3>Playing Career</h3>
      <p>As a player, Berry represented Cromwell in the Gwent County League and Newport Civil Service in the Welsh League, giving him a deep understanding of football at this level.</p>

      <h3>Family Connection</h3>
      <p>Berry has a personal connection to the club - his son Oliver plays for Celtic, making this appointment even more special for the family.</p>

      <p>Berry will be assisted by Stephen Muir, Sam Lewis, and Connor James as part of his backroom team.</p>

      <p>"I'm excited to take on this challenge," said Berry. "Cwmbran Celtic is a fantastic club with great history and potential. I'm looking forward to working with the players and continuing to build on the club's progress."</p>
    `,
    category: 'announcement',
    team: 'mens',
    author: 'Club Media',
    publishedAt: toTimestamp('2024-05-15'),
    tags: ['manager', 'appointment', 'simon-berry'],
  },
  {
    id: '4',
    slug: 'celtic-survive-relegation-mario-goal',
    title: 'Mario van Dieren Goal Secures Survival on Final Day',
    excerpt: 'A crucial 1-0 win over Llantwit Major ensures Celtic remain in JD Cymru South.',
    content: `
      <p>Cwmbran Celtic secured their JD Cymru South status for next season with a nerve-wracking 1-0 victory over Llantwit Major on the final day of the 2024-25 season.</p>

      <p>The decisive moment came when Mario van Dieren found the back of the net to give Celtic the win they needed to stay up.</p>

      <p>Manager Simon Berry spoke after the game about the relief: "It's been a challenging season but the character of this group has been incredible. To get the result we needed on the final day shows what this team is made of."</p>

      <p>The victory sparked emotional celebrations among players, staff, and supporters who had gathered at the Avondale Motor Park Arena to witness the crucial fixture.</p>

      <p>Celtic will now look to build on this survival and establish themselves more firmly in the division next season.</p>
    `,
    category: 'match-report',
    team: 'mens',
    author: 'Club Media',
    publishedAt: toTimestamp('2025-04-12'),
    tags: ['match-report', 'jd-cymru-south', 'survival', 'mario-van-dieren'],
  } as MatchReport,
  {
    id: '5',
    slug: 'ladies-dominate-caldicot-6-1',
    title: "Women's Team Crush Caldicot Town 6-1 in Commanding Display",
    excerpt: 'Hat-trick hero Jade Crofts and Lauren Boyd fire Celtic Ladies to emphatic victory.',
    content: `
      <p>Cwmbran Celtic Ladies produced a stunning performance to thrash Caldicot Town 6-1 in the Genero Adran South, with Jade Crofts scoring a hat-trick.</p>

      <h3>Goalscorers</h3>
      <ul>
        <li>Lauren Boyd - 12', 37'</li>
        <li>Jade Crofts - 22', 45', 90+2'</li>
        <li>Eloise Meaney - 86'</li>
      </ul>

      <p>The result continues Celtic Ladies' excellent form this season and keeps them firmly in the promotion hunt, sitting second in the Genero Adran South table.</p>

      <p>Boyd opened the scoring early and added a second before Crofts took over, completing her hat-trick with a goal in stoppage time. Captain Eloise Meaney added gloss to the scoreline late on.</p>

      <p>The women's team have now won 8 of their 10 league games this season, scoring 20 goals and demonstrating the attacking quality in the squad.</p>
    `,
    category: 'match-report',
    team: 'ladies',
    author: 'Club Media',
    publishedAt: toTimestamp('2025-12-07'),
    tags: ['match-report', 'genero-adran-south', 'ladies', 'hat-trick'],
  } as MatchReport,
  {
    id: '6',
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
    publishedAt: toTimestamp('2026-01-11'),
    tags: ['celtic-bond', 'fundraising'],
  },
  {
    id: '7',
    slug: 'joey-professional-contract-international-debut',
    title: 'Academy Graduate Joey Celebrates Dream Week',
    excerpt: 'Young Celtic player turns 16, makes first team debut, earns international cap, and signs professional contract.',
    content: `
      <p>Cwmbran Celtic are incredibly proud to announce that one of our academy graduates, Joey, has experienced the week of his life.</p>

      <p>In the space of just seven days, the talented youngster:</p>
      <ul>
        <li>Celebrated his 16th birthday</li>
        <li>Made his debut for Cwmbran Celtic First Team</li>
        <li>Earned his first international cap for Wales</li>
        <li>Signed a professional contract with a Football League club</li>
      </ul>

      <p>This remarkable achievement showcases the quality of youth development at Cwmbran Celtic and the pathway we provide for talented young players.</p>

      <p>Everyone at the club wishes Joey all the best in his professional career. He will always be a Celtic boy!</p>
    `,
    category: 'announcement',
    team: 'mens',
    author: 'Club Media',
    publishedAt: toTimestamp('2025-09-20'),
    tags: ['youth', 'academy', 'international', 'signing'],
  },
  {
    id: '8',
    slug: 'centenary-celebrations-1925-2025',
    title: 'Celtic Celebrate 100 Years of Football in Cwmbran',
    excerpt: 'The club marks a century of serving the Cwmbran community since its founding as CYMS in 1925.',
    content: `
      <p>Cwmbran Celtic AFC is proud to celebrate our centenary year, marking 100 years since the club was founded as Cwmbran Young Men's Society (CYMS) in 1925.</p>

      <h3>Our History</h3>
      <p>The club has undergone significant changes throughout its history:</p>
      <ul>
        <li><strong>1925:</strong> Founded as Cwmbran Young Men's Society (CYMS)</li>
        <li><strong>1960:</strong> Renamed to Cwmbran Catholics</li>
        <li><strong>1972:</strong> Became Cwmbran Celtic</li>
        <li><strong>2024:</strong> Entered into partnership with Coleg Gwent</li>
        <li><strong>2025:</strong> Celebrating our centenary!</li>
      </ul>

      <p>Throughout this century, the club has remained at the heart of the Cwmbran community, providing football opportunities for players of all ages and abilities.</p>

      <p>We would like to thank everyone who has been part of the Celtic family over the past 100 years - players, managers, volunteers, supporters, and sponsors. Here's to the next century!</p>

      <p>Special centenary events and merchandise will be announced throughout the year.</p>
    `,
    category: 'club-news',
    team: 'both',
    author: 'Club Chairman',
    publishedAt: toTimestamp('2025-01-01'),
    tags: ['centenary', 'history', '100-years', 'celebration'],
  },
  {
    id: '9',
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
        <li><strong>Location:</strong> Avondale Motor Park Arena</li>
      </ul>

      <p>Walking football is a great way to stay active, meet new people, and enjoy the beautiful game at a gentler pace. No booking required - just turn up!</p>

      <p>For more information, contact the clubhouse or email cwmbrancelticfc@gmail.com</p>
    `,
    category: 'community',
    team: 'both',
    author: 'Community Officer',
    publishedAt: toTimestamp('2026-01-06'),
    tags: ['walking-football', 'community', 'sessions'],
  },
  {
    id: '10',
    slug: 'tribute-to-phil-cook',
    title: 'Club Mourns Loss of Junior Manager Phil Cook',
    excerpt: 'Cwmbran Celtic pays tribute to beloved U12 Manager who passed away after illness.',
    content: `
      <p>It is with deep regret that Cwmbran Celtic announces the passing of Phil Cook, our dedicated U12 Manager, following a long illness.</p>

      <p>Phil was a beloved member of our club family who gave his time, energy, and passion to developing young footballers in our community. His dedication to the boys in his team was unwavering, and he made a lasting impact on everyone who knew him.</p>

      <p>Our thoughts are with Phil's family and friends during this difficult time, as well as all the young players and families who were touched by his kindness and coaching.</p>

      <p>Phil embodied everything that grassroots football should be about - putting the development and wellbeing of young people first. He will be greatly missed by the entire Celtic family.</p>

      <p>A minute's silence will be observed before all matches this weekend in Phil's memory.</p>

      <p>Rest in peace, Phil. Thank you for everything.</p>
    `,
    category: 'club-news',
    team: 'both',
    author: 'Club Chairman',
    publishedAt: toTimestamp('2025-10-01'),
    tags: ['tribute', 'community', 'youth'],
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
