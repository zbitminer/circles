import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, FileText, Calendar, Clock, Briefcase, Shield, ChevronDown, UserX, UserCheck, Trophy, BarChart2 } from 'lucide-react';
import ImpactDashboard from '@/components/ImpactDashboard';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

function LeaderboardTab({ profiles, users }) {
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const ranked = profiles
    .filter(p => (p.total_hours || 0) > 0)
    .sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0))
    .slice(0, 20);

  const maxHours = ranked[0]?.total_hours || 1;

  if (ranked.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold mb-2">No hours logged yet</h3>
        <p className="text-muted-foreground text-sm">Once volunteers start logging hours, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top 3 podium */}
      {ranked.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-2">
          {[ranked[1], ranked[0], ranked[2]].map((p, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const u = userMap[p.user_id];
            const initials = u?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
            return (
              <div key={p.id} className={`bg-card rounded-2xl border p-4 text-center ${rank === 1 ? 'border-yellow-300 bg-yellow-50/50' : 'border-border'}`}>
                <div className="text-3xl mb-2">{MEDAL[rank]}</div>
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm mb-2 ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600'}`}>
                  {initials}
                </div>
                <p className="font-semibold text-sm truncate">{u?.full_name || 'Unknown'}</p>
                <p className="font-display text-xl font-bold text-primary mt-1">{p.total_hours}h</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full ranked list */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="font-display text-lg font-bold">Volunteer Leaderboard</h2>
        </div>
        <div className="divide-y divide-border">
          {ranked.map((p, idx) => {
            const rank = idx + 1;
            const u = userMap[p.user_id];
            const initials = u?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
            const pct = Math.round(((p.total_hours || 0) / maxHours) * 100);
            return (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                <span className="w-8 text-center font-bold text-sm text-muted-foreground">
                  {MEDAL[rank] || `#${rank}`}
                </span>
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u?.full_name || 'Unknown'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
                <span className="font-display text-lg font-bold text-primary whitespace-nowrap">{p.total_hours}h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: 0, posts: 0, events: 0, opportunities: 0, hours: 0 });
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [hourLogs, setHourLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.role === 'admin') loadData();
    }).catch(() => {});
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [posts, evts, opps, profiles, userList, logs] = await Promise.all([
      base44.entities.Post.list('-created_date', 200),
      base44.entities.Event.list('-created_date', 200),
      base44.entities.Opportunity.list('-created_date', 200),
      base44.entities.VolunteerProfile.list(),
      base44.entities.User.list(),
      base44.entities.HourLog.list('-date', 500),
    ]);
    const totalHours = profiles.reduce((sum, p) => sum + (p.total_hours || 0), 0);
    setStats({
      users: userList.length,
      posts: posts.filter(p => p.status !== 'removed').length,
      events: evts.length,
      opportunities: opps.filter(o => o.status === 'active').length,
      hours: Math.round(totalHours),
    });
    setUsers(userList);
    setProfiles(profiles);
    setHourLogs(logs);
    setEvents(evts);
    setLoading(false);
  };

  const updateRole = async (userId, role) => {
    await base44.entities.User.update(userId, { role });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Admin Only</h1>
        <p className="text-muted-foreground">You need admin access to view this dashboard.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Members', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Posts', value: stats.posts, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Events', value: stats.events, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Opportunities', value: stats.opportunities, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Hours Logged', value: stats.hours, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Platform overview and management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-8 w-fit">
        {['overview', 'impact', 'users', 'leaderboard'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'impact' ? '📊 Impact' : t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="bg-card rounded-2xl border border-border animate-pulse h-28" />)}
        </div>
      ) : tab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-card rounded-2xl border border-border p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="font-display text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-lg font-bold mb-4">Platform Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Posts</span>
                  <span className="font-medium">{stats.posts}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, stats.posts * 2)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium">{stats.users}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, stats.users * 5)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Volunteer Hours</span>
                  <span className="font-medium">{stats.hours}h</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, stats.hours)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : tab === 'impact' ? (
        <ImpactDashboard hourLogs={hourLogs} profiles={profiles} events={events} posts={[]} />
      ) : tab === 'leaderboard' ? (
        <LeaderboardTab profiles={profiles} users={users} />
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-lg font-bold">All Members ({users.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {u.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.full_name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.role === 'admin' ? 'bg-primary/10 text-primary' :
                    u.role === 'moderator' ? 'bg-purple-100 text-purple-800' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {u.role || 'user'}
                  </span>
                  {u.id !== user.id && (
                    <select
                      value={u.role || 'user'}
                      onChange={e => updateRole(u.id, e.target.value)}
                      className="text-xs bg-muted rounded-lg px-2 py-1.5 outline-none border border-transparent focus:border-primary/30"
                    >
                      <option value="user">Member</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}