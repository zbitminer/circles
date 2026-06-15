import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Users, Clock, Award, Calendar, UserPlus, UserCheck } from 'lucide-react';

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

export default function Directory() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

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
      const myProfiles = allProfiles.filter(p => p.user_id === u.id);
      if (myProfiles[0]) {
        setCurrentProfile(myProfiles[0]);
        setFollowing(myProfiles[0].following || []);
      }
    }
    setLoading(false);
  };

  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const enriched = profiles
    .map(p => ({ ...p, user: userMap[p.user_id] }))
    .filter(p => p.user)
    .filter(p => !currentUser || p.user_id !== currentUser.id);

  const filtered = enriched.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.user?.full_name?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.causes?.some(c => c.toLowerCase().includes(q))
    );
  });

  const handleFollow = async (profileUserId) => {
    if (!currentUser || !currentProfile) return;
    const isFollowing = following.includes(profileUserId);
    const newFollowing = isFollowing
      ? following.filter(id => id !== profileUserId)
      : [...following, profileUserId];

    setFollowing(newFollowing);
    await base44.entities.VolunteerProfile.update(currentProfile.id, { following: newFollowing });

    // Update the target's followers list
    const targetProfile = profiles.find(p => p.user_id === profileUserId);
    if (targetProfile) {
      const targetFollowers = targetProfile.followers || [];
      const newFollowers = isFollowing
        ? targetFollowers.filter(id => id !== currentUser.id)
        : [...targetFollowers, currentUser.id];
      await base44.entities.VolunteerProfile.update(targetProfile.id, { followers: newFollowers });
      setProfiles(prev => prev.map(p => p.user_id === profileUserId ? { ...p, followers: newFollowers } : p));
    }

    setCurrentProfile(prev => ({ ...prev, following: newFollowing }));
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">Member Directory</h1>
        <p className="text-muted-foreground text-sm">Browse volunteers, see their impact, and follow each other</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, cause, or location..."
          className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{filtered.length} volunteer{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse h-52" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold mb-2">No members found</h3>
          <p className="text-muted-foreground text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(profile => {
            const isFollowed = following.includes(profile.user_id);
            return (
              <div
                key={profile.id}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/20 transition-all group"
              >
                {/* Card header */}
                <div className="bg-primary px-5 pt-5 pb-8 relative">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-white text-lg font-bold border-2 border-white/20">
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
                      : initials(profile.user?.full_name)}
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 -mt-4 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground leading-tight">{profile.user?.full_name}</h3>
                      {profile.location && <p className="text-xs text-muted-foreground mt-0.5">📍 {profile.location}</p>}
                    </div>
                    {currentUser && (
                      <button
                        onClick={() => handleFollow(profile.user_id)}
                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 ${
                          isFollowed
                            ? 'bg-primary/10 text-primary'
                            : 'bg-accent text-white hover:opacity-90'
                        }`}
                      >
                        {isFollowed ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{profile.bio}</p>
                  )}

                  {/* Impact stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center bg-muted rounded-xl py-2">
                      <p className="font-display font-bold text-sm text-foreground">{profile.total_hours || 0}</p>
                      <p className="text-xs text-muted-foreground">hrs</p>
                    </div>
                    <div className="text-center bg-muted rounded-xl py-2">
                      <p className="font-display font-bold text-sm text-foreground">{profile.events_attended || 0}</p>
                      <p className="text-xs text-muted-foreground">events</p>
                    </div>
                    <div className="text-center bg-muted rounded-xl py-2">
                      <p className="font-display font-bold text-sm text-foreground">{profile.followers?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">followers</p>
                    </div>
                  </div>

                  {/* Causes */}
                  {profile.causes?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {profile.causes.slice(0, 3).map(c => (
                        <span key={c} className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAUSE_COLORS[c] || 'bg-muted text-muted-foreground'}`}>
                          {c}
                        </span>
                      ))}
                      {profile.causes.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{profile.causes.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}