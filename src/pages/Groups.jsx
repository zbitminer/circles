import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Users } from 'lucide-react';
import GroupCard from '@/components/groups/GroupCard';
import CreateGroupModal from '@/components/groups/CreateGroupModal';

const CATEGORY_FILTERS = ['All', 'Companionship', 'Food', 'Home', 'Skill Sharing', 'Technology', 'Transportation', 'Wellness', 'Other'];

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [g, me] = await Promise.all([
      base44.entities.Group.list('-created_date', 100),
      base44.auth.me().catch(() => null),
    ]);
    setGroups(g);
    if (me) {
      const mine = await base44.entities.GroupMembership.filter({ user_id: me.id });
      setMemberships(mine);
    }
    setLoading(false);
  };

  const membershipFor = (groupId) => memberships.find((m) => m.group_id === groupId);

  const handleJoin = async (group) => {
    if (!user) return;
    setJoiningId(group.id);
    try {
      await base44.entities.GroupMembership.create({
        group_id: group.id,
        user_id: user.id,
        user_name: user.full_name,
        role: 'member',
        status: 'active',
      });
      await base44.entities.Group.update(group.id, { member_count: (group.member_count || 0) + 1 });
      await loadData();
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeave = async (group) => {
    if (!user) return;
    const m = membershipFor(group.id);
    if (!m) return;
    setJoiningId(group.id);
    try {
      await base44.entities.GroupMembership.delete(m.id);
      await base44.entities.Group.update(group.id, { member_count: Math.max(0, (group.member_count || 1) - 1) });
      await loadData();
    } finally {
      setJoiningId(null);
    }
  };

  const filtered = groups.filter((g) => {
    const catMatch = categoryFilter === 'All' || g.category === categoryFilter;
    const searchMatch = search === '' || g.name.toLowerCase().includes(search.toLowerCase()) || (g.description || '').toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-2" style={{ color: '#D95D1A' }}>COMMUNITY GROUPS</span>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: '#1A1A1A' }}>Groups</h1>
          <p className="text-sm" style={{ color: '#555' }}>Find your people — join groups around shared causes and interests.</p>
        </div>
        {user && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A1A1A', color: '#fff', border: '1px solid #C99738' }}>
            <Plus className="w-4 h-4" /> Create Group
          </button>
        )}
      </div>

      {!user && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: '#FFF3E0', border: '1.5px solid #E67E22' }}>
          <span className="text-2xl">🔒</span>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Registration Required</p>
            <p className="text-xs" style={{ color: '#555' }}>Register to create groups and join the conversation.</p>
          </div>
          <Link to="/register" className="px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap" style={{ background: '#D95D1A', color: '#fff' }}>
            Register Free →
          </Link>
        </div>
      )}

      <div className="mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search groups…" className="w-full px-4 py-3 rounded-xl border outline-none focus:border-primary/30" style={{ borderColor: '#C99738', background: '#fff' }} />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORY_FILTERS.map((c) => (
          <button key={c} onClick={() => setCategoryFilter(c)} className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all" style={categoryFilter === c ? { background: '#1A1A1A', color: '#fff', border: '1px solid #C99738' } : { background: '#fff', color: '#555', border: '1px solid #C99738' }}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl border border-border h-56 animate-pulse" style={{ background: '#fff' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #C99738' }}>
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#C99738' }} />
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>No groups yet</h3>
          <p className="text-sm" style={{ color: '#555' }}>Be the first to create a group for your community.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              isMember={!!membershipFor(g.id)}
              isOwner={user?.id === g.owner_id}
              joining={joiningId === g.id}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          ))}
        </div>
      )}

      {showCreate && user && (
        <CreateGroupModal user={user} onClose={() => setShowCreate(false)} onCreated={loadData} />
      )}
    </div>
  );
}