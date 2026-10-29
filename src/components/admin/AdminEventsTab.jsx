import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, Trash2, MapPin, Users, Plus, Pencil } from 'lucide-react';
import moment from 'moment';
import EditContentDialog from '@/components/content/EditContentDialog';
import { EVENT_TYPE } from '@/components/admin/adminFormTypes';
import ContentPositionControl from '@/components/admin/ContentPositionControl';
import getOrderedContentPage from '@/components/content/getOrderedContentPage';

const STATUS_STYLE = {
  upcoming: 'bg-primary/10 text-primary',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminEventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
    getOrderedContentPage('Event', {}, { limit: 100 }).then(p => p.items).then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const onSaved = (ev) => {
    setEvents((prev) => (prev.some((e) => e.id === ev.id) ? prev.map((e) => (e.id === ev.id ? ev : e)) : [ev, ...prev]));
    setEditing(null);
  };

  const setStatus = async (id, status) => {
    await base44.entities.Event.update(id, { status });
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await base44.entities.Event.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  if (loading) return <div className="animate-pulse h-32 bg-card rounded-2xl border border-border" />;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Events ({events.length})</h2>
        </div>
        <button onClick={() => setEditing({ created_by_name: me?.full_name })} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
          <Plus className="w-4 h-4" /> New event
        </button>
      </div>
      {events.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 text-sm">No events yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {events.map((e) => (
            <div key={e.id} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold break-words">{e.title}</p>
                <ContentPositionControl key={`${e.id}-${e.display_priority || 0}`} entity="Event" item={e} onSaved={async () => setEvents(await getOrderedContentPage('Event', {}, { limit: 100 }).then(p => p.items))} />
                <p className="text-xs text-muted-foreground mt-0.5">{e.date ? moment(e.date).format('MMM D, YYYY · h:mm A') : 'No date'}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{e.attendees?.length || 0}{e.capacity ? `/${e.capacity}` : ''}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={e.status || 'upcoming'}
                  onChange={(ev) => setStatus(e.id, ev.target.value)}
                  className={`text-xs rounded-full px-3 py-2 font-medium outline-none ${STATUS_STYLE[e.status] || STATUS_STYLE.upcoming}`}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => setEditing(e)} aria-label="Edit event" className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(e.id)} aria-label="Delete event" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <EditContentDialog type={EVENT_TYPE} item={editing} title={editing.id ? 'Edit event' : 'New event'} onClose={() => setEditing(null)} onSaved={onSaved} />
      )}
    </div>
  );
}