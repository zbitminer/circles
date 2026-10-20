import { Link, useLocation } from 'react-router-dom';
import { Home, Rss, AlertTriangle, GraduationCap, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const TABS = [
  { label: 'Home', path: '/', Icon: Home },
  { label: 'Feed', path: '/feed', Icon: Rss },
  { label: 'S.O.S', path: '/sos', Icon: AlertTriangle, urgent: true },
  { label: 'Workshops', path: '/workshops', Icon: GraduationCap },
  { label: 'Profile', path: '/profile', Icon: User },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  return (
    <nav
      role="tablist"
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-brand-950 text-brand-50 border-t-2 border-primary shadow-lg select-none"
      style={{ paddingBottom: 'var(--safe-area-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 h-16">
        {TABS.map(({ label, path, Icon, urgent }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              role="tab"
              aria-selected={active}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                active
                  ? 'text-brand-300'
                  : urgent
                  ? 'text-destructive'
                  : 'text-brand-50/70 hover:text-brand-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className="truncate max-w-full px-1">{t(label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}