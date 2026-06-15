import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Users, Plus, X, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const CAUSES = ['All', 'Environment', 'Education', 'Health', 'Animals', 'Community', 'Elderly', 'Youth', 'Disaster Relief', 'Arts & Culture', 'Other'];
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
  const [causeFilter, setCauseFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', organization: '', location: '', cause_category: 'Environment', type: 'In-person', deadline: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    const data = await base44.entities.Opportunity.list('-created_date', 100);
    setOpportunities(data.filter(o => o.status === 'active'));
    setLoading(false);
  };

  const filtered = opportunities.filter(o =>
    (causeFilter === 'All' || o.cause_category === causeFilter) &&
    (typeFilter === 'All' || o.type === typeFilter)
  );

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
    setForm({ title: '', description: '', organization: '', location: '', cause_category: 'Environment', type: 'In-person', deadline: '' });
    setShowForm(false);
    setSubmitting(false);
    loadOpportunities();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Volunteer Opportunities</h1>
          <p className="text-muted-foreground text-sm">Find your next meaningful contribution</p>
        </div>
        {isMod && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Post Opportunity
          </button>
        )}
      </div>

      {/* Create Form */}
      {showForm && isMod && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-display text-xl font-bold mb-4">New Opportunity</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Beach Cleanup Volunteer" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Description *</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Describe the opportunity..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Organization *</label>
              <input required value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Organization name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="City, State or Remote" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Cause Category</label>
              <select value={form.cause_category} onChange={e => setForm({...form, cause_category: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {CAUSES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Application Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1 flex-wrap">
          {CAUSES.map(c => (
            <button key={c} onClick={() => setCauseFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${causeFilter === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${typeFilter === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold mb-2">No opportunities found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your filters or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(opp => (
            <div
              key={opp.id}
              onClick={() => setSelected(opp)}
              className="bg-card rounded-2xl border border-border p-5 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[opp.type] || 'bg-muted text-muted-foreground'}`}>
                  {opp.type}
                </span>
                <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">{opp.cause_category}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{opp.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{opp.organization}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{opp.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {opp.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {opp.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {opp.applicants?.length || 0} interested
                </div>
              </div>
              {opp.deadline && (
                <div className="mt-2 flex items-center gap-1 text-xs text-accent font-medium">
                  <Calendar className="w-3 h-3" />
                  Deadline: {format(new Date(opp.deadline), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[selected.type] || 'bg-muted text-muted-foreground'}`}>{selected.type}</span>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">{selected.title}</h2>
            <p className="text-accent font-medium mb-4">{selected.organization}</p>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{selected.description}</p>
            <div className="space-y-2 mb-6 text-sm">
              {selected.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {selected.location}</div>}
              <div className="flex items-center gap-2 text-muted-foreground"><span className="text-xs bg-muted px-2 py-0.5 rounded-full">{selected.cause_category}</span></div>
              {selected.deadline && <div className="flex items-center gap-2 text-accent font-medium"><Calendar className="w-4 h-4" /> Deadline: {format(new Date(selected.deadline), 'MMMM d, yyyy')}</div>}
              <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /> {selected.applicants?.length || 0} people interested</div>
            </div>
            {user ? (
              <button
                onClick={() => handleApply(selected)}
                disabled={selected.applicants?.includes(user.id)}
                className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {selected.applicants?.includes(user.id) ? '✓ You expressed interest' : "I'm Interested"}
              </button>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Sign in to express interest</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}