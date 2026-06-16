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
      <header className="sticky top-0 z-50 shadow-lg" style={{ background: 'linear-gradient(180deg, #1A2744 0%, #0f1a30 100%)', borderBottom: '2px solid #C9A84C' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/81e1a6354_Untitled1000x1000px.png" alt="Circles of Giving" className="w-9 h-9 rounded-full object-contain" style={{ border: '1px solid #C9A84C' }} />
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg tracking-tight" style={{ color: '#F5E6C0' }}>Circles of Giving</span>
              <span className="text-xs font-body hidden sm:block" style={{ color: '#C9A84C' }}>I Give. I Receive. I Belong. I Grow.</span>
            </div>
          </Link>

          <button
            className="p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: '#F5E6C0' }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dropdown Nav */}
        {mobileOpen && (
          <div className="border-t px-4 py-3 flex flex-col gap-1" style={{ background: '#1A2744', borderColor: '#C9A84C' }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-white/10"
                style={{ color: location.pathname === path ? '#C9A84C' : '#F5E6C0' }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {isMod && (
              <Link to="/moderation" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10" style={{ color: '#F5E6C0' }}>
                <Shield className="w-4 h-4" /> Moderate
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10" style={{ color: '#F5E6C0' }}>
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-12" style={{ background: 'linear-gradient(180deg, #1A2744 0%, #0f1a30 100%)', borderTop: '2px solid #C9A84C', color: '#F5E6C0' }}>
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/81e1a6354_Untitled1000x1000px.png" alt="Circles of Giving" className="w-8 h-8 rounded-full object-contain" style={{ border: '1px solid #C9A84C' }} />
              <span className="font-display font-bold text-lg" style={{ color: '#F5E6C0' }}>Circles of Giving</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#C9A84C', opacity: 0.8 }}>
              A community that brings together people who want to create change and make an impact — through caring, collaboration, and mutual aid.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#C9A84C' }}>Quick Links</h4>
            <ul className="space-y-1.5 text-sm" style={{ color: 'rgba(245,230,192,0.75)' }}>
              <li><a href="/opportunities" className="transition-colors hover:opacity-100" style={{ color: 'inherit' }}>Volunteer Opportunities</a></li>
              <li><a href="/events" className="transition-colors" style={{ color: 'inherit' }}>Events</a></li>
              <li><a href="/sos" className="transition-colors" style={{ color: 'inherit' }}>SOS Urgent Board</a></li>
              <li><a href="/shabbat" className="transition-colors" style={{ color: 'inherit' }}>Shabbat & Holiday Meals</a></li>
              <li><a href="/corporate" className="transition-colors" style={{ color: 'inherit' }}>Corporate Volunteering</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#C9A84C' }}>Contact</h4>
            <ul className="space-y-1.5 text-sm" style={{ color: 'rgba(245,230,192,0.75)' }}>
              <li>🌐 <a href="https://www.circlesofgiving.org" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: 'inherit' }}>circlesofgiving.org</a></li>
              <li>📧 <a href="mailto:info@circlesofgiving.org" className="transition-colors" style={{ color: 'inherit' }}>info@circlesofgiving.org</a></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="https://www.facebook.com/circlesofgiving" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: 'rgba(245,230,192,0.6)' }}>Facebook</a>
              <a href="https://www.instagram.com/circlesofgiving" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: 'rgba(245,230,192,0.6)' }}>Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t text-center py-4 text-xs space-y-2" style={{ borderColor: 'rgba(201,168,76,0.3)', color: 'rgba(245,230,192,0.4)' }}>
          <p>© {new Date().getFullYear()} Circles of Giving. All rights reserved.</p>
          <p><a href="/privacy" className="transition-colors hover:text-opacity-100" style={{ color: 'inherit' }}>Privacy Policy</a></p>
        </div>
      </footer>
    </div>
  );
}