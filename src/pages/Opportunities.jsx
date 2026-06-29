import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Users, Plus, X, LayoutGrid, Map, Send, CheckCircle, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import LocationMap from '@/components/LocationMap';
import CategorySearchFilters from '@/components/CategorySearchFilters';
import OfferForm from '@/components/opportunities/OfferForm';

const CAUSE_OPTIONS = [
  { label: 'Companionship', emoji: '🤝' },
  { label: 'Food', emoji: '🍲' },
  { label: 'Home', emoji: '🏠' },
  { label: 'Skill Sharing', emoji: '📚' },
  { label: 'Technology', emoji: '💻' },
  { label: 'Transportation', emoji: '🚗' },
  { label: 'Creative Workshops', emoji: '🎨' },
];

const TYPES = ['All', 'In-person', 'Remote', 'Hybrid'];

const TYPE_COLORS = {
  'In-person': 'bg-green-100 text-green-800',
  'Remote': 'bg-blue-100 text-blue-800',
  'Hybrid': 'bg-purple-100 text-purple-800',
};

const categoryEmoji = {
  'Companionship': '🤝', 'Food': '🍲', 'Home': '🏠', 'Skill Sharing': '📚',
  'Technology': '💻', 'Transportation': '🚗', 'Creative Workshops': '🎨',
};

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', organization: '', location: '', cause_category: 'Food', type: 'In-person', deadline: '', capacity: '' });
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollSuccess, setEnrollSuccess] = useState(null);
  const [organizerProfile, setOrganizerProfile] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('receive');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedFilters([{ category: cat, subcategory: null, emoji: '🎨' }]);
    const focusOpp = searchParams.get('opportunity');
    loadOpportunities(focusOpp || null);
  }, [searchParams]);

  useEffect(() => {
    if (selected?.created_by_id) {
      base44.entities.VolunteerProfile.filter({ user_id: selected.created_by_id })
        .then(ps => setOrganizerProfile(ps[0] || null))
        .catch(() => setOrganizerProfile(null));
    } else {
      setOrganizerProfile(null);
    }
  }, [selected]);

  const loadOpportunities = async (focusId) => {
    setLoading(true);
    const data = await base44.entities.Opportunity.list('-created_date', 100);
    const active = data.filter(o => o.status === 'active').sort((a, b) => a.title.localeCompare(b.title));
    setOpportunities(active);
    setLoading(false);
    if (focusId) {
      const focus = active.find(o => o.id === focusId);
      if (focus) {
        setSelected(focus);
        setSearchParams({}, { replace: true });
      }
    }
  };

  const filtered = opportunities.filter(o => {
    const catMatch = selectedFilters.length === 0 || selectedFilters.some(f => 
      o.cause_category === f.category
    );
    const typeMatch = typeFilter === 'All' || o.type === typeFilter;
    const searchMatch = searchQuery === '' || o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.description.toLowerCase().includes(searchQuery.toLowerCase()) || o.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && typeMatch && searchMatch;
  });

  const isMod = user?.role === 'moderator' || user?.role === 'admin';

  const handleApply = async (opp) => {
    if (!user) return;
    setEnrollingId(opp.id);
    try {
      const response = await base44.functions.invoke('enrollWorkshop', { opportunity_id: opp.id });
      const result = response.data || response;
      if (result.error) {
        alert(result.error);
        return;
      }
      const updatedApplicants = result.applicants || [...(opp.applicants || []), user.id];
      const updatedOpp = { ...opp, applicants: updatedApplicants };
      setOpportunities(prev => prev.map(o => o.id === opp.id ? updatedOpp : o));
      setSelected(updatedOpp);
      setEnrollSuccess(opp.id);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.message || 'Could not enroll — the workshop may be full.';
      alert(errorMsg);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Opportunity.create({ ...form, capacity: form.capacity || undefined, applicants: [], created_by_id: user?.id, created_by_name: user?.full_name, status: 'active' });
    setForm({ title: '', description: '', organization: '', location: '', cause_category: 'Food', type: 'In-person', deadline: '', capacity: '' });
    setShowForm(false);
    setSubmitting(false);
    loadOpportunities(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: '#1A2744' }}>Find Your Opportunity</h1>
          <p className="text-sm" style={{ color: '#6b5c3e' }}>Browse what you need or share what you can offer</p>
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

      {/* Give / Receive Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('receive')}
          className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          style={activeTab === 'receive'
            ? { background: '#247D7D', color: '#fff', border: '2px solid #247D7D' }
            : { background: '#FAF7EE', color: '#247D7D', border: '2px solid #247D7D' }
          }
        >
          🙋 I Need Help (Receive)
        </button>
        <button
          onClick={() => setActiveTab('give')}
          className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          style={activeTab === 'give'
            ? { background: '#D35E35', color: '#fff', border: '2px solid #D35E35' }
            : { background: '#FAF7EE', color: '#D35E35', border: '2px solid #D35E35' }
          }
        >
          🤲 I Can Help (Give)
        </button>
      </div>

      {/* Registration notice for non-logged-in users */}
      {!user && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: '#FFF3E0', border: '1.5px solid #E67E22' }}>
          <span className="text-2xl">🔒</span>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: '#1A2744' }}>Registration Required</p>
            <p className="text-xs" style={{ color: '#6b5c3e' }}>You must register first to give, receive, or connect with others.</p>
          </div>
          <Link to="/register" className="px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap" style={{ background: '#D95D1A', color: '#fff' }}>
            Register Free →
          </Link>
        </div>
      )}

      {/* RECEIVE TAB */}
      {activeTab === 'receive' && (
        <>
          {/* Explanation */}
          <div className="mb-6 p-4 rounded-xl" style={{ background: '#E8F5F3', border: '1px solid #247D7D' }}>
            <p className="text-sm" style={{ color: '#1A2744' }}>
              <strong>How it works:</strong> Select the categories you need help with below, then submit your request. You will be matched with givers who will contact you to arrange support.
            </p>
          </div>

          {/* Category multi-select */}
          <div className="mb-6">
            <div className="rounded-2xl p-5" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#1A2744' }}>What do you need help with?</p>
              <p className="text-xs mb-4" style={{ color: '#6b5c3e' }}>Select one or more topics — you can choose across categories.</p>
              <CategorySearchFilters
                multiSelect
                selectedFilters={selectedFilters}
                onSelectFilters={setSelectedFilters}
                className="mb-4"
              />
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

          {/* Create Form (admin/mod) */}
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
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Capacity (max spots)</label>
                  <input type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value ? Number(e.target.value) : ''})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Leave empty for unlimited" />
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

          {/* Creative Workshops Featured Section */}
          {!loading && (() => {
            const workshops = opportunities.filter(o => o.cause_category === 'Creative Workshops');
            if (workshops.length === 0) return null;
            return (
              <div className="mb-8 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2744, #2d4070)', border: '2px solid #C9A84C' }}>
                <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: '#F5E6C0' }}>
                      🎨 Creative Workshops
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'rgba(245,230,192,0.80)' }}>Share your art, music, writing & craft skills with the community</p>
                  </div>
                  <button
                    onClick={() => setSelectedFilters([{ category: 'Creative Workshops', subcategory: null, emoji: '🎨' }])}
                    className="hidden sm:flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                    style={{ background: '#C9A84C', color: '#1A2744' }}
                  >
                    View All →
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workshops.slice(0, 3).map(opp => (
                    <div key={opp.id} onClick={() => setSelected(opp)}
                      className="p-4 cursor-pointer hover:scale-[1.02] transition-transform rounded-xl"
                      style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>🎨 {opp.type}</span>
                      <h3 className="font-semibold text-sm mt-2 mb-1" style={{ color: '#1A2744' }}>{opp.title}</h3>
                      <p className="text-xs mb-2" style={{ color: '#C9A84C' }}>{opp.organization}</p>
                      <p className="text-xs line-clamp-2" style={{ color: '#6b5c3e' }}>{opp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

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
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>No opportunities found</h3>
                  <p className="text-sm" style={{ color: '#6b5c3e' }}>Try adjusting your filters or check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map(opp => (
                    <div key={opp.id} onClick={() => { setSelected(opp); setEnrollSuccess(null); }}
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
                        {opp.capacity ? (
                          <div className="flex items-center gap-1 font-medium" style={{ color: (opp.applicants?.length || 0) >= opp.capacity ? '#c0392b' : '#C9A84C' }}>
                            <Users className="w-3 h-3" />
                            {Math.max(0, opp.capacity - (opp.applicants?.length || 0))} spots left
                          </div>
                        ) : (
                          <div className="flex items-center gap-1"><Users className="w-3 h-3" style={{ color: '#C9A84C' }} />{opp.applicants?.length || 0} interested</div>
                        )}
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
                <div className="sticky top-20 rounded-2xl overflow-hidden" style={{ border: '1px solid #e0e0e0' }}>
                  <div className="px-4 py-2.5 text-xs font-medium" style={{ background: '#FAF7EE', color: '#6b5c3e', borderBottom: '1px solid #e0e0e0' }}>
                    📍 Map view — click a pin to see opportunity details
                  </div>
                  <div style={{ height: 'calc(100vh - 8rem)' }}>
                    <LocationMap items={filtered} onSelectItem={setSelected} labelKey="title" locationKey="location" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* "Other" — post what you need */}
          <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: '#FAF7EE', border: '1.5px dashed #C9A84C' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#1A2744' }}>Don't see what you need?</p>
            <p className="text-xs mb-3" style={{ color: '#6b5c3e' }}>Post your request and let the community know how they can help you.</p>
            {user ? (
              <Link to="/feed" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: '#247D7D', color: '#fff' }}>
                <Megaphone className="w-4 h-4" /> Post a Request
              </Link>
            ) : (
              <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: '#D95D1A', color: '#fff' }}>
                Register to Post →
              </Link>
            )}
          </div>
        </>
      )}

      {/* GIVE TAB */}
      {activeTab === 'give' && (
        <>
          {/* Explanation */}
          <div className="mb-6 p-4 rounded-xl" style={{ background: '#FFF3E0', border: '1px solid #D35E35' }}>
            <p className="text-sm" style={{ color: '#1A2744' }}>
              <strong>Want to give?</strong> Share what you'd like to offer — your time, skills, or talents. Post your offering below and community members who need your help will be connected with you.
            </p>
          </div>

          {user ? (
            <OfferForm user={user} onPosted={() => { loadOpportunities(null); setActiveTab('receive'); }} />
          ) : (
            <div className="text-center py-16 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>Register to Give</h3>
              <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>You must create an account before you can offer your skills and talents.</p>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm hover:opacity-90" style={{ background: '#D95D1A', color: '#fff' }}>
                Create Your Free Account →
              </Link>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setSelected(null); setEnrollSuccess(null); }}>
          <div className="max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[selected.type] || 'bg-muted text-muted-foreground'}`}>{selected.type}</span>
              <button onClick={() => { setSelected(null); setEnrollSuccess(null); }} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-4 h-4" style={{ color: '#6b5c3e' }} /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#1A2744' }}>{selected.title}</h2>
            <p className="font-medium mb-4" style={{ color: '#C9A84C' }}>{selected.organization}</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b5c3e' }}>{selected.description}</p>
            <div className="space-y-2 mb-6 text-sm">
              {selected.location && <div className="flex items-center gap-2" style={{ color: '#555' }}><MapPin className="w-4 h-4" style={{ color: '#C9A84C' }} /> {selected.location}</div>}
              <div className="flex items-center gap-2"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>{selected.cause_category}</span></div>
              {selected.deadline && <div className="flex items-center gap-2 font-medium" style={{ color: '#C9A84C' }}><Calendar className="w-4 h-4" /> Deadline: {format(new Date(selected.deadline), 'MMMM d, yyyy')}</div>}
              <div className="flex items-center gap-2" style={{ color: '#555' }}>
                <Users className="w-4 h-4" style={{ color: '#C9A84C' }} />
                {selected.capacity
                  ? `${selected.applicants?.length || 0} / ${selected.capacity} enrolled · ${Math.max(0, selected.capacity - (selected.applicants?.length || 0))} spots left`
                  : `${selected.applicants?.length || 0} people interested`}
              </div>
            </div>

            {user ? (
              (() => {
                const isFull = selected.capacity && (selected.applicants?.length || 0) >= selected.capacity;
                const isEnrolled = selected.applicants?.includes(user.id);
                const isLoading = enrollingId === selected.id;
                const justEnrolled = enrollSuccess === selected.id;

                if (isEnrolled) {
                  return (
                    <div>
                      <div className="p-4 rounded-xl mb-3" style={{ background: '#E8F5F3', border: '1px solid #247D7D' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5" style={{ color: '#247D7D' }} />
                          <p className="font-bold text-sm" style={{ color: '#1A2744' }}>
                            {justEnrolled ? "You've expressed interest!" : "You expressed interest"}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                          <strong>What happens next?</strong> You've been matched with the organizer. They will review your request and contact you directly to arrange the details. You can also message them below to introduce yourself.
                        </p>
                      </div>
                      {organizerProfile?.phone && (
                        <p className="text-xs mb-3 p-3 rounded-lg" style={{ background: '#fff', color: '#1A2744', border: '1px solid #C9A84C' }}>
                          📞 Organizer phone: <strong>{organizerProfile.phone}</strong>
                        </p>
                      )}
                      <Link to={`/messages?to=${selected.created_by_id}&name=${encodeURIComponent(selected.created_by_name || 'Organizer')}`} className="w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity mb-2" style={{ background: '#247D7D', color: '#fff' }}>
                        Message the Organizer
                      </Link>
                      <button disabled className="w-full py-3 font-semibold rounded-xl" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>
                        ✓ Interest Submitted
                      </button>
                    </div>
                  );
                }

                return (
                  <div>
                    <p className="text-xs mb-3 p-3 rounded-lg" style={{ background: '#E8F5F3', color: '#555' }}>
                      <Send className="w-3 h-3 inline mr-1" style={{ color: '#247D7D' }} />
                      By clicking below, you'll be matched with a giver who will contact you to arrange support.
                    </p>
                    <button onClick={() => handleApply(selected)} disabled={isFull || isLoading}
                      className="w-full py-3 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                      style={isFull
                        ? { background: '#f0e8d0', color: '#c0392b' }
                        : { background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }
                      }>
                      {isLoading ? 'Processing...' : isFull ? 'Workshop Full' : "I'm Interested — Match Me"}
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="text-center p-4 rounded-xl" style={{ background: '#FFF3E0', border: '1px solid #E67E22' }}>
                <p className="text-sm font-bold mb-2" style={{ color: '#1A2744' }}>Registration Required</p>
                <p className="text-xs mb-3" style={{ color: '#6b5c3e' }}>You must register to express interest and get matched.</p>
                <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90" style={{ background: '#D95D1A', color: '#fff' }}>
                  Register Free →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}