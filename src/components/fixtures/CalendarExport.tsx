'use client';

import { useState } from 'react';

interface Fixture {
  date: number;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
}

interface CalendarExportProps {
  fixtures: Fixture[];
  team?: 'mens' | 'womens' | 'all';
}

export default function CalendarExport({ fixtures, team = 'all' }: CalendarExportProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateForICal = (timestamp: number, time: string): string => {
    const date = new Date(timestamp);
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const formatDateForGoogle = (timestamp: number, time: string): string => {
    const date = new Date(timestamp);
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const generateICalEvent = (fixture: Fixture): string => {
    const start = formatDateForICal(fixture.date, fixture.time);
    const endDate = new Date(fixture.date);
    const [hours, minutes] = fixture.time.split(':').map(Number);
    endDate.setHours(hours + 2, minutes, 0, 0); // Assume 2 hour duration
    const end = endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const isHome = fixture.homeTeam.toLowerCase().includes('cwmbran');
    const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
    const title = isHome
      ? `Cwmbran Celtic vs ${opponent}`
      : `${opponent} vs Cwmbran Celtic`;

    return `BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${fixture.competition}\\nKick-off: ${fixture.time}
LOCATION:${fixture.venue}
END:VEVENT`;
  };

  const downloadICalFile = () => {
    const events = fixtures.map(generateICalEvent).join('\n');

    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cwmbran Celtic AFC//Fixtures//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Cwmbran Celtic ${team === 'mens' ? "Men's" : team === 'womens' ? "Women's" : ''} Fixtures
${events}
END:VCALENDAR`;

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cwmbran-celtic-fixtures-${team}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const openGoogleCalendar = (fixture: Fixture) => {
    const start = formatDateForGoogle(fixture.date, fixture.time);
    const endDate = new Date(fixture.date);
    const [hours, minutes] = fixture.time.split(':').map(Number);
    endDate.setHours(hours + 2, minutes, 0, 0);
    const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const isHome = fixture.homeTeam.toLowerCase().includes('cwmbran');
    const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
    const title = isHome
      ? `Cwmbran Celtic vs ${opponent}`
      : `${opponent} vs Cwmbran Celtic`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${start}/${end}`,
      details: `${fixture.competition}\nKick-off: ${fixture.time}`,
      location: fixture.venue,
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    setIsOpen(false);
  };

  const openOutlookCalendar = () => {
    // For Outlook, we use the .ics download as it's compatible
    downloadICalFile();
  };

  if (fixtures.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-celtic-blue text-white rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Add to Calendar
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
            <div className="p-3 bg-gray-50 border-b">
              <p className="text-sm font-semibold text-celtic-dark">Add Fixtures to Your Calendar</p>
              <p className="text-xs text-gray-500">{fixtures.length} fixtures</p>
            </div>

            <div className="p-2">
              {/* Download All */}
              <button
                onClick={downloadICalFile}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-celtic-dark">Download All Fixtures</p>
                  <p className="text-xs text-gray-500">.ics file (Apple, Outlook, etc)</p>
                </div>
              </button>

              {/* Google Calendar - Add individual or subscribe */}
              <button
                onClick={() => openGoogleCalendar(fixtures[0])}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 4H18V3a1 1 0 00-2 0v1H8V3a1 1 0 00-2 0v1H4.5A2.5 2.5 0 002 6.5v13A2.5 2.5 0 004.5 22h15a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0019.5 4zM4 9h16v10.5a.5.5 0 01-.5.5h-15a.5.5 0 01-.5-.5V9z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-celtic-dark">Google Calendar</p>
                  <p className="text-xs text-gray-500">Add next fixture</p>
                </div>
              </button>

              {/* Apple Calendar */}
              <button
                onClick={downloadICalFile}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-celtic-dark">Apple Calendar</p>
                  <p className="text-xs text-gray-500">Download .ics file</p>
                </div>
              </button>

              {/* Outlook */}
              <button
                onClick={openOutlookCalendar}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.33.77.1.43.1.88zm-.25 0q0-.35-.07-.68-.07-.33-.21-.57-.14-.24-.36-.37-.22-.14-.53-.14-.31 0-.53.14-.22.13-.36.37-.14.24-.21.57-.07.33-.07.68 0 .36.07.68.07.33.21.58.14.24.36.38.22.13.53.13.31 0 .53-.13.22-.14.36-.38.14-.24.21-.58.07-.32.07-.68zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.02V2.38q0-.46.33-.8.32-.33.8-.33h14.87q.46 0 .8.33.32.34.32.8zm-6.01 0q0 .73-.25 1.34-.26.62-.71 1.06-.46.44-1.09.69-.63.24-1.4.24-.76 0-1.4-.24-.63-.25-1.09-.69-.45-.44-.71-1.06-.26-.61-.26-1.34t.26-1.34q.26-.62.71-1.06.46-.44 1.09-.69.64-.25 1.4-.25.77 0 1.4.25.63.25 1.09.69.45.44.71 1.06.25.62.25 1.34z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-celtic-dark">Outlook</p>
                  <p className="text-xs text-gray-500">Download .ics file</p>
                </div>
              </button>
            </div>

            <div className="p-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 text-center">
                Never miss a Celtic match!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
