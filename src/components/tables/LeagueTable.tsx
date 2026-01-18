import { LeagueTableRow } from '@/types';

interface LeagueTableProps {
  data: LeagueTableRow[];
  highlightTeam?: string;
  compact?: boolean;
}

export default function LeagueTable({ data, highlightTeam = 'Cwmbran Celtic', compact = false }: LeagueTableProps) {
  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <table className="w-full text-xs sm:text-sm min-w-[280px]">
        <thead>
          <tr className="bg-celtic-blue text-white">
            <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-left w-10 sm:w-12">#</th>
            <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-left">Club</th>
            <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-center w-8 sm:w-10">P</th>
            {!compact && (
              <>
                <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-center w-8 sm:w-10 hidden xs:table-cell">W</th>
                <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-center w-8 sm:w-10 hidden xs:table-cell">D</th>
                <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-center w-8 sm:w-10 hidden xs:table-cell">L</th>
              </>
            )}
            <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-center w-10 sm:w-12">GD</th>
            <th className="px-1.5 sm:px-3 py-2 sm:py-3 text-center w-10 sm:w-12">Pts</th>
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
                <td className="px-1.5 sm:px-3 py-2 sm:py-3">
                  <span className={`
                    inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-xs font-bold
                    ${row.position <= 1 ? 'bg-green-500 text-white' : ''}
                    ${row.position >= data.length - 1 ? 'bg-red-500 text-white' : ''}
                    ${row.position > 1 && row.position < data.length - 1 ? 'bg-gray-200 text-gray-700' : ''}
                  `}>
                    {row.position}
                  </span>
                </td>
                <td className={`px-1.5 sm:px-3 py-2 sm:py-3 ${isHighlighted ? 'text-celtic-blue' : ''} max-w-[100px] sm:max-w-none truncate`}>
                  {row.club}
                </td>
                <td className="px-1.5 sm:px-3 py-2 sm:py-3 text-center">{row.played}</td>
                {!compact && (
                  <>
                    <td className="px-1.5 sm:px-3 py-2 sm:py-3 text-center text-green-600 hidden xs:table-cell">{row.won}</td>
                    <td className="px-1.5 sm:px-3 py-2 sm:py-3 text-center text-yellow-600 hidden xs:table-cell">{row.drawn}</td>
                    <td className="px-1.5 sm:px-3 py-2 sm:py-3 text-center text-red-600 hidden xs:table-cell">{row.lost}</td>
                  </>
                )}
                <td className={`px-1.5 sm:px-3 py-2 sm:py-3 text-center ${row.gd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {row.gd > 0 ? '+' : ''}{row.gd}
                </td>
                <td className="px-1.5 sm:px-3 py-2 sm:py-3 text-center font-bold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
