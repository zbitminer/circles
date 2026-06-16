import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Clock, Award, Calendar, Plus, Trash2, Edit2, Check, Camera, Rss, Briefcase, AlertTriangle, Utensils, Users, MessageSquarePlus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import BadgeDisplay from '@/components/BadgeDisplay';
import ReviewCard from '@/components/ReviewCard';
import StarRating from '@/components/StarRating';

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
  const [badges, setBadges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, content: '' });

  useEffect(() => { loadAll(); }, []);

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
    const badgesList = await base44.entities.Badge.filter({ user_id: u.id });
    setBadges(badgesList);
    const reviewsList = await base44.entities.Review.filter({ reviewee_id: u.id });
    setReviews(reviewsList);
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
          <div className="h-32 rounded-2xl" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }} />
          <div className="h-48 rounded-2xl" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8 space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="h-24" style={{ background: 'linear-gradient(135deg, #1A2744, #2d4070)', borderBottom: '2px solid #C9A84C' }} />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold overflow-hidden" style={{ background: '#C9A84C', border: '4px solid #FAF7EE' }}>
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
              <h1 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>{user?.full_name}</h1>
              {profile?.location && <p className="text-sm" style={{ color: '#6b5c3e' }}>📍 {profile.location}</p>}
            </div>
          </div>

          {editingBio ? (
            <div className="space-y-3">
              <textarea value={bioText} onChange={e => setBioText(e.target.value)} placeholder="Tell the community about yourself and why you volunteer..." rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" />
              <input value={locationText} onChange={e => setLocationText(e.target.value)} placeholder="Your city or region" className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: '#6b5c3e' }}>Causes you care about:</p>
                <div className="flex flex-wrap gap-1.5">
                  {CAUSES.map(cause => (
                    <button key={cause} type="button" onClick={() => toggleCause(cause)}
                      className="text-xs px-2.5 py-1 rounded-full transition-all"
                      style={selectedCauses.includes(cause)
                        ? { background: '#1A2744', color: '#F5E6C0', border: '1px solid #1A2744' }
                        : { background: '#f0e8d0', color: '#6b5c3e', border: '1px solid #C9A84C' }
                      }>
                      {cause}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveBio} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl hover:opacity-90" style={{ background: '#C9A84C', color: '#1A2744' }}>
                  <Check className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setEditingBio(false)} className="px-4 py-2 text-sm" style={{ color: '#6b5c3e' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b5c3e' }}>
                {profile?.bio || 'No bio yet. Tell the community about yourself!'}
              </p>
              {profile?.causes?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.causes.map(c => (
                    <span key={c} className={`text-xs px-2.5 py-1 rounded-full font-medium ${CAUSE_COLORS[c] || 'bg-muted text-muted-foreground'}`}>{c}</span>
                  ))}
                </div>
              )}
              <button onClick={() => setEditingBio(true)} className="flex items-center gap-2 text-sm transition-colors" style={{ color: '#C9A84C' }}>
                <Edit2 className="w-3.5 h-3.5" /> Edit profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock, label: 'Hours Volunteered', value: profile?.total_hours || 0, iconColor: '#1A2744', bgColor: 'rgba(26,39,68,0.10)' },
          { icon: Calendar, label: 'Events Attended', value: profile?.events_attended || 0, iconColor: '#C9A84C', bgColor: 'rgba(201,168,76,0.15)' },
          { icon: Award, label: 'Opportunities', value: profile?.opportunities_completed || 0, iconColor: '#6b8f6e', bgColor: '#e8f5e9' },
        ].map(({ icon: Icon, label, value, iconColor, bgColor }) => (
          <div key={label} className="rounded-2xl p-5 text-center" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: bgColor }}>
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <p className="font-display text-3xl font-bold" style={{ color: '#1A2744' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: '#6b5c3e' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Community Control Panel */}
      <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#1A2744' }}>Community Control Panel</h2>
        <p className="text-sm mb-5" style={{ color: '#6b5c3e' }}>Jump into community action from right here</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { to: '/feed', Icon: Rss, label: 'Community Feed', sub: 'Post & interact', iconColor: '#1A2744', bg: 'rgba(26,39,68,0.10)' },
            { to: '/opportunities', Icon: Briefcase, label: 'Opportunities', sub: 'Find volunteer roles', iconColor: '#C9A84C', bg: 'rgba(201,168,76,0.15)' },
            { to: '/events', Icon: Calendar, label: 'Events', sub: 'RSVP & attend', iconColor: '#7c5cbf', bg: '#ede7f6' },
            { to: '/sos', Icon: AlertTriangle, label: 'SOS Board', sub: 'Urgent help requests', iconColor: '#c0392b', bg: '#fdecea' },
            { to: '/shabbat', Icon: Utensils, label: 'Shabbat Meals', sub: 'Host or join a table', iconColor: '#8a6a10', bg: 'rgba(201,168,76,0.20)' },
            { to: '/directory', Icon: Users, label: 'Directory', sub: 'Browse members', iconColor: '#2d7a3a', bg: '#e8f5e9' },
          ].map(({ to, Icon, label, sub, iconColor, bg }) => (
            <Link key={to} to={to} className="group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all text-center hover:shadow-md" style={{ background: '#f0e8d0', border: '1px solid #d4b97a' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1A2744' }}>{label}</p>
                <p className="text-xs" style={{ color: '#6b5c3e' }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <BadgeDisplay badges={badges} />
        </div>
      )}

      {/* Reviews */}
      <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold" style={{ color: '#1A2744' }}>Community Reviews</h2>
          <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-sm px-3 py-1.5 rounded-lg transition-colors" style={{ background: '#f0e8d0', color: '#1A2744' }}>
            + Write Review
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            await base44.entities.Review.create({
              reviewer_id: user.id,
              reviewer_name: user.full_name,
              reviewee_id: profile.user_id,
              rating: reviewForm.rating,
              content: reviewForm.content,
              review_type: 'volunteer'
            });
            setReviewForm({ rating: 0, content: '' });
            setShowReviewForm(false);
            loadAll();
          }} className="mb-5 p-4 rounded-xl space-y-3" style={{ background: '#f0e8d0' }}>
            <div>
              <label className="text-xs font-medium" style={{ color: '#6b5c3e' }}>Rating</label>
              <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({...reviewForm, rating: r})} />
            </div>
            <div>
              <textarea value={reviewForm.content} onChange={e => setReviewForm({...reviewForm, content: e.target.value})} placeholder="Share your experience..." rows={2} className="w-full bg-white rounded-lg px-3 py-2 text-sm outline-none border" required />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowReviewForm(false)} className="text-xs px-3 py-1" style={{ color: '#6b5c3e' }}>Cancel</button>
              <button type="submit" className="text-xs px-4 py-1.5 rounded-lg font-semibold" style={{ background: '#1A2744', color: '#F5E6C0' }}>Post Review</button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#6b5c3e' }}>No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        )}
      </div>

      {/* Hour Logs */}
      <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold" style={{ color: '#1A2744' }}>Volunteer Hours Log</h2>
          <button onClick={() => setShowLogForm(!showLogForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
            <Plus className="w-4 h-4" /> Log Hours
          </button>
        </div>

        {showLogForm && (
          <form onSubmit={submitLog} className="rounded-xl p-4 mb-5 space-y-3" style={{ background: '#f0e8d0', border: '1px solid #d4b97a' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Activity Name *</label>
                <input required value={logForm.activity_name} onChange={e => setLogForm({...logForm, activity_name: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="e.g. Food bank volunteering" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Hours *</label>
                <input required type="number" min="0.5" step="0.5" value={logForm.hours} onChange={e => setLogForm({...logForm, hours: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="e.g. 3" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Date *</label>
                <input required type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Cause Category</label>
                <select value={logForm.cause_category} onChange={e => setLogForm({...logForm, cause_category: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30">
                  {CAUSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Notes (optional)</label>
                <input value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="Any notes about this activity..." />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowLogForm(false)} className="px-4 py-2 text-sm" style={{ color: '#6b5c3e' }}>Cancel</button>
              <button type="submit" disabled={submittingLog} className="px-5 py-2 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
                {submittingLog ? 'Saving...' : 'Save Hours'}
              </button>
            </div>
          </form>
        )}

        {logs.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">⏱️</div>
            <p className="font-semibold mb-1" style={{ color: '#1A2744' }}>No hours logged yet</p>
            <p className="text-sm" style={{ color: '#6b5c3e' }}>Start tracking your volunteer contributions!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="flex items-start justify-between p-4 rounded-xl" style={{ background: '#f0e8d0', border: '1px solid #d4b97a' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: '#1A2744' }}>{log.activity_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CAUSE_COLORS[log.cause_category] || 'bg-muted text-muted-foreground'}`}>{log.cause_category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#888' }}>
                    <span className="font-semibold" style={{ color: '#C9A84C' }}>{log.hours}h</span>
                    {log.date && <span>{format(new Date(log.date), 'MMM d, yyyy')}</span>}
                    {log.notes && <span>· {log.notes}</span>}
                  </div>
                </div>
                <button onClick={() => deleteLog(log)} className="p-1.5 rounded-lg transition-colors hover:text-red-600" style={{ color: '#aaa' }}>
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