import { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Users, Clock, Calendar, UserPlus, UserCheck, MapPin, X, Heart } from 'lucide-react';

const CAUSES = ['Environment', 'Education', 'Health', 'Animals', 'Community', 'Elderly', 'Youth', 'Disaster Relief', 'Arts & Culture', 'Other'];

const CAUSE_COLORS = {
  'Environment': 'bg-green-100 text-green-800',
  'Education': 'bg-blue-100 text-blue-800',
  'Health': 'bg-red-100 text-red-800',
  'Animals': 'bg-yellow-100 text-yellow-800',
  'Community': 'bg-purple-100 text-purple-800',
  'Elderly': 'bg-orange-100 text-orange-800',
  'Youth': 'bg-pink-100 text-pink-800',
  'Disaster Relief': 'bg-gray-100 text-gray-800',
  'Arts & Culture': 'bg-indigo-100 text-indigo-800',
  'Other': 'bg-muted text-muted-foreground',
};

const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

function Avatar({ profile, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl rounded-2xl' : 'w-14 h-14 text-lg rounded-xl';
  return (
    <div className={`${sizeClass} bg-accent flex items-center justify-center text-white font-bold border-2 border-white/20 flex-shrink-0 overflow-hidden`}>
      {profile.avatar_url
        ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
        : initials(profile.user?.full_name || profile.author_name)}
    </div>
  );
}

function ProfileModal({ profile, currentUser, following, onFollow, onClose, myCauses }) {
  const sharedCauses = myCauses.filter(c => profile.causes?.includes(c));
  const isFollowed = following.includes(profile.user_id);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-primary px-6 pt-6 pb-10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg">
            <X className="w-4 h-4 text-primary-foreground" />
          </button>
          <Avatar profile={profile} size="lg" />
        </div>

        <div className="px-6 -mt-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{profile.user?.full_name}</h2>
              {profile.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {profile.location}
                </p>
              )}
            </div>
            {currentUser && (
              <button
                onClick={() => onFollow(profile.user_id)}
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-semibold transition-all ${
                  isFollowed ? 'bg-primary/10 text-primary' : 'bg-accent text-white hover:opacity-90'
                }`}
              >
                {isFollowed ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isFollowed ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Hours', value: profile.total_hours || 0, icon: Clock },
              { label: 'Events', value: profile.events_attended || 0, icon: Calendar },
              { label: 'Followers', value: profile.followers?.length || 0, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-muted rounded-xl py-3 text-center">
                <p className="font-display font-bold text-lg text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profile.bio}</p>
          )}

          {/* Shared causes */}
          {sharedCauses.length > 0 && (
            <div className="bg-accent/10 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs font-semibold text-accent mb-2 flex items-center gap-1">
                <Heart className="w-3 h-3" /> {sharedCauses.length} shared cause{sharedCauses.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1">
                {sharedCauses.map(c => (
                  <span key={c} className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAUSE_COLORS[c]}`}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* All causes */}
          {profile.causes?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Passionate about</p>
              <div className="flex flex-wrap gap-1">
                {profile.causes.map(c => (
                  <span key={c} className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAUSE_COLORS[c] || 'bg-muted text-muted-foreground'}`}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Directory() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [causeFilter, setCauseFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [following, setFollowing] = useState([]);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [u, allProfiles, allUsers] = await Promise.all([
      base44.auth.me().catch(() => null),
      base44.entities.VolunteerProfile.list(),
      base44.entities.User.list(),
    ]);
    setCurrentUser(u);
    setUsers(allUsers);
    setProfiles(allProfiles);
    if (u) {
      const mine = allProfiles.find(p => p.user_id === u.id);
      if (mine) { setCurrentProfile(mine); setFollowing(mine.following || []); }
    }
    setLoading(false);
  };

  const userMap = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);

  const myCauses = currentProfile?.causes || [];

  const enriched = useMemo(() =>
    profiles
      .map(p => ({ ...p, user: userMap[p.user_id] || { full_name: p.user_id.startsWith('sample_') ? p.user_id.replace('sample_', '').replace(/^\w/, c => c.toUpperCase()) : p.user_id } }))
      .filter(p => !currentUser || p.user_id !== currentUser.id),
    [profiles, userMap, currentUser]
  );

  const filtered = useMemo(() => enriched.filter(p => {
    const matchesCause = causeFilter === 'All' || p.causes?.includes(causeFilter);
    if (!matchesCause) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.user?.full_name?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.causes?.some(c => c.toLowerCase().includes(q))
    );
  }), [enriched, causeFilter, search]);

  // Suggested: share causes with me, not yet following
  const suggested = useMemo(() =>
    myCauses.length > 0
      ? enriched
          .filter(p => !following.includes(p.user_id) && p.causes?.some(c => myCauses.includes(c)))
          .sort((a, b) => {
            const aShared = a.causes?.filter(c => myCauses.includes(c)).length || 0;
            const bShared = b.causes?.filter(c => myCauses.includes(c)).length || 0;
            return bShared - aShared;
          })
          .slice(0, 4)
      : [],
    [enriched, following, myCauses]
  );

  const handleFollow = async (profileUserId) => {
    if (!currentUser || !currentProfile) return;
    const isFollowing = following.includes(profileUserId);
    const newFollowing = isFollowing ? following.filter(id => id !== profileUserId) : [...following, profileUserId];
    setFollowing(newFollowing);
    await base44.entities.VolunteerProfile.update(currentProfile.id, { following: newFollowing });
    const targetProfile = profiles.find(p => p.user_id === profileUserId);
    if (targetProfile) {
      const newFollowers = isFollowing
        ? (targetProfile.followers || []).filter(id => id !== currentUser.id)
        : [...(targetProfile.followers || []), currentUser.id];
      await base44.entities.VolunteerProfile.update(targetProfile.id, { followers: newFollowers });
      setProfiles(prev => prev.map(p => p.user_id === profileUserId ? { ...p, followers: newFollowers } : p));
    }
    setCurrentProfile(prev => ({ ...prev, following: newFollowing }));
    if (selected?.user_id === profileUserId) setSelected(prev => ({ ...prev }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">Member Discovery</h1>
        <p className="text-muted-foreground text-sm">Browse volunteers, see shared causes, and connect with your community</p>
      </div>

      {/* Suggested section */}
      {suggested.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" /> People You May Know
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {suggested.map(profile => {
              const sharedCount = profile.causes?.filter(c => myCauses.includes(c)).length || 0;
              const isFollowed = following.includes(profile.user_id);
              return (
                <div key={profile.id} className="bg-card border border-border rounded-2xl p-4 text-center hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelected(profile)}>
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold overflow-hidden">
                      {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : initials(profile.user?.full_name)}
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-foreground leading-tight mb-1">{profile.user?.full_name}</p>
                  <p className="text-xs text-accent font-medium mb-3">{sharedCount} shared cause{sharedCount !== 1 ? 's' : ''}</p>
                  <button
                    onClick={e => { e.stopPropagation(); handleFollow(profile.user_id); }}
                    className={`w-full text-xs py-1.5 rounded-lg font-semibold transition-all ${isFollowed ? 'bg-primary/10 text-primary' : 'bg-accent text-white hover:opacity-90'}`}
                  >
                    {isFollowed ? '✓ Following' : '+ Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, cause, or location..."
            className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1 flex-wrap">
          {['All', ...CAUSES].map(c => (
            <button key={c} onClick={() => setCauseFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${causeFilter === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{filtered.length} volunteer{filtered.length !== 1 ? 's' : ''}</span>
        {causeFilter !== 'All' && <span>in <strong>{causeFilter}</strong></span>}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse h-52" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold mb-2">No members found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(profile => {
            const isFollowed = following.includes(profile.user_id);
            const sharedCauses = myCauses.filter(c => profile.causes?.includes(c));
            return (
              <div key={profile.id} onClick={() => setSelected(profile)}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group">
                <div className="bg-primary px-5 pt-5 pb-8">
                  <Avatar profile={profile} />
                </div>
                <div className="px-5 -mt-4 pb-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground leading-tight">{profile.user?.full_name}</h3>
                      {profile.location && <p className="text-xs text-muted-foreground mt-0.5">📍 {profile.location}</p>}
                    </div>
                    {currentUser && (
                      <button onClick={e => { e.stopPropagation(); handleFollow(profile.user_id); }}
                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 ${
                          isFollowed ? 'bg-primary/10 text-primary' : 'bg-accent text-white hover:opacity-90'
                        }`}>
                        {isFollowed ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                  {profile.bio && <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{profile.bio}</p>}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center bg-muted rounded-xl py-2">
                      <p className="font-display font-bold text-sm">{profile.total_hours || 0}</p>
                      <p className="text-xs text-muted-foreground">hrs</p>
                    </div>
                    <div className="text-center bg-muted rounded-xl py-2">
                      <p className="font-display font-bold text-sm">{profile.events_attended || 0}</p>
                      <p className="text-xs text-muted-foreground">events</p>
                    </div>
                    <div className="text-center bg-muted rounded-xl py-2">
                      <p className="font-display font-bold text-sm">{profile.followers?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">followers</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sharedCauses.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-accent/15 text-accent">
                        ❤️ {sharedCauses.length} shared
                      </span>
                    )}
                    {profile.causes?.filter(c => !myCauses.includes(c)).slice(0, 2).map(c => (
                      <span key={c} className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAUSE_COLORS[c] || 'bg-muted text-muted-foreground'}`}>{c}</span>
                    ))}
                    {profile.causes?.length > (sharedCauses.length > 0 ? 2 : 3) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{profile.causes.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <ProfileModal
          profile={selected}
          currentUser={currentUser}
          following={following}
          onFollow={handleFollow}
          onClose={() => setSelected(null)}
          myCauses={myCauses}
        />
      )}
    </div>
  );
}