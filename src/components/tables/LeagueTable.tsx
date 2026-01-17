import { LeagueTableRow } from '@/types';

interface LeagueTableProps {
  data: LeagueTableRow[];
  highlightTeam?: string;
  compact?: boolean;
}

export default function LeagueTable({ data, highlightTeam = 'Cwmbran Celtic', compact = false }: LeagueTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-celtic-blue text-white">
            <th className="px-3 py-3 text-left">Pos</th>
            <th className="px-3 py-3 text-left">Club</th>
            <th className="px-3 py-3 text-center">P</th>
            {!compact && (
              <>
                <th className="px-3 py-3 text-center">W</th>
                <th className="px-3 py-3 text-center">D</th>
                <th className="px-3 py-3 text-center">L</th>
              </>
            )}
            <th className="px-3 py-3 text-center">GD</th>
            <th className="px-3 py-3 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isHighlighted = row.club.includes(highlightTeam);
            return (
              <tr
                key={row.position}
                className={`
                  border-b border-gray-100
                  ${isHighlighted ? 'bg-celtic-yellow/20 font-semibold' : 'hover:bg-gray-50'}
                `}
              >
                <td className="px-3 py-3">
                  <span className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                    ${row.position <= 1 ? 'bg-green-500 text-white' : ''}
                    ${row.position >= data.length - 1 ? 'bg-red-500 text-white' : ''}
                    ${row.position > 1 && row.position < data.length - 1 ? 'bg-gray-200 text-gray-700' : ''}
                  `}>
                    {row.position}
                  </span>
                </td>
                <td className={`px-3 py-3 ${isHighlighted ? 'text-celtic-blue' : ''}`}>
                  {row.club}
                </td>
                <td className="px-3 py-3 text-center">{row.played}</td>
                {!compact && (
                  <>
                    <td className="px-3 py-3 text-center text-green-600">{row.won}</td>
                    <td className="px-3 py-3 text-center text-yellow-600">{row.drawn}</td>
                    <td className="px-3 py-3 text-center text-red-600">{row.lost}</td>
                  </>
                )}
                <td className={`px-3 py-3 text-center ${row.gd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {row.gd > 0 ? '+' : ''}{row.gd}
                </td>
                <td className="px-3 py-3 text-center font-bold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
