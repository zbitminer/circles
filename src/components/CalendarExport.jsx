import React from 'react';
import { Calendar, Download } from 'lucide-react';

/**
 * Generates and downloads an .ics calendar file for an event.
 */
export default function CalendarExport({ event }) {
  if (!event?.date) return null;

  const downloadICS = () => {
    const dt = new Date(event.date);
    if (isNaN(dt.getTime())) return;

    const pad = (n) => String(n).padStart(2, '0');
    const formatICS = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const start = formatICS(dt);
    const end = formatICS(new Date(dt.getTime() + 2 * 60 * 60 * 1000)); // 2h default
    const uid = `${event.id}@circlesofgiving`;
    const now = formatICS(new Date());

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Circles of Giving//Event//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title || 'Community Event'}`,
      `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(event.title || 'event').replace(/[^a-z0-9]/gi, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadICS}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-primary/10"
      style={{ color: '#C9A84C' }}
      title="Add to your calendar"
    >
      <Download className="w-3.5 h-3.5" />
      Add to Calendar
    </button>
  );
}