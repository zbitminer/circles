import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay,
  isToday, format, parseISO,
} from 'date-fns';

const CAUSE_COLORS = {
  'Environment': 'bg-green-500',
  'Education': 'bg-blue-500',
  'Health': 'bg-red-500',
  'Animals': 'bg-yellow-500',
  'Community': 'bg-purple-500',
  'Elderly': 'bg-orange-500',
  'Youth': 'bg-pink-500',
  'Disaster Relief': 'bg-gray-500',
  'Arts & Culture': 'bg-indigo-500',
  'Other': 'bg-teal-500',
};

export default function EventsCalendar({ events = [], currentUser, onSelectEvent }) {
  const [current, setCurrent] = useState(new Date());
  const [hovered, setHovered] = useState(null);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Build array of weeks
  const weeks = [];
  let day = gridStart;
  while (day <= gridEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const eventsOnDay = (d) =>
    events.filter(e => e.date && isSameDay(parseISO(e.date), d));

  const attending = (evt) => currentUser && evt.attendees?.includes(currentUser.id);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => setCurrent(subMonths(current, 1))}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="font-display text-xl font-bold">
          {format(current, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrent(addMonths(current, 1))}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-border last:border-b-0">
            {week.map((d, di) => {
              const dayEvents = eventsOnDay(d);
              const inMonth = isSameMonth(d, current);
              const today = isToday(d);
              return (
                <div
                  key={di}
                  className={`min-h-[56px] p-1 border-r border-border last:border-r-0 ${
                    inMonth ? 'bg-card' : 'bg-muted/30'
                  }`}
                >
                  {/* Date number */}
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-0.5 ${
                    today
                      ? 'bg-primary text-primary-foreground'
                      : inMonth
                      ? 'text-foreground'
                      : 'text-muted-foreground/40'
                  }`}>
                    {format(d, 'd')}
                  </div>

                  {/* Event dots / chips */}
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map(evt => (
                      <button
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        onMouseEnter={() => setHovered(evt.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`relative w-full text-left px-1.5 py-0.5 rounded text-xs font-medium leading-tight truncate transition-all ${
                          attending(evt)
                            ? 'bg-accent/20 text-accent border border-accent/40'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                        title={evt.title}
                      >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0 ${CAUSE_COLORS[evt.cause_category] || 'bg-primary'}`} />
                        <span className="hidden sm:inline">{evt.title}</span>

                        {/* Tooltip on hover */}
                        {hovered === evt.id && (
                          <div className="absolute left-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl p-3 min-w-[200px] text-left pointer-events-none">
                            <p className="font-semibold text-foreground text-xs mb-1">{evt.title}</p>
                            <p className="text-xs text-muted-foreground mb-1">{format(parseISO(evt.date), 'EEE, MMM d · h:mm a')}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />{evt.location}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />{evt.attendees?.length || 0} attending
                            </div>
                            {attending(evt) && (
                              <span className="mt-1 inline-block text-xs text-accent font-semibold">✓ You're going</span>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-xs text-muted-foreground px-1">+{dayEvents.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-border flex flex-wrap gap-3">
        <span className="text-xs text-muted-foreground font-medium">Causes:</span>
        {Object.entries(CAUSE_COLORS).slice(0, 6).map(([cause, color]) => (
          <span key={cause} className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            {cause}
          </span>
        ))}
      </div>
    </div>
  );
}