import { WORKSHOP_CATEGORIES } from '@/lib/workshop-categories';

export default function WorkshopCategoryGrid({ selected = [], onToggle }) {
  const toggle = (label) => {
    if (selected.includes(label)) {
      onToggle(selected.filter((s) => s !== label));
    } else {
      onToggle([...selected, label]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {WORKSHOP_CATEGORIES.map(({ label, emoji, image, subcategories }) => (
        <div key={label} className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #C9A84C' }}>
          {image && (
            <div className="h-24 w-full overflow-hidden">
              <img src={image} alt={label} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          <div className="p-4">
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#1A2744' }}>
            <span className="text-base">{emoji}</span> {label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {subcategories.map((sub) => {
              const value = `${label} › ${sub}`;
              const active = selected.includes(value);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggle(value)}
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
        </div>
      ))}
    </div>
  );
}