import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Home, Calendar, Briefcase, User, Shield, Menu, X, Users, Flame, AlertTriangle, UtensilsCrossed, Building2 } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/feed', label: 'Feed', icon: Flame },
  { path: '/sos', label: '🆘 SOS Board', icon: AlertTriangle },
  { path: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/shabbat', label: 'Shabbat Meals', icon: UtensilsCrossed },
  { path: '/directory', label: 'Directory', icon: Users },
  { path: '/corporate', label: 'For Businesses', icon: Building2 },
  { path: '/profile', label: 'My Profile', icon: User },
];

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isAdmin = user?.role === 'admin';
  const isMod = user?.role === 'moderator' || isAdmin;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/81e1a6354_Untitled1000x1000px.png" alt="Circles of Giving" className="w-9 h-9 rounded-full object-contain bg-white/10" />
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg tracking-tight">Circles of Giving</span>
              <span className="text-primary-foreground/60 text-xs font-body hidden sm:block">I Give. I Receive. I Belong. I Grow.</span>
            </div>
          </Link>

          <button
            className="p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dropdown Nav */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-primary px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === path
                    ? 'bg-accent text-white'
                    : 'text-primary-foreground/80 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {isMod && (
              <Link to="/moderation" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/80 hover:bg-white/10">
                <Shield className="w-4 h-4" /> Moderate
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/80 hover:bg-white/10">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>


    </div>
  );
}