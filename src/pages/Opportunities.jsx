import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Users, Plus, X, LayoutGrid, Map } from 'lucide-react';
import { format } from 'date-fns';
import LocationMap from '@/components/LocationMap';
import CategorySearchFilters from '@/components/CategorySearchFilters';
import FilterBar from '@/components/FilterBar';

const CAUSE_OPTIONS = [
  { label: 'Companionship', emoji: '🤝' },
  { label: 'Food', emoji: '🍲' },
  { label: 'Home', emoji: '🏠' },
  { label: 'Skill Sharing', emoji: '📚' },
  { label: 'Technology', emoji: '💻' },
  { label: 'Transportation', emoji: '🚗' },
];

const TYPES = ['All', 'In-person', 'Remote', 'Hybrid'];

const TYPE_COLORS = {
  'In-person': 'bg-green-100 text-green-800',
  'Remote': 'bg-blue-100 text-blue-800',
  'Hybrid': 'bg-purple-100 text-purple-800',
};

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', organization: '', location: '', cause_category: 'Food', type: 'In-person', deadline: '' });
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [categoryFilter, setCategoryFilter] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    const data = await base44.entities.Opportunity.list('-created_date', 100);
    setOpportunities(data.filter(o => o.status === 'active').sort((a, b) => a.title.localeCompare(b.title)));
    setLoading(false);
  };

  const categoryEmoji = {
    'Companionship': '🤝', 'Food': '🍲', 'Home': '🏠', 'Skill Sharing': '📚',
    'Technology': '💻', 'Transportation': '🚗',
  };

  const filtered = opportunities.filter(o => {
    const catMatch = !categoryFilter || o.cause_category === categoryFilter.category;
    const typeMatch = typeFilter === 'All' || o.type === typeFilter;
    const searchMatch = searchQuery === '' || o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.description.toLowerCase().includes(searchQuery.toLowerCase()) || o.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && typeMatch && searchMatch;
  });

  const isMod = user?.role === 'moderator' || user?.role === 'admin';

  const handleApply = async (opp) => {
    if (!user) return;
    const applicants = opp.applicants?.includes(user.id) ? opp.applicants : [...(opp.applicants || []), user.id];
    await base44.entities.Opportunity.update(opp.id, { applicants });
    loadOpportunities();
    setSelected(prev => prev ? { ...prev, applicants } : prev);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Opportunity.create({ ...form, applicants: [], created_by_name: user?.full_name, status: 'active' });
    setForm({ title: '', description: '', organization: '', location: '', cause_category: 'Food', type: 'In-person', deadline: '' });
    setShowForm(false);
    setSubmitting(false);
    loadOpportunities();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: '#1A2744' }}>Giving Opportunities</h1>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>Find your next giving opportunity</p>
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
          {isMod && (
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
              <Plus className="w-4 h-4" /> Post Opportunity
            </button>
          )}
        </div>
      </div>

      {/* Create Form */}
      {showForm && isMod && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <h2 className="font-display text-xl font-bold mb-4" style={{ color: '#1A2744' }}>New Opportunity</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Title *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Beach Cleanup Volunteer" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Description *</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Describe the opportunity..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Organization *</label>
              <input required value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Organization name" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="City, State or Remote" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Cause Category</label>
              <select value={form.cause_category} onChange={e => setForm({...form, cause_category: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {CAUSE_OPTIONS.map(c => <option key={c.label} value={c.label}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Application Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm" style={{ color: '#6b5c3e' }}>Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#C9A84C', color: '#1A2744' }}>
                {submitting ? 'Publishing...' : 'Publish'}
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
          placeholder="🔍 Search opportunities by title, organization, or keywords..."
          className="w-full px-4 py-3 rounded-xl border outline-none focus:border-primary/30"
          style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="rounded-2xl p-5" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <CategorySearchFilters selectedFilter={categoryFilter} onSelectFilter={setCategoryFilter} className="mb-4" />
          <div className="pt-4 border-t" style={{ borderColor: '#C9A84C' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#6b5c3e' }}>Type</p>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={typeFilter === t
                    ? { background: '#C9A84C', color: '#1A2744', border: '1px solid #C9A84C' }
                    : { background: '#fff', color: '#6b5c3e', border: '1px solid #C9A84C' }
                  }>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content + Map two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-7">
      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="rounded-2xl border border-border p-5 animate-pulse h-48" style={{ background: '#FAF7EE' }} />)}
        </div>
      ) : viewMode === 'map' ? (
        <div className="lg:hidden"><LocationMap items={filtered} onSelectItem={setSelected} labelKey="title" locationKey="location" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>No opportunities found</h3>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>Try adjusting your filters or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(opp => (
            <div key={opp.id} onClick={() => setSelected(opp)}
              className="p-5 cursor-pointer hover:shadow-xl transition-all group"
              style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[opp.type] || 'bg-muted text-muted-foreground'}`}>
                  {opp.type}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>{categoryEmoji[opp.cause_category] || '💡'} {opp.cause_category}</span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:opacity-75 transition-opacity" style={{ color: '#1A2744' }}>{opp.title}</h3>
              <p className="text-sm mb-2" style={{ color: '#C9A84C' }}>{opp.organization}</p>
              <p className="text-xs line-clamp-2 mb-4" style={{ color: '#6b5c3e' }}>{opp.description}</p>
              <div className="flex items-center justify-between text-xs" style={{ color: '#888' }}>
                {opp.location && (
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: '#C9A84C' }} />{opp.location}</div>
                )}
                <div className="flex items-center gap-1"><Users className="w-3 h-3" style={{ color: '#C9A84C' }} />{opp.applicants?.length || 0} interested</div>
              </div>
              {opp.deadline && (
                <div className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: '#C9A84C' }}>
                  <Calendar className="w-3 h-3" />Deadline: {format(new Date(opp.deadline), 'MMM d, yyyy')}
                </div>
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
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[selected.type] || 'bg-muted text-muted-foreground'}`}>{selected.type}</span>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-4 h-4" style={{ color: '#6b5c3e' }} /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#1A2744' }}>{selected.title}</h2>
            <p className="font-medium mb-4" style={{ color: '#C9A84C' }}>{selected.organization}</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b5c3e' }}>{selected.description}</p>
            <div className="space-y-2 mb-6 text-sm">
              {selected.location && <div className="flex items-center gap-2" style={{ color: '#555' }}><MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} /> {selected.location}</div>}
              <div className="flex items-center gap-2"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>{selected.cause_category}</span></div>
              {selected.deadline && <div className="flex items-center gap-2 font-medium" style={{ color: '#C9A84C' }}><Calendar className="w-4 h-4" /> Deadline: {format(new Date(selected.deadline), 'MMMM d, yyyy')}</div>}
              <div className="flex items-center gap-2" style={{ color: '#555' }}><Users className="w-4 h-4" style={{ color: '#C9A84C' }} /> {selected.applicants?.length || 0} people interested</div>
            </div>
            {user ? (
              <button onClick={() => handleApply(selected)} disabled={selected.applicants?.includes(user.id)}
                className="w-full py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                style={selected.applicants?.includes(user.id)
                  ? { background: '#f0e8d0', color: '#6b5c3e' }
                  : { background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }
                }>
                {selected.applicants?.includes(user.id) ? '✓ You expressed interest' : "I'm Interested"}
              </button>
            ) : (
              <p className="text-center text-sm" style={{ color: '#6b5c3e' }}>Sign in to express interest</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}