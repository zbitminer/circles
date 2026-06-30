import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Info, CheckCircle, AlertTriangle, AlertOctagon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STYLES = {
  info: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-300 dark:border-blue-800', icon: Info, iconColor: 'text-blue-500' },
  success: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-300 dark:border-green-800', icon: CheckCircle, iconColor: 'text-green-500' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-800', icon: AlertTriangle, iconColor: 'text-amber-500' },
  urgent: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-300 dark:border-red-800', icon: AlertOctagon, iconColor: 'text-red-500' },
};

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cog-dismissed-announcements') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    base44.entities.Announcement.filter({ is_active: true }, 'sort_order', 10)
      .then((data) => setAnnouncements(data || []))
      .catch(() => {});
  }, []);

  const visible = announcements.filter(a => !dismissed.includes(a.id));

  const dismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('cog-dismissed-announcements', JSON.stringify(updated));
  };

  if (visible.length === 0) return null;

  return (
    <div className="space-y-0">
      {visible.map((a) => {
        const style = STYLES[a.type] || STYLES.info;
        const Icon = style.icon;
        return (
          <div key={a.id} className={`${style.bg} ${style.border} border-b px-4 py-3`}>
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <Icon className={`w-4 h-4 ${style.iconColor} flex-shrink-0`} />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-semibold text-sm text-foreground">{a.title}</span>
                <span className="text-sm text-muted-foreground">{a.message}</span>
                {a.link_url && (
                  <Link to={a.link_url} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline whitespace-nowrap">
                    {a.link_label || 'Learn more'} <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              {a.dismissable !== false && (
                <button onClick={() => dismiss(a.id)} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 flex-shrink-0">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}