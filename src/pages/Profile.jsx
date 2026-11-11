import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { Clock, Award, Calendar, Plus, Trash2, Edit2, Check, Camera, Rss, Briefcase, AlertTriangle, Utensils, Users, MessageSquarePlus, Shield, Eye, EyeOff, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import BadgeDisplay from '@/components/BadgeDisplay';
import ProfileCalendar from '@/components/ProfileCalendar';
import ReviewCard from '@/components/ReviewCard';
import MyContentPanel from '@/components/content/MyContentPanel';
import OpportunityMatcher from '@/components/agents/OpportunityMatcher';
import DeleteAccountSection from '@/components/profile/DeleteAccountSection';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';

const CAUSES = ['Companionship', 'Food', 'Home', 'Skill Sharing', 'Technology', 'Transportation'];

const CAUSE_COLORS = {
  'Companionship': 'bg-orange-100 text-orange-800',
  'Food': 'bg-yellow-100 text-yellow-800',
  'Home': 'bg-gray-100 text-gray-800',
  'Skill Sharing': 'bg-pink-100 text-pink-800',
  'Technology': 'bg-indigo-100 text-indigo-800',
  'Transportation': 'bg-blue-100 text-blue-800',
};

export default function Profile() {
  const { localize, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ activity_name: '', hours: '', date: '', cause_category: 'Food', notes: '' });
  const [submittingLog, setSubmittingLog] = useState(false);
  const [badges, setBadges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [privacy, setPrivacy] = useState({ phone_visibility: 'private', location_visibility: 'public', bio_visibility: 'public' });
  const [showPrivacyPanel, setShowPrivacyPanel] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const u = await base44.auth.me();
    setUser(u);
    const profiles = await base44.entities.VolunteerProfile.filter({ user_id: u.id });
    let p = profiles[0];
    if (!p) {
      p = await base44.entities.VolunteerProfile.create({ user_id: u.id, display_name: u.full_name || 'Community Member', causes: [] });
    }
    setProfile(p);
    setBioText(p.bio || '');
    setLocationText(p.location || '');
    setSelectedCauses(p.causes || []);
    setPrivacy({
      phone_visibility: p.phone_visibility || 'private',
      location_visibility: p.location_visibility || 'public',
      bio_visibility: p.bio_visibility || 'public'
    });
    // Proactively check for matching opportunities and create missing notifications
    if (p.causes && p.causes.length > 0) {
      base44.functions.invoke('notifyMatchingOpportunities', { data: { causes: p.causes } }).catch(() => {});
    }
    const hourLogs = await base44.entities.HourLog.filter({ user_id: u.id }, '-created_date');
    setLogs(hourLogs);
    const badgesList = await base44.entities.Badge.filter({ user_id: u.id }, '-created_date');
    setBadges(badgesList);
    const reviewsList = await base44.entities.Review.filter({ reviewee_id: u.id }, '-created_date');
    setReviews(reviewsList);
    setLoading(false);
  };

  const saveBio = async () => {
    await base44.entities.VolunteerProfile.update(profile.id, { bio: bioText, location: locationText, causes: selectedCauses });
    setProfile(prev => ({ ...prev, bio: bioText, location: locationText, causes: selectedCauses }));
    setEditingBio(false);
    // Check for matching opportunities with the updated causes
    if (selectedCauses.length > 0) {
      base44.functions.invoke('notifyMatchingOpportunities', { data: { causes: selectedCauses } }).catch(() => {});
    }
  };

  const toggleCause = (cause) => {
    setSelectedCauses(prev => prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]);
  };

  const savePrivacy = async () => {
    await base44.entities.VolunteerProfile.update(profile.id, privacy);
    setShowPrivacyPanel(false);
  };

  const submitLog = async (e) => {
    e.preventDefault();
    setSubmittingLog(true);
    const hours = parseFloat(logForm.hours);
    if (!Number.isFinite(hours) || hours <= 0 || hours > 24) {
      alert(t('Please enter between 0.25 and 24 hours.'));
      setSubmittingLog(false);
      return;
    }
    // New logs start as "pending"; they count toward your total once an admin approves them.
    await base44.entities.HourLog.create({ ...logForm, hours, user_id: user.id });
    setLogForm({ activity_name: '', hours: '', date: '', cause_category: 'Food', notes: '' });
    setShowLogForm(false);
    setSubmittingLog(false);
    const updated = await base44.entities.HourLog.filter({ user_id: user.id }, '-created_date');
    setLogs(updated);
  };

  const deleteLog = async (log) => {
    try {
      await base44.entities.HourLog.delete(log.id);
    } catch {
      alert(t('Only pending logs can be deleted. Please contact an admin.'));
      return;
    }
    setLogs(prev => prev.filter(l => l.id !== log.id));
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const avatarInputRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    await base44.entities.VolunteerProfile.update(profile.id, { avatar_url: file_url });
    setProfile(prev => ({ ...prev, avatar_url: file_url }));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-2xl" style={{ background: '#fcfaf8', border: '1px solid #bd4c0f' }} />
          <div className="h-48 rounded-2xl" style={{ background: '#fcfaf8', border: '1px solid #bd4c0f' }} />
        </div>
      </div>
    );
  }

  return localize(
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8 space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <div className="h-24" style={{ background: 'linear-gradient(135deg, #141414, #141414)', borderBottom: '2px solid #bd4c0f' }} />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold overflow-hidden" style={{ background: '#bd4c0f', border: '4px solid #fcfaf8' }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div className="self-start">
              <h1 className="font-display text-2xl font-bold text-white">{user?.full_name}</h1>
              {profile?.location && <p className="text-sm mt-2" style={{ color: '#6b7280' }}>📍 {profile.location}</p>}
            </div>
          </div>

          {editingBio ? (
            <div className="space-y-3">
              <textarea value={bioText} onChange={e => setBioText(e.target.value)} placeholder="Tell the community about yourself and why you volunteer..." rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" />
              <input value={locationText} onChange={e => setLocationText(e.target.value)} placeholder="Your city or region" className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>Causes you care about:</p>
                <div className="flex flex-wrap gap-1.5">
                  {CAUSES.map(cause => (
                    <button key={cause} type="button" onClick={() => toggleCause(cause)}
                      className="text-xs px-2.5 py-1 rounded-full transition-all"
                      style={selectedCauses.includes(cause)
                        ? { background: '#141414', color: '#fbe8d4', border: '1px solid #141414' }
                        : { background: '#fbe8d4', color: '#6b7280', border: '1px solid #bd4c0f' }
                      }>
                      {cause}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveBio} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl hover:opacity-90" style={{ background: '#bd4c0f', color: '#141414' }}>
                  <Check className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setEditingBio(false)} className="px-4 py-2 text-sm" style={{ color: '#6b7280' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                {profile?.bio || 'No bio yet. Tell the community about yourself!'}
              </p>
              {profile?.causes?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.causes.map(c => (
                    <span key={c} className={`text-xs px-2.5 py-1 rounded-full font-medium ${CAUSE_COLORS[c] || 'bg-muted text-muted-foreground'}`}>{c}</span>
                  ))}
                </div>
              )}
              <button onClick={() => setEditingBio(true)} className="flex items-center gap-2 text-sm transition-colors" style={{ color: '#bd4c0f' }}>
                <Edit2 className="w-3.5 h-3.5" /> Edit profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock, label: 'Hours Volunteered', value: profile?.total_hours || 0, iconColor: '#141414', bgColor: 'rgba(26,39,68,0.10)' },
          { icon: Calendar, label: 'Events Attended', value: profile?.events_attended || 0, iconColor: '#bd4c0f', bgColor: 'rgba(201,168,76,0.15)' },
          { icon: Award, label: 'Opportunities', value: profile?.opportunities_completed || 0, iconColor: '#6b8f6e', bgColor: '#e8f5e9' },
        ].map(({ icon: Icon, label, value, iconColor, bgColor }) => (
          <div key={label} className="rounded-2xl p-5 text-center" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: bgColor }}>
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <p className="font-display text-3xl font-bold" style={{ color: '#141414' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{label}</p>
          </div>
        ))}
      </div>

      <OpportunityMatcher />

      {/* Community Control Panel */}
      <div className="rounded-2xl p-6" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#141414' }}>Community Control Panel</h2>
        <p className="text-sm mb-5" style={{ color: '#6b7280' }}>Jump into community action from right here</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ...(user?.role === 'admin' ? [{ to: '/admin', Icon: Shield, label: 'Admin Dashboard', sub: 'Manage site & content', iconColor: '#bd4c0f', bg: 'rgba(201,168,76,0.20)' }] : []),
            { to: '/feed', Icon: Rss, label: 'Community Feed', sub: 'Post & interact', iconColor: '#141414', bg: 'rgba(26,39,68,0.10)' },
            { to: '/opportunities', Icon: Briefcase, label: 'Opportunities', sub: 'Find volunteer roles', iconColor: '#bd4c0f', bg: 'rgba(201,168,76,0.15)' },
            { to: '/events', Icon: Calendar, label: 'Events', sub: 'RSVP & attend', iconColor: '#7c5cbf', bg: '#ede7f6' },
            { to: '/workshops?tab=lead', Icon: Plus, label: 'Create Workshop', sub: 'Lead a new workshop', iconColor: '#141414', bg: 'rgba(26,39,68,0.10)' },
            { to: '/sos', Icon: AlertTriangle, label: 'SOS Board', sub: 'Urgent help requests', iconColor: '#c0392b', bg: '#fdecea' },
            { to: '/shabbat', Icon: Utensils, label: 'Shabbat Meals', sub: 'Host or join a table', iconColor: '#8a6a10', bg: 'rgba(201,168,76,0.20)' },
            { to: '/directory', Icon: Users, label: 'Member Discovery', sub: 'Browse & follow members', iconColor: '#2d7a3a', bg: '#e8f5e9' },
          ].map(({ to, Icon, label, sub, iconColor, bg }) => (
            <Link key={to} to={to} className="group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all text-center hover:shadow-md" style={{ background: '#fbe8d4', border: '1px solid #f5a13c' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#141414' }}>{label}</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <ProfileCalendar userId={user.id} />

      <MyContentPanel userId={user.id} />

      {/* Privacy Settings */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <button
          onClick={() => setShowPrivacyPanel(!showPrivacyPanel)}
          className="w-full flex items-center justify-between p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(26,39,68,0.10)' }}>
              <Shield className="w-5 h-5" style={{ color: '#141414' }} />
            </div>
            <div className="text-left">
              <h2 className="font-display text-lg font-bold" style={{ color: '#141414' }}>Privacy Settings</h2>
              <p className="text-xs" style={{ color: '#6b7280' }}>Control who can see your personal information</p>
            </div>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#bd4c0f' }}>{showPrivacyPanel ? 'Hide' : 'Manage'}</span>
        </button>
        {showPrivacyPanel && (
          <div className="px-6 pb-6 space-y-3">
            {[
              { key: 'phone_visibility', label: 'Phone Number', icon: MessageSquarePlus },
              { key: 'location_visibility', label: 'Location', icon: MapPin },
              { key: 'bio_visibility', label: 'Bio', icon: Eye },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#fbe8d4', border: '1px solid #f5a13c' }}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: '#141414' }} />
                  <span className="text-sm font-medium" style={{ color: '#141414' }}>{label}</span>
                </div>
                <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#fff', border: '1px solid #f5a13c' }}>
                  <button
                    onClick={() => setPrivacy(prev => ({ ...prev, [key]: 'public' }))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                    style={privacy[key] === 'public'
                      ? { background: '#141414', color: '#fbe8d4' }
                      : { color: '#6b7280' }
                    }
                  >
                    <Eye className="w-3 h-3" /> Visible
                  </button>
                  <button
                    onClick={() => setPrivacy(prev => ({ ...prev, [key]: 'private' }))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                    style={privacy[key] === 'private'
                      ? { background: '#141414', color: '#fbe8d4' }
                      : { color: '#6b7280' }
                    }
                  >
                    <EyeOff className="w-3 h-3" /> Hidden
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowPrivacyPanel(false)} className="px-4 py-2 text-sm" style={{ color: '#6b7280' }}>Cancel</button>
              <button onClick={savePrivacy} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl hover:opacity-90" style={{ background: '#bd4c0f', color: '#141414' }}>
                <Check className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
          <BadgeDisplay badges={badges} />
        </div>
      )}

      {/* Reviews */}
      <div className="rounded-2xl p-6" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold" style={{ color: '#141414' }}>Community Reviews</h2>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#6b7280' }}>No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        )}
      </div>

      {/* Hour Logs */}
      <div className="rounded-2xl p-6" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold" style={{ color: '#141414' }}>Volunteer Hours Log</h2>
          <button onClick={() => setShowLogForm(!showLogForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: '#141414', color: '#fbe8d4', border: '1px solid #bd4c0f' }}>
            <Plus className="w-4 h-4" /> Log Hours
          </button>
        </div>

        {showLogForm && (
          <form onSubmit={submitLog} className="rounded-xl p-4 mb-5 space-y-3" style={{ background: '#fbe8d4', border: '1px solid #f5a13c' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Activity Name *</label>
                <input required value={logForm.activity_name} onChange={e => setLogForm({...logForm, activity_name: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="e.g. Food bank volunteering" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Hours *</label>
                <input required type="number" min="0.5" step="0.5" value={logForm.hours} onChange={e => setLogForm({...logForm, hours: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="e.g. 3" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Date *</label>
                <input required type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Cause Category</label>
                <BottomSheetSelect
                  label="Cause Category"
                  value={logForm.cause_category}
                  onChange={e => setLogForm({ ...logForm, cause_category: e.target.value })}
                  options={CAUSES}
                  className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Notes (optional)</label>
                <input value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} className="w-full bg-card rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/30" placeholder="Any notes about this activity..." />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowLogForm(false)} className="px-4 py-2 text-sm" style={{ color: '#6b7280' }}>Cancel</button>
              <button type="submit" disabled={submittingLog} className="px-5 py-2 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#141414', color: '#fbe8d4', border: '1px solid #bd4c0f' }}>
                {submittingLog ? 'Saving...' : 'Save Hours'}
              </button>
            </div>
          </form>
        )}

        {logs.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">⏱️</div>
            <p className="font-semibold mb-1" style={{ color: '#141414' }}>No hours logged yet</p>
            <p className="text-sm" style={{ color: '#6b7280' }}>Start tracking your volunteer contributions!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="flex items-start justify-between p-4 rounded-xl" style={{ background: '#fbe8d4', border: '1px solid #f5a13c' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: '#141414' }}>{log.activity_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CAUSE_COLORS[log.cause_category] || 'bg-muted text-muted-foreground'}`}>{log.cause_category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#888' }}>
                    <span className="font-semibold" style={{ color: '#bd4c0f' }}>{log.hours}h</span>
                    <span className="text-xs">{log.status === 'approved' ? '✓ approved' : log.status === 'rejected' ? '✗ rejected' : '⏳ pending'}</span>
                    {log.date && <span>{format(new Date(log.date), 'MMM d, yyyy')}</span>}
                    {log.notes && <span>· {log.notes}</span>}
                  </div>
                </div>
                {(log.status || 'pending') === 'pending' && <button onClick={() => deleteLog(log)} className="p-1.5 rounded-lg transition-colors hover:text-red-600" style={{ color: '#aaa' }}>
                  <Trash2 className="w-4 h-4" />
                </button>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Deletion */}
      <DeleteAccountSection user={user} profileId={profile?.id} />
    </div>
  );
}