import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const CATEGORIES = [
  {
    label: 'Arts & Crafts',
    emoji: '🎨',
    subcategories: ['Drawing & Painting', 'Handcraft', 'Flower Arranging', 'Jewelry Making', 'Knitting'],
  },
  {
    label: 'Music',
    emoji: '🎵',
    subcategories: ['Music Lesson', 'Playing Session', 'Performance', 'Reading Notes'],
  },
  {
    label: 'Personal Development',
    emoji: '💪',
    subcategories: ['Meditation/Mindfulness', 'Motivation', 'Personal Empowerment', 'Goal Setting'],
  },
  {
    label: 'Languages',
    emoji: '🗣️',
    subcategories: ['Hebrew', 'English', 'Spanish', 'Other'],
  },
  {
    label: 'Health & Wellness',
    emoji: '🌿',
    subcategories: ['Nutrition', 'Yoga/Exercise', 'Holistic Health', 'Talking Therapies'],
  },
  {
    label: 'Cooking',
    emoji: '🍳',
    subcategories: ['Holiday Foods', 'Baking', 'Healthy Cooking', 'World Cuisine', 'Vegetarian'],
  },
  {
    label: 'Support Groups',
    emoji: '🤝',
    subcategories: ['Grief Support', 'Parenting', 'Wellness Circles', 'Addiction Recovery'],
  },
  {
    label: 'Other',
    emoji: '✨',
    subcategories: ['Books', 'Lectures', 'Torah Study', 'Gardening', 'Miscellaneous'],
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
          {CATEGORIES.map(({ label, emoji, subcategories }) =>
            subcategories.map(sub => {
              const isActive = selected?.category === label && selected?.subcategory === sub;
              return (
                <button
                  key={`${label}-${sub}`}
                  onClick={() => handleSelect({ category: label, subcategory: sub, emoji })}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted flex items-center gap-2"
                  style={{
                    color: isActive ? '#D95D1A' : '#555',
                    background: isActive ? '#FFF8F0' : 'transparent',
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  <span>{emoji}</span>
                  <span>{sub}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}