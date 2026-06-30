import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Menu, X, ChevronDown } from 'lucide-react';
import NotificationBell from '../NotificationBell';
import RegisterBanner from '../RegisterBanner';

/* ── Top-level links (standalone, shown alongside dropdowns) ── */
const topLinks = [
  { label: 'Home', path: '/' },
  { label: 'How It Works', path: '/about' },
  { label: 'Events', path: '/events' },
  { label: 'Our Community', path: '/feed' },
  { label: 'Volunteers', path: '/directory' },
];

export default function AppShell() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const navRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    // Prevent img load errors from reaching the vite preview error handler
    // (DOM nodes in the error event cause DataCloneError on postMessage)
    const imgErrorHandler = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('error', imgErrorHandler, true);
    return () => window.removeEventListener('error', imgErrorHandler, true);
  }, []);

  // Close desktop dropdown when clicking outside
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

  const isAdmin = user?.role === 'admin';
  const isMod = isAdmin || user?.role === 'moderator';

  /* ── Dropdown definitions (role-aware) ── */
  const dropdowns = [
    {
      label: 'Give',
      items: [
        { label: 'Opportunities', path: '/opportunities', desc: 'Browse & apply for volunteer roles' },
        { label: 'Creative Workshops', path: '/opportunities?category=Creative Workshops', desc: 'Share your art, music & craft skills' },
        { label: 'Corporate Volunteering', path: '/corporate', desc: 'Team-building with impact' },
        { label: 'Shabbat & Holidays', path: '/shabbat', desc: 'Host or join a Shabbat or holiday table' },
      ],
    },
    {
      label: 'Receive',
      items: [
        { label: 'Urgent', path: '/sos', desc: 'Urgent requests for help' },
        { label: 'Health Support', path: '/health', desc: 'Health & wellness requests' },
        { label: 'Opportunities', path: '/opportunities', desc: 'Find support & services' },
      ],
    },
    {
      label: 'Belong',
      items: [
        { label: 'My Profile', path: '/profile', desc: 'Your volunteer identity' },
        { label: 'Directory', path: '/directory', desc: 'Discover fellow volunteers' },
        { label: 'Messages', path: '/messages', desc: 'Private conversations' },
        { label: 'Impact', path: '/analytics', desc: 'Track your contribution' },
        ...(isMod ? [{ label: 'Moderation', path: '/moderation', desc: 'Review reported content' }] : []),
        ...(isAdmin ? [{ label: 'Admin Panel', path: '/admin', desc: 'Manage platform settings' }] : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ═══ Top Nav ═══ */}
      <header className="sticky top-0 z-50 shadow-md" style={{ background: '#1A1A1A', borderBottom: '2px solid #D95D1A' }} ref={navRef}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/81e1a6354_Untitled1000x1000px.png" alt="Circles of Giving" className="w-9 h-9 rounded-full object-contain bg-white p-0.5" />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg tracking-tight text-white">Circles of Giving</span>
              <span className="text-[10px] hidden sm:block" style={{ color: '#D95D1A' }}>I Give. I Receive. I Belong. I Grow.</span>
            </div>
          </Link>

          {/* Desktop: top-level links + dropdowns */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {topLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white"
                style={{ color: isActive(path) ? '#D95D1A' : '#aaa' }}
              >
                {label}
              </Link>
            ))}
            <div className="w-px h-5 mx-1" style={{ background: '#333' }} />
            {dropdowns.map(({ label, items }) => (
              <div key={label} className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === label ? null : label); }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:text-white"
                  style={{ color: openDropdown === label ? '#D95D1A' : '#aaa' }}
                >
                  {label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === label ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === label && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-xl shadow-2xl overflow-hidden z-50" style={{ background: '#1A1A1A', border: '1px solid #333' }}>
                    {items.map(({ label: itemLabel, path, desc }) => (
                      <Link
                        key={itemLabel}
                        to={path}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <p className="text-sm font-semibold" style={{ color: isActive(path) ? '#D95D1A' : '#ddd' }}>{itemLabel}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#777' }}>{desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && <NotificationBell currentUser={user} />}
            {!user ? (
              <Link to="/register" className="hidden sm:inline-flex items-center gap-1 font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity" style={{ background: '#D95D1A', color: '#fff' }}>
                Register Now →
              </Link>
            ) : (
              <Link to="/profile" className="hidden lg:inline-flex items-center gap-1 font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors hover:text-white" style={{ color: '#aaa' }}>
                <span>Profile</span>
              </Link>
            )}
            <button
              className="p-2 rounded-lg hover:bg-white/10 lg:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ═══ Mobile dropdown ═══ */}
        {mobileOpen && (
          <div className="border-t lg:hidden" style={{ background: '#1A1A1A', borderColor: '#333' }}>
            {/* Top links */}
            <div className="px-4 py-2 flex flex-wrap gap-1">
              {topLinks.map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/10"
                  style={{ color: isActive(path) ? '#D95D1A' : '#aaa' }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Dropdown sections */}
            <div className="divide-y" style={{ borderColor: '#333' }}>
              {dropdowns.map(({ label, items }) => (
                <div key={label}>
                  <button
                    onClick={() => toggleMobileSection(label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
                    style={{ color: '#D95D1A' }}
                  >
                    {label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded[label] ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded[label] && (
                    <div className="pb-2">
                      {items.map(({ label: itemLabel, path }) => (
                        <Link
                          key={itemLabel}
                          to={path}
                          onClick={() => setMobileOpen(false)}
                          className="block px-6 py-2.5 text-sm transition-colors hover:bg-white/5"
                          style={{ color: isActive(path) ? '#D95D1A' : '#bbb' }}
                        >
                          {itemLabel}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Register CTA */}
            {!user && (
              <div className="px-4 py-3 border-t" style={{ borderColor: '#333' }}>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-center py-3 rounded-xl font-bold text-sm" style={{ background: '#D95D1A', color: '#fff' }}>
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

      {/* ═══ Footer ═══ */}
      <footer className="mt-12" style={{ background: '#1A1A1A', borderTop: '3px solid #D95D1A' }}>
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/81e1a6354_Untitled1000x1000px.png" alt="Circles of Giving" className="w-8 h-8 rounded-full object-contain bg-white p-0.5" />
              <span className="font-extrabold text-lg text-white">Circles of Giving</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#999' }}>
              A community that brings together people who want to create change and make an impact — through caring, collaboration, and mutual aid.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3" style={{ color: '#D95D1A' }}>Quick Links</h4>
            <ul className="space-y-1.5 text-sm" style={{ color: '#999' }}>
              <li><Link to="/feed" className="transition-colors hover:text-white">Belong</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">Contact</Link></li>
              <li><Link to="/donate" className="transition-colors hover:text-white">Donate</Link></li>
              <li><Link to="/events" className="transition-colors hover:text-white">Events</Link></li>
              <li><Link to="/opportunities" className="transition-colors hover:text-white">Give</Link></li>
              <li><Link to="/sos" className="transition-colors hover:text-white">Receive</Link></li>
              <li><Link to="/shabbat" className="transition-colors hover:text-white">Shabbat & Holidays</Link></li>
              <li><Link to="/sos" className="transition-colors hover:text-white">Urgent</Link></li>
              <li><Link to="/trust" className="transition-colors hover:text-white">Trust</Link></li>
              <li><Link to="/health" className="transition-colors hover:text-white">Health & Wellness</Link></li>
              <li><Link to="/platform" className="transition-colors hover:text-white">Platform Overview</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-white">About</Link></li>
              <li><Link to="/sitemap" className="transition-colors hover:text-white">Sitemap</Link></li>
            </ul>
          </div>
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
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="transition-colors hover:text-white">Terms of Use</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}