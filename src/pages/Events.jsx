import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Users, Plus, X, LayoutGrid, CalendarDays, Map } from 'lucide-react';
import EventChat from '@/components/EventChat';
import EventsCalendar from '@/components/EventsCalendar';
import LocationMap from '@/components/LocationMap';
import { format, isPast } from 'date-fns';

const CAUSES = ['All', 'Environment', 'Education', 'Health', 'Animals', 'Community', 'Elderly', 'Youth', 'Disaster Relief', 'Arts & Culture', 'Other'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [causeFilter, setCauseFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', cause_category: 'Community', capacity: '', image_url: '' });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'calendar' | 'map'

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await base44.entities.Event.list('-date', 100);
    setEvents(data.filter(e => e.status !== 'cancelled'));
    setLoading(false);
  };

  const filtered = events.filter(e =>
    causeFilter === 'All' || e.cause_category === causeFilter
  );

  const isMod = user?.role === 'moderator' || user?.role === 'admin';

  const handleRSVP = async (evt) => {
    if (!user) return;
    const isAttending = evt.attendees?.includes(user.id);
    const attendees = isAttending
      ? evt.attendees.filter(id => id !== user.id)
      : [...(evt.attendees || []), user.id];
    await base44.entities.Event.update(evt.id, { attendees });
    loadEvents();
    setSelected(prev => prev ? { ...prev, attendees } : prev);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Event.create({
      ...form,
      capacity: form.capacity ? Number(form.capacity) : null,
      attendees: [],
      created_by_name: user?.full_name,
      status: 'upcoming',
    });
    setForm({ title: '', description: '', date: '', location: '', cause_category: 'Community', capacity: '', image_url: '' });
    setShowForm(false);
    setSubmitting(false);
    loadEvents();
  };

  const isFull = (evt) => evt.capacity && evt.attendees?.length >= evt.capacity;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Volunteer Events</h1>
          <p className="text-muted-foreground text-sm">Discover and RSVP to local and virtual events</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-muted rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Calendar view"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Map view"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
          {isMod && (
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Create Event
            </button>
          )}
        </div>
      </div>

      {/* Create Form */}
      {showForm && isMod && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl font-bold mb-4">New Event</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Event Title *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Community Garden Day" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Description *</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="What will volunteers do?" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Date & Time *</label>
              <input required type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Location *</label>
              <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Address or Virtual" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Cause Category</label>
              <select value={form.cause_category} onChange={e => setForm({...form, cause_category: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {CAUSES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Capacity (optional)</label>
              <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Max attendees" min="1" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Event Image (optional)</label>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" className="text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImg(true);
                    const { file_url } = await base44.integrations.Core.UploadFile({ file });
                    setForm(f => ({ ...f, image_url: file_url }));
                    setUploadingImg(false);
                  }}
                />
                {uploadingImg && <span className="text-xs text-muted-foreground">Uploading...</span>}
                {form.image_url && <img src={form.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={submitting || uploadingImg} className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cause filters */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 flex-wrap">
        {CAUSES.map(c => (
          <button key={c} onClick={() => setCauseFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${causeFilter === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Events — Calendar or Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-card rounded-2xl border border-border animate-pulse h-48" />)}
        </div>
      ) : viewMode === 'calendar' ? (
        <EventsCalendar
          events={filtered}
          currentUser={user}
          onSelectEvent={setSelected}
        />
      ) : viewMode === 'map' ? (
        <LocationMap items={filtered} onSelectItem={setSelected} labelKey="title" locationKey="location" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-display text-xl font-bold mb-2">No events yet</h3>
          <p className="text-muted-foreground text-sm">Events will appear here. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(evt => {
            const past = evt.date && isPast(new Date(evt.date));
            const attending = user && evt.attendees?.includes(user.id);
            const full = isFull(evt);
            return (
              <div key={evt.id} onClick={() => setSelected(evt)}
                className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group">
                {evt.image_url ? (
                  <img src={evt.image_url} alt={evt.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-24 bg-primary/10 flex items-center justify-center text-4xl">📅</div>
                )}
                <div className="bg-primary px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-accent font-semibold uppercase tracking-wide">{evt.cause_category}</span>
                    {past && <span className="text-xs text-primary-foreground/50">Past event</span>}
                    {attending && !past && <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">✓ Going</span>}
                  </div>
                  <h3 className="font-display font-bold text-primary-foreground text-lg group-hover:text-accent transition-colors">{evt.title}</h3>
                </div>
                <div className="p-5 space-y-2">
                  {evt.date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      {format(new Date(evt.date), 'EEE, MMM d, yyyy · h:mm a')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {evt.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    {evt.attendees?.length || 0} attending
                    {evt.capacity && <span>· {evt.capacity} max</span>}
                    {full && <span className="text-accent font-medium">· Full</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {selected.image_url && (
              <img src={selected.image_url} alt={selected.title} className="w-full h-48 object-cover" />
            )}
            <div className="bg-primary px-6 py-5">
              <div className="flex items-start justify-between">
                <span className="text-xs text-accent font-semibold uppercase tracking-wide">{selected.cause_category}</span>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4 text-primary-foreground" /></button>
              </div>
              <h2 className="font-display text-2xl font-bold text-primary-foreground mt-2">{selected.title}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-4">
                {selected.date && (
                  <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-accent" />{format(new Date(selected.date), 'EEEE, MMMM d, yyyy · h:mm a')}</div>
                )}
                <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-accent" />{selected.location}</div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-accent" />
                  {selected.attendees?.length || 0} attending
                  {selected.capacity && ` · ${selected.capacity} max capacity`}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{selected.description}</p>

              {isMod && selected.attendees?.length > 0 && (
                <div className="bg-muted rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground">Attendee Count: {selected.attendees.length}</p>
                </div>
              )}

              {user ? (
                <button
                  onClick={() => handleRSVP(selected)}
                  disabled={isFull(selected) && !selected.attendees?.includes(user.id)}
                  className={`w-full py-3 font-semibold rounded-xl transition-all ${
                    selected.attendees?.includes(user.id)
                      ? 'bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                      : isFull(selected)
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-accent text-white hover:opacity-90'
                  }`}
                >
                  {selected.attendees?.includes(user.id) ? '✓ Cancel RSVP' : isFull(selected) ? 'Event is Full' : 'RSVP — I\'ll Be There!'}
                </button>
              ) : (
                <p className="text-center text-sm text-muted-foreground">Sign in to RSVP</p>
              )}

              <EventChat eventId={selected.id} currentUser={user} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}