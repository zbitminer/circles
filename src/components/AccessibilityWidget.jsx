import { useState, useEffect } from 'react';
import { Accessibility, X, RotateCcw, Type, Contrast, Link2, PauseCircle, AlignJustify } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const STORAGE_KEY = 'cog_a11y_prefs';

const DEFAULT_PREFS = {
  fontScale: 100, // 100 | 112 | 125
  highContrast: false,
  highlightLinks: false,
  readableSpacing: false,
  pauseAnimations: false,
};

export default function AccessibilityWidget() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${prefs.fontScale}%`;
    root.classList.toggle('a11y-high-contrast', prefs.highContrast);
    root.classList.toggle('a11y-highlight-links', prefs.highlightLinks);
    root.classList.toggle('a11y-readable-spacing', prefs.readableSpacing);
    root.classList.toggle('a11y-pause-animations', prefs.pauseAnimations);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  const activeCount =
    (prefs.fontScale !== 100 ? 1 : 0) +
    (prefs.highContrast ? 1 : 0) +
    (prefs.highlightLinks ? 1 : 0) +
    (prefs.readableSpacing ? 1 : 0) +
    (prefs.pauseAnimations ? 1 : 0);

  return (
    <div className={`fixed ${open ? 'z-[60]' : 'z-40'} bottom-[calc(4.75rem+var(--safe-area-bottom,0px))] md:bottom-6 ${isHe ? 'right-4 sm:right-6' : 'left-4 sm:left-6'}`}>
      {open && (
        <div
          role="dialog"
          aria-label={isHe ? 'הגדרות נגישות' : 'Accessibility Settings'}
          className="mb-3 w-72 rounded-2xl p-4 shadow-2xl border border-primary bg-card text-card-foreground"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">
                {isHe ? 'תפריט נגישות' : 'Accessibility'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={isHe ? 'סגור' : 'Close'}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Font size */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-1.5 text-muted-foreground">
              <Type className="w-3.5 h-3.5 text-primary" />
              {isHe ? 'גודל טקסט' : 'Text Size'}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: 100, label: '100%' },
                { val: 112, label: '115%' },
                { val: 125, label: '130%' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, fontScale: opt.val }))}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    prefs.fontScale === opt.val
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground border-border'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-1.5">
            {[
              {
                key: 'highContrast',
                icon: Contrast,
                en: 'High Contrast',
                he: 'ניגודיות גבוהה',
              },
              {
                key: 'highlightLinks',
                icon: Link2,
                en: 'Highlight Links',
                he: 'הדגשת קישורים',
              },
              {
                key: 'readableSpacing',
                icon: AlignJustify,
                en: 'Extra Line Spacing',
                he: 'ריווח שורות מוגדל',
              },
              {
                key: 'pauseAnimations',
                icon: PauseCircle,
                en: 'Pause Animations',
                he: 'עצירת אנימציות',
              },
            ].map(({ key, icon: Icon, en, he }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  prefs[key]
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/60 text-foreground border-border hover:bg-muted'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {isHe ? he : en}
                </span>
                <span>{prefs[key] ? '✓' : ''}</span>
              </button>
            ))}
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setPrefs(DEFAULT_PREFS)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isHe ? 'איפוס הגדרות' : 'Reset Accessibility'}
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={isHe ? 'פתח תפריט נגישות' : 'Open Accessibility Menu'}
        title={isHe ? 'נגישות' : 'Accessibility'}
        className="relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-brand-950 text-white border-2 border-primary hover:scale-105 transition-transform"
      >
        <Accessibility className="w-6 h-6" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
}