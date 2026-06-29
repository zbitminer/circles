import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, parseISO } from 'date-fns';

const CAUSE_COLORS = {
  'Companionship': '#e8a87c',
  'Food': '#f4d35e',
  'Home': '#a8dadc',
  'Skills Sharing': '#e0a3c0',
  'Technology': '#a3b8e0',
  'Transportation': '#9bcfb4',
  'Other': '#cbb5a0',
};

export default function ProfileCalendar({ userId }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [allEvents, hourLogs] = await Promise.all([
          base44.entities.Event.list('-date', 100),
          base44.entities.HourLog.filter({ user_id: userId }),
        ]);
        // Only events the user is attending
        setEvents(allEvents.filter(e => e.attendees?.includes(userId)));
        setLogs(hourLogs);
      } catch {
        // ignore
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Build a map of date -> items
  const dateMap = {};
  const addDateItem = (dateStr, item) => {
    const key = format(parseISO(dateStr), 'yyyy-MM-dd');
    if (!dateMap[key]) dateMap[key] = [];
    dateMap[key].push(item);
  };
  events.forEach(e => { if (e.date) addDateItem(e.date, { type: 'event', title: e.title, location: e.location, cause: e.cause_category }); });
  logs.forEach(l => { if (l.date) addDateItem(l.date, { type: 'log', title: l.activity_name, hours: l.hours, cause: l.cause_category }); });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedItems = selectedDate ? (dateMap[format(selectedDate, 'yyyy-MM-dd')] || []) : [];

  return (
    <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold" style={{ color: '#1A2744' }}>My Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-2 rounded-lg transition-colors hover:bg-black/5" style={{ color: '#1A2744' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold min-w-[120px] text-center" style={{ color: '#1A2744' }}>{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg transition-colors hover:bg-black/5" style={{ color: '#1A2744' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: '#6b5c3e' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd');
          const items = dateMap[key] || [];
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          return (
            <button
              key={key}
              onClick={() => setSelectedDate(day)}
              className="h-14 rounded-lg p-1.5 flex flex-col items-center justify-start transition-all text-left"
              style={
                isSelected
                  ? { background: '#1A2744', color: '#F5E6C0' }
                  : items.length > 0
                    ? { background: '#f0e8d0', border: '1px solid #d4b97a' }
                    : { background: 'transparent', border: '1px solid #e5dcc4' }
              }
            >
              <span className="text-xs font-medium">{format(day, 'd')}</span>
              {items.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                  {items.slice(0, 3).map((item, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? '#F5E6C0' : (CAUSE_COLORS[item.cause] || '#C9A84C') }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: '#6b5c3e' }}>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#1A2744' }} /> Event</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#C9A84C' }} /> Hours Logged</span>
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="mt-4 p-4 rounded-xl" style={{ background: '#f0e8d0', border: '1px solid #d4b97a' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#1A2744' }}>{format(selectedDate, 'EEEE, MMM d, yyyy')}</p>
          {selectedItems.length === 0 ? (
            <p className="text-xs" style={{ color: '#6b5c3e' }}>Nothing scheduled for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: CAUSE_COLORS[item.cause] || '#C9A84C' }}>
                    {item.type === 'event' ? <Calendar className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: '#1A2744' }}>{item.title}</p>
                    <p className="text-xs" style={{ color: '#6b5c3e' }}>
                      {item.type === 'event' ? (item.location ? `📍 ${item.location}` : 'Event') : `${item.hours}h logged`}
                      {item.cause && ` · ${item.cause}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}