import { ACCESSIBILITY_OPTIONS } from '@/lib/accessibility-options';
import { useLanguage } from '@/lib/i18n';

export default function AccessibilityPicker({ selected = [], onChange, label = 'Accessibility Options' }) {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium mb-2 text-muted-foreground">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1.5">
        {ACCESSIBILITY_OPTIONS.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-primary/50'
              }`}
            >
              {isHe ? opt.he : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}