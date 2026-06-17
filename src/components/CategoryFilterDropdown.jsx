import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const CATEGORIES = [
  {
    label: 'Companionship',
    emoji: '🤝',
    subcategories: ['Visiting', 'Outing', 'Escort', 'Calls'],
  },
  {
    label: 'Education & Learning',
    emoji: '📚',
    subcategories: ['In Person/Zoom', 'Health Teach', 'Language', 'Arts/Music', 'Cooking', 'Torah', 'Health Wellness'],
  },
  {
    label: 'Food',
    emoji: '🍲',
    subcategories: ['Meal Preparation', 'Challah Baking', 'Recipes', 'Diet Delivery'],
  },
  {
    label: 'Home',
    emoji: '🏠',
    subcategories: ['Daily Chores & Tasks', 'Organization', 'Repairs/Maintenance', 'Garden', 'Skill Share'],
  },
  {
    label: 'Technology',
    emoji: '💻',
    subcategories: ['Computer/Phone', 'Appointments', 'Digital Forms', 'Translation', 'Real Time Support'],
  },
  {
    label: 'Transportation',
    emoji: '🚗',
    subcategories: ['Medical', 'Errands', 'Deliveries'],
  },
];

export default function CategoryFilterDropdown({ selected, onSelect, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSelect = (selection) => {
    onSelect(selection);
    setOpen(false);
  };

  const clearFilter = (e) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition-all"
        style={{
          background: selected ? '#FAF7EE' : '#fff',
          borderColor: selected ? '#C9A84C' : '#e0e0e0',
          color: selected ? '#1A2744' : '#555',
        }}
      >
        <span>
          {selected
            ? `${selected.emoji} ${selected.category} › ${selected.subcategory}`
            : 'Filter by category…'}
        </span>
        {selected ? (
          <X className="w-4 h-4 hover:text-red-500" onClick={clearFilter} />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-72 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
          style={{ background: '#fff', border: '1px solid #e0e0e0' }}
        >
          {CATEGORIES.map(({ label, emoji, subcategories }) => (
            <div key={label}>
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#C9A84C', background: '#FAF7EE' }}>
                {emoji} {label}
              </div>
              {subcategories.map(sub => {
                const isActive = selected?.category === label && selected?.subcategory === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => handleSelect({ category: label, subcategory: sub, emoji })}
                    className="w-full text-left px-6 py-2 text-sm transition-colors hover:bg-muted"
                    style={{
                      color: isActive ? '#D95D1A' : '#555',
                      background: isActive ? '#FFF8F0' : 'transparent',
                      fontWeight: isActive ? '600' : '400',
                    }}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}