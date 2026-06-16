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
  const [tab, setTab] = useState('all'); // 'all' | 'mine'

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
    await base44.entities.ShabbatMeal.create({
      ...form,
      seats_available: Number(form.seats_available),
      host_id: user.id,
      host_name: user.full_name,
      guests: [],
      status: 'open',
    });
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
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl mb-2">🕯️</div>
            <h1 className="font-display text-2xl font-bold">Shabbat & Holiday Meals</h1>
            <p className="text-white/80 text-sm mt-1">Open your home — share a meal, build community</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-white text-amber-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-amber-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Host a Meal
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🏠</div>
          <h3 className="font-semibold text-sm text-amber-900 mb-1">Host a Meal</h3>
          <p className="text-xs text-amber-700">Open your home for Shabbat or a holiday. List your date, location, and how many guests you can welcome.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🙋</div>
          <h3 className="font-semibold text-sm text-amber-900 mb-1">Join a Table</h3>
          <p className="text-xs text-amber-700">Browse upcoming meals nearby, RSVP with one click, and show up ready to connect with your community.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">✨</div>
          <h3 className="font-semibold text-sm text-amber-900 mb-1">Build Community</h3>
          <p className="text-xs text-amber-700">Whether you're new in town, a lone soldier, or simply looking for connection — every table is a circle of belonging.</p>
        </div>
      </div>

      {/* Map */}
      {!loading && upcoming.length > 0 && (
        <div className="mb-6">
          <LocationMap items={upcoming} onSelectItem={setSelected} labelKey="host_name" locationKey="location" />
        </div>
      )}

      {/* Create Form */}
      {showForm && user && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Host a Shabbat Meal</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Date *</label>
              <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Location *</label>
              <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="City or neighborhood" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Available Seats *</label>
              <input required type="number" min="1" max="20" value={form.seats_available} onChange={e => setForm({ ...form, seats_available: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Dietary Options</label>
              <input value={form.dietary_options} onChange={e => setForm({ ...form, dietary_options: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Kosher, vegetarian-friendly" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Tell guests what to expect..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isHoliday" checked={form.is_holiday} onChange={e => setForm({ ...form, is_holiday: e.target.checked })} className="rounded" />
              <label htmlFor="isHoliday" className="text-sm">This is a holiday meal</label>
            </div>
            {form.is_holiday && (
              <div>
                <input value={form.holiday_name} onChange={e => setForm({ ...form, holiday_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Holiday name (e.g. Rosh Hashana)" />
              </div>
            )}
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-muted-foreground">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Creating...' : '🕯️ List My Meal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5 w-fit">
        <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'all' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>All Meals</button>
        {user && <button onClick={() => setTab('mine')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'mine' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>My Hosted Meals</button>}
      </div>

      {/* Meals grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-card rounded-2xl border border-border h-40 animate-pulse" />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <div className="text-5xl mb-4">🕯️</div>
          <h3 className="font-display text-xl font-bold mb-2">No upcoming meals</h3>
          <p className="text-muted-foreground text-sm">Be the first to open your home!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map(meal => {
            const spots = spotsLeft(meal);
            const isGuest = user && meal.guests?.includes(user.id);
            return (
              <div key={meal.id} onClick={() => setSelected(meal)} className="bg-card rounded-2xl border border-border p-5 cursor-pointer hover:shadow-md hover:border-amber-200 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{meal.is_holiday ? '✨' : '🕯️'}</span>
                    {meal.is_holiday && meal.holiday_name && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">{meal.holiday_name}</span>
                    )}
                  </div>
                  {isGuest && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Joined</span>}
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-amber-600 transition-colors">Hosted by {meal.host_name}</h3>
                {meal.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{meal.description}</p>}
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{format(new Date(meal.date), 'EEEE, MMMM d, yyyy')}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{meal.location}</div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {spots > 0 ? <span className="text-green-700 font-medium">{spots} spot{spots !== 1 ? 's' : ''} left</span> : <span className="text-red-600 font-medium">Full</span>}
                  </div>
                </div>
                {meal.dietary_options && <p className="text-xs text-muted-foreground mt-2 italic">{meal.dietary_options}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{selected.is_holiday ? '✨' : '🕯️'}</div>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">Hosted by {selected.host_name}</h2>
            {selected.is_holiday && selected.holiday_name && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">{selected.holiday_name} Meal</span>
            )}
            {selected.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{selected.description}</p>}
            <div className="space-y-2 my-4 text-sm">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500" />{format(new Date(selected.date), 'EEEE, MMMM d, yyyy')}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" />{selected.location}</div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-amber-500" />{spotsLeft(selected)} of {selected.seats_available} spots remaining</div>
              {selected.dietary_options && <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" />{selected.dietary_options}</div>}
            </div>
            {user ? (
              <button
                onClick={() => handleJoin(selected)}
                disabled={spotsLeft(selected) === 0 && !selected.guests?.includes(user.id)}
                className={`w-full py-3 font-semibold rounded-xl transition-all ${
                  selected.guests?.includes(user.id)
                    ? 'bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-600'
                    : spotsLeft(selected) === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-amber-500 text-white hover:opacity-90'
                }`}
              >
                {selected.guests?.includes(user.id) ? 'Cancel My RSVP' : spotsLeft(selected) === 0 ? 'No Spots Left' : "I'll Join! 🙏"}
              </button>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Sign in to join this meal</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}