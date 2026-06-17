import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Heart, MapPin, Clock, User, Plus, X, Search } from 'lucide-react';
import LocationMap from '@/components/LocationMap';

const HEALTH_CATEGORIES = [
  { value: 'medical', label: '🩺 Medical', desc: 'Doctor visits, medications, rehabilitation' },
  { value: 'mental_health', label: '🧠 Mental Health', desc: 'Counseling, emotional support, therapy' },
  { value: 'wellness', label: '🌿 Wellness', desc: 'Nutrition, exercise, preventive care' },
];

const CATEGORY_STYLES = {
  medical: { bg: 'rgba(220,40,40,0.10)', color: '#c0392b', border: '#c0392b' },
  mental_health: { bg: 'rgba(100,80,180,0.10)', color: '#6c5ce7', border: '#6c5ce7' },
  wellness: { bg: 'rgba(39,174,96,0.10)', color: '#27ae60', border: '#27ae60' },
};

const URGENCY_STYLES = {
  high: { bg: 'rgba(220,40,40,0.15)', color: '#c0392b', label: '🔥 Urgent' },
  medium: { bg: 'rgba(243,156,18,0.15)', color: '#d68910', label: '⚠️ Medium' },
  low: { bg: 'rgba(39,174,96,0.15)', color: '#27ae60', label: '✅ Low' },
};

export default function Health() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', contact_name: '', location: '',
    health_category: 'medical', urgency: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await base44.entities.HealthRequest.list('-created_date', 100);
    setRequests(data || []);
    setLoading(false);
  };

  const filtered = requests.filter(r => {
    const matchFilter = filter === 'all' || r.health_category === filter;
    const matchSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.HealthRequest.create({
      ...form,
      status: 'open',
    });
    setForm({ title: '', description: '', contact_name: '', location: '', health_category: 'medical', urgency: 'medium' });
    setShowForm(false);
    setSubmitting(false);
    loadRequests();
  };

  const handleClaim = async (reqId, isCancelling) => {
    if (!user) return;
    await base44.entities.HealthRequest.update(reqId, {
      status: isCancelling ? 'open' : 'claimed',
      claimed_by_id: isCancelling ? null : user.id,
      claimed_by_name: isCancelling ? null : user.full_name,
    });
    loadRequests();
    setSelected(null);
  };

  const handleResolve = async (reqId) => {
    await base44.entities.HealthRequest.update(reqId, { status: 'resolved' });
    loadRequests();
    setSelected(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: 'linear-gradient(135deg, #1A2744, #2d4070)', border: '2px solid #C9A84C' }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-3xl mb-2">❤️</div>
            <h1 className="font-display text-2xl font-bold" style={{ color: '#F5E6C0' }}>Health Support Requests</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(245,230,192,0.80)' }}>
              Medical assistance, mental health support, and wellness guidance — request help or volunteer to assist
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#C9A84C', color: '#1A2744' }}
            >
              <Plus className="w-4 h-4" /> Request Help
            </button>
          )}
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold" style={{ color: '#1A2744' }}>New Health Request</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5" style={{ color: '#6b5c3e' }} /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Need a ride to a doctor's appointment" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Description *</label>
              <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Describe what kind of help you need..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Your Name *</label>
              <input required value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="City or neighborhood" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Category *</label>
              <select required value={form.health_category} onChange={e => setForm({ ...form, health_category: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {HEALTH_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Urgency</label>
              <select value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                <option value="high">🔥 Urgent</option>
                <option value="medium">⚠️ Medium</option>
                <option value="low">✅ Low</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm" style={{ color: '#6b5c3e' }}>Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#C9A84C', color: '#1A2744' }}>
                {submitting ? 'Posting...' : '❤️ Post Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer"
          style={{ background: '#FAF7EE', color: '#1A2744', border: '1px solid #C9A84C' }}>
          <option value="all">All</option>
          {HEALTH_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#aaa' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-muted rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Search requests..." />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
      {/* Requests Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>
            {search ? 'No matching requests' : 'No health requests yet'}
          </h3>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>
            {user ? 'Be the first to post a health support request.' : 'Sign in to post a request.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const catStyle = CATEGORY_STYLES[req.health_category] || CATEGORY_STYLES.medical;
            const urgStyle = URGENCY_STYLES[req.urgency] || URGENCY_STYLES.medium;
            return (
              <div key={req.id} onClick={() => setSelected(req)}
                className="p-5 cursor-pointer hover:shadow-lg transition-all"
                style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` }}>
                        {HEALTH_CATEGORIES.find(c => c.value === req.health_category)?.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: urgStyle.bg, color: urgStyle.color }}>
                        {urgStyle.label}
                      </span>
                      {req.status === 'claimed' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">🤝 Claimed by {req.claimed_by_name}</span>
                      )}
                      {req.status === 'resolved' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">✅ Resolved</span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1" style={{ color: '#1A2744' }}>{req.title}</h3>
                    <p className="text-xs line-clamp-2 mb-2" style={{ color: '#6b5c3e' }}>{req.description}</p>
                    <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: '#888' }}>
                      <div className="flex items-center gap-1"><User className="w-3 h-3" />{req.contact_name}</div>
                      {req.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.location}</div>}
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(req.created_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </div>

        {/* Right: sticky map */}
        {!loading && filtered.length > 0 && (
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-20 rounded-2xl overflow-hidden" style={{ border: '1px solid #e0e0e0', height: 'calc(100vh - 6rem)' }}>
              <LocationMap items={filtered} onSelectItem={() => {}} labelKey="title" locationKey="location" />
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-md w-full p-6 shadow-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{HEALTH_CATEGORIES.find(c => c.value === selected.health_category)?.label?.split(' ')[0]}</span>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5" style={{ color: '#6b5c3e' }} /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#1A2744' }}>{selected.title}</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: (CATEGORY_STYLES[selected.health_category] || CATEGORY_STYLES.medical).bg,
                  color: (CATEGORY_STYLES[selected.health_category] || CATEGORY_STYLES.medical).color,
                  border: `1px solid ${(CATEGORY_STYLES[selected.health_category] || CATEGORY_STYLES.medical).border}`,
                }}>
                {HEALTH_CATEGORIES.find(c => c.value === selected.health_category)?.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: (URGENCY_STYLES[selected.urgency] || URGENCY_STYLES.medium).bg, color: (URGENCY_STYLES[selected.urgency] || URGENCY_STYLES.medium).color }}>
                {(URGENCY_STYLES[selected.urgency] || URGENCY_STYLES.medium).label}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b5c3e' }}>{selected.description}</p>
            <div className="space-y-2 text-sm mb-6" style={{ color: '#555' }}>
              <div className="flex items-center gap-2"><User className="w-4 h-4" style={{ color: '#C9A84C' }} />{selected.contact_name}</div>
              {selected.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} />{selected.location}</div>}
              {selected.claimed_by_name && <div className="flex items-center gap-2"><Heart className="w-4 h-4" style={{ color: '#c0392b' }} />Claimed by {selected.claimed_by_name}</div>}
            </div>

            {user ? (
              <div className="space-y-2">
                {selected.status === 'open' && (
                  <button onClick={() => handleClaim(selected.id, false)}
                    className="w-full py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
                    🤝 I Can Help
                  </button>
                )}
                {selected.status === 'claimed' && selected.claimed_by_id === user.id && (
                  <>
                    <button onClick={() => handleClaim(selected.id, true)}
                      className="w-full py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity"
                      style={{ background: '#f0e8d0', color: '#6b5c3e' }}>
                      Cancel Claim
                    </button>
                    <button onClick={() => handleResolve(selected.id)}
                      className="w-full py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity"
                      style={{ background: '#27ae60', color: '#fff' }}>
                      ✅ Mark as Resolved
                    </button>
                  </>
                )}
                {selected.status === 'claimed' && selected.claimed_by_id !== user.id && (
                  <p className="text-center text-sm" style={{ color: '#6b5c3e' }}>This request is being handled by {selected.claimed_by_name}</p>
                )}
                {selected.status === 'resolved' && (
                  <p className="text-center text-sm py-2 rounded-xl" style={{ background: '#d5f5e3', color: '#27ae60' }}>✅ This request has been resolved</p>
                )}
              </div>
            ) : (
              <p className="text-center text-sm" style={{ color: '#6b5c3e' }}>Sign in to help with this request</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}