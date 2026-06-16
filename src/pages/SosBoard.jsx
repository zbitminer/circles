import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, MapPin, Clock, Plus, X, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CAUSES = ['Transportation & Escort', 'Combating Loneliness', 'Food Preparation & Delivery', 'Technological Assistance', 'Maintenance & Home Repair', 'Learning & Skills Workshops', 'Trauma & Emotional Support', 'Community Events', 'Other'];

const STATUS_COLORS = {
  open: 'bg-red-100 text-red-700',
  claimed: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function SosBoard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', contact_name: '', location: '', cause_category: 'Other', urgency_hours: 24 });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('open');

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

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);

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
    await base44.entities.SosRequest.update(req.id, {
      status: 'claimed',
      claimed_by_id: user.id,
      claimed_by_name: user.full_name,
    });
    loadRequests();
  };

  const handleResolve = async (req) => {
    await base44.entities.SosRequest.update(req.id, { status: 'resolved' });
    loadRequests();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-red-600 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">SOS — Urgent Help Needed</h1>
              <p className="text-red-100 text-sm mt-0.5">Time-sensitive requests requiring help within 24–48 hours</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Post SOS
          </button>
        </div>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="bg-card border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Post an Urgent Request</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">What do you need? *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-300" placeholder="e.g. Urgent ride to hospital needed" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Details *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-300 resize-none" placeholder="Describe the situation and what kind of help is needed..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Your Name *</label>
                <input required value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-300" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-300" placeholder="City or area" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                <select value={form.cause_category} onChange={e => setForm({ ...form, cause_category: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-300">
                  {CAUSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Urgency</label>
                <select value={form.urgency_hours} onChange={e => setForm({ ...form, urgency_hours: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-red-300">
                  <option value={24}>Within 24 hours</option>
                  <option value={48}>Within 48 hours</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Posting...' : '🆘 Post SOS Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5">
        {[['open', '🔴 Open'], ['claimed', '🟡 Claimed'], ['resolved', '✅ Resolved'], ['all', 'All']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${filter === val ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Requests */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-card rounded-2xl border border-border h-32 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-display text-xl font-bold mb-2">No {filter === 'all' ? '' : filter} requests</h3>
          <p className="text-muted-foreground text-sm">Check back soon or post a new SOS request.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} className={`bg-card rounded-2xl border overflow-hidden ${req.status === 'open' ? 'border-red-200' : 'border-border'}`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[req.status]}`}>
                      {req.status === 'open' ? '🔴 Open' : req.status === 'claimed' ? '🟡 Claimed' : '✅ Resolved'}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">{req.cause_category}</span>
                    <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                      <Clock className="w-3 h-3 inline mr-1" />Within {req.urgency_hours}h
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {req.created_date ? formatDistanceToNow(new Date(req.created_date), { addSuffix: true }) : ''}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{req.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{req.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>👤 {req.contact_name}</span>
                    {req.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.location}</span>}
                    {req.claimed_by_name && req.status === 'claimed' && <span className="text-yellow-700">Claimed by {req.claimed_by_name}</span>}
                  </div>
                  {user && req.status === 'open' && (
                    <button onClick={() => handleClaim(req)} className="text-xs px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                      I Can Help!
                    </button>
                  )}
                  {user && req.status === 'claimed' && (req.claimed_by_id === user.id || user.role === 'admin' || user.role === 'moderator') && (
                    <button onClick={() => handleResolve(req)} className="flex items-center gap-1 text-xs px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:opacity-90">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}