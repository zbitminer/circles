import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Home, Calendar, Briefcase, User, Shield, Menu, X, Users, Flame, AlertTriangle, UtensilsCrossed, Building2, MessageSquare, BarChart3, Heart } from 'lucide-react';
import NotificationBell from './NotificationBell';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/feed', label: 'Feed', icon: Flame },
  { path: '/sos', label: 'SOS Board', icon: AlertTriangle },
  { path: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/shabbat', label: 'Shabbat Meals', icon: UtensilsCrossed },
  { path: '/directory', label: 'Directory', icon: Users },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/health', label: 'Health Support', icon: Heart },
  { path: '/analytics', label: 'Impact', icon: BarChart3 },
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
      <header className="sticky top-0 z-50 shadow-md" style={{ background: '#1A1A1A', borderBottom: '2px solid #D95D1A' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/81e1a6354_Untitled1000x1000px.png" alt="Circles of Giving" className="w-9 h-9 rounded-full object-contain bg-white p-0.5" />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg tracking-tight text-white">Circles of Giving</span>
              <span className="text-[10px] hidden sm:block" style={{ color: '#D95D1A' }}>I Give. I Receive. I Belong. I Grow.</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user && <NotificationBell currentUser={user} />}
            {!user && (
              <Link to="/register" className="hidden sm:inline-flex items-center gap-1 font-bold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity" style={{ background: '#D95D1A', color: '#fff' }}>
                Register Now →
              </Link>
            )}
            <button
              className="p-2 rounded-lg hover:bg-white/10 text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Dropdown Nav */}
        {mobileOpen && (
          <div className="border-t px-4 py-3 flex flex-col gap-1" style={{ background: '#1A1A1A', borderColor: '#333' }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-white/10"
                style={{ color: location.pathname === path ? '#D95D1A' : '#ccc' }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {isMod && (
              <Link to="/moderation" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10" style={{ color: '#ccc' }}>
                <Shield className="w-4 h-4" /> Moderate
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10" style={{ color: '#ccc' }}>
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
      <footer className="mt-12" style={{ background: '#1A1A1A', borderTop: '3px solid #D95D1A' }}>
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/81e1a6354_Untitled1000x1000px.png" alt="Circles of Giving" className="w-8 h-8 rounded-full object-contain bg-white p-0.5" />
              <span className="font-extrabold text-lg text-white">Circles of Giving</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#999' }}>
              A community that brings together people who want to create change and make an impact — through caring, collaboration, and mutual aid.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-sm mb-3" style={{ color: '#D95D1A' }}>Quick Links</h4>
            <ul className="space-y-1.5 text-sm" style={{ color: '#999' }}>
              <li><a href="/opportunities" className="transition-colors hover:text-white">Volunteer Opportunities</a></li>
              <li><a href="/events" className="transition-colors hover:text-white">Events</a></li>
              <li><a href="/sos" className="transition-colors hover:text-white">SOS Urgent Board</a></li>
              <li><a href="/shabbat" className="transition-colors hover:text-white">Shabbat & Holiday Meals</a></li>
              <li><a href="/corporate" className="transition-colors hover:text-white">Corporate Volunteering</a></li>
              <li><a href="/health" className="transition-colors hover:text-white">Health Support</a></li>
              <li><a href="/contact" className="transition-colors hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-3" style={{ color: '#D95D1A' }}>Contact</h4>
            <ul className="space-y-1.5 text-sm" style={{ color: '#999' }}>
              <li>🌐 <a href="https://www.circlesofgiving.org" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">circlesofgiving.org</a></li>
              <li>📧 <a href="mailto:info@circlesofgiving.org" className="transition-colors hover:text-white">info@circlesofgiving.org</a></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="https://www.facebook.com/circlesofgiving" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: '#777' }}>Facebook</a>
              <a href="https://www.instagram.com/circlesofgiving" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: '#777' }}>Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t text-center py-4 text-xs space-y-2" style={{ borderColor: '#333', color: '#555' }}>
          <p>© {new Date().getFullYear()} Circles of Giving. All rights reserved.</p>
          <p className="space-x-3">
            <a href="/privacy" className="transition-colors hover:text-white">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="transition-colors hover:text-white">Terms of Use</a>
          </p>
        </div>
      </footer>
    </div>
  );
}