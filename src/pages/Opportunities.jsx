import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Users, Plus, X, LayoutGrid, Map, Send, CheckCircle, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import LocationMap from '@/components/LocationMap';
import CategorySearchFilters from '@/components/CategorySearchFilters';
import OfferForm from '@/components/opportunities/OfferForm';
import RemarksSection from '@/components/opportunities/RemarksSection';

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
    await base44.entities.Opportunity.create({ ...form, capacity: form.capacity || undefined, applicants: [], created_by_name: user?.full_name, status: 'active' });
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
          <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-2" style={{ color: '#D95D1A' }}>GIVE & RECEIVE</span>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: '#1A1A1A' }}>Give & Receive</h1>
          <p className="text-sm" style={{ color: '#555' }}>Choose a tab below: <strong>I Need Help</strong> to find support, or <strong>I Can Help</strong> to share your skills</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-1 gap-1 rounded-lg" style={{ background: '#fff', border: '1px solid #C99738' }}>
            <button onClick={() => setViewMode('grid')} className="p-2 rounded-lg transition-all" style={viewMode === 'grid' ? { background: '#1A1A1A', color: '#fff' } : { color: '#1A1A1A' }} title="Grid view">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('map')} className="p-2 rounded-lg transition-all" style={viewMode === 'map' ? { background: '#1A1A1A', color: '#fff' } : { color: '#1A1A1A' }} title="Map view">
              <Map className="w-4 h-4" />
            </button>
          </div>
          {isMod && (
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A1A1A', color: '#fff', border: '1px solid #C99738' }}>
              <Plus className="w-4 h-4" /> Post Opportunity
            </button>
          )}
        </div>
      </div>

      {/* Give / Receive Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('receive')}
          className="flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-lg"
          style={activeTab === 'receive'
            ? { background: '#247D7D', color: '#fff', border: '2px solid #247D7D', boxShadow: '0 4px 12px rgba(36,125,125,0.25)' }
            : { background: '#fff', color: '#247D7D', border: '2px solid #247D7D', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }
          }
        >
          🙋 I Need Help (Receive)
        </button>
        <button
          onClick={() => setActiveTab('give')}
          className="flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-lg"
          style={activeTab === 'give'
            ? { background: '#D35E35', color: '#fff', border: '2px solid #D35E35', boxShadow: '0 4px 12px rgba(211,94,53,0.25)' }
            : { background: '#fff', color: '#D35E35', border: '2px solid #D35E35', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }
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
            <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Registration Required</p>
            <p className="text-xs" style={{ color: '#555' }}>You must register first to give, receive, or connect with others.</p>
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
          <div className="mb-6 p-5 rounded-xl" style={{ background: '#E8F5F3', border: '1px solid #247D7D', borderLeft: '4px solid #247D7D', boxShadow: '0 2px 8px rgba(36,125,125,0.08)' }}>
            <p className="text-sm" style={{ color: '#1A1A1A' }}>
              <strong>How it works:</strong> Select the categories you need help with below, then submit your request. You will be matched with givers who will contact you to arrange support.
            </p>
          </div>

          {/* Category multi-select */}
          <div className="mb-6">
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid #C99738', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1A' }}>What do you need help with?</p>
              <p className="text-xs mb-4" style={{ color: '#555' }}>Select one or more topics — you can choose across categories.</p>
              <CategorySearchFilters
                multiSelect
                selectedFilters={selectedFilters}
                onSelectFilters={setSelectedFilters}
                className="mb-4"
              />
              <div className="pt-4 border-t" style={{ borderColor: '#C99738' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#555' }}>Type</p>
                <div className="flex gap-2 flex-wrap">
                  {TYPES.map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={typeFilter === t
                        ? { background: '#C99738', color: '#1A1A1A', border: '1px solid #C99738' }
                        : { background: '#fff', color: '#555', border: '1px solid #C99738' }
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
              className="w-full px-4 py-3 rounded-xl border outline-none focus:border-primary/30 transition-shadow"
              style={{ borderColor: '#C99738', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            />
          </div>

          {/* Create Form (admin/mod) */}
          {showForm && isMod && (
            <div className="rounded-2xl p-6 mb-6" style={{ background: '#fff', border: '1.5px solid #C99738' }}>
              <h2 className="font-display text-xl font-bold mb-4" style={{ color: '#1A1A1A' }}>New Opportunity</h2>
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Title *</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Beach Cleanup Volunteer" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Description *</label>
                  <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Describe the opportunity..." />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Organization *</label>
                  <input required value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Organization name" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="City, State or Remote" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Cause Category</label>
                  <select value={form.cause_category} onChange={e => setForm({...form, cause_category: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                    {CAUSE_OPTIONS.map(c => <option key={c.label} value={c.label}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                    {TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Application Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Capacity (max spots)</label>
                  <input type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value ? Number(e.target.value) : ''})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Leave empty for unlimited" />
                </div>
                <div className="md:col-span-2 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm" style={{ color: '#555' }}>Cancel</button>
                  <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#C99738', color: '#1A1A1A' }}>
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
              <div className="mb-8 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A1A1A, #333)', border: '2px solid #C99738', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: '#fff' }}>
                      🎨 Creative Workshops
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'rgba(245,230,192,0.80)' }}>Share your art, music, writing & craft skills with the community</p>
                  </div>
                  <button
                    onClick={() => setSelectedFilters([{ category: 'Creative Workshops', subcategory: null, emoji: '🎨' }])}
                    className="hidden sm:flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                    style={{ background: '#C99738', color: '#1A1A1A' }}
                  >
                    View All →
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workshops.slice(0, 3).map(opp => (
                    <div key={opp.id} onClick={() => setSelected(opp)}
                      className="p-4 cursor-pointer hover:scale-[1.02] transition-transform rounded-xl"
                      style={{ background: '#fff', border: '1px solid #C99738' }}>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(201,151,56,0.12)', color: '#555' }}>🎨 {opp.type}</span>
                      <h3 className="font-semibold text-sm mt-2 mb-1" style={{ color: '#1A1A1A' }}>{opp.title}</h3>
                      <p className="text-xs mb-2" style={{ color: '#C99738' }}>{opp.organization}</p>
                      <p className="text-xs line-clamp-2" style={{ color: '#555' }}>{opp.description}</p>
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
                  {[1,2,3,4].map(i => <div key={i} className="rounded-2xl border border-border p-5 animate-pulse h-48" style={{ background: '#fff' }} />)}
                </div>
              ) : viewMode === 'map' ? (
                <div className="lg:hidden"><LocationMap items={filtered} onSelectItem={setSelected} labelKey="title" locationKey="location" /></div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #C99738' }}>
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>No opportunities found</h3>
                  <p className="text-sm" style={{ color: '#555' }}>Try adjusting your filters or check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map(opp => (
                    <div key={opp.id} onClick={() => { setSelected(opp); setEnrollSuccess(null); }}
                      className="p-5 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                      style={{ background: '#fff', border: '1.5px solid #C99738', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[opp.type] || 'bg-muted text-muted-foreground'}`}>
                          {opp.type}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,151,56,0.12)', color: '#555' }}>{categoryEmoji[opp.cause_category] || '💡'} {opp.cause_category}</span>
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:opacity-75 transition-opacity" style={{ color: '#1A1A1A' }}>{opp.title}</h3>
                      <p className="text-sm mb-2" style={{ color: '#C99738' }}>{opp.organization}</p>
                      <p className="text-xs line-clamp-2 mb-4" style={{ color: '#555' }}>{opp.description}</p>
                      <div className="flex items-center justify-between text-xs" style={{ color: '#888' }}>
                        {opp.location && (
                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: '#C99738' }} />{opp.location}</div>
                        )}
                        {opp.capacity ? (
                          <div className="flex items-center gap-1 font-medium" style={{ color: (opp.applicants?.length || 0) >= opp.capacity ? '#c0392b' : '#C99738' }}>
                            <Users className="w-3 h-3" />
                            {Math.max(0, opp.capacity - (opp.applicants?.length || 0))} spots left
                          </div>
                        ) : (
                          <div className="flex items-center gap-1"><Users className="w-3 h-3" style={{ color: '#C99738' }} />{opp.applicants?.length || 0} interested</div>
                        )}
                      </div>
                      {opp.deadline && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: '#C99738' }}>
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

          {/* "Other" — post what you need */}
          <div className="mt-8 p-6 rounded-2xl text-center" style={{ background: '#fff', border: '1.5px dashed #C99738', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#1A1A1A' }}>Don't see what you need?</p>
            <p className="text-xs mb-3" style={{ color: '#555' }}>Post your request and let the community know how they can help you.</p>
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
          <div className="mb-6 p-5 rounded-xl" style={{ background: '#FFF3E0', border: '1px solid #D35E35', borderLeft: '4px solid #D35E35', boxShadow: '0 2px 8px rgba(211,94,53,0.08)' }}>
            <p className="text-sm" style={{ color: '#1A1A1A' }}>
              <strong>Want to give?</strong> Share what you'd like to offer — your time, skills, or talents. Post your offering below and community members who need your help will be connected with you.
            </p>
          </div>

          {user ? (
            <OfferForm user={user} onPosted={() => { loadOpportunities(null); setActiveTab('receive'); }} />
          ) : (
            <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #C99738' }}>
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Register to Give</h3>
              <p className="text-sm mb-4" style={{ color: '#555' }}>You must create an account before you can offer your skills and talents.</p>
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
          <div className="max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#fff', border: '1.5px solid #C99738', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[selected.type] || 'bg-muted text-muted-foreground'}`}>{selected.type}</span>
              <button onClick={() => { setSelected(null); setEnrollSuccess(null); }} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-4 h-4" style={{ color: '#555' }} /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#1A1A1A' }}>{selected.title}</h2>
            <p className="font-medium mb-4" style={{ color: '#C99738' }}>{selected.organization}</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#555' }}>{selected.description}</p>
            <div className="space-y-2 mb-6 text-sm">
              {selected.location && <div className="flex items-center gap-2" style={{ color: '#555' }}><MapPin className="w-4 h-4" style={{ color: '#C99738' }} /> {selected.location}</div>}
              <div className="flex items-center gap-2"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,151,56,0.12)', color: '#555' }}>{selected.cause_category}</span></div>
              {selected.deadline && <div className="flex items-center gap-2 font-medium" style={{ color: '#C99738' }}><Calendar className="w-4 h-4" /> Deadline: {format(new Date(selected.deadline), 'MMMM d, yyyy')}</div>}
              <div className="flex items-center gap-2" style={{ color: '#555' }}>
                <Users className="w-4 h-4" style={{ color: '#C99738' }} />
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
                          <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>
                            {justEnrolled ? "You've expressed interest!" : "You expressed interest"}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                          <strong>What happens next?</strong> You've been matched with the organizer. They will review your request and contact you directly to arrange the details. Keep an eye on your messages and email for updates.
                        </p>
                      </div>
                      <button disabled className="w-full py-3 font-semibold rounded-xl" style={{ background: 'rgba(201,151,56,0.12)', color: '#555' }}>
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
                        ? { background: 'rgba(201,151,56,0.12)', color: '#c0392b' }
                        : { background: '#1A1A1A', color: '#fff', border: '1px solid #C99738' }
                      }>
                      {isLoading ? 'Processing...' : isFull ? 'Workshop Full' : "I'm Interested — Match Me"}
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="text-center p-4 rounded-xl" style={{ background: '#FFF3E0', border: '1px solid #E67E22' }}>
                <p className="text-sm font-bold mb-2" style={{ color: '#1A1A1A' }}>Registration Required</p>
                <p className="text-xs mb-3" style={{ color: '#555' }}>You must register to express interest and get matched.</p>
                <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90" style={{ background: '#D95D1A', color: '#fff' }}>
                  Register Free →
                </Link>
              </div>
            )}

            <RemarksSection opportunity={selected} user={user} onUpdate={loadOpportunities} />
          </div>
        </div>
      )}
    </div>
  );
}