import { X } from 'lucide-react';

const CATEGORIES = [
  {
    label: 'Companionship',
    emoji: '🤝',
    subcategories: ['Visiting', 'Outing', 'Escort', 'Calls'],
  },
  {
    label: 'Food',
    emoji: '🍲',
    subcategories: ['Baking', 'Delivery', 'Meal Preparation', 'Recipes'],
  },
  {
    label: 'Home',
    emoji: '🏠',
    subcategories: ['Daily Tasks', 'Garden', 'Organizing', 'Repairs'],
  },
  {
    label: 'Skill Sharing',
    emoji: '📚',
    subcategories: ['Arts/Music', 'Cooking', 'Language', 'Torah'],
  },
  {
    label: 'Technology',
    emoji: '💻',
    subcategories: ['Appointments', 'Computer Phone', 'Digital Forms', 'Real Time Support', 'Translation'],
  },
  {
    label: 'Transportation',
    emoji: '🚗',
    subcategories: ['Deliveries', 'Errands', 'Medical'],
  },
];

export default function CategorySearchFilters({ selectedFilter, onSelectFilter, className = '' }) {
  const isSelected = (cat, sub) =>
    selectedFilter?.category === cat && selectedFilter?.subcategory === sub;

  const handleClick = (cat, sub, emoji) => {
    if (isSelected(cat, sub)) {
      onSelectFilter(null);
    } else {
      onSelectFilter({ category: cat, subcategory: sub, emoji });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {selectedFilter && (
        <button
          onClick={() => onSelectFilter(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #1A2744' }}
        >
          {selectedFilter.emoji} {selectedFilter.category} › {selectedFilter.subcategory}
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORIES.map(({ label, emoji, subcategories }) => (
          <div key={label}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#1A2744' }}>
              {emoji} {label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {subcategories.map(sub => {
                const active = isSelected(label, sub);
                return (
                  <button
                    key={sub}
                    onClick={() => handleClick(label, sub, emoji)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                    style={
                      active
                        ? { background: '#1A2744', color: '#F5E6C0', border: '1px solid #1A2744' }
                        : { background: '#FAF7EE', color: '#6b5c3e', border: '1px solid #C9A84C' }
                    }
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}