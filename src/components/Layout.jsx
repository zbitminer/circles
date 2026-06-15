import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Home, Search, Calendar, Briefcase, User, Shield, Menu, X, Heart } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Feed', icon: Home },
  { path: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { path: '/events', label: 'Events', icon: Calendar },
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
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">VolunteerHub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-accent text-white'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {isMod && (
              <Link
                to="/moderation"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/moderation'
                    ? 'bg-accent text-white'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                Moderate
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/admin'
                    ? 'bg-accent text-white'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-primary px-4 py-3 flex flex-col gap-1">
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground border-t border-white/10 flex z-50">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-all ${
              location.pathname === path ? 'text-accent' : 'text-primary-foreground/60'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}