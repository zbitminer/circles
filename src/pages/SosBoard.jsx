import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Clock, Plus, X, CheckCircle, LayoutGrid, Map, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LocationMap from '@/components/LocationMap';
import CategorySearchFilters from '@/components/CategorySearchFilters';

const CAUSES = ['Food', 'Transportation', 'Other'];

const STATUS_OPTIONS = ['open', 'claimed', 'resolved', 'all'];

const STATUS_LABELS = {
  open: '🔴 Open',
  claimed: '🟡 Claimed',
  resolved: '✅ Resolved',
  all: 'All',
};

const STATUS_CARD_COLORS = {
  open: 'bg-red-100 text-red-700',
  claimed: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
};

const categoryEmoji = {
  'Companionship': '🤝', 'Food': '🍲', 'Home': '🏠', 'Skill Sharing': '📚',
  'Technology': '💻', 'Transportation': '🚗', 'Other': '💡',
};

export default function SosBoard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', contact_name: '', location: '', cause_category: 'Other', urgency_hours: 24 });
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('open');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await base44.entities.SosRequest.list('-created_date', 100);
    setRequests(data);
    setLoading(false);
  };

  const filtered = requests.filter(r => {
    const statusMatch = statusFilter === 'all' || r.status === statusFilter;
    const catMatch = !categoryFilter || r.cause_category === categoryFilter.category;
    const searchMatch = searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()) || r.contact_name.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && catMatch && searchMatch;
  }).sort((a, b) => {
    const statusOrder = { open: 0, claimed: 1, resolved: 2 };
    const sa = statusOrder[a.status] ?? 3;
    const sb = statusOrder[b.status] ?? 3;
    if (sa !== sb) return sa - sb;
    return (a.urgency_hours || 48) - (b.urgency_hours || 48);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.SosRequest.create({ ...form, urgency_hours: Number(form.urgency_hours) });
    setForm({ title: '', description: '', contact_name: '', location: '', cause_category: 'Other', urgency_hours: 24 });
    setShowForm(false);
    setSubmitting(false);
    loadRequests();
  };

  const handleClaim = async (req) => {
    if (!user) return;
    await base44.entities.SosRequest.update(req.id, { status: 'claimed', claimed_by_id: user.id, claimed_by_name: user.full_name });
    loadRequests();
    setSelected(prev => prev && prev.id === req.id ? { ...prev, status: 'claimed', claimed_by_id: user.id, claimed_by_name: user.full_name } : prev);
  };

  const handleResolve = async (req) => {
    await base44.entities.SosRequest.update(req.id, { status: 'resolved' });
    loadRequests();
    setSelected(prev => prev && prev.id === req.id ? { ...prev, status: 'resolved' } : prev);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: '#1A2744' }}>Receiving Help</h1>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>Post urgent requests for help within 24–48 hours</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-1 gap-1 rounded-lg" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
            <button onClick={() => setViewMode('grid')} className="p-2 rounded-lg transition-all" style={viewMode === 'grid' ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#1A2744' }} title="Grid view">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('map')} className="p-2 rounded-lg transition-all" style={viewMode === 'map' ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#1A2744' }} title="Map view">
              <Map className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-md" style={{ background: '#D95D1A', color: '#fff', border: '1px solid #D95D1A' }}>
            <Plus className="w-4 h-4" /> Post Urgent Request
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <h2 className="font-display text-xl font-bold mb-4" style={{ color: '#1A2744' }}>Post an Urgent Request</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>What do you need? *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Urgent ride to hospital needed" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Details *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Describe the situation and what kind of help is needed..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Your Name *</label>
              <input required value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="City or area" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Category</label>
              <select value={form.cause_category} onChange={e => setForm({ ...form, cause_category: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {CAUSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Urgency</label>
              <select value={form.urgency_hours} onChange={e => setForm({ ...form, urgency_hours: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                <option value={24}>Within 24 hours</option>
                <option value={48}>Within 48 hours</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm" style={{ color: '#6b5c3e' }}>Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#C9A84C', color: '#1A2744' }}>
                {submitting ? 'Posting...' : 'Post Urgent Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍 Search requests by title, description, or contact..."
          className="w-full px-4 py-3 rounded-xl border outline-none focus:border-primary/30"
          style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="rounded-2xl p-5" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <CategorySearchFilters selectedFilter={categoryFilter} onSelectFilter={setCategoryFilter} className="mb-4" />
          <div className="pt-4 border-t" style={{ borderColor: '#C9A84C' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#6b5c3e' }}>Status</p>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={statusFilter === s
                    ? { background: '#C9A84C', color: '#1A2744', border: '1px solid #C9A84C' }
                    : { background: '#fff', color: '#6b5c3e', border: '1px solid #C9A84C' }
                  }>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content + Map two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="rounded-2xl border border-border p-5 animate-pulse h-48" style={{ background: '#FAF7EE' }} />)}
        </div>
      ) : viewMode === 'map' ? (
        <div className="lg:hidden"><LocationMap items={filtered} onSelectItem={setSelected} labelKey="title" locationKey="location" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>No {statusFilter === 'all' ? '' : statusFilter} requests</h3>
          <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>Check back soon or post a new urgent request.</p>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: '#D95D1A', color: '#fff' }}>
            <Plus className="w-4 h-4" /> Post an Urgent Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(req => (
            <div key={req.id} onClick={() => setSelected(req)}
              className="p-5 cursor-pointer hover:shadow-xl transition-all group"
              style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CARD_COLORS[req.status] || 'bg-muted text-muted-foreground'}`}>
                  {STATUS_LABELS[req.status] || req.status}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>{categoryEmoji[req.cause_category] || '💡'} {req.cause_category}</span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:opacity-75 transition-opacity" style={{ color: '#1A2744' }}>{req.title}</h3>
              <p className="text-sm mb-2" style={{ color: '#C9A84C' }}>{req.contact_name}</p>
              <p className="text-xs line-clamp-2 mb-4" style={{ color: '#6b5c3e' }}>{req.description}</p>
              <div className="flex items-center justify-between text-xs" style={{ color: '#888' }}>
                <div className="flex items-center gap-1 text-orange-600 font-medium">
                  <Clock className="w-3 h-3" /> Within {req.urgency_hours}h
                </div>
                {req.location && (
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: '#C9A84C' }} />{req.location}</div>
                )}
              </div>
              {req.claimed_by_name && req.status === 'claimed' && (
                <div className="mt-2 text-xs text-yellow-700">Claimed by {req.claimed_by_name}</div>
              )}
            </div>
          ))}
        </div>
      )}
        </div>

        {/* Right: sticky map */}
        {!loading && filtered.length > 0 && viewMode !== 'map' && (
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-20 rounded-2xl overflow-hidden" style={{ border: '1px solid #e0e0e0', height: 'calc(100vh - 6rem)' }}>
              <LocationMap items={filtered} onSelectItem={setSelected} labelKey="title" locationKey="location" />
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-lg w-full p-6 shadow-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CARD_COLORS[selected.status] || 'bg-muted text-muted-foreground'}`}>
                {STATUS_LABELS[selected.status] || selected.status}
              </span>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-4 h-4" style={{ color: '#6b5c3e' }} /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#1A2744' }}>{selected.title}</h2>
            <p className="font-medium mb-4" style={{ color: '#C9A84C' }}>{selected.contact_name}</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b5c3e' }}>{selected.description}</p>
            <div className="space-y-2 mb-6 text-sm">
              {selected.location && <div className="flex items-center gap-2" style={{ color: '#555' }}><MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} /> {selected.location}</div>}
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>{categoryEmoji[selected.cause_category] || '💡'} {selected.cause_category}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-orange-600"><Clock className="w-3.5 h-3.5" /> Within {selected.urgency_hours} hours</span>
              </div>
              {selected.claimed_by_name && <div className="flex items-center gap-2 text-yellow-700 text-xs font-medium"><Users className="w-4 h-4" /> Claimed by {selected.claimed_by_name}</div>}
            </div>
            {user && selected.status === 'open' && (
              <button onClick={() => handleClaim(selected)}
                className="w-full py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
                I Can Help!
              </button>
            )}
            {user && selected.status === 'claimed' && (selected.claimed_by_id === user.id || user.role === 'admin' || user.role === 'moderator') && (
              <button onClick={() => handleResolve(selected)} className="w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl bg-green-600 text-white hover:opacity-90">
                <CheckCircle className="w-4 h-4" /> Mark Resolved
              </button>
            )}
            {!user && (
              <p className="text-center text-sm" style={{ color: '#6b5c3e' }}>Sign in to help with this request</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}