import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Menu, X, ChevronDown } from 'lucide-react';
import NotificationBell from '../NotificationBell';
import RegisterBanner from '../RegisterBanner';

/* ── Top-level links (standalone, shown alongside dropdowns) ── */
const topLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Community', path: '/feed' },
  { label: 'How It Works', path: '/about' },
  { label: 'Urgent Care', path: '/sos' },
];

export default function AppShell() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [footerLinksOpen, setFooterLinksOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    const imgErrorHandler = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('error', imgErrorHandler, true);
    return () => window.removeEventListener('error', imgErrorHandler, true);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const isActive = (path) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const toggleMobileSection = (key) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const dropdowns = [
    {
      label: 'Events',
      items: [
        { label: 'All Events', path: '/events', desc: 'Browse & RSVP to events' },
        { label: 'Creative Workshops', path: '/workshops', desc: 'Share your art, music & craft skills' },
      ],
    },
    {
      label: 'Give',
      items: [
        { label: 'Opportunities', path: '/opportunities', desc: 'Browse & apply for volunteer roles' },
        { label: 'Corporate Volunteering', path: '/corporate', desc: 'Team-building with impact' },
        { label: 'Shabbat & Holidays', path: '/shabbat', desc: 'Host or join a Shabbat or holiday table' },
      ],
    },
    {
      label: 'Receive',
      items: [
        { label: 'Health Support', path: '/health', desc: 'Health & wellness requests' },
        { label: 'Opportunities', path: '/opportunities', desc: 'Find support & services' },
      ],
    },
    {
      label: 'Belong',
      items: [
        { label: 'My Profile', path: '/profile', desc: 'Your volunteer identity' },
        { label: 'Directory', path: '/directory', desc: 'Discover fellow volunteers' },
        { label: 'Community Chat', path: '/chat', desc: 'Group chat with all members' },
        { label: 'Messages', path: '/messages', desc: 'Private conversations' },
        { label: 'Impact', path: '/analytics', desc: 'Track your contribution' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 shadow-md bg-white border-b-2 border-primary" ref={navRef}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg tracking-tight text-foreground">Circles of Giving</span>
              <span className="text-[10px] hidden sm:block text-primary">I Give. I Receive. I Belong. I Grow.</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {topLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                  label === 'Urgent Care' ? 'text-red-500' : (isActive(path) ? 'text-primary' : 'text-muted-foreground')
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="w-px h-5 mx-1 bg-border" />
            {dropdowns.map(({ label, items }) => (
              <div key={label} className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === label ? null : label); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-muted ${openDropdown === label ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === label ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === label && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-xl shadow-xl overflow-hidden z-50 bg-white border border-border">
                    {items.map(({ label: itemLabel, path, desc }) => (
                      <Link
                        key={itemLabel}
                        to={path}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <p className={`text-sm font-semibold ${isActive(path) ? 'text-primary' : 'text-foreground'}`}>{itemLabel}</p>
                        <p className="text-xs mt-0.5 text-muted-foreground">{desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user && <NotificationBell currentUser={user} />}
            {!user ? (
              <Link to="/register" className="hidden sm:inline-flex items-center gap-1 font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity bg-primary text-primary-foreground">
                Register Now →
              </Link>
            ) : (
              <Link to="/profile" className="hidden lg:inline-flex items-center gap-1 font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <span>Profile</span>
              </Link>
            )}
            <button
              className="p-2 rounded-lg hover:bg-muted lg:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border lg:hidden bg-white">
            <div className="px-4 py-2 flex flex-wrap gap-1">
              {topLinks.map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-muted ${
                    label === 'Urgent Care' ? 'text-red-500' : (isActive(path) ? 'text-primary' : 'text-muted-foreground')
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="divide-y divide-border">
              {dropdowns.map(({ label, items }) => (
                <div key={label}>
                  <button
                    onClick={() => toggleMobileSection(label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-primary"
                  >
                    {label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded[label] ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded[label] && (
                    <div className="pb-2 bg-muted/30">
                      {items.map(({ label: itemLabel, path }) => (
                        <Link
                          key={itemLabel}
                          to={path}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-6 py-2.5 text-sm transition-colors hover:bg-muted ${isActive(path) ? 'text-primary font-bold' : 'text-foreground'}`}
                        >
                          {itemLabel}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!user && (
              <div className="px-4 py-3 border-t border-border">
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-center py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground">
                  Register Now →
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {!user && <RegisterBanner />}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-12 bg-foreground text-muted border-t-4 border-primary">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-extrabold text-lg text-primary-foreground">Circles of Giving</span>
            </div>
            <p className="text-sm leading-relaxed text-muted/80">
              A community that brings together people who want to create change and make an impact — through caring, collaboration, and mutual aid.
            </p>
          </div>
          <div>
            <button
              onClick={() => setFooterLinksOpen(!footerLinksOpen)}
              className="flex items-center justify-between w-full font-bold text-sm mb-3 text-primary-foreground"
            >
              Quick Links
              <ChevronDown className={`w-4 h-4 transition-transform ${footerLinksOpen ? 'rotate-180' : ''}`} />
            </button>
            {footerLinksOpen && (
              <ul className="space-y-1.5 text-sm text-muted/80">
                <li><Link to="/feed" className="transition-colors hover:text-primary-foreground">Belong</Link></li>
                <li><Link to="/contact" className="transition-colors hover:text-primary-foreground">Contact</Link></li>
                <li><Link to="/donate" className="transition-colors hover:text-primary-foreground">Donate</Link></li>
                <li><Link to="/events" className="transition-colors hover:text-primary-foreground">Events</Link></li>
                <li><Link to="/opportunities" className="transition-colors hover:text-primary-foreground">Give</Link></li>
                <li><Link to="/sos" className="transition-colors hover:text-primary-foreground">Receive</Link></li>
                <li><Link to="/shabbat" className="transition-colors hover:text-primary-foreground">Shabbat & Holidays</Link></li>
                <li><Link to="/sos" className="transition-colors hover:text-primary-foreground">Urgent</Link></li>
                <li><Link to="/trust" className="transition-colors hover:text-primary-foreground">Trust</Link></li>
                <li><Link to="/health" className="transition-colors hover:text-primary-foreground">Health & Wellness</Link></li>
                <li><Link to="/platform" className="transition-colors hover:text-primary-foreground">Platform Overview</Link></li>
                <li><Link to="/about" className="transition-colors hover:text-primary-foreground">About</Link></li>
                <li><Link to="/sitemap" className="transition-colors hover:text-primary-foreground">Sitemap</Link></li>
              </ul>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-primary-foreground">Contact</h4>
            <ul className="space-y-1.5 text-sm text-muted/80">
              <li>🌐 <a href="https://www.circlesofgiving.org" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary-foreground">circlesofgiving.org</a></li>
              <li>📧 <a href="mailto:info@circlesofgiving.org" className="transition-colors hover:text-primary-foreground">info@circlesofgiving.org</a></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="https://www.facebook.com/circlesofgiving" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-primary-foreground text-muted/80">Facebook</a>
              <a href="https://www.instagram.com/circlesofgiving" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-primary-foreground text-muted/80">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-muted/20 text-center py-4 text-xs space-y-2 text-muted/60">
          <p>© {new Date().getFullYear()} Circles of Giving. All rights reserved.</p>
          <p className="space-x-3">
            <Link to="/privacy" className="transition-colors hover:text-primary-foreground">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="transition-colors hover:text-primary-foreground">Terms of Use</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}