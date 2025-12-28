export function generateICSFile(): string {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(9, 0, 0, 0);
  
  // Format date for ICS: YYYYMMDDTHHMMSS
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 8);

  const uid = `nivo-daily-${Date.now()}@nivo.app`;
  const dtstamp = formatDate(now);
  const dtstart = formatDate(startDate);
  const dtend = formatDate(endDate);

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NIVO//Daily Loop//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
RRULE:FREQ=DAILY
SUMMARY:NIVO - Daily Loop (8 min)
DESCRIPTION:Lien vers la session : https://nivo.app/dashboard\\n\\nVotre routine quotidienne NIVO vous attend !
LOCATION:https://nivo.app/dashboard
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT5M
ACTION:DISPLAY
DESCRIPTION:NIVO - Il est temps de faire votre routine !
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

export function downloadICSFile(): void {
  const icsContent = generateICSFile();
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'NIVO_Daily_Loop.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
