import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Users, Plus, X, LayoutGrid, CalendarDays, Map } from 'lucide-react';
import EventChat from '@/components/EventChat';
import EventsCalendar from '@/components/EventsCalendar';
import LocationMap from '@/components/LocationMap';
import { format, isPast } from 'date-fns';

const CAUSES = ['All', 'Companionship', 'Food', 'Home Repairs', 'Other', 'Skill Share', 'Technology', 'Transportation'];

const CAUSE_FALLBACK_IMAGES = {
  'Transportation': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
  'Companionship': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  'Food': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
  'Technology': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
  'Home Repairs': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=80',

  'Skill Share': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
  'Other': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [causeFilter, setCauseFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', cause_category: 'Food', capacity: '', image_url: '' });
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
    setForm({ title: '', description: '', date: '', location: '', cause_category: 'Food', capacity: '', image_url: '' });
    setShowForm(false);
    setSubmitting(false);
    loadEvents();
  };

  const isFull = (evt) => evt.capacity && evt.attendees?.length >= evt.capacity;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: '#1A2744' }}>Volunteer Events</h1>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>Discover and RSVP to local and virtual events</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex p-1 gap-1 rounded-lg" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded-lg transition-all"
              style={viewMode === 'grid' ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#1A2744' }}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className="p-2 rounded-lg transition-all"
              style={viewMode === 'calendar' ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#1A2744' }}
              title="Calendar view"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className="p-2 rounded-lg transition-all"
              style={viewMode === 'map' ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#1A2744' }}
              title="Map view"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
          {isMod && (
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
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
      <div className="flex gap-1.5 mb-6 flex-wrap p-3 rounded-xl" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
        {CAUSES.map(c => (
          <button key={c} onClick={() => setCauseFilter(c)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={causeFilter === c
              ? { background: '#1A2744', color: '#F5E6C0', border: '1px solid #1A2744' }
              : { background: '#FAF7EE', color: '#1A2744', border: '1px solid #C9A84C' }
            }>
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
        <div className="text-center py-16 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>No events yet</h3>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>Events will appear here. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(evt => {
            const past = evt.date && isPast(new Date(evt.date));
            const attending = user && evt.attendees?.includes(user.id);
            const full = isFull(evt);
            return (
              <div key={evt.id} onClick={() => setSelected(evt)}
                className="cursor-pointer hover:shadow-xl transition-all group overflow-hidden"
                style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '8px', boxShadow: '0 2px 8px rgba(26,39,68,0.10)' }}>
                {/* Ornate corner accents */}
                <div className="relative">
                  <img
                    src={evt.image_url || CAUSE_FALLBACK_IMAGES[evt.cause_category] || CAUSE_FALLBACK_IMAGES['Other']}
                    alt={evt.title}
                    className="w-full h-36 object-cover"
                  />
                  {/* Corner decorations */}
                  <div className="absolute top-1 left-1 w-5 h-5 pointer-events-none" style={{ borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', borderRadius: '2px 0 0 0' }} />
                  <div className="absolute top-1 right-1 w-5 h-5 pointer-events-none" style={{ borderTop: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', borderRadius: '0 2px 0 0' }} />
                </div>
                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#C9A84C' }}>{evt.cause_category}</span>
                    {past && <span className="text-xs" style={{ color: '#aaa' }}>Past event</span>}
                    {attending && !past && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#C9A84C', color: '#fff' }}>✓ Going</span>}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 group-hover:opacity-80 transition-opacity" style={{ color: '#1A2744' }}>{evt.title}</h3>
                </div>
                <div className="px-4 pb-4 space-y-1.5">
                  {evt.date && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#555' }}>
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                      {format(new Date(evt.date), 'EEE, MMM d, yyyy · h:mm a')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#555' }}>
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                    {evt.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#555' }}>
                    <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                    {evt.attendees?.length || 0} attending
                    {evt.capacity && <span>· {evt.capacity} max</span>}
                    {full && <span className="font-medium" style={{ color: '#C9A84C' }}>· Full</span>}
                  </div>
                </div>
                {/* Bottom corner accents */}
                <div className="relative h-0">
                  <div className="absolute bottom-2 left-1 w-5 h-5 pointer-events-none" style={{ borderBottom: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', borderRadius: '0 0 0 2px' }} />
                  <div className="absolute bottom-2 right-1 w-5 h-5 pointer-events-none" style={{ borderBottom: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', borderRadius: '0 0 2px 0' }} />
                </div>
              </div>
            );
          })}
            </div>
          </div>

          {/* Right: sticky map */}
          {filtered.length > 0 && (
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-20 rounded-2xl overflow-hidden" style={{ border: '1px solid #e0e0e0', height: 'calc(100vh - 6rem)' }}>
                <LocationMap items={filtered} onSelectItem={setSelected} labelKey="title" locationKey="location" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Past Events Section */}
      {!loading && viewMode === 'grid' && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>Past Events</h2>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#FAF7EE', color: '#6b5c3e', border: '1px solid #C9A84C' }}>From Our History</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Rosh Hashana Community Meal',
                date: 'September 2024',
                location: 'Safed Community Center',
                category: 'Food',
                description: 'Over 120 community members — including lone soldiers, new immigrants, and elderly neighbors — shared a festive holiday meal together.',
                attendees: 120,
                image: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/dde20d403_generated_image.png',
                highlight: true,
              },
              {
                title: 'Tech Support Day for Seniors',
                date: 'August 2024',
                location: 'Haifa, Northern District',
                category: 'Technology',
                description: 'Volunteers helped 45 elderly residents set up smartphones, WhatsApp, and video calls to stay connected with family.',
                attendees: 45,
                image: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/ea33792bf_generated_image.png',
              },
              {
                title: 'Emergency Food Drive — Gaza Border Communities',
                date: 'November 2023',
                location: 'Northern Israel',
                category: 'Food',
                description: 'Circles of Giving mobilized 80+ volunteers to pack and deliver food parcels to families displaced from the Gaza border region.',
                attendees: 83,
                image: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/42134c836_generated_image.png',
                highlight: true,
              },
              {
                title: 'Loneliness Awareness Walk',
                date: 'July 2024',
                location: 'Tiberias Promenade',
                category: 'Companionship',
                description: 'A community walk raising awareness about senior loneliness, followed by paired conversations between volunteers and elderly residents.',
                attendees: 60,
                image: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/e71f86894_generated_image.png',
              },
              {
                title: 'Home Repair Day for Bereaved Families',
                date: 'May 2024',
                location: 'Upper Galilee',
                category: 'Home Repairs',
                description: 'Skilled volunteers spent the day making repairs and improvements to the homes of families who lost loved ones in the war.',
                attendees: 32,
                image: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/d638227b5_generated_image.png',
              },
            ].map((evt) => (
              <div key={evt.title} className="overflow-hidden" style={{ background: '#FAF7EE', border: `1.5px solid ${evt.highlight ? '#C9A84C' : '#d4b97a'}`, borderRadius: '8px', boxShadow: '0 2px 6px rgba(26,39,68,0.08)' }}>
                <img src={evt.image} alt={evt.title} className="w-full h-36 object-cover" />
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#C9A84C' }}>{evt.category}</span>
                    <span className="text-xs" style={{ color: '#888' }}>{evt.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-1" style={{ color: '#1A2744' }}>{evt.title}</h3>
                  <p className="text-xs line-clamp-2 mb-2" style={{ color: '#6b5c3e' }}>{evt.description}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#888' }}>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: '#C9A84C' }} />{evt.location}</div>
                    <div className="flex items-center gap-1"><Users className="w-3 h-3" style={{ color: '#C9A84C' }} />{evt.attendees} attended</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-lg w-full shadow-2xl overflow-hidden" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <img
              src={selected.image_url || CAUSE_FALLBACK_IMAGES[selected.cause_category] || CAUSE_FALLBACK_IMAGES['Other']}
              alt={selected.title}
              className="w-full h-48 object-cover"
            />
            <div className="px-6 py-5" style={{ background: '#1A2744', borderBottom: '1px solid #C9A84C' }}>
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#C9A84C' }}>{selected.cause_category}</span>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4" style={{ color: '#F5E6C0' }} /></button>
              </div>
              <h2 className="font-display text-2xl font-bold mt-2" style={{ color: '#F5E6C0' }}>{selected.title}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-4">
                {selected.date && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#444' }}><Calendar className="w-4 h-4" style={{ color: '#C9A84C' }} />{format(new Date(selected.date), 'EEEE, MMMM d, yyyy · h:mm a')}</div>
                )}
                <div className="flex items-center gap-2 text-sm" style={{ color: '#444' }}><MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} />{selected.location}</div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#444' }}>
                  <Users className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  {selected.attendees?.length || 0} attending
                  {selected.capacity && ` · ${selected.capacity} max capacity`}
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b5c3e' }}>{selected.description}</p>

              {isMod && selected.attendees?.length > 0 && (
                <div className="rounded-xl p-4 mb-4" style={{ background: '#f0e8d0' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#6b5c3e' }}>Attendee Count: {selected.attendees.length}</p>
                </div>
              )}

              {user ? (
                <button
                  onClick={() => handleRSVP(selected)}
                  disabled={isFull(selected) && !selected.attendees?.includes(user.id)}
                  className="w-full py-3 font-semibold rounded-xl transition-all"
                  style={
                    selected.attendees?.includes(user.id)
                      ? { background: '#f0e8d0', color: '#6b5c3e' }
                      : isFull(selected)
                      ? { background: '#e0d5be', color: '#aaa', cursor: 'not-allowed' }
                      : { background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }
                  }
                >
                  {selected.attendees?.includes(user.id) ? '✓ Cancel RSVP' : isFull(selected) ? 'Event is Full' : "RSVP — I'll Be There!"}
                </button>
              ) : (
                <p className="text-center text-sm" style={{ color: '#6b5c3e' }}>Sign in to RSVP</p>
              )}

              <EventChat eventId={selected.id} currentUser={user} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}