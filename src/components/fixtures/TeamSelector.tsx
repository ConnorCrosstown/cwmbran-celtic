'use client';

interface Team {
  id: string;
  name: string;
  shortName: string;
  league: string;
  color: 'blue' | 'yellow';
}

const teams: Team[] = [
  { id: 'mens', name: "Men's First Team", shortName: "Men's 1st", league: 'JD Cymru South', color: 'blue' },
  { id: 'womens', name: "Women's Team", shortName: "Women's", league: 'Genero Adran South', color: 'yellow' },
  { id: 'mens-seconds', name: "Men's Seconds", shortName: "Men's 2nd", league: 'Gwent County Div 2', color: 'blue' },
  { id: 'mens-thirds', name: "Men's Thirds", shortName: "Men's 3rd", league: 'Gwent County Div 3', color: 'blue' },
];

export default function TeamSelector() {
  const scrollToTeam = (teamId: string) => {
    const element = document.getElementById(teamId);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[60px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap mr-2">Jump to:</span>
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => scrollToTeam(team.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                team.color === 'blue'
                  ? 'bg-celtic-blue/10 text-celtic-blue hover:bg-celtic-blue hover:!text-white'
                  : 'bg-celtic-yellow/20 text-celtic-dark hover:bg-celtic-yellow'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                team.color === 'blue' ? 'bg-celtic-blue' : 'bg-celtic-yellow'
              }`} />
              <span className="hidden sm:inline">{team.name}</span>
              <span className="sm:hidden">{team.shortName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
