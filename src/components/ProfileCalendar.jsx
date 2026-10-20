import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Clock, Calendar, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, parseISO, isValid } from 'date-fns';

const CAUSE_COLORS = {
  'Companionship': '#e8a87c',
  'Food': '#f4d35e',
  'Home': '#a8dadc',
  'Skills Sharing': '#e0a3c0',
  'Skill Sharing': '#e0a3c0',
  'Technology': '#a3b8e0',
  'Transportation': '#9bcfb4',
  'Arts & Crafts': '#d97724',
  'Music': '#8b5cf6',
  'Cooking': '#f59e0b',
  'Health & Wellness': '#10b981',
  'Support Groups': '#3b82f6',
  'Shabbat Meal': '#C9A84C',
  'Workshop': '#7c5cbf',
  'Other': '#cbb5a0',
};

function toDateKey(dateStr) {
  if (!dateStr) return null;
  const parsed = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
  if (!isValid(parsed)) return null;
  return format(parsed, 'yyyy-MM-dd');
}

export default function ProfileCalendar({ userId }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rsvpItems, setRsvpItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const [allEvents, allMeals, allWorkshops, hourLogs] = await Promise.all([
          base44.entities.Event.list('-date', 100).catch(() => []),
          base44.entities.ShabbatMeal.list('-date', 100).catch(() => []),
          base44.entities.WorkshopInquiry.list('-created_date', 100).catch(() => []),
          base44.entities.HourLog.filter({ user_id: userId }).catch(() => []),
        ]);

        const myEvents = (allEvents || [])
          .filter(e => e.status !== 'cancelled' && (e.attendees?.includes(userId) || e.created_by_id === userId))
          .map(e => ({
            id: `evt-${e.id}`,
            type: 'event',
            date: e.date,
            title: e.title,
            location: e.location,
            cause: e.cause_category || 'Other',
            badge: e.attendees?.includes(userId) ? 'RSVP’d Event' : 'Hosting Event',
          }));

        const myMeals = (allMeals || [])
          .filter(m => m.status !== 'cancelled' && (m.guests?.includes(userId) || m.host_id === userId || m.created_by_id === userId))
          .map(m => ({
            id: `meal-${m.id}`,
            type: 'event',
            date: m.date,
            title: `${m.holiday_name || 'Shabbat'} Meal with ${m.host_name}`,
            location: m.location,
            cause: 'Shabbat Meal',
            badge: m.guests?.includes(userId) ? 'RSVP’d Meal' : 'Hosting Meal',
          }));

        const myWorkshops = (allWorkshops || [])
          .filter(w => w.workshop_date && w.created_by_id === userId)
          .map(w => ({
            id: `ws-${w.id}`,
            type: 'event',
            date: w.workshop_date,
            title: w.title || `Workshop (${w.workshop_categories?.[0] || 'Community'})`,
            location: w.location || w.city,
            cause: 'Workshop',
            badge: w.inquiry_type === 'lead' ? 'Leading Workshop' : 'Workshop Sign-up',
          }));

        setRsvpItems([...myEvents, ...myMeals, ...myWorkshops]);
        setLogs(hourLogs || []);
      } catch {
        // ignore
      }
    };
    load();
  }, [userId]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dateMap = {};
  const addDateItem = (dateStr, item) => {
    const key = toDateKey(dateStr);
    if (!key) return;
    if (!dateMap[key]) dateMap[key] = [];
    dateMap[key].push(item);
  };

  rsvpItems.forEach(item => addDateItem(item.date, item));
  logs.forEach(l => addDateItem(l.date, { type: 'log', title: l.activity_name, hours: l.hours, cause: l.cause_category }));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedItems = selectedDate ? (dateMap[format(selectedDate, 'yyyy-MM-dd')] || []) : [];

  const sortedRsvps = [...rsvpItems]
    .filter(i => toDateKey(i.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const jumpToItem = (item) => {
    const parsed = parseISO(item.date);
    if (!isValid(parsed)) return;
    setCurrentMonth(parsed);
    setSelectedDate(parsed);
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-xl font-bold" style={{ color: '#1A2744' }}>My Calendar</h2>
          <p className="text-xs" style={{ color: '#6b5c3e' }}>Your RSVP’d events, Shabbat meals, workshops & logged hours</p>
        </div>
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
          const hasEvent = items.some(i => i.type === 'event');
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          return (
            <button
              key={key}
              onClick={() => setSelectedDate(day)}
              className="aspect-square rounded-lg p-1 flex flex-col items-center justify-start transition-all text-left overflow-hidden"
              style={
                isSelected
                  ? { background: '#1A2744', color: '#F5E6C0' }
                  : hasEvent
                  ? { background: 'rgba(217, 119, 36, 0.18)', border: '1.5px solid #d97724', color: '#1A2744' }
                  : items.length > 0
                  ? { background: '#f0e8d0', border: '1px solid #d4b97a', color: '#1A2744' }
                  : { background: 'transparent', border: '1px solid #e5dcc4', color: '#1A2744' }
              }
            >
              <span className="text-xs font-bold">{format(day, 'd')}</span>
              {items.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                    {items.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: isSelected ? '#F5E6C0' : (item.type === 'event' ? '#1A2744' : '#C9A84C') }}
                      />
                    ))}
                  </div>
                  <span className="hidden sm:block text-[9px] leading-tight font-medium truncate w-full text-center mt-0.5">
                    {items[0].title}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs" style={{ color: '#6b5c3e' }}>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: '#1A2744' }} /> RSVP’d Event / Meal / Workshop</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: '#C9A84C' }} /> Hours Logged</span>
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="mt-4 p-4 rounded-xl" style={{ background: '#f0e8d0', border: '1px solid #d4b97a' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#1A2744' }}>{format(selectedDate, 'EEEE, MMM d, yyyy')}</p>
          {selectedItems.length === 0 ? (
            <p className="text-xs" style={{ color: '#6b5c3e' }}>Nothing scheduled for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/70 p-2.5 rounded-lg">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: CAUSE_COLORS[item.cause] || '#1A2744' }}>
                    {item.type === 'event' ? <Calendar className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: '#1A2744' }}>{item.title}</p>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#1A2744', color: '#F5E6C0' }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#6b5c3e' }}>
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

      {/* List of all RSVP'd events across all months so none are hidden */}
      <div className="mt-5 pt-4 border-t" style={{ borderColor: '#d4b97a' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#1A2744' }}>
          My RSVP’d & Scheduled Activities ({sortedRsvps.length})
        </h3>
        {sortedRsvps.length === 0 ? (
          <p className="text-xs" style={{ color: '#6b5c3e' }}>
            You haven’t RSVP’d to any events or meals yet. Tap "RSVP" on any event in the Events page to add it here.
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {sortedRsvps.map((item) => {
              const parsed = parseISO(item.date);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpToItem(item)}
                  className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-left transition-colors hover:bg-black/5"
                  style={{ background: '#fff', border: '1px solid #e5dcc4' }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold truncate" style={{ color: '#1A2744' }}>{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>
                        {item.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] mt-0.5" style={{ color: '#6b5c3e' }}>
                      <span>{isValid(parsed) ? format(parsed, 'MMM d, yyyy') : item.date}</span>
                      {item.location && (
                        <span className="inline-flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3" /> {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#d97724' }}>View →</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}