export default function BadgeDisplay({ badges = [] }) {
  if (badges.length === 0) return null;
  
  return (
    <div>
      <p className="font-semibold text-sm mb-3" style={{ color: '#1A2744' }}>Achievements</p>
      <div className="grid grid-cols-4 gap-3">
        {badges.map(badge => (
          <div key={badge.id} className="text-center group">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
              style={{ background: '#f0e8d0', border: '2px solid #C9A84C' }}
            >
              {badge.icon_emoji}
            </div>
            <p className="text-xs mt-1 font-semibold" style={{ color: '#1A2744' }}>{badge.label}</p>
            <div className="hidden group-hover:block absolute bg-gray-800 text-white text-xs rounded px-2 py-1 mt-1 z-10 whitespace-nowrap">
              {badge.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}