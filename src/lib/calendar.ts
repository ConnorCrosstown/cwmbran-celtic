import { Fixture } from '@/types';

/**
 * Generate an iCal (.ics) file content for a fixture
 */
export function generateICalEvent(fixture: Fixture): string {
  const startDate = new Date(fixture.date);
  const [hours, minutes] = fixture.time.split(':').map(Number);
  startDate.setHours(hours || 15, minutes || 0, 0, 0);

  // Match duration approx 2 hours
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatDateForICal = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const isHome = fixture.homeAway === 'H';
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
  const venue = isHome ? 'The Park, Henllys Way, Cwmbran, NP44 6PE' : `Away - ${opponent}`;

  const summary = `${fixture.homeTeam} vs ${fixture.awayTeam}`;
  const description = `${fixture.competition}\\n\\n${isHome ? 'HOME' : 'AWAY'} match`;

  const uid = `fixture-${fixture.matchId}@cwmbranceltic.com`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cwmbran Celtic AFC//Fixtures//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatDateForICal(new Date())}
DTSTART:${formatDateForICal(startDate)}
DTEND:${formatDateForICal(endDate)}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${venue}
END:VEVENT
END:VCALENDAR`;
}

/**
 * Generate a Google Calendar URL for a fixture
 */
export function generateGoogleCalendarUrl(fixture: Fixture): string {
  const startDate = new Date(fixture.date);
  const [hours, minutes] = fixture.time.split(':').map(Number);
  startDate.setHours(hours || 15, minutes || 0, 0, 0);

  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatDateForGoogle = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const isHome = fixture.homeAway === 'H';
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
  const venue = isHome ? 'The Park, Henllys Way, Cwmbran, NP44 6PE' : `Away - ${opponent}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
    dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
    details: `${fixture.competition}\n\n${isHome ? 'HOME' : 'AWAY'} match`,
    location: venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate an Outlook Calendar URL for a fixture
 */
export function generateOutlookCalendarUrl(fixture: Fixture): string {
  const startDate = new Date(fixture.date);
  const [hours, minutes] = fixture.time.split(':').map(Number);
  startDate.setHours(hours || 15, minutes || 0, 0, 0);

  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const isHome = fixture.homeAway === 'H';
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
  const venue = isHome ? 'The Park, Henllys Way, Cwmbran, NP44 6PE' : `Away - ${opponent}`;

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: `${fixture.competition}\n\n${isHome ? 'HOME' : 'AWAY'} match`,
    location: venue,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
