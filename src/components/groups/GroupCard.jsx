import { Users, Lock, Globe, Check } from 'lucide-react';

const categoryEmoji = {
  Companionship: '🤝', Food: '🍲', Home: '🏠', 'Skill Sharing': '📚',
  Technology: '💻', Transportation: '🚗', Wellness: '🌿', Other: '✨',
};

export default function GroupCard({ group, isMember, isOwner, onJoin, onLeave, onOpen, joining }) {
  return (
    <div
      className="rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col"
      style={{ background: '#fff', border: '1.5px solid #C99738', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <button onClick={() => onOpen?.(group)} className="text-left">
        <div
          className="h-28 w-full bg-cover bg-center flex items-end p-3"
          style={{
            backgroundImage: group.cover_image ? `url(${group.cover_image})` : 'none',
            background: group.cover_image ? undefined : 'linear-gradient(135deg, #1A1A1A, #444)',
          }}
        >
          <span className="text-2xl">{categoryEmoji[group.category] || '✨'}</span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold flex-1" style={{ color: '#1A1A1A' }}>{group.name}</h3>
            {group.privacy === 'private'
              ? <Lock className="w-3.5 h-3.5" style={{ color: '#888' }} />
              : <Globe className="w-3.5 h-3.5" style={{ color: '#888' }} />}
          </div>
          <p className="text-xs line-clamp-2 mb-3" style={{ color: '#555' }}>{group.description || 'No description yet.'}</p>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
            <Users className="w-3.5 h-3.5" style={{ color: '#C99738' }} />
            {group.member_count || 0} {group.member_count === 1 ? 'member' : 'members'}
          </div>
        </div>
      </button>
      <div className="px-4 pb-4 mt-auto">
        {isOwner ? (
          <button disabled className="w-full py-2 text-sm font-semibold rounded-xl" style={{ background: 'rgba(201,151,56,0.12)', color: '#555' }}>
            You own this group
          </button>
        ) : isMember ? (
          <button onClick={() => onLeave(group)} disabled={joining} className="w-full py-2 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60" style={{ background: '#fff', color: '#c0392b', border: '1px solid #c0392b' }}>
            <Check className="w-3.5 h-3.5 inline mr-1" /> Joined — Leave
          </button>
        ) : (
          <button onClick={() => onJoin(group)} disabled={joining} className="w-full py-2 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60" style={{ background: '#1A1A1A', color: '#fff', border: '1px solid #C99738' }}>
            {joining ? 'Joining…' : 'Join Group'}
          </button>
        )}
      </div>
    </div>
  );
}