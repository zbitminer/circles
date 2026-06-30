import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Users, Plus, X, Star } from 'lucide-react';
import LocationMap from '@/components/LocationMap';
import { format, isFuture } from 'date-fns';

export default function ShabbatMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: '', location: '', seats_available: 4, dietary_options: '', description: '', is_holiday: false, holiday_name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadMeals();
  }, []);

  const loadMeals = async () => {
    setLoading(true);
    const data = await base44.entities.ShabbatMeal.list('-date', 100);
    setMeals(data.filter(m => m.status !== 'cancelled'));
    setLoading(false);
  };

  const upcoming = meals.filter(m => m.date && isFuture(new Date(m.date)));
  const displayed = (tab === 'mine' ? upcoming.filter(m => m.host_id === user?.id) : upcoming);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ShabbatMeal.create({ ...form, seats_available: Number(form.seats_available), host_id: user.id, host_name: user.full_name, guests: [], status: 'open' });
    setForm({ date: '', location: '', seats_available: 4, dietary_options: '', description: '', is_holiday: false, holiday_name: '' });
    setShowForm(false);
    setSubmitting(false);
    loadMeals();
  };

  const handleJoin = async (meal) => {
    if (!user) return;
    const isGuest = meal.guests?.includes(user.id);
    const guests = isGuest ? meal.guests.filter(id => id !== user.id) : [...(meal.guests || []), user.id];
    const isFull = !isGuest && guests.length >= meal.seats_available;
    await base44.entities.ShabbatMeal.update(meal.id, { guests, status: isFull ? 'full' : 'open' });
    loadMeals();
    setSelected(prev => prev ? { ...prev, guests } : prev);
  };

  const spotsLeft = (meal) => meal.seats_available - (meal.guests?.length || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '2px solid #C9A84C' }}>
        <div className="relative h-48 md:h-64">
          <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/19b6f1ee7_generated_image.png" alt="Shabbat table" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,39,68,0.9) 0%, rgba(26,39,68,0.4) 100%)' }} />
          <div className="absolute inset-0 flex items-end p-6">
            <div className="flex-1">
              <div className="text-3xl mb-2">🕯️</div>
              <h1 className="font-display text-2xl md:text-3xl font-bold" style={{ color: '#F5E6C0' }}>Shabbat & Holiday Meals</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(245,230,192,0.80)' }}>Open your home — share a meal, build community</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-colors" style={{ background: '#C9A84C', color: '#1A2744' }}>
              <Plus className="w-4 h-4" /> Host a Meal
            </button>
          </div>
        </div>
      </div>

      {/* Intro quote */}
      <div className="rounded-2xl p-6 mb-6 text-center italic" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <p className="text-lg font-medium" style={{ color: '#1A2744' }}>"The table is not just for eating—it is the place where community is built."</p>
        <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
          For many in our community—students, new immigrants, singles, and elderly neighbors—spending Shabbat alone can feel isolating.
          Our <strong>Shabbat & Holidays Initiative</strong> connects hosts who have an extra seat with guests who are looking for a place to belong.
        </p>
      </div>

      {/* Host / Guest CTA cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1A2744', border: '1.5px solid #C9A84C' }}>
          <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/a7ca42b49_generated_image.png" alt="Communal Shabbat dinner" className="w-full h-36 object-cover" />
          <div className="p-6">
            <div className="text-3xl mb-3">🪑</div>
            <h3 className="font-display text-lg font-bold mb-2 text-white">Are You a Host?</h3>
            <ul className="text-sm space-y-1.5 mb-4" style={{ color: 'rgba(245,230,192,0.85)' }}>
              <li>• Host an individual or a small family</li>
              <li>• Create a lasting bond with someone in your neighborhood</li>
              <li>• Help us fight the epidemic of loneliness in our city</li>
            </ul>
            <button onClick={() => { setShowForm(true); setTimeout(() => document.getElementById('host-form')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#C9A84C', color: '#1A2744' }}>
              I Want to Host
            </button>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/17fdc762b_generated_image.png" alt="Passover Seder gathering" className="w-full h-36 object-cover" />
          <div className="p-6">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#1A2744' }}>Looking for a Meal?</h3>
            <ul className="text-sm space-y-1.5 mb-4" style={{ color: '#6b5c3e' }}>
              <li>• Experience the warmth of a local Shabbat</li>
              <li>• Meet new people and become part of our community</li>
              <li>• 100% confidential and free of charge</li>
            </ul>
            <button onClick={() => document.getElementById('meals-list')?.scrollIntoView({ behavior: 'smooth' })} className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
              I Want to Join a Meal
            </button>
          </div>
        </div>
      </div>

      {/* Shabbat in the North */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 h-48 md:h-auto">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/3afd644ca_generated_image.png" alt="Holiday celebration" className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-3 p-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">🌍</span>
              <div>
                <h3 className="font-display text-lg font-bold" style={{ color: '#1A2744' }}>Shabbat in the North</h3>
                <p className="text-sm mt-1" style={{ color: '#6b5c3e' }}>
                  Our initiative is especially active in <strong style={{ color: '#1A2744' }}>Safed and the Upper Galilee</strong>. Our Shabbat tables have become a vital source of comfort and normalcy for displaced families and those feeling the weight of the current situation.
                </p>
              </div>
            </div>
            <blockquote className="border-l-4 pl-4 text-sm italic mt-3" style={{ borderColor: '#C9A84C', color: '#6b5c3e' }}>
              "Opening my door to a displaced family reminded me of why we call this place home. The table becomes a sanctuary." — <strong>Sarah, Safed</strong>
            </blockquote>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#1A2744' }}>💡 Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            { q: 'Is there a cost?', a: 'No, all Shabbat and holiday meal connections are provided free of charge through the generosity of our donors and volunteers.' },
            { q: 'Can I host if I\'m not a regular?', a: 'Absolutely! Our tables are diverse and inclusive. We welcome everyone who wants to participate in this beautiful tradition.' },
            { q: 'How do you handle dietary requirements?', a: 'When you sign up, simply note your preferences or requirements, and we will do our best to find a perfect match.' },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="font-semibold text-sm" style={{ color: '#1A2744' }}>Q: {q}</p>
              <p className="text-sm mt-1" style={{ color: '#6b5c3e' }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {[
          { icon: '🏠', title: 'Host a Meal', desc: 'Open your home for Shabbat or a holiday. List your date, location, and how many guests you can welcome.' },
          { icon: '🙋', title: 'Join a Table', desc: 'Browse upcoming meals nearby, RSVP with one click, and show up ready to connect with your community.' },
          { icon: '✨', title: 'Build Community', desc: 'Whether you\'re new in town, a lone soldier, or simply looking for connection — every table is a circle of belonging.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="rounded-2xl p-4 text-center" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A2744' }}>{title}</h3>
            <p className="text-xs" style={{ color: '#6b5c3e' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      {!loading && upcoming.length > 0 && (
        <div className="mb-6">
          <LocationMap items={upcoming} onSelectItem={setSelected} labelKey="host_name" locationKey="location" />
        </div>
      )}

      {/* Create Form — not signed in */}
      {showForm && !user && (
        <div id="host-form" className="rounded-2xl p-6 mb-6 text-center" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="text-3xl mb-2">🔐</div>
          <h3 className="font-semibold mb-1" style={{ color: '#1A2744' }}>Sign in to host a meal</h3>
          <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>You need to be signed in to list a Shabbat or holiday meal.</p>
          <a href="/login" className="inline-block px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>Sign In</a>
        </div>
      )}
      {showForm && user && (
        <div id="host-form" className="rounded-2xl p-6 mb-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold" style={{ color: '#1A2744' }}>Host a Shabbat or Holiday Meal</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5" style={{ color: '#6b5c3e' }} /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Date *</label>
              <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Location *</label>
              <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="City or neighborhood" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Available Seats *</label>
              <input required type="number" min="1" max="20" value={form.seats_available} onChange={e => setForm({ ...form, seats_available: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Dietary Options</label>
              <input value={form.dietary_options} onChange={e => setForm({ ...form, dietary_options: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Kosher, vegetarian-friendly" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Description</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Tell guests what to expect..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isHoliday" checked={form.is_holiday} onChange={e => setForm({ ...form, is_holiday: e.target.checked })} className="rounded" />
              <label htmlFor="isHoliday" className="text-sm" style={{ color: '#1A2744' }}>This is a holiday meal</label>
            </div>
            {form.is_holiday && (
              <div>
                <input value={form.holiday_name} onChange={e => setForm({ ...form, holiday_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Holiday name (e.g. Rosh Hashana)" />
              </div>
            )}
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm" style={{ color: '#6b5c3e' }}>Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#C9A84C', color: '#1A2744' }}>
                {submitting ? 'Creating...' : '🕯️ List My Meal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div id="meals-list" className="flex gap-1 rounded-xl p-1 mb-5 w-fit" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
        <button onClick={() => setTab('all')} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={tab === 'all' ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#6b5c3e' }}>All Meals</button>
        {user && <button onClick={() => setTab('mine')} className="px-4 py-2 rounded-lg text-sm font-medium transition-all" style={tab === 'mine' ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#6b5c3e' }}>My Hosted Meals</button>}
      </div>

      {/* Meals grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="rounded-2xl h-40 animate-pulse" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }} />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="text-5xl mb-4">🕯️</div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>No upcoming meals</h3>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>Be the first to open your home!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map(meal => {
            const spots = spotsLeft(meal);
            const isGuest = user && meal.guests?.includes(user.id);
            return (
              <div key={meal.id} onClick={() => setSelected(meal)} className="p-5 cursor-pointer hover:shadow-xl transition-all group" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{meal.is_holiday ? '✨' : '🕯️'}</span>
                    {meal.is_holiday && meal.holiday_name && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(201,168,76,0.20)', color: '#8a6a10' }}>{meal.holiday_name}</span>
                    )}
                  </div>
                  {isGuest && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Joined</span>}
                </div>
                <h3 className="font-semibold mb-1 group-hover:opacity-75 transition-opacity" style={{ color: '#1A2744' }}>Hosted by {meal.host_name}</h3>
                {meal.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: '#6b5c3e' }}>{meal.description}</p>}
                <div className="space-y-1.5 text-xs" style={{ color: '#888' }}>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />{format(new Date(meal.date), 'EEEE, MMMM d, yyyy')}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />{meal.location}</div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
                    {spots > 0 ? <span className="text-green-700 font-medium">{spots} spot{spots !== 1 ? 's' : ''} left</span> : <span className="text-red-600 font-medium">Full</span>}
                  </div>
                </div>
                {meal.dietary_options && <p className="text-xs mt-2 italic" style={{ color: '#888' }}>{meal.dietary_options}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-md w-full p-6 shadow-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{selected.is_holiday ? '✨' : '🕯️'}</div>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5" style={{ color: '#6b5c3e' }} /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#1A2744' }}>Hosted by {selected.host_name}</h2>
            {selected.is_holiday && selected.holiday_name && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(201,168,76,0.20)', color: '#8a6a10' }}>{selected.holiday_name} Meal</span>
            )}
            {selected.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: '#6b5c3e' }}>{selected.description}</p>}
            <div className="space-y-2 my-4 text-sm">
              <div className="flex items-center gap-2" style={{ color: '#555' }}><Calendar className="w-4 h-4" style={{ color: '#C9A84C' }} />{format(new Date(selected.date), 'EEEE, MMMM d, yyyy')}</div>
              <div className="flex items-center gap-2" style={{ color: '#555' }}><MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} />{selected.location}</div>
              <div className="flex items-center gap-2" style={{ color: '#555' }}><Users className="w-4 h-4" style={{ color: '#C9A84C' }} />{spotsLeft(selected)} of {selected.seats_available} spots remaining</div>
              {selected.dietary_options && <div className="flex items-center gap-2" style={{ color: '#555' }}><Star className="w-4 h-4" style={{ color: '#C9A84C' }} />{selected.dietary_options}</div>}
            </div>
            {user ? (
              <button onClick={() => handleJoin(selected)} disabled={spotsLeft(selected) === 0 && !selected.guests?.includes(user.id)}
                className="w-full py-3 font-semibold rounded-xl transition-all"
                style={
                  selected.guests?.includes(user.id)
                    ? { background: '#f0e8d0', color: '#6b5c3e' }
                    : spotsLeft(selected) === 0
                    ? { background: '#e0d5be', color: '#aaa', cursor: 'not-allowed' }
                    : { background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }
                }>
                {selected.guests?.includes(user.id) ? 'Cancel My RSVP' : spotsLeft(selected) === 0 ? 'No Spots Left' : "I'll Join! 🙏"}
              </button>
            ) : (
              <p className="text-center text-sm" style={{ color: '#6b5c3e' }}>Sign in to join this meal</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}