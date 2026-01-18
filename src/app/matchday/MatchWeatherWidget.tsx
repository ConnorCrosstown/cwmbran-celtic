'use client';

import MatchWeather from '@/components/weather/MatchWeather';

interface MatchWeatherWidgetProps {
  matchDate: number;
  matchTime?: string;
  opponent: string;
}

export default function MatchWeatherWidget({ matchDate, matchTime, opponent }: MatchWeatherWidgetProps) {
  const matchDateObj = new Date(matchDate);
  const formattedDate = matchDateObj.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-gradient-to-r from-celtic-blue to-celtic-blue-dark rounded-2xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-300 mb-1">Next Home Match</p>
          <h3 className="text-xl font-bold mb-1">Cwmbran Celtic vs {opponent}</h3>
          <p className="text-gray-300">{formattedDate} - {matchTime} kick-off</p>
        </div>
        <div className="md:text-right">
          <MatchWeather matchDate={matchDate} matchTime={matchTime} />
        </div>
      </div>
    </div>
  );
}
