import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Clock, Award, Calendar, Plus, Trash2, Edit2, Check, Camera, Rss, Briefcase, AlertTriangle, Utensils, Users, MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CAUSES = ['Transportation & Escort', 'Combating Loneliness', 'Food Preparation & Delivery', 'Technological Assistance', 'Maintenance & Home Repair', 'Learning & Skills Workshops', 'Trauma & Emotional Support', 'Community Events', 'Other'];

const CAUSE_COLORS = {
  'Transportation & Escort': 'bg-blue-100 text-blue-800',
  'Combating Loneliness': 'bg-orange-100 text-orange-800',
  'Food Preparation & Delivery': 'bg-yellow-100 text-yellow-800',
  'Technological Assistance': 'bg-indigo-100 text-indigo-800',
  'Maintenance & Home Repair': 'bg-gray-100 text-gray-800',
  'Learning & Skills Workshops': 'bg-green-100 text-green-800',
  'Trauma & Emotional Support': 'bg-pink-100 text-pink-800',
  'Community Events': 'bg-purple-100 text-purple-800',
  'Other': 'bg-muted text-muted-foreground',
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ activity_name: '', hours: '', date: '', cause_category: 'Community Events', notes: '' });
  const [submittingLog, setSubmittingLog] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const u = await base44.auth.me();
    setUser(u);
    const profiles = await base44.entities.VolunteerProfile.filter({ user_id: u.id });
    let p = profiles[0];
    if (!p) {
      p = await base44.entities.VolunteerProfile.create({ user_id: u.id, total_hours: 0, events_attended: 0, opportunities_completed: 0, followers: [], following: [], causes: [] });
    }
    setProfile(p);
    setBioText(p.bio || '');
    setLocationText(p.location || '');
    setSelectedCauses(p.causes || []);
    const hourLogs = await base44.entities.HourLog.filter({ user_id: u.id });
    setLogs(hourLogs.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setLoading(false);
  };

  const saveBio = async () => {
    await base44.entities.VolunteerProfile.update(profile.id, { bio: bioText, location: locationText, causes: selectedCauses });
    setProfile(prev => ({ ...prev, bio: bioText, location: locationText, causes: selectedCauses }));
    setEditingBio(false);
  };

  const toggleCause = (cause) => {
    setSelectedCauses(prev => prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]);
  };

  const submitLog = async (e) => {
    e.preventDefault();
    setSubmittingLog(true);
    const hours = parseFloat(logForm.hours);
    await base44.entities.HourLog.create({ ...logForm, hours, user_id: user.id });
    const newTotal = (profile.total_hours || 0) + hours;
    await base44.entities.VolunteerProfile.update(profile.id, { total_hours: newTotal });
    setProfile(prev => ({ ...prev, total_hours: newTotal }));
    setLogForm({ activity_name: '', hours: '', date: '', cause_category: 'Community Events', notes: '' });
    setShowLogForm(false);
    setSubmittingLog(false);
    const updated = await base44.entities.HourLog.filter({ user_id: user.id });
    setLogs(updated.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const deleteLog = async (log) => {
    await base44.entities.HourLog.delete(log.id);
    const newTotal = Math.max(0, (profile.total_hours || 0) - log.hours);
    await base44.entities.VolunteerProfile.update(profile.id, { total_hours: newTotal });
    setProfile(prev => ({ ...prev, total_hours: newTotal }));
    setLogs(prev => prev.filter(l => l.id !== log.id));
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const avatarInputRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.VolunteerProfile.update(profile.id, { avatar_url: file_url });
    setProfile(prev => ({ ...prev, avatar_url: file_url }));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-card rounded-2xl border border-border" />
          <div className="h-48 bg-card rounded-2xl border border-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="bg-primary h-24" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-white text-2xl font-bold border-4 border-card overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold">{user?.full_name}</h1>
              {profile?.location && <p className="text-muted-foreground text-sm">📍 {profile.location}</p>}
            </div>
          </div>

          {editingBio ? (
            <div className="space-y-3">
              <textarea
                value={bioText}
                onChange={e => setBioText(e.target.value)}
                placeholder="Tell the community about yourself and why you volunteer..."
                rows={3}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none"
              />
              <input
                value={locationText}
                onChange={e => setLocationText(e.target.value)}
                placeholder="Your city or region"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30"
              />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Causes you care about:</p>
                <div className="flex flex-wrap gap-1.5">
                  {CAUSES.map(cause => (
                    <button key={cause} type="button" onClick={() => toggleCause(cause)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        selectedCauses.includes(cause) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}>
                      {cause}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveBio} className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90">
                  <Check className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setEditingBio(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {profile?.bio || 'No bio yet. Tell the community about yourself!'}
              </p>
              {profile?.causes?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.causes.map(c => (
                    <span key={c} className={`text-xs px-2.5 py-1 rounded-full font-medium ${CAUSE_COLORS[c] || 'bg-muted text-muted-foreground'}`}>{c}</span>
                  ))}
                </div>
              )}
              <button onClick={() => setEditingBio(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Edit profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{profile?.total_hours || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Hours Volunteered</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{profile?.events_attended || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Events Attended</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5 text-green-700" />
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{profile?.opportunities_completed || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Opportunities</p>
        </div>
      </div>

      {/* Community Control Panel */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-display text-xl font-bold mb-1">Community Control Panel</h2>
        <p className="text-sm text-muted-foreground mb-5">Jump into community action from right here</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link to="/feed" className="group flex flex-col items-center gap-3 p-4 bg-muted rounded-2xl hover:bg-primary/10 hover:border-primary border border-transparent transition-all text-center">
            <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
              <Rss className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Community Feed</p>
              <p className="text-xs text-muted-foreground">Post & interact</p>
            </div>
          </Link>
          <Link to="/opportunities" className="group flex flex-col items-center gap-3 p-4 bg-muted rounded-2xl hover:bg-accent/10 hover:border-accent border border-transparent transition-all text-center">
            <div className="w-11 h-11 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">Opportunities</p>
              <p className="text-xs text-muted-foreground">Find volunteer roles</p>
            </div>
          </Link>
          <Link to="/events" className="group flex flex-col items-center gap-3 p-4 bg-muted rounded-2xl hover:bg-purple-50 hover:border-purple-300 border border-transparent transition-all text-center">
            <div className="w-11 h-11 rounded-xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Events</p>
              <p className="text-xs text-muted-foreground">RSVP & attend</p>
            </div>
          </Link>
          <Link to="/sos" className="group flex flex-col items-center gap-3 p-4 bg-muted rounded-2xl hover:bg-red-50 hover:border-red-300 border border-transparent transition-all text-center">
            <div className="w-11 h-11 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-colors">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">SOS Board</p>
              <p className="text-xs text-muted-foreground">Urgent help requests</p>
            </div>
          </Link>
          <Link to="/shabbat" className="group flex flex-col items-center gap-3 p-4 bg-muted rounded-2xl hover:bg-amber-50 hover:border-amber-300 border border-transparent transition-all text-center">
            <div className="w-11 h-11 rounded-xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-colors">
              <Utensils className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Shabbat Meals</p>
              <p className="text-xs text-muted-foreground">Host or join a table</p>
            </div>
          </Link>
          <Link to="/directory" className="group flex flex-col items-center gap-3 p-4 bg-muted rounded-2xl hover:bg-green-50 hover:border-green-300 border border-transparent transition-all text-center">
            <div className="w-11 h-11 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Directory</p>
              <p className="text-xs text-muted-foreground">Browse members</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Hour Logs */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold">Volunteer Hours Log</h2>
          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Log Hours
          </button>
        </div>

        {showLogForm && (
          <form onSubmit={submitLog} className="bg-muted rounded-xl p-4 mb-5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Activity Name *</label>
                <input required value={logForm.activity_name} onChange={e => setLogForm({...logForm, activity_name: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="e.g. Food bank volunteering" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Hours *</label>
                <input required type="number" min="0.5" step="0.5" value={logForm.hours} onChange={e => setLogForm({...logForm, hours: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="e.g. 3" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Date *</label>
                <input required type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Cause Category</label>
                <select value={logForm.cause_category} onChange={e => setLogForm({...logForm, cause_category: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30">
                  {CAUSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Notes (optional)</label>
                <input value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="Any notes about this activity..." />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowLogForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={submittingLog} className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
                {submittingLog ? 'Saving...' : 'Save Hours'}
              </button>
            </div>
          </form>
        )}

        {logs.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">⏱️</div>
            <p className="font-semibold mb-1">No hours logged yet</p>
            <p className="text-sm text-muted-foreground">Start tracking your volunteer contributions!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="flex items-start justify-between p-4 bg-muted rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{log.activity_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CAUSE_COLORS[log.cause_category] || 'bg-muted text-muted-foreground'}`}>{log.cause_category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{log.hours}h</span>
                    {log.date && <span>{format(new Date(log.date), 'MMM d, yyyy')}</span>}
                    {log.notes && <span>· {log.notes}</span>}
                  </div>
                </div>
                <button onClick={() => deleteLog(log)} className="p-1.5 hover:bg-card rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}